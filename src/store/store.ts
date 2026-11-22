import membershipReducer from "@/store/slice/membershipSlice"
import trainerReducer from "@/store/slice/trainerSlice"
import transactionReducer from "@/store/slice/transactionSlice"
import { configureStore } from "@reduxjs/toolkit"

export const store = configureStore({
  reducer: {
    trainer: trainerReducer,
    membership: membershipReducer,
    transaction: transactionReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
