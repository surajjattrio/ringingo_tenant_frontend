// PROJECT IMPORTS
import { USER_ROLE, USER_ROLE_SEARCH } from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== USER ROLE SERVICES ============================== */

export const userRole = (params: any) => {
    return apiInstance.get(USER_ROLE, { params });
};

export const allUserRole = () => {
    return apiInstance.get(USER_ROLE);
};

export const searchUserRole = (payload: any) => {
    return apiInstance.post(USER_ROLE_SEARCH, payload);
};

export const createUserRole = (payload: any) => {
    return apiInstance.post(USER_ROLE, payload);
};

export const updateUserRole = (id: string, payload: any) => {
    return apiInstance.put(USER_ROLE + `/${id}`, payload);
};

export const updateUserRoleStatus = (id: string, payload: any) => {
    return apiInstance.patch(USER_ROLE + `/${id}`, payload);
};

export const deleteUserRole = (id: string) => {
    return apiInstance.delete(USER_ROLE + `/${id}`);
};
