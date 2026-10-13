export type WorkoutSplit = 'A' | 'B' | 'C' | 'D' | 'E';

export interface ExerciseRecord {
  id: string;
  name: string;
  weightKg: number | null; // null represents empty/unfilled, 0 represents bodyweight
  sets: number | null;     // null represents empty/unfilled
  reps: number | null;     // null represents empty/unfilled
  notes?: string;
  date?: string;           // e.g. "13/05/2026"
  completed?: boolean;
}

export interface WorkoutSession {
  split: WorkoutSplit;
  name: string;            // e.g. "Treino A - Inferiores"
  date?: string;
  completed?: boolean;
  notes?: string;
  exercises: ExerciseRecord[];
}

export interface WeekData {
  weekNumber: number;      // 1, 2, 3, 4, 5...
  label: string;           // "SEMANA 1", "SEMANA 2"...
  workouts: Record<WorkoutSplit, WorkoutSession>;
}

export interface MonthData {
  monthIndex: number;      // 0 (Jan) to 11 (Dez)
  monthName: string;       // "Janeiro", "Fevereiro", ...
  weeks: WeekData[];
}

export interface YearData {
  year: number;
  months: MonthData[];
}

export interface TemplateExercise {
  id: string;
  name: string;
  notes?: string;
  muscleGroup?: string;
  defaultSets?: number;
  defaultReps?: number;
  tutorialId?: string;
}

export type WorkoutTemplate = Record<WorkoutSplit, TemplateExercise[]>;

export interface ExerciseTutorial {
  id: string;
  name: string;
  muscleGroup: string;
  videoUrl?: string;       // YouTube URL or data URL
  videoType?: 'youtube' | 'local' | 'embed';
  executionNotes: string;
  commonMistakes?: string;
  thumbnailUrl?: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  gymGoal?: string;
  joinedDate: string;
}
