import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORTS


import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";

// TYPES
import { OptionTypes } from "@/types/formTypes";
import { getOmniChannelReport, searchOmniChannelReport } from "@/redux/services/tenant-admin/omniChannelReportServices";

interface InitialState {
  isLoading: boolean;
  omniReportData: any;
  allOmniReportData: any;
  omniReportOptions: OptionTypes[];
}

const initialState: InitialState = {
  isLoading: false,
  omniReportData: {},
  allOmniReportData: {},
  omniReportOptions: [],
};

/**
 * GET : Fetch all omni-channel users by tenant_uuid
 */
export const omniReportGet = createAsyncThunk(
  "omniChannelReport/get",
  async (params: any) => {
    return await getOmniChannelReport(params);
  }
);

/**
 * POST : Search omni-channel users
 */
export const omniReportSearch = createAsyncThunk(
  "omniChannelReport/search",
  async (params: any) => {
    return await searchOmniChannelReport(params);
  }
);

/**
 * Prepare data for UI
 */
const prepareData = (payload: any) => {
  const data = payload?.data?.list || [];
  const activeChats = payload?.data?.activeCount || 0;
  const inActiveChats = payload?.data?.inActiveCount || 0;

  const newData = data.map((val: any) => ({
    ...val,
    agent_name: val?.user_name || "", // UI-friendly alias
  }));

  return { data: newData, activeChats, inActiveChats };
};

const omniChannelReportSlice = createSlice({
  name: "omniChannelReport",
  initialState,
  reducers: {
    clearOmniChannelReport: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(omniReportGet.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(
      omniReportGet.fulfilled,
      (state, action: PayloadAction<any>) => {
        // console.log("action payload omni report", action.payload);
        state.omniReportData = prepareData(action.payload);
        state.isLoading = false;
      }
    );

    builder.addCase(omniReportSearch.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(
      omniReportSearch.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.omniReportData = prepareData(action.payload);
        state.isLoading = false;
      }
    );
  },
});

export default omniChannelReportSlice.reducer;
export const { clearOmniChannelReport } =
  omniChannelReportSlice.actions;

// ===================== SELECTORS =====================

export const selectOmniReport = (state: RootState) =>
  state.omniChannelReport.omniReportData;

export const selectOmniReportLoading = (state: RootState) =>
  state.omniChannelReport.isLoading;

// ===================== HOOKS =====================

export const useOmniReport = () => {
  const omniReport = useAppSelector(selectOmniReport);
  return useMemo(() => omniReport, [omniReport]);
};

export const useOmniReportLoading = () => {
  const isLoading = useAppSelector(selectOmniReportLoading);
  return useMemo(() => isLoading, [isLoading]);
};
