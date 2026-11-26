import { getAllTrainers } from "@/service/trainer.service"
import { Trainer } from "@/type/Trainer.type"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

interface TrainerState {
  result: Trainer[] | null
  isLoading: boolean
  error: string | null
}

export type FetchTrainersParams = {
  search?: string
  page?: number
  size?: number
}

const initialState: TrainerState = {
  result: null,
  isLoading: false,
  error: null
}

export const fetchTrainers = createAsyncThunk(
  "trainer/fetchTrainers",
  async (params: FetchTrainersParams | undefined, { rejectWithValue }) => {
    try {
      const response = await getAllTrainers(params)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data ?? "Failed to fetch trainers")
    }
  }
)

const trainerSlice = createSlice({
  name: "trainers",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrainers.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchTrainers.fulfilled, (state, action) => {
        state.isLoading = false
        state.result = action.payload!
      })
      .addCase(fetchTrainers.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message!
      })
  }
})

export default trainerSlice.reducer
