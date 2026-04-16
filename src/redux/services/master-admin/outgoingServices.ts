// PROJECT IMPORTS
import { apiInstance } from "../../axiosApi";
import { OUTGOING_RULES, OUTGOING_RULES_SEARCH } from "@/API/constAPI";

/* ============================== OUTGOING - RULES SERVICES ============================== */

export const outgoing = (params: any) => {
    return apiInstance.get(OUTGOING_RULES, { params });
};

export const allOutgoing = () => {
    return apiInstance.get(OUTGOING_RULES);
};

export const searchOutgoing = (payload: any) => {
    return apiInstance.post(OUTGOING_RULES_SEARCH, payload);
};

export const createOutgoing = (payload: any) => {
    return apiInstance.post(OUTGOING_RULES, payload);
};

export const updateOutgoing = (id: string, payload: any) => {
    return apiInstance.put(OUTGOING_RULES + `/${id}`, payload);
};

export const updateOutgoingStatus = (id: string, payload: any) => {
    return apiInstance.patch(OUTGOING_RULES + `/${id}`, payload);
};

export const deleteOutgoing = (id: string) => {
    return apiInstance.delete(OUTGOING_RULES + `/${id}`);
};
