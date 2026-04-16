import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";
import {
  allCallQueue,
  callQueue,
  createCallQueue,
  deleteCallQueue,
  searchCallQueue,
  singleCallQueue,
  updateCallQueue,
  updateCallQueueStatus,
} from "@/redux/services/tenant-admin/callQueueServices";

// TYPES IMPORT
import { ObjectOptionTypes, OptionTypes } from "@/types/formTypes";

interface InitialState {
  isLoading: boolean;
  callQueueData: any;
  callQueueOptions: OptionTypes[];
  allowedCallQueueOptions: ObjectOptionTypes[];
}

const initialState: InitialState = {
  isLoading: true,
  callQueueData: {},
  callQueueOptions: [],
  allowedCallQueueOptions: [],
};

export const callQueueGet = createAsyncThunk(
  "callQueue/get",
  async (params: any) => {
    return await callQueue(params);
  }
);

export const callQueueSearch = createAsyncThunk(
  "callQueue/search",
  async (params: any) => {
    return await searchCallQueue(params);
  }
);

export const callQueueSingleGet = createAsyncThunk(
  "callQueue/singleGet",
  async (id: string) => {
    return await singleCallQueue(id);
  }
);

export const callQueueCreate = createAsyncThunk(
  "callQueue/create",
  async (payload: any) => {
    return await createCallQueue(payload);
  }
);

export const callQueueUpdate = createAsyncThunk(
  "callQueue/update",
  async (payload: any) => {
    const { id, ...rest } = payload;
    return await updateCallQueue(id, rest);
  }
);

export const callQueueUpdateStatus = createAsyncThunk(
  "callQueue-status/update",
  async (payload: any) => {
    const { id, ...rest } = payload;
    return await updateCallQueueStatus(id, rest);
  }
);

export const callQueueDelete = createAsyncThunk(
  "callQueue/delete",
  async (id: string) => {
    return await deleteCallQueue(id);
  }
);

export const callQueueOptionsGet = createAsyncThunk(
  "call-queue-options/get",
  async () => {
    return await allCallQueue();
  }
);

export const callCenterCallQueueOptionsGet = createAsyncThunk(
  "call-center-call-queue-options/get",
  async () => {
    return await callQueue({ mode: "call-center" });
  }
);

export const allowedCallQueueOptionsGet = createAsyncThunk(
  "allowed-call-queue-options/get",
  async () => {
    return await allCallQueue();
  }
);

const callQueueSlice = createSlice({
  name: "callQueue",
  initialState,
  reducers: {
    clearCallQueue: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(callQueueGet.pending, (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      })
      .addCase(callQueueGet.fulfilled, (state, action: PayloadAction<any>) => {
        state.callQueueData = action.payload;
        state.isLoading = false;
      })
      .addCase(callQueueGet.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
      });

    builder
      .addCase(callQueueSearch.pending, (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      })
      .addCase(
        callQueueSearch.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.callQueueData = action.payload;
          state.isLoading = false;
        }
      )
      .addCase(
        callQueueSearch.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
        }
      );

    builder.addCase(
      callQueueOptionsGet.fulfilled,
      (state, action: PayloadAction<any>) => {
        const data = action.payload?.data;
        state.callQueueOptions =
          data?.map((val: any) => ({
            value: val?.uuid,
            label: val?.name,
          })) || [];
      }
    );

    builder.addCase(
      callCenterCallQueueOptionsGet.fulfilled,
      (state, action: PayloadAction<any>) => {
        const data = action.payload?.data;
        state.callQueueOptions =
          data?.map((val: any) => ({
            value: val?.uuid,
            label: val?.name,
          })) || [];
      }
    );

    builder.addCase(
      allowedCallQueueOptionsGet.fulfilled,
      (state, action: PayloadAction<any>) => {
        const data = action.payload?.data;
        state.allowedCallQueueOptions =
          data?.map((val: any) => ({
            value: {
              name: val?.name,
              uuid: val?.uuid,
            },
            label: val?.name,
          })) || [];
      }
    );
  },
});

export default callQueueSlice.reducer;
export const { clearCallQueue } = callQueueSlice.actions;

export const selectIsLoading = (state: RootState) => state.callQueue.isLoading;
export const useIsLoading = () => {
  const isLoading = useAppSelector(selectIsLoading);
  return useMemo(() => isLoading, [isLoading]);
};

export const selectcallQueue = (state: RootState) =>
  state.callQueue.callQueueData;
export const useCallQueue = () => {
  const callQueue = useAppSelector(selectcallQueue);
  return useMemo(() => callQueue, [callQueue]);
};

export const selectCallQueueOptions = (state: RootState) =>
  state.callQueue.callQueueOptions;
export const useCallQueueOptions = () => {
  const options = useAppSelector(selectCallQueueOptions);
  return useMemo(() => options, [options]);
};

export const selectAllowedCallQueueOptions = (state: RootState) =>
  state.callQueue.allowedCallQueueOptions;
export const useAllowedCallQueueOptions = () => {
  const allowedCallQueueOptions = useAppSelector(selectAllowedCallQueueOptions);
  return useMemo(() => allowedCallQueueOptions, [allowedCallQueueOptions]);
};
