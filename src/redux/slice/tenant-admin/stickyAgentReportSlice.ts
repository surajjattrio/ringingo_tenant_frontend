import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import {
    searchStickyAgentReport,
    stickyAgentReport,
    allStickyAgentReport,
    deleteStickyAgentReport,
} from "@/redux/services/tenant-admin/stickyAgentReportServices";
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";

// TYPES IMPORT
import { OptionTypes } from "@/types/formTypes";

interface InitialState {
    isLoading: boolean;
    stickyAgentReportData: any;
    allStickyAgentReportData: any;
}

const initialState: InitialState = {
    isLoading: false,
    stickyAgentReportData: {},
    allStickyAgentReportData: {},
};

export const stickyAgentReportGet = createAsyncThunk(
    "stickyAgentReport/get",
    async (params: any) => { 
        return await stickyAgentReport(params);
    }
);

export const stickyAgentReportSearch = createAsyncThunk(
    "stickyAgentReport/search",
    async (params: any) => {
        return await searchStickyAgentReport(params);
    }
);

export const stickyAgentReportAllSearch = createAsyncThunk(
    "stickyAgentReport-all/search",
    async (params: any) => {
        return await searchStickyAgentReport(params);
    }
);

export const stickyAgentReportAllGet = createAsyncThunk(
    "stickyAgentReport-all/get",
    async (params: any) => {
        return await allStickyAgentReport(params);
    }
);

export const stickyAgentReportDelete = createAsyncThunk(
    "stickyAgentReport/delete",
    async (id: string) => {
        return await deleteStickyAgentReport(id);
    }
);


const prepareData = (payload: any) => {
    const data = payload?.data;
    const count = payload?.count;
    const newData = data?.map((val: any) => {
        return {
            ...val,
            username: val?.user?.[0]?.username || "",
        };
    });
    return { data: newData, count };
};

const stickyAgentReportSlice = createSlice({
    name: "stickyAgentReport",
    initialState,
    reducers: {
        clearStickyAgentReport: () => initialState,
    },
    extraReducers: (builder) => {
        builder.addCase(
            stickyAgentReportGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.stickyAgentReportData = prepareData(action.payload);
                state.isLoading = false;
            }
        );

        builder.addCase(
            stickyAgentReportSearch.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.stickyAgentReportData = prepareData(action.payload);
                state.isLoading = false;
            }
        );

        builder.addCase(
            stickyAgentReportAllGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.allStickyAgentReportData = prepareData(action.payload);
            }
        );

        builder.addCase(
            stickyAgentReportAllSearch.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.allStickyAgentReportData = prepareData(action.payload);
            }
        );
    },
});

export default stickyAgentReportSlice.reducer;
export const { clearStickyAgentReport } = stickyAgentReportSlice.actions;

export const selectIsLoading = (state: RootState) =>
    state.stickyAgentReport.isLoading;
export const useIsLoading = () => {
    const isLoading = useAppSelector(selectIsLoading);
    return useMemo(() => isLoading, [isLoading]);
};

export const selectStickyAgentReport = (state: RootState) =>
    state.stickyAgentReport.stickyAgentReportData;
export const useStickyAgentReport = () => {
    const stickyAgentReport = useAppSelector(selectStickyAgentReport);
    return useMemo(() => stickyAgentReport, [stickyAgentReport]);
};

export const selectAllStickyAgentReport = (state: RootState) =>
    state.stickyAgentReport.allStickyAgentReportData;
export const useAllStickyAgentReport = () => {
    const allStickyAgentReport = useAppSelector(selectAllStickyAgentReport);
    return useMemo(() => allStickyAgentReport, [allStickyAgentReport]);
};
