// PROJECT IMPORTS
import { CALL_QUEUE, CALL_QUEUE_SEARCH } from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== CALL QUEUE SERVICES ============================== */

export const callQueue = (params: any) => {
    return apiInstance.get(CALL_QUEUE, { params });
};

export const allCallQueue = () => {
    return apiInstance.get(CALL_QUEUE);
};

export const searchCallQueue = (payload: any) => {
    return apiInstance.post(CALL_QUEUE_SEARCH, payload);
};

export const singleCallQueue = (id: string) => {
    return apiInstance.get(CALL_QUEUE + `/${id}`);
};

export const createCallQueue = (payload: any) => {
    return apiInstance.post(CALL_QUEUE, payload);
};

export const updateCallQueue = (id: string, payload: any) => {
    return apiInstance.put(CALL_QUEUE + `/${id}`, payload);
};

export const updateCallQueueStatus = (id: string, payload: any) => {
    return apiInstance.patch(CALL_QUEUE + `/${id}`, payload);
};

export const deleteCallQueue = (id: string) => {
    return apiInstance.delete(CALL_QUEUE + `/${id}`);
};
