import React, { useState } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { MONTH_NAMES } from '../data/initialData';
import { X, Check, Sparkles, ShieldCheck, Info } from 'lucide-react';

interface ReplicateModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialYear?: number;
  initialMonthIndex?: number;
}

export const ReplicateModal: React.FC<ReplicateModalProps> = ({
  isOpen,
  onClose,
  initialYear = 2026,
  initialMonthIndex = 6
}) => {
  const { replicateTemplateToMonth, activeYear, activeMonth } = useWorkout();

  const [targetYear, setTargetYear] = useState<number>(initialYear);
  const [targetMonth, setTargetMonth] = useState<number>(initialMonthIndex);
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExecuteReplication = () => {
    const res = replicateTemplateToMonth(targetYear, targetMonth);
    setResultMessage(res.message);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#15171e] border border-[#262a38] rounded-3xl w-full max-w-md p-5 space-y-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#212532]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Replicar Modelo no Mês
              </h2>
              <span className="text-[11px] text-slate-400">
                Preenchimento inteligente ABCDE
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

        {resultMessage ? (
          <div className="space-y-4 py-2">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs leading-relaxed flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-emerald-400 font-bold mb-1">
                  Operação concluída!
                </strong>
                {resultMessage}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
            >
              OK, Entendido
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Year & Month Picker */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Ano Alvo
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[2025, 2026, 2027].map(yr => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => setTargetYear(yr)}
                      className={`py-2 rounded-xl text-xs font-mono font-bold border transition-colors ${
                        targetYear === yr
                          ? 'bg-amber-500 text-slate-950 border-amber-400'
                          : 'bg-[#101217] text-slate-400 border-[#222634]'
                      }`}
                    >
                      {yr}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Mês Alvo
                </label>
                <select
                  value={targetMonth}
                  onChange={e => setTargetMonth(parseInt(e.target.value, 10))}
                  className="w-full bg-[#101217] border border-[#232734] focus:border-amber-500 rounded-xl px-3 py-2.5 text-xs text-white outline-none font-medium"
                >
                  {MONTH_NAMES.map((name, idx) => (
                    <option key={name} value={idx}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Safety Guarantee Callout */}
            <div className="p-3.5 rounded-2xl bg-[#101217] border border-[#202432] space-y-2 text-xs text-slate-400 leading-relaxed">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Info className="w-3.5 h-3.5" />
                <span>Como funciona a replicação:</span>
              </div>
              <ul className="space-y-1 text-[11px] list-disc list-inside">
                <li>Preenche os treinos ABCDE de todas as semanas de <strong>{MONTH_NAMES[targetMonth]} de {targetYear}</strong>.</li>
                <li>Campos de carga, séries e repetições começam <strong>vazios</strong> para você preencher treino a treino.</li>
                <li><strong>Preserva todos os dados existentes:</strong> nenhum exercício ou carga já preenchida será apagado. Apenas adiciona os exercícios ausentes.</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleExecuteReplication}
                className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-transform"
              >
                <Check className="w-4 h-4" />
                <span>Replicar Agora</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
