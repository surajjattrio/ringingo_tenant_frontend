// PROJECT IMPORTS
import { ROLE, ROLE_SEARCH } from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== ROLE SERVICES ============================== */

export const roles = () => {
  return apiInstance.get(ROLE);
};

export const getRoles = (params: any) => {
  return apiInstance.get(ROLE, { params });
};

export const searchRole = (payload: any) => {
  return apiInstance.post(ROLE_SEARCH, payload);
};

export const createRole = (payload: any) => {
  return apiInstance.post(ROLE, payload);
};

export const updateRole = (id: string, payload: any) => {
  return apiInstance.put(ROLE + `/${id}`, payload);
};

export const updateRoleStatus = (id: string, payload: any) => {
  return apiInstance.patch(ROLE + `/${id}`, payload);
};

export const deleteRole = (id: string) => {
  return apiInstance.delete(ROLE + `/${id}`);
};
