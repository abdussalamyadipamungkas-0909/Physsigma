import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, Wind } from 'lucide-react';

interface FreeFallCanvasProps {
  initialHeight?: number;
  initialAirResistance?: boolean;
  onDataLogged?: (data: { time: number; v1: number; v2: number; height: number; vacuum: boolean }) => void;
}

export const FreeFallCanvas: React.FC<FreeFallCanvasProps> = ({
  initialHeight = 20,
  initialAirResistance = false,
  onDataLogged
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Simulation controls
  const [isRunning, setIsRunning] = useState(false);
  const [height, setHeight] = useState(initialHeight);
  const [gravity, setGravity] = useState(9.8); // m/s^2
  const [airResistance, setAirResistance] = useState(initialAirResistance);
  const [planetName, setPlanetName] = useState('Bumi (9.8 m/s²)');

  // Simulation physics state
  const stateRef = useRef({
    time: 0,
    y1: 0, // ball pos (meters from top)
    v1: 0, // ball vel
    y2: 0, // feather pos
    v2: 0, // feather vel
    finished1: false,
    finished2: false,
    t1: 0,
    t2: 0
  });

  const [displayState, setDisplayState] = useState({
    time: 0,
    v1: 0,
    v2: 0,
    y1: 0,
    y2: 0,
    t1: 0,
    t2: 0,
    finished: false
  });

  const resetSimulation = useCallback(() => {
    setIsRunning(false);
    stateRef.current = {
      time: 0,
      y1: 0,
      v1: 0,
      y2: 0,
      v2: 0,
      finished1: false,
      finished2: false,
      t1: 0,
      t2: 0
    };
    setDisplayState({
      time: 0,
      v1: 0,
      v2: 0,
      y1: 0,
      y2: 0,
      t1: 0,
      t2: 0,
      finished: false
    });
  }, []);

  const handlePlanetChange = (val: string) => {
    setPlanetName(val);
    if (val.includes('Bumi')) setGravity(9.8);
    else if (val.includes('Bulan')) setGravity(1.62);
    else if (val.includes('Mars')) setGravity(3.71);
    else if (val.includes('Yupiter')) setGravity(24.79);
    resetSimulation();
  };

  useEffect(() => {
    resetSimulation();
  }, [height, gravity, airResistance, resetSimulation]);

  // Main animation and physics integration loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTimestamp: number | null = null;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = (timestamp: number) => {
      if (lastTimestamp === null) lastTimestamp = timestamp;
      const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.05);
      lastTimestamp = timestamp;

      if (isRunning) {
        const s = stateRef.current;
        s.time += dt;

        // Ball physics (5kg iron ball, low drag)
        if (!s.finished1) {
          // Ball Drag: F_drag = 0.5 * Cd * rho * A * v^2
          // With airResistance: Cd*A/m approx 0.001
          const dragAcc1 = airResistance ? 0.001 * s.v1 * s.v1 : 0;
          const a1 = gravity - dragAcc1;
          s.v1 += a1 * dt;
          s.y1 += s.v1 * dt;

          if (s.y1 >= height) {
            s.y1 = height;
            s.finished1 = true;
            s.t1 = s.time;
          }
        }

        // Feather physics (0.005kg feather, high drag)
        if (!s.finished2) {
          // Terminal velocity of a feather in air is approx 1.5 - 2 m/s
          const dragFactor = airResistance ? 2.5 : 0;
          const dragAcc2 = dragFactor * s.v2 * Math.abs(s.v2);
          const a2 = Math.max(0, gravity - dragAcc2);
          s.v2 += a2 * dt;
          s.y2 += s.v2 * dt;

          if (s.y2 >= height) {
            s.y2 = height;
            s.finished2 = true;
            s.t2 = s.time;
          }
        }

        if (s.finished1 && s.finished2) {
          setIsRunning(false);
          if (onDataLogged) {
            onDataLogged({
              time: s.time,
              v1: s.v1,
              v2: s.v2,
              height,
              vacuum: !airResistance
            });
          }
        }

        setDisplayState({
          time: s.time,
          v1: s.v1,
          v2: s.v2,
          y1: s.y1,
          y2: s.y2,
          t1: s.t1,
          t2: s.t2,
          finished: s.finished1 && s.finished2
        });
      }

      // Draw onto Canvas
      const width = canvas.width;
      const heightPx = canvas.height;
      ctx.clearRect(0, 0, width, heightPx);

      // Background grid lines (laboratory chamber)
      ctx.fillStyle = '#080d1a';
      ctx.fillRect(0, 0, width, heightPx);

      // Chamber glass tube outline
      const tubeLeft = 60;
      const tubeRight = width - 60;
      const tubeTop = 40;
      const tubeBottom = heightPx - 50;
      const tubeHeight = tubeBottom - tubeTop;

      ctx.strokeStyle = airResistance ? 'rgba(56, 189, 248, 0.25)' : 'rgba(245, 158, 11, 0.35)';
      ctx.lineWidth = 2;
      ctx.strokeRect(tubeLeft, tubeTop, tubeRight - tubeLeft, tubeHeight);

      // Vacuum chamber status text inside canvas
      ctx.fillStyle = airResistance ? 'rgba(56, 189, 248, 0.7)' : 'rgba(245, 158, 11, 0.8)';
      ctx.font = '11px JetBrains Mono';
      ctx.fillText(
        airResistance ? 'ATMOSFER TERBUKA (ADA HAMBATAN UDARA)' : 'RUANG HAMPA VAKUM (HAMBATAN UDARA = 0)',
        tubeLeft + 15,
        tubeTop + 20
      );

      // Floating air particles if air resistance is active
      if (airResistance) {
        ctx.fillStyle = 'rgba(148, 163, 184, 0.25)';
        for (let i = 0; i < 40; i++) {
          const px = tubeLeft + 20 + ((i * 37 + (stateRef.current.time * 20)) % (tubeRight - tubeLeft - 40));
          const py = tubeTop + 30 + ((i * 43) % (tubeHeight - 40));
          ctx.beginPath();
          ctx.arc(px, py, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Height ruler markings
      ctx.fillStyle = '#64748b';
      ctx.font = '10px JetBrains Mono';
      ctx.textAlign = 'right';
      const steps = 5;
      for (let i = 0; i <= steps; i++) {
        const markerH = (height * (steps - i)) / steps;
        const markY = tubeTop + (i / steps) * tubeHeight;
        ctx.fillText(`${markerH.toFixed(0)}m`, tubeLeft - 10, markY + 4);
        ctx.fillRect(tubeLeft - 6, markY, 6, 1);
      }

      // Ground landing plate
      ctx.fillStyle = '#334155';
      ctx.fillRect(tubeLeft - 10, tubeBottom, (tubeRight - tubeLeft) + 20, 10);
      ctx.fillStyle = '#475569';
      ctx.fillRect(tubeLeft, tubeBottom + 2, tubeRight - tubeLeft, 4);

      // Objects positions
      const scale = tubeHeight / height;
      const s = stateRef.current;

      // 1. Bola Baja (Iron Ball) at Lane 1
      const ballX = tubeLeft + (tubeRight - tubeLeft) * 0.32;
      const ballY = tubeTop + s.y1 * scale;

      // Shadow / glow
      ctx.beginPath();
      ctx.arc(ballX, ballY, 12, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.fill();
      ctx.strokeStyle = '#e0f2fe';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Velocity vector for ball
      if (s.v1 > 0.5 && !s.finished1) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ballX, ballY + 14);
        ctx.lineTo(ballX, ballY + 14 + Math.min(30, s.v1 * 2));
        ctx.stroke();
      }

      // Ball Label
      ctx.fillStyle = '#bae6fd';
      ctx.font = '10px Plus Jakarta Sans';
      ctx.textAlign = 'center';
      ctx.fillText(`Bola Besi (5 kg)`, ballX, tubeTop - 12);
      ctx.fillText(`${s.v1.toFixed(1)} m/s`, ballX, ballY - 16);

      // 2. Sehelai Bulu (Feather) at Lane 2
      const featherX = tubeLeft + (tubeRight - tubeLeft) * 0.68;
      const featherY = tubeTop + s.y2 * scale;

      // Feather shape
      ctx.save();
      ctx.translate(featherX, featherY);
      // Gentle wobble when falling in air
      const wobble = airResistance && !s.finished2 ? Math.sin(s.time * 8) * 0.25 : 0;
      ctx.rotate(wobble);

      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.ellipse(0, 0, 6, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Feather quill line
      ctx.beginPath();
      ctx.moveTo(0, -18);
      ctx.lineTo(0, 18);
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
      ctx.restore();

      // Velocity vector for feather
      if (s.v2 > 0.5 && !s.finished2) {
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(featherX, featherY + 20);
        ctx.lineTo(featherX, featherY + 20 + Math.min(30, s.v2 * 2));
        ctx.stroke();
      }

      // Feather Label
      ctx.fillStyle = '#fef08a';
      ctx.font = '10px Plus Jakarta Sans';
      ctx.textAlign = 'center';
      ctx.fillText(`Bulu Burung (2 g)`, featherX, tubeTop - 12);
      ctx.fillText(`${s.v2.toFixed(1)} m/s`, featherX, featherY - 22);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isRunning, height, gravity, airResistance, onDataLogged]);

  // Theoretical calculations
  const theoreticalTime = Math.sqrt((2 * height) / gravity);
  const theoreticalVelocity = Math.sqrt(2 * gravity * height);

  return (
    <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      {/* Simulation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Simulator Tabung Jatuh Bebas Galileo</span>
            <span className="text-[11px] font-mono text-amber-400">g = {gravity} m/s²</span>
          </h3>
          <p className="text-xs text-slate-400">
            Menguji gerak dua massa berbeda dalam tabung hampa vs udara terbuka
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-amber-400 cursor-pointer"
          >
            {isRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            <span>{isRunning ? 'Jeda' : 'Lepaskan'}</span>
          </button>

          <button
            onClick={resetSimulation}
            className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700 transition cursor-pointer"
            title="Reset ke posisi puncak"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
        <canvas
          ref={canvasRef}
          width={640}
          height={380}
          className="w-full h-auto block"
        />

        {/* Telemetry HUD Overlay in Canvas */}
        <div className="absolute top-3 right-3 rounded-lg border border-slate-800 bg-slate-950/85 p-2.5 text-right font-mono text-xs backdrop-blur space-y-1">
          <div className="text-slate-400">
            Waktu: <span className="text-white font-bold tabular-nums">{displayState.time.toFixed(2)} s</span>
          </div>
          <div className="text-sky-400">
            v Bola: <span className="tabular-nums">{displayState.v1.toFixed(2)} m/s</span>
          </div>
          <div className="text-yellow-400">
            v Bulu: <span className="tabular-nums">{displayState.v2.toFixed(2)} m/s</span>
          </div>
          {displayState.finished && (
            <div className="pt-1 border-t border-slate-800 text-[10px] text-emerald-400">
              Kedua objek mendarat!
            </div>
          )}
        </div>
      </div>

      {/* Variable Sliders and Modifiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
        
        {/* Height Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Ketinggian Uji (h)</span>
            <span className="font-mono text-white tabular-nums">{height} meter</span>
          </div>
          <input
            type="range"
            min={5}
            max={50}
            step={1}
            value={height}
            disabled={isRunning}
            onChange={e => setHeight(Number(e.target.value))}
            className="w-full cursor-pointer"
          />
        </div>

        {/* Air Resistance Toggle */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Kondisi Tabung</span>
            <span className={`font-semibold ${airResistance ? 'text-sky-400' : 'text-amber-400'}`}>
              {airResistance ? 'Udara Terbuka' : 'Vakum (Hampa)'}
            </span>
          </div>
          <button
            onClick={() => {
              setAirResistance(!airResistance);
              resetSimulation();
            }}
            disabled={isRunning}
            className={`w-full flex items-center justify-center gap-2 rounded-lg border py-1.5 text-xs font-medium transition cursor-pointer ${
              airResistance
                ? 'border-sky-500/40 bg-sky-500/10 text-sky-300'
                : 'border-amber-500/40 bg-amber-500/10 text-amber-300'
            }`}
          >
            <Wind className="h-3.5 w-3.5" />
            <span>{airResistance ? 'Ubah ke Hampa Vakum' : 'Ubah ke Udara Terbuka'}</span>
          </button>
        </div>

        {/* Planetary Gravity Preset */}
        <div className="space-y-1.5">
          <label className="text-xs text-slate-400">Lokasi / Gravitasi (g)</label>
          <select
            value={planetName}
            disabled={isRunning}
            onChange={e => handlePlanetChange(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
          >
            <option value="Bumi (9.8 m/s²)">Bumi (g = 9.80 m/s²)</option>
            <option value="Bulan (1.62 m/s²)">Bulan (g = 1.62 m/s²)</option>
            <option value="Mars (3.71 m/s²)">Mars (g = 3.71 m/s²)</option>
            <option value="Yupiter (24.79 m/s²)">Yupiter (g = 24.79 m/s²)</option>
          </select>
        </div>

      </div>

      {/* Physics Theoretical Benchmark Box */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-xs space-y-1.5">
        <div className="flex items-center justify-between text-slate-300 font-semibold">
          <span>Persamaan Teoretis GJB:</span>
          <span className="font-mono text-amber-400">t = √(2h / g) · v = √(2gh)</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px] text-slate-400">
          <div>
            Waktu Teoretis: <span className="text-white tabular-nums">{theoreticalTime.toFixed(2)} s</span>
          </div>
          <div>
            v Akhir Teoretis: <span className="text-white tabular-nums">{theoreticalVelocity.toFixed(1)} m/s</span>
          </div>
          <div>
            Tiba Bola: <span className="text-sky-400 tabular-nums">{displayState.t1 ? `${displayState.t1.toFixed(2)} s` : '-'}</span>
          </div>
          <div>
            Tiba Bulu: <span className="text-yellow-400 tabular-nums">{displayState.t2 ? `${displayState.t2.toFixed(2)} s` : '-'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
