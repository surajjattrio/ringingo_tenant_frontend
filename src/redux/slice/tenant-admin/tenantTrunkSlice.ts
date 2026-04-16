import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";
import {
  allTenantTrunk,
  createTenantTrunk,
  deleteTenantTrunk,
  searchTenantTrunk,
  singleTenantTrunk,
  tenantTrunk,
  updateTenantTrunk,
  updateTenantTrunkStatus,
} from "@/redux/services/tenant-admin/tenantTrunkServices";

// TYPES IMPORT
import { OptionTypes } from "@/types/formTypes";

interface InitialState {
  isLoading: boolean;
  tenantTrunkData: any;
  tenantTrunkOptions: OptionTypes[];
}

const initialState: InitialState = {
  isLoading: false,
  tenantTrunkData: {},
  tenantTrunkOptions: [],
};

export const tenantTrunkGet = createAsyncThunk(
  "tenantTrunk/get",
  async (params: any) => {
    return await tenantTrunk(params);
  }
);

export const tenantTrunkSingleGet = createAsyncThunk(
  "tenantTrunk/single-get",
  async (id: string) => {
    return await singleTenantTrunk(id);
  }
);

export const tenantTrunkSearch = createAsyncThunk(
  "tenantTrunk/search",
  async (payload: any) => {
    return await searchTenantTrunk(payload);
  }
);

export const tenantTrunkCreate = createAsyncThunk(
  "tenantTrunk/create",
  async (payload: any) => {
    return await createTenantTrunk(payload);
  }
);

export const tenantTrunkUpdate = createAsyncThunk(
  "tenantTrunk/update",
  async (payload: any) => {
    const { id, ...rest } = payload;
    return await updateTenantTrunk(id, rest);
  }
);

export const tenantTrunkStatusUpdate = createAsyncThunk(
  "tenantTrunk-status/update",
  async (payload: any) => {
    const { id, ...rest } = payload;
    return await updateTenantTrunkStatus(id, rest);
  }
);

export const tenantTrunkDelete = createAsyncThunk(
  "tenantTrunk/delete",
  async (id: string) => {
    return await deleteTenantTrunk(id);
  }
);

export const tenantTrunkOptionsGet = createAsyncThunk(
  "tenantTrunk-options/get",
  async () => {
    return await allTenantTrunk();
  }
);

const prepareData = (payload: any) => {
  const data = payload?.data;
  const count = payload?.count;

  const newData = data?.map((val: any) => ({
      ...val,
      register:val?.register === "0" ? "Enabled" : "Disabled",
  }));
  return { data: newData, count };
};

const tenantTrunkSlice = createSlice({
  name: "tenantTrunk",
  initialState,
  reducers: {
    clearTenantTrunk: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(tenantTrunkGet.pending, (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      })
      .addCase(
        tenantTrunkGet.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.tenantTrunkData = prepareData(action.payload)
          state.isLoading = false;
        }
      )
      .addCase(tenantTrunkGet.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
      });

    builder
      .addCase(
        tenantTrunkSearch.pending,
        (state, action: PayloadAction<any>) => {
          state.isLoading = true;
        }
      )
      .addCase(
        tenantTrunkSearch.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.tenantTrunkData = prepareData(action.payload)
          state.isLoading = false;
        }
      )
      .addCase(
        tenantTrunkSearch.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
        }
      );

    builder.addCase(
      tenantTrunkOptionsGet.fulfilled,
      (state, action: PayloadAction<any>) => {
        const data = action.payload?.data;
        state.tenantTrunkOptions = data?.map((val: any) => ({
          value: val?.uuid,
          label: val?.name,
        }));
      }
    );
  },
});

export default tenantTrunkSlice.reducer;
export const { clearTenantTrunk } = tenantTrunkSlice.actions;

export const selectIsLoading = (state: RootState) =>
  state.tenantTrunk.isLoading;
export const useIsLoading = () => {
  const isLoading = useAppSelector(selectIsLoading);
  return useMemo(() => isLoading, [isLoading]);
};

export const selectTenantTrunkData = (state: RootState) =>
  state.tenantTrunk.tenantTrunkData;
export const useTenantTrunkData = () => {
  const tenantTrunkData = useAppSelector(selectTenantTrunkData);
  return useMemo(() => tenantTrunkData, [tenantTrunkData]);
};

export const selectTenantTrunkOptions = (state: RootState) =>
  state.tenantTrunk.tenantTrunkOptions;
export const useTenantTrunkOptions = () => {
  const options = useAppSelector(selectTenantTrunkOptions);
  return useMemo(() => options, [options]);
};
