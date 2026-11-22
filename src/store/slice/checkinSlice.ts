import { CheckinResponse } from "@/type/checkin.type"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface CheckinState {
  activeCheckin: CheckinResponse | null
}

const initialState: CheckinState = {
  activeCheckin: null
}

const checkinSlice = createSlice({
  name: "checkin",
  initialState,
  reducers: {
    setActiveCheckin: (state, action: PayloadAction<CheckinResponse>) => {
      state.activeCheckin = action.payload
      console.log(state.activeCheckin)
    },
    clearActiveCheckin: (state) => {
      state.activeCheckin = null
    }
  }
})

export const { setActiveCheckin, clearActiveCheckin } = checkinSlice.actions
export default checkinSlice.reducer
