import React, { useState } from 'react';
import { ExerciseRecord, WorkoutSplit } from '../types/workout';
import { useWorkout } from '../context/WorkoutContext';
import { X, Check, Dumbbell, Calendar, FileText, Copy, Sparkles, BookOpen } from 'lucide-react';

interface ExerciseEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: Omit<ExerciseRecord, 'id'>) => void;
  initialExercise?: ExerciseRecord;
  split: WorkoutSplit;
  year: number;
  monthIndex: number;
  weekNumber: number;
  defaultDate?: string;
  onOpenTutorialByName?: (exerciseName: string) => void;
}

export const ExerciseEditorModal: React.FC<ExerciseEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialExercise,
  split,
  year,
  monthIndex,
  weekNumber,
  defaultDate,
  onOpenTutorialByName
}) => {
  const { allLoggedExerciseNames, getLastLoggedExercise, template } = useWorkout();

  const [name, setName] = useState(initialExercise?.name || '');
  const [weightKg, setWeightKg] = useState<number | null>(
    initialExercise?.weightKg !== undefined ? initialExercise.weightKg : null
  );
  const [sets, setSets] = useState<number | null>(
    initialExercise?.sets !== undefined ? initialExercise.sets : 3
  );
  const [reps, setReps] = useState<number | null>(
    initialExercise?.reps !== undefined ? initialExercise.reps : 10
  );
  const [notes, setNotes] = useState(initialExercise?.notes || '');
  const [date, setDate] = useState(initialExercise?.date || defaultDate || new Date().toLocaleDateString('pt-BR'));
  const [completed, setCompleted] = useState<boolean>(initialExercise?.completed ?? false);

  if (!isOpen) return null;

  // Previous recorded performance for this exercise
  const previousRecord = name.trim()
    ? getLastLoggedExercise(name.trim(), { year, monthIndex, weekNumber, split })
    : null;

  // Template suggestions for this split
  const templateSuggestions = (template[split] || []).map(t => t.name);

  const handleApplyPrevious = () => {
    if (!previousRecord) return;
    if (previousRecord.weightKg !== null) setWeightKg(previousRecord.weightKg);
    if (previousRecord.sets !== null) setSets(previousRecord.sets);
    if (previousRecord.reps !== null) setReps(previousRecord.reps);
    if (previousRecord.notes && !notes) setNotes(previousRecord.notes);
  };

  const handleAdjustWeight = (delta: number) => {
    const current = weightKg ?? 0;
    const next = Math.max(0, current + delta);
    setWeightKg(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      weightKg,
      sets,
      reps,
      notes: notes.trim() || undefined,
      date: date.trim() || undefined,
      completed
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#15171e] border border-[#262a38] rounded-3xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#222634] flex items-center justify-between sticky top-0 bg-[#15171e]/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
              <Dumbbell className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {initialExercise ? 'Editar Exercício' : 'Novo Exercício'}
              </h2>
              <span className="text-sm sm:text-base text-slate-200 font-semibold">
                Treino {split} · Semana {weekNumber}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
          {/* Exercise Name */}
          <div>
            <label className="block text-sm sm:text-base font-extrabold text-slate-200 uppercase tracking-wider mb-2">
              Nome do Exercício *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: Supino Reto, Puxada pronada..."
              className="w-full bg-[#101217] border border-[#232734] focus:border-amber-500 rounded-xl px-4 py-3.5 text-base sm:text-lg font-bold text-white placeholder-slate-500 outline-none transition-colors"
            />

            {/* Quick template pick chips */}
            {templateSuggestions.length > 0 && !name && (
              <div className="mt-2.5 flex flex-wrap gap-2 items-center">
                <span className="text-xs sm:text-sm text-slate-300 font-bold">Sugestões:</span>
                {templateSuggestions.slice(0, 4).map(sug => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => setName(sug)}
                    className="text-xs sm:text-sm px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold transition-colors"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Previous record hint if found */}
          {previousRecord && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
              <div>
                <div className="font-extrabold text-amber-300 text-sm sm:text-base flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Último registro encontrado:</span>
                </div>
                <div className="text-slate-100 font-mono text-sm sm:text-base font-bold mt-1">
                  {previousRecord.weightKg !== null ? `${previousRecord.weightKg} kg` : 'Sem carga'} ·{' '}
                  {previousRecord.sets !== null && previousRecord.reps !== null
                    ? `${previousRecord.sets}×${previousRecord.reps}`
                    : '—'}
                  {' '}({previousRecord.date})
                </div>
              </div>
              <button
                type="button"
                onClick={handleApplyPrevious}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-black shrink-0 flex items-center gap-1.5 shadow-sm"
              >
                <Copy className="w-4 h-4" />
                <span>Usar</span>
              </button>
            </div>
          )}

          {/* Weight (Carga kg) */}
          <div className="bg-[#101217] p-4 sm:p-5 rounded-2xl border border-[#232734] space-y-3.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label className="text-sm sm:text-base font-extrabold text-slate-200 uppercase tracking-wider">
                Carga Utilizada (kg)
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setWeightKg(0)}
                  className={`text-xs sm:text-sm px-3 py-1.5 rounded-xl border transition-colors ${
                    weightKg === 0
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                      : 'bg-slate-800 text-slate-200 border-slate-700 hover:text-white font-bold'
                  }`}
                >
                  0 kg (Peso Corporal)
                </button>
                <button
                  type="button"
                  onClick={() => setWeightKg(null)}
                  className={`text-xs sm:text-sm px-3 py-1.5 rounded-xl transition-colors ${
                    weightKg === null ? 'text-amber-400 font-black' : 'text-slate-300 hover:text-white font-semibold'
                  }`}
                >
                  Deixar Vazio
                </button>
              </div>
            </div>

            {/* Big numeric display & quick adjustment steppers */}
            <div className="flex items-center gap-3">
              <input
                type="number"
                step="0.5"
                min="0"
                value={weightKg !== null ? weightKg : ''}
                onChange={e => {
                  const val = e.target.value;
                  setWeightKg(val === '' ? null : parseFloat(val));
                }}
                placeholder="Ex: 12"
                className="w-full bg-[#15171e] border border-[#2e3344] focus:border-amber-500 rounded-xl px-4 py-3.5 text-3xl sm:text-4xl font-black font-mono text-white placeholder-slate-600 outline-none"
              />
              <span className="text-lg sm:text-xl font-black text-slate-200 font-mono">kg</span>
            </div>

            {/* Rapid increment/decrement buttons */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleAdjustWeight(-5)}
                className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm sm:text-base font-mono font-black"
              >
                -5 kg
              </button>
              <button
                type="button"
                onClick={() => handleAdjustWeight(-1)}
                className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm sm:text-base font-mono font-black"
              >
                -1 kg
              </button>
              <button
                type="button"
                onClick={() => handleAdjustWeight(1)}
                className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm sm:text-base font-mono font-black"
              >
                +1 kg
              </button>
              <button
                type="button"
                onClick={() => handleAdjustWeight(5)}
                className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm sm:text-base font-mono font-black"
              >
                +5 kg
              </button>
            </div>
          </div>

          {/* Sets & Reps side by side */}
          <div className="grid grid-cols-2 gap-3.5">
            {/* Séries */}
            <div className="bg-[#101217] p-4 rounded-2xl border border-[#232734] space-y-2.5">
              <label className="text-sm sm:text-base font-extrabold text-slate-200 uppercase tracking-wider block">
                Séries
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSets(prev => (prev && prev > 1 ? prev - 1 : 1))}
                  className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xl"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={sets !== null ? sets : ''}
                  onChange={e => {
                    const val = e.target.value;
                    setSets(val === '' ? null : parseInt(val, 10));
                  }}
                  className="w-full text-center bg-[#15171e] border border-[#2e3344] focus:border-amber-500 rounded-xl py-2.5 text-2xl sm:text-3xl font-black font-mono text-white outline-none"
                />
                <button
                  type="button"
                  onClick={() => setSets(prev => (prev ? prev + 1 : 1))}
                  className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xl"
                >
                  +
                </button>
              </div>
            </div>

            {/* Repetições */}
            <div className="bg-[#101217] p-4 rounded-2xl border border-[#232734] space-y-2.5">
              <label className="text-sm sm:text-base font-extrabold text-slate-200 uppercase tracking-wider block">
                Repetições
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setReps(prev => (prev && prev > 1 ? prev - 1 : 1))}
                  className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xl"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={reps !== null ? reps : ''}
                  onChange={e => {
                    const val = e.target.value;
                    setReps(val === '' ? null : parseInt(val, 10));
                  }}
                  className="w-full text-center bg-[#15171e] border border-[#2e3344] focus:border-amber-500 rounded-xl py-2.5 text-2xl sm:text-3xl font-black font-mono text-white outline-none"
                />
                <button
                  type="button"
                  onClick={() => setReps(prev => (prev ? prev + 1 : 1))}
                  className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xl"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Date & Tutorial trigger */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-sm sm:text-base font-extrabold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Data do Registro</span>
              </label>
              <input
                type="text"
                value={date}
                onChange={e => setDate(e.target.value)}
                placeholder="DD/MM/AAAA"
                className="w-full bg-[#101217] border border-[#232734] focus:border-amber-500 rounded-xl px-4 py-3 text-base text-white outline-none font-mono font-bold"
              />
            </div>

            {onOpenTutorialByName && name.trim() && (
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => onOpenTutorialByName(name.trim())}
                  className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm sm:text-base font-bold flex items-center justify-center gap-2 border border-slate-700 transition-colors"
                >
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                  <span>Ver Tutorial do Exercício</span>
                </button>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm sm:text-base font-extrabold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Observações (opcional)</span>
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Ex: Aquecimento de 8 reps, sem bastão, foco na fase excêntrica..."
              className="w-full bg-[#101217] border border-[#232734] focus:border-amber-500 rounded-xl px-4 py-3 text-sm sm:text-base text-white placeholder-slate-500 outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Concluído Checkbox */}
          <label className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#101217] border border-[#232734] cursor-pointer">
            <input
              type="checkbox"
              checked={completed}
              onChange={e => setCompleted(e.target.checked)}
              className="w-5 h-5 rounded bg-slate-800 border-slate-600 text-amber-500 focus:ring-0"
            />
            <span className="text-sm sm:text-base font-bold text-white">
              Marcar exercício como realizado neste treino
            </span>
          </label>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-base transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-base sm:text-lg flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md shadow-amber-500/20"
            >
              <Check className="w-5 h-5" />
              <span>Salvar Exercício</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
