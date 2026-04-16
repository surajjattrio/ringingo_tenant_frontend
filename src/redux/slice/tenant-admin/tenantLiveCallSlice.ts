import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";
import {
    allLiveCall,
    bargeCall,
    liveCall,
    monitoringCall,
    whisperCall,
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

export const tenantLiveCallGet = createAsyncThunk(
    "tenantLiveCall/get",
    async (params: any) => {
        return await liveCall(params);
    }
);

export const tenantLiveCallOptionsGet = createAsyncThunk(
    "tenantLiveCall-options/get",
    async () => {
        return await allLiveCall();
    }
);

export const tenantCallMonitoring = createAsyncThunk(
    "tenantLiveCall/monitoring",
    async (payload: any) => {
        return await monitoringCall(payload);
    }
);

export const tenantCallBarge = createAsyncThunk(
    "tenantLiveCall/barge",
    async (payload: any) => {
        return await bargeCall(payload);
    }
);

export const tenantCallWhisper = createAsyncThunk(
    "tenantLiveCall/whisper",
    async (payload: any) => {
        return await whisperCall(payload);
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

const tenantLiveCallSlice = createSlice({
    name: "tenantLiveCall",
    initialState,
    reducers: {
        clearTenantLiveCall: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(tenantLiveCallGet.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(
                tenantLiveCallGet.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.liveCallData = prepareData(action.payload);
                    state.isLoading = false;
                }
            )
            .addCase(tenantLiveCallGet.rejected, (state) => {
                state.isLoading = false;
            });

        builder.addCase(
            tenantLiveCallOptionsGet.fulfilled,
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

export default tenantLiveCallSlice.reducer;
export const { clearTenantLiveCall } = tenantLiveCallSlice.actions;

export const selectIsLoading = (state: RootState) =>
    state.tenantLiveCall.isLoading;
export const useIsLoading = () => {
    const isLoading = useAppSelector(selectIsLoading);
    return useMemo(() => isLoading, [isLoading]);
};

export const selectTenantLiveCall = (state: RootState) =>
    state.tenantLiveCall.liveCallData;
export const useTenantLiveCall = () => {
    const tenantTenantLiveCall = useAppSelector(selectTenantLiveCall);
    return useMemo(() => tenantTenantLiveCall, [tenantTenantLiveCall]);
};

export const selectTenantLiveCallOptions = (state: RootState) =>
    state.tenantLiveCall.liveCallOptions;
export const useTenantLiveCallOptions = () => {
    const options = useAppSelector(selectTenantLiveCallOptions);
    return useMemo(() => options, [options]);
};
