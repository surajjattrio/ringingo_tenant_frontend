import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";
import {
    allUserGroup,
    createUserGroup,
    deleteUserGroup,
    searchUserGroup,
    updateUserGroup,
    updateUserGrouptatus,
    userGroup,
} from "@/redux/services/tenant-admin/userGroupServices";

// TYPES IMPORT
import { OptionTypes } from "@/types/formTypes";

interface InitialState {
    isLoading: boolean;
    userGroupData: any;
    singleUserGroupData: any;
    userGroupOptions: OptionTypes[];
}

const initialState: InitialState = {
    isLoading: false,
    userGroupData: {},
    singleUserGroupData: {},
    userGroupOptions: [],
};

export const userGroupGet = createAsyncThunk(
    "userGroup/get",
    async (params: any) => {
        return await userGroup(params);
    }
);

export const userGroupSearch = createAsyncThunk(
    "userGroup/search",
    async (params: any) => {
        return await searchUserGroup(params);
    }
);

export const userGroupCreate = createAsyncThunk(
    "userGroup/create",
    async (payload: any) => {
        return await createUserGroup(payload);
    }
);

export const userGroupUpdate = createAsyncThunk(
    "userGroup/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateUserGroup(id, rest);
    }
);

export const userGroupStatusUpdate = createAsyncThunk(
    "userGroup-status/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateUserGrouptatus(id, rest);
    }
);
export const userGroupDelete = createAsyncThunk(
    "userGroup/delete",
    async (id: string) => {
        return await deleteUserGroup(id);
    }
);

export const userGroupOptionsGet = createAsyncThunk(
    "userGroup-options/get",
    async () => {
        return await allUserGroup();
    }
);

const prepareData = (payload: any) => {
    const data = payload?.data;
    const count = payload?.count;

    const newData = data?.map((val: any) => ({
        ...val,
        outbound_rule_name: val?.outbound_rule_detail?.[0]?.name || "",
    }));
    return { data: newData, count };
};

const userGroupsSlice = createSlice({
    name: "userGroup",
    initialState,
    reducers: {
        updateSingleUserGroupData: (state, action) => {
            state.singleUserGroupData = action.payload ? action.payload : {};
        },
        clearUserGroup: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(userGroupGet.pending, (state, action: PayloadAction<any>) => {
                state.isLoading = true;
            })
            .addCase(userGroupGet.fulfilled, (state, action: PayloadAction<any>) => {
                state.userGroupData = prepareData(action.payload);
                state.isLoading = false;
            })
            .addCase(userGroupGet.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
            });

        builder
            .addCase(userGroupSearch.pending, (state, action: PayloadAction<any>) => {
                state.isLoading = true;
            })
            .addCase(
                userGroupSearch.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.userGroupData = prepareData(action.payload);
                    state.isLoading = false;
                }
            )
            .addCase(
                userGroupSearch.rejected,
                (state, action: PayloadAction<any>) => {
                    state.isLoading = false;
                }
            );

        builder.addCase(
            userGroupOptionsGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                const data = action.payload?.data;
                state.userGroupOptions = data?.map((val: any) => ({
                    value: val?.uuid,
                    label: val?.name,
                }));
            }
        );
    },
});

export default userGroupsSlice.reducer;
export const { updateSingleUserGroupData, clearUserGroup } =
    userGroupsSlice.actions;

export const selectIsLoading = (state: RootState) => state.userGroup.isLoading;
export const useIsLoading = () => {
    const isLoading = useAppSelector(selectIsLoading);
    return useMemo(() => isLoading, [isLoading]);
};

export const selectUserGroup = (state: RootState) =>
    state.userGroup.userGroupData;
export const useUserGroup = () => {
    const userGroup = useAppSelector(selectUserGroup);
    return useMemo(() => userGroup, [userGroup]);
};

export const selectSingleUserGroup = (state: RootState) =>
    state.userGroup.singleUserGroupData;
export const useSingleUserGroup = () => {
    const userGroup = useAppSelector(selectSingleUserGroup);
    return useMemo(() => userGroup, [userGroup]);
};

export const selectUserGroupsOptions = (state: RootState) =>
    state.userGroup.userGroupOptions;
export const useUserGroupsOptions = () => {
    const options = useAppSelector(selectUserGroupsOptions);
    return useMemo(() => options, [options]);
};
