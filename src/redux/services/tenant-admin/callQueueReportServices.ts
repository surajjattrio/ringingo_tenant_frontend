// PROJECT IMPORTS
import {
    CALL_QUEUE_REPORT,
    CALL_QUEUE_REPORT_SEARCH,
} from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== DROPPED CALLS REPORT SERVICES ============================== */

export const callQueueReport = (params: any) => {
    params.callstate = 'call-queue';
    return apiInstance.get(CALL_QUEUE_REPORT, { params });
};

// export const allDroppedCalls = (params?: any) => {
//     return apiInstance.get(CALL_QUEUE_REPORT, { params });
// };

export const searchCallQueueReport = (payload: any) => {
    payload.callstate = 'call-queue';
    return apiInstance.post(CALL_QUEUE_REPORT_SEARCH, payload);
};