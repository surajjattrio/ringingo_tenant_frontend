// PROJECT IMPORT
import { LEAD_REPORT } from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== LEAD REPORT SERVICES ============================== */

export const leadReport = (uuid: string, params: any) => {
    return apiInstance.get(LEAD_REPORT + `/${uuid}`, { params });
};
