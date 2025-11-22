import React, { useState, useEffect, useRef } from 'react';
import { 
  Github, Linkedin, Mail, ExternalLink, Menu, X, MapPin, GraduationCap, 
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
  type: 'education' | 'work';
}
// --- CONSTANTS ---
// 导航栏链接配置
const NAV_LINKS = [
  { label: 'Home', href: 'hero' },
  { label: 'About', href: 'about' },
  { label: 'Projects', href: 'projects' },
  { label: 'Contact', href: 'contact' },
];

// 用户头像 URL
const AVATAR_URL = "/Labubu.JPG";

// 技能雷达图数据配置
const SKILLS_DATA: SkillData[] = [
  { subject: 'Algorithms', A: 95, fullMark: 100 },
  { subject: 'Frontend', A: 90, fullMark: 100 },
  { subject: 'Backend', A: 85, fullMark: 100 },
  { subject: 'AI/LLMs', A: 80, fullMark: 100 },
  { subject: 'DevOps', A: 70, fullMark: 100 },
  { subject: 'System Design', A: 75, fullMark: 100 },
];

const EXPERIENCES: ExperienceItem[] = [
  {
    id: 1,
    role: "Master's in Computer Science",
    company: "University of Technology",
    period: "2023 - Present",
    description: "Specializing in Distributed Systems and AI. GPA: 3.9/4.0. Researching adaptive caching algorithms for LLM inference.",
    type: "education"
  },
  {
    id: 2,
    role: "Backend Engineer Intern",
    company: "TechCorp Inc.",
    period: "Summer 2024",
    description: "Optimized API latency by 40% using Go and Redis. Implemented a microservices architecture for the payment gateway.",
    type: "work"
  },
  {
    id: 3,
    role: "B.S. in Computer Engineering",
    company: "State University",
    period: "2019 - 2023",
    description: "Graduated Magna Cum Laude. Capstone project: Autonomous Drone Navigation System.",
    type: "education"
  }
];

// 项目展示列表数据
const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Project 1',
    description: 'Waiting for description.',
    tags: ['React', 'TypeScript', 'WebGL', 'D3.js'],
    github: 'https://github.com',
    imageUrl: 'https://picsum.photos/600/400?random=1'
  },
  {
    id: '2',
    title: 'Project 2',
    description: 'Waiting for description.',
    tags: ['Go', 'Distributed Systems', 'Docker'],
    github: 'https://github.com',
    imageUrl: 'https://picsum.photos/600/400?random=2'
  },
  {
    id: '3',
    title: 'Project 3',
    description: 'Waiting for description.',
    tags: ['Python', 'LangChain', 'Gemini API', 'Next.js'],
    github: 'https://github.com',
    imageUrl: 'https://picsum.photos/600/400?random=3'
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
                I am a <TypewriterText texts={['Graduate Student', 'Frontend Developer', 'Tech Enthusiast']} />
                </h2>
              <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-4 tracking-tight">
                Hi, I'm <span className="text-[#7d8c8c]">Bono.</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed max-w-lg mx-auto md:mx-0">
                Exploring the synergy between <span className="font-semibold text-slate-700">AI-empowered Communication</span> and <span className="font-semibold text-slate-700">Satellite systems</span>. Building scalable solutions for the future.
              </p>
            </div>
            <div className="flex flex-col gap-3 text-slate-500 text-sm font-medium">
              <div className="flex items-center justify-center md:justify-start gap-2"><GraduationCap size={18} /><span>ShanghaiTech University</span></div>
              <div className="flex items-center justify-center md:justify-start gap-2"><MapPin size={18} /><span>Pudong New Area, Shanghai</span></div>
              <div className="flex items-center justify-center md:justify-start gap-2"><Mail size={18} /><span>zhujl2024@shanghaitech.edu.cn</span></div>
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
              <a href="mailto:zhujl2024@shanghaitech.edu.cn" className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-full font-medium transition-all shadow-lg shadow-slate-800/20 flex items-center gap-2">Contact Me <ChevronRight size={16} /></a>
              <a href="#" className="px-6 py-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 rounded-full font-medium transition-all shadow-sm hover:shadow flex items-center gap-2"><Download size={16} /> Resume</a>
              <div className="flex gap-2 ml-2">
                <a href="https://github.com/Renalssance" className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors"><Github size={20} /></a>
                <a href="#" className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors"><Linkedin size={20} /></a>
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
          <p>I specialize in building robust backend systems and intuitive frontend interfaces. My academic background has provided a strong foundation in algorithms, while my projects demonstrate practical application.</p>
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

        <section className="px-4 max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-12 text-center">
            Experience Timeline
          </h2>
          <ExperienceTimeline />
        </section>

        {/* 项目展示部分 */}
        <section id="projects" className="py-24 px-4 bg-slate-50/50 border-y border-slate-200/60">
          <div className="max-w-7xl mx-auto">
             <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-12 flex items-center gap-3">Selected Works</h2>
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {PROJECTS.map((project) => (
                  <div key={project.id} className="group relative rounded-2xl overflow-hidden bg-white border border-slate-200 hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/50 flex flex-col h-full">
                    <div className="aspect-video overflow-hidden bg-slate-100 relative shrink-0">
                      <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors duration-300" />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-slate-800 group-hover:text-[#64748b] transition-colors">{project.title}</h3>
                        <div className="flex gap-3">
                          {project.github && <a href={project.github} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-700 transition-colors"><Github size={20} /></a>}
                          {project.link && <a href={project.link} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-700 transition-colors"><ExternalLink size={20} /></a>}
                        </div>
                      </div>
                      <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mt-auto">
                        {project.tags.map(tag => <span key={tag} className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200">{tag}</span>)}
                      </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </section>

        {/* 联系方式部分 */}
        <section id="contact" className="px-4 text-center">
           <div className="max-w-2xl mx-auto glass-panel p-10 rounded-3xl border border-white shadow-lg">
             <p className="text-[#7d8c8c] font-bold tracking-widest uppercase mb-4">04. What's Next?</p>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">Get In Touch</h2>
             <p className="text-slate-500 mb-10 text-lg leading-relaxed">I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!</p>
             <a href="mailto:zhujl2024@shanghaitech.edu.cn" className="inline-flex items-center gap-2 px-8 py-4 bg-[#64748b] text-white hover:bg-[#475569] rounded-full font-bold transition-all shadow-lg shadow-slate-300 transform hover:scale-105"><Mail size={18} /> Say Hello</a>
             <div className="mt-12 flex justify-center gap-8 text-slate-400">
               <a href="https://github.com/Renalssance" className="hover:text-slate-700 hover:scale-110 transition-all"><Github size={28} /></a>
               <a href="#" className="hover:text-slate-700 hover:scale-110 transition-all"><Linkedin size={28} /></a>
             </div>
           </div>
        </section>
      </main>
      <footer className="py-8 text-center text-slate-400 text-sm"><p>© 2025 Bono.</p></footer>
    </div>
  );
};

export default App;
