// PROJECT IMPORTS
import { ASSIGN_DID, TENANT, TENANT_SEARCH, TENANT_PERSONALIZE } from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== TENANT SERVICES ============================== */

export const tenant = (params: any) => {
  return apiInstance.get(TENANT, { params });
};

export const allTenant = () => {
  return apiInstance.get(TENANT);
};

export const createTenantPersonalize = (payload: any) => {
  return apiInstance.post(TENANT_PERSONALIZE, payload);
};


export const getTenantPersonalize = (domain: string) => {
  return apiInstance.get(TENANT_PERSONALIZE + `/${domain}`);
}

export const singleTenant = (id: string) => {
  return apiInstance.get(TENANT + `/${id}`);
};

export const searchTenant = (payload: any) => {
  return apiInstance.post(TENANT_SEARCH, payload);
};

export const createTenant = (payload: any) => {
  return apiInstance.post(TENANT, payload);
};

export const updateTenant = (id: string, payload: any) => {
  return apiInstance.put(TENANT + `/${id}`, payload);
};

export const updateTenantStatus = (id: string, payload: any) => {
  return apiInstance.patch(TENANT + `/${id}`, payload);
};

export const deleteTenant = (id: string) => {
  return apiInstance.delete(TENANT + `/${id}`);
};

export const assignDid = (id: string, payload: any) => {
  return apiInstance.patch(ASSIGN_DID + `/${id}`, payload);
};
