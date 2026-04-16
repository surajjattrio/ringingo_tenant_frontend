import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";

// TYPES IMPORT
import { OptionTypes } from "@/types/formTypes";
import {
  allIpMapping,
  createIpMapping,
  deleteIpMapping,
  ipMapping,
  searchIpMapping,
  updateIpMapping,
  updateIpMappingStatus,
} from "@/redux/services/tenant-admin/ipMappingServices";

interface InitialState {
  isLoading: boolean;
  ipMappingData: any;
  allIpMappingData: any;
  singleIpMappingData: any;
  ipMappingOptions: OptionTypes[];
}

const initialState: InitialState = {
  isLoading: false,
  ipMappingData: {},
  allIpMappingData: {},
  singleIpMappingData: {},
  ipMappingOptions: [],
};

export const ipMappingGet = createAsyncThunk(
  "ipMapping/get",
  async (params: any) => {
    return await ipMapping(params);
  }
);

export const ipMappingAllGet = createAsyncThunk(
  "ipMapping-all/get",
  async () => {
    const params = { fill: "all" };
    return await allIpMapping(params);
  }
);

export const ipMappingSearch = createAsyncThunk(
  "ipMapping/search",
  async (params: any) => {
    return await searchIpMapping(params);
  }
);

export const ipMappingCreate = createAsyncThunk(
  "ipMapping/create",
  async (payload: any) => {
    return await createIpMapping(payload);
  }
);

export const ipMappingUpdate = createAsyncThunk(
  "ipMapping/update",
  async (payload: any) => {
    const { id, ...rest } = payload;
    return await updateIpMapping(id, rest);
  }
);

export const ipMappingStatusUpdate = createAsyncThunk(
  "ipMapping-status/update",
  async (payload: any) => {
    const { id, ...rest } = payload;
    return await updateIpMappingStatus(id, rest);
  }
);
export const ipMappingDelete = createAsyncThunk(
  "ipMapping/delete",
  async (id: string) => {
    return await deleteIpMapping(id);
  }
);

export const ipMappingOptionsGet = createAsyncThunk(
  "ipMapping-options/get",
  async () => {
    return await allIpMapping();
  }
);

const ipMappingSlice = createSlice({
  name: "ipMapping",
  initialState,
  reducers: {
    updateSingleIpMappingData: (state, action) => {
      state.singleIpMappingData = action.payload ? action.payload : {};
    },
    clearIpMapping: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(ipMappingGet.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(ipMappingGet.fulfilled, (state, action: PayloadAction<any>) => {
        state.ipMappingData = action.payload;
        state.isLoading = false;
      })
      .addCase(ipMappingGet.rejected, (state) => {
        state.isLoading = false;
      });

    builder
      .addCase(ipMappingSearch.pending, (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      })
      .addCase(
        ipMappingSearch.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.ipMappingData = action.payload;
          state.isLoading = false;
        }
      )
      .addCase(
        ipMappingSearch.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
        }
      );

    builder.addCase(
      ipMappingAllGet.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.allIpMappingData = action.payload;
      }
    );
    builder.addCase(
      ipMappingOptionsGet.fulfilled,
      (state, action: PayloadAction<any>) => {
        const data = action.payload?.data;
        state.ipMappingOptions = data?.map((val: any) => ({
          value: val?.uuid,
          label: val?.name,
        }));
      }
    );
  },
});

export default ipMappingSlice.reducer;
export const { updateSingleIpMappingData, clearIpMapping } =
  ipMappingSlice.actions;

export const selectIsLoading = (state: RootState) => state.ipMapping.isLoading;
export const useIsLoading = () => {
  const isLoading = useAppSelector(selectIsLoading);
  return useMemo(() => isLoading, [isLoading]);
};

export const selectIpMapping = (state: RootState) =>
  state.ipMapping.ipMappingData;
export const useIpMapping = () => {
  const ipMapping = useAppSelector(selectIpMapping);
  return useMemo(() => ipMapping, [ipMapping]);
};

export const selectAllIpMapping = (state: RootState) =>
  state.ipMapping.allIpMappingData;
export const useAllIpMapping = () => {
  const allIpMapping = useAppSelector(selectAllIpMapping);
  return useMemo(() => allIpMapping, [allIpMapping]);
};

export const selectSingleIpMapping = (state: RootState) =>
  state.ipMapping.singleIpMappingData;
export const useSingleIpMapping = () => {
  const ipMapping = useAppSelector(selectSingleIpMapping);
  return useMemo(() => ipMapping, [ipMapping]);
};

export const selectIpMappingOptions = (state: RootState) =>
  state.ipMapping.ipMappingOptions;
export const useIpMappingOptions = () => {
  const options = useAppSelector(selectIpMappingOptions);
  return useMemo(() => options, [options]);
};
