// PROJECT IMPORTS
import { COUNTRY, COUNTRY_SEARCH } from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== COUNTRY SERVICES ============================== */

export const country = (params: any) => {
  return apiInstance.get(COUNTRY, { params });
};

export const allCountry = () => {
  return apiInstance.get(COUNTRY);
};

export const singleCountry = (id: string) => {
  return apiInstance.get(COUNTRY + `/${id}`);
};

export const searchCountry = (payload: any) => {
  return apiInstance.post(COUNTRY_SEARCH, payload);
};

export const createCountry = (payload: any) => {
  return apiInstance.post(COUNTRY, payload);
};

export const updateCountry = (id: string, payload: any) => {
  return apiInstance.put(COUNTRY + `/${id}`, payload);
};

export const updateCountryStatus = (id: string, payload: any) => {
  return apiInstance.patch(COUNTRY + `/${id}`, payload);
};

export const deleteCountry = (id: string) => {
  return apiInstance.delete(COUNTRY + `/${id}`);
};
