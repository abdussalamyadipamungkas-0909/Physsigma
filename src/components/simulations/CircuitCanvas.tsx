import React, { useRef, useEffect, useState } from 'react';
import { Zap, Lightbulb } from 'lucide-react';

interface CircuitCanvasProps {
  initialMode?: 'series' | 'parallel';
  initialVoltage?: number;
  onDataLogged?: (data: { mode: string; vTot: number; iTot: number; rEq: number; pTot: number }) => void;
}

export const CircuitCanvas: React.FC<CircuitCanvasProps> = ({
  initialMode = 'series',
  initialVoltage = 12,
  onDataLogged
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [mode, setMode] = useState<'series' | 'parallel'>(initialMode);
  const [voltage, setVoltage] = useState(initialVoltage); // Volts
  const [r1, setR1] = useState(6); // Ohms
  const [r2, setR2] = useState(6); // Ohms
  const [switchClosed, setSwitchClosed] = useState(true);

  // Electrical computations
  let rEq = 0;
  let iTotal = 0;
  let v1 = 0;
  let v2 = 0;
  let i1 = 0;
  let i2 = 0;
  let p1 = 0;
  let p2 = 0;

  if (switchClosed) {
    if (mode === 'series') {
      rEq = r1 + r2;
      iTotal = voltage / rEq;
      i1 = iTotal;
      i2 = iTotal;
      v1 = iTotal * r1;
      v2 = iTotal * r2;
      p1 = i1 * i1 * r1;
      p2 = i2 * i2 * r2;
    } else {
      // Parallel
      rEq = (r1 * r2) / (r1 + r2);
      i1 = voltage / r1;
      i2 = voltage / r2;
      iTotal = i1 + i2;
      v1 = voltage;
      v2 = voltage;
      p1 = (v1 * v1) / r1;
      p2 = (v2 * v2) / r2;
    }
  }

  const pTotal = p1 + p2;

  useEffect(() => {
    let animationFrameId: number;
    let offset = 0;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      if (switchClosed && iTotal > 0) {
        offset = (offset + iTotal * 0.8) % 20;
      }

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Background
      ctx.fillStyle = '#080d1a';
      ctx.fillRect(0, 0, width, height);

      // Circuit Schematics
      const batX = 80;
      const batY = height / 2;

      // Draw Battery (DC Source)
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      // Long line (+)
      ctx.beginPath();
      ctx.moveTo(batX, batY - 24);
      ctx.lineTo(batX, batY - 4);
      ctx.stroke();
      // Short line (-)
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(batX, batY + 4);
      ctx.lineTo(batX, batY + 20);
      ctx.stroke();

      // Battery labels
      ctx.fillStyle = '#f59e0b';
      ctx.font = '11px JetBrains Mono';
      ctx.textAlign = 'right';
      ctx.fillText(`+`, batX - 8, batY - 14);
      ctx.fillText(`-`, batX - 8, batY + 16);
      ctx.fillText(`${voltage}V DC`, batX - 12, batY);

      // Wiring Paths
      ctx.strokeStyle = switchClosed ? '#38bdf8' : '#64748b';
      ctx.lineWidth = 2.5;

      if (mode === 'series') {
        // Series loop: Bat -> Lamp 1 -> Lamp 2 -> Bat
        const lamp1X = 260;
        const lamp2X = 460;
        const topY = 70;
        const botY = height - 70;

        ctx.beginPath();
        // Top wire from battery
        ctx.moveTo(batX, batY - 24);
        ctx.lineTo(batX, topY);
        ctx.lineTo(lamp1X - 25, topY);
        ctx.stroke();

        // Wire between lamp 1 and lamp 2
        ctx.beginPath();
        ctx.moveTo(lamp1X + 25, topY);
        ctx.lineTo(lamp2X - 25, topY);
        ctx.stroke();

        // Wire after lamp 2 down to bottom
        ctx.beginPath();
        ctx.moveTo(lamp2X + 25, topY);
        ctx.lineTo(width - 60, topY);
        ctx.lineTo(width - 60, botY);
        ctx.lineTo(batX, botY);
        ctx.lineTo(batX, batY + 20);
        ctx.stroke();

        // Draw Bulb 1
        drawBulb(ctx, lamp1X, topY, 'Lampu 1', r1, v1, p1, switchClosed);
        // Draw Bulb 2
        drawBulb(ctx, lamp2X, topY, 'Lampu 2', r2, v2, p2, switchClosed);

      } else {
        // Parallel loop: Bat splits into Branch 1 and Branch 2
        const splitX = 220;
        const joinX = 460;
        const branch1Y = 70;
        const branch2Y = 170;
        const botY = height - 60;

        ctx.beginPath();
        ctx.moveTo(batX, batY - 24);
        ctx.lineTo(batX, branch1Y);
        ctx.lineTo(splitX, branch1Y);
        ctx.stroke();

        // Branch 1 wire
        ctx.beginPath();
        ctx.moveTo(splitX, branch1Y);
        ctx.lineTo(splitX + 60, branch1Y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(splitX + 110, branch1Y);
        ctx.lineTo(joinX, branch1Y);
        ctx.stroke();

        // Branch 2 wire
        ctx.beginPath();
        ctx.moveTo(splitX, branch1Y);
        ctx.lineTo(splitX, branch2Y);
        ctx.lineTo(splitX + 60, branch2Y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(splitX + 110, branch2Y);
        ctx.lineTo(joinX, branch2Y);
        ctx.lineTo(joinX, branch1Y);
        ctx.stroke();

        // Return wire
        ctx.beginPath();
        ctx.moveTo(joinX, branch1Y);
        ctx.lineTo(width - 60, branch1Y);
        ctx.lineTo(width - 60, botY);
        ctx.lineTo(batX, botY);
        ctx.lineTo(batX, batY + 20);
        ctx.stroke();

        // Draw bulbs
        drawBulb(ctx, splitX + 85, branch1Y, 'Lampu 1', r1, v1, p1, switchClosed);
        drawBulb(ctx, splitX + 85, branch2Y, 'Lampu 2', r2, v2, p2, switchClosed);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [mode, voltage, r1, r2, switchClosed, iTotal, v1, v2, p1, p2]);

  function drawBulb(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    label: string,
    r: number,
    v: number,
    power: number,
    isClosed: boolean
  ) {
    const intensity = isClosed ? Math.min(1, power / 30) : 0;

    // Glowing aura if powered
    if (intensity > 0.05) {
      const grad = ctx.createRadialGradient(x, y, 4, x, y, 32 + intensity * 24);
      grad.addColorStop(0, `rgba(250, 204, 21, ${0.4 * intensity})`);
      grad.addColorStop(1, 'rgba(250, 204, 21, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, 40 + intensity * 20, 0, Math.PI * 2);
      ctx.fill();
    }

    // Glass bulb circle
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.fillStyle = intensity > 0.1 ? `rgba(254, 240, 138, ${0.4 + intensity * 0.6})` : 'rgba(30, 41, 59, 0.8)';
    ctx.fill();
    ctx.strokeStyle = intensity > 0.1 ? '#facc15' : '#64748b';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Filament cross
    ctx.strokeStyle = intensity > 0.1 ? '#ffffff' : '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x - 6, y + 6);
    ctx.lineTo(x, y - 6);
    ctx.lineTo(x + 6, y + 6);
    ctx.stroke();

    // Text labels
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px JetBrains Mono';
    ctx.textAlign = 'center';
    ctx.fillText(`${label} (${r}Ω)`, x, y - 24);
    ctx.fillText(`${v.toFixed(1)}V · ${power.toFixed(1)}W`, x, y + 30);
  }

  return (
    <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Simulator Rangkaian Listrik DC (Seri vs Paralel)</span>
            <span className="text-[11px] font-mono text-amber-400">V = I · R · P = V²/R</span>
          </h3>
          <p className="text-xs text-slate-400">
            Mengamati perbedaan kecerahan bohlam, pembagian arus, dan tegangan
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-950 p-1 text-xs">
          <button
            onClick={() => setMode('series')}
            className={`px-3 py-1.5 rounded-md transition ${
              mode === 'series' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Rangkaian Seri
          </button>
          <button
            onClick={() => setMode('parallel')}
            className={`px-3 py-1.5 rounded-md transition ${
              mode === 'parallel' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Rangkaian Paralel
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

        {/* Digital Multimeter Panel */}
        <div className="absolute top-3 right-3 rounded-lg border border-slate-800 bg-slate-950/90 p-3 font-mono text-xs backdrop-blur space-y-1.5 w-60">
          <div className="text-[11px] font-bold text-amber-400 border-b border-slate-800 pb-1">
            MULTIMETER TELEMETRI
          </div>
          <div className="flex justify-between text-slate-300">
            <span>R Ekuivalen (R_eq):</span>
            <span className="font-bold tabular-nums">{rEq.toFixed(2)} Ω</span>
          </div>
          <div className="flex justify-between text-sky-400">
            <span>Arus Total (I_tot):</span>
            <span className="font-bold tabular-nums">{iTotal.toFixed(2)} A</span>
          </div>
          <div className="flex justify-between text-emerald-400">
            <span>Daya Total (P_tot):</span>
            <span className="font-bold tabular-nums">{pTotal.toFixed(1)} Watt</span>
          </div>
          <div className="pt-1 border-t border-slate-800 text-[10px] text-slate-400">
            {mode === 'series'
              ? 'Tegangan terbagi 2 (6V + 6V), lampu redup.'
              : 'Tegangan cabang utuh (12V), lampu terang!'}
          </div>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
        {/* Voltage */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Tegangan Baterai (V)</span>
            <span className="font-mono text-amber-400 tabular-nums">{voltage} Volt</span>
          </div>
          <input
            type="range"
            min={3}
            max={24}
            step={1}
            value={voltage}
            onChange={e => setVoltage(Number(e.target.value))}
            className="w-full cursor-pointer"
          />
        </div>

        {/* R1 */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Hambatan Lampu 1</span>
            <span className="font-mono text-white tabular-nums">{r1} Ω</span>
          </div>
          <input
            type="range"
            min={2}
            max={20}
            step={1}
            value={r1}
            onChange={e => setR1(Number(e.target.value))}
            className="w-full cursor-pointer"
          />
        </div>

        {/* R2 */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Hambatan Lampu 2</span>
            <span className="font-mono text-white tabular-nums">{r2} Ω</span>
          </div>
          <input
            type="range"
            min={2}
            max={20}
            step={1}
            value={r2}
            onChange={e => setR2(Number(e.target.value))}
            className="w-full cursor-pointer"
          />
        </div>
      </div>

      {/* Investigative deduction hint */}
      <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-xs text-slate-300">
        <span className="font-semibold text-amber-400">Penjelasan Ilmiah: </span>
        Kecerahan cahaya lampu ditentukan oleh daya aktual P. Pada sambungan seri, hambatan total menjadi R1 + R2 = 12 Ohm sehingga arus berkurang dan tegangan per lampu terbagi dua. Akibatnya daya per lampu turun menjadi P = (6V)² / 6Ω = 6 Watt (sangat redup!). Pada sambungan paralel, tiap lampu menikmati 12V penuh sehingga dayanya 24 Watt (4 kali lebih terang!).
      </div>
    </div>
  );
};
