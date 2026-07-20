import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";
import {
  createTenantWebhook,
  deleteTenantWebhook,
  tenantWebhookList,
  tenantWebhookLogs,
  tenantWebhookSingle,
  testTenantWebhook,
  updateTenantWebhook,
} from "@/redux/services/tenant-admin/tenantWebhookServices";

interface InitialState {
  isLoading: boolean;
  tenantWebhookData: any;
  isLogsLoading: boolean;
  tenantWebhookLogsData: any;
}

const initialState: InitialState = {
  isLoading: false,
  tenantWebhookData: {},
  isLogsLoading: false,
  tenantWebhookLogsData: {},
};

export const tenantWebhookGet = createAsyncThunk(
  "tenantWebhook/get",
  async (params: any) => {
    return await tenantWebhookList(params);
  }
);

export const tenantWebhookSingleGet = createAsyncThunk(
  "tenantWebhook/single-get",
  async (id: string) => {
    return await tenantWebhookSingle(id);
  }
);

export const tenantWebhookCreate = createAsyncThunk(
  "tenantWebhook/create",
  async (payload: any) => {
    return await createTenantWebhook(payload);
  }
);

export const tenantWebhookUpdate = createAsyncThunk(
  "tenantWebhook/update",
  async (payload: any) => {
    const { id, ...rest } = payload;
    return await updateTenantWebhook(id, rest);
  }
);

export const tenantWebhookDelete = createAsyncThunk(
  "tenantWebhook/delete",
  async (id: string) => {
    return await deleteTenantWebhook(id);
  }
);

export const tenantWebhookTest = createAsyncThunk(
  "tenantWebhook/test",
  async (payload: any) => {
    const { id, ...rest } = payload;
    return await testTenantWebhook(id, rest);
  }
);

export const tenantWebhookLogsGet = createAsyncThunk(
  "tenantWebhook-logs/get",
  async (params: any) => {
    return await tenantWebhookLogs(params);
  }
);

const tenantWebhookSlice = createSlice({
  name: "tenantWebhook",
  initialState,
  reducers: {
    clearTenantWebhook: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(tenantWebhookGet.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        tenantWebhookGet.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.tenantWebhookData = action.payload;
          state.isLoading = false;
        }
      )
      .addCase(tenantWebhookGet.rejected, (state) => {
        state.isLoading = false;
      });

    builder
      .addCase(tenantWebhookLogsGet.pending, (state) => {
        state.isLogsLoading = true;
      })
      .addCase(
        tenantWebhookLogsGet.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.tenantWebhookLogsData = action.payload;
          state.isLogsLoading = false;
        }
      )
      .addCase(tenantWebhookLogsGet.rejected, (state) => {
        state.isLogsLoading = false;
      });
  },
});

export default tenantWebhookSlice.reducer;
export const { clearTenantWebhook } = tenantWebhookSlice.actions;

export const selectIsLoading = (state: RootState) =>
  state.tenantWebhook.isLoading;
export const useIsLoading = () => {
  const isLoading = useAppSelector(selectIsLoading);
  return useMemo(() => isLoading, [isLoading]);
};

export const selectTenantWebhookData = (state: RootState) =>
  state.tenantWebhook.tenantWebhookData;
export const useTenantWebhookData = () => {
  const tenantWebhookData = useAppSelector(selectTenantWebhookData);
  return useMemo(() => tenantWebhookData, [tenantWebhookData]);
};

export const selectIsLogsLoading = (state: RootState) =>
  state.tenantWebhook.isLogsLoading;
export const useIsLogsLoading = () => {
  const isLogsLoading = useAppSelector(selectIsLogsLoading);
  return useMemo(() => isLogsLoading, [isLogsLoading]);
};

export const selectTenantWebhookLogsData = (state: RootState) =>
  state.tenantWebhook.tenantWebhookLogsData;
export const useTenantWebhookLogsData = () => {
  const tenantWebhookLogsData = useAppSelector(selectTenantWebhookLogsData);
  return useMemo(() => tenantWebhookLogsData, [tenantWebhookLogsData]);
};
