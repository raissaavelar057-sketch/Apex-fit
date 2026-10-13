import React, { useState } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { ExerciseTutorial } from '../types/workout';
import {
  Video,
  Plus,
  Search,
  Play,
  Edit2,
  Trash2,
  BookOpen,
  Upload,
  Check,
  X,
  ExternalLink
} from 'lucide-react';
import { TutorialDetailModal } from './TutorialDetailModal';
import { getYouTubeEmbedUrl } from '../utils/video';

export const TutorialsTab: React.FC = () => {
  const { tutorials, addTutorial, updateTutorial, deleteTutorial } = useWorkout();

  const [search, setSearch] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<string>('Todos');
  const [activeViewingTutorial, setActiveViewingTutorial] = useState<ExerciseTutorial | null>(null);

  // Add / Edit Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ExerciseTutorial | null>(null);

  // Form inputs
  const [name, setName] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('Peitoral');
  const [videoUrl, setVideoUrl] = useState('');
  const [executionNotes, setExecutionNotes] = useState('');
  const [commonMistakes, setCommonMistakes] = useState('');

  const muscleGroups = [
    'Todos',
    'Peitoral',
    'Costas',
    'Quadríceps & Glúteos',
    'Quadríceps',
    'Posterior de Coxa',
    'Ombros',
    'Bíceps',
    'Tríceps',
    'Pernas & Glúteos',
    'Core'
  ];

  const filteredTutorials = tutorials.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesMuscle =
      selectedMuscle === 'Todos' || item.muscleGroup.toLowerCase().includes(selectedMuscle.toLowerCase());
    return matchesSearch && matchesMuscle;
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setName('');
    setMuscleGroup('Peitoral');
    setVideoUrl('');
    setExecutionNotes('');
    setCommonMistakes('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (tut: ExerciseTutorial) => {
    setEditingItem(tut);
    setName(tut.name);
    setMuscleGroup(tut.muscleGroup);
    setVideoUrl(tut.videoUrl || '');
    setExecutionNotes(tut.executionNotes);
    setCommonMistakes(tut.commonMistakes || '');
    setIsFormOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (e.g. 20MB for browser memory)
    if (file.size > 25 * 1024 * 1024) {
      alert('Por favor, selecione um arquivo de vídeo menor que 25MB ou use um link do YouTube.');
      return;
    }

    const reader = new FileReader();
    reader.onload = event => {
      if (event.target?.result) {
        setVideoUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingItem) {
      updateTutorial(editingItem.id, {
        name: name.trim(),
        muscleGroup: muscleGroup.trim(),
        videoUrl: videoUrl.trim() || undefined,
        executionNotes: executionNotes.trim(),
        commonMistakes: commonMistakes.trim() || undefined
      });
    } else {
      addTutorial({
        name: name.trim(),
        muscleGroup: muscleGroup.trim(),
        videoUrl: videoUrl.trim() || undefined,
        videoType: videoUrl.includes('youtube') || videoUrl.includes('youtu.be') ? 'youtube' : 'local',
        executionNotes: executionNotes.trim(),
        commonMistakes: commonMistakes.trim() || undefined
      });
    }

    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6 pb-24 pt-1">
      {/* Header and Add button */}
      <div className="bg-[#15171e] rounded-3xl p-5 sm:p-7 border border-[#242834] shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm sm:text-base font-black text-amber-400 mb-1.5">
              <BookOpen className="w-5 h-5" />
              <span>BIBLIOTECA PESSOAL DE EXERCÍCIOS</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white">
              Tutoriais & Execução Técnica
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-lg font-medium leading-relaxed">
              Consulte vídeos do YouTube, gravações de execução e pontos chave de postura diretamente durante o treino.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-6 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-2.5 transition-transform active:scale-95 shadow-lg shadow-amber-500/20 shrink-0"
          >
            <Plus className="w-5 h-5" />
            <span>Cadastrar Novo Tutorial</span>
          </button>
        </div>

        {/* Search bar */}
        <div className="mt-4 pt-4 border-t border-[#222634] flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar exercício pelo nome..."
              className="w-full bg-[#101217] border border-[#232734] focus:border-amber-500 rounded-xl pl-11 pr-4 py-3 text-sm sm:text-base text-white placeholder-slate-500 outline-none font-medium"
            />
          </div>
        </div>

        {/* Muscle group filters */}
        <div className="flex items-center gap-2 overflow-x-auto pt-3.5 scrollbar-thin scrollbar-thumb-slate-800">
          {muscleGroups.map(group => (
            <button
              key={group}
              type="button"
              onClick={() => setSelectedMuscle(group)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-colors ${
                selectedMuscle === group
                  ? 'bg-amber-500 text-slate-950 font-black'
                  : 'bg-[#101217] text-slate-300 hover:text-white border border-[#222634]'
              }`}
            >
              {group}
            </button>
          ))}
        </div>
      </div>

      {/* Tutorials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTutorials.length === 0 ? (
          <div className="col-span-full bg-[#15171e] rounded-3xl p-8 border border-[#242834] text-center space-y-2">
            <p className="text-base text-slate-300 font-medium">
              Nenhum tutorial encontrado para os critérios pesquisados.
            </p>
          </div>
        ) : (
          filteredTutorials.map(tut => {
            const hasVideo = !!tut.videoUrl;
            return (
              <div
                key={tut.id}
                className="bg-[#15171e] rounded-3xl p-5 sm:p-6 border border-[#242834] hover:border-slate-700 transition-all flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-xs sm:text-sm font-black text-amber-400 uppercase tracking-wider">
                        {tut.muscleGroup}
                      </span>
                      <h3 className="text-lg sm:text-xl font-black text-white mt-1">
                        {tut.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(tut)}
                        className="w-9 h-9 rounded-xl bg-[#101217] hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteTutorial(tut.id)}
                        className="w-9 h-9 rounded-xl bg-[#101217] hover:bg-rose-950 text-slate-400 hover:text-rose-400 flex items-center justify-center transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-slate-200 mt-2.5 line-clamp-2 leading-relaxed font-medium">
                    {tut.executionNotes}
                  </p>
                </div>

                {/* Footer action to watch / open */}
                <div className="pt-3 border-t border-[#202432] flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-slate-300 font-semibold flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-amber-400" />
                    <span>{hasVideo ? 'Vídeo disponível' : 'Apenas texto'}</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => setActiveViewingTutorial(tut)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs sm:text-sm transition-colors border border-slate-700"
                  >
                    <Play className="w-4 h-4 fill-current text-amber-400" />
                    <span>Ver Detalhes & Vídeo</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Tutorial Viewing Modal */}
      {activeViewingTutorial && (
        <TutorialDetailModal
          isOpen={!!activeViewingTutorial}
          onClose={() => setActiveViewingTutorial(null)}
          tutorial={activeViewingTutorial}
        />
      )}

      {/* Add / Edit Tutorial Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#15171e] border border-[#262a38] rounded-3xl w-full max-w-lg p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#222634]">
              <h2 className="text-base font-bold text-white">
                {editingItem ? 'Editar Tutorial' : 'Cadastrar Tutorial de Exercício'}
              </h2>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Nome do Exercício *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ex: Supino Reto, Agachamento Búlgaro..."
                  className="w-full bg-[#101217] border border-[#232734] focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Grupo Muscular *
                </label>
                <input
                  type="text"
                  required
                  value={muscleGroup}
                  onChange={e => setMuscleGroup(e.target.value)}
                  placeholder="Ex: Peitoral, Dorsal, Quadríceps..."
                  className="w-full bg-[#101217] border border-[#232734] focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Link do YouTube (opcional)
                </label>
                <input
                  type="url"
                  value={videoUrl.startsWith('data:') ? '' : videoUrl}
                  onChange={e => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full bg-[#101217] border border-[#232734] focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Ou Enviar Arquivo de Vídeo (local)
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-amber-400 hover:file:bg-slate-700 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Instruções de Execução Técnica *
                </label>
                <textarea
                  rows={3}
                  required
                  value={executionNotes}
                  onChange={e => setExecutionNotes(e.target.value)}
                  placeholder="Passo a passo da postura correta, trajetória e respiração..."
                  className="w-full bg-[#101217] border border-[#232734] focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-white outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Erros Comuns a Evitar (opcional)
                </label>
                <textarea
                  rows={2}
                  value={commonMistakes}
                  onChange={e => setCommonMistakes(e.target.value)}
                  placeholder="Ex: Não afastar demais os cotovelos, evitar hiperextensão lombar..."
                  className="w-full bg-[#101217] border border-[#232734] focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-white outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
                >
                  Salvar Tutorial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
