// src/components/Projects/types.ts

export interface Project {
  id: number;
  name: string;
  client: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  progress: number;
  teamSize: number;
  description: string;
  technologies: string[];
}

export const PROJECT_STATUSES = {
  planning: { label: 'Plánovanie', color: 'bg-gray-100 text-gray-800' },
  active: { label: 'Aktívny', color: 'bg-blue-100 text-blue-800' },
  'on-hold': { label: 'Pozastavený', color: 'bg-yellow-100 text-yellow-800' },
  completed: { label: 'Dokončený', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Zrušený', color: 'bg-red-100 text-red-800' }
} as const;

// Zoznam dostupných technológií
export const AVAILABLE_TECHNOLOGIES = [
  'React', 'Vue.js', 'Angular', 'Next.js', 'Node.js', 'Express', 
  'PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'TypeScript', 'JavaScript',
  'Python', 'Django', 'FastAPI', 'Java', 'Spring Boot', 'PHP', 'Laravel',
  'React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'AWS', 'Docker',
  'Kubernetes', 'GraphQL', 'REST API', 'Git', 'CI/CD', 'Tailwind CSS'
];

// Zoznam klientov (v reálnej app by sa načítavali z API)
export const AVAILABLE_CLIENTS = [
  'TechCorp s.r.o.',
  'FitLife SK',
  'GlobalSales a.s.',
  'StartupHub',
  'DataFlow s.r.o.',
  'Innovation Labs',
  'Digital Solutions SK',
  'CloudTech a.s.',
  'SmartRetail SK',
  'FinTech Solutions'
];