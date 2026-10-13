import React from 'react';
import { ExerciseTutorial } from '../types/workout';
import { getYouTubeEmbedUrl } from '../utils/video';
import { X, Play, AlertCircle, CheckCircle2, Video, ExternalLink } from 'lucide-react';

interface TutorialDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutorial: ExerciseTutorial | null;
}

export const TutorialDetailModal: React.FC<TutorialDetailModalProps> = ({
  isOpen,
  onClose,
  tutorial
}) => {
  if (!isOpen || !tutorial) return null;

  const embedUrl = getYouTubeEmbedUrl(tutorial.videoUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#15171e] border border-[#262a38] rounded-3xl w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#222634] flex items-center justify-between sticky top-0 bg-[#15171e]/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {tutorial.name}
              </h2>
              <span className="text-[11px] text-amber-400 font-semibold">
                {tutorial.muscleGroup}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Player Area */}
        <div className="p-4 sm:p-5 space-y-4">
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-[#222634] shadow-inner">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={`Tutorial de ${tutorial.name}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : tutorial.videoUrl && tutorial.videoUrl.startsWith('data:') ? (
              <video
                src={tutorial.videoUrl}
                controls
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 p-4 text-center">
                <Play className="w-10 h-10 mb-2 stroke-1 text-slate-600" />
                <p className="text-xs text-slate-400 font-medium">
                  {tutorial.videoUrl ? 'Link de vídeo cadastrado' : 'Sem vídeo cadastrado'}
                </p>
                {tutorial.videoUrl && (
                  <a
                    href={tutorial.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 text-xs text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <span>Abrir link externo</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Execution Cues */}
          <div className="space-y-3">
            <div className="bg-[#101217] p-4 rounded-2xl border border-[#222634] space-y-1.5">
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Instruções de Execução Correta</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {tutorial.executionNotes}
              </p>
            </div>

            {/* Common Mistakes if available */}
            {tutorial.commonMistakes && (
              <div className="bg-[#101217] p-4 rounded-2xl border border-[#222634] space-y-1.5">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  <span>Erros Comuns a Evitar</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {tutorial.commonMistakes}
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors"
          >
            Fechar Tutorial
          </button>
        </div>
      </div>
    </div>
  );
};
