// PROJECT IMPORTS
import { IP_MAPPING, IP_MAPPING_SEARCH } from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== IP MAPPING SERVICES ============================== */

export const ipMapping = (params: any) => {
    return apiInstance.get(IP_MAPPING, { params });
};

export const allIpMapping = (params?: any) => {
    return apiInstance.get(IP_MAPPING, { params });
};

export const searchIpMapping = (payload: any) => {
    return apiInstance.post(IP_MAPPING_SEARCH, payload);
};

export const createIpMapping = (payload: any) => {
    return apiInstance.post(IP_MAPPING, payload, {});
};

export const updateIpMapping = (id: string, payload: any) => {
    return apiInstance.put(IP_MAPPING + `/${id}`, payload);
};

export const updateIpMappingStatus = (id: string, payload: any) => {
    return apiInstance.patch(IP_MAPPING + `/${id}`, payload);
};

export const deleteIpMapping = (id: string) => {
    return apiInstance.delete(IP_MAPPING + `/${id}`);
};
