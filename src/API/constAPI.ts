// AUTHENTICATION
export const LOGIN = "/login";

// PROFILE
export const SMTP_CONFIGURATION = "/mail-configuration";
export const WEBHOOK = "/profile/web-hook";
export const SMTP_TEST_CONFIGURATION = "/mail-configuration/test-smtp";
export const EMAIL_TEMPLATE = "/email-template";
export const EMAIL_TEMPLATE_SEARCH = "/email-template/advanced-search";
export const EMAIL_CHANNEL = "/email-channel";
export const EMAIL_CHANNEL_SEARCH = "/email-channel/advanced-search";
export const API_CONFIGURATION = "/api-configuration";
export const MESSAGE_CONFIGURATION = "/message-configuration";
// ===================== MASTER ADMIN =====================

// DASHBOARD
export const DASHBOARD = "/dashboard";
export const DASHBOARD_CALL_OVERVIEW = "/dashboard/call-overview";
export const DASHBOARD_FILTER = "/dashboard/filter";

// TENANT
export const TENANT = "/tenant";
export const TENANT_SEARCH = "/tenant/advanced-search";
export const ASSIGN_DID = "/admin-did/assign_tenant";
// Tenant Personalize
export const TENANT_PERSONALIZE = "/tenant/tenantpersonalization";

//DISPOSITION
export const DISPOSITION = "/disposition";
export const DISPOSITION_SEARCH = "/disposition/advanced-search";

// DID - NUMBERS
export const ADMIN_DID = "/admin-did";
export const ADMIN_DID_SEARCH = "/admin-did/advanced-search";
export const ADMIN_DID_IMPORT = "/admin-did/import";

// IP MAPPING
export const ADMIN_IP_MAPPING = "/admin-ip-mapping";
export const ADMIN_IP_MAPPING_SEARCH = "/admin-ip-mapping/advanced-search";

// SIP - PROFILE
export const SIP_PROFILE = "/sip-profile";
export const SIP_PROFILE_SEARCH = "/sip-profile/advanced-search";

// ROLE
export const ROLE = "/role";
export const ROLE_SEARCH = "/role/advanced-search";

// COUNTRY
export const COUNTRY = "/country";
export const COUNTRY_SEARCH = "/country/advanced-search";

// TIME - ZONE
export const TIMEZONE = "/timezone";
export const TIMEZONE_SEARCH = "/timezone/advanced-search";

// TRUNK
export const TRUNK = "/trunk";
export const TRUNK_SEARCH = "/trunk/advanced-search";
export const TRUNK_ASSIGN = "/trunk/assign";

// CDRS
export const CDRS = "/cdrs";
export const CDRS_SEARCH = "/cdrs/advanced-search";
export const CDRS_IVR_GROUP = "/cdrs/ivr-group";
export const CDRS_QUARTELY_ARCHIVED_COLLECTIONS = "/cdrs/quartely-archived-collections";


// LIVE CALL
export const LIVE_CALL = "/live-calls";
export const LIVE_CALL_SEARCH = "/live-calls/advanced-search";

// OUTGOING RULES
export const OUTGOING_RULES = "/outgoing-rules";
export const OUTGOING_RULES_SEARCH = "/outgoing-rules/advanced-search";

// ===================== TENANT ADMIN =====================

// DASHBOARD
export const TENANT_DASHBOARD = "/dashboard/tenant";
export const TENANT_DASHBOARD_CALL_OVERVIEW = "/dashboard/tenant/call-overview";
export const TENANT_DASHBOARD_FILTER = "/dashboard/tenant/filter";
export const TENANT_DASHBOARD_ACCOUNT_DETAILS = "/dashboard/tenant/account-details";
export const TENANT_DASHBOARD_DATA = "/dashboard/tenant/dashboard-data";

// TENANT DISPOSITION
export const TENANT_DISPOSITION = "/disposition";
export const TENANT_DISPOSITION_SEARCH = "/disposition/advanced-search";

//MANAGERS
export const MANAGER = "/manager";
export const MANAGER_SEARCH = "/manager/advanced-search";

// USER
export const USER = "/user";
export const EXTERNAL_USER = "/user/external/details";
export const USER_SEARCH = "/user/advanced-search";
export const USER_RESET = "/user/update-user-auth-status";
export const USER_LOGOUT = "/user/logout";

// SIP - DEVICES
export const SIP_DEVICES = "/extension";
export const SIP_DEVICES_SEARCH = "/extension/advanced-search";

// DID - NUMBERS
export const DID = "/did";
export const DID_SEARCH = "/did/advanced-search";
export const DID_FORWARD = "/did/forward";
export const DID_IMPORT = "/did/import";

// RING - GROUP
export const RING_GROUP = "/ringgroup";
export const RING_GROUP_SEARCH = "/ringgroup/advanced-search";

// IVR
export const IVR = "/ivr";
export const IVR_SEARCH = "/ivr/advanced-search";

// TENANT - ROLE
export const TENANT_ROLE = "tenant-role";
export const TENANT_ROLE_SEARCH = "/tenant-role/advanced-search";

// LIVE CALL
export const MONITORING = "/monitoring";
export const MONITORING_BARGE = "/monitoring/barge";
export const MONITORING_WHISPER = "/monitoring/whisper";

// USER ROLE
export const USER_ROLE = "user-role";
export const USER_ROLE_SEARCH = "/user-role/advanced-search";

// AUDIO - PROMPTS
export const PROMPTS = "/greeting";
export const PROMPTS_SEARCH = "/greeting/advanced-search";
export const PROMPTS_DOWNLOAD = "/greeting/download";

// CALL - QUEUE
export const CALL_QUEUE = "/call-queue";
export const CALL_QUEUE_SEARCH = "/call-queue/advanced-search";

// USER - GROUP
export const USER_GROUP = "/user-group";
export const USER_GROUP_SEARCH = "/user-group/advanced-search";

// MESSAGING - CHANNEL
export const MESSAGING_CHANNEL = "/messaging-channel";
export const MESSAGING_CHANNEL_SEARCH = "/messaging-channel/advanced-search";
export const MESSAGING_CHANNEL_LIST_WHATSAPP = "/messaging-channel/omni_list";
export const MESSAGING_CHANNEL_LIST_SMS = "/messaging-channel/sms_list";

// MESSAGING - QUEUE
export const MESSAGING_QUEUE = "/messaging-queue";
export const MESSAGING_QUEUE_SEARCH = "/messaging-queue/advanced-search";


// TIME - CONDITION
export const TIME_CONDITION = "/timecondition";
export const TIME_CONDITION_SEARCH = "/timecondition/advanced-search";

// TENANT TRUNK
export const TENANT_TRUNK = "/trunk/tenant";
export const TENANT_TRUNK_SEARCH = "/trunk/advanced-search";

// FEATURE - CODE
export const FEATURE_CODE = "/feature-code";

// OUTGOING RULES
export const TENANT_OUTGOING_RULES = "/outgoing-rules";
export const TENANT_OUTGOING_RULES_SEARCH = "/outgoing-rules/advanced-search";

// CONFERENCE
export const CONFERENCE = "/conference";
export const CONFERENCE_SEARCH = "/conference/advanced-search";


// LEAD - MANAGEMENT
export const LEAD_MANAGEMENT = "/lead-management";
export const LEAD_MANAGEMENT_CUSTOM_FIELDS = "/lead-management/custom-field";
export const LEAD_MANAGEMENT_SEARCH = "/lead-management/advanced-search";
export const LEAD_MANAGEMENT_IMPORT_MAPPER = "/lead-management/import/mapper";
export const LEAD_MANAGEMENT_DISTRIBUTION = "/lead-management/distribution";
export const LEAD_MANAGEMENT_BATCH_UPDATE =
    "/lead-management/leads/batch-update";
export const LEAD_MANAGEMENT_IMPORT = "/lead-management/import";
export const LEAD_MANAGEMENT_INFORMATION =
    "/lead-management/leads-with-call-info";
export const NOTES = "/notes";
export const LEAD_MANAGEMENT_CREATE_NEW = "/lead-management/new";
export const LEAD_MANAGEMENT_UPDATE_NEW = "/lead-management/new";

// IP - MAPPING
export const IP_MAPPING = "/ip-mapping";
export const IP_MAPPING_SEARCH = "/ip-mapping/advanced-search";

// INBOUND - CAMPAIGN
export const INBOUND_CAMPAIGN = "/inbound-campaign";
export const INBOUND_CALL_DEBUG_SNAPSHOT = "/inbound-call-debug/snapshot";
export const INBOUND_CALL_DEBUG_FORM_OPTIONS = "/inbound-call-debug/form-options";
export const INBOUND_CAMPAIGN_SEARCH = "/inbound-campaign/advanced-search";
export const INBOUND_CAMPAIGN_PRESET = "";
export const INBOUND_CAMPAIGN_PRESET_ADD = "/preset/create";
export const INBOUND_CAMPAIGN_PRESET_DELETE = "/preset";
export const INBOUND_CAMPAIGN_PRESET_UPDATE = "/preset";
export const INBOUND_CAMPAIGN_PRESET_GET = "/preset/edit";
export const INBOUND_CAMPAIGN_HANGUP_ADD = "/inbound-campaign/disposition";
export const INBOUND_CAMPAIGN_HANGUP_GET = "/inbound-campaign/disposition";
export const INBOUND_CAMPAIGN_HANGUP_DELETE = "/inbound-campaign/inbound-campaign-disposition"; "inbound-campaign-disposition/:uuid"


// OUTBOUND - CAMPAIGN
export const OUTBOUND_CAMPAIGN = "/outbound-campaign";
export const OUTBOUND_CAMPAIGN_DIALABLE = "/outbound-campaign/dailable";
export const OUTBOUND_CAMPAIGN_SEARCH = "/outbound-campaign/advanced-search";
export const OUTBOUND_CAMPAIGN_DIALABLE_TABLE =
    "/outbound-campaign/dialable/list/all";
export const OUTBOUND_CAMPAIGN_DIALABLE_TABLE_ADD =
    "/outbound-campaign/add-dialable";
export const OUTBOUND_CAMPAIGN_ADD_HANGUP = "/outbound-campaign/disposition";
export const OUTBOUND_CAMPAIGN_LEAD_RESET = "/outbound-campaign/lead-reset";
export const OUTBOUND_CAMPAIGN_LEAD_CHURNING_DATA = "/outbound-campaign/lead-churning-data";
export const OUTBOUND_CAMPAIGN_HNAGUP_ADD = "/outbound-campaign/disposition";
export const OUTBOUND_CAMPAIGN_HANGUP_DELETE =
    "/outbound-campaign/outbound-campaign-disposition";
export const OUTBOUND_CAMPAIGN_LEAD_GROUP_DELETE =
    "/outbound-campaign/update-lead-group";
export const OUTBOUND_CAMPAIGN_PRESET = "";
export const OUTBOUND_CAMPAIGN_PRESET_ADD = "/preset/create";
export const OUTBOUND_CAMPAIGN_PRESET_DELETE = "/preset";
export const OUTBOUND_CAMPAIGN_PRESET_UPDATE = "/preset";
export const OUTBOUND_CAMPAIGN_PRESET_GET = "/preset/edit";

// BLENDED - CAMPAIGN
// export const BLENDED_CAMPAIGN = "/blended-campaign";
// export const BLENDED_CAMPAIGN_SEARCH = "/blended-campaign/advanced-search";
export const BLENDED_CAMPAIGN = "/blended-campaign";
export const BLENDED_CAMPAIGN_DIALABLE = "/blended-campaign/dailable";
export const BLENDED_CAMPAIGN_SEARCH = "/blended-campaign/advanced-search";
export const BLENDED_CAMPAIGN_DIALABLE_TABLE =
    "/blended-campaign/dialable/list/all";
export const BLENDED_CAMPAIGN_DIALABLE_TABLE_ADD =
    "/blended-campaign/add-dialable";
export const BLENDED_CAMPAIGN_ADD_HANGUP = "/blended-campaign/disposition";
export const BLENDED_CAMPAIGN_LEAD_RESET = "/blended-campaign/lead-reset";
export const BLENDED_CAMPAIGN_LEAD_CHURNING_DATA = "/blended-campaign/lead-churning-data";
export const BLENDED_CAMPAIGN_HNAGUP_ADD = "/blended-campaign/disposition";
export const BLENDED_CAMPAIGN_HANGUP_DELETE =
    "/blended-campaign/blended-campaign-disposition";
export const BLENDED_CAMPAIGN_LEAD_GROUP_DELETE =
    "/blended-campaign/update-lead-group";
export const BLENDED_CAMPAIGN_PRESET = "";
export const BLENDED_CAMPAIGN_PRESET_ADD = "/preset/create";
export const BLENDED_CAMPAIGN_PRESET_DELETE = "/preset";
export const BLENDED_CAMPAIGN_PRESET_UPDATE = "/preset";
export const BLENDED_CAMPAIGN_PRESET_GET = "/preset/edit";

// DNC
export const DNC = "/dnc";
export const DNC_SEARCH = "/dnc/advanced-search";
export const DNC_IMPORT = "/dnc/import";

// STATE
export const STATE = "/state";
export const STATE_SEARCH = "/state/advanced-search";
export const UPDATE_BY_STATUS = "/state/update-by-status";
export const STATE_IMPORT = "/state/import";

// AREA - CODE
export const AREA_CODE = "/area-code";
export const AREA_CODE_SEARCH = "/area-code/advanced-search";
export const AREA_CODE_IMPORT = "/area-code/import";
export const UPDATE_BY_AREACODE = "/area-code/update-by-status";

// RECORDING
export const RECORDING = "/recordings";
export const RECORDING_SEARCH = "/recordings/advanced-search";

// VOICE - MAIL
export const VOICE_MAIL = "voicemail/voicemail-report";
export const VOICE_MAIL_SEARCH = "voicemail/voicemail-report/advanced-search";



// LEAD - GROUP
export const LEAD_GROUP = "lead-group";
export const LEAD_GROUP_CAMPAIGN_LIST = "lead-group/campaign/list";
export const LEAD_GROUP_SEARCH = "lead-group/advanced-search";
export const LEAD_GROUP_REMOVE_QUEUE = "/outbound-campaign/remove-queues";
export const BLENDED_CAMPAIGN_REMOVE_QUEUE = "/blended-campaign/remove-queues";
export const DELETE_ALL_LEADS = "/lead-group/all-leads";
export const LEAD_GROUP_EXPORT_USER_INFO = "/lead-group/export-user-info";
export const LEAD_GROUP_DOWNLOAD_LEADS = "lead-group/download/leads";

// CALLER - ID - GROUP
export const CALLER_ID_GROUP = "caller-id-group";
export const CALLER_ID_GROUP_ADD = "caller-id-group/add";
export const CALLER_ID_GROUP_IMPORT = "caller-id-group/import";
export const CALLER_ID_GROUP_SEARCH = "caller-id-group/advanced-search";

// CALLER - ID - GROUP
export const USER_PERFORMANCE = "user-performance";
export const USER_PERFORMANCE_SEARCH = "user-performance/advanced-search";

// FOLLOW UP
export const FOLLOW_UP = "/follow-up";
export const FOLLOW_UP_SEARCH = "/follow-up/advanced-search";

// REALTIME REPORT
export const REALTIME_REPORT = "/tenant/realtime-report/agents";
export const REALTIME_REPORT_SEARCH = "/tenant/realtime-report/advanced-search";
export const CAMPAIGN = "/agent-call-center/campaign";
export const ADMIN_LOGOUT = "/agent-call-center/agent-admin-logout";
export const CALL_PAUSE = "/tenant/realtime-report/call-pause";
export const AGENT_STATE = "/tenant/agent-state";
export const REALTIME_REPORT_UPDATE = "/outbound-campaign/outbound-campaign-dial";

// CLICK TO CALL
export const CLICK_TO_CALL = "/click-to-call";
export const CLICK_TO_CALL_SEARCH = "/click-to-call/advanced-search";
export const CLICK_TO_CALL_FORWARD = "/click-to-call/forward";

// BLOCK INBOUND CAMPAIGN
export const BLOCK_INBOUND_CAMPAIGN = "/block-inbound-campaign";
export const BLOCK_INBOUND_CAMPAIGN_SEARCH =
    "/block-inbound-campaign/advanced-search";
export const BLOCK_INBOUND_CAMPAIGN_IMPORT = "block-inbound-campaign/import";

// USER PERFORMANCE REPORT
export const USER_PERFORMANCE_REPORT = "/user-performance-report";
export const USER_PERFORMANCE_REPORT_SEARCH =
    "/user-performance-report/user-performance-report-search";

// VOICE BROADCAST
export const VOICE_BROADCAST = "/voice-broadcast";
export const VOICE_BROADCAST_SEARCH = "/voice-broadcast/advanced-search";
export const LEAD_GROUP_LIST = "/voice-broadcast/list/lead-group";
export const LEAD_GROUP_DELETE = "/voice-broadcast/lead-group";
export const VOICE_BROADCAST_RESET_LEAD = "/voice-broadcast/reset-leads";
export const VOICE_BROADCAST_FEATURE = "/voice-broadcast/broadcast";

// LEAD REPORT
export const LEAD_REPORT = "/lead_report";
export const LEAD_REPORT_SEARCH = "/lead_report/advanced-search";

// TENANT REPORT
export const TENANT_REPORT = "/tenant_report";
export const TENANT_REPORT_SEARCH = "/tenant_report/tenant_report_search";
export const TENANT_CHECK_FLAG = "/tenant_report/check/flag-status";

// CAMPAIGN REPORT
export const CAMPAIGN_REPORT = "/campaign-report";
export const CAMPAIGN_REPORT_SEARCH = "/campaign-report/campaign-report-search";
export const ALL_CAMPAIGN = "/agent-call-center/campaign";

// VOICE BROADCAST REPORT
export const VOICE_BROADCAST_DETAILS = "/voicebroadcast_details";
export const VOICE_BROADCAST_SINGLE_DETAILS = "/voicebroadcast_details/survey";
export const VOICE_BROADCAST_DETAILS_SEARCH =
    "/voicebroadcast_details/advanced-search";

// MANAGER ROLE
export const MANAGER_ROLE = "/manager-role";
export const MANAGER_ROLE_SEARCH = "/manager-role/advanced-search";

// PBX LEAD STATUS
export const PBX_LEAD_STATUS = "/pbx-lead-status";
export const PBX_LEAD_STATUS_SEARCH = "/pbx-lead-status/advanced-search";


//BREAKCODE
export const BREAK_CODE = "/breakcode";
export const BREAK_CODE_SEARCH = "/breakcode/advanced-search";

//TELECOM CIRCLE
export const TELECOM_CIRCLE = "/telecomcircle";
export const TELECOM_CIRCLE_SEARCH = "/telecomcircle/advanced-search";
export const TELECOM_CIRCLE_IMPORT = "/telecomcircle/import";

// MISSED CALL REPORT
export const MISSED_CALL_REPORT = "/missed-call-report";
export const MISSED_CALL_REPORT_SEARCH = "/missed-call-report/advanced-search";

// CALL QUEUE REPORT
export const CALL_QUEUE_REPORT = "/call-queue-report";
export const CALL_QUEUE_REPORT_SEARCH = "/call-queue-report/advanced-search";

// DROPPED CALLS REPORT
export const DROPPED_CALLS_REPORT = "/dropped-calls-report";
export const DROPPED_CALLS_REPORT_SEARCH = "/dropped-calls-report/advanced-search";

// LoginLogout REPORT
export const LOGIN_LOGOUT_REPORT = "/login-logout-report";
export const LOGIN_LOGOUT_REPORT_SEARCH = "/login-logout-report/advanced-search";
export const LOGIN_LOGOUT_SINGLE_DETAILS = "/login-logout-report/entries";
export const LOGIN_LOGOUT_EXPORT = "/login-logout-report/export";

//CSAT Report
export const CSAT_REPORT ="/cdrs/advanced-csat-search"


// WEB FORM
export const WEB_FORM = "/webform";
export const WEB_FORM_SEARCH = "/webform/advanced-search";

// CUSTOM FIELDS
export const CUSTOM_FIELDS = "/custom-fields";
export const CUSTOM_FIELDS_SEARCH = "/custom-fields/advanced-search";

//STICKY AGENT REPORT
export const STICKY_AGENT_REPORT = "/sticky-agent-report";
export const STICKY_AGENT_REPORT_SEARCH = "/sticky-agent-report/advanced-search";

// DID REPORT
export const DID_REPORT = "/did";
export const DID_REPORT_SEARCH = "/did/advanced-search";

// OMNI CHANNEL REPORT
export const OMNI_CHANNELO_REPORT="/omni-channel-report"
export const OMNI_CHANNELO_REPORT_SEARCH="/omni-channel-report/omni-channel-report-search"
// REQUEST SCHEDULER
export const REQUEST_SCHEDULER = "/request-scheduler";
export const REQUEST_SCHEDULER_CREATE = "/request-scheduler/create";
export const REQUEST_SCHEDULER_DELETE = "/request-scheduler/delete";

// ACTIVITY LOG
export const ACTIVITY_LOG = "/activity-log";

// REALTIME DASHBOARD - LEAD GROUP
export const REALTIME_DASHBOARD_LEAD_GROUP_STATS = "/realtime-dashboard/lead-group-stats";
