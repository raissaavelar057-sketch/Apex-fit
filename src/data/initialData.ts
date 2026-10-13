import {
  MonthData,
  WeekData,
  WorkoutSession,
  WorkoutSplit,
  WorkoutTemplate,
  YearData,
  UserProfile
} from '../types/workout';

export const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro'
];

export const SPLIT_NAMES: Record<WorkoutSplit, string> = {
  A: 'Treino A — Inferiores (Quadríceps & Adutores)',
  B: 'Treino B — Peitoral, Ombros & Tríceps',
  C: 'Treino C — Costas, Bíceps & Abdômen',
  D: 'Treino D — Posterior de Coxa, Glúteos & Panturrilha',
  E: 'Treino E — Membros Superiores & Core / Geral'
};

export const DEFAULT_TEMPLATE: WorkoutTemplate = {
  A: [
    { id: 'tmpl-a-1', name: 'Leg press 45', defaultSets: 3, defaultReps: 10, muscleGroup: 'Quadríceps', tutorialId: 'tut-leg-press-45' },
    { id: 'tmpl-a-2', name: 'Cadeira extensora', defaultSets: 3, defaultReps: 10, muscleGroup: 'Quadríceps' },
    { id: 'tmpl-a-3', name: 'Cadeira abdutora', defaultSets: 3, defaultReps: 12, muscleGroup: 'Glúteos' },
    { id: 'tmpl-a-4', name: 'Cadeira adutora', defaultSets: 3, defaultReps: 12, muscleGroup: 'Adutores' },
    { id: 'tmpl-a-5', name: 'Panturrilha sentada', defaultSets: 3, defaultReps: 12, muscleGroup: 'Panturrilha' }
  ],
  B: [
    { id: 'tmpl-b-1', name: 'Supino Reto', defaultSets: 3, defaultReps: 8, muscleGroup: 'Peitoral', tutorialId: 'tut-supino-reto' },
    { id: 'tmpl-b-2', name: 'Peck Deck', defaultSets: 3, defaultReps: 10, muscleGroup: 'Peitoral', tutorialId: 'tut-peck-deck' },
    { id: 'tmpl-b-3', name: 'Desenvolvimento ombros', defaultSets: 3, defaultReps: 8, muscleGroup: 'Ombros' },
    { id: 'tmpl-b-4', name: 'Tríceps Pulley', defaultSets: 3, defaultReps: 10, muscleGroup: 'Tríceps', tutorialId: 'tut-triceps-pulley' },
    { id: 'tmpl-b-5', name: 'Tríceps Testa', defaultSets: 3, defaultReps: 10, muscleGroup: 'Tríceps' }
  ],
  C: [
    { id: 'tmpl-c-1', name: 'Puxada pronada', defaultSets: 3, defaultReps: 10, muscleGroup: 'Costas', tutorialId: 'tut-puxada-pronada' },
    { id: 'tmpl-c-2', name: 'Remada sentada triângulo', defaultSets: 3, defaultReps: 10, muscleGroup: 'Costas', tutorialId: 'tut-remada-sentada' },
    { id: 'tmpl-c-3', name: 'Peck Deck inverso', defaultSets: 3, defaultReps: 8, muscleGroup: 'Posterior de Ombro' },
    { id: 'tmpl-c-4', name: 'Rosca Direta', defaultSets: 3, defaultReps: 12, muscleGroup: 'Bíceps', tutorialId: 'tut-rosca-direta' },
    { id: 'tmpl-c-5', name: 'Abdômen', defaultSets: 3, defaultReps: 10, muscleGroup: 'Core' }
  ],
  D: [
    { id: 'tmpl-d-1', name: 'Cadeira Flexora', defaultSets: 3, defaultReps: 12, muscleGroup: 'Posterior de Coxa', tutorialId: 'tut-cadeira-flexora' },
    { id: 'tmpl-d-2', name: 'Agachamento Búlgaro', defaultSets: 3, defaultReps: 10, muscleGroup: 'Glúteos & Quadríceps', tutorialId: 'tut-agachamento-bulgaro' },
    { id: 'tmpl-d-3', name: 'Cadeira abdutora', defaultSets: 3, defaultReps: 15, muscleGroup: 'Glúteos' },
    { id: 'tmpl-d-4', name: 'Cadeira adutora', defaultSets: 3, defaultReps: 15, muscleGroup: 'Adutores' },
    { id: 'tmpl-d-5', name: 'Panturrilha em pé', defaultSets: 3, defaultReps: 12, muscleGroup: 'Panturrilha' }
  ],
  E: [
    { id: 'tmpl-e-1', name: 'Agachamento', defaultSets: 3, defaultReps: 12, muscleGroup: 'Pernas' },
    { id: 'tmpl-e-2', name: 'Supino Reto', defaultSets: 3, defaultReps: 8, muscleGroup: 'Peitoral', tutorialId: 'tut-supino-reto' },
    { id: 'tmpl-e-3', name: 'Remada articulada', defaultSets: 3, defaultReps: 10, muscleGroup: 'Costas' },
    { id: 'tmpl-e-4', name: 'Elevação lateral', defaultSets: 3, defaultReps: 10, muscleGroup: 'Ombros', tutorialId: 'tut-elevacao-lateral' },
    { id: 'tmpl-e-5', name: 'Abdominal Infra', defaultSets: 3, defaultReps: 10, muscleGroup: 'Core' }
  ]
};

export const DEFAULT_USER: UserProfile = {
  id: 'usr-raissa',
  name: 'Raíssa Avelar',
  email: 'raissaavelar057@gmail.com',
  gymGoal: 'Hipertrofia & Progressão Constante de Cargas',
  joinedDate: 'Maio de 2026'
};

export function createEmptyWorkoutSession(split: WorkoutSplit): WorkoutSession {
  return {
    split,
    name: SPLIT_NAMES[split],
    exercises: [],
    completed: false
  };
}

export function createEmptyWeek(weekNumber: number): WeekData {
  return {
    weekNumber,
    label: `SEMANA ${weekNumber}`,
    workouts: {
      A: createEmptyWorkoutSession('A'),
      B: createEmptyWorkoutSession('B'),
      C: createEmptyWorkoutSession('C'),
      D: createEmptyWorkoutSession('D'),
      E: createEmptyWorkoutSession('E')
    }
  };
}

export function createEmptyMonth(monthIndex: number, weekCount: number = 4): MonthData {
  const weeks: WeekData[] = [];
  for (let w = 1; w <= weekCount; w++) {
    weeks.push(createEmptyWeek(w));
  }
  return {
    monthIndex,
    monthName: MONTH_NAMES[monthIndex],
    weeks
  };
}

export function createEmptyYear(year: number): YearData {
  const months: MonthData[] = [];
  for (let m = 0; m < 12; m++) {
    months.push(createEmptyMonth(m, 4));
  }
  return {
    year,
    months
  };
}

/**
 * Builds the initial 2026 data with the exact historical logs requested.
 */
export function buildInitial2026Data(): YearData {
  const yearData = createEmptyYear(2026);

  // 1. Maio 2026 (index 4)
  // SEMANA 3 — 13/05/2026
  const mayMonth = yearData.months[4];
  const mayWeek3 = mayMonth.weeks[2]; // weekNumber 3 is index 2

  // Treino C
  mayWeek3.workouts.C = {
    split: 'C',
    name: SPLIT_NAMES.C,
    date: '13/05/2026',
    completed: true,
    exercises: [
      { id: 'm26-w3-c1', name: 'Puxada pronada', weightKg: 12, sets: 3, reps: 12, notes: 'Puxada pronada com aquecimento de 8 repetições.', date: '13/05/2026', completed: true },
      { id: 'm26-w3-c2', name: 'Remada sentada triângulo', weightKg: 12, sets: 3, reps: 11, date: '13/05/2026', completed: true },
      { id: 'm26-w3-c3', name: 'Peck Deck inverso', weightKg: 4, sets: 3, reps: 8, date: '13/05/2026', completed: true },
      { id: 'm26-w3-c4', name: 'Rosca Direta', weightKg: 3, sets: 3, reps: 12, date: '13/05/2026', completed: true },
      { id: 'm26-w3-c5', name: 'Abdômen', weightKg: 3, sets: 3, reps: 8, date: '13/05/2026', completed: true }
    ]
  };

  // Treino E
  mayWeek3.workouts.E = {
    split: 'E',
    name: SPLIT_NAMES.E,
    date: '13/05/2026',
    completed: true,
    exercises: [
      { id: 'm26-w3-e1', name: 'Supino Reto', weightKg: 3, sets: 3, reps: 12, date: '13/05/2026', completed: true },
      { id: 'm26-w3-e2', name: 'Elevação lateral', weightKg: 3, sets: 3, reps: 8, date: '13/05/2026', completed: true },
      { id: 'm26-w3-e3', name: 'Abdominal Infra', weightKg: null, sets: 3, reps: 12, date: '13/05/2026', completed: true }
    ]
  };

  // 2. Julho 2026 (index 6)
  // Has Semana 5 added!
  const julMonth = yearData.months[6];
  // Add Semana 5 to July
  if (julMonth.weeks.length < 5) {
    julMonth.weeks.push(createEmptyWeek(5));
  }

  // SEMANA 3 — 15/07/2026
  const julWeek3 = julMonth.weeks[2];
  julWeek3.workouts.C = {
    split: 'C',
    name: SPLIT_NAMES.C,
    date: '15/07/2026',
    completed: true,
    exercises: [
      { id: 'j26-w3-c1', name: 'Puxada pronada', weightKg: 16, sets: 3, reps: 8, date: '15/07/2026', completed: true },
      { id: 'j26-w3-c2', name: 'Remada sentada triângulo', weightKg: 16, sets: 3, reps: 8, date: '15/07/2026', completed: true },
      { id: 'j26-w3-c3', name: 'Peck Deck inverso', weightKg: 4, sets: 3, reps: 8, date: '15/07/2026', completed: true },
      { id: 'j26-w3-c4', name: 'Rosca Direta', weightKg: 4, sets: 3, reps: 12, date: '15/07/2026', completed: true },
      { id: 'j26-w3-c5', name: 'Abdômen', weightKg: 3, sets: 3, reps: 10, date: '15/07/2026', completed: true }
    ]
  };

  julWeek3.workouts.D = {
    split: 'D',
    name: SPLIT_NAMES.D,
    date: '15/07/2026',
    completed: true,
    exercises: [
      { id: 'j26-w3-d1', name: 'Cadeira Flexora', weightKg: 16, sets: 3, reps: 12, date: '15/07/2026', completed: true },
      { id: 'j26-w3-d2', name: 'Agachamento Búlgaro', weightKg: 0, sets: 3, reps: 12, date: '15/07/2026', completed: true },
      { id: 'j26-w3-d3', name: 'Cadeira abdutora', weightKg: 20, sets: 3, reps: 12, date: '15/07/2026', completed: true },
      { id: 'j26-w3-d4', name: 'Cadeira adutora', weightKg: 20, sets: 3, reps: 12, date: '15/07/2026', completed: true },
      { id: 'j26-w3-d5', name: 'Panturrilha em pé', weightKg: 10, sets: 3, reps: 12, date: '15/07/2026', completed: true }
    ]
  };

  julWeek3.workouts.E = {
    split: 'E',
    name: SPLIT_NAMES.E,
    date: '15/07/2026',
    completed: true,
    exercises: [
      { id: 'j26-w3-e1', name: 'Agachamento', weightKg: 0, sets: 3, reps: 12, date: '15/07/2026', completed: true },
      { id: 'j26-w3-e2', name: 'Supino Reto', weightKg: 5, sets: 3, reps: 8, date: '15/07/2026', completed: true },
      { id: 'j26-w3-e3', name: 'Elevação lateral', weightKg: 4, sets: 3, reps: 8, date: '15/07/2026', completed: true },
      { id: 'j26-w3-e4', name: 'Abdominal Infra', weightKg: 0, sets: 3, reps: 12, date: '15/07/2026', completed: true }
    ]
  };

  // SEMANA 4 — 15/07/2026
  const julWeek4 = julMonth.weeks[3];
  julWeek4.workouts.B = {
    split: 'B',
    name: SPLIT_NAMES.B,
    date: '15/07/2026',
    completed: true,
    exercises: [
      { id: 'j26-w4-b1', name: 'Supino Reto', weightKg: 5, sets: 3, reps: 8, date: '15/07/2026', completed: true },
      { id: 'j26-w4-b2', name: 'Peck Deck', weightKg: 8, sets: 3, reps: 8, date: '15/07/2026', completed: true },
      { id: 'j26-w4-b3', name: 'Desenvolvimento ombros', weightKg: 3, sets: 3, reps: 5, date: '15/07/2026', completed: true },
      { id: 'j26-w4-b4', name: 'Tríceps Pulley', weightKg: 12, sets: 3, reps: 12, date: '15/07/2026', completed: true },
      { id: 'j26-w4-b5', name: 'Tríceps Testa', weightKg: 12, sets: 3, reps: 12, date: '15/07/2026', completed: true }
    ]
  };

  julWeek4.workouts.C = {
    split: 'C',
    name: SPLIT_NAMES.C,
    date: '15/07/2026',
    completed: true,
    exercises: [
      { id: 'j26-w4-c1', name: 'Puxada pronada', weightKg: 12, sets: 3, reps: 8, date: '15/07/2026', completed: true },
      { id: 'j26-w4-c2', name: 'Remada sentada triângulo', weightKg: 16, sets: 3, reps: 8, date: '15/07/2026', completed: true },
      { id: 'j26-w4-c3', name: 'Peck Deck inverso', weightKg: 4, sets: 3, reps: 8, date: '15/07/2026', completed: true },
      { id: 'j26-w4-c4', name: 'Rosca Direta', weightKg: 4, sets: 3, reps: 12, date: '15/07/2026', completed: true },
      { id: 'j26-w4-c5', name: 'Abdômen', weightKg: 5, sets: 3, reps: 8, date: '15/07/2026', completed: true }
    ]
  };

  julWeek4.workouts.D = {
    split: 'D',
    name: SPLIT_NAMES.D,
    date: '15/07/2026',
    completed: true,
    exercises: [
      { id: 'j26-w4-d1', name: 'Cadeira Flexora', weightKg: 16, sets: 3, reps: 12, date: '15/07/2026', completed: true },
      { id: 'j26-w4-d2', name: 'Agachamento Búlgaro', weightKg: 0, sets: 3, reps: 8, date: '15/07/2026', completed: true },
      { id: 'j26-w4-d3', name: 'Cadeira abdutora', weightKg: 20, sets: 3, reps: 12, date: '15/07/2026', completed: true },
      { id: 'j26-w4-d4', name: 'Cadeira adutora', weightKg: 20, sets: 3, reps: 12, date: '15/07/2026', completed: true },
      { id: 'j26-w4-d5', name: 'Panturrilha em pé', weightKg: 5, sets: 3, reps: 8, date: '15/07/2026', completed: true }
    ]
  };

  julWeek4.workouts.E = {
    split: 'E',
    name: SPLIT_NAMES.E,
    date: '15/07/2026',
    completed: true,
    exercises: [
      { id: 'j26-w4-e1', name: 'Agachamento', weightKg: 0, sets: 3, reps: 12, date: '15/07/2026', completed: true },
      { id: 'j26-w4-e2', name: 'Supino Reto', weightKg: 5, sets: 3, reps: 8, date: '15/07/2026', completed: true },
      { id: 'j26-w4-e3', name: 'Remada articulada', weightKg: 0, sets: null, reps: null, date: '15/07/2026', completed: true },
      { id: 'j26-w4-e4', name: 'Elevação lateral', weightKg: 4, sets: 3, reps: 8, date: '15/07/2026', completed: true },
      { id: 'j26-w4-e5', name: 'Abdominal Infra', weightKg: 0, sets: 3, reps: 8, date: '15/07/2026', completed: true }
    ]
  };

  // SEMANA 5 — 27/07/2026
  const julWeek5 = julMonth.weeks[4];
  julWeek5.workouts.A = {
    split: 'A',
    name: SPLIT_NAMES.A,
    date: '27/07/2026',
    completed: true,
    exercises: [
      { id: 'j26-w5-a1', name: 'Leg press 45', weightKg: 0, sets: 3, reps: 8, date: '27/07/2026', completed: true },
      { id: 'j26-w5-a2', name: 'Cadeira extensora', weightKg: 12, sets: 3, reps: 8, date: '27/07/2026', completed: true },
      { id: 'j26-w5-a3', name: 'Cadeira abdutora', weightKg: 25, sets: 3, reps: 13, date: '27/07/2026', completed: true },
      { id: 'j26-w5-a4', name: 'Cadeira adutora', weightKg: 20, sets: 3, reps: 8, date: '27/07/2026', completed: true },
      { id: 'j26-w5-a5', name: 'Panturrilha sentada', weightKg: 5, sets: 3, reps: 12, date: '27/07/2026', completed: true }
    ]
  };

  julWeek5.workouts.B = {
    split: 'B',
    name: SPLIT_NAMES.B,
    date: '27/07/2026',
    completed: true,
    exercises: [
      { id: 'j26-w5-b1', name: 'Supino Reto', weightKg: 5, sets: 3, reps: 8, date: '27/07/2026', completed: true },
      { id: 'j26-w5-b2', name: 'Peck Deck', weightKg: 8, sets: 3, reps: 3, date: '27/07/2026', completed: true },
      { id: 'j26-w5-b3', name: 'Desenvolvimento ombros', weightKg: 0, sets: 3, reps: 8, date: '27/07/2026', completed: true },
      { id: 'j26-w5-b4', name: 'Tríceps Pulley', weightKg: 12, sets: 3, reps: 12, date: '27/07/2026', completed: true },
      { id: 'j26-w5-b5', name: 'Tríceps Testa', weightKg: 12, sets: 3, reps: 8, date: '27/07/2026', completed: true }
    ]
  };

  julWeek5.workouts.C = {
    split: 'C',
    name: SPLIT_NAMES.C,
    date: '27/07/2026',
    completed: true,
    exercises: [
      { id: 'j26-w5-c1', name: 'Puxada pronada', weightKg: 12, sets: 3, reps: 12, date: '27/07/2026', completed: true },
      { id: 'j26-w5-c2', name: 'Remada sentada triângulo', weightKg: 12, sets: 3, reps: 8, date: '27/07/2026', completed: true },
      { id: 'j26-w5-c3', name: 'Peck Deck inverso', weightKg: 4, sets: 3, reps: 8, date: '27/07/2026', completed: true },
      { id: 'j26-w5-c4', name: 'Rosca Direta', weightKg: 4, sets: 3, reps: 12, date: '27/07/2026', completed: true },
      { id: 'j26-w5-c5', name: 'Abdômen', weightKg: 5, sets: 3, reps: 8, date: '27/07/2026', completed: true }
    ]
  };

  julWeek5.workouts.D = {
    split: 'D',
    name: SPLIT_NAMES.D,
    date: '27/07/2026',
    completed: true,
    exercises: [
      { id: 'j26-w5-d1', name: 'Cadeira Flexora', weightKg: 16, sets: 3, reps: 12, date: '27/07/2026', completed: true },
      { id: 'j26-w5-d2', name: 'Agachamento Búlgaro', weightKg: 0, sets: 3, reps: 8, notes: 'Agachamento Búlgaro realizado sem o bastão.', date: '27/07/2026', completed: true },
      { id: 'j26-w5-d3', name: 'Cadeira abdutora', weightKg: 20, sets: 3, reps: 12, date: '27/07/2026', completed: true },
      { id: 'j26-w5-d4', name: 'Cadeira adutora', weightKg: 20, sets: 3, reps: 20, date: '27/07/2026', completed: true },
      { id: 'j26-w5-d5', name: 'Panturrilha em pé', weightKg: 0, sets: 3, reps: 8, date: '27/07/2026', completed: true }
    ]
  };

  julWeek5.workouts.E = {
    split: 'E',
    name: SPLIT_NAMES.E,
    date: '27/07/2026',
    completed: true,
    exercises: [
      { id: 'j26-w5-e1', name: 'Agachamento', weightKg: 0, sets: 3, reps: 12, date: '27/07/2026', completed: true },
      { id: 'j26-w5-e2', name: 'Supino Reto', weightKg: 5, sets: 3, reps: 8, date: '27/07/2026', completed: true },
      { id: 'j26-w5-e3', name: 'Elevação lateral', weightKg: 4, sets: 3, reps: 8, date: '27/07/2026', completed: true },
      { id: 'j26-w5-e4', name: 'Abdominal Infra', weightKg: 5, sets: 3, reps: 8, date: '27/07/2026', completed: true }
    ]
  };

  // 3. Agosto 2026 (index 7)
  const augMonth = yearData.months[7];

  // SEMANA 1 — 03/08/2026
  const augWeek1 = augMonth.weeks[0];
  augWeek1.workouts.A = {
    split: 'A',
    name: SPLIT_NAMES.A,
    date: '03/08/2026',
    completed: true,
    exercises: [
      { id: 'a26-w1-a1', name: 'Leg press 45', weightKg: 0, sets: 3, reps: 8, date: '03/08/2026', completed: true },
      { id: 'a26-w1-a2', name: 'Cadeira extensora', weightKg: 12, sets: 3, reps: 8, date: '03/08/2026', completed: true },
      { id: 'a26-w1-a3', name: 'Cadeira abdutora', weightKg: 25, sets: 3, reps: 13, date: '03/08/2026', completed: true },
      { id: 'a26-w1-a4', name: 'Cadeira adutora', weightKg: 20, sets: 3, reps: 8, date: '03/08/2026', completed: true }
    ]
  };

  // SEMANA 2 — 03/08/2026
  const augWeek2 = augMonth.weeks[1];
  augWeek2.workouts.A = {
    split: 'A',
    name: SPLIT_NAMES.A,
    date: '03/08/2026',
    completed: true,
    exercises: [
      { id: 'a26-w2-a1', name: 'Leg press 45', weightKg: 4, sets: 3, reps: 10, date: '03/08/2026', completed: true },
      { id: 'a26-w2-a2', name: 'Cadeira extensora', weightKg: 12, sets: 3, reps: 8, date: '03/08/2026', completed: true },
      { id: 'a26-w2-a3', name: 'Cadeira abdutora', weightKg: 25, sets: 3, reps: 13, date: '03/08/2026', completed: true },
      { id: 'a26-w2-a4', name: 'Cadeira adutora', weightKg: 20, sets: 3, reps: 10, date: '03/08/2026', completed: true },
      { id: 'a26-w2-a5', name: 'Panturrilha sentada', weightKg: 5, sets: 3, reps: 12, date: '03/08/2026', completed: true }
    ]
  };

  augWeek2.workouts.D = {
    split: 'D',
    name: SPLIT_NAMES.D,
    date: '03/08/2026',
    completed: true,
    exercises: [
      { id: 'a26-w2-d1', name: 'Cadeira Flexora', weightKg: 16, sets: 3, reps: 12, date: '03/08/2026', completed: true },
      { id: 'a26-w2-d2', name: 'Agachamento Búlgaro', weightKg: 0, sets: 3, reps: 8, date: '03/08/2026', completed: true },
      { id: 'a26-w2-d3', name: 'Cadeira abdutora', weightKg: 30, sets: 3, reps: 15, date: '03/08/2026', completed: true },
      { id: 'a26-w2-d4', name: 'Cadeira adutora', weightKg: 20, sets: 3, reps: 15, date: '03/08/2026', completed: true },
      { id: 'a26-w2-d5', name: 'Panturrilha em pé', weightKg: 5, sets: 3, reps: 8, date: '03/08/2026', completed: true }
    ]
  };

  augWeek2.workouts.E = {
    split: 'E',
    name: SPLIT_NAMES.E,
    date: '03/08/2026',
    completed: true,
    exercises: [
      { id: 'a26-w2-e1', name: 'Agachamento', weightKg: 0, sets: 3, reps: 12, date: '03/08/2026', completed: true },
      { id: 'a26-w2-e2', name: 'Supino Reto', weightKg: 5, sets: 3, reps: 8, date: '03/08/2026', completed: true },
      { id: 'a26-w2-e3', name: 'Elevação lateral', weightKg: 4, sets: 3, reps: 8, date: '03/08/2026', completed: true },
      { id: 'a26-w2-e4', name: 'Abdominal Infra', weightKg: 5, sets: 3, reps: 8, date: '03/08/2026', completed: true }
    ]
  };

  // SEMANA 3 — 03/08/2026
  const augWeek3 = augMonth.weeks[2];
  augWeek3.workouts.A = {
    split: 'A',
    name: SPLIT_NAMES.A,
    date: '03/08/2026',
    completed: true,
    exercises: [
      { id: 'a26-w3-a1', name: 'Leg press 45', weightKg: 6, sets: 3, reps: 8, date: '03/08/2026', completed: true },
      { id: 'a26-w3-a2', name: 'Cadeira extensora', weightKg: 16, sets: 3, reps: 12, date: '03/08/2026', completed: true },
      { id: 'a26-w3-a3', name: 'Cadeira abdutora', weightKg: 30, sets: 3, reps: 15, date: '03/08/2026', completed: true },
      { id: 'a26-w3-a4', name: 'Cadeira adutora', weightKg: 25, sets: 3, reps: 15, date: '03/08/2026', completed: true },
      { id: 'a26-w3-a5', name: 'Panturrilha sentada', weightKg: 5, sets: 3, reps: 12, date: '03/08/2026', completed: true }
    ]
  };

  augWeek3.workouts.B = {
    split: 'B',
    name: SPLIT_NAMES.B,
    date: '03/08/2026',
    completed: true,
    exercises: [
      { id: 'a26-w3-b1', name: 'Supino Reto', weightKg: 5, sets: 3, reps: 8, date: '03/08/2026', completed: true },
      { id: 'a26-w3-b2', name: 'Peck Deck', weightKg: 8, sets: 3, reps: 8, date: '03/08/2026', completed: true },
      { id: 'a26-w3-b3', name: 'Desenvolvimento ombros', weightKg: 0, sets: 3, reps: 8, date: '03/08/2026', completed: true },
      { id: 'a26-w3-b4', name: 'Tríceps Pulley', weightKg: 12, sets: 3, reps: 12, date: '03/08/2026', completed: true },
      { id: 'a26-w3-b5', name: 'Tríceps Testa', weightKg: 12, sets: 3, reps: 8, date: '03/08/2026', completed: true }
    ]
  };

  augWeek3.workouts.C = {
    split: 'C',
    name: SPLIT_NAMES.C,
    date: '03/08/2026',
    completed: true,
    exercises: [
      { id: 'a26-w3-c1', name: 'Puxada pronada', weightKg: 12, sets: 3, reps: 12, date: '03/08/2026', completed: true },
      { id: 'a26-w3-c2', name: 'Remada sentada triângulo', weightKg: 12, sets: 3, reps: 8, date: '03/08/2026', completed: true },
      { id: 'a26-w3-c3', name: 'Peck Deck inverso', weightKg: 1, sets: 3, reps: 8, date: '03/08/2026', completed: true },
      { id: 'a26-w3-c4', name: 'Rosca Direta', weightKg: 5, sets: 3, reps: 12, date: '03/08/2026', completed: true },
      { id: 'a26-w3-c5', name: 'Abdômen', weightKg: 5, sets: 3, reps: 8, date: '03/08/2026', completed: true }
    ]
  };

  augWeek3.workouts.D = {
    split: 'D',
    name: SPLIT_NAMES.D,
    date: '03/08/2026',
    completed: true,
    exercises: [
      { id: 'a26-w3-d1', name: 'Cadeira Flexora', weightKg: 16, sets: 3, reps: 12, date: '03/08/2026', completed: true },
      { id: 'a26-w3-d2', name: 'Agachamento Búlgaro', weightKg: 0, sets: 3, reps: 12, date: '03/08/2026', completed: true },
      { id: 'a26-w3-d3', name: 'Cadeira abdutora', weightKg: 30, sets: 3, reps: 15, date: '03/08/2026', completed: true },
      { id: 'a26-w3-d4', name: 'Cadeira adutora', weightKg: 25, sets: 3, reps: 15, date: '03/08/2026', completed: true },
      { id: 'a26-w3-d5', name: 'Panturrilha em pé', weightKg: 5, sets: 3, reps: 12, date: '03/08/2026', completed: true }
    ]
  };

  // SEMANA 4 — 03/08/2026
  const augWeek4 = augMonth.weeks[3];
  augWeek4.workouts.A = {
    split: 'A',
    name: SPLIT_NAMES.A,
    date: '03/08/2026',
    completed: true,
    exercises: [
      { id: 'a26-w4-a1', name: 'Leg press 45', weightKg: 10, sets: 3, reps: 12, date: '03/08/2026', completed: true },
      { id: 'a26-w4-a2', name: 'Cadeira extensora', weightKg: 16, sets: 3, reps: 8, date: '03/08/2026', completed: true },
      { id: 'a26-w4-a3', name: 'Cadeira abdutora', weightKg: 30, sets: 3, reps: 15, date: '03/08/2026', completed: true },
      { id: 'a26-w4-a4', name: 'Cadeira adutora', weightKg: 25, sets: 3, reps: 15, date: '03/08/2026', completed: true },
      { id: 'a26-w4-a5', name: 'Panturrilha sentada', weightKg: 0, sets: 3, reps: 12, date: '03/08/2026', completed: true }
    ]
  };

  augWeek4.workouts.B = {
    split: 'B',
    name: SPLIT_NAMES.B,
    date: '03/08/2026',
    completed: true,
    exercises: [
      { id: 'a26-w4-b1', name: 'Supino Reto', weightKg: 5, sets: 3, reps: 8, date: '03/08/2026', completed: true },
      { id: 'a26-w4-b2', name: 'Peck Deck', weightKg: 12, sets: 3, reps: 12, date: '03/08/2026', completed: true },
      { id: 'a26-w4-b3', name: 'Desenvolvimento ombros', weightKg: 2, sets: 2, reps: 8, date: '03/08/2026', completed: true },
      { id: 'a26-w4-b4', name: 'Tríceps Pulley', weightKg: 12, sets: 3, reps: 8, date: '03/08/2026', completed: true },
      { id: 'a26-w4-b5', name: 'Tríceps Testa', weightKg: 12, sets: 3, reps: 8, date: '03/08/2026', completed: true }
    ]
  };

  augWeek4.workouts.C = {
    split: 'C',
    name: SPLIT_NAMES.C,
    date: '03/08/2026',
    completed: true,
    exercises: [
      { id: 'a26-w4-c1', name: 'Puxada pronada', weightKg: 16, sets: 3, reps: 12, date: '03/08/2026', completed: true },
      { id: 'a26-w4-c2', name: 'Remada sentada triângulo', weightKg: 12, sets: 3, reps: 12, date: '03/08/2026', completed: true },
      { id: 'a26-w4-c3', name: 'Peck Deck inverso', weightKg: 4, sets: 3, reps: 8, date: '03/08/2026', completed: true },
      { id: 'a26-w4-c4', name: 'Rosca Direta', weightKg: 5, sets: 3, reps: 12, date: '03/08/2026', completed: true },
      { id: 'a26-w4-c5', name: 'Abdômen', weightKg: 5, sets: 3, reps: 8, date: '03/08/2026', completed: true }
    ]
  };

  augWeek4.workouts.D = {
    split: 'D',
    name: SPLIT_NAMES.D,
    date: '03/08/2026',
    completed: true,
    exercises: [
      { id: 'a26-w4-d1', name: 'Cadeira Flexora', weightKg: 16, sets: 3, reps: 12, date: '03/08/2026', completed: true },
      { id: 'a26-w4-d2', name: 'Agachamento Búlgaro', weightKg: 0, sets: 3, reps: 12, date: '03/08/2026', completed: true },
      { id: 'a26-w4-d3', name: 'Cadeira abdutora', weightKg: 30, sets: 3, reps: 15, date: '03/08/2026', completed: true },
      { id: 'a26-w4-d4', name: 'Cadeira adutora', weightKg: 25, sets: 3, reps: 15, date: '03/08/2026', completed: true },
      { id: 'a26-w4-d5', name: 'Panturrilha em pé', weightKg: 0, sets: 3, reps: 12, date: '03/08/2026', completed: true }
    ]
  };

  augWeek4.workouts.E = {
    split: 'E',
    name: SPLIT_NAMES.E,
    date: '03/08/2026',
    completed: true,
    exercises: [
      { id: 'a26-w4-e1', name: 'Agachamento', weightKg: 0, sets: 3, reps: 12, date: '03/08/2026', completed: true },
      { id: 'a26-w4-e2', name: 'Supino Reto', weightKg: 10, sets: 3, reps: 8, date: '03/08/2026', completed: true },
      { id: 'a26-w4-e3', name: 'Remada articulada', weightKg: 0, sets: null, reps: null, date: '03/08/2026', completed: true },
      { id: 'a26-w4-e4', name: 'Elevação lateral', weightKg: 5, sets: 3, reps: 12, date: '03/08/2026', completed: true },
      { id: 'a26-w4-e5', name: 'Abdominal Infra', weightKg: 5, sets: 3, reps: 10, date: '03/08/2026', completed: true }
    ]
  };

  // 4. Setembro 2026 (index 8)
  const sepMonth = yearData.months[8];

  // SEMANA 1 — 01/09/2026
  const sepWeek1 = sepMonth.weeks[0];
  sepWeek1.workouts.B = {
    split: 'B',
    name: SPLIT_NAMES.B,
    date: '01/09/2026',
    completed: true,
    exercises: [
      { id: 's26-w1-b1', name: 'Supino Reto', weightKg: 10, sets: 3, reps: 8, date: '01/09/2026', completed: true },
      { id: 's26-w1-b2', name: 'Peck Deck', weightKg: 16, sets: 3, reps: 12, date: '01/09/2026', completed: true },
      { id: 's26-w1-b3', name: 'Tríceps Pulley', weightKg: 19, sets: 3, reps: 8, date: '01/09/2026', completed: true },
      { id: 's26-w1-b4', name: 'Tríceps Testa', weightKg: 12, sets: 3, reps: 12, date: '01/09/2026', completed: true }
    ]
  };

  return yearData;
}
