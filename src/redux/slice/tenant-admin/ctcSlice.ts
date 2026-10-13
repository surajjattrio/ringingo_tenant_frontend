import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { ctcDial, ctcHistory } from "@/redux/services/tenant-admin/ctcServices";
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";

interface InitialState {
  placing: boolean;
  lastResult: any;
  historyLoading: boolean;
  historyData: any[];
}

const initialState: InitialState = {
  placing: false,
  lastResult: null,
  historyLoading: false,
  historyData: [],
};

export const ctcPlaceCall = createAsyncThunk(
  "ctc/dial",
  async (payload: any) => {
    return await ctcDial(payload);
  }
);

export const ctcHistoryGet = createAsyncThunk(
  "ctc/history",
  async (params: any) => {
    return await ctcHistory(params);
  }
);

const ctcSlice = createSlice({
  name: "ctc",
  initialState,
  reducers: {
    clearCtcResult: (state) => {
      state.lastResult = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(ctcPlaceCall.pending, (state) => {
        state.placing = true;
        state.lastResult = null;
      })
      .addCase(ctcPlaceCall.fulfilled, (state, action: PayloadAction<any>) => {
        state.placing = false;
        state.lastResult = action.payload;
      })
      .addCase(ctcPlaceCall.rejected, (state, action) => {
        state.placing = false;
        state.lastResult = { success: false, message: action.error?.message || "Call failed" };
      });

    builder
      .addCase(ctcHistoryGet.pending, (state) => {
        state.historyLoading = true;
      })
      .addCase(ctcHistoryGet.fulfilled, (state, action: PayloadAction<any>) => {
        state.historyLoading = false;
        state.historyData = action.payload?.data || [];
      })
      .addCase(ctcHistoryGet.rejected, (state) => {
        state.historyLoading = false;
      });
  },
});

export default ctcSlice.reducer;
export const { clearCtcResult } = ctcSlice.actions;

export const selectCtcPlacing = (state: RootState) => state.ctc.placing;
export const useCtcPlacing = () => {
  const placing = useAppSelector(selectCtcPlacing);
  return useMemo(() => placing, [placing]);
};

export const selectCtcLastResult = (state: RootState) => state.ctc.lastResult;
export const useCtcLastResult = () => {
  const lastResult = useAppSelector(selectCtcLastResult);
  return useMemo(() => lastResult, [lastResult]);
};

export const selectCtcHistory = (state: RootState) => state.ctc.historyData;
export const useCtcHistory = () => {
  const historyData = useAppSelector(selectCtcHistory);
  return useMemo(() => historyData, [historyData]);
};

export const selectCtcHistoryLoading = (state: RootState) => state.ctc.historyLoading;
export const useCtcHistoryLoading = () => {
  const historyLoading = useAppSelector(selectCtcHistoryLoading);
  return useMemo(() => historyLoading, [historyLoading]);
};
