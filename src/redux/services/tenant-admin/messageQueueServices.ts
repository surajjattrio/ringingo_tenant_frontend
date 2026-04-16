// PROJECT IMPORTS
import { MESSAGING_QUEUE, MESSAGING_QUEUE_SEARCH } from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";


/* ============================== RING SERVICES ============================== */

export const msgQueues = (params: any) => {
    return apiInstance.get(MESSAGING_QUEUE, { params });
};

export const allMsgQueue = () => {
    return apiInstance.get(MESSAGING_QUEUE);
};

export const searchMsgQueue = (payload: any) => {
    return apiInstance.post(MESSAGING_QUEUE_SEARCH, payload);
};

export const createMsgQueue = (payload: any) => {
    return apiInstance.post(MESSAGING_QUEUE, payload);
};

export const updateMsgQueue = (id: string, payload: any) => {
    return apiInstance.put(MESSAGING_QUEUE + `/${id}`, payload);
};

export const deleteMsgQueue = (id: string) => {
    return apiInstance.delete(MESSAGING_QUEUE + `/${id}`);
};

export const updateMsgQueueStatus = (id: string, payload: any) => {
    return apiInstance.patch(MESSAGING_QUEUE + `/${id}`, payload);
};
