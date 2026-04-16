import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";
import {
  callOverviewDashboard,
  dashboard,
  filterDashboard,
} from "@/redux/services/master-admin/dashboardServices";

interface InitialState {
  isLoading: boolean;
  liveCall: string;
  totalRegister: string;
  callOverView: any;
  top10Tenant: any;
  recent10Tenant: any;
  cpuUsage: string;
  diskUsage: string;
  memoryUsage: string;
}

const initialState: InitialState = {
  isLoading: false,
  liveCall: "0",
  totalRegister: "0",
  callOverView: [],
  top10Tenant: [],
  recent10Tenant: [],
  cpuUsage: "0",
  diskUsage: "0",
  memoryUsage: "0",
};

export const dashboardGet = createAsyncThunk(
  "dashboard/get",
  async (params: any) => {
    const { feature, ...rest } = params;
    return await dashboard(feature,rest);
  }
);

export const dashboardCallOverviewGet = createAsyncThunk(
  "dashboard/call-overview",
  async (payload: any) => {
    return await callOverviewDashboard(payload);
  }
);

export const dashboardTop10FilterGet = createAsyncThunk(
  "dashboard-top10/filter",
  async (payload: any) => {
    const { feature, ...rest } = payload;
    return await filterDashboard(feature,rest);
  }
);

export const dashboardRecent10FilterGet = createAsyncThunk(
  "dashboard-recent10/filter",
  async (payload: any) => {
    const { feature, ...rest } = payload;
    return await filterDashboard(feature,rest);
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboard: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(dashboardGet.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(dashboardGet.fulfilled, (state, action: PayloadAction<any>) => {
        const data = action.payload?.data?.length
          ? action.payload?.data[0]
          : {};
        state.liveCall =
          data?.live_calls || data?.live_calls === 0
            ? data?.live_calls
            : state?.liveCall;
        state.totalRegister =
          data?.total_extension || data?.total_extension === 0
            ? data?.total_extension
            : state.totalRegister;
        /*state.top10Tenant = data?.top10_tenant
          ? { top10_tenant: data?.top10_tenant }
          : state.top10Tenant;
        state.recent10Tenant = data?.recent10_tenant
          ? { recent10_tenant: data?.recent10_tenant }
          : state.recent10Tenant;*/
        state.cpuUsage = data?.cpu_usage || state.cpuUsage;
        state.diskUsage = data?.disk_usage || state.diskUsage;
        state.memoryUsage = data?.memory_usage || state.memoryUsage;
        state.callOverView = data?.call_overview || [];
        state.isLoading = false;
      })
      .addCase(dashboardGet.rejected, (state) => {
        state.isLoading = false;
      });

    builder
      .addCase(
        dashboardCallOverviewGet.pending,
        (state, action: PayloadAction<any>) => {
          state.isLoading = true;
        }
      )
      .addCase(
        dashboardCallOverviewGet.fulfilled,
        (state, action: PayloadAction<any>) => {
          // state.callOverView = action.payload?.data;
          state.isLoading = false;
        }
      )
      .addCase(
        dashboardCallOverviewGet.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
        }
      );

    builder
      .addCase(
        dashboardTop10FilterGet.pending,
        (state, action: PayloadAction<any>) => {
          state.isLoading = true;
        }
      )
      .addCase(
        dashboardTop10FilterGet.fulfilled,
        (state, action: PayloadAction<any>) => {
          const data = action.payload?.data?.length
            ? action.payload?.data[0]
            : {};
          state.top10Tenant = data;
          state.isLoading = false;
        }
      )
      .addCase(
        dashboardTop10FilterGet.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
        }
      );

    builder
      .addCase(
        dashboardRecent10FilterGet.pending,
        (state, action: PayloadAction<any>) => {
          state.isLoading = true;
        }
      )
      .addCase(
        dashboardRecent10FilterGet.fulfilled,
        (state, action: PayloadAction<any>) => {
          const data = action.payload?.data?.length
            ? action.payload?.data[0]
            : {};
          state.recent10Tenant = data;
          state.isLoading = false;
        }
      )
      .addCase(
        dashboardRecent10FilterGet.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
        }
      );
  },
});

export default dashboardSlice.reducer;
export const { clearDashboard } = dashboardSlice.actions;

export const selectIsLoading = (state: RootState) => state.dashboard.isLoading;
export const useIsLoading = () => {
  const isLoading = useAppSelector(selectIsLoading);
  return useMemo(() => isLoading, [isLoading]);
};

export const selectLiveCall = (state: RootState) => state.dashboard.liveCall;
export const useLiveCall = () => {
  const liveCall = useAppSelector(selectLiveCall);
  return useMemo(() => liveCall, [liveCall]);
};

export const selectTotalRegister = (state: RootState) =>
  state.dashboard.totalRegister;
export const useTotalRegister = () => {
  const totalRegister = useAppSelector(selectTotalRegister);
  return useMemo(() => totalRegister, [totalRegister]);
};

export const selectDashboardCallOverview = (state: RootState) =>
  state.dashboard.callOverView;
export const useDashboardCallOverview = () => {
  const callOverview = useAppSelector(selectDashboardCallOverview);
  return useMemo(() => callOverview, [callOverview]);
};

export const selectTop10Tenant = (state: RootState) =>
  state.dashboard.top10Tenant;
export const useTop10Tenant = () => {
  const top10Tenant = useAppSelector(selectTop10Tenant);
  return useMemo(() => top10Tenant, [top10Tenant]);
};

export const selectRecent10Tenant = (state: RootState) =>
  state.dashboard.recent10Tenant;
export const useRecent10Tenant = () => {
  const recent10Tenant = useAppSelector(selectRecent10Tenant);
  return useMemo(() => recent10Tenant, [recent10Tenant]);
};

export const selectCpuUsage = (state: RootState) => state.dashboard.cpuUsage;
export const useCpuUsage = () => {
  const cpuUsage = useAppSelector(selectCpuUsage);
  return useMemo(() => cpuUsage, [cpuUsage]);
};

export const selectDiskUsage = (state: RootState) => state.dashboard.diskUsage;
export const useDiskUsage = () => {
  const cpuUsage = useAppSelector(selectDiskUsage);
  return useMemo(() => cpuUsage, [cpuUsage]);
};

export const selectMemoryUsage = (state: RootState) =>
  state.dashboard.memoryUsage;
export const useMemoryUsage = () => {
  const cpuUsage = useAppSelector(selectMemoryUsage);
  return useMemo(() => cpuUsage, [cpuUsage]);
};

export const selectDashboardSelector = (state: RootState) => state.dashboard;
export const useDashboardSelector = () => {
  const selector = useAppSelector(selectDashboardSelector);
  return useMemo(() => selector, [selector]);
};

