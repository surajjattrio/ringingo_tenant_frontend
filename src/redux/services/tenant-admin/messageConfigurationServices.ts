import { apiInstance } from "../../axiosApi";
import { MESSAGE_CONFIGURATION } from "@/API/constAPI";

export const getMessageConfigurations = (params: any) => {
    return apiInstance.get(MESSAGE_CONFIGURATION, { params });
};

export const createMessageConfiguration = (payload: any) => {
    return apiInstance.post(MESSAGE_CONFIGURATION, payload);
};

export const updateMessageConfiguration = (id: string, payload: any) => {
    return apiInstance.patch(`${MESSAGE_CONFIGURATION}/${id}`, payload);
};

export const deleteMessageConfiguration = (id: string) => {
    return apiInstance.delete(`${MESSAGE_CONFIGURATION}/${id}`);
};

export const getSingleMessageConfiguration = (id: string) => {
    return apiInstance.get(`${MESSAGE_CONFIGURATION}/${id}`);
};