export interface WorkoutConfig {
  primaryTarget: string
  trainingAge: string
  weeklySplit: string
  sessionDuration: string
  focusAnatomy: string[]
  prioritizeMachines: boolean
  avoidMaintenance: boolean
  includeWarmup: boolean
}

export interface Exercise {
  id: string
  name: string
  sets: number
  reps: string
  notes: string
}

export interface WorkoutPlan {
  id: string
  title: string
  goal: string
  createdAt: string
  config: WorkoutConfig
  exercises: Exercise[]
}
