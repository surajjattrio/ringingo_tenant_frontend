// PROJECT IMPORTS
import {
    INBOUND_CAMPAIGN,
    INBOUND_CAMPAIGN_SEARCH,
        INBOUND_CAMPAIGN_PRESET,
    INBOUND_CAMPAIGN_PRESET_ADD,
    INBOUND_CAMPAIGN_PRESET_DELETE,
    INBOUND_CAMPAIGN_PRESET_UPDATE,
     INBOUND_CAMPAIGN_PRESET_GET,
          INBOUND_CAMPAIGN_HANGUP_ADD,
     INBOUND_CAMPAIGN_HANGUP_DELETE,
     INBOUND_CAMPAIGN_HANGUP_GET,
} from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== INBOUND - CAMPAIGN SERVICES ============================== */

export const inbound = (params: any) => {
    return apiInstance.get(INBOUND_CAMPAIGN, { params });
};

export const singleInbound = (id: string) => {
    return apiInstance.get(INBOUND_CAMPAIGN + `/${id}`);
};


export const allInbound = () => {
    return apiInstance.get(INBOUND_CAMPAIGN);
};

export const searchInbound = (payload: any) => {
    return apiInstance.post(INBOUND_CAMPAIGN_SEARCH, payload);
};

export const createInbound = (payload: any) => {
    return apiInstance.post(INBOUND_CAMPAIGN, payload);
};

export const updateInbound = (id: string, payload: any) => {
     return apiInstance.put(INBOUND_CAMPAIGN + `/${id}`, payload);
};


export const updateInboundStatus = (id: string, payload: any) => {
    return apiInstance.patch(INBOUND_CAMPAIGN + `/${id}`, payload);
};

export const deleteInbound = (id: string) => {
    return apiInstance.delete(INBOUND_CAMPAIGN + `/${id}`);
};

export const getPresetInbound = (
    feature: string,
    id: string,
    params: any
) => {
    return apiInstance.get(INBOUND_CAMPAIGN_PRESET + `/${feature}`, {
        params: {
            ...params,
            campaign_uuid: id
        },
    });
};


export const addPresetInbound = (payload: any) => {
    return apiInstance.post(INBOUND_CAMPAIGN_PRESET_ADD, payload);
};


export const deletePresetInbound = (id: string) => {
    return apiInstance.delete(INBOUND_CAMPAIGN_PRESET_DELETE + `/${id}`);
};

export const updatePresetInbound = (id: string, payload: any) => {
    return apiInstance.put(INBOUND_CAMPAIGN_PRESET_UPDATE + `/${id}`, payload);
};

export const singlePreset = (uuid: string) => {
    return apiInstance.get(INBOUND_CAMPAIGN_PRESET_GET + `/${uuid}`);
};



export const addHangupInbound = (payload: any) => {
    return apiInstance.post(INBOUND_CAMPAIGN_HANGUP_ADD, payload);
};


export const deleteHangupInbound = (id: string) => {
    return apiInstance.delete(INBOUND_CAMPAIGN_HANGUP_DELETE + `/${id}`);
};

export const singleHangupInbound = (id: string) => {
    return apiInstance.get(INBOUND_CAMPAIGN_HANGUP_GET + `/${id}`);
};



