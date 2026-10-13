import React from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { Timer, Play, Pause, RotateCcw, X, Plus } from 'lucide-react';

export const RestTimerFloating: React.FC = () => {
  const {
    timerRemaining,
    timerTotal,
    timerRunning,
    startRestTimer,
    pauseRestTimer,
    resetRestTimer
  } = useWorkout();

  if (timerRemaining === null) return null;

  const progressPercent = Math.max(0, Math.min(100, ((timerTotal - timerRemaining) / timerTotal) * 100));

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const isCompleted = timerRemaining <= 0;

  return (
    <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto z-40">
      <div className={`p-3 rounded-2xl shadow-2xl border transition-all ${
        isCompleted
          ? 'bg-amber-950/90 border-amber-500/80 text-amber-200 animate-pulse'
          : 'bg-[#181a22]/95 border-amber-500/40 text-slate-100 backdrop-blur-md'
      }`}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              isCompleted ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-amber-500/15 text-amber-400'
            }`}>
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                {isCompleted ? 'Descanso Finalizado!' : 'Descanso entre Séries'}
              </div>
              <div className="text-xl font-bold font-mono tracking-tight text-white tabular-nums">
                {formatTime(timerRemaining)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {!isCompleted && (
              <button
                type="button"
                onClick={() => startRestTimer(timerRemaining + 30)}
                title="+30s"
                className="px-2 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-0.5 border border-slate-700 active:scale-95 transition-transform"
              >
                <Plus className="w-3 h-3" />
                30s
              </button>
            )}

            {!isCompleted && (
              <button
                type="button"
                onClick={() => (timerRunning ? pauseRestTimer() : startRestTimer(timerRemaining))}
                className="w-9 h-9 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center font-bold active:scale-95 transition-transform"
                title={timerRunning ? 'Pausar' : 'Continuar'}
              >
                {timerRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              </button>
            )}

            <button
              type="button"
              onClick={resetRestTimer}
              className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center active:scale-95 transition-transform"
              title="Fechar Cronômetro"
            >
              {isCompleted ? <X className="w-4 h-4" /> : <RotateCcw className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Progress line */}
        <div className="w-full bg-slate-800/80 h-1.5 rounded-full mt-2.5 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              isCompleted ? 'bg-amber-400' : 'bg-gradient-to-r from-amber-500 to-amber-300'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
