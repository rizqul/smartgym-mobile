import { WorkoutConfig, WorkoutPlan } from "@/utils/types/Ai.type"
import * as SecureStore from "expo-secure-store"

const STORAGE_KEY = "ai_workout_plans"

export const generateAIPrompt = (config: WorkoutConfig) => {
  const systemPrompt = `You are an expert AI Personal Trainer for SmartGym. 
Generate a workout plan based on the user's configuration. 
You MUST return ONLY a valid JSON object matching this TypeScript interface exactly:
{
  "title": "String (e.g., High-Volume Hypertrophy)",
  "goal": "String",
  "exercises": [
    {
      "id": "String",
      "name": "String",
      "sets": Number,
      "reps": "String",
      "notes": "String"
    }
  ]
}
Do not include markdown formatting or extra text.`

  const userPrompt = `Here is my configuration:
- Target: ${config.primaryTarget}
- Training Age: ${config.trainingAge}
- Weekly Split: ${config.weeklySplit}
- Session Duration: ${config.sessionDuration}
- Focus Muscles: ${config.focusAnatomy.join(", ")}
- Prioritize Available Machines: ${config.prioritizeMachines}
- Avoid Maintenance Equipment: ${config.avoidMaintenance}
- Include Dynamic Warm-up: ${config.includeWarmup}
  
Please generate the plan for today's session.`

  return { systemPrompt, userPrompt }
}

export const generateAndSavePlan = async (config: WorkoutConfig): Promise<WorkoutPlan> => {
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const mockAIResponse: WorkoutPlan = {
    id: Date.now().toString(),
    title: `${config.primaryTarget} Protocol`,
    goal: `Optimize ${config.focusAnatomy.join(" & ")}`,
    createdAt: new Date().toISOString(),
    config: config,
    exercises: [
      { id: "1", name: "Dynamic Band Dislocates", sets: 2, reps: "15 reps", notes: "Warm-up" },
      { id: "2", name: "Incline Dumbbell Press", sets: 4, reps: "8-10 reps", notes: "Focus on form" },
      { id: "3", name: "Cable Crossover", sets: 3, reps: "12 reps", notes: "Squeeze at top" },
      { id: "4", name: "Tricep Pushdown", sets: 3, reps: "12-15 reps", notes: "Keep elbows tucked" }
    ]
  }

  try {
    // Ambil data dari SecureStore
    const existingPlansStr = await SecureStore.getItemAsync(STORAGE_KEY)
    const existingPlans: WorkoutPlan[] = existingPlansStr ? JSON.parse(existingPlansStr) : []

    existingPlans.unshift(mockAIResponse) // Tambahkan di paling atas

    // Simpan kembali ke SecureStore
    await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(existingPlans))
  } catch (error) {
    console.error("Gagal menyimpan ke SecureStore (kemungkinan ukuran melebihi 2048 byte):", error)
  }

  return mockAIResponse
}

export const getSavedPlans = async (): Promise<WorkoutPlan[]> => {
  try {
    const plansStr = await SecureStore.getItemAsync(STORAGE_KEY)
    return plansStr ? JSON.parse(plansStr) : []
  } catch (error) {
    console.error("Gagal membaca dari SecureStore:", error)
    return []
  }
}

// Tambahan opsional: Fungsi untuk menghapus semua rencana latihan
export const clearSavedPlans = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(STORAGE_KEY)
}
