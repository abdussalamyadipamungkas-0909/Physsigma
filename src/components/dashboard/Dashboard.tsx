import React, { useState } from 'react';
import { useDetective } from '../../context/DetectiveContext';
import { CASE_FILES } from '../../data/cases';
import { 
  ShieldCheck, 
  Award, 
  ArrowRight, 
  Compass, 
  BookOpen, 
  Sliders, 
  Zap, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Target,
  GraduationCap,
  ChevronRight,
  TrendingUp,
  Activity,
  Layers,
  FileCheck
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { profile, setActiveTab, openCase } = useDetective();

  const activeCase = CASE_FILES.find(c => c.id === (profile.activeCaseId || 'case-001')) || CASE_FILES[0];
  const solvedCount = profile.solvedCaseIds.length;
  const totalCases = CASE_FILES.length;
  const progressPercent = Math.round((solvedCount / totalCases) * 100);

  // Next level calculation
  const nextLevelXP = profile.level === 1 ? 400 : profile.level === 2 ? 1000 : profile.level === 3 ? 2000 : 3500;
  const prevLevelXP = profile.level === 1 ? 0 : profile.level === 2 ? 400 : profile.level === 3 ? 1000 : 2000;
  const levelProgress = Math.min(100, Math.round(((profile.xp - prevLevelXP) / (nextLevelXP - prevLevelXP)) * 100));

  // Synthesize recent activities timeline from profile data
  const activities = [
    ...(profile.solvedCaseIds.map((cId, idx) => {
      const c = CASE_FILES.find(item => item.id === cId);
      return {
        id: `solved-${cId}`,
        type: 'case',
        title: `Kasus ${c?.caseNumber || cId} Terpecahkan`,
        desc: `Menuntaskan deduksi ilmiah untuk: "${c?.title || 'Insiden Fisika'}"`,
        timestamp: 'Baru Saja',
        xp: `+${c?.xpReward || 350} XP`
      };
    })),
    ...(profile.achievements.filter(a => a.unlockedAt).map(a => ({
      id: `ach-${a.id}`,
      type: 'achievement',
      title: `Lencana: ${a.title}`,
      desc: a.description,
      timestamp: a.unlockedAt || 'Tercapai',
      xp: 'Prestasi'
    }))),
    ...(profile.notes.map(n => ({
      id: n.id,
      type: 'note',
      title: `Jurnal Forensik: ${n.title}`,
      desc: n.formulaDraft ? `Persamaan: ${n.formulaDraft}` : 'Catatan hasil pengamatan tersimpan',
      timestamp: n.createdAt,
      xp: 'Tercatat'
    }))),
    ...(profile.completedChallengeIds.map((chId, idx) => ({
      id: `ch-${chId}-${idx}`,
      type: 'challenge',
      title: `Tantangan Konseptual Terselesaikan`,
      desc: `Ujian kualifikasi forensik kuis berhasil dijawab dengan tepat`,
      timestamp: 'Terverifikasi',
      xp: '+100 XP'
    })))
  ].slice(0, 5);

  return (
    <div className="space-y-8 pb-16">
      
      {/* 1. HERO SECTION: Futuristic Scientific Investigation Command */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[#0c1427]/80 p-6 sm:p-8 lg:p-10 shadow-2xl backdrop-blur-xl">
        {/* Subtle atmospheric ambient glows and lab grid */}
        <div className="absolute inset-0 bg-lab-grid opacity-30 pointer-events-none" />
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Command Mission & Pitch */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-mono text-cyan-300">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>DIVISI INVESTIGASI FORENSIK FISIKA SMA/MA</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight text-balance">
                Pusat Kendali <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400">Investigasi Sains</span> Digital
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                Setiap fenomena alam menyimpan jejak hukum fisika yang dapat dibuktikan. Kumpulkan bukti fisik di TKP, rumuskan hipotesis ilmiah, uji di laboratorium simulasi 60 FPS, dan buktikan kebenaran menggunakan persamaan nyata.
              </p>
            </div>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => openCase(activeCase.id)}
                className="flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-blue-500 transition cursor-pointer"
              >
                <span>{profile.solvedCaseIds.includes(activeCase.id) ? 'Buka Kasus Aktif' : `Lanjutkan Kasus: ${activeCase.caseNumber}`}</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => setActiveTab('simulation')}
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-5 py-3 text-xs sm:text-sm font-semibold text-slate-200 hover:bg-slate-800 hover:border-slate-600 transition cursor-pointer"
              >
                <Sliders className="h-4 w-4 text-cyan-400" />
                <span>Buka Lab Virtual</span>
              </button>

              <button
                onClick={() => setActiveTab('knowledge')}
                className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-xs sm:text-sm font-medium text-slate-400 hover:text-white transition cursor-pointer"
              >
                <GraduationCap className="h-4 w-4 text-emerald-400" />
                <span>Pusat Teori</span>
              </button>
            </div>

            {/* Scientific Method Pedagogy Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] font-mono text-slate-400">
              <span className="text-slate-500">Metode Ilmiah:</span>
              <span className="text-cyan-400">Observasi</span>
              <span>→</span>
              <span className="text-cyan-400">Bukti TKP</span>
              <span>→</span>
              <span className="text-cyan-400">Hipotesis</span>
              <span>→</span>
              <span className="text-cyan-400">Eksperimen</span>
              <span>→</span>
              <span className="text-cyan-400">Deduksi</span>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset & Insignia */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-950/90 p-3 shadow-2xl shadow-cyan-500/10">
              
              {/* Foreground Image */}
              <div className="relative h-64 sm:h-72 w-full rounded-xl overflow-hidden bg-slate-950">
                <img
                  src="/src/assets/images/hero_physics_detective_lab_1794295502067.jpg"
                  alt="Physics Detective Laboratory"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                
                {/* Floating Insignia Stamp */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl border border-cyan-500/30 bg-[#090e1a]/90 p-2.5 backdrop-blur-md">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={profile.avatar}
                      alt="Detective Emblem"
                      referrerPolicy="no-referrer"
                      className="h-9 w-9 rounded-lg border border-cyan-400/40 object-cover"
                    />
                    <div>
                      <div className="text-xs font-bold text-white">{profile.codeName}</div>
                      <div className="text-[10px] font-mono text-cyan-400">{profile.rank}</div>
                    </div>
                  </div>
                  <div className="text-right font-mono text-[11px] text-slate-300">
                    <span className="text-cyan-400 font-bold">{profile.xp}</span> XP
                  </div>
                </div>
              </div>

              {/* Status bar */}
              <div className="mt-3 flex items-center justify-between px-1 text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Sistem Telemetri Aktif</span>
                </span>
                <span>Standar SI 60 FPS</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. STATISTICS KPI DECK */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Cases Solved */}
        <div className="rounded-2xl border border-slate-800 bg-[#0c1427]/70 p-5 space-y-3 backdrop-blur transition hover:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Kasus Terpecahkan</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <FileCheck className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tabular-nums">
              {solvedCount} <span className="text-sm font-normal text-slate-500">/ {totalCases}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Tingkat penyelesaian: {progressPercent}%
            </p>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* KPI 2: Total Experience XP */}
        <div className="rounded-2xl border border-slate-800 bg-[#0c1427]/70 p-5 space-y-3 backdrop-blur transition hover:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Pengalaman (XP)</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-cyan-400 tabular-nums">
              {profile.xp} <span className="text-sm font-normal text-slate-500">XP</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Menuju Lv.{profile.level + 1}: {nextLevelXP - profile.xp} XP lagi
            </p>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
              style={{ width: `${levelProgress}%` }}
            />
          </div>
        </div>

        {/* KPI 3: Detective Rank & Level */}
        <div className="rounded-2xl border border-slate-800 bg-[#0c1427]/70 p-5 space-y-3 backdrop-blur transition hover:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Tingkat Kemahiran Detektif</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-base sm:text-lg font-bold text-white truncate">
              {profile.rank}
            </div>
            <p className="text-xs font-mono text-violet-400 mt-1">
              Pangkat Resmi Level {profile.level}
            </p>
          </div>
          <div className="text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800/80">
            {profile.level >= 4 ? 'Pangkat Maksimal Tercapai' : 'Ditingkatkan lewat deduksi sains'}
          </div>
        </div>

        {/* KPI 4: Badges & Notebook Logs */}
        <div className="rounded-2xl border border-slate-800 bg-[#0c1427]/70 p-5 space-y-3 backdrop-blur transition hover:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Lencana Forensik & Jurnal</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400 tabular-nums">
              {profile.achievements.filter(a => a.unlockedAt).length} <span className="text-sm font-normal text-slate-500">/ {profile.achievements.length}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {profile.notes.length} Catatan tersimpan di notebook
            </p>
          </div>
          <div className="text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800/80">
            {profile.completedChallengeIds.length} Tantangan kuis terselesaikan
          </div>
        </div>

      </section>

      {/* 3. FEATURED ACTIVE CASE SPOTLIGHT */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <Compass className="h-3.5 w-3.5" />
              <span>BERKAS INVESTIGASI PRIORITAS</span>
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-tight mt-0.5">
              Kasus Aktif Sedang Diteliti
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('cases')}
            className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition"
          >
            <span>Buka Semua Berkas Kasus</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0c1427]/90 transition hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
            
            {/* Case Cover Picture */}
            <div className="md:col-span-5 relative min-h-[240px] md:min-h-full overflow-hidden bg-slate-950">
              <img
                src={activeCase.imageUrl}
                alt={activeCase.title}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent md:hidden" />
              
              <div className="absolute top-4 left-4 rounded-lg bg-slate-950/90 px-3 py-1 text-xs font-mono font-bold text-cyan-300 border border-cyan-500/40 backdrop-blur">
                {activeCase.caseNumber}
              </div>

              {profile.solvedCaseIds.includes(activeCase.id) ? (
                <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-lg bg-emerald-950/90 px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-500/40 backdrop-blur">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Kasus Terpecahkan</span>
                </div>
              ) : (
                <div className="absolute top-4 right-4 rounded-lg bg-amber-500/20 px-3 py-1 text-xs font-mono font-semibold text-amber-300 border border-amber-500/40 backdrop-blur">
                  Investigasi Terbuka
                </div>
              )}
            </div>

            {/* Case Details */}
            <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <span className="font-semibold text-cyan-400">{activeCase.category}</span>
                  <span>·</span>
                  <span>Tingkat: {activeCase.difficulty}</span>
                  <span>·</span>
                  <span className="font-mono text-cyan-300 font-bold">+{activeCase.xpReward} XP</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                  {activeCase.title}
                </h3>

                <p className="text-xs sm:text-sm text-cyan-200/90 italic border-l-2 border-cyan-500/80 pl-3 py-0.5">
                  &ldquo;{activeCase.mystery}&rdquo;
                </p>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {activeCase.synopsis}
                </p>
              </div>

              {/* Concepts Tags */}
              <div className="flex flex-wrap gap-1.5">
                {activeCase.concepts.map((concept, i) => (
                  <span
                    key={i}
                    className="rounded-lg bg-slate-800/80 px-2.5 py-1 text-[11px] font-mono text-slate-300 border border-slate-700/60"
                  >
                    {concept}
                  </span>
                ))}
              </div>

              {/* Action Bar */}
              <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs text-slate-400">
                  {profile.solvedCaseIds.includes(activeCase.id)
                    ? 'Deduksi ilmiah telah tersimpan di Buku Catatan Detektif'
                    : '6 Tahapan: Observasi → Bukti → Hipotesis → Eksperimen → Analisis → Deduksi'}
                </span>

                <button
                  onClick={() => openCase(activeCase.id)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition cursor-pointer shrink-0"
                >
                  <span>
                    {profile.solvedCaseIds.includes(activeCase.id) ? 'Tinjau Ulang Ruang Investigasi' : 'Lanjutkan Investigasi'}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 4. ACTIVE CASES ARCHIVE GRID */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Seluruh Berkas Kasus Digital
            </h2>
            <p className="text-xs text-slate-400">Pilih fenomena alam yang ingin Anda pecahkan</p>
          </div>
          <span className="font-mono text-xs text-cyan-400 tabular-nums font-semibold">
            {solvedCount} / {totalCases} Selesai ({progressPercent}%)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CASE_FILES.map(item => {
            const isSolved = profile.solvedCaseIds.includes(item.id);
            const isActive = profile.activeCaseId === item.id;

            return (
              <div
                key={item.id}
                onClick={() => openCase(item.id)}
                className={`group flex flex-col justify-between rounded-2xl border p-5 transition cursor-pointer ${
                  isActive
                    ? 'border-cyan-500/70 bg-[#0e172e] shadow-lg shadow-cyan-500/10'
                    : isSolved
                    ? 'border-slate-800 bg-[#0c1427]/70 hover:border-slate-700 hover:bg-[#0e172e]/80'
                    : 'border-slate-800 bg-[#0c1427]/50 hover:border-cyan-500/40 hover:bg-[#0e172e]/60'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-cyan-400">{item.caseNumber}</span>
                    {isSolved ? (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Terpecahkan
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500">Belum Selesai</span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition line-clamp-1">
                    {item.title}
                  </h4>

                  <p className="text-xs text-slate-300 italic line-clamp-2">
                    &ldquo;{item.mystery}&rdquo;
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">{item.category} · {item.difficulty}</span>
                  <span className="font-mono text-cyan-300 font-bold">+{item.xpReward} XP</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. SPLIT: RECENT ACTIVITY TIMELINE & QUICK LAB APPARATUS */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Activity Timeline */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-800 bg-[#0c1427]/80 p-6 space-y-4 backdrop-blur">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Riwayat Aktivitas Investigasi</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Log Kronologis</span>
          </div>

          <div className="space-y-3">
            {activities.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                Belum ada aktivitas tercatat. Mulai investigasi pada kasus pertama untuk membuat catatan forensik!
              </div>
            ) : (
              activities.map((act) => (
                <div
                  key={act.id}
                  className="flex items-start gap-3 rounded-xl border border-slate-800/80 bg-slate-900/50 p-3 text-xs"
                >
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Activity className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-white truncate">{act.title}</h5>
                      <span className="font-mono text-[10px] text-cyan-400 font-bold shrink-0">{act.xp}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-1">{act.desc}</p>
                    <span className="text-[10px] font-mono text-slate-500">{act.timestamp}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Accelerator Lab Cards */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <button
            onClick={() => setActiveTab('simulation')}
            className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-[#0c1427]/70 p-5 text-left transition hover:border-cyan-500/50 hover:bg-[#0e172e] cursor-pointer group"
          >
            <div className="space-y-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:bg-cyan-500/20 transition">
                <Sliders className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition">
                Lab Simulasi Virtual
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                6 simulator interaktif: tabung vakum, bidang miring, inersia Newton, gelombang, sirkuit DC, gerak parabola.
              </p>
            </div>
            <span className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
              Eksperimen Bebas <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </button>

          <button
            onClick={() => setActiveTab('notebook')}
            className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-[#0c1427]/70 p-5 text-left transition hover:border-amber-500/50 hover:bg-[#0e172e] cursor-pointer group"
          >
            <div className="space-y-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:bg-amber-500/20 transition">
                <BookOpen className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                Buku Catatan Detektif
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Kompilasi bukti TKP terverifikasi, kalkulator analitis, dan arsip formula fisika pribadi Anda.
              </p>
            </div>
            <span className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-amber-400">
              Buka Jurnal ({profile.notes.length}) <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </button>

          <button
            onClick={() => setActiveTab('knowledge')}
            className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-[#0c1427]/70 p-5 text-left transition hover:border-emerald-500/50 hover:bg-[#0e172e] cursor-pointer group"
          >
            <div className="space-y-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition">
                <GraduationCap className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition">
                Pusat Pengetahuan
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Materi kurikulum SMA lengkap, tabel besaran SI, contoh perhitungan bertahap, dan telaah fenomena.
              </p>
            </div>
            <span className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              Pelajari Teori <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </button>

          <button
            onClick={() => setActiveTab('challenges')}
            className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-[#0c1427]/70 p-5 text-left transition hover:border-rose-500/50 hover:bg-[#0e172e] cursor-pointer group"
          >
            <div className="space-y-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 group-hover:bg-rose-500/20 transition">
                <Target className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-rose-300 transition">
                Tantangan Deduksi & Kuis
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Asah ketajaman logika penalaran fisika lewat skenario teka-teki berwaktu dengan reward XP melimpah.
              </p>
            </div>
            <span className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-rose-400">
              Mulai Uji Tantangan <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </button>

        </div>

      </section>

      {/* 6. ACHIEVEMENTS SHOWCASE */}
      <section className="rounded-2xl border border-slate-800 bg-[#0c1427]/60 p-6 space-y-5 backdrop-blur">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Lencana Forensik & Penghargaan Sains</h3>
          </div>
          <span className="text-xs font-mono text-cyan-400 tabular-nums font-semibold">
            {profile.achievements.filter(a => a.unlockedAt).length} / {profile.achievements.length} Terkumpul
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {profile.achievements.map(ach => {
            const isUnlocked = Boolean(ach.unlockedAt);
            return (
              <div
                key={ach.id}
                className={`flex flex-col items-center text-center p-3.5 rounded-xl border transition ${
                  isUnlocked
                    ? 'border-cyan-500/40 bg-cyan-500/5 shadow-sm shadow-cyan-500/10'
                    : 'border-slate-800/80 bg-slate-950/40 opacity-40'
                }`}
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl mb-2.5 ${
                    isUnlocked
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  <Award className="h-5 w-5" />
                </div>
                <h5 className="text-xs font-bold text-white line-clamp-1">{ach.title}</h5>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-tight">
                  {ach.description}
                </p>
                {isUnlocked && (
                  <span className="text-[9px] text-cyan-400 font-mono mt-1 font-semibold">
                    {ach.unlockedAt}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
