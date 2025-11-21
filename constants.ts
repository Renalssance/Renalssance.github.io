import { Project, SkillData } from './types';

export const NAV_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

export const AVATAR_URL = "https://api.dicebear.com/7.x/avataaars/svg?seed=AlexChen&backgroundColor=e6e6e6";

export const SKILLS_DATA: SkillData[] = [
  { subject: 'Algorithms', A: 95, fullMark: 100 },
  { subject: 'Frontend', A: 90, fullMark: 100 },
  { subject: 'Backend', A: 85, fullMark: 100 },
  { subject: 'AI/LLMs', A: 80, fullMark: 100 },
  { subject: 'DevOps', A: 70, fullMark: 100 },
  { subject: 'System Design', A: 75, fullMark: 100 },
];

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Neural Vis',
    description: 'A real-time browser-based visualization tool for neural network activation layers using WebGL and React.',
    tags: ['React', 'TypeScript', 'WebGL', 'D3.js'],
    github: 'https://github.com',
    imageUrl: 'https://picsum.photos/600/400?random=1'
  },
  {
    id: '2',
    title: 'Distributed Cache',
    description: 'A high-performance distributed caching system implemented in Go, featuring consistent hashing and gossip protocol.',
    tags: ['Go', 'Distributed Systems', 'Docker'],
    github: 'https://github.com',
    imageUrl: 'https://picsum.photos/600/400?random=2'
  },
  {
    id: '3',
    title: 'Auto-Tutor AI',
    description: 'An LLM-powered application helping undergrads learn Data Structures, utilizing RAG for curriculum alignment.',
    tags: ['Python', 'LangChain', 'Gemini API', 'Next.js'],
    github: 'https://github.com',
    imageUrl: 'https://picsum.photos/600/400?random=3'
  }
];

export const SYSTEM_INSTRUCTION = `
You are an AI assistant for a computer science graduate student named Alex.
Your goal is to answer questions about Alex's background, skills, and projects in a professional, polite, and academic tone.

Here is Alex's Resume Context:
- **Education:** Master of Science in Computer Science (University of Tech, Current), GPA 3.9/4.0. BS in Computer Engineering.
- **Core Skills:** React, TypeScript, Python, Go, Distributed Systems, Machine Learning, Docker, Kubernetes.
- **Experience:** 
    - Intern at TechCorp (Backend Optimization)
    - Research Assistant at AI Lab (NLP Focus)
- **Projects:** Neural Vis (WebGL), Distributed Cache (Go), Auto-Tutor AI (GenAI).
- **Interests:** Open Source, Photography, minimalistic design.

If asked about contact info, direct them to the contact section or email alex@example.com.
`;