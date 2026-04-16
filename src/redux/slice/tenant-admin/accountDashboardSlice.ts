// PROJECT IMPORTS
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { useMemo } from "react";
import {
    accountDashboard,
    accountDashboardOverview,
    allAccountDashboard,
    accountDetails
} from "../../services/tenant-admin/accountDashboardServices";
import { useAppSelector } from "../../hooks";
import { RootState } from "../../store";

// TYPES
interface AccountDashboardState {
    accountDashboardData: any;
    accountDashboardOverview: any;
    allAccountDashboardData: any;
    accountDetailsData: any;
    isLoading: boolean;
}

// INITIAL STATE
const initialState: AccountDashboardState = {
    accountDashboardData: null,
    accountDashboardOverview: null,
    allAccountDashboardData: null,
    accountDetailsData: null,
    isLoading: false,
};

// ASYNC THUNKS
export const accountDashboardGet = createAsyncThunk(
    "account-dashboard/get",
    async (params: any) => {
        return await accountDashboard(params);
    }
);

export const accountDashboardOverviewGet = createAsyncThunk(
    "account-dashboard-overview/get",
    async (params: any) => {
        return await accountDashboardOverview(params);
    }
);

export const allAccountDashboardGet = createAsyncThunk(
    "all-account-dashboard/get",
    async (params?: any) => {
        return await allAccountDashboard(params);
    }
);

export const accountDetailsGet = createAsyncThunk(
    "account-details/get",
    async (payload?: any) => {
        const {feature, ...rest} = payload || {};
        return await accountDetails(feature, rest);
    }
);

// SLICE
const accountDashboardSlice = createSlice({
    name: "accountDashboard",
    initialState,
    reducers: {
        clearAccountDashboard: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(accountDashboardGet.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(accountDashboardGet.fulfilled, (state, action: PayloadAction<any>) => {
                state.accountDashboardData = action.payload;
                state.isLoading = false;
            })
            .addCase(accountDashboardGet.rejected, (state) => {
                state.isLoading = false;
            });

        builder
            .addCase(accountDashboardOverviewGet.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(accountDashboardOverviewGet.fulfilled, (state, action: PayloadAction<any>) => {
                state.accountDashboardOverview = action.payload;
                state.isLoading = false;
            })
            .addCase(accountDashboardOverviewGet.rejected, (state) => {
                state.isLoading = false;
            });

        builder
            .addCase(allAccountDashboardGet.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(allAccountDashboardGet.fulfilled, (state, action: PayloadAction<any>) => {
                state.allAccountDashboardData = action.payload;
                state.isLoading = false;
            })
            .addCase(allAccountDashboardGet.rejected, (state) => {
                state.isLoading = false;
            });

        builder
            .addCase(accountDetailsGet.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(accountDetailsGet.fulfilled, (state, action: PayloadAction<any>) => {
                state.accountDetailsData = action.payload;
                state.isLoading = false;
            })
            .addCase(accountDetailsGet.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

// SELECTORS
export const useAccountDashboard = () => {
    const accountDashboard = useAppSelector((state: RootState) => state.accountDashboard.accountDashboardData);
    return useMemo(() => accountDashboard, [accountDashboard]);
};

export const useAccountDashboardOverview = () => {
    const accountDashboardOverview = useAppSelector((state: RootState) => state.accountDashboard.accountDashboardOverview);
    return useMemo(() => accountDashboardOverview, [accountDashboardOverview]);
};

export const useAllAccountDashboard = () => {
    const allAccountDashboard = useAppSelector((state: RootState) => state.accountDashboard.allAccountDashboardData);
    return useMemo(() => allAccountDashboard, [allAccountDashboard]);
};

export const useAccountDetails = () => {
    const accountDetails = useAppSelector((state: RootState) => state.accountDashboard.accountDetailsData);
    return useMemo(() => accountDetails, [accountDetails]);
};

export const useAccountDashboardLoading = () => {
    const isLoading = useAppSelector((state: RootState) => state.accountDashboard.isLoading);
    return useMemo(() => isLoading, [isLoading]);
};

export default accountDashboardSlice.reducer;
export const { clearAccountDashboard } = accountDashboardSlice.actions; 