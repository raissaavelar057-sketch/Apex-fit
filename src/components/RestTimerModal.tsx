import React, { useState } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { X, Play, Pause, RotateCcw, Timer, Plus, Minus } from 'lucide-react';

interface RestTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RestTimerModal: React.FC<RestTimerModalProps> = ({ isOpen, onClose }) => {
  const {
    timerRemaining,
    timerTotal,
    timerRunning,
    startRestTimer,
    pauseRestTimer,
    resetRestTimer
  } = useWorkout();

  const [customSeconds, setCustomSeconds] = useState(60);

  if (!isOpen) return null;

  const currentSeconds = timerRemaining !== null ? timerRemaining : customSeconds;
  const mins = Math.floor(currentSeconds / 60);
  const secs = currentSeconds % 60;
  const isFinished = timerRemaining === 0;

  const presets = [30, 45, 60, 90, 120, 180];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#15171e] border border-[#262a38] rounded-3xl w-full max-w-sm p-5 space-y-5 shadow-2xl text-center">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#222634]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <Timer className="w-5 h-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white text-left">
              Cronômetro de Descanso
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Digital Clock Display */}
        <div className={`py-7 rounded-3xl border transition-all ${
          isFinished
            ? 'bg-amber-950/40 border-amber-500 text-amber-300 animate-pulse'
            : 'bg-[#101217] border-[#202432] text-white'
        }`}>
          <div className="text-6xl sm:text-7xl font-black font-mono tracking-tight tabular-nums">
            {mins}:{secs < 10 ? '0' : ''}{secs}
          </div>
          <span className="text-sm text-slate-200 font-sans mt-2 block font-semibold">
            {isFinished ? 'Tempo Esgotado! Próxima série!' : timerRunning ? 'Em andamento...' : 'Pronto para iniciar'}
          </span>
        </div>

        {/* Presets */}
        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-extrabold text-slate-200 uppercase tracking-wider block text-left">
            Intervalos Comuns
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {presets.map(p => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setCustomSeconds(p);
                  startRestTimer(p);
                }}
                className={`py-3 rounded-xl text-sm sm:text-base font-mono font-black transition-all border ${
                  timerTotal === p && timerRemaining !== null
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                    : 'bg-[#101217] text-slate-200 hover:text-white border-[#222634]'
                }`}
              >
                {p >= 60 ? `${p / 60}m` : `${p}s`}
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              if (timerRemaining === null) {
                startRestTimer(customSeconds);
              } else if (timerRunning) {
                pauseRestTimer();
              } else {
                startRestTimer(timerRemaining);
              }
            }}
            className="flex-1 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-base sm:text-lg flex items-center justify-center gap-2.5 active:scale-95 transition-transform shadow-lg shadow-amber-500/20"
          >
            {timerRunning ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>{timerRemaining !== null && timerRemaining > 0 ? 'Retomar' : 'Iniciar'}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={resetRestTimer}
            className="w-12 h-12 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors shrink-0"
            title="Resetar"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
