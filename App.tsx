import React, { useState, useEffect, useRef } from 'react';
import { 
  Github, Linkedin, Mail, ExternalLink, Cpu, Server, Database, 
  Menu, X, Code, MapPin, GraduationCap, Download, ChevronRight,
  MessageSquare, Send, Sparkles, User, Bot
} from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, 
  ResponsiveContainer, Tooltip as RechartsTooltip, Radar as RechartsRadar
} from 'recharts';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// --- TYPES ---
interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link?: string;
  github?: string;
  imageUrl: string;
}

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

interface SkillData {
  subject: string;
  A: number;
  fullMark: number;
}

// --- CONSTANTS ---
const NAV_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

const AVATAR_URL = "https://api.dicebear.com/7.x/avataaars/svg?seed=AlexChen&backgroundColor=e6e6e6";

const SKILLS_DATA: SkillData[] = [
  { subject: 'Algorithms', A: 95, fullMark: 100 },
  { subject: 'Frontend', A: 90, fullMark: 100 },
  { subject: 'Backend', A: 85, fullMark: 100 },
  { subject: 'AI/LLMs', A: 80, fullMark: 100 },
  { subject: 'DevOps', A: 70, fullMark: 100 },
  { subject: 'System Design', A: 75, fullMark: 100 },
];

const PROJECTS: Project[] = [
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

const SYSTEM_INSTRUCTION = `
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

// --- SERVICES ---
let aiClient: GoogleGenAI | null = null;

const getClient = (): GoogleGenAI => {
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return aiClient;
};

const generateChatResponse = async (
  userMessage: string,
  history: { role: 'user' | 'model'; text: string }[]
): Promise<string> => {
  try {
    const ai = getClient();
    const conversationContext = history.map(h => `${h.role === 'user' ? 'User' : 'AlexAI'}: ${h.text}`).join('\n');
    const fullPrompt = `
      Recent Conversation:
      ${conversationContext}
      User: ${userMessage}
      AlexAI:
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    return response.text || "Connection interrupted. Try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to neural net. Please verify API Key.";
  }
};

// --- COMPONENTS ---

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];
    
    const mouse = { x: -1000, y: -1000, radius: 150 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    
    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };
    
    window.addEventListener('resize', handleResize);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      density: number;
      color: string;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
        this.density = (Math.random() * 30) + 1;
        this.color = 'rgba(100, 116, 139, 0.6)'; 
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas!.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas!.height) this.vy *= -1;

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const maxDistance = mouse.radius;
          const force = (maxDistance - distance) / maxDistance;
          const directionX = forceDirectionX * force * this.density;
          const directionY = forceDirectionY * force * this.density;
          this.x -= directionX;
          this.y -= directionY;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      const numberOfParticles = (canvas.width * canvas.height) / 9000;
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
      }
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(148, 163, 184, ${1 - distance / 100})`; 
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.closePath();
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    initParticles();
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" />;
};

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass-panel py-3 shadow-sm' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0 flex items-center gap-2 text-slate-700 font-bold text-xl">
            <Code className="text-slate-500" /> alex.dev
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {NAV_LINKS.map((link) => (
                <a key={link.label} href={link.href} className="text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 px-3 py-2 rounded-full text-sm font-medium transition-all">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 focus:outline-none">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden glass-panel border-t border-slate-200 absolute w-full">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {NAV_LINKS.map((link) => (
              <a key={link.label} href={link.href} onClick={() => setIsOpen(false)} className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 block px-3 py-2 rounded-md text-base font-medium">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

const ProfileHero: React.FC = () => {
  return (
    <div id="hero" className="min-h-screen flex items-center justify-center relative pt-20 pb-10">
      <div className="max-w-5xl w-full px-4 z-10">
        <div className="glass-panel p-8 md:p-12 rounded-3xl flex flex-col md:flex-row items-center gap-10 md:gap-16 shadow-2xl shadow-slate-200/50 border border-white/60">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full blur opacity-50 group-hover:opacity-75 transition duration-500"></div>
            <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white shadow-inner bg-slate-100">
              <img src={AVATAR_URL} alt="Profile Avatar" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg border border-slate-100 text-green-600" title="Available for work">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="flex-1 text-center md:text-left space-y-6">
            <div>
              <h2 className="text-sm font-bold tracking-widest text-slate-500 uppercase mb-2">Computer Science Graduate</h2>
              <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-4 tracking-tight">
                Hi, I'm <span className="morandi-gradient-text">Alex</span>.
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed max-w-lg mx-auto md:mx-0">
                Exploring the synergy between <span className="font-semibold text-slate-700">Distributed Systems</span> and <span className="font-semibold text-slate-700">Artificial Intelligence</span>. Building scalable solutions for the future.
              </p>
            </div>
            <div className="flex flex-col gap-3 text-slate-500 text-sm font-medium">
              <div className="flex items-center justify-center md:justify-start gap-2"><GraduationCap size={18} /><span>M.S. in Computer Science @ University of Tech</span></div>
              <div className="flex items-center justify-center md:justify-start gap-2"><MapPin size={18} /><span>San Francisco, CA</span></div>
              <div className="flex items-center justify-center md:justify-start gap-2"><Mail size={18} /><span>alex@example.com</span></div>
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
              <a href="#contact" className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-full font-medium transition-all shadow-lg shadow-slate-800/20 flex items-center gap-2">Contact Me <ChevronRight size={16} /></a>
              <a href="#" className="px-6 py-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 rounded-full font-medium transition-all shadow-sm hover:shadow flex items-center gap-2"><Download size={16} /> Resume</a>
              <div className="flex gap-2 ml-2">
                <a href="#" className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors"><Github size={20} /></a>
                <a href="#" className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors"><Linkedin size={20} /></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SkillsChart: React.FC = () => {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={SKILLS_DATA}>
          <PolarGrid stroke="#94a3b8" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 12, fontFamily: 'sans-serif', fontWeight: 600 }} />
          <RechartsRadar name="Skill Level" dataKey="A" stroke="#6b7280" strokeWidth={2} fill="#7d8c8c" fillOpacity={0.5} />
          <RechartsTooltip 
            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderColor: '#e2e8f0', color: '#334155', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            itemStyle={{ color: '#64748b' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hi! I'm Alex's AI Assistant. Ask me anything about his skills or projects.", timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => scrollToBottom(), [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    const userMsg: ChatMessage = { role: 'user', text: inputValue, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);
    const responseText = await generateChatResponse(userMsg.text, messages);
    const aiMsg: ChatMessage = { role: 'model', text: responseText, timestamp: new Date() };
    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="glass-panel mb-4 w-[320px] md:w-[380px] h-[500px] rounded-2xl flex flex-col overflow-hidden shadow-2xl shadow-slate-300/50 border border-white animate-[fadeIn_0.2s_ease-out] bg-white/80">
          <div className="bg-slate-100/80 p-4 border-b border-slate-200 flex justify-between items-center backdrop-blur-sm">
            <div className="flex items-center gap-2"><Sparkles className="text-[#7d8c8c] w-5 h-5" /><h3 className="font-bold text-slate-700 text-sm">Assistant.ai</h3></div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-700 transition-colors"><X size={18} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/40">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border border-white ${msg.role === 'model' ? 'bg-[#e0e7e9] text-[#64748b]' : 'bg-[#64748b] text-white'}`}>
                  {msg.role === 'model' ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className={`p-3 rounded-2xl text-sm max-w-[75%] shadow-sm ${msg.role === 'user' ? 'bg-[#64748b] text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#e0e7e9] text-[#64748b] flex items-center justify-center flex-shrink-0 border border-white shadow-sm"><Bot size={16} /></div>
                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSend} className="p-3 bg-white/80 border-t border-slate-200 flex gap-2 backdrop-blur-md">
            <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Ask about my experience..." className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-700 focus:outline-none focus:border-[#7d8c8c] focus:bg-white transition-all placeholder-slate-400" />
            <button type="submit" disabled={isLoading || !inputValue.trim()} className="p-2 bg-[#64748b] hover:bg-[#475569] disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl transition-colors shadow-md"><Send size={18} /></button>
          </form>
        </div>
      )}
      <button onClick={() => setIsOpen(!isOpen)} className={`group p-4 rounded-full shadow-xl transition-all duration-300 border border-white/20 ${isOpen ? 'bg-slate-700 rotate-90 text-white' : 'bg-[#64748b] hover:bg-[#475569] hover:scale-110 text-white'}`}>
        {isOpen ? <X /> : <MessageSquare className="animate-pulse" />}
        {!isOpen && <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-slate-800 text-white text-xs py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">Ask AI Assistant</span>}
      </button>
    </div>
  );
};

// --- MAIN APP ---

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fdfbf7] text-slate-700 font-sans">
      <ParticleBackground />
      <NavBar />
      
      <main className="relative z-10">
        <ProfileHero />

        <section id="about" className="py-24 px-4 relative overflow-hidden">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <span className="text-[#7d8c8c]">01.</span> About Me
              </h2>
              <div className="space-y-4 text-lg text-slate-600 leading-relaxed">
                <p>I am a Computer Science graduate student passionate about building scalable distributed systems and intelligent user interfaces.</p>
                <p>My research focuses on the intersection of <span className="font-semibold text-[#64748b]">High Performance Computing</span> and <span className="font-semibold text-[#64748b]">Generative AI</span>. I enjoy decoding complex problems and turning them into efficient, elegant code.</p>
              </div>
              <div className="mt-10 grid grid-cols-3 gap-4">
                {[{ icon: Cpu, label: "Architecture" }, { icon: Server, label: "Backend" }, { icon: Database, label: "Data Eng" }].map((item, i) => (
                   <div key={i} className="p-4 rounded-xl border border-slate-200 bg-white/50 shadow-sm flex flex-col items-center gap-3 hover:border-slate-300 transition-colors">
                     <item.icon className="text-[#7d8c8c]" size={24} />
                     <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{item.label}</span>
                   </div>
                ))}
              </div>
            </div>
            <div id="skills" className="glass-panel p-8 rounded-3xl border border-white shadow-xl relative bg-white/40">
               <div className="absolute -top-4 -right-4 bg-[#7d8c8c] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg tracking-wide">SKILLS RADAR</div>
               <SkillsChart />
            </div>
          </div>
        </section>

        <section id="projects" className="py-24 px-4 bg-slate-50/50 border-y border-slate-200/60">
          <div className="max-w-7xl mx-auto">
             <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-12 flex items-center gap-3"><span className="text-[#7d8c8c]">02.</span> Selected Works</h2>
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {PROJECTS.map((project) => (
                  <div key={project.id} className="group relative rounded-2xl overflow-hidden bg-white border border-slate-200 hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/50">
                    <div className="aspect-video overflow-hidden bg-slate-100 relative">
                      <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors duration-300" />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-slate-800 group-hover:text-[#64748b] transition-colors">{project.title}</h3>
                        <div className="flex gap-3">
                          {project.github && <a href={project.github} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-700 transition-colors"><Github size={20} /></a>}
                          {project.link && <a href={project.link} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-700 transition-colors"><ExternalLink size={20} /></a>}
                        </div>
                      </div>
                      <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map(tag => <span key={tag} className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200">{tag}</span>)}
                      </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </section>

        <section id="contact" className="py-32 px-4 text-center">
           <div className="max-w-2xl mx-auto">
             <p className="text-[#7d8c8c] font-bold tracking-widest uppercase mb-4">03. What's Next?</p>
             <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">Get In Touch</h2>
             <p className="text-slate-500 mb-10 text-lg leading-relaxed">I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!</p>
             <a href="mailto:alex@example.com" className="inline-flex items-center gap-2 px-8 py-4 bg-[#64748b] text-white hover:bg-[#475569] rounded-full font-bold transition-all shadow-lg shadow-slate-300"><Mail size={18} /> Say Hello</a>
             <div className="mt-16 flex justify-center gap-8 text-slate-400">
               <a href="#" className="hover:text-slate-700 hover:scale-110 transition-all"><Github size={28} /></a>
               <a href="#" className="hover:text-slate-700 hover:scale-110 transition-all"><Linkedin size={28} /></a>
             </div>
           </div>
        </section>
      </main>
      <footer className="py-8 text-center text-slate-400 text-sm"><p>© 2025 Alex Chen. Built with React & Gemini.</p></footer>
      <AIChat />
    </div>
  );
};

export default App;
