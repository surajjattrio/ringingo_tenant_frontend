// PROJECT IMPORTS
import {
    LIVE_CALL,
    MONITORING,
    MONITORING_BARGE,
    MONITORING_WHISPER,
} from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== LIVE - CALL SERVICES ============================== */

export const liveCall = (params: any) => {
    return apiInstance.get(LIVE_CALL, { params });
};

export const allLiveCall = () => {
    return apiInstance.get(LIVE_CALL);
};

export const monitoringCall = (payload: any) => {
    return apiInstance.post(MONITORING, payload);
};

export const bargeCall = (payload: any) => {
    return apiInstance.post(MONITORING_BARGE, payload);
};

export const whisperCall = (payload: any) => {
    return apiInstance.post(MONITORING_WHISPER, payload);
};
