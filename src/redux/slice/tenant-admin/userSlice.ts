import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";
import {
    allExternalUser,
    allUser,
    createUser,
    deleteUser,
    resetUser,
    searchUser,
    singleUser,
    updateUser,
    updateUserStatus,
    user,
} from "@/redux/services/tenant-admin/userServices";

// TYPES IMPORT
import { OptionTypes } from "@/types/formTypes";

interface InitialState {
    isLoading: boolean;
    usersData: any;
    allUsersData: any;
    userOptions: OptionTypes[];
    externalUserOptions: OptionTypes[];
}

const initialState: InitialState = {
    isLoading: true,
    usersData: {},
    allUsersData: {},
    userOptions: [],
    externalUserOptions: [],
};

export const userGet = createAsyncThunk("user/get", async (params: any) => {
    return await user(params);
});

export const userAllGet = createAsyncThunk("user-all/get", async () => {
    const params = { fill: "all" };
    return await allUser(params);
});

export const userSingleGet = createAsyncThunk(
    "user/single-get",
    async (id: string) => {
        return await singleUser(id);
    }
);

export const userSearch = createAsyncThunk(
    "user/search",
    async (params: any) => {
        return await searchUser(params);
    }
);

export const userCreate = createAsyncThunk(
    "user/create",
    async (payload: any) => {
        return await createUser(payload);
    }
);

export const userUpdate = createAsyncThunk(
    "user/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateUser(id, rest);
    }
);

export const userUpdateStatus = createAsyncThunk(
    "user-status/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateUserStatus(id, rest);
    }
);

export const userReset = createAsyncThunk(
    "user/reset",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await resetUser(id, rest);
    }
);

export const userDelete = createAsyncThunk(
    "user/delete",
    async (id: string) => {
        return await deleteUser(id);
    }
);

export const userOptionsGet = createAsyncThunk("user/getAll", async () => {
    return await allUser();
});

export const externalUserOptionsGet = createAsyncThunk(
    "external-user/getAll",
    async () => {
        return await allExternalUser();
    }
);

const prepareData = (payload: any) => {
    const data = payload?.data;
    const count = payload?.count;
    const newData = data?.map((val: any) => ({
        ...val,
        recording: val?.recording === "0" ? "Yes" : "No",
        sip_device: val?.default_extension_detail?.[0]?.username || "",
        user_group_name: val?.user_group?.[0]?.name || "",
    }));
    return { data: newData, count }
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clearUser: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(userGet.pending, (state, action: PayloadAction<any>) => {
                state.isLoading = true;
            })
            .addCase(userGet.fulfilled, (state, action: PayloadAction<any>) => {
                state.usersData = prepareData(action.payload)
                state.isLoading = false;
            })
            .addCase(userGet.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
            });

        builder
            .addCase(userSearch.pending, (state, action: PayloadAction<any>) => {
                state.isLoading = true;
            })
            .addCase(userSearch.fulfilled, (state, action: PayloadAction<any>) => {
                state.usersData = prepareData(action.payload)
                state.isLoading = false;
            })
            .addCase(userSearch.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
            });

        builder.addCase(
            userAllGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.allUsersData = action.payload;
            }
        );

        builder.addCase(
            userOptionsGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                const data = action.payload?.data;

                state.userOptions = data?.map((val: any) => {
                    const fullName = val?.fullname?.trim();   // <-- SAFE
                    const username = val?.username ?? "";

                    return {
                        value: val?.uuid,
                        label: fullName ? `${fullName} - (${username})` : username,
                    };
                });
            }
        );

        builder.addCase(
            externalUserOptionsGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                const data = action.payload?.data;
                state.externalUserOptions = data?.map((val: any) => ({
                    value: val?.uuid,
                    label: val?.username,
                })) || []
            }
        );
    },
});

export default userSlice.reducer;
export const { clearUser } = userSlice.actions;

export const selectIsLoading = (state: RootState) => state.user.isLoading;
export const useIsLoading = () => {
    const isLoading = useAppSelector(selectIsLoading);
    return useMemo(() => isLoading, [isLoading]);
};

export const selectUsers = (state: RootState) => state.user.usersData;
export const useUsers = () => {
    const users = useAppSelector(selectUsers);
    return useMemo(() => users, [users]);
};

export const selectAllUsers = (state: RootState) => state.user.allUsersData;
export const useAllUsers = () => {
    const allUsers = useAppSelector(selectAllUsers);
    return useMemo(() => allUsers, [allUsers]);
};

export const selectUserOptions = (state: RootState) => state.user.userOptions;
export const useUserOptions = () => {
    const options = useAppSelector(selectUserOptions);
    return useMemo(() => options, [options]);
};

export const selectExternalUserOptions = (state: RootState) =>
    state.user.externalUserOptions;
export const useExternalUserOptions = () => {
    const options = useAppSelector(selectExternalUserOptions);
    return useMemo(() => options, [options]);
};
