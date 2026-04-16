// PROJECT IMPORTS
import { TIMEZONE, TIMEZONE_SEARCH } from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== TIME - ZONE SERVICES ============================== */

export const timezone = (params: any) => {
  return apiInstance.get(TIMEZONE, { params });
};

export const allTimezone = () => {
  return apiInstance.get(TIMEZONE);
};

export const singleTimezone = (id: string) => {
  return apiInstance.get(TIMEZONE + `/${id}`);
};

export const searchTimezone = (payload: any) => {
  return apiInstance.post(TIMEZONE_SEARCH, payload);
};

export const createTimezone = (payload: any) => {
  return apiInstance.post(TIMEZONE, payload);
};

export const updateTimezone = (id: string, payload: any) => {
  return apiInstance.put(TIMEZONE + `/${id}`, payload);
};

export const updateTimezoneStatus = (id: string, payload: any) => {
  return apiInstance.patch(TIMEZONE + `/${id}`, payload);
};

export const deleteTimezone = (id: string) => {
  return apiInstance.delete(TIMEZONE + `/${id}`);
};
