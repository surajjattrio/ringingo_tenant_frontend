//PROJECT IMPORT
import { WEB_FORM,WEB_FORM_SEARCH  } from "@/API/constAPI";
import authHeader from "@/redux/authHeader";
import { apiInstance } from "@/redux/axiosApi";

/* ============================== WEB FORM SERVICES ============================== */

export const webForm = (params: any) => {
    return apiInstance.get(WEB_FORM, { params, headers: authHeader() });
};

export const allWebForm = () => {
    return apiInstance.get(WEB_FORM, { headers: authHeader() });
};

export const singleWebForm = (id: string) => {
    return apiInstance.get(WEB_FORM + `/${id}`, { headers: authHeader() });
};

export const searchWebForm = (payload: any) => {
    return apiInstance.post(WEB_FORM_SEARCH, payload, { headers: authHeader() });
}

export const createWebForm = (payload: any) => {
    return apiInstance.post(WEB_FORM, payload, { headers: authHeader() });
};

export const updateWebForm = (id: string, payload: any) => {
    return apiInstance.put(WEB_FORM + `/${id}`, payload, { headers: authHeader() });
};

// export const updateTenantDispositionStatus = (id: string, payload: any) => {
//     return apiInstance.patch(PBX_LEAD_STATUS + `/${id}`, payload, { headers: authHeader() });
// };

export const deleteWebForm = (id: string) => {
    return apiInstance.delete(WEB_FORM + `/${id}`, { headers: authHeader() });
};

