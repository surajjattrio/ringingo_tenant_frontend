import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import {
    createMailSchedule,
    listMailSchedules,
    deleteMailSchedule,
    updateMailSchedule,
    updateMailScheduleStatus,
    deleteMultipleMailSchedules
} from "../../services/tenant-admin/mailScheduleServices";

interface InitialState {
    isLoading: boolean;
    mailSchedulesData: {
        data: any[];
        count: number;
    };
}

const initialState: InitialState = {
    isLoading: false,
    mailSchedulesData: {
        data: [],
        count: 0,
    },
};

export const mailScheduleCreate = createAsyncThunk(
    "mailSchedule/create",
    async (payload: any) => {
        return await createMailSchedule(payload);
    }
);

export const mailScheduleSearch = createAsyncThunk(
    "mailSchedule/search",
    async (params: any) => {
        return await listMailSchedules(params);
    }
);

export const mailScheduleDelete = createAsyncThunk(
    "mailSchedule/delete",
    async (uuid: string) => {
        return await deleteMailSchedule(uuid);
    }
);

export const mailScheduleUpdate = createAsyncThunk(
    "mailSchedule/update",
    async ({ uuid, payload }: { uuid: string; payload: any }) => {
        return await updateMailSchedule(uuid, payload);
    }
);

export const mailScheduleUpdateStatus = createAsyncThunk(
    "mailSchedule/updateStatus",
    async (payload: any) => {
        return await updateMailScheduleStatus(payload);
    }
);

export const mailScheduleDeleteMultiple = createAsyncThunk(
    "mailSchedule/deleteMultiple",
    async (payload: any) => {
        return await deleteMultipleMailSchedules(payload);
    }
);

const mailScheduleSlice = createSlice({
    name: "mailSchedule",
    initialState,
    reducers: {
        clearMailSchedule: (state) => {
            state.mailSchedulesData = initialState.mailSchedulesData;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(mailScheduleSearch.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(mailScheduleSearch.fulfilled, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.mailSchedulesData = {
                    data: action.payload?.data || [],
                    count: action.payload?.count || 0,
                };
            })
            .addCase(mailScheduleSearch.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export const { clearMailSchedule } = mailScheduleSlice.actions;

export const selectMailSchedules = (state: RootState) => state.mailSchedule.mailSchedulesData;
export const selectIsLoading = (state: RootState) => state.mailSchedule.isLoading;

export default mailScheduleSlice.reducer;
