import React, { useState, useRef, useEffect } from 'react';
import { useDetective } from '../../context/DetectiveContext';
import { 
  Menu, 
  Search, 
  Bell, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Award,
  Sparkles,
  ChevronDown,
  X
} from 'lucide-react';

interface HeaderProps {
  onOpenSidebar: () => void;
  onOpenSearch: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenSidebar, 
  onOpenSearch, 
  onOpenSettings 
}) => {
  const { profile, openCase, toasts, dismissToast, setActiveTab } = useDetective();
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement | null>(null);

  // Close notifications dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStartOrContinue = () => {
    if (profile.activeCaseId) {
      openCase(profile.activeCaseId);
    } else {
      setActiveTab('cases');
    }
  };

  const unlockedBadges = profile.achievements.filter(a => a.unlockedAt);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800/80 bg-[#070b14]/90 px-4 sm:px-6 lg:px-8 backdrop-blur-xl">
      
      {/* Left Zone: Mobile Menu Toggle & Command Title */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <button
          onClick={onOpenSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80 text-slate-400 hover:text-white hover:border-slate-700 lg:hidden transition cursor-pointer"
          title="Buka Navigasi"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Welcome message / Incident command lead */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-[11px] font-mono font-semibold text-cyan-400 uppercase tracking-wider">
              BIRO FORENSIK FISIKA
            </span>
            <span className="hidden sm:inline-block text-slate-600">·</span>
            <span className="text-xs sm:text-sm font-bold text-white truncate">
              Selamat Bertugas, {profile.name}
            </span>
          </div>
          <p className="hidden md:block text-[11px] text-slate-400 truncate">
            Status: {profile.rank} (Level {profile.level}) · Standar Satuan Internasional (SI)
          </p>
        </div>
      </div>

      {/* Right Zone: Search Trigger, Notifications & Profile Pill */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        
        {/* Quick Search Button */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-400 hover:border-cyan-500/40 hover:text-slate-200 transition cursor-pointer"
          title="Pencarian Cepat Kasus & Formula"
        >
          <Search className="h-3.5 w-3.5 text-cyan-400" />
          <span className="hidden md:inline text-slate-400">Cari kasus, rumus...</span>
          <kbd className="hidden sm:inline-block rounded border border-slate-700 bg-slate-800/80 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
            ⌘K
          </kbd>
        </button>

        {/* Notification Bell with Flyout */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-white transition cursor-pointer"
            title="Pemberitahuan & Lencana"
          >
            <Bell className="h-4 w-4" />
            {(unlockedBadges.length > 0 || toasts.length > 0) && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-cyan-400" />
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 overflow-hidden rounded-2xl border border-slate-800 bg-[#0b1220]/95 shadow-2xl shadow-cyan-500/10 backdrop-blur-2xl z-50">
              <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white">Log Capaian Forensik</span>
                </div>
                <span className="font-mono text-[10px] text-cyan-400 font-semibold tabular-nums">
                  {unlockedBadges.length} Lencana Diraih
                </span>
              </div>

              <div className="max-h-80 overflow-y-auto p-3 space-y-2">
                {unlockedBadges.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    Belum ada lencana yang terbuka. Periksa bukti di ruang investigasi untuk meraih lencana pertama!
                  </div>
                ) : (
                  unlockedBadges.slice(0, 5).map(badge => (
                    <div
                      key={badge.id}
                      className="flex items-start gap-3 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-2.5 text-xs"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-white truncate">{badge.title}</h5>
                          <span className="text-[10px] font-mono text-cyan-400 shrink-0">
                            {badge.unlockedAt}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2">
                          {badge.description}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-slate-800 bg-slate-950/80 px-4 py-2 text-right">
                <button
                  onClick={() => setShowNotifMenu(false)}
                  className="text-[11px] text-slate-400 hover:text-white"
                >
                  Tutup
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Detective Profile Badge Pill */}
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-900/60 p-1.5 pr-3 hover:border-cyan-500/40 transition cursor-pointer text-left"
          title="Buka Pengaturan Profil"
        >
          <img
            src={profile.avatar}
            alt="Profile Avatar"
            referrerPolicy="no-referrer"
            className="h-7 w-7 rounded-lg border border-cyan-500/30 object-cover"
          />
          <div className="hidden sm:block">
            <span className="block text-xs font-bold text-white truncate max-w-[110px]">
              {profile.name}
            </span>
            <span className="block text-[10px] font-mono text-cyan-400 tabular-nums">
              Lv.{profile.level} · {profile.xp} XP
            </span>
          </div>
          <ChevronDown className="h-3 w-3 text-slate-500 hidden sm:block" />
        </button>

        {/* Primary Case Action CTA */}
        <button
          onClick={handleStartOrContinue}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm shadow-cyan-500/25 hover:from-cyan-400 hover:to-blue-500 transition cursor-pointer shrink-0"
        >
          <span className="hidden sm:inline">
            {profile.solvedCaseIds.length > 0 ? 'Lanjut Investigasi' : 'Mulai Kasus'}
          </span>
          <span className="sm:hidden">Investigasi</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>

      </div>
    </header>
  );
};
