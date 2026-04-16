// PROJECT IMPORTS
import { MANAGER, MANAGER_SEARCH } from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== MANAGER SERVICES ============================== */

export const manager = (params: any) => {
    return apiInstance.get(MANAGER, { params });
};

export const singleManager = (id: string) => {
    return apiInstance.get(MANAGER + `/${id}`);
};


export const allManager = () => {
    return apiInstance.get(MANAGER);
};


export const searchManager = (payload: any) => {
    return apiInstance.post(MANAGER_SEARCH, payload);
};

export const createManager = (payload: any) => {
    return apiInstance.post(MANAGER, payload);
};

export const updateManager = (id: string, payload: any) => {
    return apiInstance.put(MANAGER + `/${id}`, payload);
};

export const updateManagerStatus = (id: string, payload: any) => {
    return apiInstance.patch(MANAGER + `/${id}`, payload);
};

export const deleteManager = (id: string) => {
    return apiInstance.delete(MANAGER + `/${id}`);
};
