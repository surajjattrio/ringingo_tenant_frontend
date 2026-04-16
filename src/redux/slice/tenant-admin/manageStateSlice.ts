import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";

// TYPES IMPORT
import { OptionTypes } from "@/types/formTypes";

import { state, createState, deleteState, searchState, singleState, updateState, updateStateStatus, allState, importState, statusState, } from "@/redux/services/tenant-admin/manageStateServices";

interface InitialState {
    isLoading: boolean;
    stateData: any;
    getSingleState: any;
    singleStateData: any;
    stateOptions: OptionTypes[];
}

const initialState: InitialState = {
    isLoading: true,
    stateData: {},
    getSingleState: {},
    singleStateData: {},
    stateOptions: [],
};

export const stateGet = createAsyncThunk("state/get", async (params: any) => {
    return await state(params);

});

export const stateSingleGet = createAsyncThunk("state/single-get", async (id: string) => {
    return await singleState(id);
});


export const stateSearch = createAsyncThunk("state/search", async (params: any) => {
    return await searchState(params);
});

export const stateCreate = createAsyncThunk(
    "state/create",
    async (payload: any) => {
        return await createState(payload);
    }
);

export const stateUpdate = createAsyncThunk(
    "state/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateState(id, rest);

    }
);

export const stateImport = createAsyncThunk(
    "state/import",
    async (payload: any) => {
        return await importState(payload);
    }
);

export const stateStatusUpdate = createAsyncThunk(
    "state-status/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateStateStatus(id, rest);
    }
);
export const stateDelete = createAsyncThunk("state/delete", async (id: string) => {
    return await deleteState(id);
});
export const stateStatus = createAsyncThunk("state/update-by-status", async (payload: any) => {
    const { id, ...rest } = payload;
    return await statusState(id, rest);
});
export const stateOptionsGet = createAsyncThunk("state-options/get", async () => {
    return await allState();
});

const stateSlice = createSlice({
    name: "state",
    initialState,
    reducers: {
        updateSingleStateData: (state, action) => {

            state.singleStateData = action.payload ? action.payload : {};
        },
        clearState: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(stateGet.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(stateGet.fulfilled, (state, action: PayloadAction<any>) => {
                state.stateData = action.payload;
                state.isLoading = false;
            })
            .addCase(stateGet.rejected, (state) => {
                state.isLoading = false;
            });

        builder
            .addCase(stateSearch.pending, (state, action: PayloadAction<any>) => {
                state.isLoading = true;
            })
            .addCase(
                stateSearch.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.stateData = action.payload;
                    state.isLoading = false;
                }
            )
            .addCase(stateSearch.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
            });

        builder.addCase(
            stateOptionsGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                const data = action.payload?.data;
                state.stateOptions = data?.map((val: any) => ({
                    value: val?.uuid,
                    label: val?.state_code,
                }));
            }
        );
    },
});

export default stateSlice.reducer;
export const { updateSingleStateData, clearState } =
    stateSlice.actions;

export const selectIsLoading = (state: RootState) => state.state.isLoading;
export const useIsLoading = () => {
    const isLoading = useAppSelector(selectIsLoading);
    return useMemo(() => isLoading, [isLoading]);
};

export const selectStateData = (state: RootState) => state.state.stateData;
export const useStates = () => {
    const state = useAppSelector(selectStateData);
    return useMemo(() => state, [state]);
};

export const selectSingleState = (state: RootState) =>
    state.state.singleStateData;
export const useSingleState = () => {
    const state = useAppSelector(selectSingleState);
    return useMemo(() => state, [state]);
};

export const selectStateOptions = (state: RootState) =>
    state.state.stateOptions;
export const useStateOptions = () => {
    const options = useAppSelector(selectStateOptions);
    return useMemo(() => options, [options]);
};
