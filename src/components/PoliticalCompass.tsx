import { motion } from "motion/react";
import { CompassPosition } from "../types";
import { Shield, Sparkles, HelpCircle, Users, Scale, Heart } from "lucide-react";

interface PoliticalCompassProps {
  position: CompassPosition;
  archetype: {
    name: string;
    quadrant: string;
    description: string;
    color: string;
  };
  historyTrace: CompassPosition[];
}

export default function PoliticalCompass({ position, archetype, historyTrace }: PoliticalCompassProps) {
  // Convert position values (-1 to +1) to percentage (0% to 100%)
  const getPercentX = (val: number) => ((val + 1) / 2) * 100;
  // In standard compass, Authoritarian is up (+1) and Libertarian is down (-1).
  // SVG or normal CSS top is 0 at top and 100 at bottom.
  // So +1 (Authoritarian) should be near 0% top, and -1 (Libertarian) should be near 100% top.
  const getPercentY = (val: number) => ((1 - val) / 2) * 100;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm dark:bg-gray-950 dark:border-gray-900">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Side: The Interactive Graph Grid */}
        <div className="flex-1 flex flex-col items-center">
          <div className="w-full max-w-[360px] aspect-square relative border border-gray-200 rounded-xl overflow-hidden bg-gray-50/50 dark:border-gray-800 dark:bg-gray-900/30">
            {/* Quadrant Background Colors */}
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
              {/* Top-Left: Authoritarian Left (Red/Rose) */}
              <div className="bg-rose-50/40 dark:bg-rose-950/5 border-r border-b border-gray-200/50 dark:border-gray-800/40 relative">
                <span className="absolute top-2 left-2 text-[10px] font-bold text-rose-700/65 dark:text-rose-400/50 tracking-wider">
                  AUTORITÁRIO ESQUERDA
                </span>
              </div>
              {/* Top-Right: Authoritarian Right (Blue) */}
              <div className="bg-blue-50/40 dark:bg-blue-950/5 border-b border-gray-200/50 dark:border-gray-800/40 relative">
                <span className="absolute top-2 right-2 text-[10px] font-bold text-blue-700/65 dark:text-blue-400/50 tracking-wider">
                  AUTORITÁRIO DIREITA
                </span>
              </div>
              {/* Bottom-Left: Libertarian Left (Green) */}
              <div className="bg-emerald-50/40 dark:bg-emerald-950/5 border-r border-gray-200/50 dark:border-gray-800/40 relative">
                <span className="absolute bottom-2 left-2 text-[10px] font-bold text-emerald-700/65 dark:text-emerald-400/50 tracking-wider">
                  LIBERTÁRIO ESQUERDA
                </span>
              </div>
              {/* Bottom-Right: Libertarian Right (Purple) */}
              <div className="bg-purple-50/40 dark:bg-purple-950/5 relative">
                <span className="absolute bottom-2 right-2 text-[10px] font-bold text-purple-700/65 dark:text-purple-400/50 tracking-wider">
                  LIBERTÁRIO DIREITA
                </span>
              </div>
            </div>

            {/* Axes Lines */}
            {/* Horizontal Axis: Economic */}
            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-400/60 dark:bg-gray-600/60" />
            {/* Vertical Axis: Social */}
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-gray-400/60 dark:bg-gray-600/60" />

            {/* Axes Labels */}
            <div className="absolute top-1/2 left-2 -translate-y-1/2 text-[9px] font-bold bg-white/90 px-1 py-0.5 rounded shadow-sm text-gray-600 dark:bg-gray-900 dark:text-gray-400 z-10">
              Esquerda (Coletivo)
            </div>
            <div className="absolute top-1/2 right-2 -translate-y-1/2 text-[9px] font-bold bg-white/90 px-1 py-0.5 rounded shadow-sm text-gray-600 dark:bg-gray-900 dark:text-gray-400 z-10">
              Direita (Mercado)
            </div>
            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] font-bold bg-white/90 px-1 py-0.5 rounded shadow-sm text-gray-600 dark:bg-gray-900 dark:text-gray-400 z-10 whitespace-nowrap">
              Estado Forte (Regras)
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-bold bg-white/90 px-1 py-0.5 rounded shadow-sm text-gray-600 dark:bg-gray-900 dark:text-gray-400 z-10 whitespace-nowrap">
              Liberdade Individual
            </div>

            {/* History Trace Lines */}
            {historyTrace.length > 1 && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <polyline
                  fill="none"
                  stroke="#fda4af"
                  strokeWidth="2.5"
                  strokeDasharray="4 3"
                  points={historyTrace
                    .map((pt) => `${getPercentX(pt.econ)}%,${getPercentY(pt.social)}%`)
                    .join(" ")}
                />
              </svg>
            )}

            {/* Current Position Dot Marker */}
            <motion.div
              className="absolute w-6 h-6 -ml-3 -mt-3 rounded-full bg-rose-500 border-2 border-white dark:border-gray-950 shadow-md flex items-center justify-center z-20 cursor-pointer"
              animate={{
                left: `${getPercentX(position.econ)}%`,
                top: `${getPercentY(position.social)}%`,
              }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
            </motion.div>
          </div>
          
          <div className="mt-3 flex items-center space-x-2 text-[10px] text-gray-500 dark:text-gray-400">
            <span className="inline-block w-2.5 h-2.5 bg-rose-400 rounded-full border border-dashed border-rose-300" />
            <span>Linha pontilhada mostra seu caminho a cada resposta</span>
          </div>
        </div>

        {/* Right Side: Archetype & Educational Explainers */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-rose-500 tracking-wider uppercase mb-1">
              <Scale className="h-4 w-4" />
              <span>Seu Perfil Atual</span>
            </div>
            <h3 className="text-xl font-extrabold text-gray-900 tracking-tight dark:text-gray-100 mb-2">
              {archetype.name}
            </h3>
            <span className="inline-block text-[11px] font-bold px-2.5 py-1 rounded-full mb-3 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
              Espectro: {archetype.quadrant}
            </span>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              {archetype.description}
            </p>
          </div>

          <div className="border-t border-gray-100 pt-4 mt-2 dark:border-gray-900">
            <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-1.5">
              <Shield className="h-3.5 w-3.5 text-amber-500" />
              <span>Sabedoria Histórica:</span>
            </h4>
            <div className="text-[11px] text-gray-500 dark:text-gray-400 space-y-1.5 leading-normal">
              <p>
                👑 <strong>Por que o topo existe?</strong> Tradicionalmente, políticas imperiais e patriarcais queriam controle estrito dos corpos mais simples para garantir servos fiéis e trabalhadores dóceis.
              </p>
              <p>
                🌱 <strong>Por que a base existe?</strong> As lutas por autonomia e liberdade nasceram para devolver a cada pessoa simples o poder de decidir sobre o próprio corpo, seu trabalho e sua comunidade.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
