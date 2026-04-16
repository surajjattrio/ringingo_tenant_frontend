//PROJECT IMPORT
import { DISPOSITION, DISPOSITION_SEARCH } from "@/API/constAPI";
import authHeader from "@/redux/authHeader";
import { apiInstance } from "@/redux/axiosApi";

/* ============================== DISPOSITION SERVICES ============================== */

export const disposition = (params: any) => {
    return apiInstance.get(DISPOSITION, { params, headers: authHeader() });
};

export const parentDisposition = (params: any) => {
    return apiInstance.get(DISPOSITION + "/parent", { params, headers: authHeader() });
};

export const allDisposition = (params?: any) => {
    return apiInstance.get(DISPOSITION, { params, headers: authHeader() });
};

export const singleDisposition = (id: string) => {
    return apiInstance.get(DISPOSITION + `/${id}`, { headers: authHeader() });
};

export const searchDisposition = (payload: any) => {
    return apiInstance.post(DISPOSITION_SEARCH, payload, {
        headers: authHeader(),
    });
};

export const createDisposition = (payload: any) => {
    return apiInstance.post(DISPOSITION, payload, { headers: authHeader() });
};

export const updateDisposition = (id: string, payload: any) => {
    return apiInstance.put(DISPOSITION + `/${id}`, payload, {
        headers: authHeader(),
    });
};

export const updateDispositionStatus = (id: string, payload: any) => {
    return apiInstance.patch(DISPOSITION + `/${id}`, payload, {
        headers: authHeader(),
    });
};

export const deleteDisposition = (id: string) => {
    return apiInstance.delete(DISPOSITION + `/${id}`, { headers: authHeader() });
};
