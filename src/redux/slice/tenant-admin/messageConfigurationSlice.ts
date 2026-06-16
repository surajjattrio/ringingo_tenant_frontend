import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import {
    getMessageConfigurations,
    createMessageConfiguration,
    updateMessageConfiguration,
    deleteMessageConfiguration,
    getSingleMessageConfiguration
} from "@/redux/services/tenant-admin/messageConfigurationServices";
import { useAppSelector } from "../../hooks";
import { RootState } from "../../store";

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

export const messageConfigsGet = createAsyncThunk("messageConfig/get", async (params: any) => {
    return await getMessageConfigurations(params);
});

export const messageConfigCreate = createAsyncThunk("messageConfig/create", async (payload: any) => {
    return await createMessageConfiguration(payload);
});

export const messageConfigUpdate = createAsyncThunk("messageConfig/update", async (payload: any) => {
    const { id, ...rest } = payload;
    return await updateMessageConfiguration(id, rest);
});

export const messageConfigDelete = createAsyncThunk("messageConfig/delete", async (id: string) => {
    return await deleteMessageConfiguration(id);
});

const messageConfigurationSlice = createSlice({
    name: "messageConfiguration",
    initialState,
    reducers: {
        updateSingleMessageConfigData: (state, action) => {
            state.singleConfig = action.payload ? action.payload : {};
        },
        clearMessageConfig: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(messageConfigsGet.pending, (state) => { state.isLoading = true; })
            .addCase(messageConfigsGet.fulfilled, (state, action: PayloadAction<any>) => {
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
            .addCase(messageConfigsGet.rejected, (state) => { state.isLoading = false; });
    },
});

export default messageConfigurationSlice.reducer;
export const { updateSingleMessageConfigData, clearMessageConfig } = messageConfigurationSlice.actions;

export const useMessageConfigIsLoading = () => {
    const isLoading = useAppSelector((state: RootState) => state.messageConfiguration.isLoading);
    return useMemo(() => isLoading, [isLoading]);
};

export const useMessageConfigs = () => {
    const data = useAppSelector((state: RootState) => state.messageConfiguration.configs);
    return useMemo(() => data, [data]);
};

export const useSingleMessageConfigData = () => {
    const data = useAppSelector((state: RootState) => state.messageConfiguration.singleConfig);
    return useMemo(() => data, [data]);
};