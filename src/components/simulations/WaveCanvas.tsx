import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface WaveCanvasProps {
  initialAmplitude?: number;
  initialFrequency?: number;
  onDataLogged?: (data: { amplitude: number; frequency: number; wavelength: number; speed: number }) => void;
}

export const WaveCanvas: React.FC<WaveCanvasProps> = ({
  initialAmplitude = 0.4,
  initialFrequency = 1.5,
  onDataLogged
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isRunning, setIsRunning] = useState(true);
  const [amplitude, setAmplitude] = useState(initialAmplitude); // m
  const [frequency, setFrequency] = useState(initialFrequency); // Hz
  const [tension, setTension] = useState(25); // tension -> determines wave speed

  // Wave speed formula for string / medium: v = sqrt(tension / mu)
  const linearDensity = 1.0; // kg/m
  const waveSpeed = Math.sqrt(tension / linearDensity); // m/s
  const wavelength = waveSpeed / frequency; // lambda = v / f (m)
  const waveNumber = (2 * Math.PI) / wavelength; // k = 2pi / lambda
  const angularFreq = 2 * Math.PI * frequency; // omega = 2pi * f
  const energyFactor = amplitude * amplitude * frequency * frequency;

  const stateRef = useRef({
    time: 0
  });

  const resetSimulation = useCallback(() => {
    stateRef.current.time = 0;
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime: number | null = null;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = (timestamp: number) => {
      if (lastTime === null) lastTime = timestamp;
      const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
      lastTime = timestamp;

      if (isRunning) {
        stateRef.current.time += dt;
      }

      const t = stateRef.current.time;
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Background
      ctx.fillStyle = '#080d1a';
      ctx.fillRect(0, 0, width, height);

      // Center baseline (equilibrium line)
      const centerY = height / 2;
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.6)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(30, centerY);
      ctx.lineTo(width - 30, centerY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Wave grid points
      const numPoints = 80;
      const startX = 40;
      const endX = width - 40;
      const stepX = (endX - startX) / (numPoints - 1);
      const ampScale = 75; // px per meter

      // Draw continuous wave line
      ctx.beginPath();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;

      for (let i = 0; i < numPoints; i++) {
        const xMeters = (i / numPoints) * 6; // 6 meters scale
        const px = startX + i * stepX;
        // y(x,t) = A * sin(omega * t - k * x)
        const yMeters = amplitude * Math.sin(angularFreq * t - waveNumber * xMeters);
        const py = centerY - yMeters * ampScale;

        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Draw particle beads along the wave to show medium movement
      for (let i = 0; i < numPoints; i += 2) {
        const xMeters = (i / numPoints) * 6;
        const px = startX + i * stepX;
        const yMeters = amplitude * Math.sin(angularFreq * t - waveNumber * xMeters);
        const py = centerY - yMeters * ampScale;

        // Special Particle at index 24: "Bebek Sensor" (Orange)
        if (i === 24) {
          // Vertical motion trajectory guide
          ctx.strokeStyle = 'rgba(251, 146, 60, 0.3)';
          ctx.setLineDash([2, 2]);
          ctx.beginPath();
          ctx.moveTo(px, centerY - amplitude * ampScale - 10);
          ctx.lineTo(px, centerY + amplitude * ampScale + 10);
          ctx.stroke();
          ctx.setLineDash([]);

          // Orange marker
          ctx.fillStyle = '#f97316';
          ctx.beginPath();
          ctx.arc(px, py, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Bebek label
          ctx.fillStyle = '#fdba74';
          ctx.font = '10px Plus Jakarta Sans';
          ctx.textAlign = 'center';
          ctx.fillText('Partikel Air (Hanya Naik-Turun)', px, py - 14);
        } else {
          // Regular medium particles
          ctx.fillStyle = '#bae6fd';
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Wave direction arrow at top
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(startX + 20, 35);
      ctx.lineTo(startX + 120, 35);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(startX + 120, 35);
      ctx.lineTo(startX + 112, 31);
      ctx.lineTo(startX + 112, 39);
      ctx.closePath();
      ctx.fillStyle = '#facc15';
      ctx.fill();

      ctx.fillStyle = '#facc15';
      ctx.font = '11px JetBrains Mono';
      ctx.textAlign = 'left';
      ctx.fillText(`Arah Rambat Energi (v = ${waveSpeed.toFixed(1)} m/s)`, startX + 130, 39);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isRunning, amplitude, frequency, tension, angularFreq, waveNumber, waveSpeed]);

  return (
    <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Simulator Gelombang Mekanik & Transmisi Energi</span>
            <span className="text-[11px] font-mono text-amber-400">v = λ · f</span>
          </h3>
          <p className="text-xs text-slate-400">
            Mengamati osilasi transversal medium vs perambatan energi gelombang
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-amber-400 cursor-pointer"
          >
            {isRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            <span>{isRunning ? 'Jeda' : 'Jalankan'}</span>
          </button>

          <button
            onClick={resetSimulation}
            className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700 transition cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
        <canvas
          ref={canvasRef}
          width={640}
          height={280}
          className="w-full h-auto block"
        />

        {/* Live HUD */}
        <div className="absolute bottom-3 right-3 rounded-lg border border-slate-800 bg-slate-950/90 p-2.5 font-mono text-xs backdrop-blur space-y-1">
          <div className="text-slate-400">
            Panjang Gelombang (λ): <span className="text-white font-bold tabular-nums">{wavelength.toFixed(2)} m</span>
          </div>
          <div className="text-slate-400">
            Cepat Rambat (v): <span className="text-sky-400 tabular-nums">{waveSpeed.toFixed(2)} m/s</span>
          </div>
          <div className="text-slate-400">
            Indeks Energi (E ∝ A²): <span className="text-amber-400 tabular-nums">{energyFactor.toFixed(2)} unit</span>
          </div>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
        {/* Amplitude */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Amplitudo (A)</span>
            <span className="font-mono text-white tabular-nums">{amplitude.toFixed(2)} m</span>
          </div>
          <input
            type="range"
            min={0.1}
            max={0.8}
            step={0.05}
            value={amplitude}
            onChange={e => setAmplitude(Number(e.target.value))}
            className="w-full cursor-pointer"
          />
        </div>

        {/* Frequency */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Frekuensi (f)</span>
            <span className="font-mono text-sky-400 tabular-nums">{frequency.toFixed(1)} Hz</span>
          </div>
          <input
            type="range"
            min={0.5}
            max={3.0}
            step={0.1}
            value={frequency}
            onChange={e => setFrequency(Number(e.target.value))}
            className="w-full cursor-pointer"
          />
        </div>

        {/* Tension / Medium Elasticity */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Tegangan Medium (T)</span>
            <span className="font-mono text-amber-400 tabular-nums">{tension} N</span>
          </div>
          <input
            type="range"
            min={5}
            max={50}
            step={5}
            value={tension}
            onChange={e => setTension(Number(e.target.value))}
            className="w-full cursor-pointer"
          />
        </div>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-xs text-slate-300">
        <span className="font-semibold text-amber-400">Pengamatan Detektif: </span>
        Perhatikan titik oranye (partikel air)! Meskipun gelombang merambat cepat ke kanan membawa energi, titik oranye sama sekali tidak berpindah ke kanan, melainkan hanya berosilasi vertikal naik dan turun di sekitar titik setimbangnya.
      </div>
    </div>
  );
};
