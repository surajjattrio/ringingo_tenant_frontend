// PROJECT IMPORTS
import {
    ALL_CAMPAIGN,
    CAMPAIGN_REPORT,
    CAMPAIGN_REPORT_SEARCH,
} from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== CAMPAIGN REPORT SERVICES ============================== */

export const campaignReport = (params: any) => {
    return apiInstance.get(CAMPAIGN_REPORT, { params });
};

export const allCampaign = () => {
    return apiInstance.get(ALL_CAMPAIGN);
};

export const searchCampaignReport = (payload: any) => {
    return apiInstance.post(CAMPAIGN_REPORT_SEARCH, payload);
};
