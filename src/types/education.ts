export interface Article {
  id: string;
  title: string;
  content: string;
  category: 'meteorology' | 'phenomena' | 'climate' | 'instruments';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  imageUrl?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WeatherPhenomenon {
  id: string;
  name: string;
  description: string;
  explanation: string;
  causes: string[];
  effects: string[];
  imageUrl?: string;
  videoUrl?: string;
  animation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  timeLimit?: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  imageUrl?: string;
}

export interface InteractiveMaterial {
  id: string;
  title: string;
  type: 'simulation' | 'experiment' | 'visualization' | 'game';
  content: string;
  instructions: string[];
  ageGroup: 'children' | 'teenager' | 'adult';
  requirements?: string[];
}

export interface KidsContent {
  id: string;
  title: string;
  description: string;
  content: string;
  ageRange: [number, number];
  type: 'story' | 'game' | 'activity' | 'experiment';
  difficulty: 'easy' | 'medium' | 'hard';
  parentGuidance?: string;
  materials?: string[];
  imageUrl?: string;
}

export interface WeatherAnimation {
  id: string;
  type: string;
  conditions: string[];
  dayTime: 'day' | 'night' | 'both';
  intensity?: number;
  duration?: number;
  loop?: boolean;
}

export interface GestureControl {
  name: string;
  gesture: string;
  action: string;
  component: string;
  enabled: boolean;
} 