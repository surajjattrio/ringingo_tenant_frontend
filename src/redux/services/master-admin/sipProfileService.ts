// PROJECT IMPORTS
import { SIP_PROFILE, SIP_PROFILE_SEARCH } from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== SIP - PROFILE SERVICES ============================== */

export const sipProfileAll = () => {
    return apiInstance.get(SIP_PROFILE);
};

export const sipProfile = (params: any) => {
    return apiInstance.get(SIP_PROFILE, { params });
};

export const searchSipProfile = (payload: any) => {
    return apiInstance.post(SIP_PROFILE_SEARCH, payload);
};

export const createSipProfile = (payload: any) => {
    return apiInstance.post(SIP_PROFILE, payload);
};

export const updateSipProfile = (id: string, payload: any) => {
    return apiInstance.put(SIP_PROFILE + `/${id}`, payload);
};

export const updateSipProfileStatus = (id: string, payload: any) => {
    return apiInstance.patch(SIP_PROFILE + `/${id}`, payload);
};

export const deleteSipProfile = (id: string) => {
    return apiInstance.delete(SIP_PROFILE + `/${id}`);
};
