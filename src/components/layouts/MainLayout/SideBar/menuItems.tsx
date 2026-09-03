// TYPES
import { NavItemsTypes } from "@/types/menuItemTypes";

/* ============================== MENU ITEMS ============================== */

export const masterAdmin: NavItemsTypes[] = [
    {
        id: "dashboard",
        icon: "Dashboard",
        iconActive: "HomeGreen",
        title: "Dashboard",
        url: "/dashboard",
    },
    {
        id: "tenant",
        icon: "houseowner",
        iconActive: "houseowner",
        title: "Tenant",
        url: "",
        subItems: [
            {
                id: "tenants",
                title: "Tenants",
                icon: "lender",
                url: "/tenants",
            },
            {
                id: "tenant-roles",
                title: "Tenant Roles",
                icon: "UserRoles",
                url: "/tenant-roles",
            },
        ],
    },
    {
        id: "outgoing",
        icon: "OutgoingRules",
        iconActive: "CallOutgoingGreen",
        title: "Outgoing Rules",
        url: "",
        subItems: [
            {
                id: "sip-trunk",
                title: "SIP Trunks",
                icon: "SIPTrunk",
                url: "/sip-trunk",
            },
            {
                id: "outgoing-rules",
                title: "Outgoing Rules",
                icon: "OutgoingRules",
                url: "/outgoing-rules",
            },
        ],
    },
    {
        id: "incoming",
        icon: "IncomingRules",
        iconActive: "CallIncomingGreen",
        title: "Incoming Rules",
        url: "",
        subItems: [
            {
                id: "did",
                title: "DID",
                icon: "DIDNumber",
                url: "/did",
            },
            {
                id: "ip-mapping",
                title: "IP Mapping",
                icon: "IPMaping",
                url: "/ip-mapping",
            },
        ],
    },
    {
        id: "activity-log",
        title: "Activity Log",
        name: "activity_log",
        icon: "Report",
        iconActive: "NotesGreen",
        url: "/activity-log",
    },
    {
        id: "monitoring",
        title: "Monitoring",
        icon: "MonitorDarkGray",
        iconActive: "MonitorDarkGray",
        url: "/monitoring",
    },
    {
        id: "reports",
        icon: "Report",
        iconActive: "NotesGreen",
        title: "Reports",
        url: "/tenant-report",
        // url: "/tenant-admin/reports",
    },
    {
        id: "settings",
        icon: "Settings",
        iconActive: "SettingGreen",
        title: "Settings",
        url: "",
        subItems: [
            {
                id: "sip-profile",
                title: "SIP Profile",
                icon: "Sipprofile",
                url: "/sip-profile",
            },
            {
                id: "time-zone",
                title: "Time Zone",
                icon: "Time12",
                url: "/time-zone",
            },
            {
                id: "country",
                title: "Country",
                icon: "Globe",
                url: "/country",
            },
            {
                id: "email-settings",
                title: "Email Settings",
                icon: "Emailsetting",
                url: "/email-settings",
            },
            // {
            //     id: "backup-recovery",
            //     title: "Backup and Recovery",
            //     url: "/backup-recovery",
            // },
            // {
            //     id: "license",
            //     title: "License",
            //     url: "/license",
            // },
            {
                id: "system-disposition",
                title: "System Dispositions",
                icon: "SystemDisposition",
                url: "/system-disposition",
            },
            // {
            //     id: "security",
            //     title: "Security",
            //     url: "/security",
            // },
            // {
            //     id: "archive",
            //     title: "Archive",
            //     url: "/archive",
            // },
        ],
    },
];

export const masterAdminUrls = [
    "/dashboard",
    "/tenants",
    "/tenant-roles",
    "/sip-trunk",
    "/outgoing-rules",
    "/did",
    "/ip-mapping",
    "/cdrs",
    "/live-call",
    "/tenant-report",
    "/sip-profile",
    "/time-zone",
    "/country",
    "/email-settings",
    // "/backup-recovery",
    // "/license",
    "/system-disposition",
    //"/security",
    //"/archive",
    "/activity-log",
    "/profile",
];

export const masterAdminTitles = [
    { url: "/dashboard", title: "Dashboard" },
    { url: "/tenants", title: "Tenants" },
    { url: "/tenant-roles", title: "Tenant Roles" },
    { url: "/sip-trunk", title: "SIP Trunks" },
    { url: "/outgoing-rules", title: "Outgoing Rules" },
    { url: "/did", title: "DID" },
    { url: "/ip-mapping", title: "IP Mapping" },
    { url: "/cdrs", title: "CDRs" },
    { url: "/live-call", title: "Live Calls" },
    { url: "/tenant-report", title: "Tenant Report" },
    { url: "/sip-profile", title: "SIP Profile" },
    { url: "/time-zone", title: "Time Zone" },
    { url: "/country", title: "Country" },
    { url: "/email-settings", title: "Email Settings" },
    // { url: "/backup-recovery", title: "Backup and Recovery" },
    // { url: "/license", title: "License" },
    { url: "/system-disposition", title: "System Dispositions" },
    // { url: "/security", title: "Security" },
    // { url: "/archive", title: "Archive" },
    { url: "/activity-log", title: "Activity Log" },
    { url: "/profile", title: "Profile" },
];

export const tenantAdmin: NavItemsTypes[] = [
    {
        id: "tenant-dashboard",
        icon: "Dashboard",
        iconActive: "HomeGreen",
        title: "Dashboard",
        url: "",
        subItems: [
            {
                id: "tenant-normal-dashboard",
                title: "Dashboard",
                icon: "Dashboard",
                url: "/tenant-dashboard",
                iconActive: "HomeGreen",
            },
            {
                id: "tenant-account-dashboard",
                title: "Account Dashboard",
                icon: "Dashboard",
                url: "/tenant-account-dashboard",
                iconActive: "HomeGreen",
            },
            {
                id: "tenant-realtime-dashboard",
                title: "Realtime Dashboard",
                icon: "Dashboard",
                url: "/tenant-realtime-dashboard",
                iconActive: "HomeGreen",
            },
        ],
    },
    {
        id: "tenant-manager-role",
        icon: "TenantManager",
        iconActive: "ManagerGreen",
        title: "Managers",
        url: "",
        subItems: [
            {
                id: "tenant-role-manager",
                title: "Manager Role",
                icon: "ManagerRole",
                url: "/tenant-role-manager",
                iconActive: "ManagerGreen",
            },
            {
                id: "tenant-manager",
                icon: "ManagerTenant",
                iconActive: "ManagerGreen",
                title: "Manager",
                url: "/tenant-manager",
            },
        ],
    },
    {
        id: "tenant-users",
        name: "users",
        icon: "UserGroup",
        iconActive: "UserGreen",
        title: "Users",
        url: "",
        subItems: [
            {
                id: "tenant-user",
                icon: "UserGray",
                name: "user",
                title: "User",
                url: "/tenant-user",
            },
            {
                id: "tenant-group-user",
                icon: "UserGroup",
                name: "user_group",
                title: "User Group",
                url: "/tenant-group-user",
            },
            {
                id: "tenant-role-user",
                icon: "UserRoles",
                name: "user_role",
                title: "User Role",
                url: "/tenant-role-user",
            },
            {
                id: "tenant-sip-devices",
                icon: "SipDevices",
                name: "extension",
                title: "SIP Devices",
                url: "/tenant-sip-devices",
            },
        ],
    },
    {
        id: "tenant-outgoing-rules",
        name: "outgoing_rules",
        icon: "OutgoingRules",
        iconActive: "CallOutgoingGreen",
        title: "Outgoing Rules",
        url: "/tenant-outgoing-rules",
        subItems: [
            {
                id: "tenant-sip-trunk",
                icon: "SIPTrunk",
                name: "trunk",
                title: "SIP Trunks",
                url: "/tenant-sip-trunk",
            },
            {
                id: "tenant-outgoing-rules",
                icon: "OutgoingRules",
                name: "og_rules",
                title: "Outgoing Rules",
                url: "/tenant-outgoing-rules",
            },
            {
                id: "tenant-call-id-group",
                icon: "CallerIdGroup",
                name: "call_id_group",
                title: "Caller-ID Groups",
                url: "/tenant-call-id-group",
            },
        ],
    },
    {
        id: "incoming-rules",
        name: "incoming_rules",
        icon: "IncomingRules",
        iconActive: "CallIncomingGreen",
        title: "Incoming Rules",
        url: "",
        subItems: [
            {
                id: "tenant-did",
                name: "did",
                icon: "DIDNumber",
                title: "DIDs",
                url: "/tenant-did",
            },
            {
                id: "tenant-ip-mapping",
                icon: "IPMaping",
                name: "ip_mapping",
                title: "IP Mapping",
                url: "/tenant-ip-mapping",
            },
            {
                id: "tenant-click-to-call",
                icon: "ClicktoCall",
                name: "click_to_Call",
                title: "Click to Call",
                url: "/tenant-click-to-call",
            },
            {
                id: "tenant-ring-group",
                icon: "RingGroup",
                name: "rg",
                title: "Ring Group",
                url: "/tenant-ring-group",
            },
            {
                id: "tenant-ivr",
                icon: "AllowedTransferIVR",
                name: "ivr",
                title: "IVR",
                url: "/tenant-ivr",
            },
            {
                id: "tenant-time-condition",
                icon: "TimeCondition",
                name: "tc",
                title: "Time Condition",
                url: "/tenant-time-condition",
            },
            {
                id: "tenant-conference",
                icon: "Conference",
                name: "cf",
                title: "Conference",
                url: "/tenant-conference",
            },
            {
                id: "tenant-call-queue",
                icon: "AllowedCallQueue",
                name: "cq",
                title: "Call Queue",
                url: "/tenant-call-queue",
            },
            // {
            //     id: "tenant-feature-code",
            //     icon: "FeatureCode",
            //     name: "fc",
            //     title: "Feature Codes",
            //     url: "/tenant-feature-code",
            // },
            {
                id: "tenant-block-inbound-call",
                icon: "BlockInboundCalls",
                name: "block_ic",
                title: "Block Inbound Calls",
                url: "/tenant-block-inbound-call",
            },
        ],
    },
    {
        id: "tenant-lead-management",
        name: "lead_management",
        icon: "ManagementLead",
        iconActive: "LeadManagementGreen",
        title: "Lead Management",
        url: "",
        subItems: [
            {
                id: "tenant-leads",
                icon: "Lead",
                name: "leads",
                title: "Leads",
                url: "/tenant-leads",
            },
            {
                id: "tenant-lead-group",
                icon: "LeadGroup1",
                name: "lead_group",
                title: "Lead Group",
                url: "/tenant-lead-group",
            },
            {
                id: "tenant-follow-up",
                icon: "Followup",
                name: "follow_up",
                title: "Follow Up",
                url: "/tenant-follow-up",
            },
            {
                id: "tenant-custom-fields",
                name: "custom_fields",
                title: "Custom Fields",
                icon: "custom1",
                url: "/tenant-custom-fields",
            },
            {
                id: "tenant-lead-churning",
                name: "lead_churning",
                title: "Lead Churning",
                icon: "RefreshCircle",
                url: "/tenant-lead-churning",
            },
        ],
    },
    {
        id: "tenant-call-center",
        icon: "ContentCenter",
        iconActive: "AudioGreen",
        title: "Contact Center",
        url: "",
        name: "call_center",
        subItems: [
            {
                id: "tenant-inbound-campaign",
                name: "ic",
                title: "Inbound Campaign",
                icon: "IncomingRules",
                url: "/tenant-inbound-campaign",
            },
            {
                id: "tenant-outbound-campaign",
                name: "oc",
                title: "Outbound Campaign",
                icon: "OutgoingRules",
                url: "/tenant-outbound-campaign",
            },
            {
                id: "tenant-blended-campaign",
                name: "bc",
                icon: "BlendedCampaign",
                title: "Blended Campaign",
                url: "/tenant-blended-campaign",
            },
            {
                id: "tenant-disposition",
                name: "td",
                title: "Dispositions",
                icon: "Dispositions",
                url: "/tenant-disposition",
            },
            {
                id: "tenant-dnc",
                name: "dnc",
                title: "DNC",
                icon: "DNC",
                url: "/tenant-dnc",
            },
            // {
            //     id: "manage-state",
            //     name: "state",
            //     title: "State",
            //     icon:"Address",
            //     url: "/manage-state",
            // },
            // {
            //     id: "manage-area-code",
            //     name: "areacode",
            //     title: "Area Code",
            //     icon:"AreaCode",
            //     url: "/manage-area-code",
            // },
            // {
            //     id: "tenant-webform",
            //     name: "webform",
            //     title: "Webform",
            //     icon:"Webform",
            //     url: "/tenant-webform",
            // },
        ],
    },
    {
        id: "tenant-broadcasting",
        icon: "BroadCasting",
        iconActive: "BroadcastGreen",
        title: "Broadcasting",
        url: "",
        name: "broadcasting",
        subItems: [
            {
                id: "tenant-voice-broadcast",
                name: "vb",
                title: "Voice Broadcasting",
                icon: "Voicebroadcasting",
                url: "/tenant-voice-broadcast",
            },
        ],
    },
    {
        id: "tenant-messaging",
        icon: "Message",
        iconActive: "MessagingGreen",
        title: "Messaging",
        url: "",
        name: "messaging",
        subItems: [
            {
                id: "tenant-messaging-channel",
                name: "messaging_channel",
                title: "Messaging Channel",
                icon: "MessagingChannel",
                url: "/tenant-messaging-channel",
            },
            {
                id: "tenant-messaging-queue",
                name: "messaging_queue",
                title: "Messaging Queue",
                icon: "MessagingQueue",
                url: "/tenant-messaging-queue",
            },
        ],
    },
    {
        id: "tenant-email",
        icon: "Emailsetting",
        iconActive: "SettingGreen",
        title: "Notification",
        url: "",
        name: "email",
        subItems: [
            {
                id: "tenant-email-configs",
                name: "email_configs",
                title: "Notification Configs",
                icon: "EmailGray",
                url: "/tenant-email-configs",
            },
            {
                id: "tenant-email-templates",
                name: "email_templates",
                title: "Email Templates",
                icon: "DocumentText",
                url: "/tenant-email-templates",
            },
        ],
    },
    {
        id: "tenant-activity-log",
        name: "activity_log",
        title: "Activity Log",
        icon: "Report",
        iconActive: "NotesGreen",
        url: "/tenant-activity-log",
    },
    {
        id: "tenant-reports",
        name: "reports",
        icon: "Report",
        iconActive: "NotesGreen",
        title: "Reports",
        url: "/reports",
    },

    {
        id: "tenant-recordings",
        icon: "Recording",
        iconActive: "HomeGreen",
        title: "Recording",
        url: "/tenant-recording",
    },
    {
        id: "tenant-report-scheduling",
        icon: "Report",
        iconActive: "NotesGreen",
        title: "Report Scheduling",
        url: "",
        name: "report_scheduling",
        subItems: [
            {
                id: "tenant-cdrs-report",
                name: "cdrs_report",
                title: "CDR Report",
                icon: "Report",
                url: "/tenant-report-scheduling",
            },
            {
                id: "tenant-mail-schedule",
                name: "mail_schedule",
                title: "Mail Schedule",
                icon: "Report",
                url: "/tenant-mail-schedule",
            },
        ],
    },
    {
        id: "tenant-plugins",
        icon: "Plugins",
        iconActive: "Plugins",
        title: "Plugins",
        url: "",
        name: "plugins",
        subItems: [
            {
                id: "tenant-google-sheet",
                name: "google_sheet",
                title: "Google Sheet",
                icon: "googlesheet" as any,
                url: "/tenant-google-sheet",
            },
            {
                id: "Googledrive",
                name: "google_drive",
                title: "Google Drive",
                icon: "Googledrive",
                iconActive: "Googledrive",
                url: "/tenant-google-drive",
            },
        ],
    },
    {
        id: "settings",
        icon: "Settings",
        iconActive: "SettingGreen",
        title: "Settings",
        name: "settings",
        url: "",
        subItems: [
            {
                id: "tenant-audio-prompts",
                name: "prompts",
                title: "Audio Prompts",
                icon: "Audioprompt",
                url: "/tenant-audio-prompts",
            },
            // {
            //     id: "tenant-email-smtp",
            //     name: "e_smtp",
            //     title: "Email SMTP",
            //     icon: "GrayEmail",
            //     url: "/tenant-email-smtp",
            // },
            // {
            //     id: "tenant-lead-status",
            //     title: "Lead Status",
            //     icon: "Lead1",
            //     url: "/tenant-lead-status",
            // },
            // {
            //     id: "tenant-telecomcircle",
            //     name: "telecomcircle",
            //     title: "Telecom Circle",
            //     icon: "Telecomcircle",
            //     url: "/tenant-telecomcircle",
            // },
            {
                id: "tenant-breakcode",
                name: "breakcode",
                title: "Break Codes",
                icon: "breakcode1",
                url: "/tenant-breakcode",
            },

        ],
    },
    {
        id: "api",
        icon: "Integrations",
        iconActive: "IntegrationGreen",
        title: "Integration",
        name: "api",
        url: "",
        subItems: [
            // {
            //     id: "tenant-crm",
            //     name: "crm",
            //     title: "CRM",
            //     url: "/tenant-crm",
            // },
            // {
            //     id: "tenant-api-key",
            //     name: "api_key",
            //     title: "API Key",
            //     url: "/tenant-api-key",
            // },
            {
                id: "tenant-webhooks",
                name: "webhooks",
                title: "Webhooks",
                icon: "WebhookFill",
                url: "/tenant-webhooks",
            },
            {
                id: "tenant-webhooks-logs",
                name: "webhooks",
                title: "Webhook Logs",
                icon: "WebhookFill",
                url: "/tenant-webhooks/logs",
            },
        ],
    },

];

export const tenantAdminUrls = [
    "/tenant-dashboard",

    // manager role
    "/tenant-role-manager",
    "/tenant-manager",

    // users
    "/tenant-user",
    "/tenant-group-user",
    "/tenant-role-user",
    "/tenant-sip-devices",

    // Outgoing Rules
    "/tenant-sip-trunk",
    "/tenant-outgoing-rules",
    "/tenant-call-id-group",

    // Incoming Rules
    "/tenant-did",
    "/tenant-ip-mapping",
    "/tenant-click-to-call",
    "/tenant-ring-group",
    "/tenant-ivr",
    "/tenant-time-condition",
    "/tenant-conference",
    "/tenant-call-queue",
    // "/tenant-feature-code",
    "/tenant-block-inbound-call",

    // Lead Management
    "/tenant-leads",
    "/tenant-lead-group",
    "/tenant-follow-up",
    "/tenant-custom-fields",
    "/tenant-lead-churning",

    // Call Center
    "/tenant-inbound-campaign",
    "/tenant-outbound-campaign",
    "/tenant-blended-campaign",
    "/tenant-disposition",
    "/tenant-dnc",
    // "/manage-state",
    // "/manage-area-code",
    // "/tenant-webform",

    // Broadcasting
    "/tenant-voice-broadcast",

    // Messaging
    // "/tenant-messaging-channel",
    // "/tenant-messaging-queue",



    // reports
    "/tenant-cdrs",
    "/tenant-live-call",
    "/tenant-missedcall",
    "/tenant-realtime-report",
    "/tenant-lead-report",
    "/tenant-campaign-report",
    "/tenant-voiceBroadcast-report",
    "/tenant-user-performance",
    "/tenant-loginLogout",
    "/tenant-voicemail",
    "/tenant-sticky-agent-report",
    "/tenant-recording",
    "/tenant-dropped-calls",
    "/tenant-call-queue",
    "/tenant-activity-log",



    // Settings
    "/tenant-audio-prompts",
    "/tenant-audio-prompts/edit/[id]",
    // "/tenant-email-smtp",
    // "/tenant-lead-status",
    // "/tenant-telecomcircle",
    "/tenant-breakcode",

    // plugins
    "/tenant-google-drive",
    "/tenant-google-sheet",

    // Report Scheduling
    "/tenant-report-scheduling",





    // API Integrations
    "/tenant-webhooks",

    // "/tenant-crm",
    // "/tenant-api-key",
    // "/tenant-wedhooks",
    // "/tenant-profile",



];

export const tenantAdminTitles = [
    { url: "/tenant-dashboard", title: "Dashboard" },

    // Manager Role Section
    { url: "/tenant-role-manager", title: "Manager Role" },
    { url: "/tenant-manager", title: "Manager" },

    // users
    { url: "/tenant-user", title: "User", name: "user" },
    { url: "/tenant-group-user", title: "User Group", name: "user_group" },
    { url: "/tenant-role-user", title: "User Role", name: "user_role" },
    { url: "/tenant-sip-devices", title: "SIP Devices", name: "extension" },

    // Outgoing Rules
    { url: "/tenant-sip-trunk", title: "Trunk", name: "trunk" },
    { url: "/tenant-outgoing-rules", title: "Outgoing Rules", name: "og_rules" },
    {
        url: "/tenant-call-id-group",
        title: "Call ID Group",
        name: "call_id_group",
    },

    // Incoming Rules
    { url: "/tenant-did", title: "DID", name: "did" },
    { url: "/tenant-ip-mapping", title: "IP Mapping", name: "ip_mapping" },
    {
        url: "/tenant-click-to-call",
        title: "Click to call",
        name: "click_to_Call",
    },
    { url: "/tenant-ring-group", title: "Ring Group", name: "rg" },
    { url: "/tenant-ivr", title: "IVR", name: "ivr" },
    { url: "/tenant-time-condition", title: "Time Condition", name: "tc" },
    { url: "/tenant-conference", title: "Conference", name: "cf" },
    { url: "/tenant-call-queue", title: "Call Queue", name: "cq" },
    // { url: "/tenant-feature-code", title: "Feature Codes", name: "fc" },
    {
        url: "/tenant-block-inbound-call",
        title: "Block Inbound Calls",
        name: "block_ic",
    },

    // Lead Management
    { url: "/tenant-leads", title: "Leads", name: "leads" },
    { url: "/tenant-lead-group", title: "Lead Group", name: "lead_group" },
    { url: "/tenant-follow-up", title: "Follow Up", name: "follow_up" },
    { url: "/tenant-custom-fields", title: "Custom Fields", name: "custom_fields" },
    { url: "/tenant-lead-churning", title: "Lead Churning", name: "lead_churning" },

    // Contact Center
    { url: "/tenant-inbound-campaign", title: "Inbound Campaign", name: "ic" },
    { url: "/tenant-outbound-campaign", title: "Outbound Campaign", name: "oc" },
    { url: "/tenant-blended-campaign", title: "Blended Campaign", name: "bc" },
    { url: "/tenant-disposition", title: "Dispositions", name: "td" },
    { url: "/tenant-dnc", title: "DNC", name: "dnc" },
    // { url: "/manage-state", title: "State", name: "state" },
    // { url: "/manage-area-code", title: "Area Code", name: "areacode" },
    // { url: "/tenant-webform", title: "Webform", name: "webform" },

    // Broadcasting
    { url: " /tenant-voice-broadcast", title: "Voice Broadcast", name: "vb" },

    // Messaging
    // { url: "/tenant-messaging-channel", title: "Messaging Channel", name: "messaging_channel" },
    // { url: "/tenant-messaging-queue", title: "Messaging Queue", name: "messaging_queue" },

    { url: "/tenant-email-configs", title: "Notification Configs", name: "email_configs" },
    { url: "/tenant-email-templates", title: "Email Templates", name: "email_templates" },

    // Reports
    { url: "/tenant-cdrs", title: "CDRs" },
    { url: "/tenant-live-call", title: "Live Calls" },
    { url: "/tenant-missedcall", title: "Missed Call" },
    { url: "/tenant-realtime-report", title: "Realtime Report" },
    { url: "/tenant-lead-report", title: "Lead Report" },
    { url: "/tenant-dropped-calls", title: "Dropped Calls Report" },
    { url: "/tenant-call-queue", title: "Call Queue Report" },
    { url: "/tenant-campaign-report", title: "Campaign Report" },
    { url: "/tenant-user-performance", title: "User Performance" },
    { url: "/tenant-loginLogout", title: "Login Logout Report" },
    { url: "/tenant-voiceBroadcast-report", title: "VoiceBroadcast Report" },
    { url: "/tenant-voicemail", title: "Voicemail" },

    { url: "/tenant-recording", title: "Recordings" },





    // Settings
    { url: "/tenant-audio-prompts", title: "Audio Prompts" },
    { url: "/tenant-audio-prompts/edit/[id]", title: "Edit Audio Prompt" },
    // { url: "/tenant-email-smtp", title: "Email SMTP" },
    // { url: "/tenant-lead-status", title: "Lead Status" },
    // { url: "/tenant-telecomcircle", title: "Telecom Circle", name: "telecomcircle" },
    { url: "/tenant-breakcode", title: "Break Codes", name: "breakcode" },

    // Report Scheduling
    { url: "/scheduling/tenant-cdrs", title: "CDR Report", name: "cdrs_report" },


    // API Integrations
    { url: "/tenant-webhooks", title: "Webhooks", name: "webhooks" },
    // { url: "/tenant-crm", title: "CRM", name: "crm" },
    // { url: "/tenant-api-key", title: "API Key", name: "api_key" },

    // { url: "/tenant-profile", title: "Profile" },


];

export const managerAdmin: NavItemsTypes[] = [
    {
        id: "manager-dashboard",
        icon: "Home",
        iconActive: "HomeGreen",
        title: "Dashboard",
        url: "/manager-dashboard",
    },
    {
        id: "manager-account-dashboard",
        icon: "Dashboard",
        iconActive: "HomeGreen",
        title: "Account Dashboard",
        url: "/manager-account-dashboard",
    },
    {
        id: "manager-realtime-dashboard",
        title: "Realtime Dashboard",
        icon: "Dashboard",
        url: "/manager-realtime-dashboard",
        iconActive: "HomeGreen",
    },
    {
        id: "manager-users",
        name: "users",
        icon: "User",
        iconActive: "UserGreen",
        title: "Users",
        url: "",
        subItems: [
            {
                id: "manager-user",
                name: "user",
                title: "User",
                url: "/manager-user",
            },
            {
                id: "manager-group-user",
                name: "user-group",
                title: "User Group",
                url: "/manager-group-user",
            },
            {
                id: "manager-role-user",
                name: "user-role",
                title: "User Role",
                url: "/manager-role-user",
            },
            {
                id: "manager-sip-devices",
                name: "extension",
                title: "SIP Devices",
                url: "/manager-sip-devices",
            },
        ],
    },
    {
        id: "manager-outgoing-rules",
        name: "outgoing_rules",
        icon: "CallOutgoing",
        iconActive: "CallOutgoingGreen",
        title: "Outgoing Rules",
        url: "/manager-outgoing-rules",
        subItems: [
            {
                id: "manager-sip-trunk",
                name: "trunk",
                title: "SIP Trunks",
                url: "/manager-sip-trunk",
            },
            {
                id: "manager-outgoing-rules",
                name: "outgoing-rules",
                title: "Outgoing Rules",
                url: "/manager-outgoing-rules",
            },
            {
                id: "manager-call-id-group",
                name: "caller-id-group",
                title: "Caller-ID Groups",
                url: "/manager-call-id-group",
            },
        ],
    },
    {
        id: "incoming-rules",
        name: "incoming_rules",
        icon: "CallIncoming",
        iconActive: "CallIncomingGreen",
        title: "Incoming Rules",
        url: "",
        subItems: [
            {
                id: "manager-did",
                name: "did",
                title: "DIDs",
                url: "/manager-did",
            },
            {
                id: "manager-ip-mapping",
                name: "ip-mapping",
                title: "IP Mapping",
                url: "/manager-ip-mapping",
            },
            // {
            //     id: "manager-click-to-call",
            //     name: "click-to-call",
            //     title: "Click to Call",
            //     url: "/manager-click-to-call",
            // },
            {
                id: "manager-ring-group",
                name: "ringgroup",
                title: "Ring Group",
                url: "/manager-ring-group",
            },
            {
                id: "manager-ivr",
                name: "ivr",
                title: "IVR",
                url: "/manager-ivr",
            },
            {
                id: "manager-time-condition",
                name: "timecondition",
                title: "Time Condition",
                url: "/manager-time-condition",
            },
            {
                id: "manager-conference",
                name: "conference",
                title: "Conference",
                url: "/manager-conference",
            },
            {
                id: "manager-call-queue",
                name: "call-queue",
                title: "Call Queue",
                url: "/manager-call-queue",
            },
            // {
            //     id: "manager-feature-code",
            //     name: "feature-code",
            //     title: "Feature Codes",
            //     url: "/manager-feature-code",
            // },
            {
                id: "manager-block-inbound-call",
                name: "block-inbound-campaign",
                title: "Block Inbound Calls",
                url: "/manager-block-inbound-call",
            },
        ],
    },
    {
        id: "manager-lead-management",
        name: "lead_management",
        icon: "LeadManagement",
        iconActive: "LeadManagementGreen",
        title: "Lead Management",
        url: "",
        subItems: [
            {
                id: "manager-leads",
                name: "lead-management",
                title: "Leads",
                url: "/manager-leads",
            },
            {
                id: "manager-lead-group",
                name: "lead-group",
                title: "Lead Group",
                url: "/manager-lead-group",
            },
            {
                id: "manager-follow-up",
                name: "follow-up",
                title: "Follow Up",
                url: "/manager-follow-up",
            },
            {
                id: "manager-custom-fields",
                name: "custom-fields",
                title: "Custom Fields",
                url: "/manager-custom-fields",
            },
            {
                id: "manager-lead-churning",
                name: "lead-churning",
                title: "Lead Churning",
                icon: "RefreshCircle",
                url: "/manager-lead-churning",
            },
        ],
    },
    {
        id: "manager-call-center",
        icon: "Audio",
        iconActive: "AudioGreen",
        title: "Contact Center",
        url: "",
        name: "call_center",
        subItems: [
            {
                id: "manager-inbound-campaign",
                name: "inbound-campaign",
                title: "Inbound Campaign",
                url: "/manager-inbound-campaign",
            },
            {
                id: "manager-outbound-campaign",
                name: "outbound-campaign",
                title: "Outbound Campaign",
                url: "/manager-outbound-campaign",
            },
            {
                id: "manager-blended-campaign",
                name: "blended-campaign",
                title: "Blended Campaign",
                url: "/manager-blended-campaign",
            },
            {
                id: "manager-disposition",
                name: "disposition",
                title: "Disposition",
                url: "/manager-disposition",
            },
            {
                id: "manager-dnc",
                name: "dnc",
                title: "DNC",
                url: "/manager-dnc",
            },
            // {
            //     id: "manage-state",
            //     name: "state",
            //     title: "State",
            //     url: "/manage-state",
            // },
            // {
            //     id: "manage-area-code",
            //     name: "areacode",
            //     title: "Area Code",
            //     url: "/manage-area-code",
            // },
            // {
            //     id: "manager-webform",
            //     name: "webform",
            //     title: "Webform",
            //     url: "/manager-webform",
            // },
        ],
    },
    {
        id: "manager-broadcasting",
        icon: "Broadcast",
        iconActive: "BroadcastGreen",
        title: "Broadcasting",
        url: "",
        name: "broadcasting",
        subItems: [
            {
                id: "manager-voice-broadcast",
                name: "voice-broadcast",
                title: "Voice Broadcasting",
                url: "/manager-voice-broadcast",
            },
        ],
    },

    {
        id: "manager-activity-log",
        name: "activity_log",
        icon: "Report",
        iconActive: "NotesGreen",
        title: "Activity Log",
        url: "/manager-activity-log",
    },
    {
        id: "manager-reports",
        name: "manager-reports",
        icon: "Notes",
        iconActive: "NotesGreen",
        title: "Reports",
        url: "/manager-reports",

    },
    {
        id: "settings",
        icon: "Setting",
        iconActive: "SettingGreen",
        title: "Settings",
        name: "settings",
        url: "",
        subItems: [
            {
                id: "manager-audio-prompts",
                name: "greeting",
                title: "Audio Prompts",
                url: "/manager-audio-prompts",
            },
            // {
            //     id: "manager-email-smtp",
            //     name: "mail-configuration",
            //     title: "Email SMTP",
            //     url: "/manager-email-smtp",
            // },
            // {
            //     id: "manager-telecomcircle",
            //     name: "telecomcircle",
            //     title: "Telecom Circle",
            //     url: "/manager-telecomcircle",
            // },
            {
                id: "manager-breakcode",
                name: "breakcode",
                title: "Break Codes",
                url: "/manager-breakcode",
            },

        ],
    },
    // {
    //     id: "api",
    //     icon: "Integration",
    //     iconActive: "IntegrationGreen",
    //     title: "Integrations",
    //     name: "api",
    //     url: "",
    //     subItems: [
    //         {
    //             id: "manager-crm",
    //             name: "crm",
    //             title: "CRM",
    //             url: "/manager-crm",
    //         },
    //         {
    //             id: "manager-api-key",
    //             name: "api_key",
    //             title: "API Key",
    //             url: "/manager-api-key",
    //         },
    //         {
    //             id: "manager-wedhooks",
    //             name: "webhooks",
    //             title: "Webhooks",
    //             url: "/manager-wedhooks",
    //         },
    //     ],
    // },


];

export const managerAdminUrls = [
    "/manager-dashboard",
    "/manager-account-dashboard",
    "/manager-realtime-dashboard",

    // users
    "/manager-user",
    "/manager-group-user",
    "/manager-role-user",
    "/manager-sip-devices",

    // Outgoing Rules
    "/manager-sip-trunk",
    "/manager-outgoing-rules",
    "/manager-call-id-group",

    // Incoming Rules
    "/manager-did",
    "/manager-ip-mapping",
    // "/manager-click-to-call",
    "/manager-ring-group",
    "/manager-ivr",
    "/manager-time-condition",
    "/manager-conference",
    "/manager-call-queue",
    // "/manager-feature-code",
    "/manager-block-inbound-call",

    // Lead Management
    "/manager-leads",
    "/manager-lead-group",
    "/manager-follow-up",
    "/manager-custom-fields",
    "/manager-lead-churning",

    // Call Center
    "/manager-inbound-campaign",
    "/manager-outbound-campaign",
    "/manager-blended-campaign",
    "/manager-disposition",
    "/manager-dnc",
    // "/manage-state",
    // "/manage-area-code",
    // "/manager-webform",

    // Broadcasting
    "/manager-voice-broadcast",


    // reports
    "/manager-activity-log", // Added Activity Log route
    "/manager-cdrs",
    "/manager-live-call",
    "/manager-missedcall",
    "/manager-realtime-report",
    "/manager-lead-report",
    "/manager-campaign-report",
    "/manager-voiceBroadcast-report",
    "/manager-user-performance",
    "/manager-loginLogout",
    "/manager-voicemail",
    "/manager-recording",
    "/manager-activity-log",

    // Settings
    "/manager-audio-prompts",
    "/manager-audio-prompts/edit/[id]",
    // "/manager-email-smtp",
    // "/manager-telecomcircle",
    "/manager-breakcode",
    "/manager-reports",


    // API Integrations

    // "/manager-crm",
    // "/manager-api-key",
    // "/manager-wedhooks",

    // "/manager-profile",

];

export const managerAdminTitles = [
    { url: "/manager-dashboard", title: "Dashboard" },
    { url: "/manager-account-dashboard", title: "Account Dashboard" },
    { url: "/manager-realtime-dashboard", title: "Realtime Dashboard" },

    // users
    { url: "/manager-user", title: "User", name: "user" },
    { url: "/manager-group-user", title: "User Group", name: "user-group" },
    { url: "/manager-role-user", title: "User Role", name: "user-role" },
    { url: "/manager-sip-devices", title: "SIP Devices", name: "extension" },

    // Outgoing Rules
    { url: "/manager-sip-trunk", title: "Trunk", name: "trunk" },
    {
        url: "/manager-outgoing-rules",
        title: "Outgoing Rules",
        name: "outgoing-rules",
    },
    {
        url: "/manager-call-id-group",
        title: "Call ID Group",
        name: "caller-id-group",
    },

    // Incoming Rules
    { url: "/manager-did", title: "DID", name: "did" },
    { url: "/manager-ip-mapping", title: "IP Mapping", name: "ip-mapping" },
    // {
    //     url: "/manager-click-to-call",
    //     title: "Click to call",
    //     name: "click-to-call",
    // },
    { url: "/manager-ring-group", title: "Ring Group", name: "ringgroup" },
    { url: "/manager-ivr", title: "IVR", name: "ivr" },
    {
        url: "/manager-time-condition",
        title: "Time Condition",
        name: "timecondition",
    },
    { url: "/manager-conference", title: "Conference", name: "conference" },
    { url: "/manager-call-queue", title: "Call Queue", name: "call-queue" },
    // { url: "/manager-feature-code", title: "Feature Codes", name: "feature-code" },
    {
        url: "/manager-block-inbound-call",
        title: "Block Inbound Calls",
        name: "block-inbound-campaign",
    },

    // Lead Management
    { url: "/manager-leads", title: "Leads", name: "lead-management" },
    { url: "/manager-lead-group", title: "Lead Group", name: "lead-group" },
    { url: "/manager-follow-up", title: "Follow Up", name: "follow-up" },
    { url: "/manager-custom-fields", title: "Custom Fields", name: "custom-fields" },
    { url: "/manager-lead-churning", title: "Lead Churning", name: "lead-churning" },

    // Contact Center
    {
        url: "/manager-inbound-campaign",
        title: "Inbound Campaign",
        name: "inbound-campaign",
    },
    {
        url: "/manager-outbound-campaign",
        title: "Outbound Campaign",
        name: "outbound-campaign",
    },
    {
        url: "/manager-blended-campaign",
        title: "Blended Campaign",
        name: "blended-campaign",
    },
    { url: "/manager-disposition", title: "Disposition", name: "disposition" },
    { url: "/manager-dnc", title: "DNC", name: "dnc" },
    // { url: "/manage-state", title: "State", name: "state" },
    // { url: "/manage-area-code", title: "Area Code", name: "areacode" },
    // { url: "/manager-webform", title: "Webform", name: "webform" },

    // Broadcasting
    {
        url: " /manager-voice-broadcast",
        title: "Voice Broadcast",
        name: "voice-broadcast",
    },
    { url: "/manager-reports", title: "Reports", name: "manager-reports" },


    // Reports
    {
        url: "/manager-activity-log",
        title: "Activity Log",
        name: "activity_log",
        icon: "Report",
    },
    { url: "/manager-cdrs", title: "CDRs" },
    { url: "/manager-live-call", title: "Live Calls" },
    { url: "/manager-missedcall", title: "Missed Call" },
    { url: "/manager-realtime-report", title: "Realtime Report" },
    { url: "/manager-lead-report", title: "Lead Report" },
    { url: "/manager-campaign-report", title: "Campaign Report" },
    { url: "/manager-user-performance", title: "User Performance" },
    { url: "/manager-loginLogout", title: "Login Logout Report" },
    { url: "/manager-voiceBroadcast-report", title: "VoiceBroadcast Report" },
    { url: "/manager-voicemail", title: "Voicemail" },
    { url: "/manager-recording", title: "Recording" },


    // Settings
    { url: "/manager-audio-prompts", title: "Audio Prompts" },
    { url: "/manager-audio-prompts/edit/[id]", title: "Edit Audio Prompt" },
    // { url: "/manager-email-smtp", title: "Email SMTP" },
    // { url: "/manager-telecomcircle", title: "Telecom Circle", name: "telecomcircle" },
    { url: "/manager-breakcode", title: "Break Codes", name: "breakcode" },


    // API Integrations

    // { url: "/manager-crm", title: "CRM", name: "crm" },
    // { url: "/manager-api-key", title: "API Key", name: "api_key" },
    // { url: "/manager-wedhooks", title: "Webhooks", name: "webhooks" },

    // { url: "/manager-profile", title: "Profile" },




];

