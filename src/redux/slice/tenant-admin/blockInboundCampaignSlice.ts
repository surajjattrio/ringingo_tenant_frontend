import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import {
  blockInboundCampaign,
  createBlockInboundCampaign,
  deleteBlockInboundCampaign,
  searchBlockInboundCampaign,
  singleBlockInboundCampaign,
  updateBlockInboundCampaign,
  updateBlockInboundCampaignStatus,
   importBlockInboundCampaign,
} from "@/redux/services/tenant-admin/blockInboundCampaignServices";
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";

// OPTIONS IMPORTS
import { blockTypeOption } from "@/config/options";

interface InitialState {
  blockInboundCampaignData: any;
  singleblockInboundCampaignData: any;
}

const initialState: InitialState = {
  blockInboundCampaignData: [],
  singleblockInboundCampaignData: {},
};

export const blockInboundCampaignGet = createAsyncThunk(
  "block-inbound-campaign/get",
  async (params: any) => {
    return await blockInboundCampaign(params);
  }
);

export const singleBlockInboundCampaignGet = createAsyncThunk(
  "single-block-inbound-campaign/get",
  async (id: string) => {
    return await singleBlockInboundCampaign(id);
  }
);

export const blockInboundCampaignSearch = createAsyncThunk(
  "block-inbound-campaign/search",
  async (payload: any) => {
    return await searchBlockInboundCampaign(payload);
  }
);

export const blockInboundCampaignCreate = createAsyncThunk(
  "block-inbound-campaign/create",
  async (payload: any) => {
    return await createBlockInboundCampaign(payload);
  }
);

export const blockInboundCampaignUpdate = createAsyncThunk(
  "block-inbound-campaign/update",
  async (payload: any) => {
    const { id, ...rest } = payload;
    return await updateBlockInboundCampaign(id, rest);
  }
);

export const blockInboundCampaignStatusUpdate = createAsyncThunk(
  "block-inbound-campaign-status/update",
  async (payload: any) => {
    const { id, ...rest } = payload;
    return await updateBlockInboundCampaignStatus(id, rest);
  }
);

export const blockInboundCampaignDelete = createAsyncThunk(
  "block-inbound-campaign/delete",
  async (id: string) => {
    return await deleteBlockInboundCampaign(id);
  }
);

export const blockInboundCampaignImport = createAsyncThunk(
  "block-inbound-campaign/import",
  async (payload: any) => {
      return await importBlockInboundCampaign(payload);
  }
);


const prepareData = (payload: any) => {
  const data = payload?.data;
  const count = payload?.count;

  const newData = data?.map((val: any) => {
    const typeNameData = blockTypeOption?.find(
      (option: any) => option?.value === val?.type
    );
    return {
      ...val,
      typeName: typeNameData?.label || "",
    };
  });

  return { data: newData, count };
};

const blockInboundCampaignSlice = createSlice({
  name: "blockInboundCampaign",
  initialState,
  reducers: {
    updateSingleblockInboundCampaign: (state, action) => {
      state.singleblockInboundCampaignData = action.payload
        ? action.payload
        : {};
    },
    clearblockInboundCampaign: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(
      blockInboundCampaignGet.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.blockInboundCampaignData = prepareData(action.payload);
      }
    );

    builder.addCase(
      blockInboundCampaignSearch.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.blockInboundCampaignData = prepareData(action.payload);
      }
    );
  },
});
export default blockInboundCampaignSlice.reducer;

export const { updateSingleblockInboundCampaign, clearblockInboundCampaign } =
  blockInboundCampaignSlice.actions;

export const selectBlockInboundCampaignData = (state: RootState) =>
  state.blockInboundCampaign.blockInboundCampaignData;
export const useBlockInboundCampaignData = () => {
  const BlockInboundCampaignData = useAppSelector(
    selectBlockInboundCampaignData
  );
  return useMemo(() => BlockInboundCampaignData, [BlockInboundCampaignData]);
};

export const selectSingleClickToCall = (state: RootState) =>
  state.blockInboundCampaign.singleblockInboundCampaignData;
export const useSingleBlockInboundCampaign = () => {
  const SingleBlockInboundCampaign = useAppSelector(selectSingleClickToCall);
  return useMemo(
    () => SingleBlockInboundCampaign,
    [SingleBlockInboundCampaign]
  );
};
