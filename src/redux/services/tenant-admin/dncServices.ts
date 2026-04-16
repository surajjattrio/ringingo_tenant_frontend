// PROJECT IMPORTS
import { DNC, DNC_SEARCH, DNC_IMPORT } from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== DNC SERVICES ============================== */

export const dnc = (params: any) => {
    return apiInstance.get(DNC, { params });
};

export const singleDnc = (id: string) => {
    return apiInstance.get(DNC + `/${id}`);
};


export const allDnc = () => {
    return apiInstance.get(DNC);
};

export const searchDnc = (payload: any) => {
    return apiInstance.post(DNC_SEARCH, payload);
};

export const createDnc = (payload: any) => {
    return apiInstance.post(DNC, payload);
};

export const updateDnc = (id: string, payload: any) => {
    return apiInstance.put(DNC + `/${id}`, payload);
};

export const updateDncStatus = (id: string, payload: any) => {
    return apiInstance.patch(DNC + `/${id}`, payload);
};

export const deleteDnc = (id: string) => {
    return apiInstance.delete(DNC + `/${id}`);
};

export const importDnc = (payload: any) => {
    return apiInstance.post(DNC_IMPORT, payload);
};