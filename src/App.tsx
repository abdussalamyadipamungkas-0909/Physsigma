import React, { useState } from 'react';
import { DetectiveProvider, useDetective } from './context/DetectiveContext';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { SearchModal } from './components/common/SearchModal';
import { SettingsModal } from './components/common/SettingsModal';
import { NotificationContainer } from './components/common/NotificationContainer';
import { Dashboard } from './components/dashboard/Dashboard';
import { CaseList } from './components/cases/CaseList';
import { InvestigationRoom } from './components/cases/InvestigationRoom';
import { SimulationLab } from './components/simulations/SimulationLab';
import { DetectiveNotebook } from './components/notebook/DetectiveNotebook';
import { KnowledgeCenter } from './components/knowledge/KnowledgeCenter';
import { DetectiveChallenge } from './components/challenges/DetectiveChallenge';
import { ShieldCheck, RotateCcw, Heart, Layers } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, resetProgress } = useDetective();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#070b14] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* 2. Main Layout Area (offset for desktop sidebar) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 transition-all duration-300">
        
        {/* Top Command Navigation Header */}
        <Header
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Viewport Main Content Container */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'cases' && <CaseList />}
          {activeTab === 'investigation' && <InvestigationRoom />}
          {activeTab === 'simulation' && <SimulationLab />}
          {activeTab === 'notebook' && <DetectiveNotebook />}
          {activeTab === 'knowledge' && <KnowledgeCenter />}
          {activeTab === 'challenges' && <DetectiveChallenge />}
        </main>

        {/* Scientific Laboratory Footer */}
        <footer className="mt-auto border-t border-slate-800/80 bg-[#070b14]/90 text-xs text-slate-400 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-4 w-4 text-cyan-400 shrink-0" />
              <span className="font-bold text-slate-200">PHYSIGMA</span>
              <span>—</span>
              <span className="text-slate-400">Media Pembelajaran Fisika Berbasis Investigasi Ilmiah SMA/MA</span>
            </div>

            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span className="text-cyan-400">Standar Satuan SI</span>
              <span>·</span>
              <span>Kurikulum Fisika</span>
              <span>·</span>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="text-slate-400 hover:text-white transition cursor-pointer"
              >
                Pengaturan
              </button>
            </div>
          </div>
        </footer>

      </div>

      {/* Floating Modals and Notifications */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <NotificationContainer />

    </div>
  );
};

export default function App() {
  return (
    <DetectiveProvider>
      <AppContent />
    </DetectiveProvider>
  );
}
