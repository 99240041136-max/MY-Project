export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  status: 'locked' | 'available' | 'completed';
  progress: number;
}

export interface UserProfile {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  interests: string[];
  language: string;
}
