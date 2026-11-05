export type UserRole = 'coordenador' | 'professor' | 'pais' | 'aluno';

export type LearningLevel = 'Apoio Intensivo' | 'Apoio Moderado' | 'Independente';

export interface User {
  id: string;
  name: string;
  cpf: string;
  email: string;
  role: UserRole;
  isFirstAccess: boolean;
  password?: string;
  linkedStudentIds?: string[]; // Para perfil 'pais'
  avatarUrl?: string;
}

export interface PeiData {
  active: boolean;
  goals: string[];
  curricularAdaptations: string[];
  term: string;
  lastUpdated: string;
}

export interface DevelopmentalAxes {
  cognicao: number;          // 0 to 100
  linguagem: number;
  matematica: number;
  motricidade: number;
  funcoesExecutivas: number;
  aspectosSocioemocionais?: number;
}

export interface ActivityLevels {
  intensivo: {
    description: string;
    instructions: string;
  };
  moderado: {
    description: string;
    instructions: string;
  };
  independente: {
    description: string;
    instructions: string;
  };
}

export interface ActivityFeedback {
  qualitative: {
    engagement: string;
    autonomy: string;
    barriers: string;
  };
  quantitative: {
    scorePercent: number;
    completionTimeMinutes: number;
    grade?: string;
  };
  submittedBy: string;
  submittedAt: string;
}

export interface ActivityItem {
  id: string;
  studentId: string;
  title: string;
  pedagogicalAxis: 'Cognição' | 'Linguagem' | 'Matemática' | 'Motricidade' | 'Aspectos socioemocionais' | 'Funções executivas';
  objective: string;
  practicalExample: string;
  visualResourceSuggestion: string;
  bnccCompetencies: string[];
  peiGoalLinked?: string;
  explicabilityJustification: string;
  levels: ActivityLevels;
  targetLevel: LearningLevel;
  status: 'pendente_aplicacao' | 'aplicada_pendente_feedback' | 'concluida_com_feedback';
  feedback?: ActivityFeedback;
  createdAt: string;
}

export interface Student {
  id: string;
  name: string;
  cpf: string;
  age: number;
  className: string;
  shift?: 'Manhã' | 'Tarde' | 'Integral';
  room?: string;
  skills: string[];
  difficulties: string[];
  interests: string[];
  learningLevel: LearningLevel;
  pedagogicalGoals: string[];
  validatedStrategies: string[];
  failedStrategies: string[];
  axesScores: DevelopmentalAxes;
  pei: PeiData;
  recentHistory: Array<{
    id: string;
    date: string;
    action: string;
    author: string;
  }>;
  pendingFeedbackActivityId?: string | null;
}

export interface ClassGroup {
  id: string;
  name: string;
  grade: string;
  shift: 'Manhã' | 'Tarde' | 'Integral';
  studentCount: number;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  fontSize: 'normal' | 'large' | 'extralarge';
  reducedMotion: boolean;
  screenReaderFeedback: boolean;
}
