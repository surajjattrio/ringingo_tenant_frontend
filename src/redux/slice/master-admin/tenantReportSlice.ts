import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import {
    tenantReport,
    searchTenantReport,
    tenantReportFlag,
} from "@/redux/services/master-admin/tenantReportServices";
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";

interface InitialState {
    tenantReportData: any;
    isInProcess: boolean;
}

const initialState: InitialState = {
    tenantReportData: {},
    isInProcess: false,
};

export const tenantReportGet = createAsyncThunk(
    "tenantReport/get",
    async (params: any) => {
        return await tenantReport(params);
    }
);

export const tenantReportFlagGet = createAsyncThunk(
    "tenantReport/flag",
    async () => {
        return await tenantReportFlag();
    }
);

export const tenantReportSearch = createAsyncThunk(
    "tenantReport/search",
    async (payload: any) => {
        return await searchTenantReport(payload);
    }
);

const prepareData = (payload: any) => {
    const data = payload?.data?.data;
    const count = payload?.data?.count;

    const newData = data?.map((val: any) => {
        return {
            ...val,
            tenantName: val?.tenant?.[0]?.tenant_name || "",
        };
    });

    return { data: newData, count, search_data: payload?.search_data || [] };
};

const tenantReportSlice = createSlice({
    name: "tenantReport",
    initialState,
    reducers: {
        clearTenantReport: () => initialState,
        setIsInProcess: (state, action) => {
            state.isInProcess = action.payload;
            state.tenantReportData =
                action.payload === true ? {} : state.tenantReportData;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(
            tenantReportGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.tenantReportData = prepareData(action.payload);
            }
        );
    },
});

export default tenantReportSlice.reducer;
export const { clearTenantReport, setIsInProcess } = tenantReportSlice.actions;

export const selectTenantReport = (state: RootState) =>
    state.tenantReport.tenantReportData;
export const useTenantReport = () => {
    const tenantReport = useAppSelector(selectTenantReport);
    return useMemo(() => tenantReport, [tenantReport]);
};

export const selectTenantProcess = (state: RootState) =>
    state.tenantReport.isInProcess;
export const useTenantProcess = () => {
    const isInProcess = useAppSelector(selectTenantProcess);
    return useMemo(() => isInProcess, [isInProcess]);
};
