// PROJECT IMPORTS
import { VOICE_MAIL, VOICE_MAIL_SEARCH } from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== VOICE - MAIL SERVICES ============================== */

export const voiceMail = (params: any) => {
    return apiInstance.get(VOICE_MAIL, { params });
};

export const allVoiceMail = (params?: any) => {
    return apiInstance.get(VOICE_MAIL, { params });
};

export const searchVoiceMail = (payload: any) => {
    return apiInstance.post(VOICE_MAIL_SEARCH, payload);
};
