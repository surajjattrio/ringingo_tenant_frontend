import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import {
    getApiConfigurations,
    createApiConfiguration,
    updateApiConfiguration,
    deleteApiConfiguration,
    getSingleApiConfiguration
} from "@/redux/services/tenant-admin/apiConfigurationServices";
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";

interface InitialState {
    isLoading: boolean;
    configs: any;
    singleConfig: any;
}

const initialState: InitialState = {
    isLoading: false,
    configs: { data: [], count: 0 },
    singleConfig: {},
};

export const apiConfigsGet = createAsyncThunk("apiConfig/get", async (params: any) => {
    return await getApiConfigurations(params);
});

export const apiConfigCreate = createAsyncThunk("apiConfig/create", async (payload: any) => {
    return await createApiConfiguration(payload);
});

export const apiConfigUpdate = createAsyncThunk("apiConfig/update", async (payload: any) => {
    const { id, ...rest } = payload;
    return await updateApiConfiguration(id, rest);
});

export const apiConfigDelete = createAsyncThunk("apiConfig/delete", async (id: string) => {
    return await deleteApiConfiguration(id);
});

const apiConfigurationSlice = createSlice({
    name: "apiConfiguration",
    initialState,
    reducers: {
        updateSingleApiConfigData: (state, action) => {
            state.singleConfig = action.payload ? action.payload : {};
        },
        clearApiConfig: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(apiConfigsGet.pending, (state) => { state.isLoading = true; })
            .addCase(apiConfigsGet.fulfilled, (state, action: PayloadAction<any>) => {
                if (Array.isArray(action.payload)) {
                    state.configs = { data: action.payload, count: action.payload.length };
                } else {
                    state.configs = { 
                        data: action.payload?.data || [], 
                        count: action.payload?.count !== undefined ? action.payload?.count : (action.payload?.data?.length || 0)
                    };
                }
                state.isLoading = false;
            })
            .addCase(apiConfigsGet.rejected, (state) => { state.isLoading = false; });
    },
});

export default apiConfigurationSlice.reducer;
export const { updateSingleApiConfigData, clearApiConfig } = apiConfigurationSlice.actions;

export const useApiConfigIsLoading = () => {
    const isLoading = useAppSelector((state: RootState) => state.apiConfiguration.isLoading);
    return useMemo(() => isLoading, [isLoading]);
};

export const useApiConfigs = () => {
    const data = useAppSelector((state: RootState) => state.apiConfiguration.configs);
    return useMemo(() => data, [data]);
};

export const useSingleApiConfigData = () => {
    const data = useAppSelector((state: RootState) => state.apiConfiguration.singleConfig);
    return useMemo(() => data, [data]);
};
