// PROJECT IMPORTS
import {
    MISSED_CALL_REPORT,
    MISSED_CALL_REPORT_SEARCH,
} from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== MISSED-CALL SERVICES ============================== */

export const missedCall = (params: any) => {
    params.callstate='missed';
    return apiInstance.get(MISSED_CALL_REPORT, { params });

};

// export const singleUserInfo = (id: string, params: any) => {
//     return apiInstance.get(USER_PERFORMANCE_REPORT + `/${id}`, { params });
// };

export const allMissedCall = (params?: any) => {
   // params.callstate='missed';
    return apiInstance.get(MISSED_CALL_REPORT, { params });
};

export const searchMissedCall = (payload: any) => {
    payload.callstate='missed';
    return apiInstance.post(MISSED_CALL_REPORT_SEARCH, payload);
};
