import React, { useState } from 'react';
import { useDetective } from '../../context/DetectiveContext';
import { CASE_FILES } from '../../data/cases';
import { FreeFallCanvas } from '../simulations/FreeFallCanvas';
import { EnergyPlaneCanvas } from '../simulations/EnergyPlaneCanvas';
import { NewtonForceCanvas } from '../simulations/NewtonForceCanvas';
import { WaveCanvas } from '../simulations/WaveCanvas';
import { CircuitCanvas } from '../simulations/CircuitCanvas';
import { 
  ArrowLeft, 
  ArrowRight, 
  Eye, 
  Search, 
  Lightbulb, 
  Sliders, 
  BarChart3, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Sparkles,
  Layers,
  FileText,
  Activity,
  Check,
  X
} from 'lucide-react';

export const InvestigationRoom: React.FC = () => {
  const { selectedCaseId, setActiveTab, markCaseSolved, addXP, unlockAchievement, addNote, profile } = useDetective();
  
  const currentCase = CASE_FILES.find(c => c.id === (selectedCaseId || 'case-001')) || CASE_FILES[0];
  const isAlreadySolved = profile.solvedCaseIds.includes(currentCase.id);

  const [currentStage, setCurrentStage] = useState<number>(1);
  const [inspectedEvidenceIds, setInspectedEvidenceIds] = useState<string[]>([]);
  const [activeEvidenceModal, setActiveEvidenceModal] = useState<any | null>(null);
  const [selectedHypothesisId, setSelectedHypothesisId] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [selectedDeductionId, setSelectedDeductionId] = useState<string | null>(null);
  const [isVerdictSubmitted, setIsVerdictSubmitted] = useState<boolean>(isAlreadySolved);

  const stages = [
    { num: 1, name: 'Case Briefing', label: '1. Briefing TKP', icon: Eye },
    { num: 2, name: 'Evidence Panel', label: '2. Bukti Forensik', icon: Search },
    { num: 3, name: 'Hypothesis', label: '3. Hipotesis', icon: Lightbulb },
    { num: 4, name: 'Experiment', label: '4. Eksperimen Lab', icon: Sliders },
    { num: 5, name: 'Data Analysis', label: '5. Analisis Data', icon: BarChart3 },
    { num: 6, name: 'Conclusion', label: '6. Deduksi Akhir', icon: ShieldCheck },
  ];

  const handleInspectEvidence = (ev: any) => {
    setActiveEvidenceModal(ev);
    if (!inspectedEvidenceIds.includes(ev.id)) {
      setInspectedEvidenceIds(prev => [...prev, ev.id]);
      unlockAchievement('first_clue');
      addXP(25, `Bukti "${ev.name}" berhasil dianalisis di laboratorium`);
    }
  };

  const handleSelectHypothesis = (hypId: string) => {
    setSelectedHypothesisId(hypId);
    const hyp = currentCase.hypotheses.find(h => h.id === hypId);
    if (hyp?.isScientificallySound) {
      addXP(30, 'Hipotesis ilmiah terarah berhasil dirumuskan');
    }
  };

  const handleAnswerQuestion = (questionId: string, optionIdx: number) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
    const q = currentCase.analysisQuestions.find(item => item.id === questionId);
    if (q && q.correctOptionIndex === optionIdx) {
      addXP(40, 'Analisis bukti empiris terverifikasi tepat');
    }
  };

  const handleSubmitFinalVerdict = () => {
    if (!selectedDeductionId) return;
    const deduction = currentCase.finalDeductions.find(d => d.id === selectedDeductionId);
    setIsVerdictSubmitted(true);

    if (deduction?.isCorrect) {
      markCaseSolved(currentCase.id, currentCase.xpReward);
      addNote({
        caseId: currentCase.id,
        title: `Laporan Kasus: ${currentCase.title} (${currentCase.caseNumber})`,
        content: `Misteri Terpecahkan: ${deduction.verdict}\n\nPenjelasan Ilmiah: ${deduction.explanation}\n\nHukum Fisika Utama: ${deduction.physicsLaw}`,
        formulaDraft: currentCase.concepts.join(', ')
      });
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* 1. TOP CASE COMMAND HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('cases')}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white transition cursor-pointer"
            title="Kembali ke Daftar Kasus"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <span className="font-bold">{currentCase.caseNumber}</span>
              <span>·</span>
              <span>{currentCase.category}</span>
              <span>·</span>
              <span className="text-slate-400">Tingkat: {currentCase.difficulty}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
              {currentCase.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isAlreadySolved ? (
            <div className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-bold text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
              <span>Kasus Terpecahkan (+{currentCase.xpReward} XP)</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-mono text-cyan-300">
              <Activity className="h-3.5 w-3.5" />
              <span>Reward: +{currentCase.xpReward} XP</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. INVESTIGATION PROGRESS STEPPER */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {stages.map(stage => {
          const Icon = stage.icon;
          const isActive = currentStage === stage.num;
          const isPassed = currentStage > stage.num;

          return (
            <button
              key={stage.num}
              onClick={() => setCurrentStage(stage.num)}
              className={`flex items-center gap-2.5 rounded-xl border p-3 text-left transition cursor-pointer ${
                isActive
                  ? 'border-cyan-500 bg-cyan-500/15 text-cyan-300 font-bold shadow-md shadow-cyan-500/10'
                  : isPassed
                  ? 'border-slate-800 bg-slate-900/90 text-emerald-400 hover:border-slate-700'
                  : 'border-slate-800 bg-[#0c1427]/60 text-slate-400 hover:bg-slate-900/60 hover:text-white'
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 font-extrabold'
                    : isPassed
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {isPassed ? <CheckCircle2 className="h-4 w-4" /> : stage.num}
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 truncate">
                  {stage.name}
                </span>
                <span className="block text-xs font-semibold text-white truncate">
                  {stage.label.split('. ')[1]}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. ACTIVE STAGE WORKSPACE PANEL */}
      <div className="rounded-2xl border border-slate-800 bg-[#0c1427]/80 p-6 md:p-8 backdrop-blur min-h-[500px] flex flex-col justify-between shadow-2xl">
        
        {/* STAGE 1: CASE BRIEFING */}
        {currentStage === 1 && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  TAHAP 1 / 6: OBSERVASI & BRIEFING AWAL TKP
                </span>
                <h2 className="text-xl font-extrabold text-white mt-1">
                  Amati Tempat Kejadian Perkara & Fenomena Misterius
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Scene Visual */}
              <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-lg">
                <img
                  src={currentCase.imageUrl}
                  alt={currentCase.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-64 object-cover"
                />
                <div className="p-3.5 text-xs text-slate-300 bg-slate-950 border-t border-slate-800 leading-relaxed">
                  <span className="font-mono text-cyan-400 font-bold block mb-1">REKONSTRUKSI VISUAL TKP:</span>
                  {currentCase.observe.sceneVisualDescription}
                </div>
              </div>

              {/* Briefing Text */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* Laporan Kejadian */}
                <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-4 space-y-1.5">
                  <h4 className="text-xs font-bold text-cyan-400 font-mono tracking-wider">
                    LAPORAN INSIDEN RESMI (INCIDENT DOSSIER)
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {currentCase.observe.incidentReport}
                  </p>
                </div>

                {/* Kesaksian Saksi */}
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-1.5">
                  <h4 className="text-xs font-bold text-sky-400 font-mono tracking-wider">
                    KESAKSIAN SAKSI MATA DI LOKASI
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                    {currentCase.observe.witnessStatement}
                  </p>
                </div>

                {/* Observasi Kunci */}
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-4 space-y-2">
                  <h4 className="text-xs font-bold text-slate-200 font-mono">
                    CATATAN OBSERVASI AWAL DETEKTIF:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                    {currentCase.observe.keyObservations.map((obs, i) => (
                      <li key={i} className="leading-relaxed">{obs}</li>
                    ))}
                  </ul>
                </div>

                {/* Pertanyaan Pemandu */}
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-2">
                  <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5 font-mono">
                    <HelpCircle className="h-4 w-4" /> PERTANYAAN PEMANDU PENALARAN:
                  </h4>
                  <ul className="space-y-1 text-xs text-amber-200/90 list-disc list-inside">
                    {currentCase.observe.guidingQuestions.map((q, i) => (
                      <li key={i} className="leading-relaxed">{q}</li>
                    ))}
                  </ul>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* STAGE 2: EVIDENCE PANEL */}
        {currentStage === 2 && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  TAHAP 2 / 6: PANEL BUKTI FORENSIK SAINS
                </span>
                <h2 className="text-xl font-extrabold text-white mt-1">
                  Analisis Bukti Fisik & Nilai Parameter Terukur
                </h2>
              </div>
              <span className="text-xs font-mono text-cyan-400 tabular-nums">
                {inspectedEvidenceIds.length} / {currentCase.evidenceList.length} Bukti Terverifikasi (+25 XP tiap bukti)
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300">
              Pilih setiap barang bukti forensik di bawah ini untuk membuka detail instrumen dan relevansi ilmiahnya:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {currentCase.evidenceList.map(ev => {
                const isInspected = inspectedEvidenceIds.includes(ev.id);

                return (
                  <div
                    key={ev.id}
                    onClick={() => handleInspectEvidence(ev)}
                    className={`rounded-2xl border p-5 transition cursor-pointer flex flex-col justify-between ${
                      isInspected
                        ? 'border-emerald-500/50 bg-emerald-950/20 shadow-md shadow-emerald-500/10'
                        : 'border-slate-800 bg-[#0e172e]/60 hover:border-cyan-500/50 hover:bg-[#0e172e]'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-slate-400">{ev.location}</span>
                        {isInspected ? (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Terverifikasi
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold text-cyan-400">
                            Klik untuk Analisis
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-bold text-white">{ev.name}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{ev.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs">
                      {ev.dataValue && (
                        <div className="font-mono text-cyan-300 text-[11px]">
                          Nilai Terukur: <span className="font-bold">{ev.dataValue}</span>
                        </div>
                      )}
                      <p className="text-slate-400 text-[11px] line-clamp-2">
                        {ev.scientificRelevance}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Evidence Detail Modal */}
            {activeEvidenceModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                <div 
                  className="w-full max-w-lg rounded-2xl border border-cyan-500/40 bg-[#0b1220] p-6 shadow-2xl space-y-4"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-cyan-400" />
                      <h3 className="text-sm font-bold text-white">{activeEvidenceModal.name}</h3>
                    </div>
                    <button
                      onClick={() => setActiveEvidenceModal(null)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-slate-400 font-mono block">Lokasi Ditemukan:</span>
                      <p className="text-white font-medium mt-0.5">{activeEvidenceModal.location}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-mono block">Deskripsi Fisik:</span>
                      <p className="text-slate-200 mt-0.5 leading-relaxed">{activeEvidenceModal.description}</p>
                    </div>
                    {activeEvidenceModal.dataValue && (
                      <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-3 font-mono">
                        <span className="text-cyan-400 font-bold block">DATA TELEMETRI TERUKUR:</span>
                        <div className="text-sm font-bold text-white mt-1">{activeEvidenceModal.dataValue}</div>
                      </div>
                    )}
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-3">
                      <span className="text-emerald-400 font-bold font-mono block">RELEVANSI HUKUM FISIKA:</span>
                      <p className="text-emerald-200 mt-1 leading-relaxed">{activeEvidenceModal.scientificRelevance}</p>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => setActiveEvidenceModal(null)}
                      className="rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition cursor-pointer"
                    >
                      Konfirmasi Bukti & Tutup
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* STAGE 3: HYPOTHESIS WORKSPACE */}
        {currentStage === 3 && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                TAHAP 3 / 6: PERUMUSAN HIPOTESIS ILMIAH
              </span>
              <h2 className="text-xl font-extrabold text-white mt-1">
                Tentukan Dugaan Rasional Sebelum Menguji di Laboratorium
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-300">
              Berdasarkan bukti fisik TKP, pilihlah hipotesis mana yang paling selaras dengan hukum-hukum alam dasar:
            </p>

            <div className="space-y-4">
              {currentCase.hypotheses.map(hyp => {
                const isSelected = selectedHypothesisId === hyp.id;

                return (
                  <div
                    key={hyp.id}
                    onClick={() => handleSelectHypothesis(hyp.id)}
                    className={`rounded-2xl border p-5 transition cursor-pointer ${
                      isSelected
                        ? hyp.isScientificallySound
                          ? 'border-emerald-500/60 bg-emerald-950/30 shadow-md shadow-emerald-500/10'
                          : 'border-rose-500/60 bg-rose-950/30 shadow-md shadow-rose-500/10'
                        : 'border-slate-800 bg-[#0e172e]/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                          isSelected
                            ? hyp.isScientificallySound
                              ? 'border-emerald-400 bg-emerald-500 text-slate-950'
                              : 'border-rose-400 bg-rose-500 text-white'
                            : 'border-slate-600 bg-slate-800 text-slate-300'
                        }`}
                      >
                        {isSelected ? (hyp.isScientificallySound ? '✓' : '✕') : ''}
                      </div>

                      <div className="flex-1 space-y-2.5">
                        <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed">
                          {hyp.statement}
                        </p>

                        {isSelected && (
                          <div
                            className={`rounded-xl p-3.5 text-xs leading-relaxed ${
                              hyp.isScientificallySound
                                ? 'bg-emerald-950/60 text-emerald-200 border border-emerald-500/40'
                                : 'bg-rose-950/60 text-rose-200 border border-rose-500/40'
                            }`}
                          >
                            <strong className="block mb-1 font-mono">
                              {hyp.isScientificallySound ? '✓ Hipotesis Terarah Valid (+30 XP)' : '✕ Evaluasi Logika Sains:'}
                            </strong>
                            {hyp.scientificFeedback}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STAGE 4: EXPERIMENT WORKSPACE */}
        {currentStage === 4 && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                TAHAP 4 / 6: EKSPERIMEN LABORATORIUM VIRTUAL
              </span>
              <h2 className="text-xl font-extrabold text-white mt-1">
                {currentCase.experimentPreset.title}
              </h2>
            </div>

            <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-4 space-y-2 text-xs">
              <div className="text-cyan-400 font-bold font-mono">MISI EKSPERIMEN:</div>
              <p className="text-white font-medium text-sm">{currentCase.experimentPreset.goal}</p>
              <ul className="space-y-1 text-slate-300 pt-1 list-disc list-inside">
                {currentCase.experimentPreset.instructions.map((inst, i) => (
                  <li key={i}>{inst}</li>
                ))}
              </ul>
            </div>

            {/* Embedded interactive simulation tailored for this case */}
            <div>
              {currentCase.simulationType === 'free-fall' && <FreeFallCanvas />}
              {currentCase.simulationType === 'energy-plane' && <EnergyPlaneCanvas />}
              {currentCase.simulationType === 'newton-force' && <NewtonForceCanvas />}
              {currentCase.simulationType === 'wave' && <WaveCanvas />}
              {currentCase.simulationType === 'circuit' && <CircuitCanvas />}
            </div>
          </div>
        )}

        {/* STAGE 5: DATA ANALYSIS */}
        {currentStage === 5 && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                TAHAP 5 / 6: ANALISIS DATA & PERHITUNGAN SISTEMATIS
              </span>
              <h2 className="text-xl font-extrabold text-white mt-1">
                Validasi Temuan Eksperimen dengan Persamaan Fisika
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-300">
              Jawab pertanyaan analisis berikut berdasarkan data eksperimen virtual Anda:
            </p>

            <div className="space-y-6">
              {currentCase.analysisQuestions.map((q, qIndex) => {
                const selectedOpt = userAnswers[q.id];
                const isAnswered = selectedOpt !== undefined;
                const isCorrect = isAnswered && selectedOpt === q.correctOptionIndex;

                return (
                  <div key={q.id} className="rounded-2xl border border-slate-800 bg-[#0e172e]/60 p-5 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="text-sm font-bold text-white">
                        {qIndex + 1}. {q.question}
                      </h4>
                      {q.formulaTip && (
                        <span className="shrink-0 rounded-lg bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-1 text-[11px] font-mono text-cyan-300">
                          {q.formulaTip}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2.5">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = selectedOpt === optIdx;

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleAnswerQuestion(q.id, optIdx)}
                            className={`w-full text-left rounded-xl border p-3.5 text-xs sm:text-sm transition cursor-pointer ${
                              isChosen
                                ? optIdx === q.correctOptionIndex
                                  ? 'border-emerald-500 bg-emerald-500/15 text-emerald-200 font-semibold shadow-sm'
                                  : 'border-rose-500 bg-rose-500/15 text-rose-200'
                                : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                            }`}
                          >
                            <span className="mr-2 font-mono font-bold text-cyan-400">
                              {String.fromCharCode(65 + optIdx)}.
                            </span>
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && (
                      <div
                        className={`rounded-xl p-4 text-xs leading-relaxed ${
                          isCorrect
                            ? 'bg-emerald-950/60 text-emerald-200 border border-emerald-500/40'
                            : 'bg-amber-950/60 text-amber-200 border border-amber-500/40'
                        }`}
                      >
                        <strong className="block mb-1 font-mono text-sm">
                          {isCorrect ? '✓ Analisis Tepat! (+40 XP)' : 'Catatan Penyelidik:'}
                        </strong>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STAGE 6: FINAL CONCLUSION & DEDUCTION */}
        {currentStage === 6 && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                TAHAP 6 / 6: DEDUKSI FORENSIK AKHIR
              </span>
              <h2 className="text-xl font-extrabold text-white mt-1">
                Pecahkan Misteri & Susun Laporan Sains
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-300">
              Berdasarkan seluruh hasil observasi, bukti fisik, hipotesis, dan simulasi, pilihlah kesimpulan akhir yang paling valid:
            </p>

            <div className="space-y-4">
              {currentCase.finalDeductions.map(ded => {
                const isSelected = selectedDeductionId === ded.id;

                return (
                  <div
                    key={ded.id}
                    onClick={() => !isVerdictSubmitted && setSelectedDeductionId(ded.id)}
                    className={`rounded-2xl border p-5 transition ${
                      isVerdictSubmitted
                        ? ded.isCorrect
                          ? 'border-emerald-500 bg-emerald-950/30'
                          : isSelected
                          ? 'border-rose-500 bg-rose-950/30'
                          : 'border-slate-800 bg-slate-950/40 opacity-40'
                        : isSelected
                        ? 'border-cyan-500 bg-cyan-500/10 cursor-pointer shadow-md shadow-cyan-500/10'
                        : 'border-slate-800 bg-[#0e172e]/60 hover:border-slate-700 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                          isSelected
                            ? 'border-cyan-400 bg-cyan-500 text-slate-950'
                            : 'border-slate-600 bg-slate-800 text-slate-300'
                        }`}
                      >
                        {isSelected ? '✓' : ''}
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-base font-bold text-white">{ded.verdict}</h4>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{ded.explanation}</p>
                        <div className="font-mono text-[11px] text-cyan-400">
                          Prinsip Fisika Utama: {ded.physicsLaw}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {!isVerdictSubmitted ? (
              <div className="pt-2">
                <button
                  onClick={handleSubmitFinalVerdict}
                  disabled={!selectedDeductionId}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3.5 text-xs sm:text-sm font-bold text-white shadow-xl shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShieldCheck className="h-5 w-5" />
                  <span>Kirim Laporan Forensik & Pecahkan Kasus Ini</span>
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border border-emerald-500/60 bg-emerald-950/30 p-6 sm:p-8 text-center space-y-4">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold text-white">Kasus Berhasil Dipecahkan!</h3>
                  <p className="text-xs sm:text-sm text-emerald-200 max-w-lg mx-auto leading-relaxed">
                    Deduksi Anda sepenuhnya akurat dan selaras dengan prinsip fisika modern. Berkas laporan telah diarsipkan ke dalam Buku Catatan Detektif Anda.
                  </p>
                </div>
                <div className="pt-2 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => setActiveTab('cases')}
                    className="rounded-xl bg-slate-800 px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-700 transition cursor-pointer"
                  >
                    Buka Arsip Kasus Lain
                  </button>
                  <button
                    onClick={() => setActiveTab('notebook')}
                    className="rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition cursor-pointer shadow-md"
                  >
                    Buka Buku Catatan Detektif
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. STEPPER BOTTOM NAVIGATION */}
        <div className="mt-8 pt-5 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => setCurrentStage(prev => Math.max(1, prev - 1))}
            disabled={currentStage === 1}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Tahap Sebelumnya</span>
          </button>

          <span className="text-xs font-mono text-slate-400">
            Tahap <span className="text-white font-bold">{currentStage}</span> dari 6
          </span>

          <button
            onClick={() => setCurrentStage(prev => Math.min(6, prev + 1))}
            disabled={currentStage === 6}
            className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shadow-md shadow-cyan-500/20"
          >
            <span>Tahap Selanjutnya</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
