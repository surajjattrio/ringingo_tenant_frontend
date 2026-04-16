// PROJECT IMPORTS
import { DID_REPORT, DID_REPORT_SEARCH } from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== DID REPORT SERVICES ============================== */

export const didReport = (params: any) => {
    return apiInstance.get(DID_REPORT, { params });
};

export const didReportSearch = (payload: any) => {
    return apiInstance.post(DID_REPORT_SEARCH, payload);
}; 