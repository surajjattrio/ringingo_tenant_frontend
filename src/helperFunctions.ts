// MASTER - ADMIN IMPORT
import { clearCdrs } from "./redux/slice/master-admin/cdrsSlice";
import { clearCountry } from "./redux/slice/master-admin/countrySlice";
import { clearDashboard } from "./redux/slice/master-admin/dashboardSlice";
import { clearLiveCall } from "./redux/slice/master-admin/liveCallSlice";
import { clearRole } from "./redux/slice/master-admin/roleSlice";
import { clearSip } from "./redux/slice/master-admin/sipProfileSlice";
import { clearTenant } from "./redux/slice/master-admin/tenantSlice";
import { clearTimezone } from "./redux/slice/master-admin/timezoneSlice";
import { clearTrunk } from "./redux/slice/master-admin/trunkSlice";
import { clearDisposition } from "./redux/slice/master-admin/dispositionSlice";
import { clearOutgoing } from "./redux/slice/master-admin/outgoingSlice";
import { clearAdminDid } from "./redux/slice/master-admin/adminDidSlice";
import { clearAdminIpMapping } from "./redux/slice/master-admin/adminIpMappingSlice";
import { clearTenantReport } from "./redux/slice/master-admin/tenantReportSlice";
import { clearCommonSlice } from "./redux/slice/commonSlice";

// TENANT - ADMIN IMPORT
import { clearCallQueue } from "./redux/slice/tenant-admin/callQueueSlice";
import { clearConference } from "./redux/slice/tenant-admin/conferenceSlice";
import { clearFeatureCode } from "./redux/slice/tenant-admin/featureCodeSlice";
import { clearDid } from "./redux/slice/tenant-admin/didSlice";
import { clearIpMapping } from "./redux/slice/tenant-admin/ipMappingSlice";
import { clearIvr } from "./redux/slice/tenant-admin/ivrSlice";
import { clearLead } from "./redux/slice/tenant-admin/leadManagementSlice";
import { clearTenantOutgoing } from "./redux/slice/tenant-admin/tenantOutgoingSlice";
import { clearPrompts } from "./redux/slice/tenant-admin/promptsSlice";
import { clearRing } from "./redux/slice/tenant-admin/ringSlice";
import { clearSipDevices } from "./redux/slice/tenant-admin/sipDevicesSlice";
import { clearTenantCdrs } from "./redux/slice/tenant-admin/tenantCdrsSlice";
import { clearTenantDashboard } from "./redux/slice/tenant-admin/tenantDashboardSlice";
import { clearTenantLiveCall } from "./redux/slice/tenant-admin/tenantLiveCallSlice";
import { clearTenantRole } from "./redux/slice/tenant-admin/tenantRoleSlice";
import { clearTenantTrunk } from "./redux/slice/tenant-admin/tenantTrunkSlice";
import { clearTimeCondition } from "./redux/slice/tenant-admin/timeConditionSlice";
import { clearTenantDisposition } from "./redux/slice/tenant-admin/tenantDispositionSlice";
import { clearUserGroup } from "./redux/slice/tenant-admin/userGroupSlice";
import { clearUserRole } from "./redux/slice/tenant-admin/userRoleSlice";
import { clearLeadGroup } from "./redux/slice/tenant-admin/leadGroupSlice";
import { clearUser } from "./redux/slice/tenant-admin/userSlice";
import { clearDnc } from "./redux/slice/tenant-admin/dncSlice";
import { clearRecording } from "./redux/slice/tenant-admin/recordingSlice";
import { clearVoiceMail } from "./redux/slice/tenant-admin/voiceMailSlice";
import { clearOutbound } from "./redux/slice/tenant-admin/outboundSlice";
import { clearInbound } from "./redux/slice/tenant-admin/inboundSlice";
import { clearBlended } from "./redux/slice/tenant-admin/blendedSlice";
import { clearFollowUpSlice } from "./redux/slice/tenant-admin/followUpSlice";
import { clearRealtimeReport } from "./redux/slice/tenant-admin/realtimeReportSlice";
import { clearclickToCall } from "./redux/slice/tenant-admin/clickToCallSlice";
import { clearblockInboundCampaign } from "./redux/slice/tenant-admin/blockInboundCampaignSlice";
import { clearVoiceBroadcast } from "./redux/slice/tenant-admin/voiceBroadcastSlice";
import { clearLeadReport } from "./redux/slice/tenant-admin/leadReportSlice";
import { clearCampaignReport } from "./redux/slice/tenant-admin/campaignReportSlice";
import { clearUserPerformance } from "./redux/slice/tenant-admin/userPerformanceSlice";
import { clearVoiceBroadcastReport } from "./redux/slice/tenant-admin/voiceBroadcastReportSlice";
import { clearManager } from "./redux/slice/tenant-admin/managerSlice";
import { clearBreakCode } from "./redux/slice/tenant-admin/breakCodeSlice";
import { clearTelecomCircle } from "./redux/slice/tenant-admin/telecomCircleSlice";
import { clearMissedCall } from "./redux/slice/tenant-admin/missedCallSlice";
import { clearWebForm } from "./redux/slice/tenant-admin/webFormSlice";
import { clearCustomFields } from "./redux/slice/tenant-admin/customFieldsSlice";
import { clearStickyAgentReport } from "./redux/slice/tenant-admin/stickyAgentReportSlice";
import { clearAreaCode } from "./redux/slice/tenant-admin/manageAreaCodeSlice";
import { clearState } from "./redux/slice/tenant-admin/manageStateSlice";

//import { clearManagerRole } from "./redux/slice/tenant-admin/managerRoleSlice";

// OPTIONS IMPORT
import { months } from "./config/options";
import { format } from "date-fns";

const API_BASE_URL = process.env.BASE_URL || "";
export const downloadzipFile = (
  src: string,
  name: string,
  method: "GET" | "POST" = "GET",
  body?: any
) => {
  const xmlHttp = new XMLHttpRequest();

  const base = API_BASE_URL.replace(/\/$/, "");
  const path = src.replace(/^\//, "");
  const url = `${base}/${path}`;

  xmlHttp.onreadystatechange = () => {
    if (xmlHttp.readyState === 4) {
      // Accept both 200 and 201
      if (xmlHttp.status === 200 || xmlHttp.status === 201) {
        // Check if response is actually a blob
        if (xmlHttp.response && xmlHttp.response.size > 0) {
          const blobUrl = window.URL.createObjectURL(xmlHttp.response);
          const e = document.createElement("a");
          e.href = blobUrl;
          e.download = name;
          document.body.appendChild(e);
          e.click();
          document.body.removeChild(e);
          window.URL.revokeObjectURL(blobUrl);
          console.log("Download successful");
        } else {
          console.error("Empty response received");
        }
      } else {
        console.error("Download failed:", xmlHttp.status, xmlHttp.statusText);
        // Try to read error message
        try {
          const errorText = new TextDecoder().decode(xmlHttp.response);
          console.error("Error details:", errorText);
        } catch (e) {
          console.error("Could not parse error response");
        }
      }
    }
  };

  xmlHttp.responseType = "blob";
  xmlHttp.open(method, url, true);

  if (method === "POST") {
    xmlHttp.setRequestHeader("Content-Type", "application/json");
  }

  if (body) {
    xmlHttp.send(JSON.stringify(body));
  } else {
    xmlHttp.send(null);
  }
};

export const downloadFile = (src: string, name: string) => {
  const xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = () => {
    if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
      const blobUrl = window.URL.createObjectURL(xmlHttp.response);
      const e = document.createElement("a");
      e.href = blobUrl;
      e.download = name;
      document.body.appendChild(e);
      e.click();
      document.body.removeChild(e);
    }
  };
  xmlHttp.responseType = "blob";
  xmlHttp.open("GET", src, true);
  xmlHttp.send(null);
};

export const formatDate = (date: any, time: boolean = false) => {
  if (!date) {
    return "";
  }
  const d = new Date(date),
    month = d.getMonth() + 1,
    day = d.getDate(),
    year = d.getFullYear();
  return `${[
    year,
    month?.toString()?.padStart(2, "0"),
    day?.toString()?.padStart(2, "0"),
  ].join("-")}${time ? " " + format(new Date(d), "HH:mm:ss") : ""}`;
};

// Get Time in a Format from Seconds
export const formatTime = (seconds: number, viewHours: boolean = false) => {
  if (!seconds || typeof seconds !== "number")
    return viewHours ? "00:00:00" : "00:00";
  const formated = new Date(seconds * 1000)?.toISOString();
  return viewHours ? formated?.slice(11, 19) : formated?.slice(14, 19);
};

// Get Start Date and End Date of Past Month
export const getStartEndDateWithTitle = (month: any, year: any) => {
  const d = new Date(year, month);
  return {
    start_date: formatDate(new Date(year, month)),
    end_date: formatDate(new Date(year, month + 1, 0)),
    label: `${months[d?.getMonth()]} ${year}`,
  };
};

// Get Call Date Filter Options With Last 6 Month
export const getDateFilterOptions = () => {
  const curr = new Date();
  const currMonth = curr.getMonth();
  const weekFirst = curr.getDate() - curr.getDay();
  const lastWeek = formatDate(new Date(curr.setDate(weekFirst)));
  const lastMonth = formatDate(new Date(curr.setDate(1)));
  const current = formatDate(new Date());

  const options = [
    {
      value: "1",
      label: "This Week",
      start_date: lastWeek,
      end_date: current,
    },
    {
      value: "2",
      label: "This Month",
      start_date: lastMonth,
      end_date: current,
    },
    // {
    //   value: "3",
    //   ...getStartEndDateWithTitle(currMonth - 1, curr.getFullYear()),
    // },
    // {
    //   value: "4",
    //   ...getStartEndDateWithTitle(currMonth - 2, curr.getFullYear()),
    // },
    // {
    //   value: "5",
    //   ...getStartEndDateWithTitle(currMonth - 3, curr.getFullYear()),
    // },
    // {
    //   value: "6",
    //   ...getStartEndDateWithTitle(currMonth - 4, curr.getFullYear()),
    // },
    // {
    //   value: "7",
    //   ...getStartEndDateWithTitle(currMonth - 5, curr.getFullYear()),
    // },
    // {
    //   value: "8",
    //   ...getStartEndDateWithTitle(currMonth - 6, curr.getFullYear()),
    // }
  ];

  // Generate options for past months
  for (let i = 3; i < 9; i++) {
    const month = curr.getMonth() - (i - 3);
    var year = curr.getFullYear();

    if (month < 0) {
      year = curr.getFullYear() - 1;
    }


    options.push({
      value: `${i}`,
      label: `${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}`,
      start_date: formatDate(new Date(year, month)),
      end_date: formatDate(new Date(year, month + 1, 0)),
    });

  }

  return options;
};

// Return a String with Remove - and Capital First Letter of String
export const capitalizeFirst = (val: string, skip: boolean) => {
  const array = val?.split("-");
  let finalString = "";
  array?.forEach((val: string, index: number) => {
    if (skip && val?.startsWith("tenant") && index === 0) return;
    finalString += ` ${val?.slice(0, 1)?.toUpperCase()}${val?.slice(1)}`;
  });
  return finalString?.trimStart();
};

export const readCsvFile = (str: string, delim = ",") => {
  const headers = str?.slice(0, str?.indexOf("\n"))?.split(delim);
  return headers;
};
// Clear All Tenant Redux Data
export const clearTenantData = (dispatch: any) => {
  dispatch(clearCallQueue());
  dispatch(clearConference());
  dispatch(clearFeatureCode());
  dispatch(clearDid());
  dispatch(clearIpMapping());
  dispatch(clearIvr());
  dispatch(clearLead());
  dispatch(clearTenantOutgoing());
  dispatch(clearPrompts());
  dispatch(clearRing());
  dispatch(clearSipDevices());
  dispatch(clearTenantCdrs());
  dispatch(clearTenantDashboard());
  dispatch(clearTenantLiveCall());
  dispatch(clearTenantRole());
  dispatch(clearTenantTrunk());
  dispatch(clearTimeCondition());
  dispatch(clearUserGroup());
  dispatch(clearUserRole());
  dispatch(clearUser());
  dispatch(clearTenantDisposition());
  dispatch(clearLeadGroup());
  dispatch(clearOutbound());
  dispatch(clearInbound());
  dispatch(clearBlended());
  dispatch(clearDnc());
  dispatch(clearAreaCode());
  dispatch(clearState());
  dispatch(clearRecording());
  dispatch(clearVoiceMail());
  dispatch(clearFollowUpSlice());
  dispatch(clearRealtimeReport());
  dispatch(clearclickToCall());
  dispatch(clearblockInboundCampaign());
  dispatch(clearVoiceBroadcast());
  dispatch(clearLeadReport());
  dispatch(clearCampaignReport());
  dispatch(clearUserPerformance());
  dispatch(clearVoiceBroadcastReport());
  dispatch(clearManager());
  dispatch(clearBreakCode());
  dispatch(clearTelecomCircle());
  dispatch(clearMissedCall());
  dispatch(clearWebForm());
  dispatch(clearCustomFields());
  dispatch(clearStickyAgentReport());

  //dispatch(clearManagerRole());

};

// Clear All Redux Data
export const clearAllData = (dispatch: any) => {
  clearTenantData(dispatch);
  dispatch(clearCdrs());
  dispatch(clearCountry());
  dispatch(clearDashboard());
  dispatch(clearLiveCall());
  dispatch(clearRole());
  dispatch(clearSip());
  dispatch(clearTenant());
  dispatch(clearTimezone());
  dispatch(clearDisposition());
  dispatch(clearTrunk());
  dispatch(clearOutgoing());
  dispatch(clearAdminDid());
  dispatch(clearAdminIpMapping());
  dispatch(clearTenantReport());
  dispatch(clearCommonSlice());
};

export function convertUtcToIst(utcString: any) {
  // Parse as UTC
  const date = new Date(utcString + "Z");

  // Format manually to YYYY-MM-DD HH:mm:ss in IST
  const options = { timeZone: "Asia/Kolkata" };
  const istDate = new Date(date.toLocaleString("en-US", options));

  const year = istDate.getFullYear();
  const month = String(istDate.getMonth() + 1).padStart(2, "0");
  const day = String(istDate.getDate()).padStart(2, "0");
  const hours = String(istDate.getHours()).padStart(2, "0");
  const minutes = String(istDate.getMinutes()).padStart(2, "0");
  const seconds = String(istDate.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function formatDuration(ms: number | string) {
  if (ms === null || ms === undefined) return "00:00:00";

  const totalSeconds = Number(ms); // convert string → number
  if (isNaN(totalSeconds)) return "00:00:00";

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, "0");

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};