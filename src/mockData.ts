import { Student, User, ClassGroup, ActivityItem } from './types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-coord',
    name: 'Profa. Dra. Mariana Silva',
    cpf: '123.456.789-00',
    email: 'coordenacao@escola.edu.br',
    role: 'coordenador',
    isFirstAccess: false,
    password: 'Password123#',
  },
  {
    id: 'user-prof',
    name: 'Prof. Carlos Eduardo Mendes',
    cpf: '234.567.890-11',
    email: 'professor@escola.edu.br',
    role: 'professor',
    isFirstAccess: false,
    password: 'Password123#',
  },
  {
    id: 'user-pais',
    name: 'Marcos Vinicius de Oliveira (Pai)',
    cpf: '345.678.901-22',
    email: 'pais@familia.com',
    role: 'pais',
    isFirstAccess: false,
    password: 'Password123#',
    linkedStudentIds: ['student-1'],
  },
  {
    id: 'user-primeiro',
    name: 'Ana Carolina Peixoto',
    cpf: '456.789.012-33',
    email: 'ana.primeiroacesso@escola.edu.br',
    role: 'professor',
    isFirstAccess: true, // Aciona obrigatoriamente a tela de primeiro acesso (RF02/RF03)
    password: '456.789.012-33', // CPF como login e senha inicial
  },
];

export const INITIAL_CLASSES: ClassGroup[] = [
  { id: 'class-3a', name: '3º Ano A - Fundamental I', grade: '3º Ano', shift: 'Manhã', studentCount: 22 },
  { id: 'class-3b', name: '3º Ano B - Fundamental I', grade: '3º Ano', shift: 'Tarde', studentCount: 24 },
  { id: 'class-4a', name: '4º Ano A - Fundamental I', grade: '4º Ano', shift: 'Manhã', studentCount: 20 },
  { id: 'class-2c', name: '2º Ano C - Fundamental I', grade: '2º Ano', shift: 'Manhã', studentCount: 19 },
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'student-1',
    name: 'Lucas Gabriel de Oliveira',
    cpf: '567.890.123-44',
    age: 8,
    className: '3º Ano A - Fundamental I',
    skills: [
      'Excelente memória visual e espacial',
      'Compreensão rápida com ilustrações e esquemas',
      'Interesse elevado por astronomia e animais',
      'Boa motricidade ampla e sociabilidade em duplas'
    ],
    difficulties: [
      'Perda de concentração em textos extensos com fontes densas',
      'Hesitação em operações matemáticas abstratas sem material concreto',
      'Sobrecarga em transições rápidas de atividades sem aviso prévio'
    ],
    interests: ['Astronomia', 'Dinossauros', 'Construção com blocos de madeira', 'Histórias em quadrinhos'],
    learningLevel: 'Apoio Moderado',
    pedagogicalGoals: [
      'Consolidar operações de adição e subtração com recurso manipulativo',
      'Aumentar o tempo de foco em leitura compartilhada para 15 minutos contínuos',
      'Desenvolver autonomia na rotina diária através de checklist visual ilustrado'
    ],
    validatedStrategies: [
      'Cartões visuais sequenciais antes de cada atividade',
      'Uso de blocos coloridos e ábaco para ancoragem numérica',
      'Pausa motora de 1 minuto a cada 15 minutos de concentração'
    ],
    failedStrategies: [
      'Instruções orais com mais de 3 passos simultâneos sem apoio gráfico',
      'Avaliações exclusivamente dissertativas sem imagens explicativas'
    ],
    axesScores: {
      cognicao: 78,
      linguagem: 72,
      matematica: 68,
      motricidade: 86,
      funcoesExecutivas: 64,
      aspectosSocioemocionais: 80,
    },
    pei: {
      active: true,
      term: '2º Semestre Letivo - 2026',
      lastUpdated: '10/10/2026',
      goals: [
        'Meta PEI-01: Dominar cálculos aditivos de 2 dígitos usando material concreto e representação gráfica.',
        'Meta PEI-02: Localizar informações explícitas em parágrafos curtos ilustrados.',
        'Meta PEI-03: Seguir rotina de 4 etapas escolares com suporte de cronograma visual.'
      ],
      curricularAdaptations: [
        'Enunciados com fonte ampliada (mínimo 16pt) e espaçamento 1.5',
        'Permissão de resposta oral gravada ou apontamento ilustrado',
        'Tempo estendido (+50%) em atividades de fixação escrita'
      ]
    },
    recentHistory: [
      { id: 'hist-1', date: '04/11/2026', action: 'Atividade adaptada de Matemática aplicada em sala', author: 'Prof. Carlos' },
      { id: 'hist-2', date: '01/11/2026', action: 'Recalibragem semanal com avanço para Apoio Moderado', author: 'Sistema IA' },
      { id: 'hist-3', date: '28/10/2026', action: 'Atualização das estratégias validadas no PEI', author: 'Profa. Mariana' },
    ],
    pendingFeedbackActivityId: 'act-sample-1' // Trava de dependência de feedback ativa para demonstração da regra de negócio!
  },
  {
    id: 'student-2',
    name: 'Beatriz Vasconcelos Santos',
    cpf: '678.901.234-55',
    age: 8,
    className: '3º Ano A - Fundamental I',
    skills: [
      'Vocabulário oral rico e expressivo',
      'Grande capacidade de empatia e cooperação em grupo',
      'Boa retenção auditiva com cantigas e rimas'
    ],
    difficulties: [
      'Fadiga motora rápida na escrita manual cursiva',
      'Dificuldade de ordenação temporal em sequências longas',
      'Sensibilidade a ambientes com ruído sonoro elevado'
    ],
    interests: ['Música', 'Contação de histórias', 'Teatro de fantoches', 'Desenho livre'],
    learningLevel: 'Apoio Intensivo',
    pedagogicalGoals: [
      'Estimular coordenação motora fina com instrumentos adaptados',
      'Organizar narrativas com início, meio e fim em 3 cartões ilustrados',
      'Utilizar abafador sonoro nas atividades de grande agitação da turma'
    ],
    validatedStrategies: [
      'Grip ergonômico no lápis e prancheta inclinada',
      'Registro do aprendizado por áudio ou gravação oral',
      'Pistas musicais para marcar início e fim de tarefas'
    ],
    failedStrategies: [
      'Cópia de textos longos da lousa',
      'Atividades em folhas soltas sem margem visual demarcada'
    ],
    axesScores: {
      cognicao: 82,
      linguagem: 88,
      matematica: 65,
      motricidade: 58,
      funcoesExecutivas: 62,
      aspectosSocioemocionais: 90,
    },
    pei: {
      active: true,
      term: '2º Semestre Letivo - 2026',
      lastUpdated: '14/10/2026',
      goals: [
        'Meta PEI-B01: Produção oral estruturada de pequenas histórias com apoio de imagens.',
        'Meta PEI-B02: Exercícios de preensão palmar e motricidade com massa modelar e pinças.',
      ],
      curricularAdaptations: [
        'Substituição da cópia manual por textos impressos com lacunas para preenchimento pontual',
        'Uso de teclado adaptado ou aplicativo de transcrição de voz'
      ]
    },
    recentHistory: [
      { id: 'hist-b1', date: '03/11/2026', action: 'Avaliação contínua de linguagem registrada', author: 'Prof. Carlos' },
      { id: 'hist-b2', date: '29/10/2026', action: 'Revisão do PEI com fonoaudióloga e família', author: 'Profa. Mariana' }
    ],
    pendingFeedbackActivityId: null
  },
  {
    id: 'student-3',
    name: 'Gabriel Souza Ferreira',
    cpf: '789.012.345-66',
    age: 9,
    className: '4º Ano A - Fundamental I',
    skills: [
      'Raciocínio lógico dedutivo rápido',
      'Facilidade com leitura autônoma e gráficos',
      'Excelente memória para dados quantitativos'
    ],
    difficulties: [
      'Frustração acentuada quando comete pequenos erros em público',
      'Rigidez na mudança repentina de horários das aulas',
      'Relutância em aceitar trabalhos em grupo sem papéis pré-definidos'
    ],
    interests: ['Jogos de tabuleiro de estratégia', 'Robótica', 'Origamis', 'Matemática aplicada'],
    learningLevel: 'Independente',
    pedagogicalGoals: [
      'Desenvolver flexibilidade cognitiva diante de imprevistos',
      'Promover liderança positiva em atividades colaborativas com papéis rotativos',
      'Praticar estratégias de autorregulação emocional ao errar'
    ],
    validatedStrategies: [
      'Aviso prévio de 5 minutos antes de transições',
      'Definição clara e por escrito do papel de cada integrante no grupo',
      'Desafios com múltiplos caminhos de resposta correta'
    ],
    failedStrategies: [
      'Cobrança de agilidade sem tempo de planejamento prévio'
    ],
    axesScores: {
      cognicao: 92,
      linguagem: 86,
      matematica: 94,
      motricidade: 82,
      funcoesExecutivas: 76,
      aspectosSocioemocionais: 72,
    },
    pei: {
      active: false,
      term: 'Não aplicável',
      lastUpdated: '01/08/2026',
      goals: [],
      curricularAdaptations: []
    },
    recentHistory: [
      { id: 'hist-g1', date: '02/11/2026', action: 'Conclusão autônoma do módulo de frações com 95% de acerto', author: 'Prof. Carlos' }
    ],
    pendingFeedbackActivityId: null
  }
];

export const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-sample-1',
    studentId: 'student-1',
    title: 'Missão Espacial: Decolagem com Fichas Numéricas',
    pedagogicalAxis: 'Matemática',
    objective: 'Efetuar somas até 20 utilizando representação visual de foguetes e blocos de contagem',
    practicalExample: 'Cada foguete precisa de 10 blocos de combustível verde e 5 blocos amarelos para alcançar Marte. O aluno agrupa os blocos concretos antes de escrever o numeral.',
    visualResourceSuggestion: 'Cartões ilustrados de foguetes com grades de 10 compartimentos para encaixe de cubos coloridos.',
    bnccCompetencies: ['EF03MA05: Procedimentos de cálculo aditivo', 'Competência Geral 2: Pensamento científico e criativo'],
    peiGoalLinked: 'Meta PEI-01: Dominar cálculos aditivos de 2 dígitos usando material concreto e representação gráfica.',
    explicabilityJustification: 'Atividade recomendada devido ao índice de erro de 40% na avaliação anterior com formato puramente abstrato. A incorporação do tema de astronomia (interesse principal) e o apoio dos cubos de contagem reduzem a ansiedade e ancoram a representação mental da quantidade. (RF07 / DUA).',
    levels: {
      intensivo: {
        description: 'Mediação 1:1 com modelo guiado pelo professor e blocos de encaixe grandes com texturas táteis.',
        instructions: 'O educador preenche a primeira grade junto ao estudante, conferindo em voz alta cada bloco posicionado.'
      },
      moderado: {
        description: 'Execução em duplas com cartões numerados e apoio do ábaco visual.',
        instructions: 'O estudante resolve os desafios preenchendo as grades de combustível e conferindo no gabarito ilustrado.'
      },
      independente: {
        description: 'Desafio autônomo com registro em tabela e criação do próprio problema com foguetes.',
        instructions: 'O estudante formula 2 novos problemas para o colega de classe resolver usando os mesmos recursos.'
      }
    },
    targetLevel: 'Apoio Moderado',
    status: 'aplicada_pendente_feedback', // Deixa pendente para acionar a Trava de Dependência de Feedback (RF12)
    createdAt: '03/11/2026'
  }
];
