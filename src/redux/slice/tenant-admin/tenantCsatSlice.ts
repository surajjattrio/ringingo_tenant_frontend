import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";

import { getCsatReport } from "@/redux/services/master-admin/csatServices";
import { callModeOptions, callTypeOptions, directionOptions, dispositionOptions } from "@/config/options";

interface InitialState {
    isLoading: boolean;
    csatData: any;
}

const initialState: InitialState = {
    isLoading: false,
    csatData: {},
};

export const tenantCsatReportGet = createAsyncThunk(
    "tenantCsatReport/get",
    async (params: any) => {
        return await getCsatReport(params);
    }
);

// export const tenantCsatSearch = createAsyncThunk(
//     "tenantCdrs/search",
//     async ( params: any ) => {
//         return await searchCsat( params );
//     }
// );
export const tenantCsatSearch = createAsyncThunk(
    "tenantCsatReport/search",
    async (params: any) => {
        return await getCsatReport(params);
    }
);
const prepareData = (payload: any) => {
    const data = payload?.data;
    const count = payload?.count;
    const newData = data?.map((val: any) => {
        const disposition = dispositionOptions?.find(
            (option: any) => option?.value === val?.disposition
        );
        const direction = directionOptions?.find(
            (option: any) => option?.value === val?.direction
        );
        const callType = callTypeOptions?.find(
            (option: any) => option?.value === val?.call_type
        );
        const callMode = callModeOptions?.find(
            (options: any) => options?.value === val?.call_mode
        );
        return {
            ...val,
            name: val?.telecom_circle?.[0]?.name || "",


            // billsecond: direction ?.label == "Inbound" ? formatTime(parseInt(val?.total_duration) - parseInt(val?.waiting_time), true): formatTime( parseInt( val ?.billsecond), true ),
            // waiting_time: formatTime(parseInt(val?.waiting_time), true),
            // hold_time: formatTime(parseInt(val?.hold_time), true),
            // ringing_time: formatTime(parseInt(val?.ringing_time), true),
            // total_duration: formatTime(parseInt(val?.total_duration), true),
            billsecond: val?.billsecond,
            waiting_time: val?.waiting_time,
            hold_time: val?.hold_time,
            ringing_time: val?.ringing_time,
            total_duration: val?.total_duration,
            disposition: disposition?.label || "",
            direction: direction?.label || "",
            call_type: callType?.label || "",
            call_mode_name: callMode?.label || "",
            username: (val.username =
                val?.user && val?.user?.length ? val?.user[0]?.username : ""),
            ivr_group_name: val?.ivr_group
                ? val?.ivr?.length
                    ? val?.ivr[0]?.name
                    : val?.call_queue?.length
                        ? val?.call_queue[0]?.name
                        : val?.ringgroup?.length
                            ? val?.ringgroup[0]?.name
                            : ""
                : "",
        };
    });
    return { data: newData, count };
};

const csatSlice = createSlice({
    name: "tenantCsatReport",
    initialState,
    reducers: {
        clearTenantCsatReport: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(tenantCsatReportGet.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(
                tenantCsatReportGet.fulfilled, (state, action: PayloadAction<any>) => {
                    state.csatData = action.payload
                    state.isLoading = false;
                }
            )
            .addCase(tenantCsatReportGet.rejected, (state) => {
                state.isLoading = false;
            });
        builder
            .addCase(
                tenantCsatSearch.pending,
                (state, action: PayloadAction<any>) => {
                    state.isLoading = true;
                }
            )
            .addCase(
                tenantCsatSearch.fulfilled,
                (state, action: PayloadAction<any>) => {
                    console.log(prepareData(action.payload), 'data from sile');

                    state.csatData = prepareData(action.payload);
                    state.isLoading = false;
                }
            )
            .addCase(
                tenantCsatSearch.rejected,
                (state, action: PayloadAction<any>) => {
                    state.isLoading = false;
                }
            );

    },
});

export default csatSlice.reducer;
export const { clearTenantCsatReport } = csatSlice.actions;

// ✅ selectors
export const selectCsatIsLoading = (state: RootState) =>
    state.tenantCsatReport.isLoading;

export const useCsatIsLoading = () => {
    const isLoading = useAppSelector(selectCsatIsLoading);
    return useMemo(() => isLoading, [isLoading]);
};

export const selectTenantCsatReport = (state: RootState) =>
    state.tenantCsatReport?.csatData
export const useTenantCsatReport = () => {
    const csat = useAppSelector(selectTenantCsatReport);
    return useMemo(() => csat, [csat]);
};
