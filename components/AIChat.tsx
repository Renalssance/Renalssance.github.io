import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Sparkles, User, Bot } from 'lucide-react';
import { ChatMessage } from '../types';
import { generateChatResponse } from '../services/geminiService';

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hi! I'm Alex's AI Assistant. Ask me anything about his skills or projects.", timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: inputValue, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    // API Call
    const responseText = await generateChatResponse(userMsg.text, messages);
    
    const aiMsg: ChatMessage = { role: 'model', text: responseText, timestamp: new Date() };
    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="glass-panel mb-4 w-[320px] md:w-[380px] h-[500px] rounded-2xl flex flex-col overflow-hidden shadow-2xl shadow-slate-300/50 border border-white animate-[fadeIn_0.2s_ease-out] bg-white/80">
          {/* Header */}
          <div className="bg-slate-100/80 p-4 border-b border-slate-200 flex justify-between items-center backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="text-[#7d8c8c] w-5 h-5" />
              <h3 className="font-bold text-slate-700 text-sm">Assistant.ai</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-700 transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/40">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border border-white ${msg.role === 'model' ? 'bg-[#e0e7e9] text-[#64748b]' : 'bg-[#64748b] text-white'}`}>
                  {msg.role === 'model' ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className={`p-3 rounded-2xl text-sm max-w-[75%] shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-[#64748b] text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#e0e7e9] text-[#64748b] flex items-center justify-center flex-shrink-0 border border-white shadow-sm">
                  <Bot size={16} />
                </div>
                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 bg-white/80 border-t border-slate-200 flex gap-2 backdrop-blur-md">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about my experience..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-700 focus:outline-none focus:border-[#7d8c8c] focus:bg-white transition-all placeholder-slate-400"
            />
            <button 
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="p-2 bg-[#64748b] hover:bg-[#475569] disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl transition-colors shadow-md"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group p-4 rounded-full shadow-xl transition-all duration-300 border border-white/20 ${
          isOpen ? 'bg-slate-700 rotate-90 text-white' : 'bg-[#64748b] hover:bg-[#475569] hover:scale-110 text-white'
        }`}
      >
        {isOpen ? <X /> : <MessageSquare className="animate-pulse" />}
        {!isOpen && (
           <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-slate-800 text-white text-xs py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
             Ask AI Assistant
           </span>
        )}
      </button>
    </div>
  );
};

export default AIChat;