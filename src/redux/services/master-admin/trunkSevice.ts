// PROJECT IMPORTS
import { TRUNK, TRUNK_ASSIGN, TRUNK_SEARCH } from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== TRUNK SERVICES ============================== */

export const trunk = (params: any) => {
  return apiInstance.get(TRUNK, { params });
};

export const allTrunk = () => {
  return apiInstance.get(TRUNK);
};

export const singleTrunk = (id: string) => {
  return apiInstance.get(TRUNK + `/${id}`);
};

export const searchTrunk = (payload: any) => {
  return apiInstance.post(TRUNK_SEARCH, payload);
};

export const createTrunk = (payload: any) => {
  return apiInstance.post(TRUNK, payload);
};

export const updateTrunk = (id: string, payload: any) => {
  return apiInstance.put(TRUNK + `/${id}`, payload);
};

export const updateTrunkStatus = (id: string, payload: any) => {
  return apiInstance.patch(TRUNK + `/${id}`, payload);
};

export const deleteTrunk = (id: string) => {
  return apiInstance.delete(TRUNK + `/${id}`);
};

export const assignTrunk = (id: string, payload: any) => {
  return apiInstance.patch(TRUNK_ASSIGN + `/${id}`, payload);
};
