import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface EnergyPlaneCanvasProps {
  initialMass?: number;
  initialHeight?: number;
  initialFriction?: number;
  initialAngle?: number;
  onDataLogged?: (data: { ep: number; ek: number; wFriction: number; vFinal: number }) => void;
}

export const EnergyPlaneCanvas: React.FC<EnergyPlaneCanvasProps> = ({
  initialMass = 10,
  initialHeight = 5,
  initialFriction = 0.15,
  initialAngle = 30,
  onDataLogged
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isRunning, setIsRunning] = useState(false);
  const [mass, setMass] = useState(initialMass); // kg
  const [height, setHeight] = useState(initialHeight); // m
  const [frictionCoeff, setFrictionCoeff] = useState(initialFriction); // mu
  const [angleDeg, setAngleDeg] = useState(initialAngle); // degrees

  const g = 9.8; // m/s^2
  const angleRad = (angleDeg * Math.PI) / 180;
  const slopeLength = height / Math.sin(angleRad); // s = h / sin(theta)

  // Normal force & friction force
  const normalForce = mass * g * Math.cos(angleRad);
  const frictionForce = frictionCoeff * normalForce;
  const drivingForce = mass * g * Math.sin(angleRad);
  const netForce = Math.max(0, drivingForce - frictionForce);
  const acceleration = netForce / mass;

  // Real-time animation physics state
  const stateRef = useRef({
    time: 0,
    dist: 0, // distance travelled along ramp
    velocity: 0,
    finished: false
  });

  const [telemetry, setTelemetry] = useState({
    time: 0,
    dist: 0,
    velocity: 0,
    ep: mass * g * height,
    ek: 0,
    wFriction: 0,
    finished: false
  });

  const resetSimulation = useCallback(() => {
    setIsRunning(false);
    stateRef.current = {
      time: 0,
      dist: 0,
      velocity: 0,
      finished: false
    };
    setTelemetry({
      time: 0,
      dist: 0,
      velocity: 0,
      ep: mass * g * height,
      ek: 0,
      wFriction: 0,
      finished: false
    });
  }, [mass, height]);

  useEffect(() => {
    resetSimulation();
  }, [mass, height, frictionCoeff, angleDeg, resetSimulation]);

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

      const s = stateRef.current;

      if (isRunning && !s.finished) {
        s.time += dt;
        s.velocity += acceleration * dt;
        s.dist += s.velocity * dt;

        if (s.dist >= slopeLength) {
          s.dist = slopeLength;
          s.finished = true;
          setIsRunning(false);

          if (onDataLogged) {
            const finalEk = 0.5 * mass * s.velocity * s.velocity;
            const wF = frictionForce * slopeLength;
            onDataLogged({
              ep: 0,
              ek: finalEk,
              wFriction: wF,
              vFinal: s.velocity
            });
          }
        }

        const currentHeight = Math.max(0, height - s.dist * Math.sin(angleRad));
        const currentEp = mass * g * currentHeight;
        const currentEk = 0.5 * mass * s.velocity * s.velocity;
        const currentWf = frictionForce * s.dist;

        setTelemetry({
          time: s.time,
          dist: s.dist,
          velocity: s.velocity,
          ep: currentEp,
          ek: currentEk,
          wFriction: currentWf,
          finished: s.finished
        });
      }

      // Render Canvas
      const width = canvas.width;
      const heightPx = canvas.height;
      ctx.clearRect(0, 0, width, heightPx);

      // Background
      ctx.fillStyle = '#080d1a';
      ctx.fillRect(0, 0, width, heightPx);

      // Coordinates for ramp
      const groundY = heightPx - 60;
      const rampEndX = width - 80;
      const rampHeightPx = 220;
      const rampLengthPx = rampHeightPx / Math.tan(angleRad);
      const rampStartX = Math.max(50, rampEndX - rampLengthPx);
      const rampTopY = groundY - rampHeightPx;

      // Draw ground
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, groundY, width, 60);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(width, groundY);
      ctx.stroke();

      // Draw Incline Wedge
      ctx.beginPath();
      ctx.moveTo(rampStartX, groundY);
      ctx.lineTo(rampEndX, groundY);
      ctx.lineTo(rampStartX, rampTopY);
      ctx.closePath();
      ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
      ctx.fill();
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Laser photogates
      // Photogate 1 (top)
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(rampStartX - 5, rampTopY - 15, 10, 30);
      // Photogate 2 (bottom)
      ctx.fillRect(rampEndX - 5, groundY - 20, 10, 30);

      // Laser beam line
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(rampStartX, rampTopY - 5);
      ctx.lineTo(rampEndX, groundY - 10);
      ctx.stroke();
      ctx.setLineDash([]);

      // Incline slope angle arc & label
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(rampEndX, groundY, 40, Math.PI, Math.PI + angleRad);
      ctx.stroke();
      ctx.fillStyle = '#f59e0b';
      ctx.font = '11px JetBrains Mono';
      ctx.fillText(`${angleDeg}°`, rampEndX - 65, groundY - 12);

      // Cart position along the ramp
      const progressRatio = Math.min(1, s.dist / slopeLength);
      const cartX = rampStartX + (rampEndX - rampStartX) * progressRatio;
      const cartY = rampTopY + (groundY - rampTopY) * progressRatio;

      // Draw Cart (rotated along incline)
      ctx.save();
      ctx.translate(cartX, cartY);
      ctx.rotate(angleRad);

      // Cart chassis
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-20, -18, 40, 14);
      ctx.strokeStyle = '#bae6fd';
      ctx.lineWidth = 2;
      ctx.strokeRect(-20, -18, 40, 14);

      // Wheels
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(-12, -2, 5, 0, Math.PI * 2);
      ctx.arc(12, -2, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#94a3b8';
      ctx.stroke();

      // Velocity vector arrow
      if (s.velocity > 0.2) {
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(22, -11);
        ctx.lineTo(22 + Math.min(40, s.velocity * 3), -11);
        ctx.stroke();
      }

      ctx.restore();

      // Friction heat particles on track if friction > 0 and moving
      if (frictionCoeff > 0 && isRunning && s.velocity > 0.5) {
        ctx.fillStyle = 'rgba(249, 115, 22, 0.7)';
        for (let i = 0; i < 4; i++) {
          const sparkX = cartX - Math.random() * 20;
          const sparkY = cartY + (Math.random() - 0.5) * 8;
          ctx.beginPath();
          ctx.arc(sparkX, sparkY, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isRunning, acceleration, slopeLength, height, angleRad, angleDeg, mass, g, frictionForce, frictionCoeff, onDataLogged]);

  const initialEp = mass * g * height;
  const theoreticalVNoFriction = Math.sqrt(2 * g * height);

  return (
    <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Simulator Bidang Miring & Konservasi Energi</span>
            <span className="text-[11px] font-mono text-amber-400">Em = Ep + Ek + W_gesek</span>
          </h3>
          <p className="text-xs text-slate-400">
            Menguji transformasi energi potensial menjadi energi kinetik dan kalor
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-amber-400 cursor-pointer"
          >
            {isRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            <span>{isRunning ? 'Jeda' : 'Luncurkan'}</span>
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
          height={320}
          className="w-full h-auto block"
        />

        {/* Real-time Dynamic Energy Bar Graphs */}
        <div className="absolute top-3 right-3 rounded-lg border border-slate-800 bg-slate-950/90 p-3 text-xs backdrop-blur w-56 space-y-2">
          <span className="block text-[11px] font-bold text-slate-300 font-mono">
            DISTRIBUSI ENERGI (JOULE)
          </span>

          {/* Ep bar */}
          <div>
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-sky-400">Ep (Potensial):</span>
              <span className="text-white tabular-nums">{telemetry.ep.toFixed(1)} J</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-400 transition-all"
                style={{ width: `${Math.min(100, (telemetry.ep / initialEp) * 100)}%` }}
              />
            </div>
          </div>

          {/* Ek bar */}
          <div>
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-emerald-400">Ek (Kinetik):</span>
              <span className="text-white tabular-nums">{telemetry.ek.toFixed(1)} J</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 transition-all"
                style={{ width: `${Math.min(100, (telemetry.ek / initialEp) * 100)}%` }}
              />
            </div>
          </div>

          {/* W friction bar */}
          <div>
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-rose-400">W_gesek (Kalor):</span>
              <span className="text-white tabular-nums">{telemetry.wFriction.toFixed(1)} J</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-400 transition-all"
                style={{ width: `${Math.min(100, (telemetry.wFriction / initialEp) * 100)}%` }}
              />
            </div>
          </div>

          <div className="pt-1.5 border-t border-slate-800 flex justify-between font-mono text-[10px] text-amber-400">
            <span>Kecepatan (v):</span>
            <span className="font-bold tabular-nums">{telemetry.velocity.toFixed(2)} m/s</span>
          </div>
        </div>
      </div>

      {/* Control Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
        
        {/* Height */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Ketinggian (h)</span>
            <span className="font-mono text-white tabular-nums">{height} m</span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            step={0.5}
            value={height}
            disabled={isRunning}
            onChange={e => setHeight(Number(e.target.value))}
            className="w-full cursor-pointer"
          />
        </div>

        {/* Mass */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Massa Kereta (m)</span>
            <span className="font-mono text-white tabular-nums">{mass} kg</span>
          </div>
          <input
            type="range"
            min={1}
            max={20}
            step={1}
            value={mass}
            disabled={isRunning}
            onChange={e => setMass(Number(e.target.value))}
            className="w-full cursor-pointer"
          />
        </div>

        {/* Friction */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Koefisien Gesek (μ)</span>
            <span className={`font-mono tabular-nums ${frictionCoeff === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {frictionCoeff === 0 ? '0.00 (Licin)' : frictionCoeff.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={0.4}
            step={0.05}
            value={frictionCoeff}
            disabled={isRunning}
            onChange={e => setFrictionCoeff(Number(e.target.value))}
            className="w-full cursor-pointer"
          />
        </div>

        {/* Angle */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Kemiringan (θ)</span>
            <span className="font-mono text-white tabular-nums">{angleDeg}°</span>
          </div>
          <input
            type="range"
            min={15}
            max={60}
            step={5}
            value={angleDeg}
            disabled={isRunning}
            onChange={e => setAngleDeg(Number(e.target.value))}
            className="w-full cursor-pointer"
          />
        </div>

      </div>

      {/* Physics Analytical Summary Box */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-xs space-y-1">
        <div className="flex justify-between text-slate-300 font-semibold">
          <span>Hukum Konservasi Energi:</span>
          <span className="font-mono text-amber-400">Ep_awal = Ek_akhir + W_gesek = {initialEp.toFixed(1)} J</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Jika lintasan licin sempurna (μ = 0), kecepatan di dasar adalah <span className="text-white font-mono">{theoreticalVNoFriction.toFixed(2)} m/s</span>. Ketika koefisien gesek μ &gt; 0, gaya gesek $f_k = \mu m g \cos\theta$ melakukan usaha negatif yang merubah energi mekanik menjadi energi termal (panas).
        </p>
      </div>
    </div>
  );
};
