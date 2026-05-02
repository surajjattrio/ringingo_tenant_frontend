import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";
import {
  tenantCallOverviewDashboard,
  tenantDashboard,
  tenantFilterDashboard,
  tenantDashboardData
} from "@/redux/services/tenant-admin/tenantDashboardServices";

interface InitialState {
  isLoading: boolean;
  liveCall: string;
  managers: string;
  agents: string;
  dids: string;
  trunks: string;
  inbound_campaigns: string;
  outbound_campaigns: string;
  blended_campaigns: string;
  totalRegister: string;
  callOverView: any;
  top10User: any;
  recent10User: any;
  callsData: any;
  dashboardKpis: any;
  dashboardInbound: any;
  dashboardOutbound: any;
  dashboardTrafficTrends: any;
  dashboardDispositionTrends: any;
  dashboardCallDistribution: any;
  dashboardFilter: string;
}

const initialState: InitialState = {
  isLoading: false,
  liveCall: "0",
  managers: "0",
  agents: "0",
  dids: "0",
  trunks: "0",
  inbound_campaigns: "0",
  outbound_campaigns: "0",
  blended_campaigns: "0",
  totalRegister: "0",
  callOverView: [],
  top10User: [],
  recent10User: [],
  callsData: [],
  dashboardKpis: null,
  dashboardInbound: null,
  dashboardOutbound: null,
  dashboardTrafficTrends: null,
  dashboardDispositionTrends: [],
  dashboardCallDistribution: [],
  dashboardFilter: "daily",
};

export const tenantDashboardGet = createAsyncThunk(
  "tenant-dashboard/get",
  async (params: any) => {
    const { feature, ...rest } = params;
    return await tenantDashboard(feature, rest);
  }
);

export const tenantDashboardCallOverviewGet = createAsyncThunk(
  "tenant-dashboard/call-overview",
  async (payload: any) => {
    return await tenantCallOverviewDashboard(payload);
  }
);

export const tenantDashboardTop10FilterGet = createAsyncThunk(
  "tenant-dashboard-top10/filter",
  async (payload: any) => {
    const { feature, ...rest } = payload;
    return await tenantFilterDashboard(feature, rest);
  }
);

export const tenantDashboardRecent10FilterGet = createAsyncThunk(
  "tenant-dashboard-recent10/filter",
  async (payload: any) => {
    const { feature, ...rest } = payload;
    return await tenantFilterDashboard(feature, rest);
  }
);
export const tenantDashboardDataGet = createAsyncThunk(
  "tenant-dashboard/data",
  async (payload: any) => {
    return await tenantDashboardData(payload);
  }
);
const tenantDashboardSlice = createSlice({
  name: "tenant-dashboard",
  initialState,
  reducers: {
    clearTenantDashboard: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(tenantDashboardGet.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        tenantDashboardGet.fulfilled,
        (state, action: PayloadAction<any>) => {

          const data = action.payload?.data?.length
            ? action.payload?.data[0]
            : {};
          console.log("datadata", data);

          state.liveCall =
            data?.live_calls || data?.live_calls === 0
              ? data?.live_calls
              : state?.liveCall;
          state.totalRegister =
            data?.total_extension || data?.total_extension === 0
              ? data?.total_extension
              : state.totalRegister;
          state.managers =
            data?.managers || data?.managers === 0
              ? data?.managers
              : state.managers;
          state.agents =
            data?.agents || data?.agents === 0
              ? data?.agents
              : state.agents;
          state.dids =
            data?.dids || data?.dids === 0
              ? data?.dids
              : state.dids;
          state.trunks =
            data?.trunks || data?.trunks === 0
              ? data?.trunks
              : state.trunks;
          state.inbound_campaigns =
            data?.inbound_campaigns || data?.inbound_campaigns === 0
              ? data?.inbound_campaigns
              : state.inbound_campaigns;
          state.outbound_campaigns =
            data?.outbound_campaigns || data?.outbound_campaigns === 0
              ? data?.outbound_campaigns
              : state.outbound_campaigns;
          state.blended_campaigns =
            data?.blended_campaigns || data?.blended_campaigns === 0
              ? data?.blended_campaigns
              : state.blended_campaigns;
          /*state.top10User = data?.top10_users
            ? { top10_users: data?.top10_users }
            : state.top10User;
          state.recent10User = data?.recent10_users
            ? { recent10_users: data?.recent10_users }
            : state.recent10User;*/
          state.callsData = data?.calls_data?.length
            ? data?.calls_data[0]
            : state.callsData;
          state.callOverView = data?.call_overview || [];
          state.isLoading = false;
        }
      )
      .addCase(tenantDashboardGet.rejected, (state) => {
        state.isLoading = false;
      });

    builder
      .addCase(
        tenantDashboardCallOverviewGet.pending,
        (state, action: PayloadAction<any>) => {
          state.isLoading = true;
        }
      )
      .addCase(
        tenantDashboardCallOverviewGet.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.callOverView = action.payload?.data;
          state.isLoading = false;
        }
      )
      .addCase(
        tenantDashboardCallOverviewGet.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
        }
      );

    builder
      .addCase(
        tenantDashboardTop10FilterGet.pending,
        (state, action: PayloadAction<any>) => {
          state.isLoading = true;
        }
      )
      .addCase(
        tenantDashboardTop10FilterGet.fulfilled,
        (state, action: PayloadAction<any>) => {
          const data = action.payload?.data?.length
            ? action.payload?.data[0]
            : {};
          state.top10User = data;
          state.isLoading = false;
        }
      )
      .addCase(
        tenantDashboardTop10FilterGet.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
        }
      );

    builder
      .addCase(
        tenantDashboardRecent10FilterGet.pending,
        (state, action: PayloadAction<any>) => {
          state.isLoading = true;
        }
      )
      .addCase(
        tenantDashboardRecent10FilterGet.fulfilled,
        (state, action: PayloadAction<any>) => {
          const data = action.payload?.data?.length
            ? action.payload?.data[0]
            : {};
          state.recent10User = data;
          state.isLoading = false;
        }
      )
      .addCase(
        tenantDashboardRecent10FilterGet.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
        }
      );
       builder
      .addCase(tenantDashboardDataGet.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        tenantDashboardDataGet.fulfilled,
        (state, action: PayloadAction<any>) => {
          const data = action.payload?.data || action.payload; // depends on your API wrapper
          state.dashboardKpis = data?.kpis || null;
          state.dashboardInbound = data?.inbound || null;
          state.dashboardOutbound = data?.outbound || null;
          state.dashboardTrafficTrends = data?.traffic_trends || null;
          state.dashboardDispositionTrends = data?.disposition_trends || [];
          state.dashboardCallDistribution = data?.call_distribution || [];
          state.dashboardFilter = data?.filter || state.dashboardFilter;
          state.isLoading = false;
        }
      )
      .addCase(tenantDashboardDataGet.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default tenantDashboardSlice.reducer;
export const { clearTenantDashboard } = tenantDashboardSlice.actions;

export const selectIsLoading = (state: RootState) =>
  state.tenantDashboard.isLoading;
export const useIsLoading = () => {
  const isLoading = useAppSelector(selectIsLoading);
  return useMemo(() => isLoading, [isLoading]);
};

export const selectTenantLiveCall = (state: RootState) =>
  state.tenantDashboard.liveCall;
export const useTenantLiveCall = () => {
  const liveCall = useAppSelector(selectTenantLiveCall);
  return useMemo(() => liveCall, [liveCall]);
};

export const selectTenantTotalRegister = (state: RootState) =>
  state.tenantDashboard.totalRegister;
export const useTenantTotalRegister = () => {
  const totalRegister = useAppSelector(selectTenantTotalRegister);
  return useMemo(() => totalRegister, [totalRegister]);
};

export const selectTenantDashboardCallOverview = (state: RootState) =>
  state.tenantDashboard.callOverView;
export const useTenantDashboardCallOverview = () => {
  const callOverview = useAppSelector(selectTenantDashboardCallOverview);
  return useMemo(() => callOverview, [callOverview]);
};

export const selectTenantCallsData = (state: RootState) =>
  state.tenantDashboard.callsData;
export const useTenantCallData = () => {
  const callsData = useAppSelector(selectTenantCallsData);
  return useMemo(() => callsData, [callsData]);
};

export const selectTenantTop10Users = (state: RootState) =>
  state.tenantDashboard.top10User;
export const useTenantTop10Users = () => {
  const top10User = useAppSelector(selectTenantTop10Users);
  return useMemo(() => top10User, [top10User]);
};

export const selectTenantRecent10Users = (state: RootState) =>
  state.tenantDashboard.recent10User;
export const useTenantRecent10Users = () => {
  const recent10User = useAppSelector(selectTenantRecent10Users);
  return useMemo(() => recent10User, [recent10User]);
};

export const selectTenantDashboardSelector = (state: RootState) =>
  state.tenantDashboard;
export const useTenantDashboardSelector = () => {
  const selector = useAppSelector(selectTenantDashboardSelector);
  return useMemo(() => selector, [selector]);
};

// ---------------
export const selectTenantDashboardKpis = (state: RootState) =>
  state.tenantDashboard.dashboardKpis;
export const useTenantDashboardKpis = () => {
  const kpis = useAppSelector(selectTenantDashboardKpis);
  return useMemo(() => kpis, [kpis]);
};

export const selectTenantDashboardInbound = (state: RootState) =>
  state.tenantDashboard.dashboardInbound;
export const useTenantDashboardInbound = () => {
  const inbound = useAppSelector(selectTenantDashboardInbound);
  return useMemo(() => inbound, [inbound]);
};
export const selectTenantDashboardOutbound = (state: RootState) =>
  state.tenantDashboard.dashboardOutbound;
export const useTenantDashboardOutbound = () => {
  const outbound = useAppSelector(selectTenantDashboardOutbound);
  return useMemo(() => outbound, [outbound]);
};

export const selectTenantDashboardTrafficTrends = (state: RootState) =>
  state.tenantDashboard.dashboardTrafficTrends;
export const useTenantDashboardTrafficTrends = () => {
  const trafficTrends = useAppSelector(selectTenantDashboardTrafficTrends);
  return useMemo(() => trafficTrends, [trafficTrends]);
};

export const selectTenantDashboardDispositionTrends = (state: RootState) =>
  state.tenantDashboard.dashboardDispositionTrends;
export const useTenantDashboardDispositionTrends = () => {
  const dispositionTrends = useAppSelector(selectTenantDashboardDispositionTrends);
  return useMemo(() => dispositionTrends, [dispositionTrends]);
};

export const selectTenantDashboardCallDistribution = (state: RootState) =>
  state.tenantDashboard.dashboardCallDistribution;
export const useTenantDashboardCallDistribution = () => {
  const callDistribution = useAppSelector(selectTenantDashboardCallDistribution);
  return useMemo(() => callDistribution, [callDistribution]);
};