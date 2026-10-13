// TYPES IMPORT
import { AdvanceRoleTypes } from "@/types/master-admin/rolesTypes";

/* ============================== USER ROLE ============================== */

// export const userRoleData: AdvanceRoleTypes[] = [
    export const userRoleData: any[] = [
    {
        name: "user",
        title: "User",
        switchName: "is_user",
        is_create : "is_create_user",
        is_list : "is_list_user",
        is_edit : "is_edit_user",
        is_delete : "is_delete_user",
        is_add : "is_add_user",
        add_value : "add_user_value"
    },
    {
        name: "user_group",
        title: "User Group",
        switchName: "is_user_group",
        is_create : "is_create_user_group",
        is_list : "is_list_user_group",
        is_edit : "is_edit_user_group",
        is_delete : "is_delete_user_group",
    },
    {
        name: "user_role",
        title: "User Role",
        switchName: "is_user_role",
        is_create : "is_create_user_role",
        is_list : "is_list_user_role",
        is_edit : "is_edit_user_role",
        is_delete : "is_delete_user_role",
    },
    {
        name: "extension",
        title: "SIP devices",
        switchName: "is_extension",
        is_create : "is_create_extension",
        is_list : "is_list_extension",
        is_edit : "is_edit_extension",
        is_delete : "is_delete_extension",
        is_add : "is_add_extension",
        add_value : "add_extension_value"
    },
];

/* ============================== OUTGOING RULES ============================== */

export const outgoingRulesData: any[] = [
    // export const outgoingRulesData: AdvanceRoleTypes[] = [
    {
        name: "trunk",
        title: "SIP Trunks",
        switchName: "is_trunk",
        is_create : "is_create_trunk",
        is_list : "is_list_trunk",
        is_edit : "is_edit_trunk",
        is_delete : "is_delete_trunk",
    },
    {
        name: "og_rules",
        title: "Outgoing Rules",
        switchName: "is_og_rules",
        is_create : "is_create_og_rules",
        is_list : "is_list_og_rules",
        is_edit : "is_edit_og_rules",
        is_delete : "is_delete_og_rules",
    },
    {
        name: "call_id_group",
        title: "Call ID Groups",
        switchName: "is_call_id_group",
        is_create : "is_create_call_id_group",
        is_list : "is_list_call_id_group",
        is_edit : "is_edit_call_id_group",
        is_delete : "is_delete_call_id_group",
    },
];

/* ============================== ADVANCE PBX ROLES ============================== */

// export const incomingRulesData: AdvanceRoleTypes[] = [
    export const incomingRulesData: any[] = [
    {
        name: "did",
        title: "DIDs",
        switchName: "is_did",
        is_create : "is_create_did",
        is_list : "is_list_did",
        is_edit : "is_edit_did",
        is_delete : "is_delete_did",
    },
    {
        name: "ip_mapping",
        title: "IP Mapping",
        switchName: "is_ip_mapping",
        is_create : "is_create_ip_mapping",
        is_list : "is_list_ip_mapping",
        is_edit : "is_edit_ip_mapping",
        is_delete : "is_delete_ip_mapping",
    },
    {
        name: "click_to_Call",
        title: "Click to Call",
        switchName: "is_click_to_Call",
        is_create : "is_create_click_to_Call",
        is_list : "is_list_click_to_Call",
        is_edit : "is_edit_click_to_Call",
        is_delete : "is_delete_click_to_Call",
    },
    {
        title: "Ring Group",
        name: "rg",
        switchName: "is_rg",
        is_create : "is_create_rg",
        is_list : "is_list_rg",
        is_edit : "is_edit_rg",
        is_delete : "is_delete_rg",
    },
    {
        title: "IVR",
        name: "ivr",
        switchName: "is_ivr",
        is_create : "is_create_ivr",
        is_list : "is_list_ivr",
        is_edit : "is_edit_ivr",
        is_delete : "is_delete_ivr",
    },
    {
        title: "Time Condition",
        name: "tc",
        switchName: "is_tc",
        is_create : "is_create_tc",
        is_list : "is_list_tc",
        is_edit : "is_edit_tc",
        is_delete : "is_delete_tc",
    },
    {
        title: "Conference",
        name: "cf",
        switchName: "is_cf",
        is_create : "is_create_cf",
        is_list : "is_list_cf",
        is_edit : "is_edit_cf",
        is_delete : "is_delete_cf",
    },
    {
        title: "Call Queue",
        name: "cq",
        switchName: "is_cq",
        is_create : "is_create_cq",
        is_list : "is_list_cq",
        is_edit : "is_edit_cq",
        is_delete : "is_delete_cq",
    },
    {
        title: "Feature Code",
        name: "fc",
        switchName: "is_fc",
        is_create : "is_create_fc",
        is_list : "is_list_fc",
        is_edit : "is_edit_fc",
        is_delete : "is_delete_fc",
    },
    {
        title: "Block Inbound Calls",
        name: "block_ic",
        switchName: "is_block_ic",
        is_create : "is_create_block_ic",
        is_list : "is_list_block_ic",
        is_edit : "is_edit_block_ic",
        is_delete : "is_delete_block_ic",
    },
];

/* ============================== LEAD MANAGEMENT ============================== */

// export const leadManagementData: AdvanceRoleTypes[] = [
    export const leadManagementData: any[] = [
    {
        name: "leads",
        title: "Leads",
        switchName: "is_leads",
        is_create : "is_create_leads",
        is_list : "is_list_leads",
        is_edit : "is_edit_leads",
        is_delete : "is_delete_leads",
    },
    {
        name: "lead_group",
        title: "Lead Group",
        switchName: "is_lead_group",
        is_create : "is_create_lead_group",
        is_list : "is_list_lead_group",
        is_edit : "is_edit_lead_group",
        is_delete : "is_delete_lead_group",
    },
    {
        name: "follow_up",
        title: "Follow Up",
        switchName: "is_follow_up",
        is_create : "is_create_follow_up",
        is_list : "is_list_follow_up",
        is_edit : "is_edit_follow_up",
        is_delete : "is_delete_follow_up",
    },
     {
        name: "custom_fields",
        title: "Custom Fields",
        switchName: "is_custom_fields",
        is_create : "is_create_custom_fields",
        is_list : "is_list_custom_fields",
        is_edit : "is_edit_custom_fields",
        is_delete : "is_delete_custom_fields",
    },
];

/* ============================== ADVANCE CALL CENTER ROLES ============================== */

// export const callCenterRoleData: AdvanceRoleTypes[] = [
    export const callCenterRoleData: any[] = [
    {
        title: "Outbound Campaign",
        name: "oc",
        switchName: "is_oc",
        is_create : "is_create_oc",
        is_list : "is_list_oc",
        is_edit : "is_edit_oc",
        is_delete : "is_delete_oc",
        is_add : "is_add_oc",
        add_value : "add_oc_value"
    },
    {
        title: "Inbound Campaign",
        name: "ic",
        switchName: "is_ic",
        is_create : "is_create_ic",
        is_list : "is_list_ic",
        is_edit : "is_edit_ic",
        is_delete : "is_delete_ic",
        is_add : "is_add_ic",
        add_value : "add_ic_value"
    },
    {
        title: "Blended Campaign",
        name: "bc",
        switchName: "is_bc",
        is_create : "is_create_bc",
        is_list : "is_list_bc",
        is_edit : "is_edit_bc",
        is_delete : "is_delete_bc",
        is_add : "is_add_bc",
        add_value : "add_bc_value"
    },
    {
        title: "Disposition",
        name: "td",
        switchName: "is_td",
        is_create : "is_create_td",
        is_list : "is_list_td",
        is_edit : "is_edit_td",
        is_delete : "is_delete_td",
    },
    {
        title: "DNC",
        name: "dnc",
        switchName: "is_dnc",
        is_create : "is_create_dnc",
        is_list : "is_list_dnc",
        is_edit : "is_edit_dnc",
        is_delete : "is_delete_dnc",
    },
        {
        name: "webform",
        title: "Webform",
        switchName: "is_webform",
        is_create : "is_create_webform",
        is_list : "is_list_webform",
        is_edit : "is_edit_webform",
        is_delete : "is_delete_webform",
    }
];

/* ============================== ADVANCE CALL REPORTS ROLES ============================== */

// export const broadcastingData: AdvanceRoleTypes[] = [
    export const broadcastingData: any[] = [
    {
        title: "Voice Broadcast",
        name: "vb",
        switchName: "is_vb",
        is_create : "is_create_vb",
        is_list : "is_list_vb",
        is_edit : "is_edit_vb",
        is_delete : "is_delete_vb",
    },
];

/* ============================== ADVANCE CALL REPORTS ROLES ============================== */

// export const reportsRolesData: AdvanceRoleTypes[] = [
    export const reportsRolesData: any[] = [
    {
        title: "CDRs",
        name: "cdrs",
        switchName: "is_cdrs",
        is_create : "is_create_cdrs",
        is_list : "is_list_cdrs",
        is_edit : "is_edit_cdrs",
        is_delete : "is_delete_cdrs",
    },
    {
        title: "Live Call",
        name: "lc",
        switchName: "is_lc",
        is_create : "is_create_lc",
        is_list : "is_list_lc",
        is_edit : "is_edit_lc",
        is_delete : "is_delete_lc",
    },
    {
        title: "Realtime Reports",
        name: "rr",
        switchName: "is_rr",
        is_create : "is_create_rr",
        is_list : "is_list_rr",
        is_edit : "is_edit_rr",
        is_delete : "is_delete_rr",
    },
    {
        title: "Lead Report",
        name: "lead_report",
        switchName: "is_lead_report",
        is_create : "is_create_lead_report",
        is_list : "is_list_lead_report",
        is_edit : "is_edit_lead_report",
        is_delete : "is_delete_lead_report",
    },
    {
        title: "Campaign Report",
        name: "campaign_report",
        switchName: "is_campaign_report",
        is_create : "is_create_campaign_report",
        is_list : "is_list_campaign_report",
        is_edit : "is_edit_campaign_report",
        is_delete : "is_delete_campaign_report",
    },
    {
        title: "VoiceBroadcast Report",
        name: "voicebroadcast_report",
        switchName: "is_voicebroadcast_report",
        is_create : "is_create_voicebroadcast_report",
        is_list : "is_list_voicebroadcast_report",
        is_edit : "is_edit_voicebroadcast_report",
        is_delete : "is_delete_voicebroadcast_report",
    },
    {
        title: "User Performance",
        name: "up",
        switchName: "is_up",
        is_create : "is_create_up",
        is_list : "is_list_up",
        is_edit : "is_edit_up",
        is_delete : "is_delete_up",
    },
    {
        title: "Voicemail",
        name: "voicemail",
        switchName: "is_voicemail",
        is_create : "is_create_voicemail",
        is_list : "is_list_voicemail",
        is_edit : "is_edit_voicemail",
        is_delete : "is_delete_voicemail",
    },
    {
        title: "Recording",
        name: "recording",
        switchName: "is_recording",
        is_create : "is_create_recording",
        is_list : "is_list_recording",
        is_edit : "is_edit_recording",
        is_delete : "is_delete_recording",
    },
     {
        title: "Missed Call",
        name: "missedcall",
        switchName: "is_missedcall",
        is_create : "is_create_missedcall",
        is_list : "is_list_missedcall",
        is_edit : "is_edit_missedcall",
        is_delete : "is_delete_missedcall",
    },
    {
        title: "Login Logout Report",
        name: "loginLogout",
        switchName: "is_loginLogout",
        is_create : "is_create_loginLogout",
        is_list : "is_list_loginLogout",
        is_edit : "is_edit_loginLogout",
        is_delete : "is_delete_loginLogout",
    },
    {
        title: "Activity Log",
        name: "activity_log",
        switchName: "is_activity_log",
        is_create: "is_create_activity_log",
        is_list: "is_list_activity_log",
        is_edit: "is_edit_activity_log",
        is_delete: "is_delete_activity_log",
    }
];

/* ============================== SETTING DATA  ============================== */

export const settingData: any[] = [
    {
        name: "prompts",
        title: "Audio Prompts",
        switchName: "is_prompts",
        is_create : "is_create_prompts",
        is_list : "is_list_prompts",
        is_edit : "is_edit_prompts",
        is_delete : "is_delete_prompts",
    },
    {
        name: "e_smtp",
        title: "Email SMTP",
        switchName: "is_e_smtp",
        is_create : "is_create_e_smtp",
        is_list : "is_list_e_smtp",
        is_edit : "is_edit_e_smtp",
        is_delete : "is_delete_e_smtp",
    },
        {
        name: "telecomcircle",
        title: "Telecom Circle",
        switchName: "is_telecomcircle",
        is_create : "is_create_telecomcircle",
        is_list : "is_list_telecomcircle",
        is_edit : "is_edit_telecomcircle",
        is_delete : "is_delete_telecomcircle",
    },
    {
        name: "breakcode",
        title: "Break Code",
        switchName: "is_breakcode",
        is_create : "is_create_breakcode",
        is_list : "is_list_breakcode",
        is_edit : "is_edit_breakcode",
        is_delete : "is_delete_breakcode",
    },
    {
        name: "ctc",
        title: "CTC",
        switchName: "is_ctc",
        is_create : "is_create_ctc",
        is_list : "is_list_ctc",
        is_edit : "is_edit_ctc",
        is_delete : "is_delete_ctc",
    },

];

/* ============================== API INTEGRATION DATA ============================== */

export const apiData: any[] = [
     {
        name: "crm",
        title: "Zoho CRM",
        switchName: "is_crm",
        is_create : "is_create_crm",
        is_list : "is_list_crm",
        is_edit : "is_edit_crm",
        is_delete : "is_delete_crm",
    },
    {
        name: "api_key",
        title: "API Key",
        switchName: "is_api_key",
        is_create : "is_create_api_key",
        is_list : "is_list_api_key",
        is_edit : "is_edit_api_key",
        is_delete : "is_delete_api_key",
    },
    {
        name: "webhooks",
        title: "Webhooks",
        switchName: "is_webhooks",
        is_create : "is_create_webhooks",
        is_list : "is_list_webhooks",
        is_edit : "is_edit_webhooks",
        is_delete : "is_delete_webhooks",
    },
];

