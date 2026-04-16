// PROJECT IMPORTS
import {
    CALLER_ID_GROUP,
    CALLER_ID_GROUP_ADD,
    CALLER_ID_GROUP_IMPORT,
    CALLER_ID_GROUP_SEARCH,
} from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== CALLER - ID - GROUP SERVICES ============================== */

export const callerIdGroup = (params: any) => {
    return apiInstance.get(CALLER_ID_GROUP, { params });
};

export const allCallerIdGroup = (params?: any) => {
    return apiInstance.get(CALLER_ID_GROUP, { params });
};

export const singleCallerIdGroup = (id: string,params:any) => {
    return apiInstance.get(CALLER_ID_GROUP + `/${id}`,{ params });
};

export const searchCallerIdGroup = (payload: any) => {
    return apiInstance.post(CALLER_ID_GROUP_SEARCH, payload);
};

export const createCallerIdGroup = (payload: any) => {
    return apiInstance.post(CALLER_ID_GROUP, payload);
};

export const addCallerId = (payload: any) => {
    return apiInstance.post(CALLER_ID_GROUP_ADD, payload);
};

export const importCallerId = (payload: any) => {
    return apiInstance.post(CALLER_ID_GROUP_IMPORT, payload);
};

export const updateCallerIdGroup = (id: string, payload: any) => {
    return apiInstance.put(CALLER_ID_GROUP + `/${id}`, payload);
};

export const updateCallerIdGroupStatus = (id: string, payload: any) => {
    return apiInstance.patch(CALLER_ID_GROUP + `/${id}`, payload);
};

export const deleteCallerIdGroup = (id: string) => {
    return apiInstance.delete(CALLER_ID_GROUP + `/${id}`);
};

export const deleteCallerId = (uuid: string, id: string) => {
    return apiInstance.delete(CALLER_ID_GROUP + `/${uuid}/${id}`);
};
