import {
    SERVER_SYNC_SERVERS,
    SERVER_SYNC_PREVIEW,
    SERVER_SYNC_EXECUTE,
    SERVER_SYNC_HISTORY,
    SERVER_SYNC_VALIDATE_PIPELINE,
} from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

// Get available servers & supported modules
export const getAvailableServers = () => {
    return apiInstance.get(SERVER_SYNC_SERVERS);
};

// Validate Pipeline (Source & Target MongoDB Connectivity)
export const validateServerSyncPipeline = (payload: { source_server: string; target_server: string }) => {
    return apiInstance.post(SERVER_SYNC_VALIDATE_PIPELINE, payload);
};

// Preview sync changes (Dry Run)
export const previewServerSync = (payload: any) => {
    return apiInstance.post(SERVER_SYNC_PREVIEW, payload);
};

// Execute synchronization
export const executeServerSync = (payload: any) => {
    return apiInstance.post(SERVER_SYNC_EXECUTE, payload);
};

// Get synchronization history logs
export const getServerSyncHistory = (params: any) => {
    return apiInstance.get(SERVER_SYNC_HISTORY, { params });
};

// Get single sync history detail
export const getServerSyncHistoryById = (id: string) => {
    return apiInstance.get(`${SERVER_SYNC_HISTORY}/${id}`);
};

// Get detailed records for a module
export const getModuleSyncData = (params: { module: string; source_server: string; target_server?: string; tenant_uuid?: string }) => {
    return apiInstance.get("/server-sync/module-data", { params });
};

