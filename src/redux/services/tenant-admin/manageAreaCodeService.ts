// PROJECT IMPORTS
import { AREA_CODE, AREA_CODE_SEARCH, AREA_CODE_IMPORT, UPDATE_BY_AREACODE } from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== AreaCode SERVICES ============================== */

export const areaCode = (params: any) => {
    return apiInstance.get(AREA_CODE, { params });
};

export const singleAreaCode = (id: string) => {
    return apiInstance.get(AREA_CODE + `/${id}`);
};


export const allAreaCode = () => {
    return apiInstance.get(AREA_CODE);
};

export const searchAreaCode = (payload: any) => {
    return apiInstance.post(AREA_CODE_SEARCH, payload);
};

export const createAreaCode = (payload: any) => {
    return apiInstance.post(AREA_CODE, payload);
};

export const updateAreaCode = (id: string, payload: any) => {
    return apiInstance.put(AREA_CODE + `/${id}`, payload);
};

export const updateAreaCodeStatus = (id: string, payload: any) => {
    return apiInstance.patch(AREA_CODE + `/${id}`, payload);
};

export const deleteAreaCode = (id: string) => {
    return apiInstance.delete(AREA_CODE + `/${id}`);
};
export const statusAreaCode = (id: string, payload: any) => {
    return apiInstance.patch(UPDATE_BY_AREACODE + `/${id}`, payload);
};
export const importAreaCode = (payload: any) => {
    return apiInstance.post(AREA_CODE_IMPORT, payload);
};