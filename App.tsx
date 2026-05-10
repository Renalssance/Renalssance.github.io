import React, { useState, useEffect, useRef } from 'react';
import { 
  Github, Mail, ExternalLink, Menu, X, MapPin, GraduationCap, 
  Download, ChevronRight,Briefcase, Calendar, ChevronDown
} from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, 
  ResponsiveContainer, Tooltip as RechartsTooltip, Radar as RechartsRadar
} from 'recharts';

// --- TYPES ---
// 定义项目数据结构
interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link?: string;
  github?: string;
  imageUrl: string;
}

interface Publication {
  id: string;
  title: string;
  authors: string;
  venue: string;
  description: string;
  tags: string[];
  link: string;
  doi: string;
  imageUrl: string;
}

// GitHub API 数据结构
interface GitHubStats {
  publicRepos: number;
  totalCommits: number;
  followers: number;
  accountAge: number;
}

interface GitHubRepo {
  name: string;
  description: string;
  html_url: string;
  language: string;
  stargazers_count: number;
}


// 定义技能数据结构，用于图表展示
interface SkillData {
  subject: string;
  A: number;
  fullMark: number;
}

interface ExperienceItem {
  id: number;
  role: string;
  company: string;
  period: string;
  description: string;
  type: 'education' | 'work' | 'research';
}
// --- CONSTANTS ---
// 导航栏链接配置
const NAV_LINKS = [
  { label: 'Home', href: 'hero' },
  { label: 'About', href: 'about' },
  { label: 'Research', href: 'experience' },
  { label: 'Projects', href: 'projects' },
  { label: 'Papers', href: 'papers' },
  { label: 'Contact', href: 'contact' },
];

// 用户头像 URL
const AVATAR_URL = "/Labubu.JPG";
const CONTACT_EMAIL = 'grandZJL@outlook.com';

// 技能雷达图数据配置
const SKILLS_DATA: SkillData[] = [
  { subject: 'Deep Learning', A: 90, fullMark: 100 },
  { subject: 'Wireless Comms', A: 88, fullMark: 100 },
  { subject: 'Agent Systems', A: 86, fullMark: 100 },
  { subject: 'Multimodal AI', A: 84, fullMark: 100 },
  { subject: 'Backend APIs', A: 80, fullMark: 100 },
  { subject: 'Frontend', A: 74, fullMark: 100 },
];

const EXPERIENCES: ExperienceItem[] = [
  {
    id: 1,
    role: "M.S. in Information and Communication Engineering",
    company: "ShanghaiTech University",
    period: "2024.09 - 2027.06",
    description: "My research interest lies in the task-oriented communication and satellite edge inference empowered by deep learning.",
    type: "education"
  },
  // {
  //   id: 2,
  //   role: "First Author, WCSP Conference Paper",
  //   company: "Fisher-Robust Information Bottleneck for Task-Oriented Communication with Noisy Data",
  //   period: "2024.10",
  //   description: "Proposed a Fisher-Robust Information Bottleneck framework for device-edge collaborative inference under noisy inputs and channel interference.",
  //   type: "research"
  // },
  // {
  //   id: 3,
  //   role: "First Author, TWC Journal Paper",
  //   company: "Robust Information Bottleneck for Satellite Edge Inference over MIMO Channel",
  //   period: "Major Revision",
  //   description: "Built a Source-Channel Robust Information Bottleneck framework for LEO satellite-ground collaborative inference over fading MIMO channels.",
  //   type: "research"
  // },
  {
    id: 2,
    role: "B.E. in Communication Engineering",
    company: "Southwest Jiaotong University",
    period: "2020.09 - 2024.06",
    description: "Core courses include Communication Principles, Computer Networks, and Digital Signal Processing.",
    type: "education"
  }
];

// 项目展示列表数据
const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Multi-Agent Travel Planning Assistant',
    description: 'A FastAPI, LangGraph, LangChain Agent, and Vue 3 travel planning system. It streams real LangGraph node progress, calls AMap MCP tools, retrieves built-in travel knowledge, generates structured itineraries, and improves plan quality through an evaluator-reviser loop.',
    tags: ['Python', 'LangGraph', 'LangChain', 'MCP', 'RAG', 'FastAPI', 'Vue3'],
    github: 'https://github.com/Renalssance/LangGraph-trip-planner',
    imageUrl: '/trip_agent.png'
  },
  // {
  //   id: '2',
  //   title: 'Remote-Sensing Disaster Multimodal LLM System',
  //   description: 'A multi-stage training and inference prototype for satellite disaster analysis, covering cloud detection, de-clouding, visual token learning, downstream reasoning, and report generation.',
  //   tags: ['Python', 'PyTorch', 'Transformers', 'ViT/VAE', 'LoRA', 'FastAPI'],
  //   imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80'
  // }
];

const PUBLICATIONS: Publication[] = [
  {
    id: 'frib-wcsp-2024',
    title: 'Fisher-Robust Information Bottleneck for Task-Oriented Communication with Noisy Data',
    authors: 'Jielin Zhu, Youlong Wu, Dingzhu Wen, Xuan Liu, Liqun Fu, Yuanming Shi',
    venue: '2024 16th International Conference on Wireless Communications and Signal Processing (WCSP), pp. 78-83',
    description: 'A WCSP 2024 conference paper on Fisher-robust information bottleneck for task-oriented communication with noisy data, focusing on compact and robust representations for communication-efficient inference.',
    tags: ['WCSP 2024', 'Task-Oriented Communication', 'Information Bottleneck', 'Noisy Data'],
    link: 'https://ieeexplore.ieee.org/abstract/document/10827769',
    doi: '10.1109/WCSP62071.2024.10827769',
    imageUrl: '/FR-IB.png'
  }
];



// --- SERVICES ---
// GitHub API 服务
const GITHUB_USERNAME = 'Renalssance';

const fetchGitHubStats = async (): Promise<GitHubStats> => {
  try {
    // 获取用户基本信息
    const userResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
    const userData = await userResponse.json();
    
    // 获取仓库信息
    const reposResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`);
    const reposData: GitHubRepo[] = await reposResponse.json();
    
    // 计算账户年龄
    const accountCreated = new Date(userData.created_at);
    const accountAge = Math.floor((Date.now() - accountCreated.getTime()) / (1000 * 60 * 60 * 24 * 365));
    
    // 估算总提交数（基于仓库数量的合理估算）
    const estimatedCommits = reposData.length * 50; // 平均每个仓库50个提交
    
    return {
      publicRepos: userData.public_repos || 0,
      totalCommits: estimatedCommits,
      followers: userData.followers || 0,
      accountAge: accountAge || 1
    };
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    // 返回默认值作为备用
    return {
      publicRepos: 12,
      totalCommits: 3500,
      followers: 98,
      accountAge: 3
    };
  }
};

// --- COMPONENTS ---

// 粒子背景组件：使用 HTML5 Canvas 实现交互式粒子动画效果
const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];
    
    // 鼠标交互位置初始化
    const mouse = { x: -1000, y: -1000, radius: 150 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    
    window.addEventListener('mousemove', handleMouseMove);

    // 处理窗口大小调整
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };
    
    window.addEventListener('resize', handleResize);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 粒子类定义
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

      // 更新粒子位置和鼠标交互逻辑
      update() {
        this.x += this.vx;
        this.y += this.vy;
        // 边界反弹
        if (this.x < 0 || this.x > canvas!.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas!.height) this.vy *= -1;

        // 鼠标排斥效果
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

    // 初始化粒子数组
    const initParticles = () => {
      particles = [];
      const numberOfParticles = (canvas.width * canvas.height) / 9000;
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
      }
    };

    // 动画循环
    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        // 绘制粒子间的连线
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

// 导航栏组件：包含响应式菜单和滚动效果
const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // 监听滚动事件以改变导航栏样式
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setScrollProgress(Number(scroll));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const scrollTo = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass-panel shadow-sm' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'py-3' : 'py-0'}`}>
          <div 
            onClick={() => scrollTo('hero')}
            className="flex-shrink-0 flex items-center gap-2 text-slate-700 font-bold text-xl cursor-pointer"
          >
            <span role="img" aria-label="rainbow" title="Rainbow" className="text-2xl">🌈</span>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {NAV_LINKS.map((link) => (
                <button 
                  key={link.label} 
                  onClick={() => scrollTo(link.href)} 
                  className="text-slate-500 hover:text-[#7d8c8c] hover:bg-slate-100/50 px-3 py-2 rounded-full text-sm font-medium transition-all"
                >
                  {link.label}
                </button>
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
      
      {/* Scroll Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-slate-200/50">
        <div 
          className="h-full bg-[#7d8c8c] transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {isOpen && (
        <div className="md:hidden glass-panel border-t border-slate-200 absolute w-full">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {NAV_LINKS.map((link) => (
              <button 
                key={link.label} 
                onClick={() => scrollTo(link.href)} 
                className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

// 3. Typewriter Component
const TypewriterText: React.FC<{ texts: string[] }> = ({ texts }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      const fullText = texts[currentTextIndex];
      
      if (isDeleting) {
        setCurrentText(fullText.substring(0, currentText.length - 1));
      } else {
        setCurrentText(fullText.substring(0, currentText.length + 1));
      }

      if (!isDeleting && currentText === fullText) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && currentText === '') {
        setIsDeleting(false);
        setCurrentTextIndex((prev) => (prev + 1) % texts.length);
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentTextIndex, texts]);

  return <span className="text-[#7d8c8c] font-semibold typing-cursor">{currentText}</span>;
};

// 4. Animated Counter Component
const AnimatedCounter: React.FC<{ end: number; label: string; suffix?: string; isLoading?: boolean }> = ({ end, label, suffix = '', isLoading = false }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isLoading || end === 0) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 2000;
          const increment = end / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, hasAnimated, isLoading]);

  return (
    <div ref={ref} className="text-center p-6 glass-panel rounded-2xl">
      <div className="text-4xl font-bold text-slate-700 mb-2">
        {isLoading ? (
          <div className="animate-pulse bg-slate-200 h-10 w-16 mx-auto rounded"></div>
        ) : (
          <>{count}{suffix}</>
        )}
      </div>
      <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold">{label}</div>
    </div>
  );
};

// 个人简介主页组件：展示头像和简短介绍
const ProfileHero: React.FC = () => {
  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <div id="hero" className="min-h-screen flex items-center justify-center relative pt-20 pb-10">
      <div className="max-w-5xl w-full px-4 z-10 flex flex-col items-center">
        <div className="glass-panel p-8 md:p-12 rounded-3xl flex flex-col md:flex-row items-center gap-10 md:gap-16 shadow-2xl shadow-slate-200/50 border border-white/60 animate-float">
          {/* 头像区域 */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full blur opacity-50 group-hover:opacity-75 transition duration-500"></div>
            <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white shadow-inner bg-slate-100">
              <img 
                src={AVATAR_URL} 
                alt="Profile Avatar" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  // 图片加载失败时显示备用头像
                  const target = e.target as HTMLImageElement;
                  target.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=Bono&backgroundColor=e6e6e6";
                }}
              />
            </div>
            <div className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg border border-slate-100 text-green-600">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          {/* 文本介绍区域 */}
          <div className="flex-1 text-center md:text-left space-y-6">
            <div>
              <h2 className="text-sm font-bold tracking-widest text-slate-500 uppercase mb-2">
                I am a <TypewriterText texts={['Graduate Student', 'AI Communication Researcher', 'Agentic App Builder']} />
                </h2>
              <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-4 tracking-tight">
                Hi, I'm <span className="text-[#7d8c8c]">Zhu Jielin.</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed max-w-lg mx-auto md:mx-0">
                I study <span className="font-semibold text-slate-700">AI-empowered communication</span>, <span className="font-semibold text-slate-700">satellite edge inference</span>, and practical agent systems that turn complex information into usable decisions.
              </p>
            </div>
            <div className="flex flex-col gap-3 text-slate-500 text-sm font-medium">
              <div className="flex items-center justify-center md:justify-start gap-2"><GraduationCap size={18} /><span>ShanghaiTech University</span></div>
              <div className="flex items-center justify-center md:justify-start gap-2"><MapPin size={18} /><span>Pudong New Area, Shanghai</span></div>
              <div className="flex items-center justify-center md:justify-start gap-2"><Mail size={18} /><span>{CONTACT_EMAIL}</span></div>
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
              <a href={`mailto:${CONTACT_EMAIL}`} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-full font-medium transition-all shadow-lg shadow-slate-800/20 flex items-center gap-2">Contact Me <ChevronRight size={16} /></a>
              <a href={`mailto:${CONTACT_EMAIL}?subject=Resume%20Request`} className="px-6 py-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 rounded-full font-medium transition-all shadow-sm hover:shadow flex items-center gap-2"><Download size={16} /> Request CV</a>
              <div className="flex gap-2 ml-2">
                <a href="https://github.com/Renalssance" aria-label="GitHub profile" className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors"><Github size={20} /></a>
                <a href={`mailto:${CONTACT_EMAIL}`} aria-label="Email contact" className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors"><Mail size={20} /></a>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={scrollToAbout}
          className="mt-12 text-slate-400 hover:text-slate-600 transition-colors animate-bounce"
        >
          <ChevronDown size={32} />
        </button>
      </div>
    </div>
  );
};

// 6. Experience Timeline Component
const ExperienceTimeline: React.FC = () => {
  return (
    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
      {EXPERIENCES.map((exp) => (
        <div key={exp.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          {/* Icon Marker */}
          <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-50 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:scale-110 group-hover:bg-[#7d8c8c] group-hover:text-white transition-all duration-300">
            {exp.type === 'education' ? <GraduationCap size={18} /> : <Briefcase size={18} />}
          </div>
          
          {/* Card */}
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-panel p-6 rounded-xl border border-white shadow-sm group-hover:shadow-md transition-all duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
              <h3 className="font-bold text-slate-800 text-lg">{exp.role}</h3>
              <time className="text-xs font-semibold text-[#7d8c8c] flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-full">
                <Calendar size={12} /> {exp.period}
              </time>
            </div>
            <div className="text-sm font-medium text-slate-600 mb-2">{exp.company}</div>
            <p className="text-slate-500 text-sm leading-relaxed">{exp.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// 技能图表组件：使用 Recharts 展示雷达图
const StatsAndSkills: React.FC = () => {
  const [gitHubStats, setGitHubStats] = useState<GitHubStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadGitHubStats = async () => {
      setIsLoading(true);
      const stats = await fetchGitHubStats();
      setGitHubStats(stats);
      setIsLoading(false);
    };
    
    loadGitHubStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6 flex items-center gap-3">
          About me
        </h2>
        <div className="space-y-6 text-lg text-slate-600 leading-relaxed mb-10">
          <p>I am a recommended master's student in Information and Communication Engineering at ShanghaiTech University. My work sits at the intersection of wireless communication, deep learning, and intelligent systems.</p>
          <p>Recently, I have been building agentic applications with LangGraph and RAG, while researching robust information bottleneck methods for task-oriented communication and satellite edge inference.</p>
        </div>
        
        {/* Animated Counters with GitHub Data */}
        <div className="grid grid-cols-2 gap-4">
           <AnimatedCounter 
             end={gitHubStats?.publicRepos || 0} 
             label="Projects" 
             isLoading={isLoading}
           />
           <AnimatedCounter 
             end={gitHubStats?.totalCommits || 0} 
             label="Commits" 
             suffix="+" 
             isLoading={isLoading}
           />
           <AnimatedCounter 
             end={gitHubStats?.accountAge || 0} 
             label="Years Coding" 
             isLoading={isLoading}
           />
           <AnimatedCounter 
             end={gitHubStats?.followers || 0} 
             label="Followers" 
             isLoading={isLoading}
           />
        </div>
      </div>
      
      <div id="skills" className="glass-panel p-8 rounded-3xl border border-white shadow-xl relative bg-white/40">
        <div className="absolute -top-4 -right-4 bg-[#7d8c8c] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg tracking-wide">TECHNICAL RADAR</div>
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
      </div>
    </div>
  );
};


// --- MAIN APP ---

// 主应用组件：组合所有部分
const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fdfbf7] text-slate-700 font-sans">
      <ParticleBackground />
      <NavBar />
      
      <main className="relative z-10 space-y-32 pb-32">
        <ProfileHero />

        {/* 关于我部分 */}
        <section id="about" className="py-32 px-4 bg-slate-50/50 border-y border-slate-200/60">
          <StatsAndSkills />
        </section>

        <section id="experience" className="px-4 max-w-4xl mx-auto scroll-mt-24">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-12 text-center">
            Education & Research
          </h2>
          <ExperienceTimeline />
        </section>

        {/* 项目展示部分 */}
        <section id="projects" className="px-4 max-w-5xl mx-auto scroll-mt-24">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-12 flex items-center gap-3">
            Selected Projects
          </h2>
          <div className="space-y-6">
            {PROJECTS.map((project) => (
              <article key={project.id} className="glass-panel overflow-hidden rounded-2xl border border-white shadow-sm hover:shadow-lg transition-all duration-300 bg-white/60">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-64 lg:w-72 shrink-0 bg-slate-100 p-3 flex items-center justify-center">
                    <img src={project.imageUrl} alt={project.title} className="w-full h-48 md:h-64 object-contain" />
                  </div>
                  <div className="flex-1 min-w-0 p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-3">
                      <h3 className="text-xl md:text-2xl font-bold text-slate-800 leading-snug">{project.title}</h3>
                      <div className="flex gap-3 shrink-0">
                        {project.github && (
                          <a href={project.github} target="_blank" rel="noreferrer" aria-label={`Open ${project.title} on GitHub`} className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors">
                            <Github size={20} />
                          </a>
                        )}
                        {project.link && (
                          <a href={project.link} target="_blank" rel="noreferrer" aria-label={`Open ${project.title}`} className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors">
                            <ExternalLink size={20} />
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="text-slate-500 leading-relaxed mb-5">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map(tag => <span key={tag} className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200">{tag}</span>)}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 论文展示部分 */}
        <section id="papers" className="px-4 max-w-5xl mx-auto scroll-mt-24">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-12 flex items-center gap-3">
            Publications
          </h2>
          <div className="space-y-6">
            {PUBLICATIONS.map((paper) => (
              <article key={paper.id} className="glass-panel overflow-hidden rounded-2xl border border-white shadow-sm hover:shadow-lg transition-all duration-300 bg-white/60">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-64 lg:w-72 shrink-0 bg-slate-100 p-3 flex items-center justify-center">
                    <img src={paper.imageUrl} alt={paper.title} className="w-full h-48 md:h-64 object-contain" />
                  </div>
                  <div className="flex-1 min-w-0 p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-3">
                      <h3 className="text-xl md:text-2xl font-bold text-slate-800 leading-snug">{paper.title}</h3>
                      <a href={paper.link} target="_blank" rel="noreferrer" aria-label={`Open ${paper.title}`} className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors shrink-0">
                        <ExternalLink size={20} />
                      </a>
                    </div>
                    <p className="text-sm font-semibold text-slate-600 mb-2">{paper.authors}</p>
                    <p className="text-sm text-[#64748b] font-medium mb-4">{paper.venue}</p>
                    <p className="text-slate-500 leading-relaxed mb-5">{paper.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {paper.tags.map(tag => <span key={tag} className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200">{tag}</span>)}
                    </div>
                    <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noreferrer" className="text-sm font-semibold text-[#64748b] hover:text-slate-800 inline-flex items-center gap-2">
                      DOI: {paper.doi}
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 联系方式部分 */}
        <section id="contact" className="px-4 text-center">
           <div className="max-w-2xl mx-auto glass-panel p-10 rounded-3xl border border-white shadow-lg">
             <p className="text-[#7d8c8c] font-bold tracking-widest uppercase mb-4">05. What's Next?</p>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">Get In Touch</h2>
             <p className="text-slate-500 mb-10 text-lg leading-relaxed">I am open to conversations about AI communication, satellite edge inference, multimodal systems, and agentic applications.</p>
             <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-2 px-8 py-4 bg-[#64748b] text-white hover:bg-[#475569] rounded-full font-bold transition-all shadow-lg shadow-slate-300 transform hover:scale-105"><Mail size={18} /> Say Hello</a>
             <div className="mt-12 flex justify-center gap-8 text-slate-400">
               <a href="https://github.com/Renalssance" aria-label="GitHub profile" className="hover:text-slate-700 hover:scale-110 transition-all"><Github size={28} /></a>
               <a href={`mailto:${CONTACT_EMAIL}`} aria-label="Email contact" className="hover:text-slate-700 hover:scale-110 transition-all"><Mail size={28} /></a>
             </div>
           </div>
        </section>
      </main>
      <footer className="py-8 text-center text-slate-400 text-sm"><p>© 2026 Zhu Jielin.</p></footer>
    </div>
  );
};

export default App;
