import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useMemo } from "react";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import {
    getAvailableServers,
    validateServerSyncPipeline,
    previewServerSync,
    executeServerSync,
    getServerSyncHistory,
    getServerSyncHistoryById,
    getModuleSyncData,
} from "@/redux/services/master-admin/serverSyncServices";

interface ServerItem {
    server_key?: string;
    server_name?: string;
    id: string;
    name: string;
    ip?: string;
    prefix?: string;
    isLocal?: boolean;
    isCurrent?: boolean;
    is_current?: boolean;
    is_active?: boolean;
    description?: string;
}

interface ServerSyncState {
    servers: Array<ServerItem>;
    currentServer: ServerItem | null;
    supportedModules: Array<{ key: string; label: string }>;
    previewData: any;
    executionResult: any;
    historyData: any;
    singleHistoryData: any;
    moduleRecordsCache: Record<string, any>;
    pipelineValidation: any;
    validatingPipeline: boolean;
    loading: boolean;
    syncing: boolean;
    moduleLoading: boolean;
    error: any;
}

const initialState: ServerSyncState = {
    servers: [],
    currentServer: null,
    supportedModules: [],
    previewData: null,
    executionResult: null,
    historyData: { history: [], total: 0, page: 1, limit: 10, totalPages: 0 },
    singleHistoryData: null,
    moduleRecordsCache: {},
    pipelineValidation: null,
    validatingPipeline: false,
    loading: false,
    syncing: false,
    moduleLoading: false,
    error: null,
};

// Async Thunks
export const validatePipeline = createAsyncThunk(
    "serverSync/validatePipeline",
    async (payload: { source_server: string; target_server: string }, { rejectWithValue }) => {
        try {
            const response: any = await validateServerSyncPipeline(payload);
            return response?.data || response;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data || error.message);
        }
    }
);

export const fetchModuleRecords = createAsyncThunk(
    "serverSync/fetchModuleRecords",
    async (params: { module: string; source_server: string; target_server?: string; tenant_uuid?: string }, { rejectWithValue }) => {
        try {
            const response: any = await getModuleSyncData(params);
            return { module: params.module, data: response?.data || response };
        } catch (error: any) {
            return rejectWithValue(error?.response?.data || error.message);
        }
    }
);
export const fetchServers = createAsyncThunk(
    "serverSync/fetchServers",
    async (_, { rejectWithValue }) => {
        try {
            const response: any = await getAvailableServers();
            return response?.data || response;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data || error.message);
        }
    }
);

export const previewSync = createAsyncThunk(
    "serverSync/previewSync",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response: any = await previewServerSync(payload);
            return response?.data || response;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data || error.message);
        }
    }
);

export const executeSync = createAsyncThunk(
    "serverSync/executeSync",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response: any = await executeServerSync(payload);
            return response?.data || response;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data || error.message);
        }
    }
);

export const fetchSyncHistory = createAsyncThunk(
    "serverSync/fetchSyncHistory",
    async (params: any, { rejectWithValue }) => {
        try {
            const response: any = await getServerSyncHistory(params);
            return response?.data || response;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data || error.message);
        }
    }
);

export const fetchSyncHistoryById = createAsyncThunk(
    "serverSync/fetchSyncHistoryById",
    async (id: string, { rejectWithValue }) => {
        try {
            const response: any = await getServerSyncHistoryById(id);
            return response?.data || response;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data || error.message);
        }
    }
);

const serverSyncSlice = createSlice({
    name: "serverSync",
    initialState,
    reducers: {
        clearPreviewData: (state) => {
            state.previewData = null;
        },
        clearExecutionResult: (state) => {
            state.executionResult = null;
        },
        clearModuleRecordsCache: (state) => {
            state.moduleRecordsCache = {};
        },
        resetServerSyncState: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            // fetchModuleRecords
            .addCase(fetchModuleRecords.pending, (state) => {
                state.moduleLoading = true;
            })
            .addCase(fetchModuleRecords.fulfilled, (state, action) => {
                state.moduleLoading = false;
                if (action.payload?.module) {
                    state.moduleRecordsCache[action.payload.module] = action.payload.data?.data || action.payload.data;
                }
            })
            .addCase(fetchModuleRecords.rejected, (state, action) => {
                state.moduleLoading = false;
                state.error = action.payload;
            })
            // fetchServers
            .addCase(fetchServers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchServers.fulfilled, (state, action) => {
                state.loading = false;
                state.servers = action.payload?.data || action.payload || [];
                state.currentServer = action.payload?.currentServer || null;
                state.supportedModules = action.payload?.supportedModules || [];
            })
            .addCase(fetchServers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // validatePipeline
            .addCase(validatePipeline.pending, (state) => {
                state.validatingPipeline = true;
            })
            .addCase(validatePipeline.fulfilled, (state, action) => {
                state.validatingPipeline = false;
                state.pipelineValidation = action.payload?.data || action.payload;
            })
            .addCase(validatePipeline.rejected, (state, action) => {
                state.validatingPipeline = false;
                state.error = action.payload;
            })
            // previewSync
            .addCase(previewSync.pending, (state) => {
                state.loading = true;
            })
            .addCase(previewSync.fulfilled, (state, action) => {
                state.loading = false;
                state.previewData = action.payload?.data || action.payload;
            })
            .addCase(previewSync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // executeSync
            .addCase(executeSync.pending, (state) => {
                state.syncing = true;
            })
            .addCase(executeSync.fulfilled, (state, action) => {
                state.syncing = false;
                state.executionResult = action.payload?.data || action.payload;
            })
            .addCase(executeSync.rejected, (state, action) => {
                state.syncing = false;
                state.error = action.payload;
            })
            // fetchSyncHistory
            .addCase(fetchSyncHistory.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSyncHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.historyData = action.payload?.data || action.payload || { history: [], total: 0 };
            })
            .addCase(fetchSyncHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // fetchSyncHistoryById
            .addCase(fetchSyncHistoryById.fulfilled, (state, action) => {
                state.singleHistoryData = action.payload?.data || action.payload;
            });
    },
});

export const { clearPreviewData, clearExecutionResult, clearModuleRecordsCache, resetServerSyncState } = serverSyncSlice.actions;

export default serverSyncSlice.reducer;

// Selectors & Custom Hooks
export const selectServerSyncState = (state: RootState) => state.serverSync;

export const useServerSync = () => {
    const serverSyncState = useAppSelector(selectServerSyncState);
    return useMemo(() => ({
        servers: serverSyncState?.servers || [],
        currentServer: serverSyncState?.currentServer || null,
        pipelineValidation: serverSyncState?.pipelineValidation || null,
        validatingPipeline: !!serverSyncState?.validatingPipeline,
        supportedModules: serverSyncState?.supportedModules || [],
        previewData: serverSyncState?.previewData || null,
        executionResult: serverSyncState?.executionResult || null,
        historyData: serverSyncState?.historyData || { history: [], total: 0, page: 1, limit: 10, totalPages: 0 },
        singleHistoryData: serverSyncState?.singleHistoryData || null,
        moduleRecordsCache: serverSyncState?.moduleRecordsCache || {},
        loading: !!serverSyncState?.loading,
        syncing: !!serverSyncState?.syncing,
        moduleLoading: !!serverSyncState?.moduleLoading,
        error: serverSyncState?.error || null,
    }), [serverSyncState]);
};
