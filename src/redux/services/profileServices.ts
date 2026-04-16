// PROJECT IMPORT
import { SMTP_CONFIGURATION, WEBHOOK } from "@/API/constAPI";
import { apiInstance } from "../axiosApi";

export const smtpConfiguration = () => {
    return apiInstance.get(SMTP_CONFIGURATION);
};

export const createSmtpConfiguration = (payload: any) => {
    return apiInstance.post(SMTP_CONFIGURATION, payload);
};

export const updateSmtpConfiguration = (payload: any) => {
    return apiInstance.put(SMTP_CONFIGURATION, payload);
};

export const getWebHook = (id: string) => {
    return apiInstance.get(WEBHOOK + `/${id}`);
};

export const createWebHook = (payload: any) => {
    return apiInstance.post(WEBHOOK, payload);
};
