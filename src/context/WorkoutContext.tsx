import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  ExerciseRecord,
  ExerciseTutorial,
  MonthData,
  TemplateExercise,
  UserProfile,
  WeekData,
  WorkoutSession,
  WorkoutSplit,
  WorkoutTemplate,
  YearData
} from '../types/workout';
import {
  DEFAULT_TEMPLATE,
  DEFAULT_USER,
  MONTH_NAMES,
  SPLIT_NAMES,
  buildInitial2026Data,
  createEmptyWeek,
  createEmptyYear,
  createEmptyWorkoutSession
} from '../data/initialData';
import { INITIAL_TUTORIALS } from '../data/initialTutorials';
import { playRestTimerBeep } from '../utils/audio';

export type ActiveTab = 'home' | 'workouts' | 'template' | 'evolution' | 'tutorials';

export interface ExerciseHistoryEntry {
  exerciseId: string;
  exerciseName: string;
  year: number;
  monthIndex: number;
  monthName: string;
  weekNumber: number;
  weekLabel: string;
  split: WorkoutSplit;
  date: string;
  weightKg: number | null;
  sets: number | null;
  reps: number | null;
  notes?: string;
  completed?: boolean;
}

interface WorkoutContextType {
  // Navigation & selection
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  activeYear: number;
  setActiveYear: (year: number) => void;
  activeMonth: number; // 0-11
  setActiveMonth: (month: number) => void;
  activeWeek: number;  // 1-based
  setActiveWeek: (week: number) => void;
  activeSplit: WorkoutSplit;
  setActiveSplit: (split: WorkoutSplit) => void;

  // Data
  years: YearData[];
  template: WorkoutTemplate;
  tutorials: ExerciseTutorial[];
  userProfile: UserProfile;

  // Workout manipulations
  addExtraWeek: (year: number, monthIndex: number) => void;
  updateWorkoutSession: (
    year: number,
    monthIndex: number,
    weekNumber: number,
    split: WorkoutSplit,
    updates: Partial<WorkoutSession>
  ) => void;
  addExerciseToWorkout: (
    year: number,
    monthIndex: number,
    weekNumber: number,
    split: WorkoutSplit,
    exercise: Omit<ExerciseRecord, 'id'>
  ) => void;
  updateExerciseInWorkout: (
    year: number,
    monthIndex: number,
    weekNumber: number,
    split: WorkoutSplit,
    exerciseId: string,
    updates: Partial<ExerciseRecord>
  ) => void;
  removeExerciseFromWorkout: (
    year: number,
    monthIndex: number,
    weekNumber: number,
    split: WorkoutSplit,
    exerciseId: string
  ) => void;
  duplicateExerciseInWorkout: (
    year: number,
    monthIndex: number,
    weekNumber: number,
    split: WorkoutSplit,
    exerciseId: string
  ) => void;
  reorderExercisesInWorkout: (
    year: number,
    monthIndex: number,
    weekNumber: number,
    split: WorkoutSplit,
    fromIndex: number,
    toIndex: number
  ) => void;

  // Template manipulations
  replicateTemplateToMonth: (targetYear: number, targetMonthIndex: number) => { addedCount: number; message: string };
  addExerciseToTemplate: (split: WorkoutSplit, exercise: Omit<TemplateExercise, 'id'>) => void;
  updateExerciseInTemplate: (split: WorkoutSplit, id: string, updates: Partial<TemplateExercise>) => void;
  removeExerciseFromTemplate: (split: WorkoutSplit, id: string) => void;
  duplicateExerciseInTemplate: (split: WorkoutSplit, id: string) => void;
  reorderExercisesInTemplate: (split: WorkoutSplit, fromIndex: number, toIndex: number) => void;

  // Tutorials
  addTutorial: (tutorial: Omit<ExerciseTutorial, 'id' | 'createdAt'>) => void;
  updateTutorial: (id: string, updates: Partial<ExerciseTutorial>) => void;
  deleteTutorial: (id: string) => void;

  // Analytics & History helpers
  allLoggedExerciseNames: string[];
  getExerciseHistory: (exerciseName: string, splitFilter?: WorkoutSplit | 'all') => ExerciseHistoryEntry[];
  getLastLoggedExercise: (
    exerciseName: string,
    currentContext?: { year: number; monthIndex: number; weekNumber: number; split: WorkoutSplit }
  ) => ExerciseHistoryEntry | null;

  // Rest Timer
  timerRemaining: number | null;
  timerTotal: number;
  timerRunning: boolean;
  startRestTimer: (seconds: number) => void;
  pauseRestTimer: () => void;
  resetRestTimer: () => void;

  // User Profile
  updateUserProfile: (updates: Partial<UserProfile>) => void;

  // Backup & Reset
  exportDataToJson: () => string;
  importDataFromJson: (jsonStr: string) => { success: boolean; message: string };
  resetToInitialData: () => void;

  // Quick navigation helper
  navigateToWorkout: (year: number, monthIndex: number, weekNumber: number, split: WorkoutSplit) => void;

  // Font Size scaling preference
  fontSizeMode: 'normal' | 'large' | 'extra-large';
  setFontSizeMode: (size: 'normal' | 'large' | 'extra-large') => void;
  toggleFontSize: () => void;
}

const STORAGE_KEY_YEARS = 'apexfit_years_v2';
const STORAGE_KEY_TEMPLATE = 'apexfit_template_v2';
const STORAGE_KEY_TUTORIALS = 'apexfit_tutorials_v2';
const STORAGE_KEY_USER = 'apexfit_user_v2';

const WorkoutContext = createContext<WorkoutContextType | null>(null);

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [activeYear, setActiveYear] = useState<number>(2026);
  const [activeMonth, setActiveMonth] = useState<number>(6); // Default July (Month 7, 0-indexed 6) which has rich logs
  const [activeWeek, setActiveWeek] = useState<number>(3);   // Default Week 3
  const [activeSplit, setActiveSplit] = useState<WorkoutSplit>('C');

  // Core Data
  const [years, setYears] = useState<YearData[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_YEARS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error loading years from storage, falling back to initial data', e);
    }
    const initial2026 = buildInitial2026Data();
    return [initial2026];
  });

  const [template, setTemplate] = useState<WorkoutTemplate>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_TEMPLATE);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error loading template from storage', e);
    }
    return DEFAULT_TEMPLATE;
  });

  const [tutorials, setTutorials] = useState<ExerciseTutorial[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_TUTORIALS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error loading tutorials from storage', e);
    }
    return INITIAL_TUTORIALS;
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USER);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error loading user profile from storage', e);
    }
    return DEFAULT_USER;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_YEARS, JSON.stringify(years));
    } catch (e) {
      console.error('Failed to save years to localStorage', e);
    }
  }, [years]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TEMPLATE, JSON.stringify(template));
    } catch (e) {
      console.error('Failed to save template to localStorage', e);
    }
  }, [template]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TUTORIALS, JSON.stringify(tutorials));
    } catch (e) {
      console.error('Failed to save tutorials to localStorage', e);
    }
  }, [tutorials]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userProfile));
    } catch (e) {
      console.error('Failed to save user profile to localStorage', e);
    }
  }, [userProfile]);

  // Font size scale mode ('normal', 'large', 'extra-large')
  const [fontSizeMode, setFontSizeModeState] = useState<'normal' | 'large' | 'extra-large'>(() => {
    try {
      const stored = localStorage.getItem('apexfit_font_size_v2');
      if (stored === 'normal' || stored === 'large' || stored === 'extra-large') {
        return stored;
      }
    } catch (e) {
      // ignore
    }
    return 'large'; // Default to large for immediate readability!
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-font-size', fontSizeMode);
    try {
      localStorage.setItem('apexfit_font_size_v2', fontSizeMode);
    } catch (e) {
      // ignore
    }
  }, [fontSizeMode]);

  const toggleFontSize = () => {
    setFontSizeModeState(prev => {
      if (prev === 'normal') return 'large';
      if (prev === 'large') return 'extra-large';
      return 'normal';
    });
  };

  const setFontSizeMode = (size: 'normal' | 'large' | 'extra-large') => {
    setFontSizeModeState(size);
  };

  // Rest Timer State
  const [timerRemaining, setTimerRemaining] = useState<number | null>(null);
  const [timerTotal, setTimerTotal] = useState<number>(60);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    if (!timerRunning || timerRemaining === null) return;
    if (timerRemaining <= 0) {
      setTimerRunning(false);
      playRestTimerBeep();
      return;
    }
    const interval = setInterval(() => {
      setTimerRemaining(prev => {
        if (prev === null || prev <= 1) {
          playRestTimerBeep();
          setTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning, timerRemaining]);

  const startRestTimer = (seconds: number) => {
    setTimerTotal(seconds);
    setTimerRemaining(seconds);
    setTimerRunning(true);
  };

  const pauseRestTimer = () => {
    setTimerRunning(false);
  };

  const resetRestTimer = () => {
    setTimerRunning(false);
    setTimerRemaining(null);
  };

  // Helper to ensure year and month exist
  const ensureYearAndMonth = (yearVal: number, monthIdx: number, currentYears: YearData[]): YearData[] => {
    let yearItem = currentYears.find(y => y.year === yearVal);
    if (!yearItem) {
      yearItem = createEmptyYear(yearVal);
      currentYears = [...currentYears, yearItem].sort((a, b) => a.year - b.year);
    }
    if (!yearItem.months[monthIdx]) {
      yearItem.months[monthIdx] = {
        monthIndex: monthIdx,
        monthName: MONTH_NAMES[monthIdx],
        weeks: [1, 2, 3, 4].map(w => createEmptyWeek(w))
      };
    }
    return currentYears;
  };

  // Workout manipulations
  const addExtraWeek = (year: number, monthIndex: number) => {
    setYears(prev => {
      let nextYears = ensureYearAndMonth(year, monthIndex, [...prev]);
      return nextYears.map(y => {
        if (y.year !== year) return y;
        const newMonths = y.months.map(m => {
          if (m.monthIndex !== monthIndex) return m;
          const newWeekNum = m.weeks.length + 1;
          const newWeek = createEmptyWeek(newWeekNum);
          return {
            ...m,
            weeks: [...m.weeks, newWeek]
          };
        });
        return { ...y, months: newMonths };
      });
    });
  };

  const updateWorkoutSession = (
    year: number,
    monthIndex: number,
    weekNumber: number,
    split: WorkoutSplit,
    updates: Partial<WorkoutSession>
  ) => {
    setYears(prev => {
      return prev.map(y => {
        if (y.year !== year) return y;
        return {
          ...y,
          months: y.months.map(m => {
            if (m.monthIndex !== monthIndex) return m;
            return {
              ...m,
              weeks: m.weeks.map(w => {
                if (w.weekNumber !== weekNumber) return w;
                const existing = w.workouts[split];
                return {
                  ...w,
                  workouts: {
                    ...w.workouts,
                    [split]: {
                      ...existing,
                      ...updates
                    }
                  }
                };
              })
            };
          })
        };
      });
    });
  };

  const addExerciseToWorkout = (
    year: number,
    monthIndex: number,
    weekNumber: number,
    split: WorkoutSplit,
    exercise: Omit<ExerciseRecord, 'id'>
  ) => {
    const newId = `ex-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setYears(prev => {
      return prev.map(y => {
        if (y.year !== year) return y;
        return {
          ...y,
          months: y.months.map(m => {
            if (m.monthIndex !== monthIndex) return m;
            return {
              ...m,
              weeks: m.weeks.map(w => {
                if (w.weekNumber !== weekNumber) return w;
                const session = w.workouts[split];
                return {
                  ...w,
                  workouts: {
                    ...w.workouts,
                    [split]: {
                      ...session,
                      exercises: [...session.exercises, { ...exercise, id: newId }]
                    }
                  }
                };
              })
            };
          })
        };
      });
    });
  };

  const updateExerciseInWorkout = (
    year: number,
    monthIndex: number,
    weekNumber: number,
    split: WorkoutSplit,
    exerciseId: string,
    updates: Partial<ExerciseRecord>
  ) => {
    setYears(prev => {
      return prev.map(y => {
        if (y.year !== year) return y;
        return {
          ...y,
          months: y.months.map(m => {
            if (m.monthIndex !== monthIndex) return m;
            return {
              ...m,
              weeks: m.weeks.map(w => {
                if (w.weekNumber !== weekNumber) return w;
                const session = w.workouts[split];
                return {
                  ...w,
                  workouts: {
                    ...w.workouts,
                    [split]: {
                      ...session,
                      exercises: session.exercises.map(ex =>
                        ex.id === exerciseId ? { ...ex, ...updates } : ex
                      )
                    }
                  }
                };
              })
            };
          })
        };
      });
    });
  };

  const removeExerciseFromWorkout = (
    year: number,
    monthIndex: number,
    weekNumber: number,
    split: WorkoutSplit,
    exerciseId: string
  ) => {
    setYears(prev => {
      return prev.map(y => {
        if (y.year !== year) return y;
        return {
          ...y,
          months: y.months.map(m => {
            if (m.monthIndex !== monthIndex) return m;
            return {
              ...m,
              weeks: m.weeks.map(w => {
                if (w.weekNumber !== weekNumber) return w;
                const session = w.workouts[split];
                return {
                  ...w,
                  workouts: {
                    ...w.workouts,
                    [split]: {
                      ...session,
                      exercises: session.exercises.filter(ex => ex.id !== exerciseId)
                    }
                  }
                };
              })
            };
          })
        };
      });
    });
  };

  const duplicateExerciseInWorkout = (
    year: number,
    monthIndex: number,
    weekNumber: number,
    split: WorkoutSplit,
    exerciseId: string
  ) => {
    setYears(prev => {
      return prev.map(y => {
        if (y.year !== year) return y;
        return {
          ...y,
          months: y.months.map(m => {
            if (m.monthIndex !== monthIndex) return m;
            return {
              ...m,
              weeks: m.weeks.map(w => {
                if (w.weekNumber !== weekNumber) return w;
                const session = w.workouts[split];
                const targetIdx = session.exercises.findIndex(e => e.id === exerciseId);
                if (targetIdx === -1) return w;
                const orig = session.exercises[targetIdx];
                const copy: ExerciseRecord = {
                  ...orig,
                  id: `ex-dup-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
                };
                const nextExs = [...session.exercises];
                nextExs.splice(targetIdx + 1, 0, copy);
                return {
                  ...w,
                  workouts: {
                    ...w.workouts,
                    [split]: {
                      ...session,
                      exercises: nextExs
                    }
                  }
                };
              })
            };
          })
        };
      });
    });
  };

  const reorderExercisesInWorkout = (
    year: number,
    monthIndex: number,
    weekNumber: number,
    split: WorkoutSplit,
    fromIndex: number,
    toIndex: number
  ) => {
    setYears(prev => {
      return prev.map(y => {
        if (y.year !== year) return y;
        return {
          ...y,
          months: y.months.map(m => {
            if (m.monthIndex !== monthIndex) return m;
            return {
              ...m,
              weeks: m.weeks.map(w => {
                if (w.weekNumber !== weekNumber) return w;
                const session = w.workouts[split];
                const list = [...session.exercises];
                const [moved] = list.splice(fromIndex, 1);
                list.splice(toIndex, 0, moved);
                return {
                  ...w,
                  workouts: {
                    ...w.workouts,
                    [split]: {
                      ...session,
                      exercises: list
                    }
                  }
                };
              })
            };
          })
        };
      });
    });
  };

  // Replicar Modelo Padrão neste mês
  // Regra fundamental:
  // - Preenche automaticamente os treinos ABCDE de todas as semanas do mês selecionado com os exercícios cadastrados.
  // - Carga, séries e repetições começam vazios (null), para preenchimento independente.
  // - A replicação NÃO apaga informações já registradas! Preserva dados existentes e adiciona apenas exercícios ausentes.
  // - Alterações posteriores no modelo não afetam histórico anterior.
  const replicateTemplateToMonth = (targetYear: number, targetMonthIndex: number) => {
    let addedCount = 0;
    const splits: WorkoutSplit[] = ['A', 'B', 'C', 'D', 'E'];

    setYears(prev => {
      const nextYears = ensureYearAndMonth(targetYear, targetMonthIndex, [...prev]);
      return nextYears.map(y => {
        if (y.year !== targetYear) return y;
        return {
          ...y,
          months: y.months.map(m => {
            if (m.monthIndex !== targetMonthIndex) return m;
            return {
              ...m,
              weeks: m.weeks.map(w => {
                const updatedWorkouts = { ...w.workouts };

                splits.forEach(split => {
                  const currentSession = updatedWorkouts[split] || createEmptyWorkoutSession(split);
                  const templateExercises = template[split] || [];
                  const existingExercises = [...currentSession.exercises];
                  const existingNamesLower = new Set(
                    existingExercises.map(e => e.name.trim().toLowerCase())
                  );

                  const missingExercises: ExerciseRecord[] = [];
                  templateExercises.forEach(tmpl => {
                    const normName = tmpl.name.trim().toLowerCase();
                    if (!existingNamesLower.has(normName)) {
                      missingExercises.push({
                        id: `rep-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
                        name: tmpl.name,
                        weightKg: null,
                        sets: null,
                        reps: null,
                        notes: tmpl.notes || '',
                        completed: false
                      });
                      addedCount++;
                    }
                  });

                  updatedWorkouts[split] = {
                    ...currentSession,
                    name: currentSession.name || SPLIT_NAMES[split],
                    exercises: [...existingExercises, ...missingExercises]
                  };
                });

                return {
                  ...w,
                  workouts: updatedWorkouts
                };
              })
            };
          })
        };
      });
    });

    return {
      addedCount,
      message:
        addedCount > 0
          ? `Modelo replicado com sucesso! ${addedCount} novos exercícios foram adicionados preservando os dados já preenchidos.`
          : `Todas as semanas deste mês já possuem os exercícios do Modelo Padrão. Nenhum dado foi sobrescrito.`
    };
  };

  // Template manipulations
  const addExerciseToTemplate = (split: WorkoutSplit, exercise: Omit<TemplateExercise, 'id'>) => {
    const newId = `tmpl-${split.toLowerCase()}-${Date.now()}`;
    setTemplate(prev => ({
      ...prev,
      [split]: [...prev[split], { ...exercise, id: newId }]
    }));
  };

  const updateExerciseInTemplate = (split: WorkoutSplit, id: string, updates: Partial<TemplateExercise>) => {
    setTemplate(prev => ({
      ...prev,
      [split]: prev[split].map(item => (item.id === id ? { ...item, ...updates } : item))
    }));
  };

  const removeExerciseFromTemplate = (split: WorkoutSplit, id: string) => {
    setTemplate(prev => ({
      ...prev,
      [split]: prev[split].filter(item => item.id !== id)
    }));
  };

  const duplicateExerciseInTemplate = (split: WorkoutSplit, id: string) => {
    setTemplate(prev => {
      const list = prev[split];
      const idx = list.findIndex(i => i.id === id);
      if (idx === -1) return prev;
      const copy: TemplateExercise = {
        ...list[idx],
        id: `tmpl-${split.toLowerCase()}-dup-${Date.now()}`,
        name: `${list[idx].name}`
      };
      const updated = [...list];
      updated.splice(idx + 1, 0, copy);
      return { ...prev, [split]: updated };
    });
  };

  const reorderExercisesInTemplate = (split: WorkoutSplit, fromIndex: number, toIndex: number) => {
    setTemplate(prev => {
      const list = [...prev[split]];
      const [moved] = list.splice(fromIndex, 1);
      list.splice(toIndex, 0, moved);
      return { ...prev, [split]: list };
    });
  };

  // Tutorial manipulations
  const addTutorial = (tutorial: Omit<ExerciseTutorial, 'id' | 'createdAt'>) => {
    const newId = `tut-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newEntry: ExerciseTutorial = {
      ...tutorial,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTutorials(prev => [newEntry, ...prev]);
  };

  const updateTutorial = (id: string, updates: Partial<ExerciseTutorial>) => {
    setTutorials(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTutorial = (id: string) => {
    setTutorials(prev => prev.filter(t => t.id !== id));
  };

  // Profile
  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  // Analytics Helpers
  const allLoggedExerciseNames = useMemo(() => {
    const namesSet = new Set<string>();
    // Collect from workouts
    years.forEach(y => {
      y.months.forEach(m => {
        m.weeks.forEach(w => {
          Object.values(w.workouts).forEach(session => {
            session.exercises.forEach(ex => {
              if (ex.name && ex.name.trim()) {
                namesSet.add(ex.name.trim());
              }
            });
          });
        });
      });
    });
    // Collect from templates
    Object.values(template).forEach(list => {
      list.forEach(t => {
        if (t.name && t.name.trim()) namesSet.add(t.name.trim());
      });
    });
    return Array.from(namesSet).sort((a, b) => a.localeCompare(b));
  }, [years, template]);

  const getExerciseHistory = (exerciseName: string, splitFilter: WorkoutSplit | 'all' = 'all'): ExerciseHistoryEntry[] => {
    if (!exerciseName) return [];
    const targetNorm = exerciseName.trim().toLowerCase();
    const results: ExerciseHistoryEntry[] = [];

    years.forEach(y => {
      y.months.forEach(m => {
        m.weeks.forEach(w => {
          (Object.keys(w.workouts) as WorkoutSplit[]).forEach(splitKey => {
            if (splitFilter !== 'all' && splitKey !== splitFilter) return;
            const session = w.workouts[splitKey];
            session.exercises.forEach(ex => {
              if (ex.name.trim().toLowerCase() === targetNorm) {
                results.push({
                  exerciseId: ex.id,
                  exerciseName: ex.name,
                  year: y.year,
                  monthIndex: m.monthIndex,
                  monthName: m.monthName,
                  weekNumber: w.weekNumber,
                  weekLabel: w.label,
                  split: splitKey,
                  date: ex.date || session.date || `${w.label} - ${m.monthName} ${y.year}`,
                  weightKg: ex.weightKg,
                  sets: ex.sets,
                  reps: ex.reps,
                  notes: ex.notes,
                  completed: ex.completed
                });
              }
            });
          });
        });
      });
    });

    // Sort chronologically: year, then monthIndex, then weekNumber
    return results.sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      if (a.monthIndex !== b.monthIndex) return a.monthIndex - b.monthIndex;
      return a.weekNumber - b.weekNumber;
    });
  };

  const getLastLoggedExercise = (
    exerciseName: string,
    currentContext?: { year: number; monthIndex: number; weekNumber: number; split: WorkoutSplit }
  ): ExerciseHistoryEntry | null => {
    const history = getExerciseHistory(exerciseName, 'all');
    if (!history.length) return null;

    // Filter to only entries with logged weight or reps
    const loggedEntries = history.filter(h => h.weightKg !== null || (h.sets !== null && h.reps !== null));
    if (!loggedEntries.length) return null;

    if (!currentContext) {
      return loggedEntries[loggedEntries.length - 1];
    }

    // Look for the entry immediately preceding currentContext
    const prior = loggedEntries.filter(h => {
      if (h.year < currentContext.year) return true;
      if (h.year > currentContext.year) return false;
      if (h.monthIndex < currentContext.monthIndex) return true;
      if (h.monthIndex > currentContext.monthIndex) return false;
      return h.weekNumber < currentContext.weekNumber;
    });

    if (prior.length > 0) {
      return prior[prior.length - 1];
    }

    // Fallback: the most recent valid logged entry
    return loggedEntries[loggedEntries.length - 1];
  };

  // Export / Import
  const exportDataToJson = () => {
    const payload = {
      version: 2,
      exportDate: new Date().toISOString(),
      user: userProfile,
      template,
      tutorials,
      years
    };
    return JSON.stringify(payload, null, 2);
  };

  const importDataFromJson = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!parsed || typeof parsed !== 'object') {
        return { success: false, message: 'Arquivo JSON inválido.' };
      }
      if (Array.isArray(parsed.years)) {
        setYears(parsed.years);
      }
      if (parsed.template && typeof parsed.template === 'object') {
        setTemplate(parsed.template);
      }
      if (Array.isArray(parsed.tutorials)) {
        setTutorials(parsed.tutorials);
      }
      if (parsed.user && typeof parsed.user === 'object') {
        setUserProfile(parsed.user);
      }
      return { success: true, message: 'Dados importados com sucesso!' };
    } catch (e: unknown) {
      return { success: false, message: `Erro ao importar: ${(e as Error).message}` };
    }
  };

  const resetToInitialData = () => {
    localStorage.removeItem(STORAGE_KEY_YEARS);
    localStorage.removeItem(STORAGE_KEY_TEMPLATE);
    localStorage.removeItem(STORAGE_KEY_TUTORIALS);
    localStorage.removeItem(STORAGE_KEY_USER);

    setYears([buildInitial2026Data()]);
    setTemplate(DEFAULT_TEMPLATE);
    setTutorials(INITIAL_TUTORIALS);
    setUserProfile(DEFAULT_USER);
    setActiveYear(2026);
    setActiveMonth(6);
    setActiveWeek(3);
    setActiveSplit('C');
  };

  const navigateToWorkout = (year: number, monthIndex: number, weekNumber: number, split: WorkoutSplit) => {
    setActiveYear(year);
    setActiveMonth(monthIndex);
    setActiveWeek(weekNumber);
    setActiveSplit(split);
    setActiveTab('workouts');
  };

  return (
    <WorkoutContext.Provider
      value={{
        activeTab,
        setActiveTab,
        activeYear,
        setActiveYear,
        activeMonth,
        setActiveMonth,
        activeWeek,
        setActiveWeek,
        activeSplit,
        setActiveSplit,
        years,
        template,
        tutorials,
        userProfile,
        addExtraWeek,
        updateWorkoutSession,
        addExerciseToWorkout,
        updateExerciseInWorkout,
        removeExerciseFromWorkout,
        duplicateExerciseInWorkout,
        reorderExercisesInWorkout,
        replicateTemplateToMonth,
        addExerciseToTemplate,
        updateExerciseInTemplate,
        removeExerciseFromTemplate,
        duplicateExerciseInTemplate,
        reorderExercisesInTemplate,
        addTutorial,
        updateTutorial,
        deleteTutorial,
        allLoggedExerciseNames,
        getExerciseHistory,
        getLastLoggedExercise,
        timerRemaining,
        timerTotal,
        timerRunning,
        startRestTimer,
        pauseRestTimer,
        resetRestTimer,
        updateUserProfile,
        exportDataToJson,
        importDataFromJson,
        resetToInitialData,
        navigateToWorkout,
        fontSizeMode,
        setFontSizeMode,
        toggleFontSize
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};
