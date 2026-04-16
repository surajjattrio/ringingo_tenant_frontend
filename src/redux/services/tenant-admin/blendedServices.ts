// PROJECT IMPORTS
import {
    BLENDED_CAMPAIGN,
    BLENDED_CAMPAIGN_SEARCH,
    BLENDED_CAMPAIGN_DIALABLE_TABLE,
    BLENDED_CAMPAIGN_DIALABLE,
    BLENDED_CAMPAIGN_LEAD_RESET,
    BLENDED_CAMPAIGN_HNAGUP_ADD,
    BLENDED_CAMPAIGN_HANGUP_DELETE,
    BLENDED_CAMPAIGN_DIALABLE_TABLE_ADD,
    BLENDED_CAMPAIGN_LEAD_GROUP_DELETE,
    BLENDED_CAMPAIGN_PRESET,
    BLENDED_CAMPAIGN_PRESET_ADD,
    BLENDED_CAMPAIGN_PRESET_DELETE,
    BLENDED_CAMPAIGN_PRESET_UPDATE,
    BLENDED_CAMPAIGN_PRESET_GET,
} from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== BLENDED - CAMPAIGN SERVICES ============================== */

export const blended = (params: any) => {
    return apiInstance.get(BLENDED_CAMPAIGN, { params });
};

export const singleBlended = (id: string) => {
    return apiInstance.get(BLENDED_CAMPAIGN + `/${id}`);
};

export const singleFeatureBlended = (
    feature: string,
    id: string,
    params: any
) => {
    return apiInstance.get(BLENDED_CAMPAIGN + `/${feature}` + `/${id}`, {
        params,
    });
};

export const dialableTableBlended = (params: any) => {
    return apiInstance.get(BLENDED_CAMPAIGN_DIALABLE_TABLE, {
        params,
    });
};

export const allBlended = () => {
    return apiInstance.get(BLENDED_CAMPAIGN);
};

export const allBlendedLead = () => {
    return apiInstance.get(BLENDED_CAMPAIGN_DIALABLE_TABLE);
};

export const searchBlended = (payload: any) => {
    return apiInstance.post(BLENDED_CAMPAIGN_SEARCH, payload);
};

export const createBlended = (payload: any) => {
    return apiInstance.post(BLENDED_CAMPAIGN, payload);
};

export const addDialableTableBlended = (payload: any) => {
    return apiInstance.post(BLENDED_CAMPAIGN_DIALABLE_TABLE_ADD, payload);
};

export const addHangupBlended = (payload: any) => {
    return apiInstance.post(BLENDED_CAMPAIGN_HNAGUP_ADD, payload);
};

export const resetLeadBlended = (payload: any) => {
    return apiInstance.post(BLENDED_CAMPAIGN_LEAD_RESET, payload);
};

export const updateBlended = (id: string, payload: any) => {
    return apiInstance.put(BLENDED_CAMPAIGN + `/${id}`, payload);
};

export const updateFeatureBlended = (feature: string, payload: any) => {
    return apiInstance.put(BLENDED_CAMPAIGN + `/${feature}`, payload);
};

export const updateBlendedStatus = (id: string, payload: any) => {
    return apiInstance.patch(BLENDED_CAMPAIGN + `/${id}`, payload);
};

export const deleteBlended = (id: string) => {
    return apiInstance.delete(BLENDED_CAMPAIGN + `/${id}`);
};

export const deleteDialableBlended = (id: string) => {
    return apiInstance.delete(BLENDED_CAMPAIGN_DIALABLE + `/${id}`);
};

export const deleteHangupBlended = (id: string) => {
    return apiInstance.delete(BLENDED_CAMPAIGN_HANGUP_DELETE + `/${id}`);
};

export const deleteCampaignLeadGroup = (payload: any) => {
    return apiInstance.post(BLENDED_CAMPAIGN_LEAD_GROUP_DELETE, payload);
};


export const addPresetBlended = (payload: any) => {
    return apiInstance.post(BLENDED_CAMPAIGN_PRESET_ADD, payload);
};


export const deletePresetBlended = (id: string) => {
    return apiInstance.delete(BLENDED_CAMPAIGN_PRESET_DELETE + `/${id}`);
};

export const updatePresetBlended = (id: string, payload: any) => {
    return apiInstance.put(BLENDED_CAMPAIGN_PRESET_UPDATE + `/${id}`, payload);
};

export const singlePreset = (uuid: string) => {
    return apiInstance.get(BLENDED_CAMPAIGN_PRESET_GET + `/${uuid}`);
};

export const getPresetBlended = (
    feature: string,
    id: string,
    params: any
) => {
    return apiInstance.get(BLENDED_CAMPAIGN_PRESET + `/${feature}`, {
        params: {
            ...params,
            campaign_uuid: id
        },
    });
};

