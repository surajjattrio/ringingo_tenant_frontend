import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";

// TYPES IMPORT
import { OptionTypes } from "@/types/formTypes";
import {
  allTenantDisposition,
  createTenantDisposition,
  deleteTenantDisposition,
  tenantDisposition,
  searchTenantDisposition,
  singleTenantDisposition,
  updateTenantDisposition,
  updateTenantDispositionStatus,
} from "@/redux/services/tenant-admin/tenantDispositionServices";

interface InitialState {
  isLoading: boolean;
  dispositionData: any;
  allDispositionData: any;
  getSingleDisposition: any;
  singleDispositionData: any;
  dispositionOptions: OptionTypes[];
}

const initialState: InitialState = {
  isLoading: false,
  dispositionData: [],
  allDispositionData: [],
  getSingleDisposition: {},
  singleDispositionData: {},
  dispositionOptions: [],
};

export const tenantDispositionGet = createAsyncThunk(
  "tenant-disposition/get",
  async (params: any) => {
    return await tenantDisposition(params);
  }
);

export const tenantDispositionSingleGet = createAsyncThunk(
  "tenant-disposition/single-get",
  async (id: string) => {
    return await singleTenantDisposition(id);
  }
);

export const tenantDispositionSearch = createAsyncThunk(
  "tenant-Disposition/search",
  async (payload: any) => {
    return await searchTenantDisposition(payload);
  }
);

export const tenantDispositionCreate = createAsyncThunk(
  "tenant-disposition/create",
  async (payload: any) => {
    return await createTenantDisposition(payload);
  }
);

export const tenantDispositionUpdate = createAsyncThunk(
  "tenant-disposition/update",
  async (payload: any) => {
    const { id, ...rest } = payload;
    return await updateTenantDisposition(id, rest);
  }
);

export const tenantDispositionStatusUpdate = createAsyncThunk(
  "tenant-disposition-status/update",
  async (payload: any) => {
    const { id, ...rest } = payload;
    return await updateTenantDispositionStatus(id, rest);
  }
);

export const tenantDispositionDelete = createAsyncThunk(
  "tenant-disposition/delete",
  async (id: string) => {
    return await deleteTenantDisposition(id);
  }
);

export const tenantDispositionOptionsGet = createAsyncThunk(
  "tenant-disposition-options/getAll",
  async () => {
    return await allTenantDisposition();
  }
);

const tenantDispositionSlice = createSlice({
  name: "tenant-disposition",
  initialState,
  reducers: {
    updateSingleTenantDispositionData: (state, action) => {
      state.singleDispositionData = action.payload ? action.payload : {};
    },
    clearTenantDisposition: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(tenantDispositionGet.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(
        tenantDispositionGet.fulfilled,
        (state, action: PayloadAction<any>) => {
          const data = action.payload?.data;
          const newData = data?.map((val: any) => ({
            ...val,

            uuid: val.disposition_uuid,

            disabled: val?.created_flag === "0",
            //action: val?.created_flag === "0",
            name:
              val?.created_flag === "1" ? val?.name : val?.name + " (admin)",
          }));

          state.dispositionData = {
            count: action.payload?.count,
            data: newData,
          };
          state.isLoading = false;
        }
      )

      .addCase(
        tenantDispositionGet.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
        }
      );

    builder
      .addCase(
        tenantDispositionSearch.pending,
        (state, action: PayloadAction<any>) => {
          state.isLoading = true;
        }
      )

      .addCase(
        tenantDispositionSearch.fulfilled,
        (state, action: PayloadAction<any>) => {
          const data = action.payload?.data;
          const count = action.payload?.count;
          const newData = data?.map((val: any) => ({
            ...val,

            uuid: val.disposition_uuid,
            disabled: val?.created_flag === "0",
            name:
              val?.created_flag === "0" ? val?.name + " (admin)" : val?.name,
          }));
          state.dispositionData = { data: newData, count };
          state.isLoading = false;
        }
      )

      .addCase(
        tenantDispositionSearch.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
        }
      );

    builder.addCase(
      tenantDispositionOptionsGet.fulfilled,
      (state, action: PayloadAction<any>) => {
        const data = action.payload?.data?.length ? action.payload?.data : [];
        state.dispositionOptions = data?.map((val: any) => ({
          value: val.disposition_uuid,
          children: val.children,
          has_children: val.children.length > 0 ? true : false,
          label: `${val?.name}${val?.created_flag === "0" ? " (admin)" : ""}`,
        }));
      }
    );
  },
});

export default tenantDispositionSlice.reducer;

export const { updateSingleTenantDispositionData, clearTenantDisposition } =
  tenantDispositionSlice.actions;

export const selectIsLoading = (state: RootState) =>
  state.tenantDisposition.isLoading;
export const useIsLoading = () => {
  const isLoading = useAppSelector(selectIsLoading);
  return useMemo(() => isLoading, [isLoading]);
};

export const selectTenantDispositionData = (state: RootState) =>
  state.tenantDisposition.dispositionData;
export const useTenantDispositionData = () => {
  const tenantDispositionData = useAppSelector(selectTenantDispositionData);
  return useMemo(() => tenantDispositionData, [tenantDispositionData]);
};

export const selectSingleTenantDisposition = (state: RootState) =>
  state.tenantDisposition.singleDispositionData;
export const useSingleTenantDisposition = () => {
  const tenantDispositionData = useAppSelector(selectSingleTenantDisposition);
  return useMemo(() => tenantDispositionData, [tenantDispositionData]);
};

export const selectTenantDispositionOptions = (state: RootState) =>
  state.tenantDisposition.dispositionOptions;
export const useTenantDispositionOptions = () => {
  const options = useAppSelector(selectTenantDispositionOptions);
  return useMemo(() => options, [options]);
};
