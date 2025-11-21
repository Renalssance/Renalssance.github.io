import React from 'react';
import { MapPin, Mail, GraduationCap, Github, Linkedin, Download, ChevronRight } from 'lucide-react';
import { AVATAR_URL } from '../constants';

const TerminalHero: React.FC = () => {
  return (
    <div id="hero" className="min-h-screen flex items-center justify-center relative pt-20 pb-10">
      <div className="max-w-5xl w-full px-4 z-10">
        <div className="glass-panel p-8 md:p-12 rounded-3xl flex flex-col md:flex-row items-center gap-10 md:gap-16 shadow-2xl shadow-slate-200/50 border border-white/60">
          
          {/* Avatar Section */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full blur opacity-50 group-hover:opacity-75 transition duration-500"></div>
            <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white shadow-inner bg-slate-100">
              <img 
                src={AVATAR_URL} 
                alt="Profile Avatar" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg border border-slate-100 text-green-600" title="Available for work">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Bio Section */}
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
              <div className="flex items-center justify-center md:justify-start gap-2">
                <GraduationCap size={18} />
                <span>M.S. in Computer Science @ University of Tech</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <MapPin size={18} />
                <span>San Francisco, CA</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Mail size={18} />
                <span>alex@example.com</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
              <a href="#contact" className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-full font-medium transition-all shadow-lg shadow-slate-800/20 flex items-center gap-2">
                Contact Me <ChevronRight size={16} />
              </a>
              <a href="#" className="px-6 py-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 rounded-full font-medium transition-all shadow-sm hover:shadow flex items-center gap-2">
                <Download size={16} /> Resume
              </a>
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

export default TerminalHero;