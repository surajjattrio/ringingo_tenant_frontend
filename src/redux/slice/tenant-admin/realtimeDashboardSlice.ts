import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useAppSelector } from "../../hooks";
import { RootState } from "../../store";
import { getLeadGroupStats } from "../../services/tenant-admin/realtimeDashboardServices";
import { useMemo } from "react";

interface RealtimeDashboardState {
    leadGroupStats: any[];
    isLoading: boolean;
}

const initialState: RealtimeDashboardState = {
    leadGroupStats: [],
    isLoading: false,
};

export const leadGroupStatsGet = createAsyncThunk(
    "realtimeDashboard/getStats",
    async (params: any, { rejectWithValue }) => {
        try {
            const response = await getLeadGroupStats(params);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

const realtimeDashboardSlice = createSlice({
    name: "realtimeDashboard",
    initialState,
    reducers: {
        clearDashboard: (state) => {
            state.leadGroupStats = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(leadGroupStatsGet.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(leadGroupStatsGet.fulfilled, (state, action) => {
                state.isLoading = false;
                // Handle different response structures
                const payload = action.payload;
                if (payload?.data?.leadGroupStats) {
                    state.leadGroupStats = payload.data.leadGroupStats;
                } else if (payload?.leadGroupStats) {
                    state.leadGroupStats = payload.leadGroupStats;
                } else if (Array.isArray(payload)) {
                    state.leadGroupStats = payload;
                } else {
                    state.leadGroupStats = [];
                }
            })
            .addCase(leadGroupStatsGet.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export const { clearDashboard } = realtimeDashboardSlice.actions;

export const selectLeadGroupStats = (state: RootState) =>
    state.realtimeDashboard.leadGroupStats;
export const useLeadGroupStats = () => {
    const leadGroupStats = useAppSelector(selectLeadGroupStats);
    return useMemo(() => leadGroupStats, [leadGroupStats]);
};

export const selectIsLoading = (state: RootState) =>
    state.realtimeDashboard.isLoading;
export const useIsLoading = () => {
    const isLoading = useAppSelector(selectIsLoading);
    return useMemo(() => isLoading, [isLoading]);
};

export default realtimeDashboardSlice.reducer;
