import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import {
  clickToCall,
  createClickToCall,
  deleteClickToCall,
  forwardClickToCall,
  searchClickToCall,
  updateClickToCall,
  updateClickToCallStatus,
} from "@/redux/services/tenant-admin/clickToCallServices";
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";

interface InitialState {
  clickToCallData: any;
  singleClickToCallData: any;
}

const initialState: InitialState = {
  clickToCallData: [],
  singleClickToCallData: {},
};

export const clickToCallGet = createAsyncThunk(
  "click-to-call/get",
  async (params: any) => {
    return await clickToCall(params);
  }
);

export const clickToCallSearch = createAsyncThunk(
  "click-to-call/search",
  async (payload: any) => {
    return await searchClickToCall(payload);
  }
);

export const clickToCallCreate = createAsyncThunk(
  "click-to-call/create",
  async (payload: any) => {
    return await createClickToCall(payload);
  }
);

export const clickToCallUpdate = createAsyncThunk(
  "click-to-call/update",
  async (payload: any) => {
    const { id, ...rest } = payload;
    return await updateClickToCall(id, rest);
  }
);

export const clickToCallStatusUpdate = createAsyncThunk(
  "click-to-call-status/update",
  async (payload: any) => {
    const { id, ...rest } = payload;
    return await updateClickToCallStatus(id, rest);
  }
);

export const clickToCallDelete = createAsyncThunk(
  "click-to-call/delete",
  async (id: string) => {
    return await deleteClickToCall(id);
  }
);

export const clickToCallForward = createAsyncThunk(
  "click-to-call/forward",
  async (payload: any) => {
    const { id, ...rest } = payload;
    return await forwardClickToCall(id, rest);
  }
);

const prepareData = (payload: any) => {
  const data = payload?.data;
  const count = payload?.count;

  const newData = data?.map((val: any) => {
    return {
      ...val,
    };
  });

  return { data: newData, count };
};

const clickToCallSlice = createSlice({
  name: "clickToCall",
  initialState,
  reducers: {
    updateSingleClickToCall: (state, action) => {
      state.singleClickToCallData = action.payload ? action.payload : {};
    },
    clearclickToCall: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(
      clickToCallGet.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.clickToCallData = prepareData(action.payload);
      }
    );

    builder.addCase(
      clickToCallSearch.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.clickToCallData = prepareData(action.payload);
      }
    );
  },
});

export default clickToCallSlice.reducer;

export const { updateSingleClickToCall, clearclickToCall } =
  clickToCallSlice.actions;

export const selectClickToCallData = (state: RootState) =>
  state.clickToCall.clickToCallData;
export const useClickToCallData = () => {
  const ClickToCallData = useAppSelector(selectClickToCallData);
  return useMemo(() => ClickToCallData, [ClickToCallData]);
};

export const selectSingleClickToCall = (state: RootState) =>
  state.clickToCall.singleClickToCallData;
export const useSingleClickToCall = () => {
  const singleClickToCallData = useAppSelector(selectSingleClickToCall);
  return useMemo(() => singleClickToCallData, [singleClickToCallData]);
};
