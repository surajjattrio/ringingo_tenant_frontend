import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";
import { didReport, didReportSearch } from "@/redux/services/tenant-admin/didReportServices";

interface InitialState {
    isLoading: boolean;
    didReportData: any;
}

const initialState: InitialState = {
    isLoading: false,
    didReportData: {},
};

export const didReportGet = createAsyncThunk("did-report/get", async (params: any) => {
    return await didReport(params);
});

export const didReportSearchGet = createAsyncThunk(
    "did-report/search",
    async (params: any) => {
        return await didReportSearch(params);
    }
);

const didReportSlice = createSlice({
    name: "didReport",
    initialState,
    reducers: {
        clearDidReport: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(didReportGet.pending, (state, action: PayloadAction<any>) => {
                state.isLoading = true;
            })
            .addCase(didReportGet.fulfilled, (state, action: PayloadAction<any>) => {
                state.didReportData = action.payload;
                state.isLoading = false;
            })
            .addCase(didReportGet.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
            });
        builder
            .addCase(didReportSearchGet.pending, (state, action: PayloadAction<any>) => {
                state.isLoading = true;
            })
            .addCase(didReportSearchGet.fulfilled, (state, action: PayloadAction<any>) => {
                state.didReportData = action.payload;
                state.isLoading = false;
            })
            .addCase(didReportSearchGet.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
            });
    },
});

export default didReportSlice.reducer;
export const { clearDidReport } = didReportSlice.actions;

export const selectIsLoading = (state: RootState) => state.didReport.isLoading;
export const useIsLoading = () => {
    const isLoading = useAppSelector(selectIsLoading);
    return useMemo(() => isLoading, [isLoading]);
};

export const selectDidReport = (state: RootState) => state.didReport.didReportData;
export const useDidReport = () => {
    const didReport = useAppSelector(selectDidReport);
    return useMemo(() => didReport, [didReport]);
}; 

export const useTenantDids = () => {
    const tenantDids = useAppSelector( selectDidReport );
    return useMemo( () => tenantDids, [ tenantDids ] );
};
export const selectTenantAllDids = ( state: RootState ) =>
state.didReport.didReportData;
export const useTenantAllDids = () => {
    const allTenantDids = useAppSelector( selectTenantAllDids );
    return useMemo( () => allTenantDids, [ allTenantDids ] );
};
