// PROJECT IMPORTS
import { MESSAGING_CHANNEL,
         MESSAGING_CHANNEL_SEARCH,
         MESSAGING_CHANNEL_LIST_WHATSAPP,
        MESSAGING_CHANNEL_LIST_SMS } from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";


/* ============================== RING SERVICES ============================== */

export const msgChannels = (params: any) => {
    return apiInstance.get(MESSAGING_CHANNEL, { params });
};

export const allMsgChannel = () => {
    return apiInstance.get(MESSAGING_CHANNEL);
};

export const searchMsgChannel = (payload: any) => {
    return apiInstance.post(MESSAGING_CHANNEL_SEARCH, payload);
};

export const createMsgChannel = (payload: any) => {
    return apiInstance.post(MESSAGING_CHANNEL, payload);
};

export const updateMsgChannel = (id: string, payload: any) => {
    return apiInstance.put(MESSAGING_CHANNEL + `/${id}`, payload);
};

export const deleteMsgChannel = (id: string) => {
    return apiInstance.delete(MESSAGING_CHANNEL + `/${id}`);
};

export const whatsappMsgChannel = () => {
    return apiInstance.post(MESSAGING_CHANNEL_LIST_WHATSAPP);
};

export const smsMsgChannel = () => {
    return true;//apiInstance.post(MESSAGING_CHANNEL_LIST_SMS);
};

