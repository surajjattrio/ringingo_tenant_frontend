// PROJECT IMPORTS
import {
    BLOCK_INBOUND_CAMPAIGN,
    BLOCK_INBOUND_CAMPAIGN_SEARCH,
        BLOCK_INBOUND_CAMPAIGN_IMPORT,
} from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== BLOCK INBOUND CAMPAIGN SERVICES ============================== */

export const blockInboundCampaign = (params: any) => {
    return apiInstance.get(BLOCK_INBOUND_CAMPAIGN, { params });
};

export const singleBlockInboundCampaign = (id: string) => {
    return apiInstance.get(BLOCK_INBOUND_CAMPAIGN + `/${id}`);
};

export const searchBlockInboundCampaign = (payload: any) => {
    return apiInstance.post(BLOCK_INBOUND_CAMPAIGN_SEARCH, payload);
};

export const createBlockInboundCampaign = (payload: any) => {
    return apiInstance.post(BLOCK_INBOUND_CAMPAIGN, payload);
};

export const updateBlockInboundCampaign = (id: string, payload: any) => {
    return apiInstance.put(BLOCK_INBOUND_CAMPAIGN + `/${id}`, payload);
};

export const updateBlockInboundCampaignStatus = (id: string, payload: any) => {
    return apiInstance.patch(BLOCK_INBOUND_CAMPAIGN + `/${id}`, payload);
};

export const deleteBlockInboundCampaign = (id: string) => {
    return apiInstance.delete(BLOCK_INBOUND_CAMPAIGN + `/${id}`);
};

export const importBlockInboundCampaign = (payload: any) => {
    return apiInstance.post(BLOCK_INBOUND_CAMPAIGN_IMPORT, payload);
};