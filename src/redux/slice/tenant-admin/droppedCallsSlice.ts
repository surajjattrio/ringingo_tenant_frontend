import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import {
    allDroppedCalls,
    searchDroppedCalls,
    droppedCalls,
} from "@/redux/services/tenant-admin/droppedCallsServices";
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";

// TYPES IMPORT
import { OptionTypes } from "@/types/formTypes";

interface InitialState {
    isLoading: boolean;
    droppedCallsData: any;
    allDroppedCallsData: any;
    droppedCallsOptions: OptionTypes[];
}

const initialState: InitialState = {
    isLoading: false,
    droppedCallsData: {},
    allDroppedCallsData: {},
    droppedCallsOptions: [],
};

export const droppedCallsGet = createAsyncThunk(
    "droppedCalls/get",
    async (params: any) => {
        return await droppedCalls(params);
    }
);

export const droppedCallsSearch = createAsyncThunk(
    "droppedCalls/search",
    async (params: any) => {
        return await searchDroppedCalls(params);
    }
);

export const droppedCallsAllSearch = createAsyncThunk(
    "droppedCalls-all/search",
    async (params: any) => {
        params.callstate = 'drop';
        return await searchDroppedCalls(params);
    }
);

export const droppedCallsAllGet = createAsyncThunk(
    "droppedCalls-all/get",
    async (params: any) => {
        params.callstate = 'drop';
        return await allDroppedCalls(params);
    }
);

export const droppedCallsOptionsGet = createAsyncThunk(
    "droppedCalls/options",
    async (params: any) => {
        return await allDroppedCalls(params);
    }
);

// Helper function to prepare data
const prepareData = (data: any) => {
    if (!data) return {};
    return {
        data: data?.data || [],
        count: data?.count || 0,
        statusCode: data?.statusCode || 200,
        message: data?.message || "",
    };
};

const droppedCallsSlice = createSlice({
    name: "droppedCalls",
    initialState,
    reducers: {
        clearDroppedCalls: () => initialState,
    },
    extraReducers: (builder) => {
        builder.addCase(
            droppedCallsGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.droppedCallsData = prepareData(action.payload);
                state.isLoading = false;
            }
        );

        builder.addCase(
            droppedCallsSearch.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.droppedCallsData = prepareData(action.payload);
                state.isLoading = false;
            }
        );

        builder.addCase(
            droppedCallsAllGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.allDroppedCallsData = prepareData(action.payload);
            }
        );

        builder.addCase(
            droppedCallsAllSearch.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.allDroppedCallsData = prepareData(action.payload);
            }
        );

        builder.addCase(
            droppedCallsOptionsGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                const data = action.payload?.data;
                state.droppedCallsOptions = data?.map((val: any) => ({
                    value: val?.uuid,
                    label: val?.name,
                }));
            }
        );
    },
});

export default droppedCallsSlice.reducer;

// Selectors
export const selectDroppedCalls = (state: RootState) =>
    state.droppedCalls.droppedCallsData;
export const useDroppedCalls = () => {
    const droppedCalls = useAppSelector(selectDroppedCalls);
    return useMemo(() => droppedCalls, [droppedCalls]);
};

export const selectAllDroppedCalls = (state: RootState) =>
    state.droppedCalls.allDroppedCallsData;
export const useAllDroppedCalls = () => {
    const allDroppedCalls = useAppSelector(selectAllDroppedCalls);
    return useMemo(() => allDroppedCalls, [allDroppedCalls]);
};