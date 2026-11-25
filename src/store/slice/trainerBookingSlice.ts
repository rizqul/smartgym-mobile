import { GetMyBookingsParams, getMyBookings } from "@/service/trainer.service"
import { PaginationTrainerBookingResponse } from "@/type/trainerBooking.type"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

interface TrainerBookingState {
  result: PaginationTrainerBookingResponse | null
  isLoading: boolean
  error: string | null
}

const initialState: TrainerBookingState = {
  result: null,
  isLoading: false,
  error: null
}

export const fetchMyBookings = createAsyncThunk(
  "trainerBooking/fetchMyBookings",
  async (params: GetMyBookingsParams | undefined, { rejectWithValue }) => {
    try {
      return await getMyBookings(params)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? "Failed to fetch bookings")
    }
  }
)

const trainerBookingSlice = createSlice({
  name: "trainerBooking",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyBookings.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.isLoading = false
        state.result = action.payload
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.isLoading = false
        state.error = (action.payload as string) ?? action.error.message ?? "Failed to fetch bookings"
      })
  }
})

export default trainerBookingSlice.reducer
