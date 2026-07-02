//PROJECT IMPORT
import {
    ADMIN_LOGOUT,
    CALL_PAUSE,
    CAMPAIGN,
    REALTIME_REPORT,
    REALTIME_REPORT_SEARCH,
    REALTIME_REPORT_UPDATE,
    AGENT_STATE,
} from "@/API/constAPI";
import { apiInstance } from "@/redux/axiosApi";

/* ============================== REAL TIME REPORT SERVICES ============================== */

export const logoutAdmin = (id: any, data: any) => {
    return apiInstance.patch(ADMIN_LOGOUT + `/${id}`, data);
};

export const getRealTimeReport = (params: any) => {
    return apiInstance.get(REALTIME_REPORT, { params });
};

export const searchRealTimeReport = (payload: any) => {
    return apiInstance.post(REALTIME_REPORT_SEARCH, payload);
};

export const getCampaign = () => {
    return apiInstance.get(CAMPAIGN);
};

export const callPause = (payload: any) => {
    return apiInstance.post(CALL_PAUSE, payload);
};

export const toggleAgentState = (feature: string, uuid: string) => {
    return apiInstance.put(`${AGENT_STATE}/${feature}/${uuid}`);
};

export const updateRealTimeReport = (id: string, payload: any) => {
    return apiInstance.put(REALTIME_REPORT_UPDATE + `/${id}`, payload);
};

export const putAgentOnBreak = (status: any, id: string, payload: any) => {
    return apiInstance.put("tenant/agent-break" + `/${status}` + `/${id}`, payload);
};
