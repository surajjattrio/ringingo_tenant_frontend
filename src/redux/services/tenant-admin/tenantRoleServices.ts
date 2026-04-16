// PROJECT IMPORTS
import { TENANT_ROLE, TENANT_ROLE_SEARCH } from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== TENANT SERVICES ============================== */

export const tenantRole = (params: any) => {
    return apiInstance.get(TENANT_ROLE, { params });
};

export const allTenantRole = () => {
    return apiInstance.get(TENANT_ROLE);
};

export const searchTenantRole = (payload: any) => {
    return apiInstance.post(TENANT_ROLE_SEARCH, payload);
};

export const createTenantRole = (payload: any) => {
    return apiInstance.post(TENANT_ROLE, payload);
};

export const updateTenantRole = (id: string, payload: any) => {
    return apiInstance.put(TENANT_ROLE + `/${id}`, payload);
};

export const updateTenantRoleStatus = (id: string, payload: any) => {
    return apiInstance.patch(TENANT_ROLE + `/${id}`, payload);
};

export const deleteTenantRole = (id: string) => {
    return apiInstance.delete(TENANT_ROLE + `/${id}`);
};
