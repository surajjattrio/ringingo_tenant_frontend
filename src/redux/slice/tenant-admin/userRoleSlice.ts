import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";
import {
    allUserRole,
    createUserRole,
    deleteUserRole,
    searchUserRole,
    updateUserRole,
    updateUserRoleStatus,
    userRole,
} from "@/redux/services/tenant-admin/userRoleServices";

// TYPES IMPORT
import { OptionTypes } from "@/types/formTypes";

interface InitialState {
    isLoading: boolean;
    userRoleData: any;
    singleUserRoleData: any;
    userRoleOptions: OptionTypes[];
    userRoleAllData: any[]; 
}

const initialState: InitialState = {
    isLoading: false,
    userRoleData: {},
    singleUserRoleData: {},
    userRoleOptions: [],
    userRoleAllData: []
};

export const userRoleGet = createAsyncThunk(
    "user-role/get",
    async (params: any) => {
        return await userRole(params);
    }
);

export const userRoleSearch = createAsyncThunk(
    "user-role/search",
    async (params: any) => {
        return await searchUserRole(params);
    }
);

export const userRoleCreate = createAsyncThunk(
    "user-role/create",
    async (payload: any) => {
        return await createUserRole(payload);
    }
);

export const userRoleUpdate = createAsyncThunk(
    "user-role/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateUserRole(id, rest);
    }
);

export const userRoleStatusUpdate = createAsyncThunk(
    "user-role-status/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateUserRoleStatus(id, rest);
    }
);
export const userRoleDelete = createAsyncThunk(
    "user-role/delete",
    async (id: string) => {
        return await deleteUserRole(id);
    }
);

export const userRoleOptionsGet = createAsyncThunk(
    "user-role/options",
    async () => {
        return await allUserRole();
    }
);

const userRoleSlice = createSlice({
    name: "userRole",
    initialState,
    reducers: {
        updateSingleUserRoleData: (state, action) => {
            state.singleUserRoleData = action.payload ? action.payload : {};
        },
        clearUserRole: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(userRoleGet.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(userRoleGet.fulfilled, (state, action: PayloadAction<any>) => {
                state.userRoleData = action.payload;
                state.isLoading = false;
            })
            .addCase(userRoleGet.rejected, (state) => {
                state.isLoading = false;
            });

        builder
            .addCase(userRoleSearch.pending, (state, action: PayloadAction<any>) => {
                state.isLoading = true;
            })
            .addCase(
                userRoleSearch.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.userRoleData = action.payload;
                    state.isLoading = false;
                }
            )
            .addCase(userRoleSearch.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
            });

        builder.addCase(
            userRoleOptionsGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                const data = action.payload?.data || [];
                state.userRoleAllData = data;
                state.userRoleOptions = data?.map((val: any) => ({
                    value: val?.uuid,
                    label: val?.name,
                }));
            }
        );
    },
});

export default userRoleSlice.reducer;
export const { updateSingleUserRoleData, clearUserRole } =
    userRoleSlice.actions;

export const selectIsLoading = (state: RootState) => state.userRole.isLoading;
export const useIsLoading = () => {
    const isLoading = useAppSelector(selectIsLoading);
    return useMemo(() => isLoading, [isLoading]);
};

export const selectUserRole = (state: RootState) => state.userRole.userRoleData;
export const useUserRole = () => {
    const userRole = useAppSelector(selectUserRole);
    return useMemo(() => userRole, [userRole]);
};

export const selectSingleUserRole = (state: RootState) =>
    state.userRole.singleUserRoleData;
export const useSingleUserRole = () => {
    const userRole = useAppSelector(selectSingleUserRole);
    return useMemo(() => userRole, [userRole]);
};

export const selectUserRoleOptions = (state: RootState) =>
    state.userRole.userRoleOptions;
export const useUserRoleOptions = () => {
    const options = useAppSelector(selectUserRoleOptions);
    return useMemo(() => options, [options]);
};

export const selectUserRoleAllData = (state: RootState) =>
  state.userRole.userRoleAllData;

export const useUserRoleAllData = () => {
  const data = useAppSelector(selectUserRoleAllData);
  return useMemo(() => data, [data]);
};