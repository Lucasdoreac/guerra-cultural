import { Landmark, Sparkles, HelpCircle } from "lucide-react";

interface HeaderProps {
  onOpenTutorial: () => void;
}

export default function Header({ onOpenTutorial }: HeaderProps) {
  return (
    <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50 dark:border-gray-800 dark:bg-gray-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-rose-50 rounded-xl dark:bg-rose-950/40">
              <Landmark className="h-6 w-6 text-rose-500" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 tracking-tight dark:text-gray-100">
                Bússola Comunitária
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Política sem complicações para todos
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenTutorial}
              className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors dark:text-gray-300 dark:bg-gray-900 dark:border-gray-800 dark:hover:bg-gray-800"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Como Funciona?</span>
            </button>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-rose-50 to-amber-50 border border-amber-100 rounded-lg text-xs font-bold text-amber-800 dark:from-rose-950/20 dark:to-amber-950/20 dark:border-amber-900 dark:text-amber-300">
              <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
              <span>Inteligência Artificial Integrada</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
