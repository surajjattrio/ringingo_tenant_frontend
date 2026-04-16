// PROJECT IMPORTS
import {
    DROPPED_CALLS_REPORT,
    DROPPED_CALLS_REPORT_SEARCH,
} from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== DROPPED CALLS REPORT SERVICES ============================== */

export const droppedCalls = (params: any) => {
    // params.callstate = 'drop';
    return apiInstance.get(DROPPED_CALLS_REPORT, { params });
};

export const allDroppedCalls = (params?: any) => {
    return apiInstance.get(DROPPED_CALLS_REPORT, { params });
};

export const searchDroppedCalls = (payload: any) => {
    payload.callstate = 'drop';
    return apiInstance.post(DROPPED_CALLS_REPORT_SEARCH, payload);
};