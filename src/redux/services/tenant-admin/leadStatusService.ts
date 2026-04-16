//PROJECT IMPORT
import { PBX_LEAD_STATUS,PBX_LEAD_STATUS_SEARCH  } from "@/API/constAPI";
import authHeader from "@/redux/authHeader";
import { apiInstance } from "@/redux/axiosApi";

/* ============================== LEAD STATUS SERVICES ============================== */

export const tenantDisposition = (params: any) => {
    return apiInstance.get(PBX_LEAD_STATUS, { params, headers: authHeader() });
};

export const allTenantDisposition = () => {
    return apiInstance.get(PBX_LEAD_STATUS, { headers: authHeader() });
};

export const singleTenantDisposition = (id: string) => {
    return apiInstance.get(PBX_LEAD_STATUS + `/${id}`, { headers: authHeader() });
};

export const searchTenantDisposition = (payload: any) => {
    return apiInstance.post(PBX_LEAD_STATUS_SEARCH, payload, { headers: authHeader() });
}

export const createTenantDisposition = (payload: any) => {
    return apiInstance.post(PBX_LEAD_STATUS, payload, { headers: authHeader() });
};

export const updateTenantDisposition = (id: string, payload: any) => {
    return apiInstance.put(PBX_LEAD_STATUS + `/${id}`, payload, { headers: authHeader() });
};

export const updateTenantDispositionStatus = (id: string, payload: any) => {
    return apiInstance.patch(PBX_LEAD_STATUS + `/${id}`, payload, { headers: authHeader() });
};

export const deleteTenantDisposition = (id: string) => {
    return apiInstance.delete(PBX_LEAD_STATUS + `/${id}`, { headers: authHeader() });
};

