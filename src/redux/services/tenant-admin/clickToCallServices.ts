// PROJECT IMPORTS
import { CLICK_TO_CALL, CLICK_TO_CALL_FORWARD, CLICK_TO_CALL_SEARCH } from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== CLICK TO CALL SERVICES ============================== */

export const clickToCall = (params: any) => {
    return apiInstance.get(CLICK_TO_CALL, { params });
};

export const searchClickToCall = (payload: any) => {
    return apiInstance.post(CLICK_TO_CALL_SEARCH, payload);
};

export const createClickToCall = (payload: any) => {
    return apiInstance.post(CLICK_TO_CALL, payload);
};

export const updateClickToCall = (id: string, payload: any) => {
    return apiInstance.put(CLICK_TO_CALL + `/${id}`, payload);
};

export const updateClickToCallStatus = (id: string, payload: any) => {
    return apiInstance.patch(CLICK_TO_CALL + `/${id}`, payload);
};

export const deleteClickToCall = (id: string) => {
    return apiInstance.delete(CLICK_TO_CALL + `/${id}`);
};

export const forwardClickToCall = (id: string, payload: any) => {
    return apiInstance.patch(CLICK_TO_CALL_FORWARD + `/${id}`, payload);
};