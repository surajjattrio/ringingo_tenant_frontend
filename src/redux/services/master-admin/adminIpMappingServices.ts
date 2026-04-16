// PROJECT IMPORTS
import { ADMIN_IP_MAPPING, ADMIN_IP_MAPPING_SEARCH } from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== IP MAPPING SERVICES ============================== */

export const adminIpMapping = (params: any) => {
    return apiInstance.get(ADMIN_IP_MAPPING, { params });
};

export const searchAdminIpMapping = (payload: any) => {
    return apiInstance.post(ADMIN_IP_MAPPING_SEARCH, payload);
};

export const createAdminIpMapping = (payload: any) => {
    return apiInstance.post(ADMIN_IP_MAPPING, payload, {});
};

export const updateAdminIpMapping = (id: string, payload: any) => {
    return apiInstance.put(ADMIN_IP_MAPPING + `/${id}`, payload);
};

export const updateAdminIpMappingStatus = (id: string, payload: any) => {
    return apiInstance.patch(ADMIN_IP_MAPPING + `/${id}`, payload);
};

export const deleteAdminIpMapping = (id: string) => {
    return apiInstance.delete(ADMIN_IP_MAPPING + `/${id}`);
};
