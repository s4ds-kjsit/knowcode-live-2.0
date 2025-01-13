import { create } from 'zustand';
import { Project, Judge, Score, User, Criterion } from '../types';

interface AppState {
  projects: Project[];
  judges: Judge[];
  scores: Score[];
  currentUser: User | null;
  criteria: Criterion[];
  addProject: (project: Project) => void;
  addScore: (score: Score) => void;
  setCurrentUser: (user: User | null) => void;
}

export const useStore = create<AppState>((set) => ({
  projects: [],
  judges: [],
  scores: [],
  currentUser: null,
  criteria: [
    {
      id: '1',
      name: 'Innovation',
      description: 'Originality and creativity of the solution',
      maxScore: 10,
    },
    {
      id: '2',
      name: 'Technical Execution',
      description: 'Quality of implementation and technical complexity',
      maxScore: 10,
    },
    {
      id: '3',
      name: 'Impact',
      description: 'Potential impact and practical applicability',
      maxScore: 10,
    },
    {
      id: '4',
      name: 'Presentation',
      description: 'Quality of presentation and demo',
      maxScore: 10,
    },
  ],
  addProject: (project) =>
    set((state) => ({ projects: [...state.projects, project] })),
  addScore: (score) => set((state) => ({ scores: [...state.scores, score] })),
  setCurrentUser: (user) => set({ currentUser: user }),
}));