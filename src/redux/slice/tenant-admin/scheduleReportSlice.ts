import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import {
    createScheduleReport,
    listScheduleReports,
    deleteScheduleReport,
    updateScheduleReport
} from "../../services/tenant-admin/scheduleReportServices";

interface InitialState {
    isLoading: boolean;
    reportsData: {
        data: any[];
        count: number;
    };
}

const initialState: InitialState = {
    isLoading: false,
    reportsData: {
        data: [],
        count: 0,
    },
};

export const scheduleReportCreate = createAsyncThunk(
    "scheduleReport/create",
    async (payload: any) => {
        return await createScheduleReport(payload);
    }
);

export const scheduleReportSearch = createAsyncThunk(
    "scheduleReport/search",
    async (params: any) => {
        return await listScheduleReports(params);
    }
);

export const scheduleReportDelete = createAsyncThunk(
    "scheduleReport/delete",
    async (uuid: string) => {
        return await deleteScheduleReport(uuid);
    }
);

export const scheduleReportUpdate = createAsyncThunk(
    "scheduleReport/update",
    async ({ uuid, payload }: { uuid: string; payload: any }) => {
        return await updateScheduleReport(uuid, payload);
    }
);

const scheduleReportSlice = createSlice({
    name: "scheduleReport",
    initialState,
    reducers: {
        clearScheduleReport: (state) => {
            state.reportsData = initialState.reportsData;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(scheduleReportSearch.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(scheduleReportSearch.fulfilled, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.reportsData = {
                    data: action.payload?.data?.list || [],
                    count: action.payload?.data?.total || 0,
                };
            })
            .addCase(scheduleReportSearch.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export const { clearScheduleReport } = scheduleReportSlice.actions;

export const selectScheduleReports = (state: RootState) => state.scheduleReport.reportsData;
export const selectIsLoading = (state: RootState) => state.scheduleReport.isLoading;

export default scheduleReportSlice.reducer;
