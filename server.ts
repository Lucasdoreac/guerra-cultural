import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with recommended user-agent and key check
let ai: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ Warning: GEMINI_API_KEY is not defined. AI features will operate in sandbox/demo mode.");
      // We will handle the absence of the key gracefully in route handlers
      throw new Error("GEMINI_API_KEY_MISSING");
    }
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return ai;
}

// 1. API: Explain a political question or topic simply (ELI5 - Portuguese)
app.post("/api/gemini/explain", async (req, res) => {
  try {
    const { topic, context } = req.body;
    if (!topic) {
      return res.status(400).json({ error: "O campo 'topic' é obrigatório." });
    }

    let client: GoogleGenAI;
    try {
      client = getGeminiClient();
    } catch (err) {
      // Graceful fallback description when API Key is missing
      return res.json({
        explanation: `💡 [Modo de Demonstração] Aqui está uma explicação simplificada:\n\n**"${topic}"** diz respeito a como as comunidades organizam suas decisões. \n\nEm termos bem simples:\n- Alguns acreditam que as regras devem vir de cima, com um líder forte garantindo que tudo funcione em ordem (lado mais conservador ou autoritário).\n- Outros acham que cada pessoa deve ter liberdade total para decidir sobre sua vida e corpo sem ninguém interferir (lado mais liberal ou libertário).\n- No bolso: alguns acham que o dinheiro deve ser compartilhado por serviços públicos como saúde para todos (esquerda), enquanto outros acham que cada um deve trabalhar e cuidar do seu próprio dinheiro livremente (direita).\n\n*(Insira sua chave API do Gemini nas configurações para ter explicações dinâmicas personalizadas de Inteligência Artificial para qualquer tema!)*`,
        analogy: "Imagine uma grande família decidindo as regras de convivência."
      });
    }

    const systemPrompt = `Você é um Conselheiro Político Altamente Educativo, Neutro e Humilde.
Seu público-alvo são pessoas brasileiras comuns, de baixa renda, que possuem pouca ou nenhuma alfabetização política ou instrução formal (analfabetismo político e intelectual).
Seu objetivo é explicar conceitos políticos complexos ou pautas de guerras culturais de forma ultra-simplificada, empática, acolhedora e 100% neutra, usando metáforas do dia a dia (como churrasco comunitário, futebol, vizinhança, feira, horta).

Diretrizes Críticas:
1. NUNCA use jargões difíceis (como "hegemonia", "proletariado", "patrilinearidade", "interseccionalidade") sem explicá-los como se falasse com uma criança de 8 anos ou uma avó querida que nunca foi à escola.
2. Seja absolutamente neutro. Explique os DOIS lados de forma justa. Comece dizendo "Algumas pessoas pensam X porque querem proteger Y... Por outro lado, outras pessoas pensam Z porque querem garantir W...".
3. Mostre o que cada lado valoriza no fundo (segurança, liberdade, igualdade, tradição).
4. Evite ao máximo que o usuário se sinta confuso ou julgado. Diga que é normal ter dúvidas e que ambos os caminhos têm intenções positivas em suas bases.

Retorne sua resposta estritamente no seguinte formato JSON:
{
  "explanation": "A explicação principal simplificada em poucos parágrafos curtos, empáticos e fáceis de ler.",
  "analogy": "Uma analogia ou metáfora simples do cotidiano que ilustre o debate."
}`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Explique de forma super simples e neutra este tema/pergunta de guerra cultural: "${topic}". Contexto da pergunta atual: ${context || ''}`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            explanation: { type: Type.STRING },
            analogy: { type: Type.STRING }
          },
          required: ["explanation", "analogy"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Erro no explain API:", error);
    res.status(500).json({ error: "Erro ao processar explicação com IA", details: error.message });
  }
});

// 2. API: Analyze online headline or current pauta dynamically and map to compass shift
app.post("/api/gemini/analyze-headline", async (req, res) => {
  try {
    const { headline } = req.body;
    if (!headline) {
      return res.status(400).json({ error: "O campo 'headline' é obrigatório." });
    }

    let client: GoogleGenAI;
    try {
      client = getGeminiClient();
    } catch (err) {
      // Demo mode dynamic analyzer
      return res.json({
        analysis: `No modo de demonstração, analisamos que o assunto "**${headline}**" mexe muito com a opinião pública brasileira atual! \n\nNormalmente, debates assim dividem as pessoas em:\n1. **Os que defendem que o governo regule e proteja os cidadãos** (tendendo mais para a esquerda ou autoridade pública).\n2. **Os que defendem o livre comércio e a liberdade de escolha sem tarifas ou controle** (tendendo mais para a direita ou liberdade individual).`,
        leftRightShift: -0.2, // slight left
        authLibShift: 0.1,    // slight auth
        sides: [
          { name: "Lado Pro-Regulamentação/Proteção", point: "Argumenta que protege o trabalhador local ou evita abusos de grandes corporações." },
          { name: "Lado Pro-Liberdade/Mercado", point: "Argumenta que impostos e regras extras encarecem o custo de vida e tiram a liberdade de escolha das pessoas simples." }
        ]
      });
    }

    const systemPrompt = `Você é um Analista de Espectro Político Neutro e Pedagógico.
O usuário vai enviar uma manchete, notícia ou polêmica atual da internet ("questão do ano" ou "pauta online").
Seu trabalho é analisar esse assunto de forma extremamente neutra e didática.
Você deve explicar os dois pontos de vista principais de forma simplificada e mapear como apoiar cada ponto de vista deslocaria alguém no Compasso Político tradicional:
- Eixo Econômico (Esquerda: -1.0 a Direita: +1.0)
- Eixo Social (Autoritário/Estado Forte: +1.0 a Libertário/Liberdade Individual: -1.0)

Retorne o resultado no seguinte formato JSON:
{
  "analysis": "Explicação neutra e simples do que é essa polêmica e por que ela mexe com as pessoas.",
  "leftRightShift": -0.5, // Número entre -1 e 1 que representa o quanto defender o lado favorável ao governo/público tende à esquerda (-1) ou livre mercado (+1)
  "authLibShift": 0.5,    // Número entre -1 e 1 que representa o quanto defender o controle/regulamentação tende a autoritário (+1) ou liberdade civil (-1)
  "sides": [
    {
      "name": "Nome do Lado A (ex: Controle do Estado / Proteção)",
      "point": "Explicação simples do principal argumento desse lado."
    },
    {
      "name": "Nome do Lado B (ex: Liberdade de Escolha / Mercado Livre)",
      "point": "Explicação simples do principal argumento do outro lado."
    }
  ]
}`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Analise a seguinte pauta atual de debate online: "${headline}"`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: { type: Type.STRING },
            leftRightShift: { type: Type.NUMBER },
            authLibShift: { type: Type.NUMBER },
            sides: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  point: { type: Type.STRING }
                },
                required: ["name", "point"]
              }
            }
          },
          required: ["analysis", "leftRightShift", "authLibShift", "sides"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Erro no analyze-headline API:", error);
    res.status(500).json({ error: "Erro ao analisar pauta online", details: error.message });
  }
});

// 3. API: Friendly Counselor Chat (Neutral Conversation)
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "O campo 'messages' é obrigatório e deve ser um array." });
    }

    let client: GoogleGenAI;
    try {
      client = getGeminiClient();
    } catch (err) {
      // Demo mode chat response
      const lastMsg = messages[messages.length - 1]?.content || "";
      return res.json({
        reply: `[Modo de Demonstração] Que pergunta fantástica! Você me perguntou sobre "${lastMsg}". \n\nNa política de forma simples, existem duas grandes preocupações de todas as comunidades humanas:\n1. **A comida e o trabalho (Econômico)**: Como dividimos o que produzimos? Uns preferem que um grupo ou governo organize tudo igualmente (Esquerda); outros preferem que cada um pesque seu peixe e troque livremente (Direita).\n2. **A convivência e as regras (Social)**: Quem manda em quem? Uns preferem regras tradicionais estritas feitas por um conselho forte (Autoritário/Conservador); outros preferem que cada um viva sua vida de seu jeito sem intromissões (Libertário).\n\nPara perguntas dinâmicas e inteligentes, ative a chave de IA nas configurações!`
      });
    }

    const systemPrompt = `Você é o "Conselheiro Neutro", um guia amigável, acolhedor e profundamente didático cujo objetivo é responder dúvidas políticas de pessoas comuns de forma 100% neutra, compreensiva e sem termos complexos.
Use linguagem acessível do cotidiano brasileiro.
Mostre sempre que as ideologias políticas nasceram de tentativas genuínas de resolver problemas humanos antigos (como escassez de recursos, segurança comunitária e liberdade individual).
Evite julgar qualquer espectro. Nunca tome partido. Mostre o lado positivo e as preocupações válidas de cada ponto de vista.
Evite textos muito longos; prefira parágrafos curtos e exemplos práticos.`;

    // Format chat history for generateContent
    const formattedContents = messages.map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: systemPrompt
      }
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Erro no chat API:", error);
    res.status(500).json({ error: "Erro no chat com IA", details: error.message });
  }
});


// Serve files with Vite or static
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
