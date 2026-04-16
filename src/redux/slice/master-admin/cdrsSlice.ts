import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";
import {
    allCdrs,
    cdrs,
    searchCdrs,
} from "@/redux/services/master-admin/cdrsServices";

// TYPES IMPORT
import { OptionTypes } from "@/types/formTypes";
import { formatTime } from "@/helperFunctions";
import { callModeOptions, dispositionOptions } from "@/config/options";
import { directionOptions } from "@/config/options";
import { callTypeOptions } from "@/config/options";

interface InitialState {
    isLoading: boolean;
    cdrsData: any;
    allCdrsData: any;
    cdrsOptions: OptionTypes[];
}

const initialState: InitialState = {
    isLoading: false,
    cdrsData: {},
    allCdrsData: {},
    cdrsOptions: [],
};

export const cdrsGet = createAsyncThunk("cdrs/get", async (params: any) => {
    return await cdrs(params);
});

export const cdrsSearch = createAsyncThunk(
    "cdrs/search",
    async (params: any) => {
        return await searchCdrs(params);
    }
);

export const cdrsAllGet = createAsyncThunk(
    "cdrs-all/get",
    async (params: any) => {
        return await allCdrs(params);
    }
);

export const cdrsAllSearchGet = createAsyncThunk(
    "cdrs-all-search/get",
    async (payload: any) => {
        return await searchCdrs(payload);
    }
);

export const cdrsOptionsGet = createAsyncThunk("cdrs-options/get", async () => {
    return await allCdrs();
});

const prepareData = (payload: any) => {
    const data = payload?.data;
    const count = payload?.count;
    const newData = data?.map((val: any) => {
        const disposition = dispositionOptions?.find(
            (options: any) => options?.value === val?.disposition
        );
        const direction = directionOptions?.find(
            (options: any) => options?.value === val?.direction
        );
        const callType = callTypeOptions?.find(
            (options: any) => options?.value === val?.call_type
        );
        const callMode = callModeOptions?.find(
            (options: any) => options?.value === val?.call_mode
        );
        return {
            ...val,
            tenant_name: val?.tenant?.[0]?.tenant_name || "",
            user_name: val?.user?.[0]?.username || "",
            billsecond: formatTime(parseInt(val?.billsecond), true),
            waiting_time: formatTime(parseInt(val?.waiting_time), true),
            hold_time: formatTime(parseInt(val?.hold_time), true),
            ringing_time: formatTime(parseInt(val?.ringing_time), true),
            total_duration: formatTime(parseInt(val?.total_duration), true),
            disposition: disposition?.label || "",
            direction: direction?.label || "",
            call_type: callType?.label || "",
            call_mode_name: callMode?.label || "",
        };
    });
    return { data: newData, count };
};

const cdrsSlice = createSlice({
    name: "cdrs",
    initialState,
    reducers: {
        clearCdrs: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(cdrsGet.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(cdrsGet.fulfilled, (state, action: PayloadAction<any>) => {
                state.cdrsData = prepareData(action.payload);
                state.isLoading = false;
            })
            .addCase(cdrsGet.rejected, (state) => {
                state.isLoading = false;
            });

        builder
            .addCase(cdrsSearch.pending, (state, action: PayloadAction<any>) => {
                state.isLoading = true;
            })
            .addCase(cdrsSearch.fulfilled, (state, action: PayloadAction<any>) => {
                state.cdrsData = prepareData(action.payload);
                state.isLoading = false;
            })
            .addCase(cdrsSearch.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
            });

        builder.addCase(
            cdrsAllGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.allCdrsData = prepareData(action.payload);
            }
        );

        builder.addCase(
            cdrsAllSearchGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.allCdrsData = prepareData(action.payload);
            }
        );

        builder.addCase(
            cdrsOptionsGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                const data = action.payload?.data;
                state.cdrsOptions = data?.map((val: any) => ({
                    value: val?.uuid,
                    label: val?.name,
                }));
            }
        );
    },
});

export default cdrsSlice.reducer;
export const { clearCdrs } = cdrsSlice.actions;

export const selectIsLoading = (state: RootState) => state.cdrs.isLoading;
export const useIsLoading = () => {
    const isLoading = useAppSelector(selectIsLoading);
    return useMemo(() => isLoading, [isLoading]);
};

export const selectCdrs = (state: RootState) => state.cdrs.cdrsData;
export const useCdrs = () => {
    const cdrs = useAppSelector(selectCdrs);
    return useMemo(() => cdrs, [cdrs]);
};

export const selectAllCdrs = (state: RootState) => state.cdrs.allCdrsData;
export const useAllCdrs = () => {
    const allCdrs = useAppSelector(selectAllCdrs);
    return useMemo(() => allCdrs, [allCdrs]);
};

export const selectCdrsOptions = (state: RootState) => state.cdrs.cdrsOptions;
export const useCdrsOptions = () => {
    const options = useAppSelector(selectCdrsOptions);
    return useMemo(() => options, [options]);
};
