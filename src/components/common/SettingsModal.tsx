import React, { useState } from 'react';
import { useDetective } from '../../context/DetectiveContext';
import { 
  X, 
  Settings, 
  RotateCcw, 
  Check, 
  ShieldCheck, 
  AlertTriangle,
  Award,
  Sparkles
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateDetectiveName, resetProgress } = useDetective();
  const [name, setName] = useState(profile.name);
  const [codeName, setCodeName] = useState(profile.codeName);
  const [isSaved, setIsSaved] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateDetectiveName(name, codeName);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleReset = () => {
    resetProgress();
    setShowResetConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-700/80 bg-[#0b1220] shadow-2xl shadow-cyan-500/10 backdrop-blur-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-2.5 text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Settings className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Pengaturan Detektif & Forensik</h3>
              <p className="text-[11px] text-slate-400">Konfigurasi tanda pengenal & manajemen data</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Identity Form */}
          <form onSubmit={handleSave} className="space-y-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={profile.avatar}
                  alt="Badge"
                  referrerPolicy="no-referrer"
                  className="h-12 w-12 rounded-xl border border-cyan-500/40 object-cover shadow-sm"
                />
                <div>
                  <span className="text-xs font-bold text-white block">{profile.rank}</span>
                  <span className="text-[11px] font-mono text-cyan-400">
                    Level {profile.level} · {profile.xp} XP Terkumpul
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Nama Detektif</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Contoh: Danu Prasetya"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Kode Panggilan Agen</label>
                  <input
                    type="text"
                    value={codeName}
                    onChange={e => setCodeName(e.target.value)}
                    placeholder="PD-ALPHA"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 font-mono uppercase text-cyan-300 focus:border-cyan-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition cursor-pointer shadow-sm shadow-cyan-500/20"
                >
                  {isSaved ? <Check className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                  <span>{isSaved ? 'Tersimpan!' : 'Perbarui Tanda Pengenal'}</span>
                </button>
              </div>
            </div>
          </form>

          {/* Reset Investigation Data Zone */}
          <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
                <RotateCcw className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white">Reset Seluruh Data Investigasi</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Menghapus catatan notebook, mengembalikan status kasus ke belum terpecahkan, dan mereset poin XP ke kondisi awal.
                </p>
              </div>
            </div>

            {showResetConfirm ? (
              <div className="rounded-lg border border-rose-500/50 bg-rose-950/40 p-3 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-rose-300 font-semibold">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Apakah Anda yakin ingin menghapus seluruh kemajuan?</span>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-3 py-1.5 rounded-md text-slate-400 hover:text-white"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-3.5 py-1.5 rounded-md bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer shadow-sm"
                  >
                    Ya, Reset Sekarang
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(true)}
                  className="rounded-lg border border-rose-500/40 px-3.5 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/10 transition cursor-pointer"
                >
                  Konfirmasi Reset Data
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 bg-slate-950/80 px-6 py-3 flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono text-[10px]">PHYSIGMA v2.0 · COMPETITION EDITION</span>
          <button
            onClick={onClose}
            className="hover:text-white transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
