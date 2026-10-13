import React, { useState } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { WorkoutSplit, TemplateExercise } from '../types/workout';
import { SPLIT_NAMES } from '../data/initialData';
import {
  Layers,
  Plus,
  Copy,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  BookOpen,
  Info,
  Check
} from 'lucide-react';

interface StandardModelTabProps {
  onOpenReplicateModal: () => void;
  onOpenTutorialByName: (exerciseName: string) => void;
}

export const StandardModelTab: React.FC<StandardModelTabProps> = ({
  onOpenReplicateModal,
  onOpenTutorialByName
}) => {
  const {
    template,
    addExerciseToTemplate,
    updateExerciseInTemplate,
    removeExerciseFromTemplate,
    duplicateExerciseInTemplate,
    reorderExercisesInTemplate
  } = useWorkout();

  const [selectedSplit, setSelectedSplit] = useState<WorkoutSplit>('A');
  const [editingItem, setEditingItem] = useState<TemplateExercise | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('');
  const [notes, setNotes] = useState('');
  const [defaultSets, setDefaultSets] = useState<number | undefined>(3);
  const [defaultReps, setDefaultReps] = useState<number | undefined>(10);

  const currentList = template[selectedSplit] || [];

  const handleOpenAdd = () => {
    setEditingItem(null);
    setName('');
    setMuscleGroup('');
    setNotes('');
    setDefaultSets(3);
    setDefaultReps(10);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: TemplateExercise) => {
    setEditingItem(item);
    setName(item.name);
    setMuscleGroup(item.muscleGroup || '');
    setNotes(item.notes || '');
    setDefaultSets(item.defaultSets ?? 3);
    setDefaultReps(item.defaultReps ?? 10);
    setIsFormOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingItem) {
      updateExerciseInTemplate(selectedSplit, editingItem.id, {
        name: name.trim(),
        muscleGroup: muscleGroup.trim() || undefined,
        notes: notes.trim() || undefined,
        defaultSets,
        defaultReps
      });
    } else {
      addExerciseToTemplate(selectedSplit, {
        name: name.trim(),
        muscleGroup: muscleGroup.trim() || undefined,
        notes: notes.trim() || undefined,
        defaultSets,
        defaultReps
      });
    }

    setIsFormOpen(false);
  };

  const splits: WorkoutSplit[] = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="space-y-6 pb-24 pt-1">
      {/* Header and Hero Callout for Replicate */}
      <div className="bg-[#15171e] rounded-3xl p-5 sm:p-7 border border-[#242834] shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm sm:text-base font-black text-amber-400 mb-1.5">
              <Layers className="w-5 h-5" />
              <span>MODELO PADRÃO ABCDE</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white">
              Estrutura Base dos Treinos
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-lg font-medium leading-relaxed">
              Configure os exercícios de referência para cada divisão. Ao replicar, o aplicativo preencherá as semanas do mês com cargas vazias, preservando qualquer histórico já salvo.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenReplicateModal}
            className="px-6 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-2.5 transition-transform active:scale-95 shadow-lg shadow-amber-500/20 shrink-0"
          >
            <Sparkles className="w-5 h-5" />
            <span>Replicar modelo neste mês</span>
          </button>
        </div>
      </div>

      {/* Split Selector Tabs */}
      <div className="bg-[#15171e] rounded-3xl p-4 sm:p-5 border border-[#242834]">
        <div className="grid grid-cols-5 gap-2.5">
          {splits.map(split => {
            const isSelected = selectedSplit === split;
            const count = (template[split] || []).length;
            return (
              <button
                key={split}
                type="button"
                onClick={() => setSelectedSplit(split)}
                className={`py-3.5 sm:py-4 rounded-2xl flex flex-col items-center justify-center transition-all border ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-md shadow-amber-500/20 scale-[1.02]'
                    : 'bg-[#101217] text-slate-300 hover:text-white border-[#202432]'
                }`}
              >
                <span className="text-2xl sm:text-3xl font-black font-mono">{split}</span>
                <span
                  className={`text-xs sm:text-sm uppercase font-bold mt-1 ${
                    isSelected ? 'text-slate-950 font-black' : 'text-slate-300'
                  }`}
                >
                  {count} exs
                </span>
              </button>
            );
          })}
        </div>

        {/* Current Split Header */}
        <div className="mt-4 pt-3.5 border-t border-[#202432] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white">
              {SPLIT_NAMES[selectedSplit]}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-semibold mt-0.5">
              {currentList.length} exercícios configurados para o Treino {selectedSplit}
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 text-xs sm:text-sm font-bold border border-slate-700 transition-colors"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Adicionar Exercício</span>
          </button>
        </div>
      </div>

      {/* Exercises List in Template */}
      <div className="space-y-3.5">
        {currentList.length === 0 ? (
          <div className="bg-[#15171e] rounded-3xl p-8 border border-[#242834] text-center space-y-3">
            <p className="text-base text-slate-300 font-medium">
              Nenhum exercício cadastrado no Modelo Padrão do Treino {selectedSplit}.
            </p>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="px-6 py-3 rounded-xl bg-amber-500 text-slate-950 text-sm sm:text-base font-black"
            >
              + Adicionar primeiro exercício
            </button>
          </div>
        ) : (
          currentList.map((item, index) => (
            <div
              key={item.id}
              className="bg-[#15171e] rounded-3xl p-4 sm:p-5 border border-[#242834] flex items-center justify-between gap-3 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <span className="w-9 h-9 rounded-xl bg-[#101217] text-slate-200 font-mono text-base font-black flex items-center justify-center border border-[#222634] shrink-0">
                  {index + 1}
                </span>

                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-base sm:text-xl font-black text-white">
                      {item.name}
                    </h3>
                    {item.muscleGroup && (
                      <span className="text-xs sm:text-sm text-slate-300 font-bold">
                        · {item.muscleGroup}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200 mt-1 font-medium">
                    {item.defaultSets && item.defaultReps && (
                      <span className="font-mono text-xs sm:text-sm text-amber-300 font-bold">
                        Padrão sugerido: {item.defaultSets}×{item.defaultReps}
                      </span>
                    )}
                    {item.notes && (
                      <span className="truncate max-w-xs text-slate-300">
                        · {item.notes}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons: Move Up/Down, Tutorial, Edit, Duplicate, Delete */}
              <div className="flex items-center gap-1.5 shrink-0">
                {/* Tutorial trigger */}
                <button
                  type="button"
                  onClick={() => onOpenTutorialByName(item.name)}
                  className="w-10 h-10 rounded-xl bg-[#101217] hover:bg-slate-800 text-slate-300 hover:text-amber-400 flex items-center justify-center transition-colors"
                  title="Ver ou associar tutorial"
                >
                  <BookOpen className="w-5 h-5" />
                </button>

                {/* Move Up */}
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => reorderExercisesInTemplate(selectedSplit, index, index - 1)}
                  className="w-10 h-10 rounded-xl bg-[#101217] hover:bg-slate-800 disabled:opacity-30 text-slate-200 flex items-center justify-center transition-colors"
                  title="Mover para cima"
                >
                  <ArrowUp className="w-5 h-5" />
                </button>

                {/* Move Down */}
                <button
                  type="button"
                  disabled={index === currentList.length - 1}
                  onClick={() => reorderExercisesInTemplate(selectedSplit, index, index + 1)}
                  className="w-10 h-10 rounded-xl bg-[#101217] hover:bg-slate-800 disabled:opacity-30 text-slate-200 flex items-center justify-center transition-colors"
                  title="Mover para baixo"
                >
                  <ArrowDown className="w-5 h-5" />
                </button>

                {/* Edit */}
                <button
                  type="button"
                  onClick={() => handleOpenEdit(item)}
                  className="w-10 h-10 rounded-xl bg-[#101217] hover:bg-slate-800 text-slate-200 hover:text-white flex items-center justify-center transition-colors"
                  title="Editar"
                >
                  <Edit2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Duplicate */}
                <button
                  type="button"
                  onClick={() => duplicateExerciseInTemplate(selectedSplit, item.id)}
                  className="w-10 h-10 rounded-xl bg-[#101217] hover:bg-slate-800 text-slate-200 hover:text-white flex items-center justify-center transition-colors"
                  title="Duplicar"
                >
                  <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => removeExerciseFromTemplate(selectedSplit, item.id)}
                  className="w-10 h-10 rounded-xl bg-[#101217] hover:bg-rose-950 text-slate-400 hover:text-rose-400 flex items-center justify-center transition-colors"
                  title="Excluir"
                >
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Safety Notice regarding Template vs History */}
      <div className="bg-[#101217] rounded-2xl p-4 sm:p-5 border border-[#1e222e] flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
          <strong className="text-white font-bold">Preservação do Histórico:</strong> Modificações feitas no Modelo Padrão são referências futuras e não alteram automaticamente os treinos de meses anteriores.
        </p>
      </div>

      {/* Add / Edit Modal in Template */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#15171e] border border-[#262a38] rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <h2 className="text-lg sm:text-xl font-black text-white">
              {editingItem ? 'Editar Exercício do Modelo' : `Novo Exercício no Treino ${selectedSplit}`}
            </h2>

            <form onSubmit={handleSaveForm} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-extrabold text-slate-200 uppercase mb-1.5">
                  Nome do Exercício *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ex: Supino Inclinado, Crossover..."
                  className="w-full bg-[#101217] border border-[#232734] focus:border-amber-500 rounded-xl px-4 py-3 text-base font-bold text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-extrabold text-slate-200 uppercase mb-1.5">
                  Grupo Muscular (opcional)
                </label>
                <input
                  type="text"
                  value={muscleGroup}
                  onChange={e => setMuscleGroup(e.target.value)}
                  placeholder="Ex: Peitoral, Dorsal, Quadríceps..."
                  className="w-full bg-[#101217] border border-[#232734] focus:border-amber-500 rounded-xl px-4 py-3 text-sm sm:text-base font-medium text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs sm:text-sm font-extrabold text-slate-200 uppercase mb-1.5">
                    Séries Sugeridas
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={defaultSets ?? ''}
                    onChange={e => setDefaultSets(e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full bg-[#101217] border border-[#232734] focus:border-amber-500 rounded-xl px-4 py-2.5 text-base text-white outline-none font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-extrabold text-slate-200 uppercase mb-1.5">
                    Reps Sugeridas
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={defaultReps ?? ''}
                    onChange={e => setDefaultReps(e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full bg-[#101217] border border-[#232734] focus:border-amber-500 rounded-xl px-4 py-2.5 text-base text-white outline-none font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-extrabold text-slate-200 uppercase mb-1.5">
                  Observações Técnicas / Instruções Padrão
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Ex: Pausa isométrica de 1s no pico de contração..."
                  className="w-full bg-[#101217] border border-[#232734] focus:border-amber-500 rounded-xl px-4 py-3 text-sm sm:text-base text-white outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="flex-1 py-3.5 rounded-xl bg-slate-800 text-slate-200 text-sm font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm sm:text-base font-black shadow-md shadow-amber-500/20"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
