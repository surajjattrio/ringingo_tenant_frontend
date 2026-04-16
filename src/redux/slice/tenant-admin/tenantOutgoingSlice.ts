import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";
import {
    allTenantOutgoing,
    createTenantOutgoing,
    deleteTenantOutgoing,
    searchTenantOutgoing,
    tenantOutgoing,
    updateTenantOutgoing,
    updateTenantOutgoingStatus,
} from "@/redux/services/tenant-admin/tenantOutgoingServices";

// TYPES IMPORT
import { OptionTypes } from "@/types/formTypes";

interface InitialState {
    isLoading: boolean;
    outgoingData: any;
    singleOutgoingData: any;
    outgoingOptions: OptionTypes[];
}

const initialState: InitialState = {
    isLoading: false,
    outgoingData: {},
    singleOutgoingData: {},
    outgoingOptions: [],
};

export const tenantOutgoingGet = createAsyncThunk(
    "tenant-outgoing/get",
    async (params: any) => {
        return await tenantOutgoing(params);
    }
);

export const tenantOutgoingSearch = createAsyncThunk(
    "tenant-outgoing/search",
    async (params: any) => {
        return await searchTenantOutgoing(params);
    }
);

export const managerOutgoingGet = createAsyncThunk(
    "manager-outgoing/get",
    async (params: any) => {
        return await tenantOutgoing(params);
    }
);

export const managerOutgoingSearch = createAsyncThunk(
    "manager-outgoing/search",
    async (params: any) => {
        return await searchTenantOutgoing(params);
    }
);

export const tenantOutgoingCreate = createAsyncThunk(
    "tenant-outgoing/create",
    async (payload: any) => {
        return await createTenantOutgoing(payload);
    }
);

export const tenantOutgoingUpdate = createAsyncThunk(
    "tenant-outgoing/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateTenantOutgoing(id, rest);
    }
);

export const tenantOutgoingStatusUpdate = createAsyncThunk(
    "tenant-outgoing-status/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateTenantOutgoingStatus(id, rest);
    }
);
export const tenantOutgoingDelete = createAsyncThunk(
    "tenant-outgoing/delete",
    async (id: string) => {
        return await deleteTenantOutgoing(id);
    }
);

export const tenantOutgoingOptionsGet = createAsyncThunk(
    "tenant-outgoing-options/get",
    async () => {
        return await allTenantOutgoing();
    }
);

const tenantOutgoingSlice = createSlice({
    name: "tenant-outgoing",
    initialState,
    reducers: {
        updateSingleTenantOutgoingData: (state, action) => {
            state.singleOutgoingData = action.payload ? action.payload : {};
        },
        clearTenantOutgoing: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(tenantOutgoingGet.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(
                tenantOutgoingGet.fulfilled,
                (state, action: PayloadAction<any>) => {
                    const data = action.payload?.data;
                    const newData = data?.map((val: any) => ({
                        ...val,
                        disabled: val?.created_flag === "0",
                        name:
                            val?.created_flag === "1"
                                ? val?.name
                                : val?.created_flag === "2"
                                    ? val?.name
                                    : val?.name + " (admin)",
                    }));
                    state.outgoingData = { data: newData, count: action.payload?.count };
                    state.isLoading = false;
                }
            )
            .addCase(tenantOutgoingGet.rejected, (state) => {
                state.isLoading = false;
            });

        builder
            .addCase(
                tenantOutgoingSearch.pending,
                (state, action: PayloadAction<any>) => {
                    state.isLoading = true;
                }
            )
            .addCase(
                tenantOutgoingSearch.fulfilled,
                (state, action: PayloadAction<any>) => {
                    const data = action.payload?.data;
                    const newData = data?.map((val: any) => ({
                        ...val,
                        disabled: val?.created_flag === "0",
                        name:
                            val?.created_flag === "1"
                                ? val?.name
                                : val?.created_flag === "2"
                                    ? val?.name
                                    : val?.name + " (admin)",
                    }));
                    state.outgoingData = { data: newData, count: action.payload?.count };
                    state.isLoading = false;
                }
            )
            .addCase(
                tenantOutgoingSearch.rejected,
                (state, action: PayloadAction<any>) => {
                    state.isLoading = false;
                }
            );

        builder.addCase(
            tenantOutgoingOptionsGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                const data = action.payload?.data;
                state.outgoingOptions = data?.map((val: any) => ({
                    value: val?.uuid,
                    label: `${val?.name}${val?.created_flag === "0" ? " (admin)" : ""}`,
                }));
            }
        );

        builder.addCase(
            managerOutgoingGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                const data = action.payload?.data;
                const newData = data?.map((val: any) => ({
                    ...val,
                    disabled: val?.created_flag === "1",
                    name: val?.created_flag === "2" ? val?.name : val?.name + " (admin)",
                }));
                state.outgoingData = { data: newData, count: action.payload?.count };
                state.isLoading = false;
            }
        );

        builder.addCase(
            managerOutgoingSearch.fulfilled,
            (state, action: PayloadAction<any>) => {
                const data = action.payload?.data;
                const newData = data?.map((val: any) => ({
                    ...val,
                    disabled: val?.created_flag === "1",
                    name: val?.created_flag === "2" ? val?.name : val?.name + " (admin)",
                }));
                state.outgoingData = { data: newData, count: action.payload?.count };
                state.isLoading = false;
            }
        );
    },
});

export default tenantOutgoingSlice.reducer;
export const { updateSingleTenantOutgoingData, clearTenantOutgoing } =
    tenantOutgoingSlice.actions;

export const selectIsLoading = (state: RootState) =>
    state.tenantOutgoing.isLoading;
export const useIsLoading = () => {
    const isLoading = useAppSelector(selectIsLoading);
    return useMemo(() => isLoading, [isLoading]);
};

export const selectTenantOutgoing = (state: RootState) =>
    state.tenantOutgoing.outgoingData;
export const useTenantOutgoing = () => {
    const tenantOutgoing = useAppSelector(selectTenantOutgoing);
    return useMemo(() => tenantOutgoing, [tenantOutgoing]);
};

export const selectSingleTenantOutgoing = (state: RootState) =>
    state.tenantOutgoing.singleOutgoingData;
export const useSingleTenantOutgoing = () => {
    const tenantOutgoing = useAppSelector(selectSingleTenantOutgoing);
    return useMemo(() => tenantOutgoing, [tenantOutgoing]);
};

export const selectTenantOutgoingOptions = (state: RootState) =>
    state.tenantOutgoing.outgoingOptions;
export const useTenantOutgoingOptions = () => {
    const options = useAppSelector(selectTenantOutgoingOptions);
    return useMemo(() => options, [options]);
};
