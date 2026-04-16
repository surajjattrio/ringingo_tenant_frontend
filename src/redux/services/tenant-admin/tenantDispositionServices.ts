//PROJECT IMPORT
import { TENANT_DISPOSITION,TENANT_DISPOSITION_SEARCH } from "@/API/constAPI";
import authHeader from "@/redux/authHeader";
import { apiInstance } from "@/redux/axiosApi";

/* ============================== DISPOSITION SERVICES ============================== */

export const tenantDisposition = (params: any) => {
    return apiInstance.get(TENANT_DISPOSITION, { params, headers: authHeader() });
};

export const allTenantDisposition = () => {
    return apiInstance.get(TENANT_DISPOSITION, { headers: authHeader() });
};

export const singleTenantDisposition = (id: string) => {
    return apiInstance.get(TENANT_DISPOSITION + `/${id}`, { headers: authHeader() });
  };

export const searchTenantDisposition = (payload: any) => {
    return apiInstance.post(TENANT_DISPOSITION_SEARCH, payload, { headers: authHeader() });
}

export const createTenantDisposition = (payload: any) => {
    return apiInstance.post(TENANT_DISPOSITION, payload, { headers: authHeader() });
};

export const updateTenantDisposition = (id: string, payload: any) => {
    return apiInstance.put(TENANT_DISPOSITION + `/${id}`, payload, { headers: authHeader() });
};

export const updateTenantDispositionStatus = (id: string, payload: any) => {
    return apiInstance.patch(TENANT_DISPOSITION + `/${id}`, payload, { headers: authHeader() });
};

export const deleteTenantDisposition = (id: string) => {
    return apiInstance.delete(TENANT_DISPOSITION + `/${id}`, { headers: authHeader() });
};
