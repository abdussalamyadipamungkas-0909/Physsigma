import React from 'react';
import { useDetective } from '../../context/DetectiveContext';
import { CASE_FILES } from '../../data/cases';
import { 
  LayoutDashboard, 
  FolderGit2, 
  Compass, 
  Sliders, 
  BookOpen, 
  GraduationCap, 
  Target, 
  Settings,
  ShieldCheck,
  X,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onOpenSettings }) => {
  const { activeTab, setActiveTab, profile } = useDetective();

  const solvedCount = profile.solvedCaseIds.length;
  const totalCases = CASE_FILES.length;

  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard,
      badge: null
    },
    { 
      id: 'cases', 
      label: 'Arsip Kasus', 
      icon: FolderGit2,
      badge: `${solvedCount}/${totalCases}`
    },
    { 
      id: 'investigation', 
      label: 'Ruang Investigasi', 
      icon: Compass,
      badge: profile.activeCaseId ? 'Aktif' : null,
      badgeColor: 'cyan'
    },
    { 
      id: 'simulation', 
      label: 'Lab Simulasi', 
      icon: Sliders,
      badge: '6 Alat'
    },
    { 
      id: 'notebook', 
      label: 'Buku Catatan', 
      icon: BookOpen,
      badge: profile.notes.length > 0 ? `${profile.notes.length}` : null
    },
    { 
      id: 'knowledge', 
      label: 'Pusat Pengetahuan', 
      icon: GraduationCap,
      badge: null
    },
    { 
      id: 'challenges', 
      label: 'Tantangan Fisika', 
      icon: Target,
      badge: profile.completedChallengeIds.length > 0 ? `${profile.completedChallengeIds.length}` : null
    },
  ];

  const handleNavClick = (tabId: any) => {
    setActiveTab(tabId);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col border-r border-slate-800/80 bg-[#090e1a]/95 backdrop-blur-xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-800/80 px-5">
          <button
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-500/40 bg-cyan-500/10 text-cyan-400 shadow-sm shadow-cyan-500/20 group-hover:border-cyan-400 group-hover:bg-cyan-500/20 transition">
              <ShieldCheck className="h-5 w-5" />
              <div className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-cyan-400 animate-ping opacity-75" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-white group-hover:text-cyan-300 transition">
                  PHYSIGMA
                </span>
              </div>
              <span className="block text-[10px] font-mono text-cyan-400/80 uppercase tracking-wider">
                Forensik Sains EdTech
              </span>
            </div>
          </button>

          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-mono font-semibold text-slate-300 uppercase tracking-wider">
            Menu Investigasi
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (item.id === 'cases' && activeTab === 'investigation' && false);
            const isHighlight = item.id === activeTab;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`group relative flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition cursor-pointer ${
                  isHighlight
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-white font-semibold border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
                }`}
              >
                {/* Active Indicator Bar on left */}
                {isHighlight && (
                  <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-cyan-400 shadow-sm shadow-cyan-400" />
                )}

                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 transition ${isHighlight ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`rounded-md px-1.5 py-0.5 font-mono text-[10px] tabular-nums ${
                      isHighlight
                        ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/30 font-bold'
                        : item.badgeColor === 'cyan'
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Detective Dossier Summary in Sidebar Bottom */}
        <div className="border-t border-slate-800/80 p-3.5 space-y-3 bg-[#070b14]/70">
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 space-y-2.5">
            <div className="flex items-center gap-2.5">
              <img
                src={profile.avatar}
                alt="Detective Avatar"
                referrerPolicy="no-referrer"
                className="h-10 w-10 rounded-lg border border-cyan-500/30 object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white truncate">{profile.name}</h4>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold tabular-nums">
                    Lv.{profile.level}
                  </span>
                </div>
                <p className="text-[11px] font-mono text-slate-400 truncate">
                  {profile.rank}
                </p>
              </div>
            </div>

            {/* XP progress bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-slate-300">Total XP</span>
                <span className="text-cyan-400 font-bold tabular-nums">{profile.xp} XP</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (profile.xp % 1000) / 10)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Settings Action */}
          <button
            onClick={() => {
              onOpenSettings();
              onClose();
            }}
            className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs text-slate-400 hover:bg-slate-800/60 hover:text-white transition cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Settings className="h-4 w-4" />
              <span>Pengaturan Profil & Data</span>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          </button>
        </div>
      </aside>
    </>
  );
};
