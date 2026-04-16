// PROJECT IMPORTS
import { STATE, STATE_SEARCH, STATE_IMPORT, UPDATE_BY_STATUS } from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== State SERVICES ============================== */

export const state = (params: any) => {
    return apiInstance.get(STATE, { params });
};

export const singleState = (id: string) => {
    return apiInstance.get(STATE + `/${id}`);
};


export const allState = () => {
    return apiInstance.get(STATE);
};

export const searchState = (payload: any) => {
    return apiInstance.post(STATE_SEARCH, payload);
};

export const createState = (payload: any) => {
    return apiInstance.post(STATE, payload);
};

export const updateState = (id: string, payload: any) => {
    return apiInstance.put(STATE + `/${id}`, payload);
};

export const updateStateStatus = (id: string, payload: any) => {
    return apiInstance.patch(STATE + `/${id}`, payload);
};

export const deleteState = (id: string) => {
    return apiInstance.delete(STATE + `/${id}`);
};
export const statusState = (id: string, payload: any) => {
    return apiInstance.patch(UPDATE_BY_STATUS + `/${id}`, payload);
};

export const importState = (payload: any) => {
    return apiInstance.post(STATE_IMPORT, payload);
};