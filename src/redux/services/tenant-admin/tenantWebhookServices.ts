// PROJECT IMPORTS
import { apiInstance } from "../../axiosApi";

import { CDR_WEBHOOK, CDR_WEBHOOK_LOGS } from "@/API/constAPI";

/* ============================== TENANT_WEBHOOK SERVICES ============================== */

export const tenantWebhookList = (params: any) => {
    return apiInstance.get(CDR_WEBHOOK, { params });
};

export const tenantWebhookSingle = (id: string) => {
    return apiInstance.get(CDR_WEBHOOK + `/${id}`);
};

export const createTenantWebhook = (payload: any) => {
    return apiInstance.post(CDR_WEBHOOK, payload);
};

export const updateTenantWebhook = (id: string, payload: any) => {
    return apiInstance.put(CDR_WEBHOOK + `/${id}`, payload);
};

export const deleteTenantWebhook = (id: string) => {
    return apiInstance.delete(CDR_WEBHOOK + `/${id}`);
};

export const testTenantWebhook = (id: string, payload: any) => {
    return apiInstance.post(CDR_WEBHOOK + `/${id}/test`, payload);
};

export const tenantWebhookLogs = (params: any) => {
    return apiInstance.get(CDR_WEBHOOK_LOGS, { params });
};
