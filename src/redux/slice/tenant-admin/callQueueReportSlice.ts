import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";
import { callQueueReport, searchCallQueueReport } from "@/redux/services/tenant-admin/callQueueReportServices";

// TYPES IMPORT
// import { OptionTypes } from "@/types/formTypes";

interface InitialState {
    isLoading: boolean;
    callQueueReportData: any;
    allCallQueueReportData: any;
    // droppedCallsOptions: OptionTypes[];
}

const initialState: InitialState = {
    isLoading: false,
    callQueueReportData: {},
    allCallQueueReportData: {},
    // droppedCallsOptions: [],
};

export const callQueueReportGet = createAsyncThunk(
    "callQueueReport/get",
    async (params: any) => {
        return await callQueueReport(params);
    }
);

export const callQueueReportSearch = createAsyncThunk(
    "callQueueReport/search",
    async (params: any) => {
        return await searchCallQueueReport(params);
    }
);

// export const callQueueReportAllSearch = createAsyncThunk(
//     "callQueueReport-all/search",
//     async (params: any) => {
//         params.callstate = 'call-queue';
//         return await searchDroppedCalls(params);
//     }
// );

// export const callQueueReportAllGet = createAsyncThunk(
//     "callQueueReport-all/get",
//     async (params: any) => {
//         params.callstate = 'call-queue';
//         return await allDroppedCalls(params);
//     }
// );

// export const droppedCallsOptionsGet = createAsyncThunk(
//     "droppedCalls/options",
//     async (params: any) => {
//         return await allDroppedCalls(params);
//     }
// );

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

const callQueueReportSlice = createSlice({
    name: "callQueueReport",
    initialState,
    reducers: {
        clearDroppedCalls: () => initialState,
    },
    extraReducers: (builder) => {
        builder.addCase(
            callQueueReportGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.callQueueReportData = prepareData(action.payload);
                state.isLoading = false;
            }
        );

        builder.addCase(
            callQueueReportSearch.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.callQueueReportData = prepareData(action.payload);
                state.isLoading = false;
            }
        );

        // builder.addCase(
        //     callQueueReportAllGet.fulfilled,
        //     (state, action: PayloadAction<any>) => {
        //         state.allCallQueueReportData = prepareData(action.payload);
        //     }
        // );

        // builder.addCase(
        //     callQueueReportAllSearch.fulfilled,
        //     (state, action: PayloadAction<any>) => {
        //         state.allCallQueueReportData = prepareData(action.payload);
        //     }
        // );

        // builder.addCase(
        //     droppedCallsOptionsGet.fulfilled,
        //     (state, action: PayloadAction<any>) => {
        //         const data = action.payload?.data;
        //         state.droppedCallsOptions = data?.map((val: any) => ({
        //             value: val?.uuid,
        //             label: val?.name,
        //         }));
        //     }
        // );
    },
});

export default callQueueReportSlice.reducer;

// Selectors
export const selectCallQueueReport = (state: RootState) =>
    state.callQueueReport.callQueueReportData;
export const useCallQueueReport = () => {
    const callQueueReport = useAppSelector(selectCallQueueReport);
    return useMemo(() => callQueueReport, [callQueueReport]);
};

// export const selectAllDroppedCalls = (state: RootState) =>
//     state.callQueueReport.allCallQueueReportData;
// export const useAllDroppedCalls = () => {
//     const allCallQueueReport = useAppSelector(selectAllDroppedCalls);
//     return useMemo(() => allCallQueueReport, [allCallQueueReport]);
// };