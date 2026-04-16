// TYPES IMPORT
import { AdvanceRoleTypes } from "@/types/master-admin/rolesTypes";

/* ============================== USER ROLE ============================== */

export const userRoleData: AdvanceRoleTypes[] = [
    {
        name: "user",
        title: "User",
        switchName: "is_user",
    },
    {
        name: "user_group",
        title: "User Group",
        switchName: "is_user_group",
    },
    {
        name: "user_role",
        title: "User Role",
        switchName: "is_user_role",
    },
    {
        name: "extension",
        title: "SIP devices",
        switchName: "is_extension",
    }
];

/* ============================== OUTGOING RULES ============================== */

export const outgoingRulesData: AdvanceRoleTypes[] = [
    {
        name: "trunk",
        title: "SIP Trunks",
        switchName: "is_trunk",
    },
    {
        name: "og_rules",
        title: "Outgoing Rules",
        switchName: "is_og_rules",
    },
    {
        name: "call_id_group",
        title: "Call ID Groups",
        switchName: "is_call_id_group",
    },
];

/* ============================== ADVANCE PBX ROLES ============================== */

export const incomingRulesData: AdvanceRoleTypes[] = [
    {
        name: "did",
        title: "DIDs",
        switchName: "is_did",
    },
    {
        name: "ip_mapping",
        title: "IP Mapping",
        switchName: "is_ip_mapping",
    },
    // {
    //     name: "click_to_Call",
    //     title: "Click to Call",
    //     switchName: "is_click_to_Call",
    // },
    {
        title: "Ring Group",
        name: "rg",
        switchName: "is_rg",
    },
    {
        title: "IVR",
        name: "ivr",
        switchName: "is_ivr",
    },
    {
        title: "Time Condition",
        name: "tc",
        switchName: "is_tc",
    },
    {
        title: "Conference",
        name: "cf",
        switchName: "is_cf",
    },
    {
        title: "Call Queue",
        name: "cq",
        switchName: "is_cq",
    },
    // {
    //     title: "Feature Code",
    //     name: "fc",
    //     switchName: "is_fc",
    // },
    {
        title: "Block Inbound Calls",
        name: "block_ic",
        switchName: "is_block_ic",
    },
];

/* ============================== LEAD MANAGEMENT ============================== */

export const leadManagementData: AdvanceRoleTypes[] = [
    {
        name: "leads",
        title: "Leads",
        switchName: "is_leads",
    },
    {
        name: "lead_group",
        title: "Lead Group",
        switchName: "is_lead_group",
    },
    {
        name: "follow_up",
        title: "Follow Up",
        switchName: "is_follow_up",
    },
    {
        name: "custom_fields",
        title: "Custom Fields",
        switchName: "is_custom_fields",
    },
];

/* ============================== ADVANCE CALL CENTER ROLES ============================== */

export const callCenterRoleData: AdvanceRoleTypes[] = [
    {
        title: "Outbound Campaign",
        name: "oc",
        switchName: "is_oc",
    },
    {
        title: "Inbound Campaign",
        name: "ic",
        switchName: "is_ic",
    },
    {
        title: "Blended Campaign",
        name: "bc",
        switchName: "is_bc",
    },
    {
        title: "Disposition",
        name: "td",
        switchName: "is_td",
    },
    {
        title: "DNC",
        name: "dnc",
        switchName: "is_dnc",
    },
    // {
    //     name: "webform",
    //     title: "Webform",
    //     switchName: "is_webform",
    // },
];

/* ============================== ADVANCE CALL REPORTS ROLES ============================== */

export const broadcastingData: AdvanceRoleTypes[] = [
    {
        title: "Voice Broadcast",
        name: "vb",
        switchName: "is_vb",
    },
];

export const messagingData: AdvanceRoleTypes[] = [
    {
        title: "WhatsApp",
        name: "whatsapp",
        switchName: "is_whatsapp",
    },
    {
        title: "Instagram",
        name: "instagram",
        switchName: "is_instagram",
    },
    {
        title: "Facebook",
        name: "facebook",
        switchName: "is_facebook",
    },
    {
        title: "SMS",
        name: "sms",
        switchName: "is_sms",
    },
];


/* ============================== ADVANCE CALL REPORTS ROLES ============================== */

export const reportsRolesData: AdvanceRoleTypes[] = [
    {
        title: "CDRs",
        name: "cdrs",
        switchName: "is_cdrs",
    },
    {
        title: "Live Call",
        name: "lc",
        switchName: "is_lc",
    },
    {
        title: "Missed Call",
        name: "missedcall",
        switchName: "is_missedcall",
    },
    {
        title: "Realtime Reports",
        name: "rr",
        switchName: "is_rr",
    },
    {
        title: "Lead Report",
        name: "lead_report",
        switchName: "is_lead_report",
    },
    {
        title: "Campaign Report",
        name: "campaign_report",
        switchName: "is_campaign_report",
    },
    {
        title: "VoiceBroadcast Report",
        name: "voicebroadcast_report",
        switchName: "is_voicebroadcast_report",
    },
    {
        title: "User Performance",
        name: "up",
        switchName: "is_up",
    },

    {
        title: "Login Logout Report",
        name: "loginLogout",
        switchName: "is_loginLogout",
    },
    {
        title: "Voicemail",
        name: "voicemail",
        switchName: "is_voicemail",
    },
    {
        title: "Sticky Agent Report",
        name: "sticky_agent_report",
        switchName: "is_sticky_agent_report",
    },
    {
        title: "Recording",
        name: "recording",
        switchName: "is_recording",
    },
    {
        title: "Omni Channel Report",
        name: "omni_channel_report",
        switchName: "is_omni_channel_report",
    },
    {
        title: "CSAT Report",
        name: "csat_report",
        switchName: "is_csat_report",
    },
    {
        title: "Activity Log",
        name: "activity_log",
        switchName: "is_activity_log",
    },
];

/* ============================== SETTING DATA  ============================== */

export const settingData: AdvanceRoleTypes[] = [
    {
        name: "prompts",
        title: "Audio Prompts",
        switchName: "is_prompts",
    },
    // {
    //     name: "e_smtp",
    //     title: "Email SMTP",
    //     switchName: "is_e_smtp",
    // },
    // {
    //     name: "telecomcircle",
    //     title: "Telecom Circle",
    //     switchName: "is_telecomcircle",
    // },
    {
        name: "breakcode",
        title: "Break Code",
        switchName: "is_breakcode",
    },

];

/* ============================== API INTEGRATION DATA ============================== */

export const apiData: AdvanceRoleTypes[] = [
    // {
    //     name: "crm",
    //     title: "CRM",
    //     switchName: "is_crm",
    // },
    // {
    //     name: "api_key",
    //     title: "API Key",
    //     switchName: "is_api_key",
    // },
    {
        name: "zoho_id",
        title: "Zoho CRM",
        switchName: "is_zoho_id",
    },

    {
        name: "webhooks",
        title: "Webhooks",
        switchName: "is_webhooks",
    },
];

/* ============================== PLUGINS DATA ============================== */

export const pluginsData: AdvanceRoleTypes[] = [
    {
        name: "google_drive",
        title: "Google Drive",
        switchName: "is_google_drive",
    },
    {
        name: "google_sheet",
        title: "Google Sheet",
        switchName: "is_google_sheet",
    },
];


/* ============================== SCHEDULING REPORT DATA ============================== */

export const schedulingReportData: AdvanceRoleTypes[] = [
    {
        name: "cdrs_report",
        title: "CDR",
        switchName: "is_cdrs_report",
    },
];
