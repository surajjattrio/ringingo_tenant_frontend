import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";
import {
    createTenantRole,
    deleteTenantRole,
    searchTenantRole,
    tenantRole,
    updateTenantRole,
    updateTenantRoleStatus,
} from "@/redux/services/tenant-admin/tenantRoleServices";

interface InitialState {
    tenantRoleData: any;
    singleTanantRoleData: any;
    isLoading: boolean;
}

const initialState: InitialState = {
    tenantRoleData: {},
    singleTanantRoleData: {},
    isLoading: false,
};

export const tenantRoleGet = createAsyncThunk(
    "tenant-role/get",
    async (params: any) => {
        return await tenantRole(params);
    }
);

export const tenantRoleSearch = createAsyncThunk(
    "tenant-role/search",
    async (params: any) => {
        return await searchTenantRole(params);
    }
);

export const tenantRoleCreate = createAsyncThunk(
    "tenant-role/create",
    async (payload: any) => {
        return await createTenantRole(payload);
    }
);

export const tenantRoleUpdate = createAsyncThunk(
    "tenant-role/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateTenantRole(id, rest);
    }
);

export const tenantRoleStatusUpdate = createAsyncThunk(
    "tenant-role-status/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateTenantRoleStatus(id, rest);
    }
);
export const tenantRoleDelete = createAsyncThunk(
    "tenant-role/delete",
    async (id: string) => {
        return await deleteTenantRole(id);
    }
);

const tenantRoleSlice = createSlice({
    name: "tenantRole",
    initialState,
    reducers: {
        updateSingleTenantRoleData: (state, action) => {
            state.singleTanantRoleData = action.payload ? action.payload : {};
        },
        clearTenantRole: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(tenantRoleGet.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(tenantRoleGet.fulfilled, (state, action: PayloadAction<any>) => {
                state.tenantRoleData = action.payload;
                state.isLoading = false;
            })
            .addCase(tenantRoleGet.rejected, (state) => {
                state.isLoading = false;
            });

        builder
            .addCase(
                tenantRoleSearch.pending,
                (state, action: PayloadAction<any>) => {
                    state.isLoading = true;
                }
            )
            .addCase(
                tenantRoleSearch.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.tenantRoleData = action.payload;
                    state.isLoading = false;
                }
            )
            .addCase(
                tenantRoleSearch.rejected,
                (state, action: PayloadAction<any>) => {
                    state.isLoading = false;
                }
            );
    },
});

export default tenantRoleSlice.reducer;
export const { updateSingleTenantRoleData, clearTenantRole } =
    tenantRoleSlice.actions;

export const selectIsLoading = (state: RootState) => state.tenantRole.isLoading;
export const useIsLoading = () => {
    const isLoading = useAppSelector(selectIsLoading);
    return useMemo(() => isLoading, [isLoading]);
};

export const selectTenantRole = (state: RootState) =>
    state.tenantRole.tenantRoleData;
export const useTenantRole = () => {
    const tenantRole = useAppSelector(selectTenantRole);
    return useMemo(() => tenantRole, [tenantRole]);
};

export const selectSingleTenantRole = (state: RootState) =>
    state.tenantRole.singleTanantRoleData;
export const useSingleTenantRole = () => {
    const tenantRole = useAppSelector(selectSingleTenantRole);
    return useMemo(() => tenantRole, [tenantRole]);
};
