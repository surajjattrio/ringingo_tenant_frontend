// PROJECT IMPORTS
import {
    // ACCOUNT_DASHBOARD,
    // ACCOUNT_DASHBOARD_OVERVIEW,
    TENANT_DASHBOARD,
    TENANT_DASHBOARD_CALL_OVERVIEW,
    TENANT_DASHBOARD_ACCOUNT_DETAILS
} from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== ACCOUNT DASHBOARD SERVICES ============================== */

export const accountDashboard = (params: any) => {
    return apiInstance.get(TENANT_DASHBOARD, { params });
};

export const accountDashboardOverview = (params: any) => {
    return apiInstance.get(TENANT_DASHBOARD_CALL_OVERVIEW, { params });
};

export const allAccountDashboard = (params?: any) => {
    return apiInstance.get(TENANT_DASHBOARD, { params });
};

export const accountDetails = (feature: string, payload: any) => {
    return apiInstance.post(TENANT_DASHBOARD_ACCOUNT_DETAILS + `/${feature}`, payload);
}