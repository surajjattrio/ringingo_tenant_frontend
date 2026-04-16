// PROJECT IMPORTS
import { FOLLOW_UP, FOLLOW_UP_SEARCH } from "@/API/constAPI";
import { apiInstance } from "@/redux/axiosApi";
import { FilterTypes } from "@/types/filterTypes";

/* ============================== FOLLOW UP SERVICES ============================== */

export const followUpListGet = (params: FilterTypes) => {
  return apiInstance.get(FOLLOW_UP, { params });
};

export const followUpAdd = (payload: any) => {
  return apiInstance.post(FOLLOW_UP, payload);
};

export const followUpEdit = (uuid: string, payload: any) => {
  return apiInstance.put(FOLLOW_UP + `/${uuid}`, payload);
};

export const followUpSearch = (payload: any) => {
  return apiInstance.post(FOLLOW_UP_SEARCH, payload);
};

export const followUpDelete = (id: string) => {
  return apiInstance.delete(FOLLOW_UP + `/${id}`);
};
