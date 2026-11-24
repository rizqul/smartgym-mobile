import aiWorkoutReducer from "@/store/slice/aiWorkoutSlice"
import checkinReducer from "@/store/slice/checkinSlice"
import membershipReducer from "@/store/slice/membershipSlice"
import trainerReducer from "@/store/slice/trainerSlice"
import transactionReducer from "@/store/slice/transactionSlice"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { persistReducer, persistStore } from "redux-persist"

const rootReducer = combineReducers({
  trainer: trainerReducer,
  membership: membershipReducer,
  transaction: transactionReducer,
  checkin: checkinReducer,
  aiWorkout: aiWorkoutReducer
})

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["checkin", "membership", "aiWorkout"]
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
