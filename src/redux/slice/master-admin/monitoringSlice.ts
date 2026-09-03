import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";
import { getMonitoringOverview } from "@/redux/services/master-admin/monitoringServices";
import { MonitoringOverview } from "@/types/master-admin/monitoringTypes";

interface InitialState {
  isLoading: boolean;
  hasLoaded: boolean;
  error: string | null;
  overview: MonitoringOverview | null;
}

const initialState: InitialState = {
  isLoading: false,
  hasLoaded: false,
  error: null,
  overview: null,
};

export const monitoringOverviewGet = createAsyncThunk(
  "monitoring/overview",
  async () => {
    return await getMonitoringOverview();
  }
);

const monitoringSlice = createSlice({
  name: "monitoring",
  initialState,
  reducers: {
    clearMonitoring: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(monitoringOverviewGet.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        monitoringOverviewGet.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.overview = action.payload?.data || null;
          state.isLoading = false;
          state.hasLoaded = true;
        }
      )
      .addCase(monitoringOverviewGet.rejected, (state, action) => {
        state.isLoading = false;
        state.hasLoaded = true;
        state.error = action.error?.message || "Failed to load monitoring data";
      });
  },
});

export default monitoringSlice.reducer;
export const { clearMonitoring } = monitoringSlice.actions;

export const selectMonitoringSelector = (state: RootState) => state.monitoring;
export const useMonitoringSelector = () => {
  const selector = useAppSelector(selectMonitoringSelector);
  return useMemo(() => selector, [selector]);
};
