import React from 'react';
import { useWorkout, ActiveTab } from '../context/WorkoutContext';
import {
  LayoutDashboard,
  Dumbbell,
  ClipboardList,
  TrendingUp,
  Video,
  Timer,
  User,
  ShieldCheck
} from 'lucide-react';

interface NavbarProps {
  onOpenProfile: () => void;
  onOpenTimerModal: () => void;
  isMobilePreview: boolean;
  setIsMobilePreview: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenProfile,
  onOpenTimerModal,
  isMobilePreview,
  setIsMobilePreview
}) => {
  const {
    activeTab,
    setActiveTab,
    timerRunning,
    timerRemaining,
    userProfile,
    fontSizeMode,
    toggleFontSize
  } = useWorkout();

  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Início', icon: LayoutDashboard },
    { id: 'workouts', label: 'Meus Treinos', icon: Dumbbell },
    { id: 'template', label: 'Modelo Padrão', icon: ClipboardList },
    { id: 'evolution', label: 'Evolução', icon: TrendingUp },
    { id: 'tutorials', label: 'Tutoriais', icon: Video },
  ];

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#0c0d10]/95 backdrop-blur-md border-b border-[#1f222d] px-4 py-3.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          {/* Brand zone */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-extrabold text-slate-950 shadow-md shadow-amber-500/20 shrink-0">
              <Dumbbell className="w-6 h-6 -rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl sm:text-2xl tracking-tight text-white font-sans uppercase">
                  ApexFit
                </span>
                <span className="text-xs sm:text-sm font-extrabold px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  ABCDE
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium hidden sm:block">
                Evolução & Controle de Cargas
              </p>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick Font Size Switcher for "As letras estão muito pequenas deixe maior" */}
            <button
              type="button"
              onClick={toggleFontSize}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#15171e] text-amber-400 border border-[#242834] hover:bg-[#1b1e28] text-xs font-black transition-all active:scale-95 shadow-sm"
              title={`Tamanho da Letra: ${
                fontSizeMode === 'normal'
                  ? 'Normal (18px)'
                  : fontSizeMode === 'large'
                  ? 'Grande (21px - Ativo)'
                  : 'Muito Grande (24px - Ativo)'
              } — Toque para alternar`}
            >
              <span className="font-mono text-sm sm:text-base font-black">
                {fontSizeMode === 'normal' ? 'Aa' : fontSizeMode === 'large' ? 'A+' : 'A++'}
              </span>
              <span className="hidden sm:inline text-xs sm:text-sm font-bold text-slate-300">
                {fontSizeMode === 'normal' ? 'Normal' : fontSizeMode === 'large' ? 'Letras Grandes' : 'Extra Grande'}
              </span>
            </button>

            {/* Quick Rest Timer Trigger */}
            <button
              type="button"
              onClick={onOpenTimerModal}
              className={`flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-sm sm:text-base font-bold transition-all border ${
                timerRunning && timerRemaining !== null
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                  : 'bg-[#15171e] text-slate-200 border-[#242834] hover:bg-[#1b1e28]'
              }`}
              title="Cronômetro de descanso"
            >
              <Timer className={`w-4 h-4 sm:w-5 sm:h-5 ${timerRunning ? 'animate-spin' : ''}`} />
              <span className="tabular-nums font-mono text-sm sm:text-base font-bold">
                {timerRunning && timerRemaining !== null
                  ? `${Math.floor(timerRemaining / 60)}:${(timerRemaining % 60).toString().padStart(2, '0')}`
                  : 'Descanso'}
              </span>
            </button>

            {/* Desktop / Mobile view toggle on large screens */}
            <button
              type="button"
              onClick={() => setIsMobilePreview(!isMobilePreview)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#15171e] text-slate-200 border border-[#242834] hover:bg-[#1b1e28] text-xs font-semibold"
              title="Alternar entre visualização Mobile e Expandida"
            >
              <span>{isMobilePreview ? 'Tela Cheia' : 'Celular'}</span>
            </button>

            {/* User Profile & Backup */}
            <button
              type="button"
              onClick={onOpenProfile}
              className="flex items-center gap-2 p-2 sm:px-3.5 sm:py-2 rounded-xl bg-[#15171e] text-slate-100 border border-[#242834] hover:bg-[#1b1e28] transition-colors"
              title="Perfil e Backup dos Dados"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-800 text-amber-400 flex items-center justify-center font-bold text-base">
                {userProfile.name.charAt(0)}
              </div>
              <span className="text-sm sm:text-base font-bold hidden md:inline truncate max-w-[130px]">
                {userProfile.name}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Bottom Fixed Navigation Bar (Mobile-first Thumb Zone) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0c0d10]/98 backdrop-blur-lg border-t border-[#222634] shadow-2xl">
        <div className="max-w-xl mx-auto grid grid-cols-5 items-center h-22 px-1 pb-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center h-full w-full select-none transition-all py-1.5 ${
                  isActive ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div
                  className={`w-12 h-9 flex items-center justify-center rounded-xl transition-all ${
                    isActive ? 'bg-amber-400/20 text-amber-400' : ''
                  }`}
                >
                  <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.9]'}`} />
                </div>
                <span
                  className={`text-xs sm:text-sm tracking-tight mt-1 whitespace-nowrap text-center ${
                    isActive ? 'font-black text-amber-400' : 'font-bold text-slate-300'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
