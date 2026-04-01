import { NextResponse } from "next/server"

const GOOGLE_PLACES_ENDPOINT = "https://places.googleapis.com/v1/places:searchText"
const GOOGLE_PLACE_DETAILS_ENDPOINT = "https://places.googleapis.com/v1"
const SERPAPI_ENDPOINT = "https://serpapi.com/search.json"

/** Tipos genéricos do Google que não descrevem o nicho do negócio */
const GENERIC_GOOGLE_PLACE_TYPES = new Set([
  "establishment",
  "point_of_interest",
  "premise",
  "subpremise",
  "geocode",
])

interface GooglePlace {
  displayName?: { text?: string }
  formattedAddress?: string
  rating?: number
  userRatingCount?: number
  /** Categoria principal (Places API New) */
  primaryType?: string
  /** Lista de tipos do lugar */
  types?: string[]
  addressComponents?: Array<{
    longText?: string
    shortText?: string
    types?: string[]
  }>
}

interface GoogleApiErrorResponse {
  error?: {
    message?: string
    status?: string
    code?: number
  }
}

interface ResolvedSearchInput {
  searchText: string
  placeId?: string
}

interface KeywordRanking {
  keyword: string
  position: number | null
  previousPosition: number | null
  searchVolume: string
}

type SerpStatus = "ok" | "api_unavailable" | "not_configured"

interface SerpRankingResult extends KeywordRanking {
  requestOk: boolean
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
}

/**
 * Decodifica o segmento do path após /place/: trata + como espaço e aplica decodeURIComponent com segurança.
 * Ex.: "Restaurante+Sabor" → "Restaurante Sabor"
 */
function decodePlaceSlug(raw: string): string {
  if (!raw) return ""
  let s = raw.trim()
  s = s.replace(/\+/g, " ")
  try {
    s = decodeURIComponent(s)
  } catch {
    /* segmento com % inválido */
  }
  try {
    if (/%[0-9A-Fa-f]{2}/.test(s)) {
      const again = decodeURIComponent(s)
      if (again !== s) s = again
    }
  } catch {
    /* ignore */
  }
  return s.replace(/\s+/g, " ").trim()
}

/**
 * Captura o nome/local após /place/ na URL final (inclui /maps/place/...).
 * O slug vai até o próximo /, ? ou # (evita engolir segmentos como /@lat,lng).
 */
function tryExtractNameFromUrlPath(input: URL): string | null {
  const pathAndQuery = `${input.pathname}${input.search ?? ""}`

  const placePatterns: RegExp[] = [
    /\/maps\/place\/([^/?#]+)/i,
    /\/place\/([^/?#]+)/i,
  ]

  for (const re of placePatterns) {
    const m = pathAndQuery.match(re)
    if (!m?.[1]) continue

    let segment = m[1]
    // Se o slug vier colado com @lat,lng no mesmo segmento (URLs atípicas), corta antes do @
    const atSplit = segment.indexOf("@")
    if (atSplit > 0 && /^@?-?\d/.test(segment.slice(atSplit))) {
      segment = segment.slice(0, atSplit)
    }

    const decoded = decodePlaceSlug(segment)
    if (decoded) return decoded
  }

  return null
}

/** Tenta obter termo de busca a partir de parâmetros comuns em links do Google Maps */
function tryExtractQueryFromSearchParams(input: URL): string | null {
  const candidates = ["q", "query", "ftid"]
  for (const key of candidates) {
    const v = input.searchParams.get(key)
    if (v?.trim()) {
      return decodePlaceSlug(v)
    }
  }
  return null
}

/** Se a URL for intermediária (ex.: /url?q=...), tenta extrair o destino real */
function tryUnwrapGoogleRedirectUrl(url: URL): URL {
  try {
    if (url.pathname.includes("/url") && url.searchParams.has("q")) {
      const inner = url.searchParams.get("q")
      if (inner?.startsWith("http")) {
        return new URL(inner)
      }
    }
  } catch {
    /* ignore */
  }
  return url
}

function tryExtractCoordinatesFromUrl(input: URL) {
  const atMatch = input.pathname.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
  if (atMatch?.[1] && atMatch?.[2]) {
    return `${atMatch[1]},${atMatch[2]}`
  }

  const q = input.searchParams.get("q")
  if (q && /^-?\d+\.\d+,-?\d+\.\d+$/.test(q)) {
    return q
  }

  return null
}

function tryExtractPlaceId(content: string) {
  const match = content.match(/place_id[:=]([A-Za-z0-9_-]{10,})/i)
  return match?.[1] ?? null
}

/** Títulos de páginas intermediárias (busca, consent) que não devem virar termo de busca no Places */
function isUnusableListingHtmlTitle(title: string): boolean {
  const t = title.trim().toLowerCase()
  if (!t) return true
  const unusable = [
    "google search",
    "google",
    "search",
    "before you continue",
    "redirecting",
  ]
  return unusable.some((u) => t === u || t.startsWith(`${u} `))
}

function tryExtractNameFromHtml(content: string) {
  const ogMatch = content.match(
    /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i,
  )
  if (ogMatch?.[1]) {
    const cleaned = ogMatch[1].replace(/\s*-\s*Google(?:\s+Maps)?\s*$/i, "").trim()
    if (cleaned && !isUnusableListingHtmlTitle(cleaned)) return cleaned
  }

  const titleMatch = content.match(/<title>(.*?)<\/title>/is)
  if (!titleMatch?.[1]) return null

  const cleanedTitle = titleMatch[1]
    .replace(/\s*-\s*Google(?:\s+Maps)?\s*$/i, "")
    .replace(/\s*\|\s*Google\s*Maps\s*$/i, "")
    .trim()
  if (!cleanedTitle || isUnusableListingHtmlTitle(cleanedTitle)) return null
  return cleanedTitle
}

/**
 * Links do Maps embutidos em HTML (páginas de redirect / busca) para segunda etapa de resolução.
 */
function tryExtractFirstGoogleMapsPlaceUrl(html: string): string | null {
  const patterns = [
    /https:\/\/www\.google\.com\/maps\/place\/[^"'\\s<>]+/i,
    /https:\/\/maps\.google\.com\/maps\/place\/[^"'\\s<>]+/i,
    /https:\/\/www\.google\.com\/maps\/search\/[^"'\\s<>]+/i,
    /https:\/\/goo\.gl\/maps\/[^"'\\s<>]+/i,
    /https:\/\/maps\.app\.goo\.gl\/[^"'\\s<>]+/i,
  ]
  for (const re of patterns) {
    const m = html.match(re)
    if (m?.[0]) {
      try {
        return new URL(m[0]).toString()
      } catch {
        /* ignore */
      }
    }
  }
  return null
}

async function resolveSearchInput(rawQuery: string, redirectDepth = 0): Promise<ResolvedSearchInput> {
  if (!rawQuery.toLowerCase().startsWith("http")) {
    return { searchText: rawQuery }
  }

  if (redirectDepth > 5) {
    console.log("URL Final:", "(limite de redirects atingido)")
    console.log("Termo de busca extraído:", rawQuery)
    return { searchText: rawQuery }
  }

  try {
    const firstUrl = new URL(rawQuery)
    const response = await fetch(firstUrl.toString(), {
      method: "GET",
      cache: "no-store",
      redirect: "follow",
      headers: {
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
      },
    })

    let finalUrl = new URL(response.url || firstUrl.toString())
    finalUrl = tryUnwrapGoogleRedirectUrl(finalUrl)

    console.log("URL Final:", finalUrl.toString())

    const pathFromFinal = tryExtractNameFromUrlPath(finalUrl)
    const pathFromFirst = tryExtractNameFromUrlPath(firstUrl)
    const queryFromParams =
      tryExtractQueryFromSearchParams(finalUrl) ?? tryExtractQueryFromSearchParams(firstUrl)
    const coordinates = tryExtractCoordinatesFromUrl(finalUrl) ?? tryExtractCoordinatesFromUrl(firstUrl)

    if (!response.ok) {
      const extractedQuery = pathFromFinal ?? pathFromFirst ?? queryFromParams ?? coordinates ?? rawQuery
      console.log("Termo de busca extraído:", extractedQuery)
      return { searchText: extractedQuery }
    }

    const html = await response.text()
    const extractedPlaceId = tryExtractPlaceId(html)
    const extractedName = tryExtractNameFromHtml(html)

    /**
     * Ordem intencional: páginas google.com/search?q=Nome trazem o negócio em `q`,
     * enquanto <title> costuma ser só "Google Search" — `q` deve vir antes do HTML.
     */
    let extractedQuery =
      pathFromFinal ??
      pathFromFirst ??
      queryFromParams ??
      extractedName ??
      coordinates ??
      null

    if (!extractedQuery) {
      const embeddedMaps = tryExtractFirstGoogleMapsPlaceUrl(html)
      if (embeddedMaps) {
        console.log("Seguindo URL do Maps embutida no HTML:", embeddedMaps)
        return resolveSearchInput(embeddedMaps, redirectDepth + 1)
      }
    }

    const finalQuery = extractedQuery ?? rawQuery
    console.log("Termo de busca extraído:", finalQuery)

    return {
      searchText: finalQuery,
      placeId: extractedPlaceId ?? undefined,
    }
  } catch {
    console.log("URL Final:", "(erro ao resolver)")
    console.log("Termo de busca extraído:", rawQuery)
    return { searchText: rawQuery }
  }
}

async function fetchPlaceById(placeId: string, apiKey: string) {
  const response = await fetch(`${GOOGLE_PLACE_DETAILS_ENDPOINT}/places/${placeId}`, {
    method: "GET",
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask":
        "displayName,formattedAddress,rating,userRatingCount,addressComponents,primaryType,types",
    },
    cache: "no-store",
  })

  return response
}

function extractCity(place: GooglePlace) {
  const byComponent = place.addressComponents?.find(
    (component) =>
      component.types?.includes("locality") ||
      component.types?.includes("administrative_area_level_2"),
  )

  if (byComponent?.longText) return byComponent.longText

  if (!place.formattedAddress) return null
  const parts = place.formattedAddress.split(",").map((item) => item.trim())
  if (parts.length >= 2) {
    const cityState = parts[parts.length - 2]
    const city = cityState.split("-")[0]?.trim()
    return city || null
  }

  return null
}

/**
 * Tradução de tipos comuns do Google Places para rótulos úteis em português (buscas locais).
 * Lista parcial — tipos desconhecidos viram texto legível a partir do snake_case.
 */
const PLACE_TYPE_PT: Record<string, string> = {
  florist: "floricultura",
  flower_shop: "floricultura",
  restaurant: "restaurante",
  cafe: "café",
  coffee_shop: "café",
  bar: "bar",
  bakery: "padaria",
  meal_takeaway: "delivery de comida",
  meal_delivery: "delivery de comida",
  food: "comida",
  lodging: "hospedagem",
  hotel: "hotel",
  motel: "motel",
  store: "loja",
  supermarket: "supermercado",
  convenience_store: "mercadinho",
  clothing_store: "loja de roupas",
  shoe_store: "loja de calçados",
  electronics_store: "loja de eletrônicos",
  furniture_store: "loja de móveis",
  home_goods_store: "artigos para casa",
  hardware_store: "loja de ferragens",
  jewelry_store: "joalheria",
  shopping_mall: "shopping",
  book_store: "livraria",
  pet_store: "pet shop",
  beauty_salon: "salão de beleza",
  hair_care: "cabeleireiro",
  spa: "spa",
  gym: "academia",
  dentist: "dentista",
  doctor: "clínica médica",
  hospital: "hospital",
  pharmacy: "farmácia",
  veterinary_care: "veterinário",
  car_dealer: "concessionária",
  car_repair: "oficina mecânica",
  gas_station: "posto de gasolina",
  lawyer: "advogado",
  accounting: "contabilidade",
  real_estate_agency: "imobiliária",
  insurance_agency: "corretora de seguros",
  travel_agency: "agência de viagens",
  night_club: "casa noturna",
  movie_theater: "cinema",
  museum: "museu",
  tourist_attraction: "ponto turístico",
  park: "parque",
  church: "igreja",
  school: "escola",
  secondary_school: "escola",
  primary_school: "escola",
  university: "universidade",
  plumber: "encanador",
  electrician: "eletricista",
  locksmith: "chaveiro",
  painter: "pintor",
  moving_company: "mudanças",
  roofing_contractor: "telhados",
  general_contractor: "construtora",
  storage: "guarda-móveis",
  car_wash: "lava-jato",
  liquor_store: "adega",
}

function prettifyPlaceTypeSnake(type: string): string {
  return type
    .replace(/_/g, " ")
    .replace(/\b\w/g, (ch) => ch.toUpperCase())
    .trim()
}

function translatePlaceTypeToPt(googleType: string): string {
  const key = googleType.trim().toLowerCase()
  if (PLACE_TYPE_PT[key]) return PLACE_TYPE_PT[key]
  return prettifyPlaceTypeSnake(key)
}

function pickPrimaryGoogleType(place: GooglePlace): string | null {
  if (place.primaryType?.trim()) {
    return place.primaryType.trim().toLowerCase()
  }
  for (const t of place.types ?? []) {
    const low = (t ?? "").toLowerCase()
    if (low && !GENERIC_GOOGLE_PLACE_TYPES.has(low)) return low
  }
  for (const t of place.types ?? []) {
    if (t?.trim()) return t.trim().toLowerCase()
  }
  return null
}

interface SerpKeywordSeed {
  keyword: string
  searchVolume: string
}

/** Entre 3 e 5 consultas locais coerentes com o nicho + cidade */
function buildDynamicSerpKeywords(place: GooglePlace, city: string | null): SerpKeywordSeed[] {
  const rawType = pickPrimaryGoogleType(place)
  const ptLabel = rawType ? translatePlaceTypeToPt(rawType) : "comércio local"
  const cityTrim = city?.trim() ?? ""
  const vol = "—"

  const candidates: SerpKeywordSeed[] = []

  if (cityTrim) {
    candidates.push(
      { keyword: `${ptLabel} ${cityTrim}`, searchVolume: vol },
      { keyword: `melhor ${ptLabel} ${cityTrim}`, searchVolume: vol },
      { keyword: `onde encontrar ${ptLabel} ${cityTrim}`, searchVolume: vol },
      { keyword: `${ptLabel} perto de mim`, searchVolume: vol },
      { keyword: `melhores ${ptLabel} ${cityTrim}`, searchVolume: vol },
    )
  } else {
    candidates.push(
      { keyword: ptLabel, searchVolume: vol },
      { keyword: `melhor ${ptLabel}`, searchVolume: vol },
      { keyword: `${ptLabel} perto de mim`, searchVolume: vol },
      { keyword: `onde encontrar ${ptLabel}`, searchVolume: vol },
    )
  }

  const seen = new Set<string>()
  const unique: SerpKeywordSeed[] = []
  for (const item of candidates) {
    const k = item.keyword.toLowerCase().replace(/\s+/g, " ").trim()
    if (!k || seen.has(k)) continue
    seen.add(k)
    unique.push({ ...item, keyword: item.keyword.replace(/\s+/g, " ").trim() })
  }

  const min = 3
  const max = 5
  if (unique.length >= min) return unique.slice(0, max)

  const pad1 = cityTrim ? `${ptLabel} em ${cityTrim}` : `serviços de ${ptLabel}`
  const k1 = pad1.toLowerCase()
  if (!seen.has(k1)) {
    seen.add(k1)
    unique.push({ keyword: pad1.replace(/\s+/g, " ").trim(), searchVolume: vol })
  }

  if (unique.length < min) {
    const pad2 = cityTrim ? `${ptLabel} centro ${cityTrim}` : `${ptLabel} na região`
    const k2 = pad2.toLowerCase()
    if (!seen.has(k2)) {
      unique.push({ keyword: pad2.replace(/\s+/g, " ").trim(), searchVolume: vol })
    }
  }

  return unique.slice(0, max)
}

function findBusinessPosition(
  localResults: Array<{ position?: number; title?: string }>,
  companyName: string,
) {
  const normalizedCompany = normalizeText(companyName)
  const match = localResults.find((result) => {
    const title = normalizeText(result.title ?? "")
    return title.includes(normalizedCompany) || normalizedCompany.includes(title)
  })

  return match?.position ?? null
}

async function fetchSerpRanking(
  keyword: string,
  searchVolume: string,
  companyName: string,
  serpApiKey: string,
): Promise<SerpRankingResult> {
  try {
    /** Frase completa (já inclui cidade quando aplicável); evita duplicar a cidade */
    const query = keyword.trim()
    const url = new URL(SERPAPI_ENDPOINT)
    url.searchParams.set("engine", "google_local")
    url.searchParams.set("q", query)
    url.searchParams.set("api_key", serpApiKey)

    console.log("[SerpApi] Requisição:", { keyword, q: query, companyName })

    const response = await fetch(url.toString(), { cache: "no-store" })
    console.log("Status do SerpApi:", response.status, { keyword })

    const bodyText = await response.text()

    if (!response.ok) {
      console.log("Erro SerpApi:", bodyText)
      return { keyword, searchVolume, position: null, previousPosition: null, requestOk: false }
    }

    let data: {
      error?: string
      local_results?: Array<{ position?: number; title?: string; name?: string }>
    }
    try {
      data = JSON.parse(bodyText) as typeof data
    } catch {
      console.log("Erro SerpApi: corpo não é JSON válido", bodyText.slice(0, 500))
      return { keyword, searchVolume, position: null, previousPosition: null, requestOk: false }
    }

    if (data.error) {
      console.log("Erro SerpApi (campo error no JSON):", data.error)
      return { keyword, searchVolume, position: null, previousPosition: null, requestOk: false }
    }

    const localResults = data.local_results ?? []
    console.log("[SerpApi] local_results count:", localResults.length, { keyword })

    const normalizedResults = localResults.map((r) => {
      const raw = r.position
      const pos =
        typeof raw === "number"
          ? raw
          : raw !== undefined && raw !== null
            ? Number(raw)
            : NaN
      return {
        position: Number.isFinite(pos) ? pos : undefined,
        title: r.title ?? r.name ?? "",
      }
    })

    const position = findBusinessPosition(normalizedResults, companyName)
    const previousPosition =
      position !== null && position !== undefined ? position + 1 : null

    if (position === null) {
      console.log("[SerpApi] Empresa não encontrada nos resultados para:", companyName, { keyword })
    }

    return { keyword, searchVolume, position, previousPosition, requestOk: true }
  } catch (err) {
    console.log("[SerpApi] Exceção na requisição:", err)
    return { keyword, searchVolume, position: null, previousPosition: null, requestOk: false }
  }
}

export async function POST(request: Request) {
  try {
    const { query } = (await request.json()) as { query?: string }
    const rawInput = query?.trim()

    if (!rawInput) {
      return NextResponse.json({ error: "Nome da empresa é obrigatório." }, { status: 400 })
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "GOOGLE_PLACES_API_KEY não configurada no servidor." },
        { status: 500 },
      )
    }

    const resolvedInput = await resolveSearchInput(rawInput)
    let response: Response

    if (resolvedInput.placeId) {
      response = await fetchPlaceById(resolvedInput.placeId, apiKey)
    } else {
      response = await fetch(GOOGLE_PLACES_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.addressComponents,places.primaryType,places.types",
        },
        body: JSON.stringify({
          textQuery: resolvedInput.searchText,
          maxResultCount: 1,
        }),
        cache: "no-store",
      })
    }

    if (!response.ok) {
      let detailedError = "Não foi possível consultar o Google Places."

      try {
        const errorData = (await response.json()) as GoogleApiErrorResponse
        if (errorData.error?.message) {
          detailedError = `Google Places: ${errorData.error.message}`
        }
      } catch {
        // Keep fallback message if parsing fails.
      }

      return NextResponse.json(
        { error: detailedError },
        { status: response.status },
      )
    }

    const data = (await response.json()) as { places?: GooglePlace[] } & GooglePlace
    const place = resolvedInput.placeId ? data : data.places?.[0]

    if (!place) {
      return NextResponse.json({ error: "Empresa não encontrada." }, { status: 404 })
    }

    const companyName = place.displayName?.text ?? resolvedInput.searchText
    const city = extractCity(place)
    const serpApiKey = process.env.SERPAPI_API_KEY

    const dynamicSeeds = buildDynamicSerpKeywords(place, city)
    const primaryTypeRaw = pickPrimaryGoogleType(place)
    console.log("[Places] primaryType/types:", {
      primaryType: place.primaryType ?? null,
      types: place.types ?? [],
      resolvedType: primaryTypeRaw,
      ptLabel: primaryTypeRaw ? translatePlaceTypeToPt(primaryTypeRaw) : "comércio local",
      keywords: dynamicSeeds.map((s) => s.keyword),
    })

    let serpStatus: SerpStatus = "not_configured"
    let rankings: KeywordRanking[] = dynamicSeeds.map((item) => ({
      keyword: item.keyword,
      searchVolume: item.searchVolume,
      position: null,
      previousPosition: null,
    }))

    if (serpApiKey) {
      const serpResults = await Promise.all(
        dynamicSeeds.map((item) =>
          fetchSerpRanking(item.keyword, item.searchVolume, companyName, serpApiKey),
        ),
      )

      const successCount = serpResults.filter((result) => result.requestOk).length
      serpStatus = successCount > 0 ? "ok" : "api_unavailable"
      rankings = serpResults.map(({ requestOk: _requestOk, ...ranking }) => ranking)
    }

    return NextResponse.json({
      companyName,
      rating: place.rating ?? null,
      userRatingsTotal: place.userRatingCount ?? null,
      address: place.formattedAddress ?? "Endereço não disponível",
      rankings,
      serpStatus,
    })
  } catch {
    return NextResponse.json({ error: "Erro interno ao buscar dados." }, { status: 500 })
  }
}
