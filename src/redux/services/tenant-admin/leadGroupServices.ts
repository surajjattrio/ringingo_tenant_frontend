// PROJECT IMPORTS
import {
    LEAD_GROUP,
    LEAD_GROUP_REMOVE_QUEUE,
    LEAD_GROUP_SEARCH,
    LEAD_GROUP_EXPORT_USER_INFO,
    DELETE_ALL_LEADS,
    LEAD_GROUP_CAMPAIGN_LIST,
} from "@/API/constAPI";
import authHeader from "@/redux/authHeader";
import { apiInstance } from "@/redux/axiosApi";

/* ============================== LEAD - GROUP SERVICES ============================== */

export const leadGroup = (params: any) => {
    return apiInstance.get(LEAD_GROUP, { params, headers: authHeader() });
};

export const leadGroupCampaign =  () => {
    return apiInstance.get(LEAD_GROUP_CAMPAIGN_LIST, { headers: authHeader() });
};

export const allLeadGroup = (params?: any) => {
    return apiInstance.get(LEAD_GROUP, { params, headers: authHeader() });
};

export const singleLeadGroup = (id: string) => {
    return apiInstance.get(LEAD_GROUP + `/${id}`, { headers: authHeader() });
};

export const searchLeadGroup = (payload: any) => {
    return apiInstance.post(LEAD_GROUP_SEARCH, payload, {
        headers: authHeader(),
    });
};

export const createLeadGroup = (payload: any) => {
    return apiInstance.post(LEAD_GROUP, payload, { headers: authHeader() });
};

export const updateLeadGroup = (id: string, payload: any) => {
    return apiInstance.put(LEAD_GROUP + `/${id}`, payload, {
        headers: authHeader(),
    });
};

export const updateLeadGroupStatus = (id: string, payload: any) => {
    return apiInstance.patch(LEAD_GROUP + `/${id}`, payload, {
        headers: authHeader(),
    });
};

export const removeLeadGroupStatus = (payload: any) => {
    return apiInstance.post(LEAD_GROUP_REMOVE_QUEUE, payload, {
        headers: authHeader(),
    });
};

export const deleteLeadGroup = (id: string) => {
    return apiInstance.delete(LEAD_GROUP + `/${id}`, { headers: authHeader() });
};

export const deleteAllLeads = (id: string) => {
    return apiInstance.delete(DELETE_ALL_LEADS + `/${id}`, { headers: authHeader() });
};

export const exportLeadGroup = ( id: string  , name : string) => {
    return apiInstance.get( LEAD_GROUP_EXPORT_USER_INFO + `/${id}?name=${name}`, { headers: authHeader() } );
};
