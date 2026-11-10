import React, { useState } from 'react';
import { useDetective } from '../../context/DetectiveContext';
import { FreeFallCanvas } from './FreeFallCanvas';
import { EnergyPlaneCanvas } from './EnergyPlaneCanvas';
import { NewtonForceCanvas } from './NewtonForceCanvas';
import { WaveCanvas } from './WaveCanvas';
import { CircuitCanvas } from './CircuitCanvas';
import { ProjectileCanvas } from './ProjectileCanvas';
import { 
  Sliders, 
  BookPlus, 
  Sparkles, 
  Layers, 
  Activity, 
  Compass, 
  Zap, 
  Flame, 
  Radio, 
  CircleDot,
  CheckCircle2
} from 'lucide-react';

export const SimulationLab: React.FC = () => {
  const { addNote, unlockAchievement } = useDetective();
  const [activeSim, setActiveSim] = useState<'free-fall' | 'energy' | 'newton' | 'wave' | 'circuit' | 'projectile'>('free-fall');
  const [loggedNotice, setLoggedNotice] = useState(false);

  const simTabs = [
    { id: 'free-fall', title: 'Jatuh Bebas Galileo', subtitle: 'Kinematika & Gravitasi', icon: Compass },
    { id: 'energy', title: 'Konservasi Energi', subtitle: 'Ep, Ek & Gesekan Bidang', icon: Flame },
    { id: 'newton', title: 'Hukum Dinamika Newton', subtitle: 'Inersia & Diagram Gaya', icon: Activity },
    { id: 'wave', title: 'Gelombang Transversal', subtitle: 'Amplitudo, Frekuensi & v', icon: Radio },
    { id: 'circuit', title: 'Rangkaian Listrik DC', subtitle: 'Hukum Ohm Seri vs Paralel', icon: Zap },
    { id: 'projectile', title: 'Gerak Parabola', subtitle: 'Lintasan 2D & Sudut Elevasi', icon: CircleDot },
  ];

  const handleLogToNotebook = () => {
    let title = '';
    let content = '';
    let formulaDraft = '';

    if (activeSim === 'free-fall') {
      title = 'Data Laboratorium: Tabung Jatuh Bebas Galileo';
      content = 'Pengamatan: Di ruang hampa udara (vakum), massa benda membatalkan dirinya sendiri (a = g = 9.8 m/s²). Bola besi 5 kg dan bulu 2 g jatuh serentak bersamaan. Hambatan udara F_d = 0.5 * C_d * rho * A * v² adalah satu-satunya penyebab mengapa bulu melayang lambat di atmosfer terbuka.';
      formulaDraft = 'h = 0.5 * g * t^2  |  v = sqrt(2gh)';
    } else if (activeSim === 'energy') {
      title = 'Data Laboratorium: Kekekalan Energi Bidang Miring';
      content = 'Pengamatan: Pada bidang licin sempurna (μ = 0), energi mekanik kekal: Ep_awal = Ek_dasar. Pada bidang bergesekan (μ > 0), sebagian energi mekanik berubah menjadi energi termal (panas) melalui kerja gaya gesek W_f = f_k * s.';
      formulaDraft = 'Em1 = Em2 + W_gesek  |  W_gesek = mu * m * g * cos(theta) * s';
    } else if (activeSim === 'newton') {
      title = 'Data Laboratorium: Dinamika Newton & Inersia';
      content = 'Pengamatan: Berdasarkan Hukum I Newton, benda yang bergerak tidak membutuhkan gaya untuk mempertahankan kelajuannya. Jika gaya dorong dinolkan dan gesekan es ditiadakan, balok terus meluncur dengan laju konstan.';
      formulaDraft = 'Sigma F = m * a  |  Sigma F = 0 -> v = konstan';
    } else if (activeSim === 'wave') {
      title = 'Data Laboratorium: Osilasi Gelombang Transversal';
      content = 'Pengamatan: Gelombang mentransmisikan energi mekanik tanpa memindahkan massa medium secara permanen. Partikel air hanya bergerak harmonik naik-turun tegak lurus arah rambatan gelombang.';
      formulaDraft = 'v = lambda * f  |  E proporsional A^2';
    } else if (activeSim === 'circuit') {
      title = 'Data Laboratorium: Rangkaian Seri vs Paralel';
      content = 'Pengamatan: Lampu menyala redup pada rangkaian seri karena hambatan ekuivalen bertambah besar dan tegangan baterai terbagi dua. Pada paralel, kedua lampu menerima tegangan penuh 12V dan menyala 4x lebih terang.';
      formulaDraft = 'P = V^2 / R  |  R_seri = R1 + R2  |  1/R_par = 1/R1 + 1/R2';
    } else {
      title = 'Data Laboratorium: Kinematika Gerak Parabola';
      content = 'Pengamatan: Gerak parabola merupakan kombinasi GLB pada sumbu horizontal dan GLBB pada sumbu vertikal. Dua sudut elevasi komplementer (berjumlah 90°) menghasilkan jarak tembak horizontal yang identik.';
      formulaDraft = 'X_max = v0^2 * sin(2*theta) / g  |  H_max = v0^2 * sin^2(theta) / (2g)';
    }

    addNote({
      title,
      content,
      formulaDraft
    });
    unlockAchievement('virtual_scientist');
    setLoggedNotice(true);
    setTimeout(() => setLoggedNotice(false), 2500);
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* 1. VIRTUAL LAB COMMAND BAR */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <Sliders className="h-4 w-4" />
            <span>VIRTUAL SIMULATION SANDBOX SUITE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Laboratorium Fisika Interaktif Presisi
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Eksperimen virtual berbasis fisika komputasi 60 FPS. Uji variabel bebas, amati vektor gaya dan grafik energi secara real-time, dan verifikasi hukum alam tanpa batas ruang fisik.
          </p>
        </div>

        <button
          onClick={handleLogToNotebook}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition cursor-pointer shrink-0"
        >
          {loggedNotice ? <CheckCircle2 className="h-4 w-4 text-white" /> : <BookPlus className="h-4 w-4" />}
          <span>{loggedNotice ? 'Tersimpan di Notebook!' : 'Simpan Temuan ke Notebook'}</span>
        </button>
      </div>

      {/* 2. APPARATUS SUITE SELECTOR TABS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {simTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeSim === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveSim(tab.id as any)}
              className={`flex flex-col justify-between rounded-xl border p-3 text-left transition cursor-pointer ${
                isActive
                  ? 'border-cyan-500 bg-cyan-500/15 text-white shadow-md shadow-cyan-500/10'
                  : 'border-slate-800 bg-[#0c1427]/60 text-slate-400 hover:border-slate-700 hover:bg-slate-900/60 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                {isActive && (
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                )}
              </div>
              <div>
                <h4 className="text-xs font-bold truncate">{tab.title}</h4>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">{tab.subtitle}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. ACTIVE SIMULATION CANVAS APPARATUS */}
      <div className="space-y-4">
        {activeSim === 'free-fall' && <FreeFallCanvas />}
        {activeSim === 'energy' && <EnergyPlaneCanvas />}
        {activeSim === 'newton' && <NewtonForceCanvas />}
        {activeSim === 'wave' && <WaveCanvas />}
        {activeSim === 'circuit' && <CircuitCanvas />}
        {activeSim === 'projectile' && <ProjectileCanvas />}
      </div>

      {/* 4. SCIENTIFIC INQUIRY PEDAGOGY FOOTNOTE */}
      <div className="rounded-2xl border border-slate-800 bg-[#0c1427]/70 p-5 text-xs text-slate-300 space-y-2 backdrop-blur">
        <div className="flex items-center gap-2 text-cyan-400 font-bold font-mono">
          <Sparkles className="h-4 w-4" />
          <span>STANDAR METODE ILMIAH DETEKTIF SAINS</span>
        </div>
        <p className="leading-relaxed text-slate-400">
          Dalam sains sejati, setiap penarikan kesimpulan berakar pada <strong>isolasi variabel terkontrol</strong>: ubah satu variabel bebas pada satu waktu, pertahankan variabel kontrol tetap konstan, dan amati respons pada variabel terikat. Simpan hasil temuan Anda langsung ke dalam Jurnal Forensik!
        </p>
      </div>

    </div>
  );
};
