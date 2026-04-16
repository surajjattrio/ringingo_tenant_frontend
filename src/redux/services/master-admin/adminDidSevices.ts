// PROJECT IMPORTS
import { ADMIN_DID, ADMIN_DID_IMPORT, ADMIN_DID_SEARCH } from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== DID SERVICES ============================== */

export const adminDid = (params: any) => {
    return apiInstance.get(ADMIN_DID, { params });
};

export const allAdminDid = (params?: any) => {
    return apiInstance.get(ADMIN_DID, { params });
};

export const searchAdminDid = (payload: any) => {
    return apiInstance.post(ADMIN_DID_SEARCH, payload);
};

export const createAdminDid = (payload: any) => {
    return apiInstance.post(ADMIN_DID, payload);
};

export const updateAdminDid = (id: string, payload: any) => {
    return apiInstance.put(ADMIN_DID + `/${id}`, payload);
};

export const updateAdminDidStatus = (id: string, payload: any) => {
    return apiInstance.patch(ADMIN_DID + `/${id}`, payload);
};

export const deleteAdminDid = (id: string) => {
    return apiInstance.delete(ADMIN_DID + `/${id}`);
};

export const importAdminDid = (payload: any) => {
    return apiInstance.post(ADMIN_DID_IMPORT, payload);
};
