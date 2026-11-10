import React, { createContext, useContext, useState, useEffect } from 'react';
import { DetectiveProfile, DetectiveRank, Achievement, UserNote } from '../types';

interface ToastNotice {
  id: string;
  type: 'xp' | 'badge' | 'case' | 'info';
  title: string;
  message: string;
}

interface DetectiveContextType {
  profile: DetectiveProfile;
  activeTab: 'dashboard' | 'cases' | 'investigation' | 'simulation' | 'notebook' | 'knowledge' | 'challenges';
  setActiveTab: (tab: 'dashboard' | 'cases' | 'investigation' | 'simulation' | 'notebook' | 'knowledge' | 'challenges') => void;
  selectedCaseId: string | null;
  openCase: (caseId: string) => void;
  addXP: (amount: number, reason?: string) => void;
  markCaseSolved: (caseId: string, earnedXP: number) => void;
  unlockAchievement: (achievementId: string) => void;
  addNote: (note: Omit<UserNote, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, note: Partial<UserNote>) => void;
  deleteNote: (id: string) => void;
  completeChallenge: (challengeId: string, earnedXP: number) => void;
  updateDetectiveName: (name: string, codeName: string) => void;
  resetProgress: () => void;
  toasts: ToastNotice[];
  dismissToast: (id: string) => void;
}

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_clue', title: 'Langkah Pertama Sains', description: 'Memeriksa bukti forensik pertama kali di ruang investigasi.', icon: 'Search', category: 'case' },
  { id: 'galileo_eye', title: 'Mata Galileo', description: 'Menyelesaikan investigasi Case 001 (Gerak Jatuh Bebas).', icon: 'Eye', category: 'case' },
  { id: 'energy_tracker', title: 'Pelacak Energi', description: 'Menyelesaikan investigasi Case 002 (Kekekalan Energi).', icon: 'Flame', category: 'case' },
  { id: 'newton_disciple', title: 'Hukum Kelembaman', description: 'Menyelesaikan investigasi Case 003 (Hukum Newton).', icon: 'Compass', category: 'case' },
  { id: 'wave_whisperer', title: 'Penakluk Gelombang', description: 'Menyelesaikan investigasi Case 004 (Gelombang Mekanik).', icon: 'Activity', category: 'case' },
  { id: 'circuit_sleuth', title: 'Detektif Sirkuit', description: 'Menyelesaikan investigasi Case 005 (Rangkaian Listrik).', icon: 'Zap', category: 'case' },
  { id: 'virtual_scientist', title: 'Laboran Virtual', description: 'Melakukan eksperimen bebas di Physics Simulation Lab.', icon: 'Sliders', category: 'lab' },
  { id: 'scientific_notebook', title: 'Jurnal Forensik', description: 'Menulis catatan ilmiah mandiri di Detective Notebook.', icon: 'BookOpen', category: 'mastery' },
  { id: 'quiz_master', title: 'Uji Deduksi Unggul', description: 'Menyelesaikan 3 tantangan konseptual fisika.', icon: 'Award', category: 'quiz' }
];

const INITIAL_PROFILE: DetectiveProfile = {
  name: 'Detektif Muda',
  codeName: 'PD-ALPHA',
  avatar: '/src/assets/images/detective_badge_insignia_1794295505488.jpg',
  rank: 'Junior Detective',
  level: 1,
  xp: 0,
  casesSolvedCount: 0,
  solvedCaseIds: [],
  activeCaseId: 'case-001',
  achievements: DEFAULT_ACHIEVEMENTS,
  notes: [
    {
      id: 'init-note-1',
      caseId: 'case-001',
      title: 'Hukum Gravitasi & Inersia Galileo',
      content: 'Massa inersia sama dengan massa gravitasi ($m_i = m_g$). Pada ruang hampa, $a = W/m = mg/m = g \\approx 9.8\\text{ m/s}^2$. Hambatan udara $F_d = 0.5 C_d \\rho A v^2$ adalah satu-satunya alasan mengapa bulu jatuh lambat di udara!',
      formulaDraft: 'a = g = 9.8 m/s^2',
      createdAt: new Date().toLocaleDateString('id-ID'),
      updatedAt: new Date().toLocaleDateString('id-ID')
    }
  ],
  completedChallengeIds: []
};

const STORAGE_KEY = 'physics_detective_profile_v1';

function calculateRankAndLevel(xp: number): { rank: DetectiveRank; level: number } {
  if (xp >= 2000) return { rank: 'Master of Physics', level: 4 };
  if (xp >= 1000) return { rank: 'Senior Investigator', level: 3 };
  if (xp >= 400) return { rank: 'Physics Investigator', level: 2 };
  return { rank: 'Junior Detective', level: 1 };
}

const DetectiveContext = createContext<DetectiveContextType | undefined>(undefined);

export const DetectiveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<DetectiveProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_PROFILE,
          ...parsed,
          achievements: DEFAULT_ACHIEVEMENTS.map(def => {
            const existing = parsed.achievements?.find((a: Achievement) => a.id === def.id);
            return existing ? { ...def, unlockedAt: existing.unlockedAt } : def;
          })
        };
      }
    } catch {
      // fallback to initial
    }
    return INITIAL_PROFILE;
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'cases' | 'investigation' | 'simulation' | 'notebook' | 'knowledge' | 'challenges'>('dashboard');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>('case-001');
  const [toasts, setToasts] = useState<ToastNotice[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // Ignore write errors
    }
  }, [profile]);

  const addToast = (toast: Omit<ToastNotice, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addXP = (amount: number, reason?: string) => {
    setProfile(prev => {
      const newXP = prev.xp + amount;
      const { rank, level } = calculateRankAndLevel(newXP);
      const isLevelUp = level > prev.level;

      if (isLevelUp) {
        addToast({
          type: 'badge',
          title: `PROMOSI DETEKTIF!`,
          message: `Selamat! Gelar detektif meningkat menjadi ${rank} (Level ${level})!`
        });
      } else {
        addToast({
          type: 'xp',
          title: `+${amount} XP Diperoleh`,
          message: reason || 'Kemajuan investigasi sains tercatat.'
        });
      }

      return {
        ...prev,
        xp: newXP,
        rank,
        level
      };
    });
  };

  const unlockAchievement = (achievementId: string) => {
    setProfile(prev => {
      const exists = prev.achievements.find(a => a.id === achievementId);
      if (exists && exists.unlockedAt) return prev; // already unlocked

      const now = new Date().toLocaleDateString('id-ID');
      const updatedAchievements = prev.achievements.map(a => 
        a.id === achievementId ? { ...a, unlockedAt: now } : a
      );

      const item = prev.achievements.find(a => a.id === achievementId);
      if (item) {
        addToast({
          type: 'badge',
          title: `Lencana Tercapai: ${item.title}`,
          message: item.description
        });
      }

      return {
        ...prev,
        achievements: updatedAchievements
      };
    });
  };

  const openCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setProfile(prev => ({ ...prev, activeCaseId: caseId }));
    setActiveTab('investigation');
  };

  const markCaseSolved = (caseId: string, earnedXP: number) => {
    setProfile(prev => {
      const isNew = !prev.solvedCaseIds.includes(caseId);
      const updatedSolved = isNew ? [...prev.solvedCaseIds, caseId] : prev.solvedCaseIds;
      const newXP = isNew ? prev.xp + earnedXP : prev.xp;
      const { rank, level } = calculateRankAndLevel(newXP);

      if (isNew) {
        addToast({
          type: 'case',
          title: `KASUS TERPECAHKAN!`,
          message: `Kasus ${caseId.toUpperCase()} selesai dengan deduksi ilmiah yang tepat. +${earnedXP} XP!`
        });

        // Trigger case badges
        if (caseId === 'case-001') unlockAchievement('galileo_eye');
        if (caseId === 'case-002') unlockAchievement('energy_tracker');
        if (caseId === 'case-003') unlockAchievement('newton_disciple');
        if (caseId === 'case-004') unlockAchievement('wave_whisperer');
        if (caseId === 'case-005') unlockAchievement('circuit_sleuth');
      }

      return {
        ...prev,
        xp: newXP,
        rank,
        level,
        solvedCaseIds: updatedSolved,
        casesSolvedCount: updatedSolved.length
      };
    });
  };

  const addNote = (noteData: Omit<UserNote, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: UserNote = {
      ...noteData,
      id: 'note-' + Date.now(),
      createdAt: new Date().toLocaleDateString('id-ID'),
      updatedAt: new Date().toLocaleDateString('id-ID')
    };

    setProfile(prev => ({
      ...prev,
      notes: [newNote, ...prev.notes]
    }));

    unlockAchievement('scientific_notebook');
    addToast({
      type: 'info',
      title: 'Catatan Detektif Disimpan',
      message: `Catatan "${noteData.title}" berhasil diarsipkan di notebook.`
    });
  };

  const updateNote = (id: string, noteData: Partial<UserNote>) => {
    setProfile(prev => ({
      ...prev,
      notes: prev.notes.map(n => n.id === id ? { ...n, ...noteData, updatedAt: new Date().toLocaleDateString('id-ID') } : n)
    }));
  };

  const deleteNote = (id: string) => {
    setProfile(prev => ({
      ...prev,
      notes: prev.notes.filter(n => n.id !== id)
    }));
  };

  const completeChallenge = (challengeId: string, earnedXP: number) => {
    setProfile(prev => {
      if (prev.completedChallengeIds.includes(challengeId)) return prev;
      const updated = [...prev.completedChallengeIds, challengeId];
      if (updated.length >= 3) {
        unlockAchievement('quiz_master');
      }
      return {
        ...prev,
        completedChallengeIds: updated
      };
    });
    addXP(earnedXP, 'Tantangan Fisika Berhasil Dipecahkan');
  };

  const updateDetectiveName = (name: string, codeName: string) => {
    setProfile(prev => ({
      ...prev,
      name: name.trim() || 'Detektif Muda',
      codeName: codeName.trim().toUpperCase() || 'PD-ALPHA'
    }));
    addToast({
      type: 'info',
      title: 'Profil Detektif Diperbarui',
      message: `Identitas agen forensik diset ke ${name || 'Detektif Muda'}.`
    });
  };

  const resetProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProfile(INITIAL_PROFILE);
    setSelectedCaseId('case-001');
    setActiveTab('dashboard');
    addToast({
      type: 'info',
      title: 'Data Direset',
      message: 'Seluruh progress investigasi telah direset ke setelan awal.'
    });
  };

  return (
    <DetectiveContext.Provider
      value={{
        profile,
        activeTab,
        setActiveTab,
        selectedCaseId,
        openCase,
        addXP,
        markCaseSolved,
        unlockAchievement,
        addNote,
        updateNote,
        deleteNote,
        completeChallenge,
        updateDetectiveName,
        resetProgress,
        toasts,
        dismissToast
      }}
    >
      {children}
    </DetectiveContext.Provider>
  );
};

export const useDetective = () => {
  const context = useContext(DetectiveContext);
  if (!context) throw new Error('useDetective must be used within a DetectiveProvider');
  return context;
};
