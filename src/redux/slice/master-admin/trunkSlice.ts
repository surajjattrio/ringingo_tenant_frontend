import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";
import {
  allTrunk,
  assignTrunk,
  createTrunk,
  deleteTrunk,
  searchTrunk,
  singleTrunk,
  trunk,
  updateTrunk,
  updateTrunkStatus,
} from "../../services/master-admin/trunkSevice";

interface InitialState {
  isLoading: boolean;
  trunkData: any;
  trunkOptions: any;
}

const initialState: InitialState = {
  isLoading: false,
  trunkData: [],
  trunkOptions: [],
};

export const trunkGet = createAsyncThunk("trunk/get", async (params: any) => {
  return await trunk(params);
});

export const trunkSingleGet = createAsyncThunk(
  "trunk/single-get",
  async (id: string) => {
    return await singleTrunk(id);
  }
);

export const trunkSearch = createAsyncThunk(
  "trunk/search",
  async (payload: any) => {
    return await searchTrunk(payload);
  }
);

export const trunkCreate = createAsyncThunk(
  "trunk/create",
  async (payload: any) => {
    return await createTrunk(payload);
  }
);

export const trunkUpdate = createAsyncThunk(
  "trunk/update",
  async (payload: any) => {
    const { id, ...rest } = payload;
    return await updateTrunk(id, rest);
  }
);

export const trunkStatusUpdate = createAsyncThunk(
  "trunk-status/update",
  async (payload: any) => {
    const { id, ...rest } = payload;
    return await updateTrunkStatus(id, rest);
  }
);

export const trunkAssign = createAsyncThunk(
  "trunk/assign",
  async (payload: any) => {
    const { id, ...rest } = payload;
    return await assignTrunk(id, rest);
  }
);

export const trunkDelete = createAsyncThunk(
  "trunk/delete",
  async (id: string) => {
    return await deleteTrunk(id);
  }
);

export const trunkOptionsGet = createAsyncThunk(
  "trunk-options/get",
  async () => {
    return await allTrunk();
  }
);

const prepareData = (payload: any) => {
  const data = payload?.data;
  const count = payload?.count;
  const newData = data?.map((val: any) => ({
    ...val,
    tenant_name: val?.tenant?.[0]?.tenant_name || "",
    sip_profile_name: val?.["sip-profile"]?.[0]?.name || "",
    disabled: val?.created_flag === "1",
  }));
  return { data: newData, count };
};

const trunkSlice = createSlice({
  name: "trunk",
  initialState,
  reducers: {
    clearTrunk: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(trunkGet.pending, (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      })
      .addCase(trunkGet.fulfilled, (state, action: PayloadAction<any>) => {
        state.trunkData = prepareData(action.payload)
        state.isLoading = false;
      })
      .addCase(trunkGet.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
      });

    builder
      .addCase(trunkSearch.pending, (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      })
      .addCase(trunkSearch.fulfilled, (state, action: PayloadAction<any>) => {
        state.trunkData =  prepareData(action.payload)
        state.isLoading = false;
      })
      .addCase(trunkSearch.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
      });

    builder.addCase(
      trunkOptionsGet.fulfilled,
      (state, action: PayloadAction<any>) => {
        const data = action.payload?.data;
        state.trunkOptions = data?.map((val: any) => ({
          value: val?.uuid,
          label: val?.name,
        }));
      }
    );
  },
});

export default trunkSlice.reducer;
export const { clearTrunk } = trunkSlice.actions;

export const selectIsLoading = (state: RootState) => state.trunk.isLoading;
export const useIsLoading = () => {
  const isLoading = useAppSelector(selectIsLoading);
  return useMemo(() => isLoading, [isLoading]);
};

export const selectTrunkData = (state: RootState) => state.trunk.trunkData;
export const useTrunkData = () => {
  const trunkData = useAppSelector(selectTrunkData);
  return useMemo(() => trunkData, [trunkData]);
};

export const selectTrunkOptions = (state: RootState) =>
  state.trunk.trunkOptions;
export const useTrunkOptions = () => {
  const options = useAppSelector(selectTrunkOptions);
  return useMemo(() => options, [options]);
};
