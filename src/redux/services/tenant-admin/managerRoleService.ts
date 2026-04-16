// PROJECT IMPORTS
import { MANAGER_ROLE , MANAGER_ROLE_SEARCH } from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== ROLE SERVICES ============================== */

export const roles = () => {
    return apiInstance.get(MANAGER_ROLE);
};

export const getRoles = (params: any) => {
    return apiInstance.get(MANAGER_ROLE, { params });
};

export const searchRole = (payload: any) => {
    return apiInstance.post(MANAGER_ROLE_SEARCH, payload);
};

export const createRole = (payload: any) => {
    return apiInstance.post(MANAGER_ROLE, payload);
};

export const updateRole = (id: string, payload: any) => {
    return apiInstance.put(MANAGER_ROLE + `/${id}`, payload);
};

export const updateRoleStatus = (id: string, payload: any) => {
    return apiInstance.patch(MANAGER_ROLE + `/${id}`, payload);
};

export const deleteRole = (id: string) => {
    return apiInstance.delete(MANAGER_ROLE + `/${id}`);
};

