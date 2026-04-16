// PROJECT IMPORTS
import { CONFERENCE, CONFERENCE_SEARCH } from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== CONFERENCE SERVICES ============================== */

export const conference = (params: any) => {
    return apiInstance.get(CONFERENCE, { params });
};

export const allConference = () => {
    return apiInstance.get(CONFERENCE);
};

export const searchConference = (payload: any) => {
    return apiInstance.post(CONFERENCE_SEARCH, payload);
};

export const createConference = (payload: any) => {
    return apiInstance.post(CONFERENCE, payload);
};

export const updateConference = (id: string, payload: any) => {
    return apiInstance.put(CONFERENCE + `/${id}`, payload);
};

export const updateConferenceStatus = (id: string, payload: any) => {
    return apiInstance.patch(CONFERENCE + `/${id}`, payload);
};

export const deleteConference = (id: string) => {
    return apiInstance.delete(CONFERENCE + `/${id}`);
};
