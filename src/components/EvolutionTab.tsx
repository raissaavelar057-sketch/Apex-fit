import React, { useState, useMemo } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { WorkoutSplit } from '../types/workout';
import {
  TrendingUp,
  Filter,
  Calendar,
  Trophy,
  Activity,
  Search,
  ArrowUpRight,
  Info
} from 'lucide-react';

export const EvolutionTab: React.FC = () => {
  const { allLoggedExerciseNames, getExerciseHistory } = useWorkout();

  // Selected exercise (default to 'Supino Reto' which appears across multiple months and splits!)
  const [selectedExercise, setSelectedExercise] = useState<string>(() => {
    if (allLoggedExerciseNames.includes('Supino Reto')) return 'Supino Reto';
    return allLoggedExerciseNames[0] || '';
  });

  const [splitFilter, setSplitFilter] = useState<WorkoutSplit | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // Filtered exercise names for search dropdown
  const filteredExerciseList = useMemo(() => {
    return allLoggedExerciseNames.filter(name =>
      name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allLoggedExerciseNames, searchQuery]);

  // Retrieve chronological history for this exercise
  const history = useMemo(() => {
    return getExerciseHistory(selectedExercise, splitFilter);
  }, [selectedExercise, splitFilter, getExerciseHistory]);

  // Extract points that have valid registered weights (distinguishing 0kg from null)
  // CRITICAL RULE: "Os gráficos devem utilizar apenas dados realmente registrados, sem interpretar campos vazios como zero."
  const weightPoints = useMemo(() => {
    return history.filter(item => item.weightKg !== null);
  }, [history]);

  // Key stats
  const stats = useMemo(() => {
    if (weightPoints.length === 0) {
      return {
        initialWeight: null,
        currentWeight: null,
        maxWeight: null,
        weightGain: null,
        percentGain: null,
        totalEntries: history.length
      };
    }

    const first = weightPoints[0].weightKg as number;
    const last = weightPoints[weightPoints.length - 1].weightKg as number;
    const max = Math.max(...weightPoints.map(p => p.weightKg as number));
    const gain = last - first;
    const percent = first > 0 ? Math.round((gain / first) * 100) : (last > 0 ? 100 : 0);

    return {
      initialWeight: first,
      currentWeight: last,
      maxWeight: max,
      weightGain: gain,
      percentGain: percent,
      totalEntries: history.length
    };
  }, [weightPoints, history]);

  // Monthly breakdown comparison
  const monthlyComparison = useMemo(() => {
    const map = new Map<string, { monthName: string; year: number; weights: number[]; count: number }>();
    weightPoints.forEach(p => {
      const key = `${p.year}-${p.monthIndex}`;
      if (!map.has(key)) {
        map.set(key, { monthName: p.monthName, year: p.year, weights: [], count: 0 });
      }
      const entry = map.get(key)!;
      entry.weights.push(p.weightKg as number);
      entry.count++;
    });

    return Array.from(map.values()).map(item => {
      const avg = item.weights.reduce((a, b) => a + b, 0) / item.weights.length;
      const max = Math.max(...item.weights);
      return {
        label: `${item.monthName} ${item.year}`,
        avg: Math.round(avg * 10) / 10,
        max,
        count: item.count
      };
    });
  }, [weightPoints]);

  // Chart dimensions & scaling
  const chartHeight = 220;
  const chartWidth = 500;
  const paddingX = 45;
  const paddingY = 30;

  const chartData = useMemo(() => {
    if (weightPoints.length === 0) return null;

    const weights = weightPoints.map(p => p.weightKg as number);
    const minWeight = Math.min(...weights);
    const maxWeight = Math.max(...weights);
    const yMin = Math.max(0, minWeight === maxWeight ? Math.max(0, minWeight - 2) : Math.floor(minWeight));
    const yMax = minWeight === maxWeight ? maxWeight + 5 : Math.ceil(maxWeight + 2);
    const yRange = yMax - yMin || 1;

    const points = weightPoints.map((item, idx) => {
      const x =
        weightPoints.length === 1
          ? chartWidth / 2
          : paddingX + (idx / (weightPoints.length - 1)) * (chartWidth - paddingX * 2);
      const y =
        chartHeight -
        paddingY -
        (((item.weightKg as number) - yMin) / yRange) * (chartHeight - paddingY * 2);
      return {
        x,
        y,
        weight: item.weightKg,
        date: item.date,
        split: item.split,
        setsReps: item.sets && item.reps ? `${item.sets}×${item.reps}` : '—',
        notes: item.notes,
        weekLabel: item.weekLabel,
        monthName: item.monthName
      };
    });

    const pathD = points.reduce((acc, curr, i) => {
      return i === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
    }, '');

    // Area under the line for modern gradient fill
    const areaD =
      points.length > 1
        ? `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`
        : '';

    return { points, pathD, areaD, yMin, yMax };
  }, [weightPoints]);

  return (
    <div className="space-y-6 pb-24 pt-1">
      {/* Header & Exercise Selector */}
      <div className="bg-[#15171e] rounded-3xl p-5 sm:p-7 border border-[#242834] shadow-xl space-y-4">
        <div>
          <div className="flex items-center gap-2 text-sm sm:text-base font-black text-amber-400 mb-1.5">
            <TrendingUp className="w-5 h-5" />
            <span>PAINEL DE EVOLUÇÃO E CARGAS</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            Progressão de Cargas & Histórico
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-2 font-medium leading-relaxed">
            Acompanhe a curva de evolução real de cada exercício com diferenciação precisa entre peso corporal (0 kg) e campos vazios.
          </p>
        </div>

        {/* Exercise Search and Dropdown Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4 border-t border-[#222634]">
          {/* Select Exercise */}
          <div className="sm:col-span-2 space-y-2">
            <label className="text-sm font-extrabold text-slate-200 uppercase tracking-wider block">
              Selecionar Exercício
            </label>
            <div className="relative">
              <select
                value={selectedExercise}
                onChange={e => setSelectedExercise(e.target.value)}
                className="w-full bg-[#101217] border border-[#232734] focus:border-amber-500 rounded-xl px-4 py-3.5 text-base sm:text-lg font-bold text-white outline-none cursor-pointer"
              >
                {allLoggedExerciseNames.map(name => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter by Split */}
          <div className="space-y-2">
            <label className="text-sm font-extrabold text-slate-200 uppercase tracking-wider block">
              Filtrar por Treino
            </label>
            <select
              value={splitFilter}
              onChange={e => setSplitFilter(e.target.value as WorkoutSplit | 'all')}
              className="w-full bg-[#101217] border border-[#232734] focus:border-amber-500 rounded-xl px-4 py-3.5 text-base sm:text-lg font-bold text-white outline-none cursor-pointer"
            >
              <option value="all">Todos os Treinos (Geral)</option>
              <option value="A">Apenas Treino A</option>
              <option value="B">Apenas Treino B</option>
              <option value="C">Apenas Treino C</option>
              <option value="D">Apenas Treino D</option>
              <option value="E">Apenas Treino E</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* Carga Inicial */}
        <div className="bg-[#15171e] p-4 sm:p-5 rounded-2xl border border-[#242834]">
          <span className="text-xs sm:text-sm font-black text-slate-300 uppercase tracking-wider block">
            Carga Inicial
          </span>
          <div className="text-2xl sm:text-4xl font-black font-mono text-white mt-1.5 tabular-nums">
            {stats.initialWeight !== null ? `${stats.initialWeight} kg` : '—'}
          </div>
          <span className="text-xs sm:text-sm text-slate-300 font-semibold mt-1 block">
            Primeiro registro
          </span>
        </div>

        {/* Carga Atual */}
        <div className="bg-[#15171e] p-4 sm:p-5 rounded-2xl border border-[#242834]">
          <span className="text-xs sm:text-sm font-black text-slate-300 uppercase tracking-wider block">
            Carga Atual
          </span>
          <div className="text-2xl sm:text-4xl font-black font-mono text-amber-400 mt-1.5 tabular-nums">
            {stats.currentWeight !== null ? `${stats.currentWeight} kg` : '—'}
          </div>
          <span className="text-xs sm:text-sm text-slate-300 font-semibold mt-1 block">
            Mais recente
          </span>
        </div>

        {/* Recorde Pessoal (PR) */}
        <div className="bg-[#15171e] p-4 sm:p-5 rounded-2xl border border-[#242834]">
          <span className="text-xs sm:text-sm font-black text-slate-300 uppercase tracking-wider block flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Recorde (PR)</span>
          </span>
          <div className="text-2xl sm:text-4xl font-black font-mono text-emerald-400 mt-1.5 tabular-nums">
            {stats.maxWeight !== null ? `${stats.maxWeight} kg` : '—'}
          </div>
          <span className="text-xs sm:text-sm text-slate-300 font-semibold mt-1 block">
            Maior carga atingida
          </span>
        </div>

        {/* Progressão */}
        <div className="bg-[#15171e] p-4 sm:p-5 rounded-2xl border border-[#242834]">
          <span className="text-xs sm:text-sm font-black text-slate-300 uppercase tracking-wider block">
            Evolução Total
          </span>
          <div
            className={`text-2xl sm:text-4xl font-black font-mono mt-1.5 tabular-nums ${
              (stats.weightGain ?? 0) > 0
                ? 'text-emerald-400'
                : (stats.weightGain ?? 0) < 0
                ? 'text-rose-400'
                : 'text-slate-300'
            }`}
          >
            {stats.weightGain !== null
              ? `${stats.weightGain >= 0 ? '+' : ''}${stats.weightGain} kg`
              : '—'}
          </div>
          <span className="text-xs text-emerald-400 font-mono font-bold mt-1 block">
            {stats.percentGain !== null ? `(${stats.percentGain >= 0 ? '+' : ''}${stats.percentGain}%)` : ''}
          </span>
        </div>
      </div>

      {/* Interactive Progression Chart */}
      <div className="bg-[#15171e] rounded-3xl p-5 border border-[#242834] shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Curva de Progressão — {selectedExercise}
            </h2>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {weightPoints.length} medições
          </span>
        </div>

        {chartData && chartData.points.length > 0 ? (
          <div className="relative">
            <div className="w-full overflow-x-auto pb-2">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-56 min-w-[340px] overflow-visible"
              >
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
                  const y = paddingY + ratio * (chartHeight - paddingY * 2);
                  const val = Math.round(chartData.yMax - ratio * (chartData.yMax - chartData.yMin));
                  return (
                    <g key={ratio}>
                      <line
                        x1={paddingX}
                        y1={y}
                        x2={chartWidth - paddingX}
                        y2={y}
                        stroke="#222634"
                        strokeDasharray="3 3"
                        strokeWidth="1"
                      />
                      <text
                        x={paddingX - 8}
                        y={y + 3}
                        fill="#94a3b8"
                        fontSize="11"
                        textAnchor="end"
                        className="font-mono font-bold"
                      >
                        {val} kg
                      </text>
                    </g>
                  );
                })}

                {/* Shaded Area */}
                {chartData.areaD && (
                  <path d={chartData.areaD} fill="url(#areaGradient)" />
                )}

                {/* Progression Line */}
                <path
                  d={chartData.pathD}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data Points */}
                {chartData.points.map((p, idx) => {
                  const isHovered = hoveredPointIndex === idx;
                  const isZero = p.weight === 0;

                  return (
                    <g
                      key={idx}
                      className="cursor-pointer transition-transform"
                      onMouseEnter={() => setHoveredPointIndex(idx)}
                      onTouchStart={() => setHoveredPointIndex(idx)}
                    >
                      {/* Interactive Touch Target hit box */}
                      <circle cx={p.x} cy={p.y} r={18} fill="transparent" />

                      {/* Visible Point */}
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={isHovered ? 8 : 6}
                        fill={isZero ? '#38bdf8' : '#f59e0b'}
                        stroke="#0c0d10"
                        strokeWidth={2.5}
                      />

                      {/* X axis Date label */}
                      <text
                        x={p.x}
                        y={chartHeight - 6}
                        fill="#cbd5e1"
                        fontSize="11"
                        textAnchor="middle"
                        className="font-mono font-bold"
                      >
                        {p.date.split('/')[0]}/{p.date.split('/')[1] || ''}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Selected / Hovered Point Detail Callout */}
            {hoveredPointIndex !== null && chartData.points[hoveredPointIndex] && (
              <div className="mt-3.5 p-4 rounded-2xl bg-[#101217] border border-amber-500/50 text-sm flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-3.5">
                  <span className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center font-mono text-base">
                    {chartData.points[hoveredPointIndex].split}
                  </span>
                  <div>
                    <div className="text-white font-extrabold flex items-center gap-2.5 text-base">
                      <span className="font-mono text-amber-400 font-black">
                        {chartData.points[hoveredPointIndex].weight === 0
                          ? '0 kg (Peso Corporal)'
                          : `${chartData.points[hoveredPointIndex].weight} kg`}
                      </span>
                      <span>·</span>
                      <span className="text-slate-200 font-mono">
                        {chartData.points[hoveredPointIndex].setsReps}
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm text-slate-300 mt-0.5 font-medium">
                      {chartData.points[hoveredPointIndex].date} · {chartData.points[hoveredPointIndex].weekLabel} ({chartData.points[hoveredPointIndex].monthName})
                    </div>
                  </div>
                </div>

                {chartData.points[hoveredPointIndex].notes && (
                  <div className="text-xs sm:text-sm text-amber-200 bg-amber-500/15 px-3 py-1.5 rounded-xl border border-amber-500/30 max-w-sm font-medium">
                    {chartData.points[hoveredPointIndex].notes}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center bg-[#101217] rounded-2xl border border-[#202432] space-y-2">
            <p className="text-sm text-slate-300 font-medium">
              Nenhuma medição com carga numérica foi encontrada para este exercício com os filtros atuais.
            </p>
            <p className="text-xs text-slate-400">
              Exercícios com campos vazios não entram na curva gráfica, garantindo precisão matemática.
            </p>
          </div>
        )}
      </div>

      {/* Monthly Comparison */}
      {monthlyComparison.length > 1 && (
        <div className="bg-[#15171e] rounded-3xl p-5 sm:p-6 border border-[#242834] space-y-4">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
            <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
              Comparação Mês a Mês
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {monthlyComparison.map(m => (
              <div
                key={m.label}
                className="p-4 rounded-2xl bg-[#101217] border border-[#202432] space-y-2"
              >
                <div className="text-sm sm:text-base font-bold text-white truncate">
                  {m.label}
                </div>
                <div className="text-xl sm:text-2xl font-black font-mono text-amber-400">
                  Pico: {m.max} kg
                </div>
                <div className="text-xs sm:text-sm text-slate-200 font-mono font-medium">
                  Média: {m.avg} kg ({m.count} treinos)
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full Chronological Log Table */}
      <div className="bg-[#15171e] rounded-3xl p-5 sm:p-6 border border-[#242834] space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
            Histórico Detalhado de Registros
          </h2>
          <span className="text-xs sm:text-sm text-slate-300 font-mono font-bold">
            {history.length} ocorrências
          </span>
        </div>

        <div className="divide-y divide-[#202432]">
          {history.length === 0 ? (
            <p className="text-base text-slate-400 py-6 text-center">
              Nenhum registro para o filtro selecionado.
            </p>
          ) : (
            history.map((item, idx) => (
              <div
                key={`${item.exerciseId}-${idx}`}
                className="py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <span className="w-10 h-10 rounded-xl bg-slate-800 text-amber-400 font-mono text-base font-black flex items-center justify-center shrink-0">
                    {item.split}
                  </span>
                  <div>
                    <div className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      <span>{item.date}</span>
                      <span className="text-slate-500 font-normal">·</span>
                      <span className="text-slate-300 font-normal">{item.weekLabel} ({item.monthName})</span>
                    </div>
                    {item.notes && (
                      <p className="text-xs sm:text-sm text-amber-200/90 mt-1 font-medium">
                        Obs: {item.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:text-right pl-12 sm:pl-0">
                  <div>
                    <div className="text-xl sm:text-3xl font-black font-mono text-white tabular-nums">
                      {item.weightKg === 0 ? (
                        <span className="text-amber-400">0 kg (Corporal)</span>
                      ) : item.weightKg !== null ? (
                        `${item.weightKg} kg`
                      ) : (
                        <span className="text-slate-400 font-sans text-base font-bold">Vazio (—)</span>
                      )}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-200 font-mono font-bold mt-0.5">
                      {item.sets && item.reps ? `${item.sets} × ${item.reps}` : 'Séries/Reps: —'}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
