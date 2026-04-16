// PROJECT IMPORT
import { OMNI_CHANNELO_REPORT, OMNI_CHANNELO_REPORT_SEARCH } from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== OMNI CHANNEL REPORT SERVICES ============================== */

/**
 * GET : Fetch all omni-channel users by tenant_uuid
 * API : GET /omni-channel-report
 */
export const getOmniChannelReport = (params: any) => {
  return apiInstance.get(OMNI_CHANNELO_REPORT, { params });
};

/**
 * POST : Search omni-channel users
 * API : POST /omni-channel-report/omni-channel-report-search
 */
export const searchOmniChannelReport = (data: any) => {
  return apiInstance.post(
    `${OMNI_CHANNELO_REPORT_SEARCH}`,
    data
  );
};
