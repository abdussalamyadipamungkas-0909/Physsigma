export type DetectiveRank = 
  | 'Junior Detective' 
  | 'Physics Investigator' 
  | 'Senior Investigator' 
  | 'Master of Physics';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  category: 'case' | 'lab' | 'quiz' | 'mastery';
}

export interface UserNote {
  id: string;
  caseId?: string;
  title: string;
  content: string;
  formulaDraft?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DetectiveProfile {
  name: string;
  codeName: string;
  avatar: string;
  rank: DetectiveRank;
  level: number;
  xp: number;
  casesSolvedCount: number;
  solvedCaseIds: string[];
  activeCaseId: string | null;
  achievements: Achievement[];
  notes: UserNote[];
  completedChallengeIds: string[];
}

export type CaseDifficulty = 'Pemula' | 'Menengah' | 'Lanjutan';

export type CaseCategory = 'Mekanika' | 'Energi' | 'Dinamika' | 'Gelombang' | 'Kelistrikan';

export interface CrimeEvidence {
  id: string;
  name: string;
  location: string;
  description: string;
  scientificRelevance: string;
  dataValue?: string;
  iconName: string;
}

export interface CaseHypothesisOption {
  id: string;
  statement: string;
  isScientificallySound: boolean;
  scientificFeedback: string;
}

export interface AnalysisQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  formulaTip?: string;
}

export interface CaseDeductionOption {
  id: string;
  verdict: string;
  explanation: string;
  isCorrect: boolean;
  physicsLaw: string;
}

export interface CaseFile {
  id: string;
  caseNumber: string;
  title: string;
  mystery: string;
  synopsis: string;
  category: CaseCategory;
  concepts: string[];
  difficulty: CaseDifficulty;
  xpReward: number;
  imageUrl: string;
  simulationType: 'free-fall' | 'energy-plane' | 'newton-force' | 'wave' | 'circuit';
  
  // Investigation stages
  observe: {
    incidentReport: string;
    witnessStatement: string;
    sceneVisualDescription: string;
    keyObservations: string[];
    guidingQuestions: string[];
  };
  
  evidenceList: CrimeEvidence[];
  
  hypotheses: CaseHypothesisOption[];
  
  experimentPreset: {
    title: string;
    goal: string;
    defaultVariables: Record<string, number | boolean | string>;
    instructions: string[];
  };
  
  analysisQuestions: AnalysisQuestion[];
  
  finalDeductions: CaseDeductionOption[];
}

export interface KnowledgeTopic {
  id: string;
  category: CaseCategory;
  title: string;
  summary: string;
  dailyPhenomenon: string;
  scientificExplanation: string;
  keyQuantities: {
    symbol: string;
    name: string;
    unit: string;
    meaning: string;
  }[];
  formulas: {
    formula: string;
    explanation: string;
  }[];
  exampleProblem: {
    scenario: string;
    known: string;
    question: string;
    solutionSteps: string[];
    finalAnswer: string;
  };
  relatedCaseId?: string;
}

export interface QuizQuestion {
  id: string;
  title: string;
  category: CaseCategory;
  difficulty: CaseDifficulty;
  scenario: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  points: number;
}
