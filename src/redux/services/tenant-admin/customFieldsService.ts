//PROJECT IMPORT
import { CUSTOM_FIELDS,CUSTOM_FIELDS_SEARCH  } from "@/API/constAPI";
import authHeader from "@/redux/authHeader";
import { apiInstance } from "@/redux/axiosApi";

/* ============================== WEB FORM SERVICES ============================== */

export const customFields = (params: any) => {
    return apiInstance.get(CUSTOM_FIELDS, { params, headers: authHeader() });
};

export const allCustomFields = () => {
    return apiInstance.get(CUSTOM_FIELDS, { headers: authHeader() });
};

export const singleCustomFields = (id: string) => {
    return apiInstance.get(CUSTOM_FIELDS + `/${id}`, { headers: authHeader() });
};

export const searchCustomFields = (payload: any) => {
    return apiInstance.post(CUSTOM_FIELDS_SEARCH, payload, { headers: authHeader() });
}

export const createCustomFields = (payload: any) => {
    return apiInstance.post(CUSTOM_FIELDS, payload, { headers: authHeader() });
};

export const updateCustomFields = (id: string, payload: any) => {
    return apiInstance.put(CUSTOM_FIELDS + `/${id}`, payload, { headers: authHeader() });
};

// export const updateTenantDispositionStatus = (id: string, payload: any) => {
//     return apiInstance.patch(PBX_LEAD_STATUS + `/${id}`, payload, { headers: authHeader() });
// };

export const deleteCustomFields = (id: string) => {
    return apiInstance.delete(CUSTOM_FIELDS + `/${id}`, { headers: authHeader() });
};

