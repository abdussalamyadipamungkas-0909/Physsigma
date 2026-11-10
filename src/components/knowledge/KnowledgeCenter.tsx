import React, { useState, useMemo } from 'react';
import { useDetective } from '../../context/DetectiveContext';
import { KNOWLEDGE_TOPICS } from '../../data/knowledge';
import { 
  GraduationCap, 
  Search, 
  BookOpen, 
  ArrowRight, 
  Lightbulb, 
  Sparkles,
  Calculator,
  ChevronRight
} from 'lucide-react';

export const KnowledgeCenter: React.FC = () => {
  const { openCase } = useDetective();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [activeTopicId, setActiveTopicId] = useState<string>(KNOWLEDGE_TOPICS[0].id);

  const categories = ['Semua', 'Mekanika', 'Energi', 'Dinamika', 'Gelombang', 'Kelistrikan'];

  const filteredTopics = useMemo(() => {
    return KNOWLEDGE_TOPICS.filter(t => {
      if (selectedCategory !== 'Semua' && t.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          t.title.toLowerCase().includes(q) ||
          t.summary.toLowerCase().includes(q) ||
          t.scientificExplanation.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  const activeTopic = KNOWLEDGE_TOPICS.find(t => t.id === activeTopicId) || KNOWLEDGE_TOPICS[0];

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <GraduationCap className="h-4 w-4" />
            <span>ENCYCLOPEDIA FORENSIK SAINS SMA/MA</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Pusat Pengetahuan Fisika
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Rangkuman komprehensif konsep fisika kurikulum SMA, penjabaran fenomena kehidupan sehari-hari, tabel besaran SI, persamaan matematis, dan contoh perhitungan langkah demi langkah.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari konsep, besaran fisis, atau hukum alam..."
            className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3.5 py-2 whitespace-nowrap transition cursor-pointer font-medium ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Layout: Sidebar list on left, Full topic dossier on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Topics List */}
        <div className="lg:col-span-4 space-y-2.5">
          {filteredTopics.map(topic => {
            const isSelected = topic.id === activeTopicId;

            return (
              <button
                key={topic.id}
                onClick={() => setActiveTopicId(topic.id)}
                className={`w-full text-left rounded-2xl border p-4 transition cursor-pointer space-y-1.5 ${
                  isSelected
                    ? 'border-emerald-500/60 bg-emerald-950/25 shadow-md shadow-emerald-500/10'
                    : 'border-slate-800 bg-[#0c1427]/70 hover:border-slate-700 hover:bg-[#0e172e]'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-cyan-400 font-bold">{topic.category}</span>
                  {isSelected && <span className="text-emerald-400 font-semibold">Aktif Ditelaah</span>}
                </div>
                <h4 className="text-sm font-bold text-white line-clamp-1">{topic.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{topic.summary}</p>
              </button>
            );
          })}
        </div>

        {/* Right Active Topic Article */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-800 bg-[#0c1427]/90 p-6 sm:p-8 space-y-6 backdrop-blur shadow-2xl">
          
          {/* Header */}
          <div className="border-b border-slate-800 pb-5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span className="font-bold">{activeTopic.category}</span>
              <span>·</span>
              <span>KURIKULUM FISIKA SMA/MA STANDAR NASIONAL</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">{activeTopic.title}</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{activeTopic.summary}</p>
          </div>

          {/* Section 1: Daily Life Phenomenon */}
          <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-4 sm:p-5 space-y-2">
            <h4 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 font-mono uppercase tracking-wider">
              <Lightbulb className="h-4 w-4" /> Fenomena Dalam Kehidupan Sehari-hari
            </h4>
            <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed">
              &ldquo;{activeTopic.dailyPhenomenon}&rdquo;
            </p>
          </div>

          {/* Section 2: Scientific Explanation */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-200 font-mono uppercase tracking-wider">
              Penjelasan Ilmiah & Konsep Dasar
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {activeTopic.scientificExplanation}
            </p>
          </div>

          {/* Section 3: SI Quantities Table */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-200 font-mono uppercase tracking-wider">
              Besaran Fisis & Satuan Standar Internasional (SI)
            </h4>
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 bg-slate-950 font-mono text-[11px] text-slate-400">
                  <tr>
                    <th className="py-2.5 px-3.5">Simbol</th>
                    <th className="py-2.5 px-3.5">Nama Besaran</th>
                    <th className="py-2.5 px-3.5">Satuan SI</th>
                    <th className="py-2.5 px-3.5">Makna Fisis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-mono text-slate-300">
                  {activeTopic.keyQuantities.map((q, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30">
                      <td className="py-2.5 px-3.5 font-bold text-cyan-400">{q.symbol}</td>
                      <td className="py-2.5 px-3.5 font-sans font-medium text-white">{q.name}</td>
                      <td className="py-2.5 px-3.5 text-emerald-400">{q.unit}</td>
                      <td className="py-2.5 px-3.5 font-sans text-slate-400">{q.meaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Formulas */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-200 font-mono uppercase tracking-wider">
              Persamaan Matematika & Formulasi
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {activeTopic.formulas.map((form, fIdx) => (
                <div key={fIdx} className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-1.5">
                  <div className="font-mono text-sm font-bold text-cyan-300">{form.formula}</div>
                  <p className="text-xs text-slate-400 leading-relaxed">{form.explanation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Stepwise Problem Solving */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 space-y-3.5">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-400 font-mono">
              <Calculator className="h-4 w-4" />
              <span>CONTOH PERHITUNGAN BERTAHAP</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
              {activeTopic.exampleProblem.scenario}
            </p>

            <div className="text-xs font-mono text-cyan-300">
              Diketahui: {activeTopic.exampleProblem.known}
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-400 block font-mono">LANGKAH PENYELESAIAN:</span>
              <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                {activeTopic.exampleProblem.solutionSteps.map((step, sIdx) => (
                  <li key={sIdx} className="leading-relaxed">{step}</li>
                ))}
              </ul>
            </div>

            <div className="mt-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 p-3 text-xs font-mono text-emerald-300 font-bold">
              Jawaban Akhir Terverifikasi: {activeTopic.exampleProblem.finalAnswer}
            </div>
          </div>

          {/* Link to Case Investigation */}
          {activeTopic.relatedCaseId && (
            <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-800">
              <span className="text-xs text-slate-400">
                Penerapan konsep ini dalam kasus investigasi detektif
              </span>
              <button
                onClick={() => openCase(activeTopic.relatedCaseId!)}
                className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition cursor-pointer shrink-0"
              >
                <span>Uji Teori Ini di Kasus</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
