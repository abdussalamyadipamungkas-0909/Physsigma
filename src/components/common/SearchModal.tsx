import React, { useState, useEffect } from 'react';
import { useDetective } from '../../context/DetectiveContext';
import { CASE_FILES } from '../../data/cases';
import { KNOWLEDGE_TOPICS } from '../../data/knowledge';
import { 
  Search, 
  X, 
  FolderGit2, 
  Sliders, 
  GraduationCap, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { openCase, setActiveTab } = useDetective();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  // Search cases
  const matchedCases = CASE_FILES.filter(c => 
    !q || 
    c.title.toLowerCase().includes(q) || 
    c.caseNumber.toLowerCase().includes(q) || 
    c.mystery.toLowerCase().includes(q) ||
    c.concepts.some(con => con.toLowerCase().includes(q))
  ).slice(0, 4);

  // Search simulation modules
  const simulations = [
    { id: 'free-fall', name: 'Tabung Jatuh Bebas Galileo', desc: 'Gravitasi, hambatan udara, dan vakum' },
    { id: 'energy', name: 'Konservasi Energi Bidang Miring', desc: 'Ep, Ek, dan usaha gaya gesek termal' },
    { id: 'newton', name: 'Hukum Dinamika Newton', desc: 'Kelembaman inersia, gaya gesek, dan percepatan' },
    { id: 'wave', name: 'Laboratorium Gelombang Transversal', desc: 'Amplitudo, frekuensi, cepat rambat gelombang' },
    { id: 'circuit', name: 'Rangkaian Listrik DC Seri vs Paralel', desc: 'Hukum Ohm, hambatan ekuivalen, daya lampu' },
    { id: 'projectile', name: 'Kinematika Gerak Parabola', desc: 'Ketinggian maksimum, jarak horizontal, sudut elevasi' },
  ];
  const matchedSims = simulations.filter(s => 
    !q || s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q)
  ).slice(0, 3);

  // Search knowledge topics
  const matchedTopics = KNOWLEDGE_TOPICS.filter(t => 
    !q || t.title.toLowerCase().includes(q) || t.summary.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
  ).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-cyan-500/30 bg-[#0b1220]/95 shadow-2xl shadow-cyan-500/10 backdrop-blur-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-slate-800 px-4 py-3.5">
          <Search className="h-5 w-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Cari berkas kasus, laboratorium fisika, materi rumus..."
            autoFocus
            className="w-full bg-transparent px-3 text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="rounded p-1 text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block rounded border border-slate-700 bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-400">
              ESC
            </kbd>
          )}
        </div>

        {/* Results Container */}
        <div className="max-h-[65vh] overflow-y-auto p-4 space-y-5">
          
          {/* Section 1: Cases */}
          {matchedCases.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[11px] font-mono font-semibold text-cyan-400 uppercase tracking-wider">
                <FolderGit2 className="h-3.5 w-3.5" />
                <span>Berkas Kasus Forensik ({matchedCases.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchedCases.map(c => (
                  <button
                    key={c.id}
                    onClick={() => {
                      openCase(c.id);
                      onClose();
                    }}
                    className="w-full text-left flex items-center justify-between rounded-xl p-2.5 hover:bg-slate-800/70 border border-transparent hover:border-cyan-500/30 transition cursor-pointer group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-amber-400">{c.caseNumber}</span>
                        <span className="text-xs font-semibold text-white group-hover:text-cyan-300 transition">{c.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{c.mystery}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition shrink-0 ml-3" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Section 2: Simulations */}
          {matchedSims.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[11px] font-mono font-semibold text-sky-400 uppercase tracking-wider">
                <Sliders className="h-3.5 w-3.5" />
                <span>Alat Lab Simulasi Virtual</span>
              </div>
              <div className="space-y-1.5">
                {matchedSims.map(sim => (
                  <button
                    key={sim.id}
                    onClick={() => {
                      setActiveTab('simulation');
                      onClose();
                    }}
                    className="w-full text-left flex items-center justify-between rounded-xl p-2.5 hover:bg-slate-800/70 border border-transparent hover:border-sky-500/30 transition cursor-pointer group"
                  >
                    <div>
                      <span className="text-xs font-semibold text-white group-hover:text-sky-300 transition">{sim.name}</span>
                      <p className="text-[11px] text-slate-400 mt-0.5">{sim.desc}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-sky-400 transition shrink-0 ml-3" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Knowledge Topics */}
          {matchedTopics.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[11px] font-mono font-semibold text-emerald-400 uppercase tracking-wider">
                <GraduationCap className="h-3.5 w-3.5" />
                <span>Teori & Pusat Pengetahuan</span>
              </div>
              <div className="space-y-1.5">
                {matchedTopics.map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setActiveTab('knowledge');
                      onClose();
                    }}
                    className="w-full text-left flex items-center justify-between rounded-xl p-2.5 hover:bg-slate-800/70 border border-transparent hover:border-emerald-500/30 transition cursor-pointer group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-emerald-400">{t.category}</span>
                        <span className="text-xs font-semibold text-white group-hover:text-emerald-300 transition">{t.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{t.summary}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 transition shrink-0 ml-3" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchedCases.length === 0 && matchedSims.length === 0 && matchedTopics.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-xs">
              Tidak ada hasil yang cocok dengan &quot;{query}&quot;. Coba cari &quot;jatuh bebas&quot;, &quot;energi&quot;, &quot;newton&quot;, atau &quot;listrik&quot;.
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-800 bg-slate-950/80 px-4 py-2.5 text-[11px] text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>Pencarian Cepat Pusat Komando Detektif</span>
          </span>
          <button
            onClick={onClose}
            className="hover:text-white transition"
          >
            Tutup [ESC]
          </button>
        </div>
      </div>
    </div>
  );
};
