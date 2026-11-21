import membershipReducer from "@/store/slice/membershipSlice"
import trainerReducer from "@/store/slice/trainerSlice"
import { configureStore } from "@reduxjs/toolkit"

export const store = configureStore({
  reducer: {
    trainer: trainerReducer,
    membership: membershipReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
