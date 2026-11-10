import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface NewtonForceCanvasProps {
  initialForce?: number;
  initialMass?: number;
  initialFriction?: number;
  onDataLogged?: (data: { force: number; friction: number; acc: number; velocity: number }) => void;
}

export const NewtonForceCanvas: React.FC<NewtonForceCanvasProps> = ({
  initialForce = 150,
  initialMass = 20,
  initialFriction = 0.05,
  onDataLogged
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isRunning, setIsRunning] = useState(false);
  const [appliedForce, setAppliedForce] = useState(initialForce); // N
  const [mass, setMass] = useState(initialMass); // kg
  const [frictionCoeff, setFrictionCoeff] = useState(initialFriction); // mu_k

  const g = 9.8;
  const normalForce = mass * g;
  const maxFriction = frictionCoeff * normalForce;

  const stateRef = useRef({
    time: 0,
    posX: 60,
    velocity: 0,
    history: [] as { t: number; v: number }[]
  });

  const [telemetry, setTelemetry] = useState({
    time: 0,
    velocity: 0,
    acceleration: 0,
    netForce: 0,
    friction: 0
  });

  const resetSimulation = useCallback(() => {
    setIsRunning(false);
    stateRef.current = {
      time: 0,
      posX: 60,
      velocity: 0,
      history: []
    };
    setTelemetry({
      time: 0,
      velocity: 0,
      acceleration: 0,
      netForce: 0,
      friction: 0
    });
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

      const s = stateRef.current;
      let effectiveFriction = 0;
      let netForce = 0;
      let acc = 0;

      if (isRunning) {
        s.time += dt;

        // Friction opposes motion or applied force
        if (s.velocity > 0.001) {
          effectiveFriction = maxFriction;
          netForce = appliedForce - effectiveFriction;
          acc = netForce / mass;
          s.velocity += acc * dt;
          if (s.velocity < 0) s.velocity = 0;
        } else {
          // Stationary
          if (appliedForce > maxFriction) {
            effectiveFriction = maxFriction;
            netForce = appliedForce - effectiveFriction;
            acc = netForce / mass;
            s.velocity += acc * dt;
          } else {
            effectiveFriction = appliedForce;
            netForce = 0;
            acc = 0;
            s.velocity = 0;
          }
        }

        s.posX += s.velocity * dt * 25; // scaling for canvas
        if (s.posX > canvas.width - 90) {
          s.posX = 60; // loop back
        }

        // Record history for mini graph
        if (s.history.length === 0 || s.time - s.history[s.history.length - 1].t > 0.08) {
          s.history.push({ t: s.time, v: s.velocity });
          if (s.history.length > 50) s.history.shift();
        }

        setTelemetry({
          time: s.time,
          velocity: s.velocity,
          acceleration: acc,
          netForce,
          friction: effectiveFriction
        });

        if (onDataLogged && Math.random() < 0.02) {
          onDataLogged({
            force: appliedForce,
            friction: effectiveFriction,
            acc,
            velocity: s.velocity
          });
        }
      }

      // Draw onto Canvas
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Background
      ctx.fillStyle = '#080d1a';
      ctx.fillRect(0, 0, width, height);

      // Floor
      const groundY = height - 90;
      ctx.fillStyle = frictionCoeff === 0 ? 'rgba(56, 189, 248, 0.2)' : '#1e293b';
      ctx.fillRect(0, groundY, width, 90);
      ctx.strokeStyle = frictionCoeff === 0 ? '#38bdf8' : '#334155';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(width, groundY);
      ctx.stroke();

      // Floor surface label
      ctx.fillStyle = frictionCoeff === 0 ? '#38bdf8' : '#64748b';
      ctx.font = '10px JetBrains Mono';
      ctx.fillText(
        frictionCoeff === 0 ? 'LANTAI ES SUPER LICIN (μ = 0)' : `LANTAI KASAR (μ = ${frictionCoeff.toFixed(2)})`,
        20,
        groundY + 25
      );

      // The Block
      const blockWidth = 60;
      const blockHeight = 45;
      const blockX = s.posX;
      const blockY = groundY - blockHeight;

      ctx.fillStyle = '#0284c7';
      ctx.fillRect(blockX, blockY, blockWidth, blockHeight);
      ctx.strokeStyle = '#bae6fd';
      ctx.lineWidth = 2;
      ctx.strokeRect(blockX, blockY, blockWidth, blockHeight);

      // Block Label
      ctx.fillStyle = '#ffffff';
      ctx.font = '11px Plus Jakarta Sans';
      ctx.textAlign = 'center';
      ctx.fillText(`${mass} kg`, blockX + blockWidth / 2, blockY + 26);

      // Draw Free-Body Diagram Force Vectors
      const centerX = blockX + blockWidth / 2;
      const centerY = blockY + blockHeight / 2;

      // 1. Normal Force (Up)
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX, centerY - 45);
      ctx.stroke();
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('N', centerX, centerY - 50);

      // 2. Weight / Gravity (Down)
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX, centerY + 45);
      ctx.stroke();
      ctx.fillStyle = '#a855f7';
      ctx.fillText('W = mg', centerX, centerY + 60);

      // 3. Applied Force F (Right)
      if (appliedForce > 0) {
        const arrowLen = Math.min(80, (appliedForce / 500) * 80 + 15);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(blockX + blockWidth, centerY);
        ctx.lineTo(blockX + blockWidth + arrowLen, centerY);
        ctx.stroke();
        // Arrow head
        ctx.beginPath();
        ctx.moveTo(blockX + blockWidth + arrowLen, centerY);
        ctx.lineTo(blockX + blockWidth + arrowLen - 6, centerY - 4);
        ctx.lineTo(blockX + blockWidth + arrowLen - 6, centerY + 4);
        ctx.closePath();
        ctx.fillStyle = '#f59e0b';
        ctx.fill();
        ctx.fillText(`F = ${appliedForce}N`, blockX + blockWidth + arrowLen / 2, centerY - 8);
      }

      // 4. Friction Force f (Left)
      if (frictionCoeff > 0 && (s.velocity > 0 || appliedForce > 0)) {
        const fLen = Math.min(60, (maxFriction / 300) * 60 + 10);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(blockX, centerY);
        ctx.lineTo(blockX - fLen, centerY);
        ctx.stroke();
        // Arrow head
        ctx.beginPath();
        ctx.moveTo(blockX - fLen, centerY);
        ctx.lineTo(blockX - fLen + 5, centerY - 3);
        ctx.lineTo(blockX - fLen + 5, centerY + 3);
        ctx.closePath();
        ctx.fillStyle = '#ef4444';
        ctx.fill();
        ctx.fillText(`f_k = ${maxFriction.toFixed(1)}N`, blockX - fLen / 2, centerY + 14);
      }

      // Live velocity graph inset (top right)
      const graphW = 150;
      const graphH = 65;
      const graphX = width - graphW - 15;
      const graphY = 15;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(graphX, graphY, graphW, graphH);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(graphX, graphY, graphW, graphH);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px JetBrains Mono';
      ctx.textAlign = 'left';
      ctx.fillText('Grafik v vs t', graphX + 6, graphY + 12);

      if (s.history.length > 1) {
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        const maxV = Math.max(10, ...s.history.map(h => h.v));
        for (let i = 0; i < s.history.length; i++) {
          const px = graphX + (i / 50) * graphW;
          const py = graphY + graphH - (s.history[i].v / maxV) * (graphH - 18) - 4;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isRunning, appliedForce, mass, frictionCoeff, maxFriction, onDataLogged]);

  return (
    <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Simulator Dinamika Newton & Gesekan</span>
            <span className="text-[11px] font-mono text-amber-400">ΣF = m · a</span>
          </h3>
          <p className="text-xs text-slate-400">
            Menguji Hukum I & II Newton serta pengaruh gaya gesek terhadap kelajuan
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
          height={300}
          className="w-full h-auto block"
        />

        {/* Live Telemetry Overlay */}
        <div className="absolute bottom-3 left-3 rounded-lg border border-slate-800 bg-slate-950/85 p-2.5 font-mono text-xs backdrop-blur space-y-1">
          <div className="text-slate-300">
            Kecepatan (v): <span className="text-amber-400 font-bold tabular-nums">{telemetry.velocity.toFixed(2)} m/s</span>
          </div>
          <div className="text-slate-400">
            Percepatan (a): <span className="text-white tabular-nums">{telemetry.acceleration.toFixed(2)} m/s²</span>
          </div>
          <div className="text-slate-400">
            Resultan Gaya (ΣF): <span className="text-emerald-400 tabular-nums">{telemetry.netForce.toFixed(1)} N</span>
          </div>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
        {/* Force */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Gaya Dorong Luar (F)</span>
            <span className="font-mono text-amber-400 tabular-nums">{appliedForce} N</span>
          </div>
          <input
            type="range"
            min={0}
            max={500}
            step={10}
            value={appliedForce}
            onChange={e => setAppliedForce(Number(e.target.value))}
            className="w-full cursor-pointer"
          />
        </div>

        {/* Mass */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Massa Balok (m)</span>
            <span className="font-mono text-white tabular-nums">{mass} kg</span>
          </div>
          <input
            type="range"
            min={5}
            max={100}
            step={5}
            value={mass}
            onChange={e => setMass(Number(e.target.value))}
            className="w-full cursor-pointer"
          />
        </div>

        {/* Friction */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Koefisien Gesek (μ)</span>
            <span className="font-mono text-sky-400 tabular-nums">{frictionCoeff.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={0.5}
            step={0.01}
            value={frictionCoeff}
            onChange={e => setFrictionCoeff(Number(e.target.value))}
            className="w-full cursor-pointer"
          />
        </div>
      </div>

      {/* Explanation Tip */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-xs text-slate-300">
        <span className="font-semibold text-amber-400">Eksperimen Inersia: </span>
        Coba berikan gaya dorong hingga balok mencapai kecepatan 10 m/s, kemudian ubah Gaya Dorong menjadi 0 N dan Koefisien Gesek menjadi 0. Perhatikan bahwa balok akan terus bergerak selamanya dengan kelajuan tetap!
      </div>
    </div>
  );
};
