// PROJECT IMPORTS
import { apiInstance } from "../../axiosApi";
import {
    DASHBOARD,
    DASHBOARD_CALL_OVERVIEW,
    DASHBOARD_FILTER,
} from "@/API/constAPI";

/* ============================== DASHBORAD ============================== */

export const dashboard = (feature: string, params: any) => {
    return apiInstance.get(DASHBOARD + `/${feature}`, { params });
};

export const callOverviewDashboard = (payload: any) => {
    return apiInstance.post(DASHBOARD_CALL_OVERVIEW, payload);
};

export const filterDashboard = (feature: string, params: any) => {
    return apiInstance.get(DASHBOARD_FILTER + `/${feature}`, { params });
};

