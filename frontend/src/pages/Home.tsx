// src/pages/Home.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Chip } from '../components/Chip';
import { useAuth } from '../context/AuthContext';

export function Home() {
  const navigate = useNavigate();
  const { userEmail, logout } = useAuth();
  const [modalType, setModalType] = useState<'docs' | 'community' | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const scrollToCapabilities = () => {
    document.getElementById('capabilities')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput) {
      setSubscribed(true);
      setEmailInput('');
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#111827] flex flex-col selection:bg-[#f8b92a] selection:text-[#0b1d30] relative overflow-x-hidden">
      
      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-8 py-8 flex justify-between items-center sticky top-0 bg-[#f5f5f5]/90 backdrop-blur-md z-50 border-b border-[#e5e7eb]/50">
        <div className="font-mono font-bold text-lg cursor-pointer flex items-center gap-2" onClick={() => navigate('/')}>
          <span className="bg-[#f8b92a] text-[#0b1d30] px-3 py-1 rounded-[2px]">MLH</span>
          <span className="text-[#374151] text-sm">// REPOLENS CORE</span>
        </div>
        <nav className="flex gap-8 items-center font-mono text-sm font-semibold">
          <span className="text-[#374151] hover:text-[#111827] cursor-pointer transition-colors" onClick={() => setModalType('docs')}>DOCS</span>
          <span className="text-[#374151] hover:text-[#111827] cursor-pointer transition-colors" onClick={() => setModalType('community')}>COMMUNITY</span>
          <div className="flex gap-4 items-center">
            <span className="text-xs text-[#374151] bg-white border border-[#e5e7eb] px-3 py-1.5 rounded-[2px] font-bold">
              {userEmail}
            </span>
            <Button variant="secondary" className="h-[36px] text-xs px-3" onClick={logout}>
              Sign Out
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <span className="bg-[#f8b92a] text-[#0b1d30] font-mono font-bold text-xs px-3 py-1 rounded-[2px]">
              ALPHA RELEASE // V2.4
            </span>
            <span className="font-mono text-xs text-[#374151] font-bold">LOCAL AST PARSING</span>
          </div>

          <h1 className="font-mono font-bold text-[48px] leading-[56px] text-[#111827] tracking-tight">
            Connecting the Codebase Ecosystem.
          </h1>

          <p className="font-mono text-[16px] text-[#374151] leading-[26px] max-w-xl font-medium">
            Discover real-world repository intelligence tools built around mono typography, bright golden accents, and clean isometric pipeline geometry.
          </p>

          <div className="flex gap-4 items-center pt-4">
            <Button variant="primary" onClick={() => navigate('/dashboard')} className="h-[52px] px-8 text-base cursor-pointer">
              Launch Dashboard →
            </Button>
            <Button variant="secondary" onClick={scrollToCapabilities} className="h-[52px] px-8 text-base cursor-pointer">
              Explore Architecture
            </Button>
          </div>
        </div>
        
        {/* Exact Match Reference Hero Graphic */}
        <div className="w-full h-[460px] bg-white border border-[#e5e7eb] shadow-sm rounded-[4px] p-6 relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'linear-gradient(to right, #edf2f7 1px, transparent 1px), linear-gradient(to bottom, #edf2f7 1px, transparent 1px)', 
            backgroundSize: '24px 24px' 
          }} />

          <svg className="w-full h-full z-10" viewBox="0 0 450 340" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Monitor Outer Golden Bezel */}
            <rect x="130" y="30" width="165" height="175" rx="3" fill="#f8b92a" stroke="#111827" strokeWidth="2.5"/>
            {/* Inner Dark Screen */}
            <rect x="139" y="39" width="147" height="157" rx="1.5" fill="#0f172a"/>
            
            {/* Code Lines on Screen */}
            <rect x="155" y="65" width="80" height="7" rx="2" fill="#f8b92a"/>
            <rect x="155" y="88" width="115" height="5" rx="2" fill="#60a5fa"/>
            <rect x="155" y="108" width="85" height="5" rx="2" fill="#34d399"/>
            <rect x="155" y="128" width="50" height="5" rx="2" fill="#f43f5e"/>

            {/* Terminal Daemon Status Indicator inside Screen */}
            <rect x="155" y="148" width="108" height="18" rx="2" fill="#2563eb"/>
            <circle cx="163" cy="157" r="3" fill="#34d399"/>
            <text x="172" y="160" fill="#ffffff" fontFamily="monospace" fontSize="8" fontWeight="bold">DAEMON_ACTIVE // 14ms</text>

            {/* Flat-Bottom Keyboard Base Stand matching reference */}
            <path d="M100 220L320 220L340 240L120 240Z" fill="#ffffff" stroke="#111827" strokeWidth="2.5"/>
            <line x1="130" y1="230" x2="310" y2="230" stroke="#cbd5e1" strokeWidth="1.5"/>

            {/* Floating Golden Cube / Package Box */}
            <g transform="translate(280, 110)">
              <path d="M0 22L45 0L90 22L45 44L0 22Z" fill="#fbbf24" stroke="#111827" strokeWidth="2"/>
              <path d="M0 22V68L45 90V44L0 22Z" fill="#f59e0b" stroke="#111827" strokeWidth="2"/>
              <path d="M45 44V90L90 68V22L45 44Z" fill="#fbbf24" stroke="#111827" strokeWidth="2"/>
              <rect x="38" y="34" width="14" height="10" fill="#78350f" rx="1"/>
            </g>
          </svg>
        </div>
      </section>

      {/* Action Pathway Cards */}
      <section className="w-full max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div 
            onClick={() => setModalType('community')}
            className="bg-white border border-[#e5e7eb] hover:border-[#f8b92a] p-8 rounded-[4px] shadow-sm flex items-center justify-between cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-[#f9fafb] border border-[#e5e7eb] rounded-[4px] flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                🧩
              </div>
              <div className="flex flex-col gap-2 font-mono">
                <h3 className="font-bold text-lg text-[#111827]">Contribute AST Parsers</h3>
                <p className="text-xs text-[#4b5563] leading-relaxed max-w-xs">
                  Get everything you need to build custom language parsers and AST security rules.
                </p>
              </div>
            </div>
            <div className="w-12 h-12 bg-[#f8b92a] rounded-[4px] flex items-center justify-center text-[#0b1d30] font-bold text-lg group-hover:translate-x-1 transition-transform">
              →
            </div>
          </div>

          <div 
            onClick={() => setModalType('docs')}
            className="bg-white border border-[#e5e7eb] hover:border-[#f8b92a] p-8 rounded-[4px] shadow-sm flex items-center justify-between cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-[#f9fafb] border border-[#e5e7eb] rounded-[4px] flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                ⚡
              </div>
              <div className="flex flex-col gap-2 font-mono">
                <h3 className="font-bold text-lg text-[#111827]">Enterprise Local Deployment</h3>
                <p className="text-xs text-[#4b5563] leading-relaxed max-w-xs">
                  Deploy Repolens locally with Ollama and Gemma for air-gapped enterprise codebases.
                </p>
              </div>
            </div>
            <div className="w-12 h-12 bg-[#f8b92a] rounded-[4px] flex items-center justify-center text-[#0b1d30] font-bold text-lg group-hover:translate-x-1 transition-transform">
              →
            </div>
          </div>

        </div>
      </section>

      {/* Isometric Ecosystem Pipeline Banner */}
      <section className="w-full bg-[#111827] text-white py-16 my-8 border-y border-[#1f2937]">
        <div className="max-w-7xl mx-auto px-8 flex flex-col gap-10">
          <div className="flex flex-col gap-3 text-center md:text-left">
            <span className="font-mono text-xs text-[#f8b92a] font-bold">// ISOMETRIC REPO PIPELINE</span>
            <h2 className="font-mono font-bold text-[32px] text-white">Modular Code Intelligence Network</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
            <div className="bg-[#1f2937] p-6 rounded-[4px] border border-gray-700 flex flex-col gap-3">
              <span className="text-[#f8b92a] font-bold text-sm">01 // INGESTION LAYER</span>
              <p className="text-xs text-gray-300 leading-relaxed">Bounded file scanner ignores heavy artifacts and git caches while streaming clean syntax.</p>
            </div>
            <div className="bg-[#1f2937] p-6 rounded-[4px] border border-gray-700 flex flex-col gap-3">
              <span className="text-[#f8b92a] font-bold text-sm">02 // AST ENGINE</span>
              <p className="text-xs text-gray-300 leading-relaxed">Parses code blocks locally via Ollama and Gemma models with zero external cloud egress.</p>
            </div>
            <div className="bg-[#1f2937] p-6 rounded-[4px] border border-gray-700 flex flex-col gap-3">
              <span className="text-[#f8b92a] font-bold text-sm">03 // REMEDIATION MATRIX</span>
              <p className="text-xs text-gray-300 leading-relaxed">Instantly identifies CVE vulnerabilities and generates secure, production-ready code diff patches.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section id="capabilities" className="w-full max-w-7xl mx-auto px-8 py-16 flex flex-col gap-12">
        <div className="flex flex-col gap-3">
          <span className="font-mono text-xs text-[#1d4ed8] font-bold">// ARCHITECTURE CAPABILITIES</span>
          <h2 className="font-mono font-bold text-[36px] text-[#111827]">Engineered for deep repository insights.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="flex flex-col gap-4 bg-white border-[#e5e7eb]">
            <Chip>SAFE PRUNING</Chip>
            <h3 className="font-mono font-bold text-xl text-[#111827]">Bounded File Scanners</h3>
            <p className="font-mono text-sm text-[#374151] leading-[22px]">
              Automatically prunes heavy build artifacts, `.git` folders, binary files, and sensitive credentials before inference.
            </p>
          </Card>

          <Card className="flex flex-col gap-4 bg-white border-[#e5e7eb]">
            <Chip>EVIDENCE-BACKED</Chip>
            <h3 className="font-mono font-bold text-xl text-[#111827]">Direct Code Linking</h3>
            <p className="font-mono text-sm text-[#374151] leading-[22px]">
              Restricts AI output models from hallucinating files by grounding every architectural finding directly to physical paths.
            </p>
          </Card>

          <Card className="flex flex-col gap-4 bg-white border-[#e5e7eb]">
            <Chip>LOCAL INFERENCE</Chip>
            <h3 className="font-mono font-bold text-xl text-[#111827]">Ollama Integration</h3>
            <p className="font-mono text-sm text-[#374151] leading-[22px]">
              Run deep local evaluations using Gemma models with zero external data leakage or cloud dependency constraints.
            </p>
          </Card>
        </div>
      </section>

      {/* Stay In The Loop Section */}
      <section className="w-full max-w-7xl mx-auto px-8 py-12">
        <div className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-[6px] p-12 flex flex-col md:flex-row justify-between items-center gap-8 shadow-md">
          <div className="flex flex-col gap-4 max-w-lg font-mono">
            <h2 className="text-3xl font-bold tracking-tight">Stay In The Loop</h2>
            <p className="text-sm text-blue-100 leading-relaxed">
              Find out about our upcoming local model integrations, security updates, and more by subscribing to Repolens’s monthly engineer newsletter.
            </p>
            
            {!subscribed ? (
              <form onSubmit={handleSubscribe} className="flex gap-2 pt-2">
                <input 
                  type="email" 
                  placeholder="Enter email..." 
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="bg-white text-gray-900 text-xs font-mono p-3 rounded-[2px] outline-none flex-1"
                  required
                />
                <button type="submit" className="bg-[#f8b92a] text-[#0b1d30] font-bold text-xs px-6 py-3 rounded-[2px] hover:bg-amber-400 cursor-pointer transition-colors">
                  Subscribe →
                </button>
              </form>
            ) : (
              <div className="bg-emerald-500 text-white p-3 rounded-[2px] text-xs font-bold text-center">
                ✓ Successfully subscribed to Repolens updates!
              </div>
            )}
          </div>

          <div className="w-48 h-48 bg-blue-800/50 rounded-full border border-blue-400/30 flex items-center justify-center font-mono text-xs text-blue-200 text-center p-6">
            [ SECURE DAEMON CHANNEL ACTIVE ]
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-[#e5e7eb] py-12 mt-16">
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center font-mono text-xs text-[#374151] font-bold">
          <span>© 2026 REPOLENS CORE V2. ALL RIGHTS RESERVED.</span>
          <span className="cursor-pointer hover:text-[#111827]" onClick={() => navigate('/dashboard')}>LAUNCH DASHBOARD →</span>
        </div>
      </footer>

      {/* Modals */}
      {modalType && (
        <div className="fixed inset-0 bg-[#0b1d30]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-mono">
          <Card className="bg-white max-w-lg w-full flex flex-col gap-6 p-8 border-[#f8b92a]">
            <div className="flex justify-between items-center border-b border-[#e5e7eb] pb-4">
              <span className="font-bold text-[#111827] text-base">
                {modalType === 'docs' && '// API & SYSTEM DOCUMENTATION'}
                {modalType === 'community' && '// DEVELOPER COMMUNITY HUB'}
              </span>
              <button onClick={() => setModalType(null)} className="text-[#374151] hover:text-[#111827] font-bold cursor-pointer text-lg px-2">
                ✕
              </button>
            </div>

            <div className="text-sm text-[#374151] leading-[24px]">
              {modalType === 'docs' && (
                <div className="flex flex-col gap-3 font-medium">
                  <p className="text-[#111827] font-bold">Quick Start Guide:</p>
                  <p>1. Ensure local Ollama service is running on port 11434.</p>
                  <p>2. Ingest your target repository path directly into the command center.</p>
                </div>
              )}
              {modalType === 'community' && (
                <div className="flex flex-col gap-3 font-medium">
                  <p className="text-[#111827] font-bold">Connect with Builders:</p>
                  <p>• GitHub Discussions: Share custom AST pruners and themes.</p>
                  <p>• Discord Channel: Join 1,400+ engineers building local AI tools.</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#e5e7eb]">
              <Button variant="secondary" onClick={() => setModalType(null)} className="h-[40px] text-xs px-4">
                Close
              </Button>
              <Button variant="primary" onClick={() => setModalType(null)} className="h-[40px] text-xs px-4">
                Got It ✓
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}