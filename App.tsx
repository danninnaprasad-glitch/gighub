
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PageView, Job, BlogPost } from './types';
import { fetchJobs } from './services/jobService';
import { getAiSuggestions } from './services/geminiService';
import { MOCK_BLOGS, FORMSPREE_URL, ADMIN_PASSCODE } from './constants';
import Hero3D from './components/Hero3D';
import JobCard from './components/JobCard';
import { GoogleGenAI } from "@google/genai";

// --- UI HELPERS ---

const SocialIcon = ({ name }: { name: string }) => {
  const icons: Record<string, React.JSX.Element> = {
    twitter: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z"/></svg>,
    linkedin: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>,
    github: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>,
    discord: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037 19.736 19.736 0 0 0-4.885 1.515.069.069 0 0 0-.032.027C.533 9.048-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084-.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>,
    youtube: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.612 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>,
    instagram: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 1.764.308 2.251.792.484.484.73 1.022.792 2.251.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.308 1.764-.792 2.251-.484.484-1.022.73-2.251.792-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-1.764-.308-2.251-.792-.484-.484-.73-1.022-.792-2.251-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.308-1.764.792-2.251.484-.484 1.022-.73 2.251-.792 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-1.28.058-2.154.262-2.92.559-.792.307-1.463.719-2.133 1.389s-1.082 1.341-1.389 2.133c-.297.766-.501 1.64-.559 2.92-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.058 1.28.262 2.154.559 2.92.307.792.719 1.463 1.389 2.133s1.341 1.082 2.133 1.389c.766.297 1.64.501 2.92.559 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.28-.058 2.154-.262 2.92-.559.792-.307 1.463-.719 2.133-1.389s1.082-1.341-1.389-2.133c.297-.766.501-1.64.559-2.92.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.058-1.28-.262-2.154-.559-2.92-.307-.792-.719-1.463-1.389-2.133s-1.341-1.082-2.133-1.389c-.766-.297-1.64-.501-2.92-.559-1.28-.058-1.688-.072-4.947-.072zM12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>,
    facebook: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
  };
  return icons[name] || <span>{name.charAt(0)}</span>;
};

const Navbar: React.FC<{ setView: (v: PageView) => void, active: PageView }> = ({ setView, active }) => (
  <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-emerald-50 shadow-sm px-6 py-5 text-left">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <div className="text-2xl font-black text-emerald-700 cursor-pointer flex items-center gap-2" onClick={() => setView(PageView.HOME)}>
        <div className="bg-emerald-600 text-white p-1 rounded-xl shadow-lg shadow-emerald-100">GH</div> GigHub
      </div>
      <div className="hidden md:flex gap-10 text-[10px] font-black uppercase tracking-[0.2em]">
        {[PageView.HOME, PageView.JOBS, PageView.BLOG, PageView.ABOUT, PageView.CONTACT].map(v => (
          <button key={v} onClick={() => setView(v)} className={`${active === v || (active === PageView.BLOG_POST && v === PageView.BLOG) ? 'text-emerald-700 border-b-2 border-rose-400' : 'text-gray-400 hover:text-emerald-600'} transition-all py-1 font-bold`}>
            {v}
          </button>
        ))}
      </div>
      <button onClick={() => setView(PageView.ADMIN)} className={`font-black py-2 px-6 rounded-xl text-[10px] uppercase tracking-widest transition-all ${active === PageView.ADMIN ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-100' : 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100'}`}>
        Admin Portal
      </button>
    </div>
  </nav>
);

const Footer: React.FC<{ setView: (v: PageView) => void, social: any, totalVisits: number, activeUsers: number, footerText: string }> = ({ setView, social, totalVisits, activeUsers, footerText }) => (
  <footer className="relative z-20 bg-white border-t border-emerald-50 py-24 mt-auto w-full text-left font-medium">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16">
      <div className="col-span-1 md:col-span-2">
        <h3 className="text-3xl font-black text-emerald-700 mb-6 tracking-tighter">GigHub</h3>
        <p className="text-gray-500 text-sm max-w-sm mb-10 leading-relaxed font-medium">{footerText}</p>
        <div className="mb-10 flex gap-6 items-center">
          <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
            <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">{activeUsers} Online</span>
          </div>
          <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
             <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{totalVisits.toLocaleString()} Total Hits</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          {Object.entries(social).map(([key, url]) => url && (
            <a key={key} href={url as string} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-emerald-600 hover:text-white transition-all cursor-pointer shadow-sm group" title={key}>
              <SocialIcon name={key} />
            </a>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-black text-gray-900 mb-6 uppercase text-[10px] tracking-[0.3em]">Platform</h4>
        <ul className="text-sm text-gray-500 space-y-4 font-bold">
            <li><button onClick={() => setView(PageView.JOBS)} className="hover:text-emerald-600 transition-colors">Discovery Grid</button></li>
            <li><button onClick={() => setView(PageView.BLOG)} className="hover:text-emerald-600 transition-colors">Neural Insights</button></li>
            <li><button onClick={() => setView(PageView.FAQ)} className="hover:text-emerald-600 transition-colors">Node Support</button></li>
        </ul>
      </div>
      <div>
        <h4 className="font-black text-gray-900 mb-6 uppercase text-[10px] tracking-[0.3em]">Legal Nodes</h4>
        <ul className="text-sm text-gray-500 space-y-4 font-bold">
            <li><button onClick={() => setView(PageView.PRIVACY)} className="hover:text-emerald-600 transition-colors">Data Privacy</button></li>
            <li><button onClick={() => setView(PageView.TERMS)} className="hover:text-emerald-600 transition-colors">Grid Usage Terms</button></li>
            <li><button onClick={() => setView(PageView.COOKIES)} className="hover:text-emerald-600 transition-colors">Cookie Logic</button></li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-6 mt-20 pt-10 border-t border-emerald-50 text-center text-[10px] font-black uppercase tracking-widest text-emerald-200">
      <p>© 2026 GigHub — Sustainable Intelligence Infrastructure | Cloudflare Secure</p>
    </div>
  </footer>
);

// --- MAIN APPLICATION ---

export default function App() {
  const [view, setView] = useState<PageView>(PageView.HOME);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem('gh_blogs');
    return saved ? JSON.parse(saved) : MOCK_BLOGS;
  });
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [passcode, setPasscode] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [userSkillsInput, setUserSkillsInput] = useState('');
  
  // Persistence States (Admin Controlled)
  const [socialLinks, setSocialLinks] = useState(() => {
    const s = localStorage.getItem('gh_social');
    return s ? JSON.parse(s) : { twitter: 'https://twitter.com', linkedin: 'https://linkedin.com', github: 'https://github.com', discord: '', youtube: '', instagram: '', facebook: '' };
  });
  const [footerText, setFooterText] = useState(() => localStorage.getItem('gh_footer_text') || 'The definitive interface for the post-AGI labor market. We synchronize human potential with global compute.');
  const [contactInfo, setContactInfo] = useState(() => {
    const c = localStorage.getItem('gh_contact');
    return c ? JSON.parse(c) : { 
      email: 'node-alpha@gighub.ai', 
      address: 'Neo-Tech District, SG 129033', 
      phone: '+1 (555) 010-2026' 
    };
  });
  
  // AI Assistant
  const [aiOpen, setAiOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    {role: 'model', text: 'Welcome to GigHub. I am your Neural Career Architect. How can I assist your professional synchronization today?'}
  ]);
  const [aiInput, setAiInput] = useState('');
  const [aiThinking, setAiThinking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Platform Analytics
  const [totalVisits, setTotalVisits] = useState(0);
  const [activeUsers, setActiveUsers] = useState(42);

  const FAQ_DATA = [
    { q: "How does Neural Matching work?", a: "GigHub uses semantic context analysis to find deeper synergy between candidate skills and employer intent." },
    { q: "Is GigHub free for talent?", a: "Yes, our core discovery grid and career reasoning tools are free for all human talents." },
    { q: "What is 2026 Career Infrastructure?", a: "It refers to our specialized focus on post-AGI roles like Prompt Engineers and Logic Architects." }
  ];

  const LEGAL_CONTENT = {
    [PageView.PRIVACY]: { title: "Privacy Protocol", text: "GigHub's Privacy Protocol (GPP) is built on the principle of Cognitive Sovereignty. In 2026, your career data is more than just a resume; it is a behavioral and skill-based representation of your potential." },
    [PageView.TERMS]: { title: "Usage Terms", text: "By initializing a connection to the GigHub Neural Grid, you agree to adhere to the Fair-Play Synchronization Protocols (FPSP)." },
    [PageView.COOKIES]: { title: "Cookie Logic", text: "The GigHub ecosystem utilizes 'Logic Nodes' (commonly known as cookies) to maintain session continuity and platform performance." }
  };

  // --- PERSISTENCE EFFECTS ---
  useEffect(() => localStorage.setItem('gh_blogs', JSON.stringify(blogs)), [blogs]);
  useEffect(() => localStorage.setItem('gh_social', JSON.stringify(socialLinks)), [socialLinks]);
  useEffect(() => localStorage.setItem('gh_footer_text', footerText), [footerText]);
  useEffect(() => localStorage.setItem('gh_contact', JSON.stringify(contactInfo)), [contactInfo]);

  useEffect(() => {
    const savedVisits = parseInt(localStorage.getItem('gh_hits') || '15400');
    localStorage.setItem('gh_hits', (savedVisits + 1).toString());
    setTotalVisits(savedVisits + 1);
    const interval = setInterval(() => setActiveUsers(p => Math.max(20, Math.min(120, p + (Math.random() > 0.5 ? 2 : -2)))), 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' }); }, [aiMessages]);

  const handleAiChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim() || aiThinking) return;
    const msg = aiInput; setAiInput('');
    setAiMessages(p => [...p, {role: 'user', text: msg}]);
    setAiThinking(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: msg,
        config: { systemInstruction: 'You are the GigHub Neural Career Architect. Provide futuristic, strategic career advice for 2026.' }
      });
      setAiMessages(p => [...p, {role: 'model', text: response.text || "Connection lost."}]);
    } catch (err) { setAiMessages(p => [...p, {role: 'model', text: "Neural link error. Check API Key configuration."}]); }
    finally { setAiThinking(false); }
  };

  const handleAiFiltering = async () => {
    if (!userSkillsInput.trim() || loading) return;
    setLoading(true);
    try {
      const suggestedIds = await getAiSuggestions(jobs, userSkillsInput);
      setJobs(prev => prev.map(j => ({
        ...j,
        isAiSuggested: suggestedIds.includes(j.job_id)
      })).sort((a,b) => (b.isAiSuggested ? 1 : 0) - (a.isAiSuggested ? 1 : 0)));
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const loadJobs = useCallback(async (q: string) => {
    setLoading(true);
    const data = await fetchJobs(q);
    setJobs(data);
    setLoading(false);
  }, []);

  useEffect(() => { loadJobs("remote developer"); }, [loadJobs]);

  const handleSetView = (v: PageView) => {
    setView(v); setSelectedJob(null); setSelectedPost(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const savePost = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    const post: BlogPost = {
        id: editingPost?.id || Date.now().toString(),
        title: fd.get('title') as string,
        content: fd.get('content') as string,
        author: fd.get('author') as string,
        date: editingPost?.date || new Date().toISOString().split('T')[0],
        image: 'https://picsum.photos/800/400?tech&v=' + Math.random()
    };
    if (editingPost) setBlogs(prev => prev.map(b => b.id === editingPost.id ? post : b));
    else setBlogs(prev => [post, ...prev]);
    setEditingPost(null);
    (e.target as HTMLFormElement).reset();
    alert("Post transmission successful.");
  };

  const deletePost = (id: string) => {
    if(window.confirm("Purge node permanently?")) setBlogs(prev => prev.filter(b => b.id !== id));
  };

  return (
    <div className="min-h-full flex flex-col bg-[#fffdfd] overflow-x-hidden text-left">
      <Navbar setView={handleSetView} active={view} />
      
      <main className="flex-grow">
        {view === PageView.HOME && <div className="fade-in"><Hero3D /></div>}

        {view === PageView.JOBS && (
          <div className="max-w-7xl mx-auto px-6 py-20 fade-in">
            {selectedJob ? (
              <div className="max-w-5xl mx-auto">
                <button onClick={() => setSelectedJob(null)} className="mb-10 flex items-center gap-3 font-black text-emerald-600 hover:text-emerald-800 transition-all group">
                   <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center group-hover:bg-emerald-100 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg></div>
                   Back to Discovery Grid
                </button>
                <div className="bg-white rounded-[4rem] shadow-2xl border border-emerald-50 overflow-hidden">
                   <div className="bg-emerald-600 p-16 text-white relative">
                      <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tighter">{selectedJob.job_title}</h1>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 font-black shadow-lg">@</div>
                        <p className="text-2xl font-black uppercase tracking-widest">{selectedJob.employer_name}</p>
                      </div>
                   </div>
                   <div className="p-16 grid lg:grid-cols-3 gap-20">
                      <div className="lg:col-span-2 space-y-16">
                         <div className="prose prose-xl prose-emerald max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap font-medium">{selectedJob.job_description}</div>
                      </div>
                      <div className="space-y-10">
                         <div className="bg-gray-50/50 p-10 rounded-[3.5rem] border border-gray-100 shadow-sm sticky top-32">
                            <a href={selectedJob.job_apply_link} target="_blank" className="block w-full bg-emerald-700 text-white text-center py-6 rounded-3xl font-black uppercase tracking-widest shadow-2xl hover:bg-emerald-800 transition-all hover:-translate-y-2 active:scale-95">Apply Now</a>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-8xl font-black mb-12 tracking-tighter leading-none">Discovery <span className="text-rose-400">Grid.</span></h1>
                <div className="flex flex-col md:flex-row gap-6 mb-16 p-8 bg-white rounded-[3rem] shadow-xl border border-emerald-50">
                   <div className="flex-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-emerald-600 ml-4 mb-2 block">Skill-based AI Matching</label>
                      <input type="text" placeholder="Filter by core skills..." className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold text-gray-700 border border-transparent focus:border-emerald-200 transition-all" value={userSkillsInput} onChange={e => setUserSkillsInput(e.target.value)} />
                   </div>
                   <button onClick={handleAiFiltering} className="bg-rose-500 text-white font-black px-10 py-4 rounded-2xl hover:bg-rose-600 transition-all shadow-lg shadow-rose-100 flex items-center justify-center gap-2 self-end">Neural Filter <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></button>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 text-left">
                   {loading && jobs.length === 0 ? <p className="col-span-full py-40 text-center font-black animate-pulse text-2xl uppercase tracking-[0.4em] text-emerald-800">Initializing Grid Nodes...</p> : jobs.map(j => <div key={j.job_id} onClick={() => setSelectedJob(j)} className="cursor-pointer"><JobCard job={j} /></div>)}
                </div>
              </div>
            )}
          </div>
        )}

        {view === PageView.BLOG && (
          <div className="max-w-7xl mx-auto px-6 py-20 fade-in">
             <h1 className="text-8xl font-black mb-16 tracking-tighter leading-none">Neural <span className="text-rose-400">Insights.</span></h1>
             <div className="grid md:grid-cols-3 gap-12">
                {blogs.map(p => (
                  <div key={p.id} onClick={() => { setSelectedPost(p); setView(PageView.BLOG_POST); }} className="bg-white rounded-[4rem] overflow-hidden border border-emerald-50 shadow-sm cursor-pointer hover:shadow-2xl transition-all group">
                    <div className="relative h-72 overflow-hidden">
                       <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                       <div className="absolute bottom-8 left-8 text-white">
                          <h3 className="text-2xl font-black leading-tight">{p.title}</h3>
                       </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {view === PageView.BLOG_POST && selectedPost && (
          <div className="max-w-4xl mx-auto px-6 py-20 fade-in">
            <button onClick={() => setView(PageView.BLOG)} className="mb-16 flex items-center gap-3 font-black text-emerald-600 hover:text-emerald-800 transition-all group">
               <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center group-hover:bg-emerald-100 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg></div>
               Neural Insights Feed
            </button>
            <h1 className="text-7xl font-black mb-12 leading-none tracking-tight text-emerald-900">{selectedPost.title}</h1>
            <div className="flex items-center gap-6 mb-20 border-y border-emerald-50 py-10">
               <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-xl">{selectedPost.author.charAt(0)}</div>
               <div>
                  <p className="font-black text-emerald-800 uppercase text-sm tracking-widest">{selectedPost.author}</p>
                  <p className="text-xs font-bold text-gray-400 uppercase mt-1">Transmission Date: {selectedPost.date}</p>
               </div>
            </div>
            <div className="prose prose-2xl prose-emerald max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap font-medium">{selectedPost.content}</div>
          </div>
        )}

        {view === PageView.ABOUT && (
          <div className="max-w-7xl mx-auto px-6 py-32 fade-in">
             <h1 className="text-8xl font-black mb-12 tracking-tighter leading-none">Career <br/> <span className="text-emerald-600">Infrastructure.</span></h1>
             <p className="text-3xl text-gray-500 leading-relaxed font-medium mb-16">GigHub is not a job board. It is a neural discovery grid designed to synchronize human creative potential with global compute.</p>
          </div>
        )}

        {view === PageView.CONTACT && (
          <div className="max-w-7xl mx-auto px-6 py-32 fade-in">
             <div className="grid lg:grid-cols-2 gap-40">
                <div className="text-left">
                   <h1 className="text-8xl font-black mb-12 tracking-tighter leading-none">Initiate <br/><span className="text-rose-400">Signal.</span></h1>
                   <div className="space-y-16">
                      <div className="flex gap-10 items-center">
                         <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-emerald-600 shadow-sm"><svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div>
                         <div><p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Neural Node</p><p className="text-2xl font-black text-emerald-900">{contactInfo.email}</p></div>
                      </div>
                      <div className="flex gap-10 items-center">
                         <div className="w-20 h-20 bg-rose-50 rounded-[2rem] flex items-center justify-center text-rose-600 shadow-sm"><svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg></div>
                         <div><p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Physical Hub</p><p className="text-2xl font-black text-rose-900">{contactInfo.address}</p></div>
                      </div>
                      <div className="flex gap-10 items-center">
                         <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-emerald-600 shadow-sm"><svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg></div>
                         <div><p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Comms Line</p><p className="text-2xl font-black text-emerald-900">{contactInfo.phone}</p></div>
                      </div>
                   </div>
                </div>
                <form action={FORMSPREE_URL} method="POST" className="relative bg-white p-16 rounded-[4rem] shadow-2xl space-y-10 border border-emerald-50">
                   <div className="grid sm:grid-cols-2 gap-10">
                      <input name="name" type="text" placeholder="Identity" className="w-full p-6 bg-emerald-50/50 rounded-2xl font-bold outline-none" required />
                      <input name="email" type="email" placeholder="john@sync.io" className="w-full p-6 bg-emerald-50/50 rounded-2xl font-bold outline-none" required />
                   </div>
                   <textarea name="message" rows={5} placeholder="Initiate transmission..." className="w-full p-6 bg-emerald-50/50 rounded-2xl font-bold outline-none resize-none shadow-inner" required></textarea>
                   <button type="submit" className="w-full bg-emerald-700 text-white font-black py-10 rounded-[2.5rem] text-2xl shadow-2xl hover:bg-emerald-800 transition-all hover:-translate-y-2 active:scale-95">Broadcast Signal</button>
                </form>
             </div>
          </div>
        )}

        {view === PageView.ADMIN && (
          <div className="max-w-7xl mx-auto px-6 py-20 fade-in text-left">
            {!isAdmin ? (
              <form onSubmit={e => { e.preventDefault(); if(passcode === ADMIN_PASSCODE) setIsAdmin(true); else alert('Neural denial'); }} className="max-w-md mx-auto bg-white p-16 rounded-[4rem] shadow-2xl text-center border border-emerald-50">
                <h2 className="text-3xl font-black mb-8 text-emerald-900 tracking-tighter uppercase">Admin Synchronization</h2>
                <input type="password" placeholder="Passcode" className="w-full p-6 text-center bg-gray-50 rounded-2xl mb-10 outline-none font-black text-xl tracking-[0.5em] border-2 border-transparent focus:border-emerald-600 transition-all" value={passcode} onChange={e => setPasscode(e.target.value)} />
                <button type="submit" className="w-full bg-emerald-700 text-white font-black py-6 rounded-2xl text-xl shadow-xl hover:bg-emerald-800 transition-all">Initialize Portal</button>
              </form>
            ) : (
              <div className="space-y-16">
                 <div className="flex justify-between items-center bg-emerald-600 p-8 rounded-[2.5rem] text-white shadow-xl">
                    <h2 className="text-3xl font-black tracking-tight uppercase">Management Hub</h2>
                    <button onClick={() => setIsAdmin(false)} className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-black uppercase text-xs tracking-widest transition-colors">Disconnect</button>
                 </div>

                 <div className="grid lg:grid-cols-2 gap-16 items-start">
                    {/* BLOG CRUD SECTION */}
                    <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-emerald-50">
                       <h3 className="text-2xl font-black mb-10 text-emerald-900 flex items-center gap-3"><div className="w-1.5 h-8 bg-emerald-500 rounded-full"></div> {editingPost ? 'Update Insight Node' : 'Create New Insight'}</h3>
                       <form onSubmit={savePost} className="space-y-6">
                          <input name="title" placeholder="Post Title" defaultValue={editingPost?.title} className="w-full p-5 bg-gray-50 rounded-2xl outline-none font-bold" required />
                          <input name="author" placeholder="Author Identity" defaultValue={editingPost?.author} className="w-full p-5 bg-gray-50 rounded-2xl outline-none font-bold" required />
                          <textarea name="content" rows={8} placeholder="Content Payload" defaultValue={editingPost?.content} className="w-full p-6 bg-gray-50 rounded-2xl outline-none font-bold resize-none" required></textarea>
                          <button type="submit" className="w-full bg-emerald-700 text-white py-6 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-800 transition-all shadow-lg">{editingPost ? 'Commit Node Update' : 'Initialize Transmission'}</button>
                          {editingPost && <button type="button" onClick={() => setEditingPost(null)} className="w-full bg-gray-100 text-gray-500 py-4 rounded-xl font-black uppercase text-xs mt-2">Cancel Edit</button>}
                       </form>
                       <div className="mt-10 space-y-4">
                          {blogs.map(b => (
                            <div key={b.id} className="flex justify-between items-center p-6 bg-gray-50 rounded-3xl group border border-transparent hover:border-emerald-100 transition-all">
                               <p className="font-black text-emerald-900 truncate flex-1">{b.title}</p>
                               <div className="flex gap-4"><button onClick={() => setEditingPost(b)} className="text-emerald-600 font-bold uppercase text-xs tracking-widest">Edit</button><button onClick={() => deletePost(b.id)} className="text-rose-500 font-bold uppercase text-xs tracking-widest">Purge</button></div>
                            </div>
                          ))}
                       </div>
                    </div>

                    {/* CONFIG & CONTACT SECTION */}
                    <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-emerald-50">
                       <h3 className="text-2xl font-black mb-10 text-emerald-900 flex items-center gap-3"><div className="w-1.5 h-8 bg-rose-400 rounded-full"></div> Context Architecture</h3>
                       <div className="space-y-10">
                          <div className="space-y-6">
                             <label className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 block ml-2">Contact Synchronization</label>
                             <div className="space-y-2">
                                <p className="text-[8px] font-black uppercase text-gray-400 ml-4">Neural Node Email</p>
                                <input value={contactInfo.email} onChange={e => setContactInfo({...contactInfo, email: e.target.value})} className="w-full p-5 bg-gray-50 rounded-2xl outline-none font-bold text-gray-800 border-2 border-transparent focus:border-emerald-100 transition-all" placeholder="email@gighub.ai" />
                             </div>
                             <div className="space-y-2">
                                <p className="text-[8px] font-black uppercase text-gray-400 ml-4">Physical Hub Address</p>
                                <input value={contactInfo.address} onChange={e => setContactInfo({...contactInfo, address: e.target.value})} className="w-full p-5 bg-gray-50 rounded-2xl outline-none font-bold text-gray-800 border-2 border-transparent focus:border-emerald-100 transition-all" placeholder="Neo-Tech District..." />
                             </div>
                             <div className="space-y-2">
                                <p className="text-[8px] font-black uppercase text-gray-400 ml-4">Comms Line (Phone)</p>
                                <input value={contactInfo.phone} onChange={e => setContactInfo({...contactInfo, phone: e.target.value})} className="w-full p-5 bg-gray-50 rounded-2xl outline-none font-bold text-gray-800 border-2 border-transparent focus:border-emerald-100 transition-all" placeholder="+1 (555)..." />
                             </div>
                          </div>
                          
                          <div className="space-y-4">
                             <label className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 block ml-2">Global Footer Logic</label>
                             <textarea value={footerText} onChange={e => setFooterText(e.target.value)} className="w-full p-6 bg-gray-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-emerald-100 transition-all resize-none" rows={4}></textarea>
                          </div>
                          
                          <button onClick={() => alert("Platform context synchronized to localStorage.")} className="w-full bg-emerald-100 text-emerald-700 py-6 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-200 transition-all">Sync Global Cache</button>
                       </div>
                    </div>
                 </div>
              </div>
            )}
          </div>
        )}

        {(LEGAL_CONTENT as any)[view] && (
          <div className="max-w-4xl mx-auto px-6 py-32 fade-in">
            <h1 className="text-7xl font-black mb-16 tracking-tighter text-emerald-900">{(LEGAL_CONTENT as any)[view].title}</h1>
            <div className="bg-white p-20 rounded-[4rem] shadow-2xl text-gray-600 text-xl leading-relaxed whitespace-pre-wrap font-medium border border-emerald-50">{(LEGAL_CONTENT as any)[view].text}</div>
          </div>
        )}

        {view === PageView.FAQ && (
          <div className="max-w-4xl mx-auto px-6 py-32 fade-in">
            <h1 className="text-8xl font-black mb-24 tracking-tighter leading-none">Node <span className="text-rose-400">Support.</span></h1>
            <div className="space-y-8">
              {FAQ_DATA.map((faq, i) => (
                <div key={i} className="bg-white p-12 rounded-[3.5rem] border border-emerald-50 shadow-sm cursor-pointer hover:shadow-xl transition-all" onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}>
                  <div className="flex justify-between items-center"><p className="text-2xl font-black">{faq.q}</p><span className="text-3xl font-black text-emerald-200">{openFaqIndex === i ? '−' : '+'}</span></div>
                  {openFaqIndex === i && <p className="mt-8 text-gray-500 font-medium leading-relaxed border-t border-emerald-50 pt-8 text-lg">{faq.a}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer setView={handleSetView} social={socialLinks} totalVisits={totalVisits} activeUsers={activeUsers} footerText={footerText} />
    </div>
  );
}
