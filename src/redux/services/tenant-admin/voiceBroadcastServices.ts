//PROJECT IMPORT
import {
    VOICE_BROADCAST,
    VOICE_BROADCAST_SEARCH,
    LEAD_GROUP_LIST,
    VOICE_BROADCAST_RESET_LEAD,
    VOICE_BROADCAST_FEATURE,
    LEAD_GROUP_DELETE,
} from "@/API/constAPI";
import { apiInstance } from "@/redux/axiosApi";

/* ============================== DNC SERVICES ============================== */

export const voiceBroadcast = (params: any) => {
    return apiInstance.get(VOICE_BROADCAST, { params });
};

export const singleVoiceBroadcast = (id: string) => {
    return apiInstance.get(VOICE_BROADCAST + `/${id}`);
};

export const searchVoiceBroadcast = (payload: any) => {
    return apiInstance.post(VOICE_BROADCAST_SEARCH, payload);
};

export const createVoiceBroadcast = (payload: any) => {
    return apiInstance.post(VOICE_BROADCAST, payload);
};

export const updateVoiceBroadcast = (id: string, payload: any) => {
    return apiInstance.put(VOICE_BROADCAST + `/${id}`, payload);
};

export const updateVoiceBroadcastStatus = (id: string, payload: any) => {
    return apiInstance.patch(VOICE_BROADCAST + `/${id}`, payload);
};

export const deleteVoiceBroadcast = (id: string) => {
    return apiInstance.delete(VOICE_BROADCAST + `/${id}`);
};

export const leadGroupListVoiceBroadcast = (id: string, params: any) => {
    return apiInstance.get(LEAD_GROUP_LIST + `/${id}`, { params });
};

export const resetVoiceBroadcast = (payload: any) => {
    return apiInstance.post(VOICE_BROADCAST_RESET_LEAD, payload);
};

export const updateVoiceBroadcastFeature = (feature: string, payload: any) => {
    return apiInstance.patch(VOICE_BROADCAST_FEATURE + `/${feature}`, payload);
};

export const allVoiceBroadcastGet = (params?: any) => {
    return apiInstance.get(VOICE_BROADCAST, { params });
};

export const deleteVoiceBroadcastLeadGroup = (payload: any) => {
    return apiInstance.post(LEAD_GROUP_DELETE, payload);
};
