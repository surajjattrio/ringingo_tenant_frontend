import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import {
    allMissedCall,
    searchMissedCall,
    missedCall,
   // singleUserInfo,
} from "@/redux/services/tenant-admin/missedCallServices";
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";

// TYPES IMPORT
import { OptionTypes } from "@/types/formTypes";

interface InitialState {
    isLoading: boolean;
    missedCallData: any;
    allMissedCallData: any;
    missedCallOptions: OptionTypes[];
}

const initialState: InitialState = {
    isLoading: false,
    missedCallData: {},
    allMissedCallData: {},
    missedCallOptions: [],
};

export const missedCallGet = createAsyncThunk(
    "missedCall/get",
    async (params: any) => {
        
        return await missedCall(params);
    }
);

export const missedCallSearch = createAsyncThunk(
    "missedCall/search",
    async (params: any) => {
        return await searchMissedCall(params);
    }
);

export const missedCallAllSearch = createAsyncThunk(
    "missedCall-all/search",
    async (params: any) => {
        params.callstate='missed';
        return await searchMissedCall(params);
    }
);

export const missedCallAllGet = createAsyncThunk(
    "missedCall-all/get",
    async (params: any) => {
        params.callstate='missed';
        return await allMissedCall(params);
    }
);

export const missedCallOptionsGet = createAsyncThunk(
    "missedCall-options/get",
    async () => {
        return await allMissedCall();
    }
);

// export const getSingleUserInfo = createAsyncThunk(
//     "userPerformance/singleInfo",
//     async (params: any) => {
//         const { id, ...rest } = params;
//         return await singleUserInfo(id, rest);
//     }
// );

const prepareData = (payload: any) => {
    const data = payload?.data;
    const count = payload?.count;
    const newData = data?.map((val: any) => {
        let pbxFeatureName = "";
        // Check if pbx_feature is call_queue
        if (val?.pbx_feature === "call_queue") {
            pbxFeatureName = val?.call_queue?.[0]?.name || "";
        } else if (val?.pbx_feature === "ring_group") {
            // Check if pbx_feature is ring_group
            pbxFeatureName = val?.ring_group?.[0]?.name || "";
        }
        return {
            ...val,
            converted_date: val?.createdAt ? new Date(val.createdAt).toLocaleString('en-GB', { hour12: false }).replace(',', '') : (val?.callstart || "-"),
            user_name: val?.user?.[0]?.username || "",
            fullname: val?.user?.[0]?.fullname || "",
            pbx_feature_name: pbxFeatureName,
        };
    });
    return { data: newData, count };
};

const missedCallSlice = createSlice({
    name: "missedCall",
    initialState,
    reducers: {
        clearMissedCall: () => initialState,
    },
    extraReducers: (builder) => {
        builder.addCase(
            missedCallGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.missedCallData = prepareData(action.payload);
                state.isLoading = false;
            }
        );

        builder.addCase(
            missedCallSearch.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.missedCallData = prepareData(action.payload);
                state.isLoading = false;
            }
        );

        builder.addCase(
            missedCallAllGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.allMissedCallData = prepareData(action.payload);
            }
        );

        builder.addCase(
            missedCallAllSearch.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.allMissedCallData = prepareData(action.payload);
            }
        );

        builder.addCase(
            missedCallOptionsGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                const data = action.payload?.data;
                state.missedCallOptions = data?.map((val: any) => ({
                    value: val?.uuid,
                    label: val?.name,
                }));
            }
        );
    },
});

export default missedCallSlice.reducer;
export const { clearMissedCall } = missedCallSlice.actions;

export const selectIsLoading = (state: RootState) =>
    state.missedCall.isLoading;
export const useIsLoading = () => {
    const isLoading = useAppSelector(selectIsLoading);
    return useMemo(() => isLoading, [isLoading]);
};

export const selectMissedCall = (state: RootState) =>
    state.missedCall.missedCallData;
export const useMissedCall = () => {
    const missedCall = useAppSelector(selectMissedCall);
    return useMemo(() => missedCall, [missedCall]);
};

export const selectAllMissedCall = (state: RootState) =>
    state.missedCall.missedCallData;
export const useAllMissedCall = () => {
    const allMissedCall = useAppSelector(selectAllMissedCall);
    return useMemo(() => allMissedCall, [allMissedCall]);
};

export const selectMissedCallOptions = (state: RootState) =>
    state.missedCall.missedCallOptions;
export const useMissedCallOptions = () => {
    const options = useAppSelector(selectMissedCallOptions);
    return useMemo(() => options, [options]);
};
