// PROJECT IMPORTS
import {
    OUTBOUND_CAMPAIGN,
    OUTBOUND_CAMPAIGN_SEARCH,
    OUTBOUND_CAMPAIGN_DIALABLE_TABLE,
    OUTBOUND_CAMPAIGN_DIALABLE,
    OUTBOUND_CAMPAIGN_LEAD_RESET,
    OUTBOUND_CAMPAIGN_LEAD_RESET_STATUS,
    OUTBOUND_CAMPAIGN_HNAGUP_ADD,
    OUTBOUND_CAMPAIGN_HANGUP_DELETE,
    OUTBOUND_CAMPAIGN_DIALABLE_TABLE_ADD,
    OUTBOUND_CAMPAIGN_LEAD_GROUP_DELETE,
      OUTBOUND_CAMPAIGN_PRESET,
    OUTBOUND_CAMPAIGN_PRESET_ADD,
    OUTBOUND_CAMPAIGN_PRESET_DELETE,
    OUTBOUND_CAMPAIGN_PRESET_UPDATE,
       OUTBOUND_CAMPAIGN_PRESET_GET,
} from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== OUTBOUND - CAMPAIGN SERVICES ============================== */

export const outbound = (params: any) => {
    return apiInstance.get(OUTBOUND_CAMPAIGN, { params });
};

export const singleOutbound = (id: string) => {
    return apiInstance.get(OUTBOUND_CAMPAIGN + `/${id}`);
};

export const singleFeatureOutbound = (
    feature: string,
    id: string,
    params: any
) => {
    return apiInstance.get(OUTBOUND_CAMPAIGN + `/${feature}` + `/${id}`, {
        params,
    });
};

export const dialableTableOutbound = (params: any) => {
    return apiInstance.get(OUTBOUND_CAMPAIGN_DIALABLE_TABLE, {
        params,
    });
};

export const allOutbound = () => {
    return apiInstance.get(OUTBOUND_CAMPAIGN);
};

export const allOutboundLead = () => {
    return apiInstance.get(OUTBOUND_CAMPAIGN_DIALABLE_TABLE);
};

export const searchOutbound = (payload: any) => {
    return apiInstance.post(OUTBOUND_CAMPAIGN_SEARCH, payload);
};

export const createOutbound = (payload: any) => {
    return apiInstance.post(OUTBOUND_CAMPAIGN, payload);
};

export const addDialableTableOutbound = (payload: any) => {
    return apiInstance.post(OUTBOUND_CAMPAIGN_DIALABLE_TABLE_ADD, payload);
};

export const addHangupOutbound = (payload: any) => {
    return apiInstance.post(OUTBOUND_CAMPAIGN_HNAGUP_ADD, payload);
};

export const resetLeadOutbound = (payload: any) => {
    return apiInstance.post(OUTBOUND_CAMPAIGN_LEAD_RESET, payload);
};

// Polls the status of an async lead-reset job (job_uuid returned by resetLeadOutbound
// when ENABLE_LEAD_RECHURN_MICROSERVICE=true on the backend). Not applicable to the
// synchronous fallback / blended-campaign reset, which return their result directly.
export const getLeadResetJobStatus = (job_uuid: string, tenant_uuid: string) => {
    return apiInstance.get(OUTBOUND_CAMPAIGN_LEAD_RESET_STATUS, { params: { job_uuid, tenant_uuid } });
};

export const updateOutbound = (id: string, payload: any) => {
    return apiInstance.put(OUTBOUND_CAMPAIGN + `/${id}`, payload);
};

export const updateFeatureOutbound = (feature: string, payload: any) => {
    return apiInstance.put(OUTBOUND_CAMPAIGN + `/${feature}`, payload);
};

export const updateOutboundStatus = (id: string, payload: any) => {
    return apiInstance.patch(OUTBOUND_CAMPAIGN + `/${id}`, payload);
};

export const deleteOutbound = (id: string) => {
    return apiInstance.delete(OUTBOUND_CAMPAIGN + `/${id}`);
};

export const deleteDialableOutbound = (id: string) => {
    return apiInstance.delete(OUTBOUND_CAMPAIGN_DIALABLE + `/${id}`);
};

export const deleteHangupOutbound = (id: string) => {
    return apiInstance.delete(OUTBOUND_CAMPAIGN_HANGUP_DELETE + `/${id}`);
};

export const deleteCampaignLeadGroup = (payload: any) => {
    return apiInstance.post(OUTBOUND_CAMPAIGN_LEAD_GROUP_DELETE, payload);
};


export const addPresetOutbound = (payload: any) => {
    return apiInstance.post(OUTBOUND_CAMPAIGN_PRESET_ADD, payload);
};


export const deletePresetOutbound = (id: string) => {
    return apiInstance.delete(OUTBOUND_CAMPAIGN_PRESET_DELETE + `/${id}`);
};

export const updatePresetOutbound = (id: string, payload: any) => {
    return apiInstance.put(OUTBOUND_CAMPAIGN_PRESET_UPDATE + `/${id}`, payload);
};

export const singlePreset = (uuid: string) => {
    return apiInstance.get(OUTBOUND_CAMPAIGN_PRESET_GET + `/${uuid}`);
};

export const getPresetOutbound = (
    feature: string,
    id: string,
    params: any
) => {
    return apiInstance.get(OUTBOUND_CAMPAIGN_PRESET + `/${feature}`, {
        params: {
            ...params,
            campaign_uuid: id
        },
    });
};

