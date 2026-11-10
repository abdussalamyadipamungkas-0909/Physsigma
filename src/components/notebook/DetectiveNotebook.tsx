import React, { useState } from 'react';
import { useDetective } from '../../context/DetectiveContext';
import { CASE_FILES } from '../../data/cases';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Edit3, 
  Calculator, 
  Save, 
  CheckCircle2, 
  Sparkles,
  FileText,
  Bookmark,
  Share2
} from 'lucide-react';

export const DetectiveNotebook: React.FC = () => {
  const { profile, addNote, updateNote, deleteNote, openCase } = useDetective();
  const [activeTab, setActiveTab] = useState<'notes' | 'solved' | 'calculator'>('notes');

  // New Note Modal state
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newFormulaDraft, setNewFormulaDraft] = useState('');

  // Editing state
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  // Quick Calculator state
  const [calcInput, setCalcInput] = useState('');
  const [calcResult, setCalcResult] = useState<string | null>(null);

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    addNote({
      title: newTitle.trim(),
      content: newContent.trim(),
      formulaDraft: newFormulaDraft.trim() || undefined
    });

    setNewTitle('');
    setNewContent('');
    setNewFormulaDraft('');
    setIsAddingNote(false);
  };

  const handleStartEdit = (note: any) => {
    setEditingNoteId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const handleSaveEdit = (id: string) => {
    updateNote(id, {
      title: editTitle.trim(),
      content: editContent.trim()
    });
    setEditingNoteId(null);
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const sanitized = calcInput
        .replace(/sqrt\(/g, 'Math.sqrt(')
        .replace(/\^/g, '**');
      
      const res = Function(`"use strict"; return (${sanitized})`)();
      setCalcResult(Number(res).toLocaleString('id-ID', { maximumFractionDigits: 4 }));
    } catch {
      setCalcResult('Format persamaan keliru');
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <BookOpen className="h-4 w-4" />
            <span>JURNAL FORENSIK FISIKA DIGITAL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Buku Catatan Detektif
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Kompilasi temuan observasi mandiri, catatan hipotesis, berkas kasus yang telah dipecahkan, serta kalkulator komputasi fisika terstandar.
          </p>
        </div>

        <button
          onClick={() => setIsAddingNote(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Tulis Catatan Forensik Baru</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('notes')}
          className={`px-4 py-2 rounded-xl transition font-semibold cursor-pointer ${
            activeTab === 'notes'
              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Catatan Forensik Pribadi ({profile.notes.length})
        </button>
        <button
          onClick={() => setActiveTab('solved')}
          className={`px-4 py-2 rounded-xl transition font-semibold cursor-pointer ${
            activeTab === 'solved'
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Berkas Kasus Terpecahkan ({profile.solvedCaseIds.length})
        </button>
        <button
          onClick={() => setActiveTab('calculator')}
          className={`px-4 py-2 rounded-xl transition font-semibold cursor-pointer ${
            activeTab === 'calculator'
              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Kalkulator Analitis & Formula
        </button>
      </div>

      {/* Modal / Add Note Form */}
      {isAddingNote && (
        <form
          onSubmit={handleCreateNote}
          className="rounded-2xl border border-amber-500/40 bg-[#0c1427] p-6 space-y-4 shadow-2xl backdrop-blur"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="h-4 w-4 text-amber-400" />
              <span>Arsipkan Temuan Baru ke Notebook</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsAddingNote(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Batal
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Judul Topik / Eksperimen</label>
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="Contoh: Analisis Hambatan Udara pada Kecepatan Terminal"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-white focus:border-amber-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Isi Catatan Ilmiah</label>
              <textarea
                rows={4}
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                placeholder="Tuliskan temuan observasi, korelasi variabel bebas dan terikat, atau bukti yang perlu ditindaklanjuti..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-white focus:border-amber-500 focus:outline-none leading-relaxed"
                required
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Draft Rumus Terkait (Opsional)</label>
              <input
                type="text"
                value={newFormulaDraft}
                onChange={e => setNewFormulaDraft(e.target.value)}
                placeholder="Contoh: F_drag = 0.5 * Cd * rho * A * v^2"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 font-mono text-amber-300 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingNote(false)}
              className="rounded-xl px-4 py-2 text-xs text-slate-400 hover:text-white"
            >
              Tutup
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition cursor-pointer shadow-md shadow-amber-500/20"
            >
              <Save className="h-4 w-4" />
              <span>Simpan Catatan</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 1: Personal Notes */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          {profile.notes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center text-slate-400 space-y-2">
              <FileText className="h-8 w-8 mx-auto text-slate-600" />
              <p className="text-sm">Buku catatan investigasi Anda masih kosong.</p>
              <p className="text-xs">Klik tombol "Tulis Catatan Forensik Baru" atau gunakan fitur "Simpan Temuan ke Notebook" di Lab Simulasi.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {profile.notes.map(note => {
                const isEditing = editingNoteId === note.id;

                return (
                  <div
                    key={note.id}
                    className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-[#0c1427]/80 p-5 space-y-4 backdrop-blur transition hover:border-slate-700"
                  >
                    {isEditing ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={e => setEditTitle(e.target.value)}
                          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-bold text-white"
                        />
                        <textarea
                          rows={4}
                          value={editContent}
                          onChange={e => setEditContent(e.target.value)}
                          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-200"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingNoteId(null)}
                            className="text-xs text-slate-400"
                          >
                            Batal
                          </button>
                          <button
                            onClick={() => handleSaveEdit(note.id)}
                            className="rounded-xl bg-amber-500 px-4 py-1.5 text-xs font-bold text-slate-950"
                          >
                            Simpan Perubahan
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span className="font-mono text-amber-400/90 font-semibold">{note.createdAt}</span>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleStartEdit(note)}
                                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
                                title="Edit catatan"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => deleteNote(note.id)}
                                className="text-slate-400 hover:text-rose-400 p-1 rounded-lg hover:bg-slate-800 transition"
                                title="Hapus catatan"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>

                          <h3 className="text-base font-bold text-white">{note.title}</h3>
                          <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                            {note.content}
                          </p>
                        </div>

                        {note.formulaDraft && (
                          <div className="pt-3 border-t border-slate-800 font-mono text-[11px] text-amber-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                            Persamaan Terkait: <span className="font-bold">{note.formulaDraft}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Solved Cases Dossier */}
      {activeTab === 'solved' && (
        <div className="space-y-4">
          {profile.solvedCaseIds.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center text-slate-400 space-y-2">
              <Sparkles className="h-8 w-8 mx-auto text-slate-600" />
              <p className="text-sm">Belum ada kasus yang telah selesai dipecahkan.</p>
              <p className="text-xs">Buka arsip kasus dan selesaikan 6 tahap investigasi untuk mengarsipkan hasil di sini!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {CASE_FILES.filter(c => profile.solvedCaseIds.includes(c.id)).map(solvedCase => {
                const correctDeduction = solvedCase.finalDeductions.find(d => d.isCorrect);

                return (
                  <div
                    key={solvedCase.id}
                    className="rounded-2xl border border-emerald-500/40 bg-[#0c1427]/80 p-6 space-y-4 backdrop-blur shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-cyan-400">{solvedCase.caseNumber}</span>
                        <span className="text-slate-600">·</span>
                        <span className="text-xs text-slate-400">{solvedCase.category}</span>
                      </div>
                      <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold font-mono">
                        <CheckCircle2 className="h-4 w-4" /> KASUS TERPECAHKAN
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white">{solvedCase.title}</h3>
                    
                    <p className="text-xs text-slate-300 italic border-l-2 border-emerald-500/60 pl-3">
                      &ldquo;{solvedCase.mystery}&rdquo;
                    </p>

                    {correctDeduction && (
                      <div className="rounded-xl bg-emerald-950/40 border border-emerald-500/30 p-4 text-xs space-y-1.5">
                        <span className="font-bold text-emerald-300 block font-mono">DEDUKSI ILMIAH TERBUKTI:</span>
                        <p className="text-slate-200 leading-relaxed">{correctDeduction.explanation}</p>
                        <div className="font-mono text-[11px] text-cyan-300 pt-1">
                          Prinsip Fisika: {correctDeduction.physicsLaw}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => openCase(solvedCase.id)}
                        className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition cursor-pointer"
                      >
                        Buka Ulang Ruang Investigasi Kasus Ini →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Quick Calculator & Formula Sheet */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Quick Math Tool */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-[#0c1427]/80 p-6 space-y-4 backdrop-blur">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold">
              <Calculator className="h-4 w-4" />
              <span>KALKULATOR ILMIAH CEPAT</span>
            </div>

            <form onSubmit={handleCalculate} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Ketikkan Persamaan Matematika</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={calcInput}
                    onChange={e => setCalcInput(e.target.value)}
                    placeholder="Contoh: sqrt(2 * 9.8 * 20)"
                    className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 font-mono text-white focus:border-cyan-500 focus:outline-none"
                    required
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-cyan-500 px-5 py-2.5 font-bold text-slate-950 hover:bg-cyan-400 transition cursor-pointer"
                  >
                    Hitung
                  </button>
                </div>
              </div>

              {calcResult !== null && (
                <div className="rounded-xl border border-slate-700 bg-slate-950 p-4 font-mono">
                  <div className="text-[11px] text-slate-400">Hasil Komputasi:</div>
                  <div className="text-xl font-extrabold text-emerald-400 mt-0.5">{calcResult}</div>
                </div>
              )}

              <div className="pt-2 text-[11px] text-slate-400 space-y-1">
                <span className="font-semibold text-slate-300 block">Operator yang didukung:</span>
                <p>• Tambah (+), Kurang (-), Kali (*), Bagi (/)</p>
                <p>• Pangkat: misal <code className="text-cyan-400 font-mono">5^2</code> atau <code className="text-cyan-400 font-mono">10**3</code></p>
                <p>• Akar kuadrat: misal <code className="text-cyan-400 font-mono">sqrt(64)</code></p>
              </div>
            </form>
          </div>

          {/* Quick Formula Sheet */}
          <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-[#0c1427]/80 p-6 space-y-4 backdrop-blur">
            <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span>FORMULA KILAT FORENSIK FISIKA</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800 space-y-1.5">
                <span className="font-bold text-cyan-400 block font-mono">Jatuh Bebas (GJB)</span>
                <div className="font-mono text-white font-semibold">h = ½ g t²</div>
                <div className="font-mono text-white font-semibold">v = √(2gh)</div>
                <p className="text-[10px] text-slate-400 pt-0.5">Independen terhadap massa objek</p>
              </div>

              <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800 space-y-1.5">
                <span className="font-bold text-cyan-400 block font-mono">Kekekalan Energi</span>
                <div className="font-mono text-white font-semibold">Em = Ep + Ek = konstan</div>
                <div className="font-mono text-white font-semibold">W_gesek = fk · s</div>
                <p className="text-[10px] text-slate-400 pt-0.5">Ep = mgh, Ek = ½ mv²</p>
              </div>

              <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800 space-y-1.5">
                <span className="font-bold text-cyan-400 block font-mono">Hukum Newton</span>
                <div className="font-mono text-white font-semibold">ΣF = m · a</div>
                <div className="font-mono text-white font-semibold">fk = μk · N</div>
                <p className="text-[10px] text-slate-400 pt-0.5">ΣF = 0 bila benda diam/GLB</p>
              </div>

              <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800 space-y-1.5">
                <span className="font-bold text-cyan-400 block font-mono">Listrik DC & Daya</span>
                <div className="font-mono text-white font-semibold">V = I · R</div>
                <div className="font-mono text-white font-semibold">P = I² R = V² / R</div>
                <p className="text-[10px] text-slate-400 pt-0.5">Seri: Rs = R1+R2; Paralel: 1/Rp = 1/R1+1/R2</p>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
