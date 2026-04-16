// PROJECT IMPORTS
import { TELECOM_CIRCLE, TELECOM_CIRCLE_IMPORT, TELECOM_CIRCLE_SEARCH } from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== DID SERVICES ============================== */

export const telecomCircle = (params: any) => {
    return apiInstance.get(TELECOM_CIRCLE, { params });
};

export const allTelecomCircle = (params?: any) => {
    return apiInstance.get(TELECOM_CIRCLE, { params });
};

export const searchTelecomCircle = (payload: any) => {
    return apiInstance.post(TELECOM_CIRCLE_SEARCH, payload);
};

export const createTelecomCircle = (payload: any) => {
    return apiInstance.post(TELECOM_CIRCLE, payload);
};

export const updateTelecomCircle = (id: string, payload: any) => {
    return apiInstance.put(TELECOM_CIRCLE + `/${id}`, payload);
};

export const updateTelecomCircleStatus = (id: string, payload: any) => {
    return apiInstance.patch(TELECOM_CIRCLE + `/${id}`, payload);
};

export const deleteTelecomCircle = (id: string) => {
    return apiInstance.delete(TELECOM_CIRCLE + `/${id}`);
};

export const importTelecomCircle = (payload: any) => {
    return apiInstance.post(TELECOM_CIRCLE_IMPORT, payload);
};
