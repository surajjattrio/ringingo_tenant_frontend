import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import {
  campaignReport,
  allCampaign,
  searchCampaignReport,
} from "@/redux/services/tenant-admin/campaignReportServices";
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";

interface InitialState {
  campaignReportData: any;
  campaignOptions: any;
}

const initialState: InitialState = {
  campaignReportData: {},
  campaignOptions: [],
};

export const campaignReportGet = createAsyncThunk(
  "campaignReport/get",
  async (params: any) => {
    return await campaignReport(params);
  }
);

export const campaignOptionsGet = createAsyncThunk(
  "campaignReport-option/getAll",
  async () => {
    return await allCampaign();
  }
);

export const campaignReportSearch = createAsyncThunk(
  "campaignReport/search",
  async (payload: any) => {
    return await searchCampaignReport(payload);
  }
);

const prepareData = (payload: any) => {
  const data = payload?.data;
  const count = payload?.count;

  const newData = data?.map((val: any) => {
    return {
      ...val,
      campaign_name: val.campaign_name,
    };
  });

  return { data: newData, count };
};

const campaignReportSlice = createSlice({
  name: "campaignReport",
  initialState,
  reducers: {
    clearCampaignReport: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(
      campaignReportGet.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.campaignReportData = prepareData(action.payload);
      }
    );
    builder.addCase(campaignOptionsGet.fulfilled, (state, action) => {
      const data = action.payload?.data;
      const InboundData = data?.inbound_campaign || [];
      const OutboundData = data?.outbound_campaign || [];
      const blendedData = data?.blended_campaign || [];
      let group1 = OutboundData?.length
        ? OutboundData?.map((val: any) => ({
          value: val?.uuid,
          label: val?.name,
        }))
        : [];

      let group2 = InboundData?.length
        ? InboundData?.map((val: any) => ({
          value: val?.uuid,
          label: val?.name,
        }))
        : [];

      let group3 = blendedData?.length
        ? blendedData?.map((val: any) => ({
          value: val?.uuid,
          label: val?.name,
        }))
        : [];

      let prepareData: any = [
        {
          label: "Outbound",
          options: [...group1],
        },
        {
          label: "Inbound",
          options: [...group2],
        },
        {
          label: "Blended",
          options: [...group3],
        },
      ];
      state.campaignOptions = prepareData || [];
    });
    builder.addCase(
      campaignReportSearch.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.campaignReportData = prepareData(action.payload);
      }
    );
  },
});

export default campaignReportSlice.reducer;
export const { clearCampaignReport } = campaignReportSlice.actions;

export const selectCampaignReport = (state: RootState) =>
  state.campaignReport.campaignReportData;
export const useCampaignReport = () => {
  const campaignReport = useAppSelector(selectCampaignReport);
  return useMemo(() => campaignReport, [campaignReport]);
};
export const selectCampaignOptions = (state: RootState) =>
  state.campaignReport.campaignOptions;
export const useCampaignOptions = () => {
  const options = useAppSelector(selectCampaignOptions);
  return useMemo(() => options, [options]);
};
