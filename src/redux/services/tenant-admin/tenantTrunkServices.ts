// PROJECT IMPORTS
import { apiInstance } from "../../axiosApi";

import { TENANT_TRUNK, TENANT_TRUNK_SIP_PROFILES, TRUNK, TRUNK_SEARCH } from "@/API/constAPI";

/* ============================== TENANT_TRUNK SERVICES ============================== */

export const tenantTrunk = (params: any) => {
    return apiInstance.get(TRUNK, { params });
};

export const allTenantTrunk = () => {
    return apiInstance.get(TRUNK);
};

export const singleTenantTrunk = (id: string) => {
    return apiInstance.get(TRUNK + `/${id}`);
};

export const searchTenantTrunk = (payload: any) => {
    return apiInstance.post(TRUNK_SEARCH, payload);
};

export const createTenantTrunk = (payload: any) => {
    return apiInstance.post(TENANT_TRUNK, payload);
};

export const updateTenantTrunk = (id: string, payload: any) => {
    return apiInstance.put(TENANT_TRUNK + `/${id}`, payload);
};

export const updateTenantTrunkStatus = (id: string, payload: any) => {
    return apiInstance.patch(TRUNK + `/${id}`, payload);
};

export const deleteTenantTrunk = (id: string) => {
    return apiInstance.delete(TRUNK + `/${id}`);
};

// SIP profiles assigned to logged in tenant, first one is default
export const tenantTrunkSipProfiles = () => {
    return apiInstance.get(TENANT_TRUNK_SIP_PROFILES);
};
