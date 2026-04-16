import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";
import {
    allLiveCall,
    liveCall,
} from "@/redux/services/master-admin/liveCallServices";

// TYPES IMPORT
import { OptionTypes } from "@/types/formTypes";

interface InitialState {
    isLoading: boolean;
    liveCallData: any;
    liveCallOptions: OptionTypes[];
}

const initialState: InitialState = {
    isLoading: false,
    liveCallData: {},
    liveCallOptions: [],
};

export const liveCallGet = createAsyncThunk(
    "liveCall/get",
    async (params: any) => {
        return await liveCall(params);
    }
);

export const liveCallOptionsGet = createAsyncThunk(
    "liveCall-options/get",
    async () => {
        return await allLiveCall();
    }
);

const prepareData = (payload: any) => {
    const data = payload?.data;
    const count = payload?.count;
    const newData = data?.map((val: any) => ({
        ...val,
        caller_id_name_number: `${val?.callerIdName || ""} (${val?.callerIdNumber || ""
            })`,
    }));
    return { data: newData, count };
};

const liveCallSlice = createSlice({
    name: "liveCall",
    initialState,
    reducers: {
        clearLiveCall: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(liveCallGet.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(liveCallGet.fulfilled, (state, action: PayloadAction<any>) => {
                state.liveCallData = prepareData(action.payload);
                state.isLoading = false;
            })
            .addCase(liveCallGet.rejected, (state) => {
                state.isLoading = false;
            });

        builder.addCase(
            liveCallOptionsGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                const data = action.payload?.data;
                state.liveCallOptions = data?.map((val: any) => ({
                    value: val?.uuid,
                    label: val?.name,
                }));
            }
        );
    },
});

export default liveCallSlice.reducer;
export const { clearLiveCall } = liveCallSlice.actions;

export const selectIsLoading = (state: RootState) => state.liveCall.isLoading;
export const useIsLoading = () => {
    const isLoading = useAppSelector(selectIsLoading);
    return useMemo(() => isLoading, [isLoading]);
};

export const selectLiveCall = (state: RootState) => state.liveCall.liveCallData;
export const useLiveCall = () => {
    const liveCall = useAppSelector(selectLiveCall);
    return useMemo(() => liveCall, [liveCall]);
};

export const selectLiveCallOptions = (state: RootState) =>
    state.liveCall.liveCallOptions;
export const useLiveCallOptions = () => {
    const options = useAppSelector(selectLiveCallOptions);
    return useMemo(() => options, [options]);
};
