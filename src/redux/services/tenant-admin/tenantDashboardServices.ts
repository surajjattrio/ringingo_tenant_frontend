// PROJECT IMPORTS
import { apiInstance } from "../../axiosApi";

import {
    TENANT_DASHBOARD,
    TENANT_DASHBOARD_CALL_OVERVIEW,
    TENANT_DASHBOARD_FILTER,
    TENANT_DASHBOARD_DATA,
} from "@/API/constAPI";

/* ============================== TENANT - DASHBOARD ============================== */

export const tenantDashboard = (feature: string, params: any) => {
    return apiInstance.get(TENANT_DASHBOARD + `/${feature}`, { params });
};

export const tenantCallOverviewDashboard = (payload: any) => {
    return apiInstance.post(TENANT_DASHBOARD_CALL_OVERVIEW, payload);
};

export const tenantFilterDashboard = (feature: string, params: any) => {
    return apiInstance.get(TENANT_DASHBOARD_FILTER + `/${feature}`, { params });
};

export const tenantDashboardData = (payload: any) => {
    return apiInstance.post(TENANT_DASHBOARD_DATA, payload);
};

