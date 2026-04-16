import { apiInstance } from '@/redux/axiosApi';
import axios from 'axios';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_MICRO_SERVICE_RMQ_URL}/api/google-drive`;
const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export interface GoogleDriveSettings {
    _id?: string;
    tenant_uuid?: string;
    client_id: string;
    client_secret: string;
    refresh_token: string;
    root_folder_id: string;
    redirect_uri?: string;
    enabled: boolean;
    created_at?: string;
    updated_at?: string;
}

export const googleDriveService = {
    // --- Settings ---

    getSettings: async (tenantUuid?: string) => {
        try {
            const params = tenantUuid ? { tenant_uuid: tenantUuid } : {};
            const response = await axios.get(`${API_BASE_URL}/settings`, { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    createSettings: async (settings: Partial<GoogleDriveSettings>) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/settings`, settings);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateSettings: async (settings: Partial<GoogleDriveSettings>) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/settings`, settings);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteSettings: async (tenantUuid: string) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/settings`, {
                params: { tenant_uuid: tenantUuid }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    testConnection: async (tenantUuid?: string) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/test-connection`, {
                tenant_uuid: tenantUuid
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    toggleIntegration: async (enabled: boolean, tenantUuid?: string) => {
        try {
            const response = await axios.patch(`${API_BASE_URL}/toggle`, {
                tenant_uuid: tenantUuid,
                enabled
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // --- Analytics ---

    getDashboardStats: async (params?: { tenant_uuid?: string; start_date?: string; end_date?: string }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/analytics/dashboard`, { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getUploadActivity: async (params?: { tenant_uuid?: string; start_date?: string; end_date?: string; interval?: 'day' | 'week' | 'month'; user_uuid?: string }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/analytics/upload-activity`, { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Recordings API
    getRecordingLogs: async (params: any) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/recordings`, { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getRecordingStats: async (params: any = {}) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/recordings/stats/summary`, { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
// --- OAuth Flow ---

initiateOAuth: async (tenantUuid: string, rootFolderId?: string) => {
    try {
        const response = await apiInstance.post(`${NEXT_PUBLIC_BASE_URL}/oauth/initiate`, {
            tenant_uuid: tenantUuid,
            root_folder_id: rootFolderId
        });
        return response;
    } catch (error) {
        throw error;
    }
},

checkOAuthStatus: async (tenantUuid: string) => {
    try {
        const response = await apiInstance.get(`${NEXT_PUBLIC_BASE_URL}/oauth/status`, {
            params: { tenant_uuid: tenantUuid }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
},

listDriveFolders: async (state: string) => {
    try {
        const response = await apiInstance.get(`${NEXT_PUBLIC_BASE_URL}/oauth/folders`, {
            params: { state }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
},

completeOAuth: async (state: string, rootFolderId: string) => {
    try {
        const response = await apiInstance.post(`${NEXT_PUBLIC_BASE_URL}/oauth/complete`, {
            state,
            root_folder_id: rootFolderId
        });
        return response.data;
    } catch (error) {
        throw error;
    }
},

disconnectOAuth: async (tenantUuid: string) => {
    try {
        const response = await apiInstance.delete(`${NEXT_PUBLIC_BASE_URL}/oauth/disconnect`, {
            data: { tenant_uuid: tenantUuid }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
},
};
