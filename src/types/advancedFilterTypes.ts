interface AdvancedFilterTypes {
    key: string;
    val: string | number | Date | null | [];
    dropdown: string;
}

// ============= MASTER ADMIN ================
export interface TenantAdvancedFilterTypes {
    tenant_name: AdvancedFilterTypes;
    username: AdvancedFilterTypes;
    email: AdvancedFilterTypes;
    country_uuid: AdvancedFilterTypes;
    domain: AdvancedFilterTypes;
}

export interface DispositionFilterTypes {
    name: AdvancedFilterTypes;
    code: AdvancedFilterTypes;
}

export interface TenantDispositionFilterTypes {
    name: AdvancedFilterTypes;
    code: AdvancedFilterTypes;
}

export interface CountryAdvancedFilterTypes {
    country: AdvancedFilterTypes;
    iso: AdvancedFilterTypes;
    iso3: AdvancedFilterTypes;
    nicename: AdvancedFilterTypes;
    vat: AdvancedFilterTypes;
    latitude: AdvancedFilterTypes;
    longitude: AdvancedFilterTypes;
    capital: AdvancedFilterTypes;
    countrycode: AdvancedFilterTypes;
}

export interface TimezoneAdvancedFilterTypes {
    timezone_name: AdvancedFilterTypes;
    gmtoffset: AdvancedFilterTypes;
    gmttime: AdvancedFilterTypes;
    country_uuid: AdvancedFilterTypes;
}

export interface SipProfileAdvancedFilterTypes {
    name: AdvancedFilterTypes;
    sip_ip: AdvancedFilterTypes;
    sip_port: AdvancedFilterTypes;
}

export interface RolesdvancedFilterTypes {
    role_name: AdvancedFilterTypes;
}

export interface TrunkAdvancedFilterTypes {
    name: AdvancedFilterTypes;
    sip_profile_uuid: AdvancedFilterTypes;
    domain: AdvancedFilterTypes;
}

export interface CdrsFilterTypes {
    callstart: AdvancedFilterTypes;
    callend: AdvancedFilterTypes;
    tenant_uuid: AdvancedFilterTypes;
    user_uuid: AdvancedFilterTypes;
    caller_id_name: AdvancedFilterTypes;
    caller_id_number: AdvancedFilterTypes;
    destination_number: AdvancedFilterTypes;
    billsecond: AdvancedFilterTypes;
    disposition: AdvancedFilterTypes;
    direction: AdvancedFilterTypes;
    call_type: AdvancedFilterTypes;
    call_mode: AdvancedFilterTypes;
}

export interface LiveCallFilterTypes {
    callstart: AdvancedFilterTypes;
    tenant_uuid: AdvancedFilterTypes;
    user_uuid: AdvancedFilterTypes;
    caller_id_name: AdvancedFilterTypes;
    caller_id_number: AdvancedFilterTypes;
    destination_number: AdvancedFilterTypes;
    billsecond: AdvancedFilterTypes;
    call_type: AdvancedFilterTypes;
    trunk_uuid: AdvancedFilterTypes;
    status: AdvancedFilterTypes;
}

export interface OutgoingFilterTypes {
    name: AdvancedFilterTypes;
}

// ============= TENANT ADMIN ================


export interface ManagerFilterTypes {
    first_name: AdvancedFilterTypes;
    last_name: AdvancedFilterTypes;
    username: AdvancedFilterTypes;
    email: AdvancedFilterTypes;
    status: AdvancedFilterTypes;
    manager_role_uuid: AdvancedFilterTypes;
    extension_uuid: AdvancedFilterTypes;

}

export interface UserAdvanceFilterTypes {
    username: AdvancedFilterTypes;
    user_group_uuid: AdvancedFilterTypes;
    email: AdvancedFilterTypes;
}

export interface SipDevicesFilterTypes {
    device_name: AdvancedFilterTypes;
    username: AdvancedFilterTypes;
    user_uuid: AdvancedFilterTypes;
    devices: AdvancedFilterTypes;
}


export interface DidFilterTypes {
    number: AdvancedFilterTypes;
    timeout: AdvancedFilterTypes;
}

export interface MessagingChannelFilterTypes {
    name: AdvancedFilterTypes;
    type: AdvancedFilterTypes;
    provider: AdvancedFilterTypes;
}

export interface MessagingQueueFilterTypes {
    name: AdvancedFilterTypes;
    type: AdvancedFilterTypes;
}

export interface RingFilterTypes {
    name: AdvancedFilterTypes;
    type: AdvancedFilterTypes;
    timeout: AdvancedFilterTypes;
}

export interface IvrFilterTypes {
    name: AdvancedFilterTypes;
    timeout: AdvancedFilterTypes;
    invalid_retries: AdvancedFilterTypes;
}

export interface TenantRoleFilterTypes {
    name: AdvancedFilterTypes;
}

export interface UserRoleFilterTypes {
    name: AdvancedFilterTypes;
}

export interface PromptsFilterTypes {
    name: AdvancedFilterTypes;
}

export interface CallQueueFilterTypes {
    name: AdvancedFilterTypes;
    strategy: AdvancedFilterTypes;
}

export interface TimeConditionFilterTypes {
    name: AdvancedFilterTypes;
    failover_routing_type: AdvancedFilterTypes;
    failover_routing_options: AdvancedFilterTypes;
}

export interface UserGroupFilterTypes {
    name: AdvancedFilterTypes;
    outbound_rule: AdvancedFilterTypes;
}

export interface TenantTrunkAdvancedFilterTypes {
    name: AdvancedFilterTypes;
    domain: AdvancedFilterTypes;
}

export interface TenantOutgoingFilterTypes {
    name: AdvancedFilterTypes;
}

export interface ConferenceFilterTypes {
    name: AdvancedFilterTypes;
    pin: AdvancedFilterTypes;
}

export interface LeadFilterTypes {
    first_name: AdvancedFilterTypes;
    last_name: AdvancedFilterTypes;
    phone_number: AdvancedFilterTypes;
    phone_code: AdvancedFilterTypes;
    user_uuid: AdvancedFilterTypes;
    lead_group_uuid: AdvancedFilterTypes;
    lead_status: AdvancedFilterTypes;
    lead_status_1: AdvancedFilterTypes;
    lead_status_2: AdvancedFilterTypes;
    date_filter_type: AdvancedFilterTypes;
    start_date: AdvancedFilterTypes;
    end_date: AdvancedFilterTypes;
}

export interface LeadGroupFilterTypes {
    name: AdvancedFilterTypes;
    user_group_uuid: AdvancedFilterTypes;
}

export interface TenantReportFilterTypes {
    callstart: AdvancedFilterTypes;
    callend: AdvancedFilterTypes;
    customer_tenant_uuid: AdvancedFilterTypes;
}

export interface CampaignReportFilterTypes {
    callstart: AdvancedFilterTypes;
    callend: AdvancedFilterTypes;
    campaign_uuid: AdvancedFilterTypes;
}

export interface ManagerCampaignReportFilterTypes {
    start_date: AdvancedFilterTypes;
    end_date: AdvancedFilterTypes;
    campaign_uuid: AdvancedFilterTypes;
}

export interface VoiceBroadcastReportFilterTypes {
    start_date: AdvancedFilterTypes;
    end_date: AdvancedFilterTypes;
    disposition: AdvancedFilterTypes;
    voicebroadcast_uuid: AdvancedFilterTypes;
    type: AdvancedFilterTypes;

}

export interface MissedCallFilterTypes {
    callstart: AdvancedFilterTypes;
    callend: AdvancedFilterTypes;
    user_uuid: AdvancedFilterTypes;
    caller_id_number: AdvancedFilterTypes;
    destination_number: AdvancedFilterTypes;
}

export interface CallQueueReportFilterTypes {
    callstart: AdvancedFilterTypes;
    callend: AdvancedFilterTypes;
    user_uuid: AdvancedFilterTypes;
    caller_id_number: AdvancedFilterTypes;
    destination_number: AdvancedFilterTypes;
}

export interface DroppedCallsFilterTypes {
    callstart: AdvancedFilterTypes;
    callend: AdvancedFilterTypes;
    user_uuid: AdvancedFilterTypes;
    caller_id_number: AdvancedFilterTypes;
    destination_number: AdvancedFilterTypes;
}

export interface LoginLogoutFilterTypes {
    startDate: AdvancedFilterTypes;
    endDate: AdvancedFilterTypes;
    agent_uuid: AdvancedFilterTypes;
}

export interface TelecomCircleFilterTypes {
    name: AdvancedFilterTypes;
    prefix: AdvancedFilterTypes;
    status: AdvancedFilterTypes;
}


export interface BreakCodeFilterTypes {
    name: AdvancedFilterTypes;
    description: AdvancedFilterTypes;
    break_code: AdvancedFilterTypes;
    duration: AdvancedFilterTypes;
    status: AdvancedFilterTypes;
    billable: AdvancedFilterTypes;
}

export interface TenantCdrsFilterTypes {
    collection_name_for_display: AdvancedFilterTypes;
    callstart: AdvancedFilterTypes;
    callend: AdvancedFilterTypes;
    caller_id_name: AdvancedFilterTypes;
    caller_id_number: AdvancedFilterTypes;
    destination_number: AdvancedFilterTypes;
    billsecond: AdvancedFilterTypes;
    disposition: AdvancedFilterTypes;
    direction: AdvancedFilterTypes;
    call_type: AdvancedFilterTypes;
    call_mode: AdvancedFilterTypes;
    user_uuid: AdvancedFilterTypes;
    pbx_feature_uuid: AdvancedFilterTypes;
    campaign_uuid: AdvancedFilterTypes;
    // lead_group_name: AdvancedFilterTypes;
    // disconnected_by: AdvancedFilterTypes;
    // dial_method: AdvancedFilterTypes;
}
export interface TenantCsatFilterTypes {
    callstart: AdvancedFilterTypes;
    callend: AdvancedFilterTypes;
    caller_id_number: AdvancedFilterTypes;
    destination_number: AdvancedFilterTypes;
    // disposition: AdvancedFilterTypes;
    direction: AdvancedFilterTypes;
    user_uuid: AdvancedFilterTypes;
    campaign_uuid: AdvancedFilterTypes,
    collection_name_for_display:AdvancedFilterTypes
}

export interface IpMappingFilterTypes {
    ip: AdvancedFilterTypes;
    prefix: AdvancedFilterTypes;
}

export interface OutboundFilterTypes {
    name: AdvancedFilterTypes;
    dial_method: AdvancedFilterTypes;
    outgoing_rule_uuid: AdvancedFilterTypes;
}

export interface InboundFilterTypes {
    name: AdvancedFilterTypes;
    outgoing_rule_uuid: AdvancedFilterTypes;
}

export interface BlendedFilterTypes {
    name: AdvancedFilterTypes;
    dial_method: AdvancedFilterTypes;
    outgoing_rule_uuid: AdvancedFilterTypes;
}

export interface DncFilterTypes {
    phone_number: AdvancedFilterTypes;
    campaign_uuid: AdvancedFilterTypes;
}

export interface StateFilterTypes {
    state_name: AdvancedFilterTypes;
    state_code: AdvancedFilterTypes;
}

export interface AreaCodeFilterTypes {
    code: AdvancedFilterTypes;
    comment: AdvancedFilterTypes;
    type: AdvancedFilterTypes;
    state_id: AdvancedFilterTypes;
    timezone_uuid: AdvancedFilterTypes;
}

export interface voiceBroadcastFilterTypes {
    name: AdvancedFilterTypes;
    broadcast_start: AdvancedFilterTypes;
    broadcast_end: AdvancedFilterTypes;
}

export interface RecordingFilterTypes {
    callstart: AdvancedFilterTypes;
    callend: AdvancedFilterTypes;
    user_uuid: AdvancedFilterTypes;
    caller_id_number: AdvancedFilterTypes;
    destination_number: AdvancedFilterTypes;
    billsecond: AdvancedFilterTypes;
    campaign_uuid: AdvancedFilterTypes;
}

export interface UserPerformanceFilterTypes {
    startdate: AdvancedFilterTypes;
    enddate: AdvancedFilterTypes;
    user_uuid: AdvancedFilterTypes;
    direction: AdvancedFilterTypes;
    campaign_uuid: AdvancedFilterTypes;
}

export interface CallIdGroupFilterTypes {
    caller_id_group: AdvancedFilterTypes;
}


export interface WebFormFilterTypes {
    name: AdvancedFilterTypes;
    description: AdvancedFilterTypes;
    url: AdvancedFilterTypes;
}

export interface CustomFieldsFilterTypes {

    lead_group_uuid: AdvancedFilterTypes;
    field_label: AdvancedFilterTypes;
    field_name: AdvancedFilterTypes;
    field_type: AdvancedFilterTypes;

}

export interface StickyAgentReportFilterTypes {
    phone_number: AdvancedFilterTypes;
    user_uuid: AdvancedFilterTypes;
}
