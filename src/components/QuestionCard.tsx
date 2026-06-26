import { useState, useEffect } from "react";
import { Question } from "../types";
import { HelpCircle, Sparkles, Volume2, VolumeX, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

interface QuestionCardProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  selectedAnswer: number | null; // -1, 0, 1
  onSelectAnswer: (value: number) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function QuestionCard({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
  onNext,
  onPrev
}: QuestionCardProps) {
  const [aiExplanation, setAiExplanation] = useState<{ explanation: string; analogy: string } | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Clear AI explanation when question changes
  useEffect(() => {
    setAiExplanation(null);
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, [question]);

  // Read question and options aloud (Acessibilidade para analfabetos)
  const handleToggleSpeak = () => {
    if (!window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = `Questão ${currentIndex + 1}. ${question.text}. \n ${question.subtext} \n\n Opção 1: ${question.leftOption}. \n Opção 2: ${question.neutralOption}. \n Opção 3: ${question.rightOption}.`;
    
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = "pt-BR";
    utterance.rate = 1.0;
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Get dynamic ELI5 explanation from Gemini API
  const handleGetAiExplanation = async () => {
    setIsLoadingAi(true);
    try {
      const response = await fetch("/api/gemini/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: question.text,
          context: question.subtext
        })
      });
      if (!response.ok) throw new Error("Erro na rede ou ambiente estático");
      const data = await response.json();
      if (data.explanation) {
        setAiExplanation(data);
      }
    } catch (err) {
      console.warn("Utilizando explicação offline/estática local por conta de hospedagem estática:", err);
      // Perfect static fallback for maximum user accessibility
      setAiExplanation({
        explanation: `Este assunto debate: "${question.text}".\n\nDe forma simplificada: \n- Um lado prioriza a liberdade individual absoluta, ou seja, que cada pessoa tome decisões próprias sem o governo dar palpites.\n- O outro lado foca no bem coletivo ou na preservação de valores tradicionais de segurança e ordem pública.`,
        analogy: "É como decidir se um grupo de amigos deve ter um líder único para organizar a viagem ou se cada um escolhe livremente onde quer ir e comer."
      });
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm dark:bg-gray-950 dark:border-gray-900 flex flex-col justify-between h-full">
      <div>
        {/* Progress header */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-bold text-rose-500 tracking-wider uppercase">
            Pergunta {currentIndex + 1} de {totalQuestions}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleToggleSpeak}
              title="Ouvir Pergunta (Acessibilidade)"
              className={`p-2 rounded-lg border transition-colors ${
                isSpeaking
                  ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/40 dark:border-rose-900"
                  : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-400"
              }`}
            >
              {isSpeaking ? <VolumeX className="h-4 w-4 animate-pulse" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <button
              onClick={handleGetAiExplanation}
              disabled={isLoadingAi}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors disabled:opacity-55 dark:bg-amber-950/30 dark:border-amber-900 dark:text-amber-300"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>{isLoadingAi ? "Explicando..." : "Traduzir Ideia (IA)"}</span>
            </button>
          </div>
        </div>

        {/* Question Title & Info */}
        <h2 id={`question-title-${question.id}`} className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 leading-snug mb-2">
          {question.text}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
          {question.subtext}
        </p>

        {/* Option Selection */}
        <div className="space-y-3 mb-6" role="radiogroup" aria-labelledby={`question-title-${question.id}`}>
          {/* Option A: Left-tending */}
          <button
            onClick={() => onSelectAnswer(-1)}
            role="radio"
            aria-checked={selectedAnswer === -1}
            className={`w-full text-left p-4 rounded-xl border text-sm transition-all duration-200 flex items-start space-x-3 ${
              selectedAnswer === -1
                ? "bg-rose-50 border-rose-300 text-rose-900 ring-2 ring-rose-200/50 dark:bg-rose-950/30 dark:border-rose-800 dark:text-rose-200"
                : "bg-gray-50 border-gray-150 hover:bg-gray-100 text-gray-700 dark:bg-gray-900/50 dark:border-gray-800 dark:text-gray-300"
            }`}
          >
            <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
              selectedAnswer === -1 ? "border-rose-500 bg-rose-500" : "border-gray-300 dark:border-gray-700"
            }`}>
              {selectedAnswer === -1 && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
            <span>{question.leftOption}</span>
          </button>

          {/* Option B: Neutral-tending */}
          <button
            onClick={() => onSelectAnswer(0)}
            role="radio"
            aria-checked={selectedAnswer === 0}
            className={`w-full text-left p-4 rounded-xl border text-sm transition-all duration-200 flex items-start space-x-3 ${
              selectedAnswer === 0
                ? "bg-amber-50 border-amber-300 text-amber-900 ring-2 ring-amber-200/50 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-200"
                : "bg-gray-50 border-gray-150 hover:bg-gray-100 text-gray-700 dark:bg-gray-900/50 dark:border-gray-800 dark:text-gray-300"
            }`}
          >
            <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
              selectedAnswer === 0 ? "border-amber-500 bg-amber-500" : "border-gray-300 dark:border-gray-700"
            }`}>
              {selectedAnswer === 0 && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
            <span>{question.neutralOption}</span>
          </button>

          {/* Option C: Right-tending */}
          <button
            onClick={() => onSelectAnswer(1)}
            role="radio"
            aria-checked={selectedAnswer === 1}
            className={`w-full text-left p-4 rounded-xl border text-sm transition-all duration-200 flex items-start space-x-3 ${
              selectedAnswer === 1
                ? "bg-blue-50 border-blue-300 text-blue-900 ring-2 ring-blue-200/50 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-200"
                : "bg-gray-50 border-gray-150 hover:bg-gray-100 text-gray-700 dark:bg-gray-900/50 dark:border-gray-800 dark:text-gray-300"
            }`}
          >
            <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
              selectedAnswer === 1 ? "border-blue-500 bg-blue-500" : "border-gray-300 dark:border-gray-700"
            }`}>
              {selectedAnswer === 1 && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
            <span>{question.rightOption}</span>
          </button>
        </div>

        {/* AI Dynamic Simple Explanation Block */}
        {aiExplanation && (
          <div className="mt-4 p-4 bg-amber-50/60 border border-amber-100 rounded-xl dark:bg-amber-950/10 dark:border-amber-900/40">
            <h4 className="text-xs font-bold text-amber-800 dark:text-amber-400 mb-1 flex items-center space-x-1">
              <Sparkles className="h-3 w-3 text-amber-500" />
              <span>Explicação Amigável da IA:</span>
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-2">
              {aiExplanation.explanation}
            </p>
            {aiExplanation.analogy && (
              <div className="text-xs text-amber-700 dark:text-amber-300 bg-amber-100/50 dark:bg-amber-950/40 p-2 rounded border border-amber-100/30">
                💡 <strong>Exemplo do Dia a Dia:</strong> {aiExplanation.analogy}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center border-t border-gray-50 pt-4 mt-6 dark:border-gray-900">
        <button
          onClick={onPrev}
          disabled={currentIndex === 0}
          className="inline-flex items-center space-x-1 px-3 py-2 text-xs font-bold border border-gray-200 rounded-lg text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-40 transition-colors dark:border-gray-800 dark:text-gray-400 dark:bg-gray-900 dark:hover:bg-gray-800"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Anterior</span>
        </button>

        <button
          onClick={onNext}
          disabled={selectedAnswer === null}
          className="inline-flex items-center space-x-1 px-4 py-2 text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 disabled:opacity-50 disabled:hover:bg-rose-500 rounded-lg shadow-sm transition-all"
        >
          <span>{currentIndex === totalQuestions - 1 ? "Ver Resultado" : "Próxima"}</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
