// PROJECT IMPORT
import { apiInstance } from "../../axiosApi";
import { MONITORING_OVERVIEW } from "@/API/constAPI";

/* ============================== MONITORING ============================== */

export const getMonitoringOverview = () => {
    return apiInstance.get(MONITORING_OVERVIEW);
};
