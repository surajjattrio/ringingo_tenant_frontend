import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import {
  allLeadGroup,
  createLeadGroup,
  deleteLeadGroup,
  leadGroup,
  exportLeadGroup,
  removeLeadGroupStatus,
  searchLeadGroup,
  singleLeadGroup,
  updateLeadGroup,
  updateLeadGroupStatus,
  deleteAllLeads,
  leadGroupCampaign
} from "@/redux/services/tenant-admin/leadGroupServices";
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";

// TYPES IMPORT
import { OptionTypes } from "@/types/formTypes";

interface InitialState {
  isLoading: boolean;
  leadGroupData: any;
  allLeadGroupData: any;
  singleLeadGroupData: any;
  leadGroupOptions: OptionTypes[];
  leadGroupCampaignOptions: any;
}

const initialState: InitialState = {
  isLoading: false,
  leadGroupData: [],
  allLeadGroupData: [],
  singleLeadGroupData: {},
  leadGroupOptions: [],
  leadGroupCampaignOptions: [],
};

export const leadGroupGet = createAsyncThunk(
  "leadGroup/get",
  async (params: any) => {
    return await leadGroup(params);
  }
);

export const leadGroupCampaignGet = createAsyncThunk(
  "leadGroup/campaigns-get",
  async () => {
    return await leadGroupCampaign();
  }
);

export const leadGroupSingleGet = createAsyncThunk(
  "leadGroup/single-get",
  async (id: string) => {
    return await singleLeadGroup(id);
  }
);

export const leadGroupSearch = createAsyncThunk(
  "leadGroup/search",
  async (payload: any) => {
    return await searchLeadGroup(payload);
  }
);

export const leadGroupCreate = createAsyncThunk(
  "leadGroup/create",
  async (payload: any) => {
    return await createLeadGroup(payload);
  }
);

export const leadGroupUpdate = createAsyncThunk(
  "leadGroup/update",
  async (payload: any) => {
    const { id, ...rest } = payload;
    return await updateLeadGroup(id, rest);
  }
);

export const leadGroupStatusUpdate = createAsyncThunk(
  "leadGroup-status/update",
  async (payload: any) => {
    const { id, ...rest } = payload;
    return await updateLeadGroupStatus(id, rest);
  }
);

export const leadGroupStatusRemove = createAsyncThunk(
  "leadGroup-status/remove",
  async (payload: any) => {
    return await removeLeadGroupStatus(payload);
  }
);

export const leadGroupDelete = createAsyncThunk(
  "leadGroup/delete",
  async (id: string) => {
    return await deleteLeadGroup(id);
  }
);

export const leadGroupOptionsGet = createAsyncThunk(
  "leadGroup-options/getAll",
  async (params?: any) => {
    return await allLeadGroup(params);
  }
);

export const deleteAllLeadsFromLeadGroup = createAsyncThunk(
  "leadGroup-options/delete",
  async (id: string) => {
    return await deleteAllLeads(id);
  }
);

export const leadGroupExport = createAsyncThunk(
  "lead-group-export-user-info/export",
  async (params: any) => {
    console.log("DDD", params);
    const { name, id } = params;
    return await exportLeadGroup(id, name);
  }
);

const prepareData = (payload: any) => {
  const data = payload?.data;
  const count = payload?.count;

  const newData = data?.map((val: any) => {
    return {
      ...val,
      user_group_name: val?.user_group?.[0]?.name || "",
    };
  });

  return { data: newData, count };
};

const leadGroupSlice = createSlice({
  name: "leadGroup",
  initialState,
  reducers: {
    updateSingleLeadGroupData: (state, action) => {
      state.singleLeadGroupData = action.payload ? action.payload : {};
    },
    clearLeadGroup: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(leadGroupGet.pending, (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      })
      .addCase(leadGroupGet.fulfilled, (state, action: PayloadAction<any>) => {
        state.leadGroupData = prepareData(action.payload)
        state.isLoading = false;
      })
      .addCase(leadGroupGet.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
      });

    builder
      .addCase(leadGroupSearch.pending, (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      })

      .addCase(
        leadGroupSearch.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.leadGroupData = prepareData(action.payload)
          state.isLoading = false;
        }
      )
      .addCase(
        leadGroupSearch.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
        }
      );

    builder.addCase(
      leadGroupOptionsGet.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.leadGroupOptions = action.payload?.data?.map((val: any) => ({
          value: val.uuid,
          label: val.name,
        })) || []
      }
    );

    builder.addCase(
      leadGroupCampaignGet.fulfilled,
      (state, action: PayloadAction<any>) => {
        console.log("actionndaassdasddasasads", action.payload);

        // state.leadGroupCampaignOptions = action.payload
        const data = action.payload?.data;
        const VoiceBroadcastData = data?.voiceBroadcast || [];
        const OutboundData = data?.outbound_campaign || [];
        const blendedData = data?.blended_campaign || [];
        let group1 = OutboundData?.length
          ? OutboundData?.map((val: any) => ({
            value: val?.uuid,
            label: val?.name,
          }))
          : [];

        let group2 = VoiceBroadcastData?.length
          ? VoiceBroadcastData?.map((val: any) => ({
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
            label: "Blended",
            options: [...group3],
          },
          {
            label: "Voice Broadcast",
            options: [...group2],
          },
        ];
        state.leadGroupCampaignOptions = prepareData || [];
      }
    );
  },
});

export default leadGroupSlice.reducer;

export const { updateSingleLeadGroupData, clearLeadGroup } =
  leadGroupSlice.actions;

export const selectIsLoading = (state: RootState) => state.leadGroup.isLoading;
export const useIsLoading = () => {
  const isLoading = useAppSelector(selectIsLoading);
  return useMemo(() => isLoading, [isLoading]);
};

export const selectLeadGroupData = (state: RootState) =>
  state.leadGroup.leadGroupData;
export const useLeadGroupData = () => {
  const leadGroupData = useAppSelector(selectLeadGroupData);
  return useMemo(() => leadGroupData, [leadGroupData]);
};

export const selectSingleLeadGroup = (state: RootState) =>
  state.leadGroup.singleLeadGroupData;
export const useSingleLeadGroup = () => {
  const leadGroupData = useAppSelector(selectSingleLeadGroup);
  return useMemo(() => leadGroupData, [leadGroupData]);
};

export const selectAllLeadGroupData = (state: RootState) =>
  state.leadGroup.allLeadGroupData;
export const useAllLeadData = () => {
  const allLeadGroupData = useAppSelector(selectAllLeadGroupData);
  return useMemo(() => allLeadGroupData, [allLeadGroupData]);
};

export const selectLeadGroupOptions = (state: RootState) =>
  state.leadGroup.leadGroupOptions;
export const useLeadGroupOptions = () => {
  const leadGroupOptions = useAppSelector(selectLeadGroupOptions);
  return useMemo(() => leadGroupOptions, [leadGroupOptions]);
};

export const selectLeadGroupCampaignOptions = (state: RootState) =>
  state.leadGroup.leadGroupCampaignOptions;
export const useLeadGroupCampaignOptions = () => {
  const leadGroupCampaignOptions = useAppSelector(selectLeadGroupCampaignOptions);
  return useMemo(() => leadGroupCampaignOptions, [leadGroupCampaignOptions]);
};
