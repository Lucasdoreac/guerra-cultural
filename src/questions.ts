import { Question } from "./types";

export const PRESET_QUESTIONS: Question[] = [
  {
    id: "corpo_autonomia",
    category: "social",
    axis: "social",
    text: "Quem deve tomar as decisões sobre o próprio corpo, saúde e estilo de vida?",
    subtext: "Desde os tempos antigos, reis e chefes tentaram controlar quem as pessoas amam, como cuidam do corpo e como vivem.",
    leftOption: "Cada pessoa manda 100% no seu corpo e faz suas próprias escolhas sem intromissão de governos ou religiões.",
    rightOption: "A comunidade ou as leis precisam ter regras claras para proteger a moral, a família e a saúde coletiva.",
    neutralOption: "Depende de cada caso; algumas decisões devem ser livres, mas outras precisam de regras sociais."
  },
  {
    id: "propriedade_recursos",
    category: "econ",
    axis: "econ",
    text: "De quem devem ser as riquezas naturais da terra, como a água, as florestas e o petróleo?",
    subtext: "Esse é o debate sobre se a natureza pertence a todos de forma igual ou se quem trabalhar nela tem direito de ser o dono.",
    leftOption: "Devem pertencer a todo o povo e ser cuidadas pelo governo, garantindo que ninguém passe necessidade.",
    rightOption: "Devem pertencer a pessoas ou empresas privadas que trabalham e pagam impostos, pois elas cuidam melhor e produzem mais.",
    neutralOption: "Uma mistura: as riquezas devem ser de empresas privadas, mas o governo precisa dar uma parte para ajudar os necessitados."
  },
  {
    id: "divisao_trabalho",
    category: "econ",
    axis: "econ",
    text: "Se alguém trabalha muito e fica muito rico, enquanto outro trabalha mas continua pobre, o que fazer?",
    subtext: "O dilema da igualdade: o esforço de cada um deve ser recompensado individualmente ou devemos dividir os frutos para ajudar a comunidade?",
    leftOption: "O governo deve cobrar impostos de quem tem muito para garantir saúde, moradia e escola gratuita para quem tem menos.",
    rightOption: "O rico deve ficar com seu dinheiro fruto do esforço, e a ajuda a quem precisa deve vir de doações de caridade voluntária.",
    neutralOption: "Deixar o rico ficar com o dinheiro, mas garantir apenas um nível básico de escola e saúde de graça."
  },
  {
    id: "justica_punicao",
    category: "social",
    axis: "social",
    text: "Quando alguém comete um crime ou quebra as regras da comunidade, o que as leis devem fazer?",
    subtext: "Justiça punitiva vs. reabilitação. O objetivo é castigar e assustar para manter a ordem, ou educar e recuperar a pessoa?",
    leftOption: "Tentar entender os motivos do crime, educar e dar uma nova chance para a pessoa voltar à comunidade recuperada.",
    rightOption: "Aplicar uma punição firme e severa para servir de exemplo, mostrando que o crime não compensa e mantendo a segurança.",
    neutralOption: "Punar firmemente crimes graves de violência, mas focar em reabilitação para pequenos erros sociais."
  },
  {
    id: "familia_tradicao",
    category: "social",
    axis: "social",
    text: "As tradições de família e de religião devem ser protegidas por leis do governo?",
    subtext: "A luta cultural entre manter as tradições dos nossos antepassados ou aceitar novas formas de viver e se relacionar.",
    leftOption: "Não, as famílias mudam e todas as formas de amor e convivência moderna devem ter exatamente as mesmas leis e respeito.",
    rightOption: "Sim, a família tradicional e os valores religiosos são a base da nossa sociedade e o governo deve dar apoio especial a eles.",
    neutralOption: "As leis devem tratar todos de forma igual, mas o governo não deve proibir nem incentivar nenhuma tradição específica."
  },
  {
    id: "liberdade_expressao",
    category: "social",
    axis: "social",
    text: "O governo pode proibir alguém de falar algo que agrida a religião ou os valores da pátria?",
    subtext: "A questão antiga sobre se a paz social e a fé comum valem mais do que o direito de cada um falar o que pensa livremente.",
    leftOption: "Não, cada pessoa tem o direito de falar o que pensa, e a melhor forma de combater ideias ruins é conversando livremente.",
    rightOption: "Sim, ideias que desrespeitam símbolos da pátria ou atacam a fé das pessoas devem ser proibidas para manter o respeito.",
    neutralOption: "Permitir críticas saudáveis, mas punir ofensas brutais ou mentiras que incitem a violência contra os outros."
  },
  {
    id: "fronteiras_imigracao",
    category: "social",
    axis: "social",
    text: "Como nosso país deve tratar pessoas que vêm de fora (imigrantes) procurando abrigo ou trabalho?",
    subtext: "Fronteiras abertas vs. fronteiras fechadas. Devemos ver a humanidade como uma só família ou proteger nosso território primeiro?",
    leftOption: "Devemos abrir as portas e acolhê-los de braços abertos, oferecendo os mesmos direitos de saúde e trabalho que nós temos.",
    rightOption: "Devemos controlar as fronteiras com rigor para proteger nossos empregos, segurança e cultura primeiro.",
    neutralOption: "Acolher imigrantes, mas apenas os que vierem de forma legalizada e ordenada, sem prejudicar os serviços públicos locais."
  },
  {
    id: "escola_educacao",
    category: "social",
    axis: "social",
    text: "O que as escolas públicas devem ensinar para as crianças além de ler, escrever e fazer contas?",
    subtext: "Educação moral vs. Educação de livre questionamento. Quem deve guiar os valores éticos das novas gerações?",
    leftOption: "Devem ensinar sobre igualdade de gêneros, direitos humanos e liberdade de pensamento, para combater preconceitos antigos.",
    rightOption: "Devem focar em disciplina, patriotismo, respeito às autoridades e deixar os valores morais para os pais ensinarem em casa.",
    neutralOption: "Devem ensinar sobre convivência e direitos de forma neutra, focando mais em preparação para o trabalho e ciência."
  },
  {
    id: "comercio_industria",
    category: "econ",
    axis: "econ",
    text: "Como o governo deve tratar os donos de mercados, lojas e grandes empresas?",
    subtext: "Livre comércio vs. Controle público. O governo deve mandar na economia para evitar injustiças ou sair do caminho para gerar empregos?",
    leftOption: "Deve criar leis rígidas controlando preços e garantindo altos salários e direitos para os trabalhadores não serem explorados.",
    rightOption: "Deve deixar os preços livres e reduzir os impostos das empresas, facilitando a criação de novos negócios e empregos.",
    neutralOption: "Deixar os preços livres na maioria das coisas, mas vigiar para evitar que grandes empresas criem monopólios e explorem o povo."
  },
  {
    id: "pauta_ano_redes",
    category: "social",
    axis: "social",
    text: "A Pauta do Ano: Quem deve controlar o que é postado nas redes sociais na internet?",
    subtext: "O grande debate atual sobre mentiras (fake news), liberdade de expressão e a segurança das opiniões online.",
    leftOption: "Ninguém deve controlar. As redes sociais devem ser livres e as próprias pessoas decidem em quem acreditar.",
    rightOption: "A justiça deve ter o poder de apagar mentiras e ofensas que prejudicam a sociedade e punir os donos das redes.",
    neutralOption: "Criar regras simples e transparentes onde as próprias redes combatem notícias falsas sem censurar opiniões políticas."
  }
];

export const ARCHETYPES = [
  {
    name: "Defensor da Liberdade Individual",
    quadrant: "Libertário de Direita",
    description: "Você valoriza a liberdade em todos os sentidos! Acha que cada um deve cuidar da sua própria vida, corpo e dinheiro sem o governo se intrometer. Acredita no livre mercado e que o esforço pessoal é o verdadeiro motor do sucesso.",
    color: "bg-purple-100 border-purple-400 text-purple-900 dark:bg-purple-950/40 dark:border-purple-800 dark:text-purple-200",
    icon: "Unlock",
    econRange: [0, 1],
    socialRange: [-1, 0]
  },
  {
    name: "Zelador da Ordem Social",
    quadrant: "Autoritário de Direita",
    description: "Você acredita que para uma sociedade prosperar é preciso ter ordem, disciplina, leis firmes e respeito às tradições. Defende o livre comércio na economia, mas acha essencial proteger a família tradicional e os bons costumes coletivos.",
    color: "bg-blue-100 border-blue-400 text-blue-900 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-200",
    icon: "ShieldAlert",
    econRange: [0, 1],
    socialRange: [0, 1]
  },
  {
    name: "Amigo da Cooperação Livre",
    quadrant: "Libertário de Esquerda",
    description: "Você sonha com uma sociedade baseada no acolhimento, igualdade e liberdade real para todos. Acredita que o governo deve ajudar a dividir as riquezas de forma justa, mas sem controlar os corpos, as famílias ou a expressão individual das pessoas.",
    color: "bg-emerald-100 border-emerald-400 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-200",
    icon: "Heart",
    econRange: [-1, 0],
    socialRange: [-1, 0]
  },
  {
    name: "Protetor Comunitário",
    quadrant: "Autoritário de Esquerda",
    description: "Você prioriza a igualdade social e a proteção do povo acima de tudo! Acha que o governo deve controlar fortemente as riquezas e a economia para acabar com a desigualdade, além de ter regras firmes para organizar a sociedade e evitar mentiras ou desordem.",
    color: "bg-rose-100 border-rose-400 text-rose-900 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-200",
    icon: "Users",
    econRange: [-1, 0],
    socialRange: [0, 1]
  },
  {
    name: "Harmonioso Equilibrado",
    quadrant: "Centro Democrático",
    description: "Você prefere o caminho do meio! Acha que extremos não ajudam em nada. Defende o livre comércio com limites sociais, e acredita que a sociedade precisa de leis para manter a ordem, mas sem sufocar a liberdade e as novas ideias das pessoas.",
    color: "bg-amber-100 border-amber-400 text-amber-900 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-200",
    icon: "Scale",
    econRange: [-0.3, 0.3],
    socialRange: [-0.3, 0.3]
  }
];
