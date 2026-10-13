// PROJECT IMPORTS
import { API_KEY } from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== API KEY SERVICES ==============================
 * Static, per-tenant key (tenant.api_key) - an alternative to a Bearer token for
 * server-to-server calls: send it as an "x-api-key" header instead of Authorization.
 * ================================================================================ */

export const createApiKey = () => {
    return apiInstance.post(API_KEY, {});
};

export const getApiKey = () => {
    return apiInstance.get(API_KEY);
};

export const revokeApiKey = () => {
    return apiInstance.delete(API_KEY);
};
