// PROJECT IMPORTS
import { SIP_DEVICES, SIP_DEVICES_SEARCH } from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== SIP DEVICES SERVICES ============================== */

export const sipDevices = (params: any) => {
    return apiInstance.get(SIP_DEVICES, { params });
};

export const singleSipDevices = (id: string) => {
    return apiInstance.get(SIP_DEVICES + `/${id}`);
};

export const searchSipDevices = (payload: any) => {
    return apiInstance.post(SIP_DEVICES_SEARCH, payload);
};

export const createSipDevices = (payload: any) => {
    return apiInstance.post(SIP_DEVICES, payload);
};

export const updateSipDevices = (id: string, payload: any) => {
    return apiInstance.put(SIP_DEVICES + `/${id}`, payload);
};

export const updateSipDevicesStatus = (id: string, payload: any) => {
    return apiInstance.patch(SIP_DEVICES + `/${id}`, payload);
};

export const deleteSipDevices = (id: string) => {
    return apiInstance.delete(SIP_DEVICES + `/${id}`);
};

export const updateOtherFeatures = (
    id: string,
    feature: string,
    payload: any
) => {
    return apiInstance.put(SIP_DEVICES + `/${feature}` + `/${id}`, payload);
};

export const getAllSipDevices = (params?:any) => {
    return apiInstance.get(SIP_DEVICES,{params});
};
