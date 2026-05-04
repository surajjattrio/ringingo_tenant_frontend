import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";
import {
  allTenant,
  assignDid,
  createTenant,
  deleteTenant,
  searchTenant,
  singleTenant,
  tenant,
  updateTenant,
  updateTenantStatus,
  createTenantPersonalize,
  getTenantPersonalize,
  syncWabaTenant,
} from "../../services/master-admin/tenantSevice";

interface InitialState {
  isLoading: boolean;
  tenantData: any;
  allTenantData: any;
  tenantOptions: any;
  allHeaderTenantData: any;
}

const initialState: InitialState = {
  isLoading: false,
  tenantData: [],
  allTenantData: [],
  tenantOptions: [],
  allHeaderTenantData: [],
};

export const tenantGet = createAsyncThunk("tenant/get", async (params: any) => {
  return await tenant(params);
});

export const tenantSingleGet = createAsyncThunk(
  "tenant/single-get",
  async (id: string) => {
    return await singleTenant(id);
  }
);

export const tenantGetAll = createAsyncThunk("tenant/getAll", async () => {
  return await allTenant();
});

export const tenantHeaderGetAll = createAsyncThunk(
  "tenant/header-getAll",
  async (params: any) => {
    return await tenant(params);
  }
);

export const tenantSearch = createAsyncThunk(
  "tenant/search",
  async (payload: any) => {
    return await searchTenant(payload);
  }
);

export const tenantCreate = createAsyncThunk(
  "tenant/create",
  async (payload: any) => {
    return await createTenant(payload);
  }
);

export const tenantUpdate = createAsyncThunk(
  "tenant/update",
  async (payload: any) => {
    const { id, ...rest } = payload;
    return await updateTenant(id, rest);
  }
);

export const tenantStatusUpdate = createAsyncThunk(
  "tenant-status/update",
  async (payload: any) => {
    const { id, ...rest } = payload;
    return await updateTenantStatus(id, rest);
  }
);

export const tenantDelete = createAsyncThunk(
  "tenant/delete",
  async (id: string) => {
    return await deleteTenant(id);
  }
);

export const tenantOptionsGet = createAsyncThunk(
  "tenant-options/getAll",
  async () => {
    return await allTenant();
  }
);

export const didAssign = createAsyncThunk(
  "tenant/assign-did",
  async (payload: any) => {
    const { id, ...rest } = payload;
    return await assignDid(id, rest);
  }
);

export const createTenantPersonalization = createAsyncThunk(
  "tenant/tenantpersonalization",
  async (payload: any) => {
    return await createTenantPersonalize(payload);
  }
);

export const getTenantPersonalization = createAsyncThunk(
  "tenant/tenantpersonalization",
  async (domain: string) => {
    return await getTenantPersonalize(domain);
  }
);

export const tenantSyncWaba = createAsyncThunk(
  "tenant/sync-waba",
  async (id: string) => {
    return await syncWabaTenant(id);
  }
);

const prepareData = (payload: any) => {
  const data = payload?.data;
  const count = payload?.count;
  const newData = data?.map((val: any) => ({
    ...val,
    outgoing_rule: val?.outgoing_rule?.[0]?.name || "",
    country_name: val?.country?.[0]?.country || "",
    tenant_role_name: val?.roles?.[0]?.role_name || ""
  }));
  return { data: newData, count };
};

const tenantSlice = createSlice({
  name: "tenant",
  initialState,
  reducers: {
    clearTenant: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(tenantGet.pending, (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      })
      .addCase(tenantGet.fulfilled, (state, action: PayloadAction<any>) => {
        state.tenantData = prepareData(action.payload);
        state.isLoading = false;
      })
      .addCase(tenantGet.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
      });

    builder
      .addCase(tenantSearch.pending, (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      })
      .addCase(tenantSearch.fulfilled, (state, action: PayloadAction<any>) => {
        state.tenantData = prepareData(action.payload);
        state.isLoading = false;
      })
      .addCase(tenantSearch.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
      });
    builder.addCase(tenantGetAll.fulfilled, (state, action) => {
      state.allTenantData = action.payload.data;
    });

    builder.addCase(tenantOptionsGet.fulfilled, (state, action) => {
      const data = action.payload?.data;
      state.tenantOptions = data?.map((val: any) => ({
        value: val?.uuid,
        label: val?.tenant_name,
      }));
    });

    builder.addCase(tenantHeaderGetAll.fulfilled, (state, action) => {
      state.allHeaderTenantData = action.payload.data;
    });
  },
});

export default tenantSlice.reducer;
export const { clearTenant } = tenantSlice.actions;

export const selectIsLoading = (state: RootState) => state.tenant.isLoading;
export const useIsLoading = () => {
  const isLoading = useAppSelector(selectIsLoading);
  return useMemo(() => isLoading, [isLoading]);
};

export const selectTenantData = (state: RootState) => state.tenant.tenantData;
export const useTenantData = () => {
  const tenantData = useAppSelector(selectTenantData);
  return useMemo(() => tenantData, [tenantData]);
};

export const selectAllTenantData = (state: RootState) =>
  state.tenant.allTenantData;
export const useAllTenantData = () => {
  const allTenantData = useAppSelector(selectAllTenantData);
  return useMemo(() => allTenantData, [allTenantData]);
};

export const selectTenantOptions = (state: RootState) =>
  state.tenant.tenantOptions;
export const useTenantOptions = () => {
  const options = useAppSelector(selectTenantOptions);
  return useMemo(() => options, [options]);
};

export const selectAllHeaderTenantData = (state: RootState) =>
  state.tenant.allHeaderTenantData;
export const useAllHeaderTenantData = () => {
  const allHeaderTenantData = useAppSelector(selectAllHeaderTenantData);
  return useMemo(() => allHeaderTenantData, [allHeaderTenantData]);
};

