// PROJECT IMPORTS
import {
    
    VOICE_BROADCAST_DETAILS,
    VOICE_BROADCAST_DETAILS_SEARCH,
    VOICE_BROADCAST_SINGLE_DETAILS
} from "@/API/constAPI"; 
import { apiInstance } from "../../axiosApi";

/* ============================== VOICE BROADCAST REPORT SERVICES ============================== */

export const voiceBroadcastReport = (params: any) => {
    return apiInstance.get(VOICE_BROADCAST_DETAILS, { params });
};


export const searchVoiceBroadcastReport = (payload: any) => {
    return apiInstance.post(VOICE_BROADCAST_DETAILS_SEARCH, payload);
};

export const allVoiceBroadcastReport = (params?: any) => {
    return apiInstance.get(VOICE_BROADCAST_DETAILS, { params });
};

export const singleVoiceInfo = (id: string) => {
    return apiInstance.get(VOICE_BROADCAST_SINGLE_DETAILS + `/${id}`);
};
// export const voiceBroadcastReportFlag = () => {
//     return apiInstance.get(VOICE_BROADCAST_CHECK_FLAG);
// };
