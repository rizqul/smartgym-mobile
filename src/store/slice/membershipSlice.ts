import { getAllMemberships } from "@/service/membership.service"
import { Package, TypePackage } from "@/type/membership.type"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

interface MemberhipState {
  result: TypePackage | null
  isLoading: boolean
  error: string | null
}

const initialState: MemberhipState = {
  result: null,
  isLoading: false,
  error: null
}

export const fetchMemberships = createAsyncThunk("membership/fetchMemberships", async () => {
  try {
    return await getAllMemberships()
  } catch (error) {
    console.log("Error : ", error)
  }
})

const membershipSlice = createSlice({
  name: "memberships",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMemberships.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchMemberships.fulfilled, (state, action) => {
        state.isLoading = false
        state.result = action.payload!
      })
      .addCase(fetchMemberships.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message!
      })
  }
})

export default membershipSlice.reducer
