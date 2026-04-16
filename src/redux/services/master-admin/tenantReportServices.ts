// PROJECT IMPORTS
import {
    TENANT_CHECK_FLAG,
    TENANT_REPORT,
    TENANT_REPORT_SEARCH,
} from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== TENANT REPORT SERVICES ============================== */

export const tenantReport = (params: any) => {
    return apiInstance.get(TENANT_REPORT, { params });
};

export const searchTenantReport = (payload: any) => {
    return apiInstance.post(TENANT_REPORT_SEARCH, payload);
};

export const tenantReportFlag = () => {
    return apiInstance.get(TENANT_CHECK_FLAG);
};
