// PROJECT IMPORTS
import { DID, DID_FORWARD, DID_IMPORT, DID_SEARCH } from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== DID SERVICES ============================== */

export const did = (params: any) => {
    return apiInstance.get(DID, { params });
};

export const allDid = (params?: any) => {
    return apiInstance.get(DID, { params });
};

export const searchDid = (payload: any) => {
    return apiInstance.post(DID_SEARCH, payload);
};

export const createDid = (payload: any) => {
    return apiInstance.post(DID, payload);
};

export const updateDid = (id: string, payload: any) => {
    return apiInstance.put(DID + `/${id}`, payload);
};

export const updateDidStatus = (id: string, payload: any) => {
    return apiInstance.patch(DID + `/${id}`, payload);
};

export const deleteDid = (id: string) => {
    return apiInstance.delete(DID + `/${id}`);
};

export const forwardDid = (id: string, payload: any) => {
    return apiInstance.patch(DID_FORWARD + `/${id}`, payload);
};

export const importDid = (payload: any) => {
    return apiInstance.post(DID_IMPORT, payload);
};
