// PROJECT IMPORTS
import { BREAK_CODE, BREAK_CODE_SEARCH } from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== BREAK CODE SERVICES ============================== */

export const breakCode = (params: any) => {
    return apiInstance.get(BREAK_CODE, { params });
};

export const allBreakCode = () => {
    return apiInstance.get(BREAK_CODE);
};

export const searchBreakCode = (payload: any) => {
    return apiInstance.post(BREAK_CODE_SEARCH, payload);
};

export const singleBreakCode = (id: string) => {
    return apiInstance.get(BREAK_CODE + `/${id}`);
};

export const createBreakCode = (payload: any) => {
    return apiInstance.post(BREAK_CODE, payload);
};

export const updateBreakCode = (id: string, payload: any) => {
    return apiInstance.put(BREAK_CODE + `/${id}`, payload);
};

export const updateBreakCodeStatus = (id: string, payload: any) => {
    return apiInstance.patch(BREAK_CODE + `/${id}`, payload);
};

export const deleteBreakCode = (id: string) => {
    return apiInstance.delete(BREAK_CODE + `/${id}`);
};
