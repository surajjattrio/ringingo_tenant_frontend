import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";
import {
    allCdrs,
    cdrs,
    getIvrGroupList,
    getCdrsArchiveList,
    searchCdrs,
} from "@/redux/services/master-admin/cdrsServices";

// TYPES IMPORT
import { OptionTypes } from "@/types/formTypes";
//import { formatTime } from "@/helperFunctions";
import {
    callModeOptions,
    callTypeOptions,
    directionOptions,
    dispositionOptions,
} from "@/config/options";
import { formatTime } from "@/helperFunctions";

interface InitialState {
    isLoading: boolean;
    cdrsData: any;
    allCdrsData: any;
    cdrsOptions: OptionTypes[];
    ivrGroupOptions: OptionTypes[];
    cdrsArchiveOptions: OptionTypes[];
}

const initialState: InitialState = {
    isLoading: false,
    cdrsData: {},
    allCdrsData: {},
    cdrsOptions: [],
    ivrGroupOptions: [],
    cdrsArchiveOptions: [],
};

export const tenantCdrsGet = createAsyncThunk(
    "tenantCdrs/get",
    async (params: any) => {
        return await cdrs(params);
    }
);

export const tenantCdrsSearch = createAsyncThunk(
    "tenantCdrs/search",
    async (params: any) => {
        return await searchCdrs(params);
    }
);

export const tenantCdrsAllSearch = createAsyncThunk(
    "tenantCdrs-all-search/search",
    async (params: any) => {
        return await searchCdrs(params);
    }
);

export const tenantCdrsAllGet = createAsyncThunk(
    "tenantCdrs-all/get",
    async (params?: any) => {
        return await allCdrs(params);
    }
);

export const tenantCdrsOptionsGet = createAsyncThunk(
    "tenantCdrs-options/get",
    async () => {
        return await allCdrs();
    }
);


export const cdrsArchiveListGet = createAsyncThunk(
    "tenant-cdrs-quartely-archive-collections/options/get",
    async () => {
        return await getCdrsArchiveList();
    }
);

export const ivrGroupListGet = createAsyncThunk(
    "tenant-ivr-group/options",
    async () => {
        return getIvrGroupList();
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
            fullname: (val.fullname = val?.user?.[0]?.fullname ?? ""),
            ivr_cq_group_name: val?.pbx_feature_uuid
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

const cdrsSlice = createSlice({
    name: "tenantCdrs",
    initialState,
    reducers: {
        clearTenantCdrs: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(tenantCdrsGet.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(tenantCdrsGet.fulfilled, (state, action: PayloadAction<any>) => {
                state.cdrsData = prepareData(action.payload);
                state.isLoading = false;
            })
            .addCase(tenantCdrsGet.rejected, (state) => {
                state.isLoading = false;
            });

        builder
            .addCase(
                tenantCdrsSearch.pending,
                (state, action: PayloadAction<any>) => {
                    state.isLoading = true;
                }
            )
            .addCase(
                tenantCdrsSearch.fulfilled,
                (state, action: PayloadAction<any>) => {
                    console.log(prepareData(action.payload), 'data from sile');
                    state.cdrsData = prepareData(action.payload);
                    state.isLoading = false;
                }
            )
            .addCase(
                tenantCdrsSearch.rejected,
                (state, action: PayloadAction<any>) => {
                    state.isLoading = false;
                }
            );

        builder.addCase(
            tenantCdrsAllGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.allCdrsData = prepareData(action.payload);
            }
        );

        builder.addCase(
            tenantCdrsAllSearch.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.allCdrsData = prepareData(action.payload);
            }
        );

        builder.addCase(
            tenantCdrsOptionsGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                const data = action.payload?.data;
                state.cdrsOptions = data?.map((val: any) => ({
                    value: val?.uuid,
                    label: val?.name,
                }));
            }
        );


        builder.addCase(
            cdrsArchiveListGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                const data = action.payload?.data;
                state.cdrsArchiveOptions = data?.map((val: any) => ({
                    value: val?.uuid,
                    label: val?.collection_name_for_display,
                    name: val?.collection_name,
                })) ?? [];
            }
        );


        builder.addCase(
            ivrGroupListGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                const data = action.payload?.data;
                const callQueue = data?.callQueue || [];
                const ivr = data?.ivr || [];
                const ringGroup = data?.ringGroup || [];
                let group1 = callQueue?.length
                    ? callQueue?.map((val: any) => ({
                        value: val?.uuid,
                        label: val?.name,
                    }))
                    : [];

                let group2 = ivr?.length
                    ? ivr?.map((val: any) => ({
                        value: val?.uuid,
                        label: val?.name,
                    }))
                    : [];

                let group3 = ringGroup?.length
                    ? ringGroup?.map((val: any) => ({
                        value: val?.uuid,
                        label: val?.name,
                    }))
                    : [];

                let prepareData: any = [
                    {
                        label: "Call Queue",
                        options: [...group1],
                    },
                    {
                        label: "IVR",
                        options: [...group2],
                    },
                    {
                        label: "Ring Group",
                        options: [...group3],
                    },
                ];
                state.ivrGroupOptions = prepareData || [];
            }
        );
    },
});

export default cdrsSlice.reducer;
export const { clearTenantCdrs } = cdrsSlice.actions;

export const selectIsLoading = (state: RootState) => state.tenantCdrs.isLoading;
export const useIsLoading = () => {
    const isLoading = useAppSelector(selectIsLoading);
    return useMemo(() => isLoading, [isLoading]);
};

export const selectTenantCdrs = (state: RootState) => state.tenantCdrs.cdrsData;
export const useTenantCdrs = () => {
    const tenantCdrs = useAppSelector(selectTenantCdrs);
    return useMemo(() => tenantCdrs, [tenantCdrs]);
};

export const selectTenantAllCdrs = (state: RootState) =>
    state.tenantCdrs.allCdrsData;
export const useTenantAllCdrs = () => {
    const allTenantCdrs = useAppSelector(selectTenantAllCdrs);
    return useMemo(() => allTenantCdrs, [allTenantCdrs]);
};

export const selectTenantCdrsOptions = (state: RootState) =>
    state.tenantCdrs.cdrsOptions;
export const useTenantCdrsOptions = () => {
    const options = useAppSelector(selectTenantCdrsOptions);
    return useMemo(() => options, [options]);
};

export const selectTenantCdrsArchiveOptions = (state: RootState) =>
    state.tenantCdrs.cdrsArchiveOptions;
export const useTenantCdrsArchiveOptions = () => {
    const options = useAppSelector(selectTenantCdrsArchiveOptions);
    return useMemo(() => options, [options]);
};



export const selectTenantIvrGroupOptions = (state: RootState) =>
    state.tenantCdrs.ivrGroupOptions;
export const useTenantIvrGroupOptions = () => {
    const options = useAppSelector(selectTenantIvrGroupOptions);
    return useMemo(() => options, [options]);
};
