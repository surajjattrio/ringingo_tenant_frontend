import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import {
  adminIpMapping,
  createAdminIpMapping,
  deleteAdminIpMapping,
  searchAdminIpMapping,
  updateAdminIpMapping,
  updateAdminIpMappingStatus,
} from "@/redux/services/master-admin/adminIpMappingServices";
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";

interface InitialState {
  adminIpMappingData: any;
  singleAdminIpMappingData: any;
}

const initialState: InitialState = {
  adminIpMappingData: {},
  singleAdminIpMappingData: {},
};

export const adminIpMappingGet = createAsyncThunk(
  "admin-ipMapping/get",
  async (params: any) => {
    return await adminIpMapping(params);
  }
);

export const adminIpMappingSearch = createAsyncThunk(
  "admin-ipMapping/search",
  async (params: any) => {
    return await searchAdminIpMapping(params);
  }
);

export const adminIpMappingCreate = createAsyncThunk(
  "admin-ipMapping/create",
  async (payload: any) => {
    return await createAdminIpMapping(payload);
  }
);

export const adminIpMappingUpdate = createAsyncThunk(
  "admin-ipMapping/update",
  async (payload: any) => {
    const { id, ...rest } = payload;
    return await updateAdminIpMapping(id, rest);
  }
);

export const adminIpMappingStatusUpdate = createAsyncThunk(
  "admin-ipMapping-status/update",
  async (payload: any) => {
    const { id, ...rest } = payload;
    return await updateAdminIpMappingStatus(id, rest);
  }
);
export const adminIpMappingDelete = createAsyncThunk(
  "admin-ipMapping/delete",
  async (id: string) => {
    return await deleteAdminIpMapping(id);
  }
);

const adminIpMappingSlice = createSlice({
  name: "adminIpMapping",
  initialState,
  reducers: {
    updateSingleAdminIpMappingData: (state, action) => {
      state.singleAdminIpMappingData = action.payload ? action.payload : {};
    },
    clearAdminIpMapping: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(
      adminIpMappingGet.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.adminIpMappingData = action.payload;
      }
    );
    builder.addCase(
      adminIpMappingSearch.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.adminIpMappingData = action.payload;
      }
    );
  },
});

export default adminIpMappingSlice.reducer;
export const { updateSingleAdminIpMappingData, clearAdminIpMapping } =
  adminIpMappingSlice.actions;

export const selectAdminIpMapping = (state: RootState) =>
  state.adminIpMapping.adminIpMappingData;
export const useAdminIpMappingData = () => {
  const adminIpMappingData = useAppSelector(selectAdminIpMapping);
  return useMemo(() => adminIpMappingData, [adminIpMappingData]);
};

export const selectSingleAdminIpMapping = (state: RootState) =>
  state.adminIpMapping.singleAdminIpMappingData;
export const useSingleAdminIpMapping = () => {
  const singleAdminIpMappingData = useAppSelector(selectSingleAdminIpMapping);
  return useMemo(() => singleAdminIpMappingData, [singleAdminIpMappingData]);
};
