// PROJECT IMPORTS
import {
  STICKY_AGENT_REPORT,
  STICKY_AGENT_REPORT_SEARCH,
} from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== LOGIN-LOGOUT SERVICES ============================== */

export const stickyAgentReport = (params: any) => {
  return apiInstance.get(STICKY_AGENT_REPORT, { params });
};

export const allStickyAgentReport = (params?: any) => {
  return apiInstance.get(STICKY_AGENT_REPORT, { params });
};

export const searchStickyAgentReport = (payload: any) => {
  return apiInstance.post(STICKY_AGENT_REPORT_SEARCH, payload);
};

export const deleteStickyAgentReport = (id: string) => {
    return apiInstance.delete(STICKY_AGENT_REPORT + `/${id}`);
};