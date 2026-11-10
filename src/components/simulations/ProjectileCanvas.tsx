import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Play, RotateCcw, Target } from 'lucide-react';

export const ProjectileCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isRunning, setIsRunning] = useState(false);
  const [velocity0, setVelocity0] = useState(30); // m/s
  const [angleDeg, setAngleDeg] = useState(45); // deg
  const [gravity, setGravity] = useState(9.8); // m/s^2

  const angleRad = (angleDeg * Math.PI) / 180;
  const v0x = velocity0 * Math.cos(angleRad);
  const v0y = velocity0 * Math.sin(angleRad);
  const totalFlightTime = (2 * v0y) / gravity;
  const maxRange = (velocity0 * velocity0 * Math.sin(2 * angleRad)) / gravity;
  const maxHeight = (v0y * v0y) / (2 * gravity);

  const stateRef = useRef({
    time: 0,
    trajectory: [] as { x: number; y: number }[],
    currentX: 0,
    currentY: 0,
    finished: false
  });

  const [telemetry, setTelemetry] = useState({
    time: 0,
    x: 0,
    y: 0,
    vx: v0x,
    vy: v0y,
    finished: false
  });

  const resetSimulation = useCallback(() => {
    setIsRunning(false);
    stateRef.current = {
      time: 0,
      trajectory: [],
      currentX: 0,
      currentY: 0,
      finished: false
    };
    setTelemetry({
      time: 0,
      x: 0,
      y: 0,
      vx: v0x,
      vy: v0y,
      finished: false
    });
  }, [v0x, v0y]);

  useEffect(() => {
    resetSimulation();
  }, [velocity0, angleDeg, gravity, resetSimulation]);

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

        s.currentX = v0x * s.time;
        s.currentY = Math.max(0, v0y * s.time - 0.5 * gravity * s.time * s.time);
        const currentVy = v0y - gravity * s.time;

        s.trajectory.push({ x: s.currentX, y: s.currentY });

        if (s.time >= totalFlightTime || s.currentX >= maxRange) {
          s.currentX = maxRange;
          s.currentY = 0;
          s.finished = true;
          setIsRunning(false);
        }

        setTelemetry({
          time: s.time,
          x: s.currentX,
          y: s.currentY,
          vx: v0x,
          vy: currentVy,
          finished: s.finished
        });
      }

      // Draw onto canvas
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Background
      ctx.fillStyle = '#080d1a';
      ctx.fillRect(0, 0, width, height);

      // Coordinates
      const groundY = height - 50;
      const originX = 50;
      const scaleX = (width - 100) / 120; // 120 meters max
      const scaleY = (groundY - 40) / 50; // 50 meters max height

      // Ground
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, groundY, width, 50);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(width, groundY);
      ctx.stroke();

      // Rulers
      ctx.fillStyle = '#64748b';
      ctx.font = '10px JetBrains Mono';
      for (let m = 0; m <= 120; m += 20) {
        const px = originX + m * scaleX;
        ctx.fillText(`${m}m`, px - 8, groundY + 16);
        ctx.fillRect(px, groundY, 1, 4);
      }

      // Draw Cannon at origin
      ctx.save();
      ctx.translate(originX, groundY);
      ctx.rotate(-angleRad);
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(0, -7, 28, 14);
      ctx.strokeStyle = '#bae6fd';
      ctx.strokeRect(0, -7, 28, 14);
      ctx.restore();

      // Cannon base
      ctx.beginPath();
      ctx.arc(originX, groundY, 10, Math.PI, 0);
      ctx.fillStyle = '#334155';
      ctx.fill();

      // Parabolic Trajectory Path
      if (s.trajectory.length > 1) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        for (let i = 0; i < s.trajectory.length; i++) {
          const pt = s.trajectory[i];
          const px = originX + pt.x * scaleX;
          const py = groundY - pt.y * scaleY;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Projectile Sphere
      const ballPx = originX + s.currentX * scaleX;
      const ballPy = groundY - s.currentY * scaleY;

      ctx.beginPath();
      ctx.arc(ballPx, ballPy, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Target marker at theoretical max range
      const targetPx = originX + maxRange * scaleX;
      if (targetPx < width - 20) {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(targetPx, groundY - 20);
        ctx.lineTo(targetPx, groundY);
        ctx.stroke();
        ctx.fillStyle = '#ef4444';
        ctx.font = '10px JetBrains Mono';
        ctx.fillText(`Target: ${maxRange.toFixed(1)}m`, targetPx - 30, groundY - 24);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isRunning, v0x, v0y, gravity, totalFlightTime, maxRange, angleRad]);

  return (
    <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Simulator Gerak Parabola (Kinematika 2D)</span>
            <span className="text-[11px] font-mono text-amber-400">X_max = v₀² sin(2θ) / g</span>
          </h3>
          <p className="text-xs text-slate-400">
            Lintasan lengkung 2 dimensi peluru akibat kombinasi GLB horizontal dan GLBB vertikal
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(true)}
            disabled={isRunning}
            className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-amber-400 cursor-pointer disabled:opacity-50"
          >
            <Play className="h-3.5 w-3.5" />
            <span>Tembakkan</span>
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
          height={300}
          className="w-full h-auto block"
        />

        {/* Telemetry HUD */}
        <div className="absolute top-3 right-3 rounded-lg border border-slate-800 bg-slate-950/90 p-3 font-mono text-xs backdrop-blur space-y-1 w-56">
          <div className="text-[11px] font-bold text-slate-300 border-b border-slate-800 pb-1 flex items-center gap-1">
            <Target className="h-3.5 w-3.5 text-amber-400" /> HASIL ANALITIS
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Jarak Max (X_max):</span>
            <span className="text-emerald-400 font-bold tabular-nums">{maxRange.toFixed(1)} m</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Tinggi Max (H_max):</span>
            <span className="text-sky-400 font-bold tabular-nums">{maxHeight.toFixed(1)} m</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Waktu Total (t_tot):</span>
            <span className="text-amber-400 tabular-nums">{totalFlightTime.toFixed(2)} s</span>
          </div>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Kecepatan Awal (v₀)</span>
            <span className="font-mono text-white tabular-nums">{velocity0} m/s</span>
          </div>
          <input
            type="range"
            min={10}
            max={50}
            step={1}
            value={velocity0}
            disabled={isRunning}
            onChange={e => setVelocity0(Number(e.target.value))}
            className="w-full cursor-pointer"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Sudut Elevasi (θ)</span>
            <span className="font-mono text-amber-400 tabular-nums">{angleDeg}°</span>
          </div>
          <input
            type="range"
            min={15}
            max={85}
            step={5}
            value={angleDeg}
            disabled={isRunning}
            onChange={e => setAngleDeg(Number(e.target.value))}
            className="w-full cursor-pointer"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Gravitasi (g)</span>
            <span className="font-mono text-sky-400 tabular-nums">{gravity} m/s²</span>
          </div>
          <input
            type="range"
            min={1.6}
            max={20}
            step={0.5}
            value={gravity}
            disabled={isRunning}
            onChange={e => setGravity(Number(e.target.value))}
            className="w-full cursor-pointer"
          />
        </div>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-xs text-slate-300">
        <span className="font-semibold text-amber-400">Misteri Sudut Komplementer: </span>
        Coba bandingkan jarak jangkauan horizontal saat sudut diatur $30^\circ$ dengan saat diatur $60^\circ$ (keduanya berjumlah $90^\circ$). Anda akan menemukan bahwa jarak tembaknya sama persis karena $\sin(2 \times 30^\circ) = \sin(2 \times 60^\circ) = \frac{1}{2}\sqrt{3}$!
      </div>
    </div>
  );
};
