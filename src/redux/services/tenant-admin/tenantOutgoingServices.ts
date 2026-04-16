// PROJECT IMPORTS
import { apiInstance } from "../../axiosApi";

import {
    TENANT_OUTGOING_RULES,
    TENANT_OUTGOING_RULES_SEARCH,
} from "@/API/constAPI";

/* ============================== TENANT - OUTGOING - RULES SERVICES ============================== */

export const tenantOutgoing = (params: any) => {
    return apiInstance.get(TENANT_OUTGOING_RULES, { params });
};

export const allTenantOutgoing = () => {
    return apiInstance.get(TENANT_OUTGOING_RULES);
};

export const searchTenantOutgoing = (payload: any) => {
    return apiInstance.post(TENANT_OUTGOING_RULES_SEARCH, payload);
};

export const createTenantOutgoing = (payload: any) => {
    return apiInstance.post(TENANT_OUTGOING_RULES, payload);
};

export const updateTenantOutgoing = (id: string, payload: any) => {
    return apiInstance.put(TENANT_OUTGOING_RULES + `/${id}`, payload);
};

export const updateTenantOutgoingStatus = (id: string, payload: any) => {
    return apiInstance.patch(TENANT_OUTGOING_RULES + `/${id}`, payload);
};

export const deleteTenantOutgoing = (id: string) => {
    return apiInstance.delete(TENANT_OUTGOING_RULES + `/${id}`);
};
