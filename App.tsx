import React from 'react';
import { Github, Linkedin, Mail, ExternalLink, Cpu, Server, Database } from 'lucide-react';
import NavBar from './components/NavBar';
import TerminalHero from './components/TerminalHero';
import SkillsChart from './components/SkillsChart';
import AIChat from './components/AIChat';
import ParticleBackground from './components/ParticleBackground';
import { PROJECTS } from './constants';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fdfbf7] text-slate-700 font-sans">
      <ParticleBackground />
      <NavBar />
      
      <main className="relative z-10">
        {/* Hero Section */}
        <TerminalHero />

        {/* About & Skills Section */}
        <section id="about" className="py-24 px-4 relative overflow-hidden">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <span className="text-[#7d8c8c]">01.</span> About Me
              </h2>
              <div className="space-y-4 text-lg text-slate-600 leading-relaxed">
                <p>
                  I am a Computer Science graduate student passionate about building scalable distributed systems and intelligent user interfaces.
                </p>
                <p>
                  My research focuses on the intersection of <span className="font-semibold text-[#64748b]">High Performance Computing</span> and <span className="font-semibold text-[#64748b]">Generative AI</span>. I enjoy decoding complex problems and turning them into efficient, elegant code.
                </p>
              </div>
              
              <div className="mt-10 grid grid-cols-3 gap-4">
                {[
                  { icon: Cpu, label: "Architecture" },
                  { icon: Server, label: "Backend" },
                  { icon: Database, label: "Data Eng" }
                ].map((item, i) => (
                   <div key={i} className="p-4 rounded-xl border border-slate-200 bg-white/50 shadow-sm flex flex-col items-center gap-3 hover:border-slate-300 transition-colors">
                     <item.icon className="text-[#7d8c8c]" size={24} />
                     <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{item.label}</span>
                   </div>
                ))}
              </div>
            </div>

            <div id="skills" className="glass-panel p-8 rounded-3xl border border-white shadow-xl relative bg-white/40">
               <div className="absolute -top-4 -right-4 bg-[#7d8c8c] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg tracking-wide">
                 SKILLS RADAR
               </div>
               <SkillsChart />
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-24 px-4 bg-slate-50/50 border-y border-slate-200/60">
          <div className="max-w-7xl mx-auto">
             <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-12 flex items-center gap-3">
                <span className="text-[#7d8c8c]">02.</span> Selected Works
              </h2>
             
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {PROJECTS.map((project) => (
                  <div key={project.id} className="group relative rounded-2xl overflow-hidden bg-white border border-slate-200 hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/50">
                    <div className="aspect-video overflow-hidden bg-slate-100 relative">
                      <img 
                        src={project.imageUrl} 
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      />
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
                      
                      <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed">
                        {project.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map(tag => (
                          <span key={tag} className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-32 px-4 text-center">
           <div className="max-w-2xl mx-auto">
             <p className="text-[#7d8c8c] font-bold tracking-widest uppercase mb-4">03. What's Next?</p>
             <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">Get In Touch</h2>
             <p className="text-slate-500 mb-10 text-lg leading-relaxed">
               I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
             </p>
             
             <a href="mailto:alex@example.com" className="inline-flex items-center gap-2 px-8 py-4 bg-[#64748b] text-white hover:bg-[#475569] rounded-full font-bold transition-all shadow-lg shadow-slate-300">
               <Mail size={18} /> Say Hello
             </a>

             <div className="mt-16 flex justify-center gap-8 text-slate-400">
               <a href="#" className="hover:text-slate-700 hover:scale-110 transition-all"><Github size={28} /></a>
               <a href="#" className="hover:text-slate-700 hover:scale-110 transition-all"><Linkedin size={28} /></a>
             </div>
           </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-400 text-sm">
        <p>© 2025 Alex Chen. Built with React & Gemini.</p>
      </footer>

      {/* AI Chat Floating Action Button */}
      <AIChat />
    </div>
  );
};

export default App;