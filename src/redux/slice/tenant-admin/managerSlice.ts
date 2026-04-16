import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";
import {
    createManager,
    deleteManager,
    manager,
    searchManager,
    singleManager,
    updateManager,
    updateManagerStatus,
    allManager,
} from "@/redux/services/tenant-admin/managerServices";

// TYPES IMPORT
import { OptionTypes } from "@/types/formTypes";

interface InitialState {
    isLoading: boolean;
    managerData: any;
    getSingleManager: any;
    singleManagerData: any;
    managerOptions: OptionTypes[];
}

const initialState: InitialState = {
    isLoading: true,
    managerData: {},
    getSingleManager: {},
    singleManagerData: {},
    managerOptions: [],
};

export const managerGet = createAsyncThunk(
    "manager/get",
    async (params: any) => {
        return await manager(params);
    }
);

export const managerSingleGet = createAsyncThunk(
    "manager/single-get",
    async (id: string) => {
        return await singleManager(id);
    }
);

export const managerSearch = createAsyncThunk(
    "manager/search",
    async (params: any) => {
        return await searchManager(params);
    }
);

export const managerCreate = createAsyncThunk(
    "manager/create",
    async (payload: any) => {
        return await createManager(payload);
    }
);

export const managerUpdate = createAsyncThunk(
    "manager/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateManager(id, rest);
    }
);

export const managerStatusUpdate = createAsyncThunk(
    "manager-status/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateManagerStatus(id, rest);
    }
);
export const managerDelete = createAsyncThunk(
    "manager/delete",
    async (id: string) => {
        return await deleteManager(id);
    }
);

export const managerOptionsGet = createAsyncThunk(
    "manager-options/getAll",
    async () => {
        return await allManager();
    }
);

const prepareData = (payload: any) => {
    const data = payload?.data;
    const count = payload?.count;
    const newData = data?.map((val: any) => {
        return {
            ...val,
            // manager_uuid: val?.manager?.[0]?.name || "",
            role_name: val?.manager_role?.[0]?.role_name || "",
            sipname: val?.extension_details?.[0]?.username || "",
        };
    });
    return { data: newData, count };
};

const managerSlice = createSlice({
    name: "manager",
    initialState,
    reducers: {
        updateSingleManagerData: (state, action) => {
            state.singleManagerData = action.payload ? action.payload : {};
        },
        clearManager: () => initialState,
    },

    extraReducers: (builder) => {
        builder
            .addCase(managerGet.pending, (state, action: PayloadAction<any>) => {
                state.isLoading = true;
            })
            .addCase(managerGet.fulfilled, (state, action: PayloadAction<any>) => {
                state.managerData = prepareData(action.payload);
                state.isLoading = false;
            })
            .addCase(managerGet.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
            });

        builder.addCase(
            managerSearch.pending,
            (state, action: PayloadAction<any>) => {
                state.isLoading = true;
            }
        );

        builder
            .addCase(managerSearch.fulfilled, (state, action: PayloadAction<any>) => {
                state.managerData = prepareData(action.payload);
                state.isLoading = true;
            })

            .addCase(managerSearch.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
            });

        builder.addCase(
            managerOptionsGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                const data = action.payload?.data;
                state.managerOptions = data?.map((val: any) => ({
                    value: val?.uuid,
                    label: val?.name,
                }));
            }
        );
    },
});
export default managerSlice.reducer;
export const { updateSingleManagerData, clearManager } = managerSlice.actions;

export const selectIsLoading = (state: RootState) => state.manager.isLoading;
export const useIsLoading = () => {
    const isLoading = useAppSelector(selectIsLoading);
    return useMemo(() => isLoading, [isLoading]);
};

export const selectManagerData = (state: RootState) =>
    state.manager.managerData;
export const useManager = () => {
    const manager = useAppSelector(selectManagerData);
    return useMemo(() => manager, [manager]);
};

export const selectSingleManager = (state: RootState) =>
    state.manager.singleManagerData;
export const useSingleManager = () => {
    const manager = useAppSelector(selectSingleManager);
    return useMemo(() => manager, [manager]);
};

export const selectManagerOptions = (state: RootState) =>
    state.manager.managerOptions;
export const useManagerOptions = () => {
    const managerOptions = useAppSelector(selectManagerOptions);
    return useMemo(() => managerOptions, [managerOptions]);
};
