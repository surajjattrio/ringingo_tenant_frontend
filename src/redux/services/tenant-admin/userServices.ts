// PROJECT IMPORTS
import { EXTERNAL_USER, USER, USER_RESET, USER_SEARCH } from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== USER SERVICES ============================== */

export const user = (params: any) => {
    return apiInstance.get(USER, { params });
};

export const singleUser = (id: string) => {
    return apiInstance.get(USER + `/${id}`);
};

export const allUser = (params?: any) => {
    return apiInstance.get(USER, { params });
};

export const allExternalUser = () => {
    return apiInstance.get(EXTERNAL_USER);
};

export const searchUser = (payload: any) => {
    return apiInstance.post(USER_SEARCH, payload);
};

export const createUser = (payload: any) => {
    return apiInstance.post(USER, payload);
};

export const updateUser = (id: string, payload: any) => {
    return apiInstance.put(USER + `/${id}`, payload);
};

export const updateUserStatus = (id: string, payload: any) => {
    return apiInstance.patch(USER + `/${id}`, payload);
};

export const resetUser = (id: string, payload: any) => {
    return apiInstance.patch(USER_RESET + `/${id}`, payload);
};

export const deleteUser = (id: string) => {
    return apiInstance.delete(USER + `/${id}`);
};
