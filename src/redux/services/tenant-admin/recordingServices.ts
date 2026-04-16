// PROJECT IMPORTS
import { RECORDING, RECORDING_SEARCH } from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== RECORDING SERVICES ============================== */

export const recording = (params: any) => {
    return apiInstance.get(RECORDING, { params });
};

export const allRecording = (params?: any) => {
    return apiInstance.get(RECORDING, { params });
};

export const searchRecording = (payload: any) => {
    return apiInstance.post(RECORDING_SEARCH, payload);
};
