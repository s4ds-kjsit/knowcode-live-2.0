export interface Project {
  id: string;
  teamName: string;
  members: string[];
  title: string;
  description: string;
  repoUrl?: string;
  demoUrl?: string;
  presentationUrl?: string;
}

export interface Judge {
  id: string;
  name: string;
  email: string;
  assignedProjects: string[];
}

export interface Criterion {
  id: string;
  name: string;
  description: string;
  maxScore: number;
}

export interface Score {
  projectId: string;
  judgeId: string;
  criterionId: string;
  score: number;
  feedback: string;
  timestamp: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'judge' | 'participant';
}