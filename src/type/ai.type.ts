export type SplitType = "PULL" | "PUSH" | "UPPER" | "LOWER" | "FULL_BODY"

export interface AiWorkoutRequest {
  primaryTarget: string
  trainingAge: string
  weeklySplitInDays: number
  sessionDuration: string
  focusAnatomy: string[]
  prioritizeMachines?: boolean
  avoidMaintenance?: boolean
}

export interface AiExercise {
  name: string
  equipment: string
  sets: number
  reps: string // String di BE, contoh "8-12"
  restTimeSec: number
  notes: string
}

export interface AiWorkoutDay {
  dayName: string
  splitType: SplitType
  focus: string
  estimatedDurationMin: number
  exercises: AiExercise[]
}

export interface AiWorkoutResponse {
  title: string
  goal: string
  schedule: AiWorkoutDay[]
}

export interface SavedWorkoutPlan extends AiWorkoutResponse {
  id: string
  createdAt: string
}
