import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";
import {
    createDnc,
    deleteDnc,
    dnc,
    searchDnc,
    singleDnc,
    updateDnc,
    updateDncStatus,
    allDnc,
    importDnc,
} from "@/redux/services/tenant-admin/dncServices";

// TYPES IMPORT
import { OptionTypes } from "@/types/formTypes";

interface InitialState {
    isLoading: boolean;
    dncData: any;
    getSingleDnc: any;
    singleDncData: any;
    dncOptions: OptionTypes[];
}

const initialState: InitialState = {
    isLoading: true,
    dncData: {},
    getSingleDnc: {},
    singleDncData: {},
    dncOptions: [],
};

export const dncGet = createAsyncThunk("dnc/get", async (params: any) => {
    return await dnc(params);

});

export const dncSingleGet = createAsyncThunk("dnc/single-get", async (id: string) => {
  return await singleDnc(id);
});
  

export const dncSearch = createAsyncThunk("dnc/search", async (params: any) => {
    return await searchDnc(params);
});

export const dncCreate = createAsyncThunk(
    "dnc/create",
    async (payload: any) => {
        return await createDnc(payload);
    }
);

export const dncUpdate = createAsyncThunk(
    "dnc/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
       return await updateDnc(id, rest);

    }
);

export const dncImport = createAsyncThunk(
    "dnc/import",
    async (payload: any) => {
        return await importDnc(payload);
    }
);

export const dncStatusUpdate = createAsyncThunk(
    "dnc-status/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateDncStatus(id, rest);
    }
);
export const dncDelete = createAsyncThunk("dnc/delete", async (id: string) => {
    return await deleteDnc(id);
});

export const dncOptionsGet = createAsyncThunk("dnc-options/get", async () => {
    return await allDnc();
});

const dncSlice = createSlice({
    name: "dnc",
    initialState,
    reducers: {
    updateSingleDncData: (state, action) => {
       
      state.singleDncData = action.payload ? action.payload : {};
    },
        clearDnc: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(dncGet.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(dncGet.fulfilled, (state, action: PayloadAction<any>) => {
                state.dncData = action.payload;
                state.isLoading = false;
            })
            .addCase(dncGet.rejected, (state) => {
                state.isLoading = false;
            });

        builder
            .addCase(dncSearch.pending, (state, action: PayloadAction<any>) => {
                state.isLoading = true;
            })
            .addCase(
                dncSearch.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.dncData = action.payload;
                    state.isLoading = false;
                }
            )
            .addCase(dncSearch.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
            });

        builder.addCase(
            dncOptionsGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                const data = action.payload?.data;
                state.dncOptions = data?.map((val: any) => ({
                    value: val?.uuid,
                    label: val?.name,
                }));
            }
        );
    },
});

export default dncSlice.reducer;
export const { updateSingleDncData, clearDnc } =
dncSlice.actions;

export const selectIsLoading = (state: RootState) => state.dnc.isLoading;
export const useIsLoading = () => {
    const isLoading = useAppSelector(selectIsLoading);
    return useMemo(() => isLoading, [isLoading]);
};

export const selectDncData = (state: RootState) => state.dnc.dncData;
export const useDnc = () => {
    const dnc = useAppSelector(selectDncData);
    return useMemo(() => dnc, [dnc]);
};

export const selectSingleDnc = (state: RootState) =>
  state.dnc.singleDncData;
export const useSingleDnc = () => {
  const dnc = useAppSelector(selectSingleDnc);
  return useMemo(() => dnc, [dnc]);
};

export const selectDncOptions = (state: RootState) =>
    state.dnc.dncOptions;
export const useDncOptions = () => {
    const options = useAppSelector(selectDncOptions);
    return useMemo(() => options, [options]);
};
