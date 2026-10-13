import React from 'react';
import { useWorkout } from '../context/WorkoutContext';
import {
  TrendingUp,
  Dumbbell,
  Calendar,
  Flame,
  ArrowRight,
  Clock,
  Sparkles,
  Trophy,
  ChevronRight,
  Play
} from 'lucide-react';
import { SPLIT_NAMES } from '../data/initialData';
import { WorkoutSplit } from '../types/workout';

export const HomeTab: React.FC = () => {
  const {
    years,
    userProfile,
    setActiveTab,
    navigateToWorkout,
    startRestTimer,
    allLoggedExerciseNames,
    getExerciseHistory
  } = useWorkout();

  // Compute key metrics
  const allCompletedSessions: {
    year: number;
    monthIndex: number;
    monthName: string;
    weekNumber: number;
    weekLabel: string;
    split: WorkoutSplit;
    date: string;
    exerciseCount: number;
    totalVolumeKg: number;
  }[] = [];

  years.forEach(y => {
    y.months.forEach(m => {
      m.weeks.forEach(w => {
        (Object.keys(w.workouts) as WorkoutSplit[]).forEach(split => {
          const session = w.workouts[split];
          if (session.exercises && session.exercises.length > 0) {
            let sessionVolume = 0;
            session.exercises.forEach(ex => {
              if (ex.weightKg !== null && ex.sets !== null && ex.reps !== null) {
                sessionVolume += ex.weightKg * ex.sets * ex.reps;
              }
            });
            allCompletedSessions.push({
              year: y.year,
              monthIndex: m.monthIndex,
              monthName: m.monthName,
              weekNumber: w.weekNumber,
              weekLabel: w.label,
              split,
              date: session.date || `${w.label} - ${m.monthName}`,
              exerciseCount: session.exercises.length,
              totalVolumeKg: sessionVolume
            });
          }
        });
      });
    });
  });

  const totalSessionsCount = allCompletedSessions.length;

  // Most recent session
  const latestSession = allCompletedSessions[allCompletedSessions.length - 1];

  // Determine next split suggestion in ABCDE rotation
  const splitOrder: WorkoutSplit[] = ['A', 'B', 'C', 'D', 'E'];
  const nextSplit: WorkoutSplit = latestSession
    ? splitOrder[(splitOrder.indexOf(latestSession.split) + 1) % splitOrder.length]
    : 'A';

  // Find recent PRs or greatest evolutions
  const highlightEvolutions: {
    name: string;
    startWeight: number;
    maxWeight: number;
    gain: number;
    latestDate: string;
  }[] = [];

  allLoggedExerciseNames.forEach(name => {
    const history = getExerciseHistory(name, 'all');
    const validWeights = history
      .filter(h => h.weightKg !== null)
      .map(h => ({ weight: h.weightKg as number, date: h.date }));
    if (validWeights.length >= 2) {
      const first = validWeights[0].weight;
      const max = Math.max(...validWeights.map(v => v.weight));
      if (max > first) {
        highlightEvolutions.push({
          name,
          startWeight: first,
          maxWeight: max,
          gain: max - first,
          latestDate: validWeights[validWeights.length - 1].date
        });
      }
    }
  });

  highlightEvolutions.sort((a, b) => b.gain - a.gain);

  return (
    <div className="space-y-6 pb-24 pt-2">
      {/* Welcome & Motivational Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1c24] via-[#13151b] to-[#0c0d10] p-6 sm:p-7 border border-[#262a38] shadow-xl">
        <div className="absolute -top-12 -right-12 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm sm:text-base font-black text-amber-400 mb-1.5">
              <Sparkles className="w-5 h-5" />
              <span>Bem-vinda, {userProfile.name}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Evolução Constante
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-lg font-medium leading-relaxed">
              Divisão ABCDE com histórico de Maio a Setembro de 2026 totalmente carregado e sincronizado.
            </p>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
            <Flame className="w-8 h-8 fill-amber-500/30" />
          </div>
        </div>

        {/* Quick KPI Strip */}
        <div className="grid grid-cols-3 gap-3.5 mt-6 pt-5 border-t border-[#232734]">
          <div className="bg-[#101217]/90 rounded-2xl p-3.5 sm:p-4 border border-[#1f2330]">
            <div className="text-xs sm:text-sm font-black text-slate-300 uppercase tracking-wider">
              Treinos
            </div>
            <div className="text-2xl sm:text-4xl font-black text-white font-mono tabular-nums mt-1">
              {totalSessionsCount}
            </div>
          </div>
          <div className="bg-[#101217]/90 rounded-2xl p-3.5 sm:p-4 border border-[#1f2330]">
            <div className="text-xs sm:text-sm font-black text-slate-300 uppercase tracking-wider">
              Exercícios
            </div>
            <div className="text-2xl sm:text-4xl font-black text-amber-400 font-mono tabular-nums mt-1">
              {allLoggedExerciseNames.length}
            </div>
          </div>
          <div className="bg-[#101217]/90 rounded-2xl p-3.5 sm:p-4 border border-[#1f2330]">
            <div className="text-xs sm:text-sm font-black text-slate-300 uppercase tracking-wider">
              Recordes
            </div>
            <div className="text-2xl sm:text-4xl font-black text-emerald-400 font-mono tabular-nums mt-1">
              +{highlightEvolutions.length}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action: Ir para o Treino / Próximo Treino Recomendado */}
      <div className="bg-[#15171e] rounded-3xl p-5 sm:p-6 border border-[#242834] shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <Dumbbell className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
            <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
              Próximo Treino Sugerido
            </h2>
          </div>
          <span className="text-xs sm:text-sm text-slate-300 font-mono font-black">
            Ciclo ABCDE
          </span>
        </div>

        <div className="bg-[#101217] rounded-2xl p-4 sm:p-6 border border-[#1e222e] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-500 text-slate-950 font-black text-lg sm:text-xl flex items-center justify-center">
                {nextSplit}
              </span>
              <span className="font-black text-white text-lg sm:text-xl">
                {SPLIT_NAMES[nextSplit].split('—')[1]?.trim() || SPLIT_NAMES[nextSplit]}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 font-medium">
              {latestSession
                ? `Último concluído: Treino ${latestSession.split} (${latestSession.date})`
                : 'Inicie sua rotina cadastrada no modelo padrão'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (latestSession) {
                navigateToWorkout(
                  latestSession.year,
                  latestSession.monthIndex,
                  latestSession.weekNumber,
                  nextSplit
                );
              } else {
                navigateToWorkout(2026, 6, 3, 'A');
              }
            }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-2.5 transition-transform active:scale-95 shadow-md shadow-amber-500/20"
          >
            <span>Acessar Treino {nextSplit}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Quick Rest Timer Steppers */}
      <div className="bg-[#15171e] rounded-3xl p-5 sm:p-6 border border-[#242834]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
            <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
              Cronômetro Rápido de Descanso
            </h2>
          </div>
          <span className="text-xs sm:text-sm text-slate-300 font-bold">1 toque</span>
        </div>

        <div className="grid grid-cols-4 gap-2.5">
          {[30, 60, 90, 120].map(secs => (
            <button
              key={secs}
              type="button"
              onClick={() => startRestTimer(secs)}
              className="py-3.5 sm:py-4 px-2 rounded-2xl bg-[#101217] hover:bg-[#1a1e28] text-slate-100 border border-[#222634] flex flex-col items-center justify-center transition-all active:scale-95 group"
            >
              <span className="text-lg sm:text-xl font-black text-white group-hover:text-amber-400 font-mono tabular-nums">
                {secs}s
              </span>
              <span className="text-xs sm:text-sm text-slate-300 font-semibold mt-0.5">
                {secs === 60 ? '1 min' : secs === 120 ? '2 min' : `${secs} seg`}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Destaques de Recordes & Evolução */}
      {highlightEvolutions.length > 0 && (
        <div className="bg-[#15171e] rounded-3xl p-5 sm:p-6 border border-[#242834]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
                Progressões em Destaque
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('evolution')}
              className="text-xs sm:text-sm text-amber-400 hover:text-amber-300 font-black flex items-center gap-1"
            >
              <span>Ver Gráficos</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {highlightEvolutions.slice(0, 4).map(item => (
              <div
                key={item.name}
                onClick={() => setActiveTab('evolution')}
                className="p-4 rounded-2xl bg-[#101217] border border-[#1f2330] flex items-center justify-between gap-3 cursor-pointer hover:border-amber-500/50 transition-colors"
              >
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200 mt-1 font-semibold">
                    <span>Inicial: {item.startWeight} kg</span>
                    <span>·</span>
                    <span className="text-emerald-400 font-bold">
                      Atual: {item.maxWeight} kg
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm sm:text-base font-black text-emerald-400 font-mono tabular-nums bg-emerald-500/15 px-3 py-1 rounded-xl border border-emerald-500/30">
                    +{item.gain} kg
                  </div>
                  <div className="text-xs sm:text-sm text-slate-300 mt-1 font-mono">
                    {item.latestDate}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Últimos Treinos Concluídos */}
      <div className="bg-[#15171e] rounded-3xl p-5 sm:p-6 border border-[#242834]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
            <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
              Últimos Treinos Registrados
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('workouts')}
            className="text-xs sm:text-sm text-amber-400 hover:text-amber-300 font-black flex items-center gap-1"
          >
            <span>Todos</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {allCompletedSessions.slice(-4).reverse().map((s, idx) => (
            <div
              key={`${s.year}-${s.monthIndex}-${s.weekNumber}-${s.split}-${idx}`}
              onClick={() => navigateToWorkout(s.year, s.monthIndex, s.weekNumber, s.split)}
              className="p-4 rounded-2xl bg-[#101217] border border-[#1e222e] hover:border-slate-600 flex items-center justify-between gap-3 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-slate-800 text-amber-400 font-black text-base sm:text-lg flex items-center justify-center border border-slate-700 shrink-0">
                  {s.split}
                </div>
                <div>
                  <div className="text-base sm:text-lg font-bold text-white">
                    Treino {s.split} · {s.monthName} {s.year}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-200 flex items-center gap-2 mt-0.5 font-mono font-medium">
                    <span>{s.weekLabel}</span>
                    <span>·</span>
                    <span>{s.date}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-slate-200 bg-slate-800 px-3 py-1.5 rounded-lg">
                  {s.exerciseCount} exs
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
