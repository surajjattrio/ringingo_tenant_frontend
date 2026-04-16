// PROJECT IMPORTS
import {
    USER_PERFORMANCE_REPORT,
    USER_PERFORMANCE_REPORT_SEARCH,
} from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== USER - PERFORMANCE SERVICES ============================== */

export const userPerformance = (params: any) => {
    return apiInstance.get(USER_PERFORMANCE_REPORT, { params });
};

export const singleUserInfo = (id: string, params: any) => {
    return apiInstance.get(USER_PERFORMANCE_REPORT + `/${id}`, { params });
};

export const allUserPerformance = (params?: any) => {
    return apiInstance.get(USER_PERFORMANCE_REPORT, { params });
};

export const searchUserPerformance = (payload: any) => {
    return apiInstance.post(USER_PERFORMANCE_REPORT_SEARCH, payload);
};
