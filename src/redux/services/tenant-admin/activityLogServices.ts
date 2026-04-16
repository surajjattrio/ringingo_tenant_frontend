// PROJECT IMPORTS
import { ACTIVITY_LOG } from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== ACTIVITY LOG SERVICES ============================== */

export const allActivityLog = (params: any) => {
    return apiInstance.get(ACTIVITY_LOG, { params });
};
