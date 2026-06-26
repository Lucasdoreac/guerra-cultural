import { useState, useRef, useEffect, FormEvent } from "react";
import { Send, User, Bot, Sparkles, MessageCircle, RefreshCw } from "lucide-react";
import { ChatMessage } from "../types";

export default function CounselorChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Olá! Sou o seu Conselheiro Político Neutro. Estou aqui para traduzir qualquer termo ou pauta política de forma super simples, sem jargões difíceis e de forma 100% neutra. \n\nPode me perguntar coisas como: 'O que é Esquerda?', 'O que significa Conservador?' ou 'Por que as pessoas brigam por impostos?'.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // Keep only last 10 messages for context
      const chatHistory = [...messages, userMsg].map((msg) => ({
        role: msg.role,
        content: msg.content
      })).slice(-10);

      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory })
      });
      if (!response.ok) throw new Error("Erro de rede / deploy estático");
      const data = await response.json();

      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            role: "assistant",
            content: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch (err) {
      console.warn("Utilizando chat com conselheiro simulado estaticamente por conta de deploy no Pages:", err);
      // Generate standard friendly, accessible answers based on common questions
      const lower = input.toLowerCase();
      let reply = "Essa é uma pergunta muito importante! Em termos simples: as sociedades humanas sempre buscam o equilíbrio entre a liberdade do indivíduo e a organização do grupo. O que mais você gostaria de entender sobre o tema?";

      if (lower.includes("esquerda")) {
        reply = "A **Esquerda**, em termos bem simples do dia a dia, defende que a comunidade ou o governo deve ser como um grande guardião que divide a comida, a saúde e a escola de forma igualitária para que ninguém passe fome ou necessidade, cobrando impostos de quem tem mais para ajudar quem tem menos.";
      } else if (lower.includes("direita")) {
        reply = "A **Direita**, em termos bem simples, acredita que o melhor caminho para as pessoas prosperarem é a liberdade de trabalho e comércio. Ou seja, cada pessoa trabalha, cuida do seu dinheiro e colhe o fruto do seu esforço livremente, com o governo cobrando o mínimo possível de impostos.";
      } else if (lower.includes("conservador")) {
        reply = "Ser **Conservador** significa valorizar as tradições, a religião e a estrutura familiar herdada de nossos pais e avós. A ideia central é que o que funcionou por gerações deve ser protegido para manter a ordem e evitar que a sociedade se perca.";
      } else if (lower.includes("liberal") || lower.includes("libertário")) {
        reply = "Ser **Liberal** ou **Libertário** é defender que a liberdade é o bem mais precioso de todos. Significa que você deve ser livre para mandar no seu corpo, fazer suas escolhas de vida e gastar o seu próprio dinheiro sem ninguém de fora (como o governo ou uma igreja) lhe dizer o que fazer.";
      } else if (lower.includes("autoritário") || lower.includes("estado") || lower.includes("regras")) {
        reply = "O pensamento **Autoritário** (ou focado em regras fortes) defende que o grupo precisa de uma liderança firme e regras estritas para garantir que tudo funcione em ordem e com segurança. Sem regras firmes, algumas pessoas acham que a sociedade viraria uma bagunça.";
      } else if (lower.includes("imposto")) {
        reply = "Os **Impostos** são como aquela 'vaquinha' ou 'contribuição mensal' que os vizinhos fazem para manter a rua limpa e arrumada. Algumas pessoas acham que a vaquinha deve ser grande para pagar por tudo (como saúde e ônibus de graça); outras acham que deve ser pequenininha para cada um ficar com o seu próprio dinheiro e escolher onde quer gastar.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          role: "assistant",
          content: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Olá! Sou o seu Conselheiro Político Neutro. Estou aqui para traduzir qualquer termo ou pauta política de forma super simples, sem jargões difíceis e de forma 100% neutra. \n\nPode me perguntar coisas como: 'O que é Esquerda?', 'O que significa Conservador?' ou 'Por que as pessoas brigam por impostos?'.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden dark:bg-gray-950 dark:border-gray-900 flex flex-col h-[400px]">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex justify-between items-center dark:bg-gray-900/50 dark:border-gray-900">
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-4 w-4 text-rose-500 animate-pulse" />
          <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
            Fale com o Conselheiro Neutro
          </span>
        </div>
        <button
          onClick={handleReset}
          title="Reiniciar Conversa"
          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 max-w-[85%] ${
              msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
            }`}
          >
            {/* Avatar icon */}
            <div
              className={`p-1.5 rounded-lg shrink-0 ${
                msg.role === "user"
                  ? "bg-rose-100 text-rose-600 dark:bg-rose-950/40"
                  : "bg-amber-100 text-amber-600 dark:bg-amber-950/40"
              }`}
            >
              {msg.role === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
            </div>

            {/* Message bubble */}
            <div
              className={`p-3 rounded-xl text-xs leading-relaxed ${
                msg.role === "user"
                  ? "bg-rose-500 text-white rounded-tr-none"
                  : "bg-gray-50 text-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-tl-none border border-gray-100/50 dark:border-gray-800/40"
              }`}
            >
              <div className="whitespace-pre-line">{msg.content}</div>
              <div
                className={`text-[9px] mt-1 text-right ${
                  msg.role === "user" ? "text-rose-200" : "text-gray-400"
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-2.5 max-w-[85%] mr-auto">
            <div className="p-1.5 rounded-lg shrink-0 bg-amber-100 text-amber-600 dark:bg-amber-950/40">
              <Bot className="h-3.5 w-3.5 animate-bounce" />
            </div>
            <div className="p-3 rounded-xl text-xs leading-relaxed bg-gray-50 text-gray-500 dark:bg-gray-900 rounded-tl-none border border-gray-100/50 dark:border-gray-800/40 animate-pulse">
              Processando sua resposta...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input section */}
      <form onSubmit={handleSend} className="p-3 border-t border-gray-100 dark:border-gray-900 bg-white dark:bg-gray-950 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pergunte sobre qualquer termo político..."
          className="flex-1 text-xs px-3 py-2 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-200 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-2 bg-rose-500 hover:bg-rose-600 disabled:opacity-55 text-white rounded-xl transition-all shadow-sm"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  );
}
