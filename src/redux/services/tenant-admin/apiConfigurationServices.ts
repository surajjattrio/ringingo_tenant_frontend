import { apiInstance } from "../../axiosApi";
import { API_CONFIGURATION } from "@/API/constAPI";

export const getApiConfigurations = (params: any) => {
    return apiInstance.get(API_CONFIGURATION, { params });
};

export const createApiConfiguration = (payload: any) => {
    return apiInstance.post(API_CONFIGURATION, payload);
};

export const updateApiConfiguration = (id: string, payload: any) => {
    return apiInstance.patch(`${API_CONFIGURATION}/${id}`, payload);
};

export const deleteApiConfiguration = (id: string) => {
    return apiInstance.delete(`${API_CONFIGURATION}/${id}`);
};

export const getSingleApiConfiguration = (id: string) => {
    return apiInstance.get(`${API_CONFIGURATION}/${id}`);
};
