import { useState, useEffect } from "react";
import { PRESET_QUESTIONS, ARCHETYPES } from "./questions";
import { CompassPosition, UserAnswer } from "./types";
import Header from "./components/Header";
import PoliticalCompass from "./components/PoliticalCompass";
import QuestionCard from "./components/QuestionCard";
import HeadlineAnalyzer from "./components/HeadlineAnalyzer";
import CounselorChat from "./components/CounselorChat";
import { Sparkles, HelpCircle, Landmark, X, RefreshCw, ArrowRight, MessageSquare, Info, Shield, Compass } from "lucide-react";

export default function App() {
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [view, setView] = useState<"quiz" | "result">("quiz");
  const [customShift, setCustomShift] = useState<CompassPosition>({ econ: 0, social: 0 });
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"compass" | "analyzer" | "chat">("compass");
  const [historyTrace, setHistoryTrace] = useState<CompassPosition[]>([]);

  // Open tutorial on first visit
  useEffect(() => {
    setTutorialOpen(true);
  }, []);

  // Compute current position dynamically based on answered questions
  const calculatePosition = (): CompassPosition => {
    let econSum = 0;
    let econCount = 0;
    let socialSum = 0;
    let socialCount = 0;

    answers.forEach((ans) => {
      const q = PRESET_QUESTIONS.find((item) => item.id === ans.questionId);
      if (!q) return;

      if (q.axis === "econ") {
        econSum += ans.value;
        econCount++;
      } else if (q.axis === "social") {
        socialSum += ans.value;
        socialCount++;
      }
    });

    const econBase = econCount > 0 ? econSum / econCount : 0;
    const socialBase = socialCount > 0 ? socialSum / socialCount : 0;

    // Apply any dynamic shift from headline analyzer, clamped between -1 and 1
    const finalEcon = Math.max(-1, Math.min(1, econBase + customShift.econ));
    const finalSocial = Math.max(-1, Math.min(1, socialBase + customShift.social));

    return { econ: finalEcon, social: finalSocial };
  };

  const currentPosition = calculatePosition();

  // Track position history for dotted path trace
  useEffect(() => {
    if (answers.length > 0) {
      setHistoryTrace((prev) => {
        // Only append if position differs from the last trace element
        const last = prev[prev.length - 1];
        if (!last || last.econ !== currentPosition.econ || last.social !== currentPosition.social) {
          return [...prev, currentPosition];
        }
        return prev;
      });
    } else {
      setHistoryTrace([{ econ: 0, social: 0 }]);
    }
  }, [answers, customShift]);

  // Determine current Archetype
  const getArchetype = (pos: CompassPosition) => {
    // If very close to center, return Neutral/Balanced
    if (Math.abs(pos.econ) <= 0.3 && Math.abs(pos.social) <= 0.3) {
      return ARCHETYPES.find((a) => a.quadrant === "Centro Democrático") || ARCHETYPES[4];
    }

    if (pos.econ < 0 && pos.social < 0) {
      return ARCHETYPES.find((a) => a.quadrant === "Libertário de Esquerda") || ARCHETYPES[2];
    } else if (pos.econ < 0 && pos.social >= 0) {
      return ARCHETYPES.find((a) => a.quadrant === "Autoritário de Esquerda") || ARCHETYPES[3];
    } else if (pos.econ >= 0 && pos.social < 0) {
      return ARCHETYPES.find((a) => a.quadrant === "Libertário de Direita") || ARCHETYPES[0];
    } else {
      return ARCHETYPES.find((a) => a.quadrant === "Autoritário de Direita") || ARCHETYPES[1];
    }
  };

  const currentArchetype = getArchetype(currentPosition);

  const handleSelectAnswer = (value: number) => {
    const qId = PRESET_QUESTIONS[currentQuestionIndex].id;
    setAnswers((prev) => {
      const filtered = prev.filter((a) => a.questionId !== qId);
      return [...filtered, { questionId: qId, value }];
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < PRESET_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setView("result");
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setView("quiz");
    setCustomShift({ econ: 0, social: 0 });
    setHistoryTrace([{ econ: 0, social: 0 }]);
  };

  const handleApplyShift = (econShift: number, socialShift: number) => {
    setCustomShift((prev) => ({
      econ: prev.econ + econShift,
      social: prev.social + socialShift
    }));
  };

  const currentSelectedAnswer =
    answers.find((a) => a.questionId === PRESET_QUESTIONS[currentQuestionIndex].id)?.value ?? null;

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 dark:bg-slate-900 dark:text-gray-100 flex flex-col transition-colors duration-200">
      <Header onOpenTutorial={() => setTutorialOpen(true)} />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Intro educational banner */}
        <div className="bg-gradient-to-r from-rose-500 to-amber-500 rounded-2xl p-6 text-white shadow-md mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-white/10 rounded-full blur-xl" />
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mb-2">
              Descubra seu lugar no espectro social sem preconceitos!
            </h2>
            <p className="text-sm text-rose-50/95 leading-relaxed">
              Diferente de testes complicados com palavras difíceis, nossa bústola traduz as discussões para a linguagem real da vida comum. Entenda por que cada lado defende o que defende e localize sua opinião no mapa político!
            </p>
          </div>
        </div>

        {/* Tab Selection Row for Tools */}
        <div className="flex border-b border-gray-200 dark:border-gray-800 mb-6 overflow-x-auto whitespace-nowrap">
          <button
            onClick={() => setActiveTab("compass")}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center space-x-2 ${
              activeTab === "compass"
                ? "border-rose-500 text-rose-600 dark:text-rose-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <Compass className="h-4 w-4" />
            <span>1. Descobrir Meu Espectro (Perguntas)</span>
          </button>
          <button
            onClick={() => setActiveTab("analyzer")}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center space-x-2 ${
              activeTab === "analyzer"
                ? "border-rose-500 text-rose-600 dark:text-rose-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>2. Analisador de Pautas Online</span>
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center space-x-2 ${
              activeTab === "chat"
                ? "border-rose-500 text-rose-600 dark:text-rose-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span>3. Perguntar ao Conselheiro de IA</span>
          </button>
        </div>

        {/* Dynamic View Sections */}
        {activeTab === "compass" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Quiz & Form Column */}
            <div className="lg:col-span-7 flex flex-col space-y-6">
              {view === "quiz" ? (
                <QuestionCard
                  question={PRESET_QUESTIONS[currentQuestionIndex]}
                  currentIndex={currentQuestionIndex}
                  totalQuestions={PRESET_QUESTIONS.length}
                  selectedAnswer={currentSelectedAnswer}
                  onSelectAnswer={handleSelectAnswer}
                  onNext={handleNext}
                  onPrev={handlePrev}
                />
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm dark:bg-gray-950 dark:border-gray-900 text-center flex flex-col items-center justify-center py-12">
                  <div className="p-3 bg-rose-50 rounded-full text-rose-500 mb-4 dark:bg-rose-950/40">
                    <Landmark className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Você completou o mapeamento!
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mb-6">
                    Seu posicionamento foi calculado. Agora explore seu perfil no painel ao lado ou adicione pautas dinâmicas para ver como ele se altera.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleReset}
                      className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center space-x-2"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>Refazer Questionário</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Progress and mini feedback */}
              <div className="p-4 bg-white rounded-xl border border-gray-100 dark:bg-gray-950 dark:border-gray-900 text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold text-gray-700 dark:text-gray-300">
                    Respostas fornecidas:{" "}
                  </span>
                  <span className="text-rose-500 font-bold">{answers.length}</span> / {PRESET_QUESTIONS.length}
                </div>
                {answers.length > 0 && (
                  <button
                    onClick={handleReset}
                    className="text-gray-400 hover:text-rose-500 font-bold flex items-center space-x-1"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>Resetar</span>
                  </button>
                )}
              </div>
            </div>

            {/* Political Compass Interactive Map Column */}
            <div className="lg:col-span-5">
              <PoliticalCompass
                position={currentPosition}
                archetype={currentArchetype}
                historyTrace={historyTrace}
              />
            </div>
          </div>
        )}

        {activeTab === "analyzer" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <HeadlineAnalyzer onApplyShift={handleApplyShift} />
            </div>
            <div className="lg:col-span-5">
              <PoliticalCompass
                position={currentPosition}
                archetype={currentArchetype}
                historyTrace={historyTrace}
              />
            </div>
          </div>
        )}

        {activeTab === "chat" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <CounselorChat />
            </div>
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm dark:bg-gray-950 dark:border-gray-900 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Info className="h-5 w-5 text-rose-500" />
                    <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      Como Usar o Conselheiro?
                    </h4>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed space-y-2 mb-4">
                    <span>O Conselheiro foi desenvolvido para traduzir a política para o dia a dia. Você pode tirar dúvidas como se estivesse batendo um papo na calçada da rua.</span>
                    <br /><br />
                    <span>Nossa IA explica sem jargões intelectuais ou termos chatos de faculdade para garantir o máximo de acessibilidade para todos.</span>
                  </p>
                </div>
                <div className="p-3.5 bg-amber-50/50 border border-amber-100 rounded-xl dark:bg-amber-950/20 dark:border-amber-900 text-[11px] text-amber-900 dark:text-amber-300">
                  ⚡ <strong>Dica:</strong> Se você não souber o que significa alguma palavra difícil que ouviu na TV, pergunte: <em>&quot;O que é [palavra]?&quot;</em> e assista à mágica da simplificação acontecer!
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Tutorial Accessibility Modal */}
      {tutorialOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-gray-100 max-w-lg w-full p-6 shadow-xl relative dark:bg-gray-950 dark:border-gray-900 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setTutorialOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            
            <div className="flex items-center space-x-2 text-rose-500 mb-3">
              <Compass className="h-6 w-6" />
              <h3 className="text-lg font-bold tracking-tight">Bem-vindo à Bússola Comunitária!</h3>
            </div>

            <div className="space-y-4 text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              <p>
                Este espaço foi desenhado para ser totalmente acessível para qualquer pessoa entender política, mesmo sem nenhuma escolarização prévia.
              </p>
              
              <div className="p-3 bg-rose-50/60 dark:bg-rose-950/20 rounded-xl space-y-2">
                <p><strong>🎧 Acessibilidade Total:</strong></p>
                <p>Cada pergunta possui um ícone de <strong>Alto-falante (Alto-falante)</strong>. Clique nele para ouvir o texto e as opções de resposta narrados em voz alta!</p>
              </div>

              <div className="p-3 bg-amber-50/60 dark:bg-amber-950/20 rounded-xl space-y-2">
                <p><strong>💡 Tradução Amigável (IA):</strong></p>
                <p>Achou alguma pergunta complicada? Clique no botão <strong>&quot;Traduzir Ideia (IA)&quot;</strong> para ler uma explicação simples do dia a dia criada pela Inteligência Artificial.</p>
              </div>

              <p>
                Não há respostas certas ou erradas. O objetivo é ajudar você a se localizar e entender as discussões da sociedade de forma amigável e acolhedora!
              </p>
            </div>

            <button
              onClick={() => setTutorialOpen(false)}
              className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
            >
              Começar a Explorar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
