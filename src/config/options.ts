//TYPES IMPORT
import { OptionTypes } from "@/types/formTypes";

export const advanceSearchOptions: OptionTypes[] = [
    { value: "1", label: "Begin with" },
    { value: "2", label: "Contains" },
    { value: "3", label: "Does not contain" },
    { value: "4", label: "Is equal to" },
    { value: "5", label: "Is not equal to" },
    { value: "6", label: "Ends with" },
];

export const advanceSearchGreaterOptions: OptionTypes[] = [
    { value: "4", label: "Is equal to" },
    { value: "5", label: "Is not equal to" },
    { value: "7", label: "Greater Than" },
    { value: "8", label: "Less Than" },
    { value: "9", label: "Greater Or Equal Than" },
    { value: "10", label: "Less Or Equal Than" },
];

export const timeOutOptions: OptionTypes[] = [
    { value: "30", label: "30" },
    { value: "60", label: "60" },
    { value: "120", label: "120" },
    { value: "180", label: "180" },
];

export const playFileTimeOptions: OptionTypes[] = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "7", label: "7" },
    { value: "8", label: "8" },
    { value: "9", label: "9" },
    { value: "10", label: "10" },
];

export const broadcastTypeOption: OptionTypes[] = [
    { value: "0", label: "Survey" },
    { value: "1", label: "IVR" },
];

export const timeoutOptions: OptionTypes[] = [
    { value: "30", label: "30 Sec" },
    { value: "60", label: "1 Min" },
    { value: "120", label: "2 Min" },
    { value: "180", label: "3 Min" },
];

export const timeoutOptions2: OptionTypes[] = [
    { value: "1", label: "1 Sec" },
    { value: "5", label: "5 Sec" },
    { value: "10", label: "10 Sec" },
    { value: "20", label: "20 Sec" },
    { value: "30", label: "30 Sec" },
    { value: "60", label: "1 Min" },
    { value: "120", label: "2 Min" },
    { value: "180", label: "3 Min" },
];

export const callerTimeoutOptions: OptionTypes[] = [
    { value: "1", label: "1" },
    { value: "5", label: "5" },
    { value: "10", label: "10" },
    { value: "15", label: "15" },
    { value: "30", label: "30" },
    { value: "60", label: "60" },
    { value: "90", label: "90" },
    { value: "120", label: "120" },
    { value: "180", label: "180" },
    { value: "240", label: "240" },
];

export const timeoutOptions3: OptionTypes[] = [
    { value: 5, label: "5 Sec" },
    { value: 15, label: "15 Sec" },
    { value: 30, label: "30 Sec" },
    { value: 60, label: "1 Min" },
    { value: 120, label: "2 Min" },
    { value: 180, label: "3 Min" },
];

export const typeOptions: OptionTypes[] = [
    { value: "0", label: "Sequence" },
    { value: "1", label: "Simultaneous" },
];

export const blockTypeOption: OptionTypes[] = [
    { value: "0", label: "Prefix" },
    { value: "1", label: "Number" },
];

export const routingTypeOptions: OptionTypes[] = [
    { value: "1", label: "SIP Device", url: "sip-devices" },
    { value: "2", label: "IVR", url: "ivr" },
    { value: "3", label: "Time-Condition", url: "time-condition" },
    { value: "4", label: "Conference", url: "conference" },
    { value: "5", label: "Call Queue", url: "call-queue" },
    { value: "6", label: "Ring Group", url: "ring-group" },
    { value: "7", label: "Voicemail", url: "sip-devices" },
    { value: "8", label: "PSTN" },
];

export const routingTypeOptions2: OptionTypes[] = [
    { value: "1", label: "SIP Device", url: "sip-devices" },
    { value: "2", label: "IVR", url: "ivr" },
    { value: "3", label: "Time-Condition", url: "time-condition" },
    { value: "4", label: "Conference", url: "conference" },
    { value: "5", label: "Call Queue", url: "call-queue" },
    { value: "6", label: "Ring Group", url: "ring-group" },
    { value: "7", label: "Voicemail", url: "sip-devices" },
    { value: "8", label: "PSTN" },
    { value: "9", label: "External User" },
    { value: "10", label: "Custom CRM" },
    { value: "11", label: "Feedback" },
];

export const routingTypeOptions3: OptionTypes[] = [
    { value: "1", label: "SIP Device", url: "sip-devices" },
    { value: "2", label: "IVR", url: "ivr" },
    { value: "3", label: "Time-Condition", url: "time-condition" },
    { value: "4", label: "Conference", url: "conference" },
    { value: "5", label: "Call Queue", url: "call-queue" },
    { value: "6", label: "Ring Group", url: "ring-group" },
    { value: "7", label: "Voicemail", url: "sip-devices" },
    { value: "8", label: "PSTN" },
    { value: "9", label: "External User" },
    { value: "10", label: "Audio Prompts", url: "audio-prompts" },
];

export const extensionTypeOptions: OptionTypes[] = [
    { value: "0", label: "SIP Device" },
    { value: "1", label: "PSTN" },
];

export const digitsOptions = [
    { value: "0", label: "0", isdisabled: false },
    { value: "1", label: "1", isdisabled: false },
    { value: "2", label: "2", isdisabled: false },
    { value: "3", label: "3", isdisabled: false },
    { value: "4", label: "4", isdisabled: false },
    { value: "5", label: "5", isdisabled: false },
    { value: "6", label: "6", isdisabled: false },
    { value: "7", label: "7", isdisabled: false },
    { value: "8", label: "8", isdisabled: false },
    { value: "9", label: "9", isdisabled: false },
    { value: "timeout", label: "timeout", isdisabled: false },
];

export const digitsOptions2 = [
    { value: "0", label: "0" },
    { value: "1", label: "1" },
];

export const levelOptions: OptionTypes[] = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "7", label: "7" },
    { value: "8", label: "8" },
    { value: "9", label: "9" },
    { value: "10", label: "10" },
];

export const cpsOptions: OptionTypes[] = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" }
]

export const percentageOptions: OptionTypes[] = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "7", label: "7" },
    { value: "8", label: "8" },
    { value: "9", label: "9" },
    { value: "10", label: "10" },
    { value: "11", label: "11" },
    { value: "12", label: "12" },
    { value: "13", label: "13" },
    { value: "14", label: "14" },
    { value: "15", label: "15" },
    { value: "16", label: "16" },
    { value: "17", label: "17" },
    { value: "18", label: "18" },
    { value: "19", label: "19" },
    { value: "20", label: "20" },
    { value: "21", label: "21" },
    { value: "22", label: "22" },
    { value: "23", label: "23" },
    { value: "24", label: "24" },
    { value: "25", label: "25" },
    { value: "26", label: "26" },
    { value: "27", label: "27" },
    { value: "28", label: "28" },
    { value: "29", label: "29" },
    { value: "30", label: "30" },
    { value: "31", label: "31" },
    { value: "32", label: "32" },
    { value: "33", label: "33" },
    { value: "34", label: "34" },
    { value: "35", label: "35" },
    { value: "36", label: "36" },
    { value: "37", label: "37" },
    { value: "38", label: "38" },
    { value: "39", label: "39" },
    { value: "40", label: "40" },
    { value: "41", label: "41" },
    { value: "42", label: "42" },
    { value: "43", label: "43" },
    { value: "44", label: "44" },
    { value: "45", label: "45" },
    { value: "46", label: "46" },
    { value: "47", label: "47" },
    { value: "48", label: "48" },
    { value: "49", label: "49" },
    { value: "50", label: "50" },
    { value: "51", label: "51" },
    { value: "52", label: "52" },
    { value: "53", label: "53" },
    { value: "54", label: "54" },
    { value: "55", label: "55" },
    { value: "56", label: "56" },
    { value: "57", label: "57" },
    { value: "58", label: "58" },
    { value: "59", label: "59" },
    { value: "60", label: "60" },
    { value: "61", label: "61" },
    { value: "62", label: "62" },
    { value: "63", label: "63" },
    { value: "64", label: "64" },
    { value: "65", label: "65" },
    { value: "66", label: "66" },
    { value: "67", label: "67" },
    { value: "68", label: "68" },
    { value: "69", label: "69" },
    { value: "70", label: "70" },
    { value: "71", label: "71" },
    { value: "72", label: "72" },
    { value: "73", label: "73" },
    { value: "74", label: "74" },
    { value: "75", label: "75" },
    { value: "76", label: "76" },
    { value: "77", label: "77" },
    { value: "78", label: "78" },
    { value: "79", label: "79" },
    { value: "80", label: "80" },
    { value: "81", label: "81" },
    { value: "82", label: "82" },
    { value: "83", label: "83" },
    { value: "84", label: "84" },
    { value: "85", label: "85" },
    { value: "86", label: "86" },
    { value: "87", label: "87" },
    { value: "88", label: "88" },
    { value: "89", label: "89" },
    { value: "90", label: "90" },
    { value: "91", label: "91" },
    { value: "92", label: "92" },
    { value: "93", label: "93" },
    { value: "94", label: "94" },
    { value: "95", label: "95" },
    { value: "96", label: "96" },
    { value: "97", label: "97" },
    { value: "98", label: "98" },
    { value: "99", label: "99" },
    { value: "100", label: "100" },
];

export const strategyOptions: OptionTypes[] = [
    { value: "ring-all", label: "Ring All" },
    { value: "longest-idle-agent", label: "Longest Idle Agent" },
    { value: "round-robin", label: "Round Robin" },
    { value: "top-down", label: "Top Down" },
    { value: "agent-it-east-talk-time", label: "Agent With Least Talk Time" },
    { value: "agent-it-ewest-calls", label: "Agent With Fewest Calls" },
    {
        value: "sequentially-by-agent-order",
        label: "Sequentially By Agent Order",
    },
    { value: "random ", label: "Random" },
    { value: "ring-progressively", label: "Ring Progressively" },
];

export const priorityOptions: OptionTypes[] = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    // { value: "4", label: "4" },
    // { value: "5", label: "5" },
    // { value: "6", label: "6" },
    // { value: "7", label: "7" },
    // { value: "8", label: "8" },
    // { value: "9", label: "9" },
    // { value: "10", label: "10" },
    // { value: "11", label: "11" },
    // { value: "12", label: "12" },
    // { value: "13", label: "13" },
    // { value: "14", label: "14" },
    // { value: "15", label: "15" },
    // { value: "16", label: "16" },
    // { value: "17", label: "17" },
    // { value: "18", label: "18" },
    // { value: "19", label: "19" },
    // { value: "20", label: "20" },
];

export const priorityOptions2: OptionTypes[] = [
    { value: "0", label: "0" },
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "7", label: "7" },
    { value: "8", label: "8" },
    { value: "9", label: "9" },
    { value: "10", label: "10" },
    { value: "11", label: "11" },
    { value: "12", label: "12" },
    { value: "13", label: "13" },
    { value: "14", label: "14" },
    { value: "15", label: "15" },
    { value: "16", label: "16" },
    { value: "17", label: "17" },
    { value: "18", label: "18" },
    { value: "19", label: "19" },
    { value: "20", label: "20" },
];

export const daysOptions: OptionTypes[] = [
    { value: "1", label: "Sunday" },
    { value: "2", label: "Monday" },
    { value: "3", label: "Tuesday" },
    { value: "4", label: "Wednesday" },
    { value: "5", label: "Thursday" },
    { value: "6", label: "Friday" },
    { value: "7", label: "Saturday" },
];

export const testingtOptions: OptionTypes[] = [
    { value: "f68c275f-207f-4b71-b75f-e2f5d72c512a", label: "1" },
    { value: "f68c275f-207f-4b71-b75f-e2f5d72c513a", label: "2" },
    { value: "f68c275f-207f-4b71-b75f-e2f5d72c514a", label: "3" },
    { value: "f68c275f-207f-4b71-b75f-e2f5d72c515a", label: "4" },
    { value: "f68c275f-207f-4b71-b75f-e2f5d72c516a", label: "5" },
    { value: "f68c275f-207f-4b71-b75f-e2f5d72c517a", label: "6" },
    { value: "f68c275f-207f-4b71-b75f-e2f5d72c518a", label: "7" },
];

export const genderOptions: OptionTypes[] = [
    { value: "0", label: "Male" },
    { value: "1", label: "Female" },
];

export const directionOptions: OptionTypes[] = [
    { value: "inbound", label: "Inbound" },
    { value: "outbound", label: "Outbound" },
];

export const callTypeOptions: OptionTypes[] = [
    { value: "local", label: "Local" },
    { value: "did", label: "DID" },
    { value: "standard", label: "Standard" },
    { value: "click2call", label: "Click2Call" },
];

export const dispositionOptions: OptionTypes[] = [
    { value: "ACCOUNT_INACTIVE_DELETED", label: "ACCOUNT_INACTIVE_DELETED" },
    { value: "ACCOUNT_EXPIRE", label: "ACCOUNT_EXPIRE" },
    { value: "ALLOTTED_TIMEOUT", label: "ALLOTTED_TIMEOUT" },
    { value: "AUTHENTICATION_FAIL", label: "AUTHENTICATION_FAIL" },
    { value: "BEARERCAPABILITY_NOTAUTH", label: "BEARERCAPABILITY_NOTAUTH" },
    { value: "BEARERCAPABILITY_NOTAVAIL", label: "BEARERCAPABILITY_NOTAVAIL" },
    { value: "BEARERCAPABILITY_NOTIMPL", label: "BEARERCAPABILITY_NOTIMPL" },
    { value: "CALL_REJECTED", label: "CALL_REJECTED" },
    { value: "CHAN_NOT_IMPLEMENTED", label: "CHAN_NOT_IMPLEMENTED" },
    { value: "CHANNEL_UNACCEPTABLE", label: "CHANNEL_UNACCEPTABLE" },
    { value: "DESTINATION_OUT_OF_ORDER", label: "DESTINATION_OUT_OF_ORDER" },
    { value: "DESTINATION_BLOCKED", label: "DESTINATION_BLOCKED" },
    { value: "DID_DESTINATION_NOT_FOUND", label: "DID_DESTINATION_NOT_FOUND" },
    { value: "FACILITY_REJECTED", label: "FACILITY_REJECTED" },
    { value: "FACILITY_NOT_SUBSCRIBED", label: "FACILITY_NOT_SUBSCRIBED" },
    { value: "FACILITY_NOT_IMPLEMENTED", label: "FACILITY_NOT_IMPLEMENTED" },
    { value: "INVALID_NUMBER_FORMAT", label: "INVALID_NUMBER_FORMAT" },
    { value: "INCOMPATIBLE_DESTINATION", label: "INCOMPATIBLE_DESTINATION" },
    { value: "MANAGER_REQUEST", label: "MANAGER_REQUEST" },
    { value: "MEDIA_TIMEOUT", label: "MEDIA_TIMEOUT" },
    { value: "MANDATORY_IE_MISSING [96]", label: "MANDATORY_IE_MISSING [96]" },
    { value: "NO_ROUTE_DESTINATION", label: "NO_ROUTE_DESTINATION" },
    { value: "NORMAL_CLEARING", label: "NORMAL_CLEARING" },
    { value: "NETWORK_OUT_OF_ORDER", label: "NETWORK_OUT_OF_ORDER" },
    { value: "NORMAL_UNSPECIFIED", label: "NORMAL_UNSPECIFIED" },
    { value: "NORMAL_CIRCUIT_CONGESTION", label: "NORMAL_CIRCUIT_CONGESTION" },
    { value: "NORMAL_TEMPORARY_FAILURE", label: "NORMAL_TEMPORARY_FAILURE" },
    { value: "NO_SUFFICIENT_FUND", label: "NO_SUFFICIENT_FUND" },
    { value: "NO_USER_RESPONSE", label: "NO_USER_RESPONSE" },
    { value: "NO_ANSWER", label: "NO_ANSWER" },
    { value: "NUMBER_CHANGED", label: "NUMBER_CHANGED" },
    { value: "ORIGINATOR_CANCEL", label: "ORIGINATOR_CANCEL" },
    { value: "ORIGINATION_RATE_NOT_FOUND", label: "ORIGINATION_RATE_NOT_FOUND" },
    { value: "OUTGOING_CALL_BARRED", label: "OUTGOING_CALL_BARRED" },
    { value: "PROGRESS_TIMEOUT", label: "PROGRESS_TIMEOUT" },
    { value: "RECOVERY_ON_TIMER_EXPIRE", label: "RECOVERY_ON_TIMER_EXPIRE" },
    { value: "RESELLER_COST_CHEAP", label: "RESELLER_COST_CHEAP" },
    { value: "SERVICE_NOT_IMPLEMENTED", label: "SERVICE_NOT_IMPLEMENTED" },
    { value: "SERVICE_UNAVAILABLE", label: "SERVICE_UNAVAILABLE" },
    { value: "SUCCESS", label: "SUCCESS" },
    { value: "SWITCH_CONGESTION", label: "SWITCH_CONGESTION" },
    { value: "TERMINATION_RATE_NOT_FOUND", label: "TERMINATION_RATE_NOT_FOUND" },
    { value: "UNSPECIFIED", label: "UNSPECIFIED" },
    { value: "UNALLOCATED_NUMBER", label: "UNALLOCATED_NUMBER" },
    { value: "USER_BUSY", label: "USER_BUSY" },
    { value: "USER_NOT_REGISTERED", label: "USER_NOT_REGISTERED" },
    { value: "REQUESTED_CHAN_UNAVAIL", label: "REQUESTED_CHAN_UNAVAIL" },
    { value: "SUBSCRIBER_ABSENT", label: "SUBSCRIBER_ABSENT" },
    { value: "IVR_TIMEOUT", label: "IVR_TIMEOUT" },
    { value: "CALLQUEUE_TIMEOUT", label: "CALLQUEUE_TIMEOUT" },
];

export const top10tenantOptions = [
    {
        value: "top10-tenant-users",
        label: "Users",
        key: "top10_tenant",
        countKey: "count",
    },
    {
        value: "top10-tenant-calls",
        label: "Calls",
        key: "top10_tenant_calls",
        countKey: "totalCalls",
    },
    {
        value: "top10-tenant-usage",
        label: "Usage",
        key: "top10_tenant_usage",
        countKey: "billsecond",
    },
];

export const recent10tenantOptions = [
    {
        value: "recent10-tenant-users",
        label: "Users",
        key: "recent10_tenant",
        countKey: "count",
    },
    {
        value: "recent10-tenant-calls",
        label: "Calls",
        key: "recent10_tenant_calls",
        countKey: "totalCalls",
    },
    {
        value: "recent10-tenant-usage",
        label: "Usage",
        key: "recent10_tenant_usage",
        countKey: "billsecond",
    },
];

export const top10userOptions = [
    {
        value: "top10-user-usage",
        label: "Usage",
        key: "top10_users",
        countKey: "count",
    },
    {
        value: "top10-user-calls",
        label: "Calls",
        key: "top10_users_calls",
        countKey: "totalCalls",
    },
];

export const recent10userOptions = [
    {
        value: "recent10-user-usage",
        label: "Usage",
        key: "recent10_users",
        countKey: "count",
    },
    {
        value: "recent10-user-calls",
        label: "Calls",
        key: "recent10_users_calls",
        countKey: "totalCalls",
    },
];

export const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

export const dialMethodOptions = [
    { value: "0", label: "Manual" },
    { value: "1", label: "Auto" },
    { value: "2", label: "Preview" },
    { value: "3", label: "Predictive" },
];

export const dialLevelOptions = [
    // { value: "0", label: "0" },
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    // { value: "4", label: "4" },
    // { value: "5", label: "5" },
    // { value: "6", label: "6" },
    // { value: "7", label: "7" },
    // { value: "8", label: "8" },
    // { value: "9", label: "9" },
    // { value: "10", label: "10" },
    // { value: "11", label: "11" },
    // { value: "12", label: "12" },
    // { value: "13", label: "13" },
    // { value: "14", label: "14" },
    // { value: "15", label: "15" },
    // { value: "16", label: "16" },
    // { value: "17", label: "17" },
    // { value: "18", label: "18" },
    // { value: "19", label: "19" },
    // { value: "20", label: "20" },
];


export const callIdOptions = [
    { value: "0", label: "Manual", title: "Caller ID" },
    { value: "1", label: "Random", title: "Caller ID Group" },
    { value: "4", label: "Random (NPA-NXX)", title: "Caller ID Group" },
    { value: "2", label: "Sequence", title: "Caller ID Group" },
    { value: "3", label: "Prefix base", title: "Caller ID Group" },
];

export const didAsCallerIdOptions = [
    { value: "0", label: "Yes" },
    { value: "1", label: "No" },
];

export const callModeOptions: OptionTypes[] = [
    { value: "0", label: "PBX" },
    { value: "1", label: "Call Center" },
];

export const followUpTypeOptions: OptionTypes[] = [
    { value: "Callback", label: "Callback" },
    { value: "Email", label: "Email" },
    { value: "Whatsapp", label: "Whatsapp" },
    { value: "Escalation", label: "Escalation" },
    { value: "Other Task", label: "Other Task" },
];

// export const followUpStatusOptions: OptionTypes[] = [
//     { value: "0", label: "Close" },
//     { value: "1", label: "Open" },
//     { value: "2", label: "Upcoming" },
//     { value: "3", label: "Completed" },  
//     { value: "4", label: "Past Due" },      
// ];

export const followUpStatusOptions: OptionTypes[] = [
    { value: "0", label: "Upcoming" },
    { value: "1", label: "Past Due" },
    { value: "2", label: "Completed" },
];

export const filterByOptions: OptionTypes[] = [
    { value: "0", label: "Lead Group" },
    { value: "1", label: "Tenant" },
    { value: "2", label: "CSV" },
    { value: "3", label: "No Duplicate Check" },
];

export const callerIdOptions: OptionTypes[] = [
    { value: "0", label: "Campaign" },
    { value: "1", label: "Customer" },
    { value: "2", label: "Custom" },

];

export const areacodeTypeOptions: OptionTypes[] = [
    { value: "1", label: "Block" },
    { value: "0", label: "UnBlock" },
];

export const welcomePromptOptions: any[] = [
    "Continue",
    "Not Interested (NI)",
    "DNC",
];

export const msgChannelTypeOptions: OptionTypes[] = [
    { value: "WhatsApp", label: "WhatsApp" },
    { value: "Instagram", label: "Instagram" },
    { value: "Facebook", label: "Facebook" },
    { value: "SMS", label: "SMS" },
    // { value: "Chat", label: "Chat" },
    // { value: "Email", label: "Email" },
];

export const msgChannelProviderOptions: OptionTypes[] = [
    { value: "Meta", label: "Meta" }
];

export const msgQueueTypeOptions: OptionTypes[] = [
    { value: "0", label: "Call Center" },
    // { value: "1", label: "PBX" },
];


export const fieldTypeOptions: OptionTypes[] = [
    { value: "0", label: "Text" },
    { value: "1", label: "Area" },
    { value: "2", label: "Select" },
    { value: "3", label: "Multi Select" },
    { value: "4", label: "Radio" },
    { value: "5", label: "Checkbox" },
    { value: "6", label: "Date" },
    // { value: "7", label: "Time" },

];

export const rankNumberOptions: OptionTypes[] = [
    { value: "0", label: "0" },
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "7", label: "7" },
    { value: "8", label: "8" },
    { value: "9", label: "9" },
    { value: "10", label: "10" },
    { value: "11", label: "11" },
    { value: "12", label: "12" },
    { value: "13", label: "13" },
    { value: "14", label: "14" },
    { value: "15", label: "15" },
    { value: "16", label: "16" },
    { value: "17", label: "17" },
    { value: "18", label: "18" },
    { value: "19", label: "19" },
    { value: "20", label: "20" },
    { value: "21", label: "21" },
    { value: "22", label: "22" },
    { value: "23", label: "23" },
    { value: "24", label: "24" },
    { value: "25", label: "25" },
    { value: "26", label: "26" },
    { value: "27", label: "27" },
    { value: "28", label: "28" },
    { value: "29", label: "29" },
    { value: "30", label: "30" },
    { value: "31", label: "31" },
    { value: "32", label: "32" },
    { value: "33", label: "33" },
    { value: "34", label: "34" },
    { value: "35", label: "35" },
    { value: "36", label: "36" },
    { value: "37", label: "37" },
    { value: "38", label: "38" },
    { value: "39", label: "39" },
    { value: "40", label: "40" },
    { value: "41", label: "41" },
    { value: "42", label: "42" },
    { value: "43", label: "43" },
    { value: "44", label: "44" },
    { value: "45", label: "45" },
    { value: "46", label: "46" },
    { value: "47", label: "47" },
    { value: "48", label: "48" },
    { value: "49", label: "49" },
    { value: "50", label: "50" },

];

export const dispositionLevelOptions: OptionTypes[] = [
    { value: 0, label: "0" },
    { value: 1, label: "1" },
    { value: 2, label: "2" },
];