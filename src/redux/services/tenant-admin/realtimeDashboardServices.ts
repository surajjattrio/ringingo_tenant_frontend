// PROJECT IMPORT
import { REALTIME_DASHBOARD_LEAD_GROUP_STATS } from "@/API/constAPI";
import { apiInstance } from "@/redux/axiosApi";

/* ============================== REALTIME DASHBOARD SERVICES ============================== */

export const getLeadGroupStats = (params: any) => {
    return apiInstance.get(REALTIME_DASHBOARD_LEAD_GROUP_STATS, { params });
};
