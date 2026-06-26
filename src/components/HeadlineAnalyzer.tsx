import { useState, FormEvent } from "react";
import { Sparkles, ArrowRight, CornerDownRight, Landmark, HelpCircle } from "lucide-react";
import { DynamicAnalysis } from "../types";

interface HeadlineAnalyzerProps {
  onApplyShift: (econShift: number, socialShift: number) => void;
}

export default function HeadlineAnalyzer({ onApplyShift }: HeadlineAnalyzerProps) {
  const [headline, setHeadline] = useState("");
  const [analysis, setAnalysis] = useState<DynamicAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  const handleAnalyze = async (e: FormEvent) => {
    e.preventDefault();
    if (!headline.trim()) return;

    setIsLoading(false);
    setIsLoading(true);
    setHasApplied(false);
    try {
      const response = await fetch("/api/gemini/analyze-headline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headline })
      });
      const data = await response.json();
      if (data.analysis) {
        setAnalysis(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInject = () => {
    if (!analysis) return;
    onApplyShift(analysis.leftRightShift, analysis.authLibShift);
    setHasApplied(true);
  };

  const suggestions = [
    "Taxação de compras on-line internacionais (blusinhas)",
    "Regulamentação das redes sociais e desinformação",
    "Passe livre de ônibus pago pelo governo",
    "Escola cívico-militar com regimento estrito"
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm dark:bg-gray-950 dark:border-gray-900">
      <div className="flex items-center space-x-2 mb-3">
        <div className="p-1.5 bg-amber-50 rounded-lg dark:bg-amber-950/40">
          <Sparkles className="h-4 w-4 text-amber-500" />
        </div>
        <h3 className="text-md font-bold text-gray-900 dark:text-gray-100 tracking-tight">
          Analisador de Pautas Online
        </h3>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
        Viu alguma polêmica ou notícia no WhatsApp ou rede social? Digite aqui para entender o que está por trás do debate de forma neutra e veja como ela mexe com seu espectro político!
      </p>

      {/* Input Form */}
      <form onSubmit={handleAnalyze} className="space-y-3 mb-4">
        <div className="relative">
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="Ex: Imposto sobre carros elétricos ou liberação de cassinos..."
            className="w-full text-sm pl-3 pr-24 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-200 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100"
          />
          <button
            type="submit"
            disabled={isLoading || !headline.trim()}
            className="absolute right-1.5 top-1.5 bottom-1.5 px-3 py-1 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all"
          >
            {isLoading ? "Analisando..." : "Analisar"}
          </button>
        </div>

        {/* Suggestion tags */}
        <div className="flex flex-wrap gap-1.5">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setHeadline(s)}
              className="text-[10px] font-medium px-2 py-1 rounded bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </form>

      {/* Analysis Result */}
      {analysis && (
        <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-900 space-y-4">
          <div className="text-xs bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 leading-relaxed">
            <p className="font-bold text-gray-900 dark:text-gray-100 mb-1 flex items-center space-x-1">
              <Landmark className="h-3.5 w-3.5 text-rose-500" />
              <span>O que está em jogo neste assunto?</span>
            </p>
            {analysis.analysis}
          </div>

          {/* Two sides */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {analysis.sides.map((side, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-gray-150 bg-white dark:bg-gray-900 dark:border-gray-800"
              >
                <div className="flex items-center space-x-1 mb-1">
                  <CornerDownRight className="h-3.5 w-3.5 text-amber-500" />
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                    {side.name}
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-normal">
                  {side.point}
                </p>
              </div>
            ))}
          </div>

          {/* Compass Interaction Shift */}
          <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-xl dark:bg-rose-950/10 dark:border-rose-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-rose-900 dark:text-rose-300">
                Como isso mexe com o seu compasso político?
              </p>
              <p className="text-[10px] text-gray-600 dark:text-gray-400">
                Se você apoia regras fortes e proteção social, você se move para o quadrante do Estado Protetor ({analysis.authLibShift > 0 ? "Mais Autoritário/Regras" : "Mais Libertário/Livre"}).
              </p>
            </div>
            <button
              onClick={handleInject}
              disabled={hasApplied}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center space-x-1 ${
                hasApplied
                  ? "bg-emerald-100 border border-emerald-200 text-emerald-800 cursor-default dark:bg-emerald-950/30 dark:border-emerald-900 dark:text-emerald-300"
                  : "bg-rose-500 hover:bg-rose-600 text-white shadow-sm"
              }`}
            >
              <span>{hasApplied ? "✓ Aplicado ao Compasso" : "Simular Peso no Meu Mapa"}</span>
              {!hasApplied && <ArrowRight className="h-3 w-3" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
