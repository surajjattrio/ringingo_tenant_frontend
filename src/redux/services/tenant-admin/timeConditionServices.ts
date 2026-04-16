// PROJECT IMPORTS
import { TIME_CONDITION, TIME_CONDITION_SEARCH } from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== CALL QUEUE SERVICES ============================== */

export const timeCondition = (params: any) => {
    return apiInstance.get(TIME_CONDITION, { params });
};

export const allTimeCondition = () => {
    return apiInstance.get(TIME_CONDITION);
};

export const searchTimeCondition = (payload: any) => {
    return apiInstance.post(TIME_CONDITION_SEARCH, payload);
};

export const createTimeCondition = (payload: any) => {
    return apiInstance.post(TIME_CONDITION, payload);
};

export const updateTimeCondition = (id: string, payload: any) => {
    return apiInstance.put(TIME_CONDITION + `/${id}`, payload);
};

export const updateTimeConditionStatus = (id: string, payload: any) => {
    return apiInstance.patch(TIME_CONDITION + `/${id}`, payload);
};

export const deleteTimeCondition = (id: string) => {
    return apiInstance.delete(TIME_CONDITION + `/${id}`);
};
