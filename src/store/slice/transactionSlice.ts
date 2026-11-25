import { getAllTransactions, GetTransactionsParams } from "@/service/transaction.service"
import { PaginationTransactionResponse } from "@/type/Transaction.type"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

interface TransactionState {
  result: PaginationTransactionResponse | null
  isLoading: boolean
  error: string | null
}

const initialState: TransactionState = {
  result: null,
  isLoading: false,
  error: null
}

export const fetchTransactions = createAsyncThunk(
  "transaction/fetchTransactions",
  async (params: GetTransactionsParams | undefined, { rejectWithValue }) => {
    try {
      return await getAllTransactions(params)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message ?? "Failed to fetch transactions")
    }
  }
)

const transactionSlice = createSlice({
  name: "transaction",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false
        state.result = action.payload!
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false
        state.error = (action.payload as string) ?? action.error.message ?? "Failed to fetch transactions"
      })
  }
})

export default transactionSlice.reducer
