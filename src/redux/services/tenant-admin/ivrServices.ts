// PROJECT IMPORTS
import { IVR, IVR_SEARCH } from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== IVR SERVICES ============================== */

export const ivr = (params: any) => {
    return apiInstance.get(IVR, { params });
};

export const allIvr = () => {
    return apiInstance.get(IVR);
};

export const searchIvr = (payload: any) => {
    return apiInstance.post(IVR_SEARCH, payload);
};

export const createIvr = (payload: any) => {
    return apiInstance.post(IVR, payload);
};

export const updateIvr = (id: string, payload: any) => {
    return apiInstance.put(IVR + `/${id}`, payload);
};

export const updateIvrStatus = (id: string, payload: any) => {
    return apiInstance.patch(IVR + `/${id}`, payload);
};

export const deleteIvr = (id: string) => {
    return apiInstance.delete(IVR + `/${id}`);
};
