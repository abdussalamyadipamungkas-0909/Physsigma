import React, { useState, useMemo } from 'react';
import { useDetective } from '../../context/DetectiveContext';
import { CASE_FILES } from '../../data/cases';
import { 
  Search, 
  CheckCircle2, 
  ArrowRight, 
  Filter, 
  FolderGit2, 
  Clock, 
  ShieldAlert, 
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';

export const CaseList: React.FC = () => {
  const { profile, openCase } = useDetective();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unsolved' | 'solved'>('all');

  const categories = ['Semua', 'Mekanika', 'Energi', 'Dinamika', 'Gelombang', 'Kelistrikan'];

  const filteredCases = useMemo(() => {
    return CASE_FILES.filter(item => {
      const isSolved = profile.solvedCaseIds.includes(item.id);

      // Status filter
      if (statusFilter === 'solved' && !isSolved) return false;
      if (statusFilter === 'unsolved' && isSolved) return false;

      // Category filter
      if (selectedCategory !== 'Semua' && item.category !== selectedCategory) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesMystery = item.mystery.toLowerCase().includes(query);
        const matchesCaseNumber = item.caseNumber.toLowerCase().includes(query);
        const matchesConcepts = item.concepts.some(c => c.toLowerCase().includes(query));
        if (!matchesTitle && !matchesMystery && !matchesCaseNumber && !matchesConcepts) return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, statusFilter, profile.solvedCaseIds]);

  return (
    <div className="space-y-6 pb-16">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <FolderGit2 className="h-4 w-4" />
            <span>ARSIP DIGITAL KASUS FORENSIK SAINS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Berkas Kasus & Misteri Fisika
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Arsip insiden misterius berlandaskan fenomena fisika SMA/MA. Kumpulkan bukti di TKP, rumuskan hipotesis, jalankan simulasi presisi, dan susun deduksi akhir ilmiah.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-2">
            <span className="text-slate-400">Total: </span>
            <span className="font-bold text-white tabular-nums">{CASE_FILES.length} Kasus</span>
          </div>
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-emerald-400 font-bold">
            <span className="text-emerald-300">Terpecahkan: </span>
            <span className="tabular-nums">{profile.solvedCaseIds.length}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-800 bg-[#0c1427]/80 p-4 space-y-3.5 backdrop-blur">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari nomor kasus, nama fenomena, konsep fisis (contoh: gravitasi, inersia, tegangan)..."
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Status selector */}
          <div className="flex items-center gap-1 rounded-xl border border-slate-700/80 bg-slate-950 p-1 text-xs shrink-0">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition font-medium cursor-pointer ${
                statusFilter === 'all' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua ({CASE_FILES.length})
            </button>
            <button
              onClick={() => setStatusFilter('unsolved')}
              className={`px-3 py-1.5 rounded-lg transition font-medium cursor-pointer ${
                statusFilter === 'unsolved' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Belum Terpecahkan ({CASE_FILES.length - profile.solvedCaseIds.length})
            </button>
            <button
              onClick={() => setStatusFilter('solved')}
              className={`px-3 py-1.5 rounded-lg transition font-medium cursor-pointer ${
                statusFilter === 'solved' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Terpecahkan ({profile.solvedCaseIds.length})
            </button>
          </div>
        </div>

        {/* Category filter tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1 text-xs">
          <span className="flex items-center gap-1 text-slate-400 shrink-0 font-medium">
            <Filter className="h-3.5 w-3.5 text-cyan-400" /> Bidang:
          </span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3.5 py-1.5 transition whitespace-nowrap shrink-0 font-medium cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/20'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Case Grid */}
      {filteredCases.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center text-slate-400 space-y-2">
          <p className="text-sm">Tidak ada berkas kasus yang cocok dengan kriteria pencarian.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('Semua');
              setStatusFilter('all');
            }}
            className="text-xs text-cyan-400 hover:underline cursor-pointer"
          >
            Reset semua filter pencarian
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCases.map(c => {
            const isSolved = profile.solvedCaseIds.includes(c.id);
            const durationEstimate = c.difficulty === 'Pemula' ? '10-15 Menit' : c.difficulty === 'Menengah' ? '15-20 Menit' : '20-25 Menit';

            return (
              <div
                key={c.id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-[#0c1427]/80 backdrop-blur transition-all duration-300 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-1"
              >
                <div>
                  {/* Card Cover Image */}
                  <div className="relative h-48 overflow-hidden bg-slate-950">
                    <img
                      src={c.imageUrl}
                      alt={c.title}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c1427] via-transparent to-transparent" />
                    
                    {/* Case ID Stamp */}
                    <div className="absolute top-3.5 left-3.5 rounded-lg bg-slate-950/90 px-2.5 py-1 font-mono text-xs font-bold text-cyan-300 border border-cyan-500/40 backdrop-blur">
                      {c.caseNumber}
                    </div>

                    {/* Status Pill */}
                    {isSolved ? (
                      <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 rounded-lg bg-emerald-950/90 px-2.5 py-1 text-xs font-semibold text-emerald-300 border border-emerald-500/40 backdrop-blur">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Terpecahkan</span>
                      </div>
                    ) : (
                      <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 rounded-lg bg-slate-950/80 px-2.5 py-1 text-xs font-mono text-slate-300 border border-slate-800 backdrop-blur">
                        <Clock className="h-3 w-3 text-cyan-400" />
                        <span>{durationEstimate}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="font-semibold text-cyan-400">{c.category}</span>
                      <span>·</span>
                      <span>{c.difficulty}</span>
                      <span>·</span>
                      <span className="font-mono text-cyan-300 font-bold">+{c.xpReward} XP</span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition">
                      {c.title}
                    </h3>

                    <p className="text-xs text-cyan-200/90 italic border-l-2 border-cyan-500/60 pl-3 line-clamp-2">
                      &ldquo;{c.mystery}&rdquo;
                    </p>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {c.synopsis}
                    </p>

                    {/* Concepts */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {c.concepts.slice(0, 3).map((concept, i) => (
                        <span
                          key={i}
                          className="rounded-md bg-slate-800/80 px-2 py-0.5 text-[10px] font-mono text-slate-300 border border-slate-700/60"
                        >
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer Action */}
                <div className="p-5 pt-0">
                  <button
                    onClick={() => openCase(c.id)}
                    className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition cursor-pointer ${
                      isSolved
                        ? 'border border-slate-700 bg-slate-800/80 text-white hover:bg-cyan-500 hover:text-slate-950 hover:border-cyan-500'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20'
                    }`}
                  >
                    <span>{isSolved ? 'Tinjau Rekonstruksi Kasus' : 'Mulai Investigasi Ilmiah'}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
