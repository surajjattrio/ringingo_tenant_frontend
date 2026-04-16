import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";

// TYPES IMPORT
import { OptionTypes } from "@/types/formTypes";
import {
  allDisposition,
  createDisposition,
  deleteDisposition,
  disposition,
  parentDisposition,
  searchDisposition,
  singleDisposition,
  updateDisposition,
  updateDispositionStatus,
} from "@/redux/services/master-admin/dispositionServices";

interface InitialState {
  isLoading: boolean;
  dispositionData: any;
  allDispositionData: any;
  singleDispositionData: any;
  dispositionOptions: OptionTypes[];
}

const initialState: InitialState = {
  isLoading: false,
  dispositionData: [],
  allDispositionData: [],
  singleDispositionData: {},
  dispositionOptions: [],
};

export const dispositionGet = createAsyncThunk(
  "disposition/get",
  async (params: any) => {
    return await disposition(params);
  }
);

export const parentDispositionGet = createAsyncThunk(
  "disposition/parent-get",
  async (params: any) => {
    return await parentDisposition(params);
  }
);

export const dispositionSingleGet = createAsyncThunk(
  "disposition/single-get",
  async (id: string) => {
    return await singleDisposition(id);
  }
);

export const dispositionSearch = createAsyncThunk(
  "disposition/search",
  async (payload: any) => {
    return await searchDisposition(payload);
  }
);

export const dispositionCreate = createAsyncThunk(
  "disposition/create",
  async (payload: any) => {
    return await createDisposition(payload);
  }
);

export const dispositionUpdate = createAsyncThunk(
  "disposition/update",
  async (payload: any) => {
    const { id, ...rest } = payload;
    return await updateDisposition(id, rest);
  }
);

export const dispositionStatusUpdate = createAsyncThunk(
  "disposition-status/update",
  async (payload: any) => {
    const { id, ...rest } = payload;
    return await updateDispositionStatus(id, rest);
  }
);

export const dispositionDelete = createAsyncThunk(
  "disposition/delete",
  async (id: string) => {
    return await deleteDisposition(id);
  }
);

export const dispositionOptionsGet = createAsyncThunk(
  "disposition-options/getAll",
  async () => {
    return await allDisposition({ list: "all" });
  }
);

const dispositionSlice = createSlice({
  name: "disposition",
  initialState,
  reducers: {
    updateSingleDispositionData: (state, action) => {
      state.singleDispositionData = action.payload ? action.payload : {};
    },
    clearDisposition: () => initialState,
  },
  extraReducers: (builder) => {
    builder

      .addCase(dispositionGet.pending, (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      })

      .addCase(
        dispositionGet.fulfilled,
        (state, action: PayloadAction<any>) => {
          const data = action.payload?.data;
          const count = action.payload?.count;
          const newData = data?.map((val: any) => ({
            ...val,
            name: val.name,
            uuid: val.disposition_uuid,
          }));
          state.dispositionData = { data: newData, count };
          state.isLoading = false;
        }
      )

      .addCase(dispositionGet.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
      });

    builder
      .addCase(
        dispositionSearch.pending,
        (state, action: PayloadAction<any>) => {
          state.isLoading = true;
        }
      )

      .addCase(
        dispositionSearch.fulfilled,
        (state, action: PayloadAction<any>) => {
          const data = action.payload?.data;
          const count = action.payload?.count;
          const newData = data?.map((val: any) => ({
            ...val,
            name: val.name,
            uuid: val.disposition_uuid,
            //  uuid: val.uuid[0]?.uuid,
          }));
          state.dispositionData = { data: newData, count };
          state.isLoading = false;
        }
      )

      .addCase(
        dispositionSearch.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
        }
      );

    builder.addCase(
      dispositionOptionsGet.fulfilled,
      (state, action: PayloadAction<any>) => {
        const data = action.payload?.data?.length ? action.payload?.data : [];
        state.dispositionOptions = data?.map((val: any) => ({
          value: val.disposition_uuid,
          label: val?.name,
          children: val?.children,
          parent_disposition: val?.parent_disposition,
        }));
      }
    );
  },
});

export default dispositionSlice.reducer;

export const { updateSingleDispositionData, clearDisposition } =
  dispositionSlice.actions;

export const selectIsLoading = (state: RootState) =>
  state.disposition.isLoading;
export const useIsLoading = () => {
  const isLoading = useAppSelector(selectIsLoading);
  return useMemo(() => isLoading, [isLoading]);
};

export const selectDispositionData = (state: RootState) =>
  state.disposition.dispositionData;
export const useDispositionData = () => {
  const dispositionData = useAppSelector(selectDispositionData);
  return useMemo(() => dispositionData, [dispositionData]);
};

export const selectSingleDisposition = (state: RootState) =>
  state.disposition.singleDispositionData;
export const useSingleDisposition = () => {
  const dispositionData = useAppSelector(selectSingleDisposition);
  return useMemo(() => dispositionData, [dispositionData]);
};

export const selectAllDispositionData = (state: RootState) =>
  state.disposition.allDispositionData;
export const useAllDispositionData = () => {
  const allDispositionData = useAppSelector(selectAllDispositionData);
  return useMemo(() => allDispositionData, [allDispositionData]);
};

export const selectDispositionOptions = (state: RootState) =>
  state.disposition.dispositionOptions;
export const useDispositionOptions = () => {
  const dispositionOptions = useAppSelector(selectDispositionOptions);
  return useMemo(() => dispositionOptions, [dispositionOptions]);
};
