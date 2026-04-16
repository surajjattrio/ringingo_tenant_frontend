// PROJECT IMPORTS
import { RING_GROUP, RING_GROUP_SEARCH } from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== RING SERVICES ============================== */

export const rings = (params: any) => {
    return apiInstance.get(RING_GROUP, { params });
};

export const allRings = () => {
    return apiInstance.get(RING_GROUP);
};

export const searchRing = (payload: any) => {
    return apiInstance.post(RING_GROUP_SEARCH, payload);
};

export const createRing = (payload: any) => {
    return apiInstance.post(RING_GROUP, payload);
};

export const updateRing = (id: string, payload: any) => {
    return apiInstance.put(RING_GROUP + `/${id}`, payload);
};

export const deleteRing = (id: string) => {
    return apiInstance.delete(RING_GROUP + `/${id}`);
};
