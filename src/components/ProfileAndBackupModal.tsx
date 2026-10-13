import React, { useState } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import {
  X,
  User,
  ShieldCheck,
  Download,
  Upload,
  RotateCcw,
  Check,
  AlertTriangle,
  Mail,
  Target
} from 'lucide-react';

interface ProfileAndBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileAndBackupModal: React.FC<ProfileAndBackupModalProps> = ({
  isOpen,
  onClose
}) => {
  const {
    userProfile,
    updateUserProfile,
    exportDataToJson,
    importDataFromJson,
    resetToInitialData,
    fontSizeMode,
    setFontSizeMode
  } = useWorkout();

  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [gymGoal, setGymGoal] = useState(userProfile.gymGoal || '');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: name.trim(),
      email: email.trim(),
      gymGoal: gymGoal.trim()
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleDownloadBackup = () => {
    const jsonStr = exportDataToJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `apexfit-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
      const content = ev.target?.result as string;
      const res = importDataFromJson(content);
      setImportStatus(res.message);
      setTimeout(() => setImportStatus(null), 4000);
    };
    reader.readAsText(file);
  };

  const handleConfirmReset = () => {
    resetToInitialData();
    setShowResetConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#15171e] border border-[#262a38] rounded-3xl w-full max-w-lg max-h-[92vh] overflow-y-auto p-5 sm:p-7 space-y-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#222634]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                Conta & Configurações
              </h2>
              <span className="text-xs sm:text-sm text-slate-300 font-medium">
                Sessão persistente do usuário
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Font Size Preferences: Directly responds to "As letras estão muito pequenas deixe maior" */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#101217] border border-[#232734] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-black text-white uppercase tracking-wider">
              Tamanho das Letras no App
            </span>
            <span className="text-xs sm:text-sm font-bold text-amber-400">
              {fontSizeMode === 'normal' ? 'Normal (18px)' : fontSizeMode === 'large' ? 'Grande (21px - Ativo)' : 'Extra Grande (24px - Ativo)'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            Ajuste o tamanho de todas as letras e números para leitura rápida e sem esforço durante o treino na academia:
          </p>
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => setFontSizeMode('normal')}
              className={`py-3 px-2 rounded-xl text-center border font-bold text-xs sm:text-sm transition-all ${
                fontSizeMode === 'normal'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-md'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              Normal
            </button>
            <button
              type="button"
              onClick={() => setFontSizeMode('large')}
              className={`py-3 px-2 rounded-xl text-center border font-bold text-xs sm:text-sm transition-all ${
                fontSizeMode === 'large'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-md'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              Grande ★
            </button>
            <button
              type="button"
              onClick={() => setFontSizeMode('extra-large')}
              className={`py-3 px-2 rounded-xl text-center border font-bold text-xs sm:text-sm transition-all ${
                fontSizeMode === 'extra-large'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-md'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              Muito Grande
            </button>
          </div>
        </div>

        {/* Security & Persistence Badge */}
        <div className="p-4 rounded-2xl bg-[#101217] border border-emerald-500/30 flex items-start gap-3.5">
          <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-black text-emerald-400 text-sm sm:text-base">
              Salvamento Automático Ativo
            </div>
            <div className="text-slate-300 text-xs sm:text-sm mt-1 leading-relaxed font-medium">
              Todos os seus treinos, cargas, observações e tutoriais ficam permanentemente protegidos na sua sessão local. Você não perde nada ao atualizar a página.
            </div>
          </div>
        </div>

        {/* Profile Settings */}
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <h3 className="text-sm font-black text-slate-200 uppercase tracking-wider">
            Dados do Perfil
          </h3>

          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-300 mb-1.5">Nome</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-[#101217] border border-[#232734] focus:border-amber-500 rounded-xl px-4 py-3 text-sm sm:text-base text-white outline-none font-bold"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-amber-400" />
              <span>E-mail</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#101217] border border-[#232734] focus:border-amber-500 rounded-xl px-4 py-3 text-sm sm:text-base text-white outline-none font-medium"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-amber-400" />
              <span>Objetivo Fitness</span>
            </label>
            <input
              type="text"
              value={gymGoal}
              onChange={e => setGymGoal(e.target.value)}
              className="w-full bg-[#101217] border border-[#232734] focus:border-amber-500 rounded-xl px-4 py-3 text-sm sm:text-base text-white outline-none font-medium"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-slate-400 font-medium">
              Membro desde: {userProfile.joinedDate}
            </span>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-black flex items-center gap-2 transition-transform active:scale-95 shadow-md shadow-amber-500/20"
            >
              {isSaved ? <Check className="w-4 h-4" /> : null}
              <span>{isSaved ? 'Salvo com Sucesso!' : 'Salvar Perfil'}</span>
            </button>
          </div>
        </form>

        {/* Backup Operations */}
        <div className="pt-4 border-t border-[#222634] space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Exportar / Importar Backup (JSON)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Export */}
            <button
              type="button"
              onClick={handleDownloadBackup}
              className="p-3 rounded-2xl bg-[#101217] hover:bg-slate-800 border border-[#222634] text-left transition-colors flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-800 group-hover:bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Exportar Backup</div>
                <div className="text-[10px] text-slate-400">Baixar arquivo .json</div>
              </div>
            </button>

            {/* Import */}
            <label className="p-3 rounded-2xl bg-[#101217] hover:bg-slate-800 border border-[#222634] text-left transition-colors flex items-center gap-3 cursor-pointer group">
              <div className="w-9 h-9 rounded-xl bg-slate-800 group-hover:bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Upload className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Importar Backup</div>
                <div className="text-[10px] text-slate-400">Restaurar de arquivo</div>
              </div>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>
          </div>

          {importStatus && (
            <div className="p-3 rounded-xl bg-slate-800 text-amber-300 text-xs font-medium">
              {importStatus}
            </div>
          )}
        </div>

        {/* Danger zone / Reset to Initial */}
        <div className="pt-4 border-t border-[#222634] space-y-2">
          {!showResetConfirm ? (
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="w-full py-2.5 rounded-xl bg-[#101217] hover:bg-rose-950/40 text-rose-400 border border-rose-900/30 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar Dados Iniciais (Maio a Setembro 2026)</span>
            </button>
          ) : (
            <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-800/40 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-rose-300 font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>Confirmar restauração inicial?</span>
              </div>
              <p className="text-rose-200/80 text-[11px]">
                Isso recarregará o histórico original de Maio a Setembro de 2026 e redefinirá os modelos padrões.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReset}
                  className="flex-1 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                >
                  Confirmar Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
