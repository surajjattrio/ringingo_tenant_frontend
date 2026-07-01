// PROJECT IMPORTS
import { 
    SMTP_CONFIGURATION,
    EMAIL_TEMPLATE,
    EMAIL_TEMPLATE_SEARCH,
    EMAIL_CHANNEL,
    EMAIL_CHANNEL_SEARCH,
    SMTP_TEST_CONFIGURATION
} from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== EMAIL CONFIG SERVICES ============================== */

export const emailConfigs = (params: any) => {
    return apiInstance.get(SMTP_CONFIGURATION, { params });
};

export const createEmailConfig = (payload: any) => {
    return apiInstance.post(SMTP_CONFIGURATION, payload);
};

export const updateEmailConfig = (id: string, payload: any) => {
    return apiInstance.put(SMTP_CONFIGURATION + `/${id}`, payload);
};

export const testEmailConfig = (payload: any) => {
    return apiInstance.post(SMTP_TEST_CONFIGURATION, payload);
};

/* ============================== EMAIL TEMPLATE SERVICES ============================== */

export const emailTemplates = (params: any) => {
    return apiInstance.get(EMAIL_TEMPLATE, { params });
};

export const searchEmailTemplate = (payload: any) => {
    return apiInstance.post(EMAIL_TEMPLATE_SEARCH, payload);
};

export const createEmailTemplate = (payload: any) => {
    return apiInstance.post(EMAIL_TEMPLATE, payload);
};

export const updateEmailTemplate = (id: string, payload: any) => {
    return apiInstance.put(EMAIL_TEMPLATE + `/${id}`, payload);
};

export const deleteEmailTemplate = (id: string) => {
    return apiInstance.delete(EMAIL_TEMPLATE + `/${id}`);
};

/* ============================== EMAIL CHANNEL SERVICES ============================== */

export const emailChannels = (params: any) => {
    return apiInstance.get(EMAIL_CHANNEL, { params });
};

export const searchEmailChannel = (payload: any) => {
    return apiInstance.post(EMAIL_CHANNEL_SEARCH, payload);
};

export const createEmailChannel = (payload: any) => {
    return apiInstance.post(EMAIL_CHANNEL, payload);
};

export const updateEmailChannel = (id: string, payload: any) => {
    return apiInstance.put(EMAIL_CHANNEL + `/${id}`, payload);
};

export const deleteEmailChannel = (id: string) => {
    return apiInstance.delete(EMAIL_CHANNEL + `/${id}`);
};
