// PROJECT IMPORTS
import { apiInstance } from "../../axiosApi";
import { FEATURE_CODE } from "@/API/constAPI";

/* ============================== FEATURE - CODE SERVICES ============================== */

export const featureCode = () => {
    return apiInstance.get(FEATURE_CODE,{params:{list:'all'}});
};

export const singleFeatureCode = (id: string) => {
    return apiInstance.get(FEATURE_CODE + `/${id}`);
};

export const updateFeatureCode = (id: string, payload: any) => {
    return apiInstance.put(FEATURE_CODE + `/${id}`, payload);
};
