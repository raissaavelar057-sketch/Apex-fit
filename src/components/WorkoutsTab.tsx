import React, { useState } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { WorkoutSplit, ExerciseRecord } from '../types/workout';
import { MONTH_NAMES, SPLIT_NAMES } from '../data/initialData';
import {
  Calendar,
  Plus,
  Copy,
  Trash2,
  Edit2,
  CheckCircle2,
  Circle,
  Dumbbell,
  BookOpen,
  ArrowUpDown,
  Sparkles,
  ChevronRight,
  Layers,
  History
} from 'lucide-react';
import { ExerciseEditorModal } from './ExerciseEditorModal';

interface WorkoutsTabProps {
  onOpenReplicateModal: (year: number, monthIndex: number) => void;
  onOpenTutorialByName: (name: string) => void;
}

export const WorkoutsTab: React.FC<WorkoutsTabProps> = ({
  onOpenReplicateModal,
  onOpenTutorialByName
}) => {
  const {
    years,
    activeYear,
    setActiveYear,
    activeMonth,
    setActiveMonth,
    activeWeek,
    setActiveWeek,
    activeSplit,
    setActiveSplit,
    addExtraWeek,
    updateWorkoutSession,
    addExerciseToWorkout,
    updateExerciseInWorkout,
    removeExerciseFromWorkout,
    duplicateExerciseInWorkout,
    reorderExercisesInWorkout,
    getLastLoggedExercise
  } = useWorkout();

  // Modal state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<ExerciseRecord | undefined>(undefined);
  const [sessionNotesEdit, setSessionNotesEdit] = useState(false);

  // Retrieve current active year, month, week, split session
  const currentYearData = years.find(y => y.year === activeYear) || years[0];
  const currentMonthData = currentYearData?.months[activeMonth];
  const currentWeeks = currentMonthData?.weeks || [];
  const currentWeekData = currentWeeks.find(w => w.weekNumber === activeWeek) || currentWeeks[0];
  const currentSession = currentWeekData?.workouts[activeSplit] || {
    split: activeSplit,
    name: SPLIT_NAMES[activeSplit],
    exercises: [],
    completed: false
  };

  const exercises = currentSession.exercises || [];

  // Count workouts in month for indicator badge
  const countWorkoutsInMonth = (monthIdx: number) => {
    const mData = currentYearData?.months[monthIdx];
    if (!mData) return 0;
    let count = 0;
    mData.weeks.forEach(w => {
      (['A', 'B', 'C', 'D', 'E'] as WorkoutSplit[]).forEach(s => {
        if (w.workouts[s]?.exercises?.length > 0) count++;
      });
    });
    return count;
  };

  const handleOpenAdd = () => {
    setEditingExercise(undefined);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (ex: ExerciseRecord) => {
    setEditingExercise(ex);
    setIsEditorOpen(true);
  };

  const handleSaveExercise = (recordData: Omit<ExerciseRecord, 'id'>) => {
    if (editingExercise) {
      updateExerciseInWorkout(
        activeYear,
        activeMonth,
        activeWeek,
        activeSplit,
        editingExercise.id,
        recordData
      );
    } else {
      addExerciseToWorkout(activeYear, activeMonth, activeWeek, activeSplit, recordData);
    }
  };

  const handleToggleSessionComplete = () => {
    updateWorkoutSession(activeYear, activeMonth, activeWeek, activeSplit, {
      completed: !currentSession.completed
    });
  };

  const handleUpdateDate = (newDate: string) => {
    updateWorkoutSession(activeYear, activeMonth, activeWeek, activeSplit, {
      date: newDate
    });
  };

  const handleToggleExerciseCompleted = (exId: string, current: boolean = false) => {
    updateExerciseInWorkout(activeYear, activeMonth, activeWeek, activeSplit, exId, {
      completed: !current
    });
  };

  const splits: WorkoutSplit[] = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="space-y-5 pb-24 pt-1">
      {/* 1. Year & Month Selection Strip */}
      <div className="bg-[#15171e] rounded-3xl p-4 sm:p-5 border border-[#242834] shadow-lg">
        {/* Year Row */}
        <div className="flex items-center justify-between gap-3 mb-3.5 pb-3.5 border-b border-[#212532]">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            <span className="text-sm sm:text-base font-extrabold text-slate-200 uppercase tracking-wider">
              Ano
            </span>
          </div>
          <div className="flex items-center gap-2">
            {[2025, 2026, 2027].map(yr => (
              <button
                key={yr}
                type="button"
                onClick={() => setActiveYear(yr)}
                className={`px-4 py-2 rounded-xl text-sm sm:text-base font-mono font-bold transition-all ${
                  activeYear === yr
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-[#101217] text-slate-300 hover:text-white border border-[#222634]'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>

        {/* 12 Months Horizontal Scrollable Scroller */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
          {MONTH_NAMES.map((name, idx) => {
            const isSelected = activeMonth === idx;
            const count = countWorkoutsInMonth(idx);
            return (
              <button
                key={name}
                type="button"
                onClick={() => {
                  setActiveMonth(idx);
                  setActiveWeek(1);
                }}
                className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl text-sm sm:text-base font-bold shrink-0 transition-all flex items-center gap-2 select-none ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                    : 'bg-[#101217] text-slate-200 hover:text-white border border-[#202432]'
                }`}
              >
                <span>{name}</span>
                {count > 0 && (
                  <span
                    className={`text-xs sm:text-sm px-2 py-0.5 rounded-full font-mono font-bold ${
                      isSelected
                        ? 'bg-slate-950/20 text-slate-950 font-black'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Weeks Selector + Add Extra Week Button */}
      <div className="bg-[#15171e] rounded-3xl p-4 sm:p-5 border border-[#242834]">
        <div className="flex items-center justify-between gap-3 mb-3.5">
          <div className="text-sm sm:text-base font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <span>Semanas de {MONTH_NAMES[activeMonth]}</span>
          </div>

          <button
            type="button"
            onClick={() => addExtraWeek(activeYear, activeMonth)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 text-xs sm:text-sm font-extrabold border border-slate-700 transition-colors active:scale-95"
            title="Adicionar semana extra no mês (ex: Semana 5, Semana 6)"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Adicionar semana extra</span>
          </button>
        </div>

        {/* Week Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
          {currentWeeks.map(w => {
            const isSelected = activeWeek === w.weekNumber;
            let completedCount = 0;
            splits.forEach(s => {
              if (w.workouts[s]?.completed) completedCount++;
            });
            return (
              <button
                key={w.weekNumber}
                type="button"
                onClick={() => setActiveWeek(w.weekNumber)}
                className={`p-3.5 rounded-2xl text-left transition-all border ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500/80 text-white shadow-sm ring-1 ring-amber-500/40'
                    : 'bg-[#101217] border-[#202432] text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm sm:text-base font-black font-mono tracking-tight ${
                      isSelected ? 'text-amber-400' : 'text-slate-100'
                    }`}
                  >
                    SEMANA {w.weekNumber}
                  </span>
                  {completedCount > 0 && (
                    <span className="text-xs sm:text-sm text-emerald-400 font-mono font-bold">
                      {completedCount}/5
                    </span>
                  )}
                </div>
                <div className="text-xs sm:text-sm text-slate-300 mt-1 font-semibold">
                  Treinos ABCDE
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. ABCDE Split Selector */}
      <div className="bg-[#15171e] rounded-3xl p-4 sm:p-5 border border-[#242834]">
        <div className="flex items-center justify-between gap-3 mb-3.5">
          <span className="text-sm sm:text-base font-extrabold text-slate-200 uppercase tracking-wider">
            Divisão do Treino (Livre Escolha)
          </span>
          <button
            type="button"
            onClick={() => onOpenReplicateModal(activeYear, activeMonth)}
            className="flex items-center gap-1.5 text-xs sm:text-sm text-amber-400 hover:text-amber-300 font-extrabold"
          >
            <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Replicar Modelo Padrão</span>
          </button>
        </div>

        {/* 5 Big Buttons for A, B, C, D, E */}
        <div className="grid grid-cols-5 gap-2.5">
          {splits.map(splitKey => {
            const isSelected = activeSplit === splitKey;
            const sessionObj = currentWeekData?.workouts[splitKey];
            const hasExercises = sessionObj?.exercises?.length > 0;
            const isDone = sessionObj?.completed;

            return (
              <button
                key={splitKey}
                type="button"
                onClick={() => setActiveSplit(splitKey)}
                className={`py-3.5 sm:py-4 px-1 rounded-2xl flex flex-col items-center justify-center transition-all border ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-lg shadow-amber-500/20 scale-[1.03]'
                    : isDone
                    ? 'bg-emerald-950/40 text-emerald-300 border-emerald-700/60'
                    : hasExercises
                    ? 'bg-[#101217] text-white border-slate-700'
                    : 'bg-[#101217] text-slate-400 border-[#202432]'
                }`}
              >
                <span className="text-2xl sm:text-3xl font-black font-mono">
                  {splitKey}
                </span>
                <span
                  className={`text-xs sm:text-sm mt-1 truncate max-w-full uppercase font-bold ${
                    isSelected ? 'text-slate-950 font-black' : 'text-slate-300'
                  }`}
                >
                  {hasExercises ? `${sessionObj.exercises.length} exs` : 'Vazio'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Split Title description banner */}
        <div className="mt-4 pt-3.5 border-t border-[#202432] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-white">
              {SPLIT_NAMES[activeSplit]}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-semibold mt-0.5">
              {MONTH_NAMES[activeMonth]} {activeYear} · SEMANA {activeWeek}
            </p>
          </div>

          <button
            type="button"
            onClick={handleToggleSessionComplete}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all border ${
              currentSession.completed
                ? 'bg-emerald-500/25 text-emerald-300 border-emerald-500/50'
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:text-white'
            }`}
          >
            {currentSession.completed ? (
              <CheckCircle2 className="w-5 h-5 fill-emerald-500/25" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
            <span>{currentSession.completed ? 'Treino Feito' : 'Marcar Feito'}</span>
          </button>
        </div>
      </div>

      {/* 4. Session Date & Meta Bar */}
      <div className="bg-[#15171e] rounded-2xl p-3.5 sm:px-4 sm:py-3.5 border border-[#242834] flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2.5">
          <Calendar className="w-5 h-5 text-amber-400" />
          <span className="text-slate-200 font-bold text-sm sm:text-base">Data realizada:</span>
          <input
            type="text"
            value={currentSession.date || ''}
            onChange={e => handleUpdateDate(e.target.value)}
            placeholder="Ex: 15/07/2026"
            className="bg-[#101217] border border-[#232734] focus:border-amber-500 rounded-lg px-3.5 py-2 text-white font-mono text-sm sm:text-base outline-none w-40"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-sm shadow-amber-500/20 transition-transform active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>Adicionar Exercício</span>
          </button>
        </div>
      </div>

      {/* 5. Exercises List */}
      <div className="space-y-3">
        {exercises.length === 0 ? (
          <div className="bg-[#15171e] rounded-3xl p-8 border border-[#242834] text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <Dumbbell className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                Nenhum exercício registrado nesta divisão
              </h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Você pode adicionar exercícios manualmente ou replicar os exercícios do Modelo Padrão neste mês.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleOpenAdd}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-transform active:scale-95"
              >
                + Adicionar Exercício
              </button>
              <button
                type="button"
                onClick={() => onOpenReplicateModal(activeYear, activeMonth)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
              >
                Replicar Modelo Padrão
              </button>
            </div>
          </div>
        ) : (
          exercises.map((ex, index) => {
            const previousLog = getLastLoggedExercise(ex.name, {
              year: activeYear,
              monthIndex: activeMonth,
              weekNumber: activeWeek,
              split: activeSplit
            });

            const hasWeight = ex.weightKg !== null;
            const isZeroWeight = ex.weightKg === 0;
            const hasReps = ex.sets !== null && ex.reps !== null;

            return (
              <div
                key={ex.id}
                className={`bg-[#15171e] rounded-3xl p-4 sm:p-5 border transition-all ${
                  ex.completed
                    ? 'border-emerald-500/30 bg-[#15171e]'
                    : 'border-[#242834] hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left: Check status + Exercise Name */}
                  <div className="flex items-start gap-3.5">
                    <button
                      type="button"
                      onClick={() => handleToggleExerciseCompleted(ex.id, ex.completed)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        ex.completed
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-500 hover:text-white'
                      }`}
                      title={ex.completed ? 'Marcar como não concluído' : 'Marcar como concluído'}
                    >
                      <CheckCircle2 className="w-5 h-5 fill-current" />
                    </button>

                      <div>
                      <div className="flex items-center gap-2.5">
                        <h4 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                          {ex.name}
                        </h4>
                        {/* Quick link to tutorial */}
                        <button
                          type="button"
                          onClick={() => onOpenTutorialByName(ex.name)}
                          className="w-7 h-7 rounded-lg text-slate-400 hover:text-amber-400 transition-colors flex items-center justify-center"
                          title="Ver tutorial de execução"
                        >
                          <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>

                      {/* Previous record hint */}
                      {previousLog && (
                        <div className="text-sm sm:text-base text-slate-200 flex items-center gap-1.5 mt-1.5 font-medium">
                          <History className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>
                            Anterior:{' '}
                            <strong className="text-amber-300 font-mono font-black">
                              {previousLog.weightKg !== null ? `${previousLog.weightKg} kg` : '—'}
                            </strong>{' '}
                            <span className="text-slate-300">
                              ({previousLog.sets && previousLog.reps ? `${previousLog.sets}×${previousLog.reps}` : '—'})
                            </span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Actions: Edit, Duplicate, Remove */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(ex)}
                      className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white flex items-center justify-center transition-colors"
                      title="Editar exercício"
                    >
                      <Edit2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => duplicateExerciseInWorkout(activeYear, activeMonth, activeWeek, activeSplit, ex.id)}
                      className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white flex items-center justify-center transition-colors"
                      title="Duplicar exercício"
                    >
                      <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeExerciseFromWorkout(activeYear, activeMonth, activeWeek, activeSplit, ex.id)}
                      className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 flex items-center justify-center transition-colors"
                      title="Excluir exercício"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>

                {/* Performance Pill Metrics (Weight + Sets x Reps) */}
                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-[#1f2330]">
                  {/* Carga */}
                  <div
                    onClick={() => handleOpenEdit(ex)}
                    className="bg-[#101217] p-3.5 sm:p-4 rounded-2xl border border-[#202432] cursor-pointer hover:border-amber-500/50 transition-colors"
                  >
                    <div className="text-xs sm:text-sm font-extrabold text-slate-300 uppercase tracking-wider">
                      Carga Utilizada
                    </div>
                    <div className="text-xl sm:text-3xl font-black font-mono text-white mt-1 tabular-nums">
                      {isZeroWeight ? (
                        <span className="text-amber-400">0 kg (Corporal)</span>
                      ) : hasWeight ? (
                        `${ex.weightKg} kg`
                      ) : (
                        <span className="text-slate-400 font-sans text-base sm:text-lg font-bold">Vazio (—)</span>
                      )}
                    </div>
                  </div>

                  {/* Séries x Reps */}
                  <div
                    onClick={() => handleOpenEdit(ex)}
                    className="bg-[#101217] p-3.5 sm:p-4 rounded-2xl border border-[#202432] cursor-pointer hover:border-amber-500/50 transition-colors"
                  >
                    <div className="text-xs sm:text-sm font-extrabold text-slate-300 uppercase tracking-wider">
                      Séries × Repetições
                    </div>
                    <div className="text-xl sm:text-3xl font-black font-mono text-white mt-1 tabular-nums">
                      {hasReps ? (
                        `${ex.sets} × ${ex.reps}`
                      ) : (
                        <span className="text-slate-400 font-sans text-base sm:text-lg font-bold">Vazio (—)</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Notes if any */}
                {ex.notes && (
                  <div className="mt-3.5 px-4 py-3 rounded-xl bg-[#101217] border border-[#1e222e] text-sm sm:text-base text-amber-200/95 font-sans leading-relaxed">
                    <strong className="text-amber-400 font-extrabold mr-1.5">Obs:</strong>
                    {ex.notes}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Floating Add Exercise for quick thumb reach */}
      {exercises.length > 0 && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={handleOpenAdd}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#15171e] hover:bg-[#1c202a] text-amber-400 border border-amber-500/40 text-base sm:text-lg font-black flex items-center justify-center gap-2.5 transition-transform active:scale-95 shadow-md"
          >
            <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
            <span>Adicionar Exercício no Treino {activeSplit}</span>
          </button>
        </div>
      )}

      {/* Exercise Editor Modal */}
      {isEditorOpen && (
        <ExerciseEditorModal
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          onSave={handleSaveExercise}
          initialExercise={editingExercise}
          split={activeSplit}
          year={activeYear}
          monthIndex={activeMonth}
          weekNumber={activeWeek}
          defaultDate={currentSession.date}
          onOpenTutorialByName={onOpenTutorialByName}
        />
      )}
    </div>
  );
};
