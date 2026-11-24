import { AiWorkoutResponse } from "@/type/ai.type"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type AiWorkoutState = { currentPlan: AiWorkoutResponse | null }

const initialState: AiWorkoutState = { currentPlan: null }

const aiWorkoutSlice = createSlice({
  name: "aiWorkout",
  initialState,
  reducers: {
    setCurrentPlan: (state, action: PayloadAction<AiWorkoutResponse>) => {
      state.currentPlan = action.payload
    },
    clearCurrentPlan: (state) => {
      state.currentPlan = null
    }
  }
})

export const { setCurrentPlan, clearCurrentPlan } = aiWorkoutSlice.actions
export default aiWorkoutSlice.reducer
