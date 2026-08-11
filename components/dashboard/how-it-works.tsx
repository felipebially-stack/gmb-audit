import { Search, Zap, FileText } from "lucide-react";

export function HowItWorks() {
  return (
    <section id="como-funciona" className="bg-slate-800 py-20 border-b border-slate-700">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Por apenas R$ 9,97, nós mapeamos os erros exatos <span className="text-blue-400 block mt-2">que estão desviando seus clientes para a concorrência</span>
          </h2>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          <div className="relative flex flex-col items-center text-center bg-slate-900 p-8 rounded-3xl border border-slate-700 shadow-xl">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Search className="h-10 w-10" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-white">1. Simulamos a busca do seu cliente</h3>
            <p className="text-slate-400 text-base leading-relaxed mb-6">
              Não adianta apenas ter a ficha criada. Rastreamos o seu posicionamento real no mapa para ver como (e se) o seu cliente consegue te encontrar.
            </p>
            <div className="w-full mt-auto bg-slate-800 rounded-xl p-3 border border-slate-700">
              <p className="text-sm font-bold text-slate-300">Identificação instantânea de visibilidade</p>
            </div>
          </div>

          <div className="relative flex flex-col items-center text-center bg-slate-900 p-8 rounded-3xl border border-slate-700 shadow-xl">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Zap className="h-10 w-10" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-white">2. Auditoria de Conversão</h3>
            <p className="text-slate-400 text-base leading-relaxed mb-6">
              Cruzamos o seu perfil com as diretrizes de ranqueamento. Descobrimos quais categorias ou falta de informações estão te jogando para o fim da lista.
            </p>
            <div className="w-full mt-auto bg-slate-800 rounded-xl p-3 border border-slate-700">
              <p className="text-sm font-bold text-slate-300">Diagnóstico de perda de tráfego</p>
            </div>
          </div>

          <div className="relative flex flex-col items-center text-center bg-slate-900 p-8 rounded-3xl border border-slate-700 shadow-xl">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-green-500/10 text-green-400 border border-green-500/20">
              <FileText className="h-10 w-10" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-white">3. O Plano de Ação Prático</h3>
            <p className="text-slate-400 text-base leading-relaxed mb-6">
              Nada de relatórios técnicos impossíveis de ler. Você recebe um PDF mastigado mostrando exatamente onde clicar e o que mudar hoje para o telefone voltar a tocar.
            </p>
            <div className="w-full mt-auto bg-green-500/10 rounded-xl p-3 border border-green-500/20">
              <p className="text-sm font-extrabold text-green-400 uppercase">Seu PDF liberado na hora</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}