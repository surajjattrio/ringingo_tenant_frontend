import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";

// TYPES IMPORT
import { OptionTypes } from "@/types/formTypes";
import {
    allTenantDisposition,
    createTenantDisposition,
    deleteTenantDisposition,
    tenantDisposition,
    searchTenantDisposition,
    singleTenantDisposition,
    updateTenantDisposition,
    updateTenantDispositionStatus,
} from "@/redux/services/tenant-admin/leadStatusService";

interface InitialState {
    isLoading: boolean;
    dispositionData: any;
    allDispositionData: any;
    getSingleDisposition: any;
    singleDispositionData: any;
    dispositionOptions: OptionTypes[];
}

const initialState: InitialState = {
    isLoading: false,
    dispositionData: [],
    allDispositionData: [],
    getSingleDisposition: {},
    singleDispositionData: {},
    dispositionOptions: [],
};

export const tenantDispositionGet = createAsyncThunk(
    "tenant-lead-status/get",
    async (params: any) => {
        return await tenantDisposition(params);
    }
);

export const tenantDispositionSingleGet = createAsyncThunk(
    "tenant-lead-status/single-get",
    async (id: string) => {
        return await singleTenantDisposition(id);
    }
);

export const tenantDispositionSearch = createAsyncThunk(
    "tenant-lead-status/search",
    async (payload: any) => {
        return await searchTenantDisposition(payload);
    }
);

export const tenantDispositionCreate = createAsyncThunk(
    "tenant-lead-status/create",
    async (payload: any) => {
        return await createTenantDisposition(payload);
    }
);

export const tenantDispositionUpdate = createAsyncThunk(
    "tenant-lead-status/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateTenantDisposition(id, rest);
    }
);

export const tenantDispositionStatusUpdate = createAsyncThunk(
    "tenant-lead-status/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateTenantDispositionStatus(id, rest);
    }
);

export const tenantDispositionDelete = createAsyncThunk(
    "tenant-lead-status/delete",
    async (id: string) => {
        return await deleteTenantDisposition(id);
    }
);

export const tenantDispositionOptionsGet = createAsyncThunk(
    "tenant-lead-status-options/getAll",
    async () => {
        return await allTenantDisposition();
    }
);

const tenantLeadStatusSlice = createSlice({
    name: "tenant-lead-status",
    initialState,
    reducers: {
        updateSingleTenantDispositionData: (state, action) => {
            state.singleDispositionData = action.payload ? action.payload : {};
        },
        clearTenantDisposition: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(tenantDispositionGet.pending, (state) => {
                state.isLoading = true;
            })

            .addCase(
                tenantDispositionGet.fulfilled,
                (state, action: PayloadAction<any>) => {
                    const data = action.payload?.data;
                    const count = action.payload?.count;
                    const newData = data?.map((val: any) => ({
                        ...val,

                        uuid: val.pbx_lead_status_uuid,
                        name: val?.name,
                    }));
                    state.dispositionData = { data: newData, count };
                    state.isLoading = false;
                    console.log("DDDD",state.dispositionData);
                }
            )

            .addCase(
                tenantDispositionGet.rejected,
                (state, action: PayloadAction<any>) => {
                    state.isLoading = false;
                }
            );

        builder
            .addCase(
                tenantDispositionSearch.pending,
                (state, action: PayloadAction<any>) => {
                    state.isLoading = true;
                }
            )

            .addCase(
                tenantDispositionSearch.fulfilled,
                (state, action: PayloadAction<any>) => {
                    const data = action.payload?.data;
                    const count = action.payload?.count;
                    const newData = data?.map((val: any) => ({
                        ...val,

                        uuid: val.disposition_uuid,
                        disabled: val?.created_flag === "0",
                        // name: val?.created_flag === "0" ? val?.name + " (admin)" : val?.name,
                        name: val?.name,
                    }));
                    state.dispositionData = { data: newData, count };
                    state.isLoading = false;
                }
            )

            .addCase(
                tenantDispositionSearch.rejected,
                (state, action: PayloadAction<any>) => {
                    state.isLoading = false;
                }
            );

        builder.addCase(
            tenantDispositionOptionsGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                const data = action.payload?.data?.length ? action.payload?.data : [];
                state.dispositionOptions = data?.map((val: any) => ({
                    value: val.disposition_uuid,
                    // label: `${val?.name}${val?.created_flag === "0" ? " (admin)" : ""}`,
                    label: val?.name,
                }));
            }
        );
    },
});

export default tenantLeadStatusSlice.reducer;

export const { updateSingleTenantDispositionData, clearTenantDisposition } =
tenantLeadStatusSlice.actions;

export const selectIsLoading = (state: RootState) =>
    state.tenantLeadStatus.isLoading;
export const useIsLoading = () => {
    const isLoading = useAppSelector(selectIsLoading);
    return useMemo(() => isLoading, [isLoading]);
};

export const selectTenantDispositionData = (state: RootState) =>
    state.tenantLeadStatus.dispositionData;
export const useTenantDispositionData = () => {
    const tenantDispositionData = useAppSelector(selectTenantDispositionData);
    return useMemo(() => tenantDispositionData, [tenantDispositionData]);
};

export const selectSingleTenantDisposition = (state: RootState) =>
    state.tenantLeadStatus.singleDispositionData;
export const useSingleTenantDisposition = () => {
    const tenantDispositionData = useAppSelector(selectSingleTenantDisposition);
    return useMemo(() => tenantDispositionData, [tenantDispositionData]);
};

export const selectTenantDispositionOptions = (state: RootState) =>
    state.tenantLeadStatus.dispositionOptions;
export const useTenantDispositionOptions = () => {
    const options = useAppSelector(selectTenantDispositionOptions);
    return useMemo(() => options, [options]);
};

