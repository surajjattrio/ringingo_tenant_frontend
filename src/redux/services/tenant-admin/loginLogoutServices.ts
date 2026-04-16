// PROJECT IMPORTS
import {
  LOGIN_LOGOUT_REPORT,
  LOGIN_LOGOUT_REPORT_SEARCH,
  LOGIN_LOGOUT_SINGLE_DETAILS,
  LOGIN_LOGOUT_EXPORT,
} from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== LOGIN-LOGOUT SERVICES ============================== */

export const loginLogout = (params: any) => {
  return apiInstance.get(LOGIN_LOGOUT_REPORT, { params });
};

export const allLoginLogout = (params?: any) => {
  return apiInstance.get(LOGIN_LOGOUT_REPORT, { params });
};

export const searchLoginLogout = (payload: any) => {
  return apiInstance.post(LOGIN_LOGOUT_REPORT_SEARCH, payload);
};

export const singleLoginLogoutInfo = (params: any) => {
  return apiInstance.get(LOGIN_LOGOUT_SINGLE_DETAILS, { params });
};

export const exportLoginLogoutWithInfo = (params: any) => {
  return apiInstance.get(LOGIN_LOGOUT_EXPORT, { params });
};
