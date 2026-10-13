export interface InitialValueType {
    role_name: string;
    status: string;

    user: string;
    is_user: boolean;
    user_group: string;
    is_user_group: boolean;
    user_role: string;
    is_user_role: boolean;
    extension: string;
    is_extension: boolean;
    zoho_id: string;
    is_zoho_id: boolean;


    trunk: string;
    is_trunk: boolean;
    og_rules: string;
    is_og_rules: boolean;
    call_id_group: string;
    is_call_id_group: boolean;

    did: string;
    is_did: boolean;
    ip_mapping: string;
    is_ip_mapping: boolean;
    click_to_Call: string;
    is_click_to_Call: boolean;
    rg: string;
    is_rg: boolean;
    ivr: string;
    is_ivr: boolean;
    tc: string;
    is_tc: boolean;
    cf: string;
    is_cf: boolean;
    cq: string;
    is_cq: boolean;
    fc: string;
    is_fc: boolean;
    block_ic: string;
    is_block_ic: boolean;

    leads: string;
    is_leads: boolean;
    lead_group: string;
    is_lead_group: boolean;
    follow_up: string;
    is_follow_up: boolean;
    custom_fields: string;
    is_custom_fields: boolean;
    lead_churning: string;
    is_lead_churning: boolean;

    oc: string;
    is_oc: boolean;
    ic: string;
    is_ic: boolean;
    bc: string;
    is_bc: boolean;
    td: string;
    is_td: boolean;
    dnc: string;
    is_dnc: boolean;

    vb: string;
    is_vb: boolean;


    whatsapp: string;
    is_whatsapp: boolean;
    instagram: string,
    is_instagram: boolean,

    facebook: string,
    is_facebook: boolean,

    sms: string;
    is_sms: boolean;


    cdrs: string;
    is_cdrs: boolean;
    lc: string;
    is_lc: boolean;
    missedcall: string;
    is_missedcall: boolean;
    rr: string;
    is_rr: boolean;
    lead_report: string;
    is_lead_report: boolean;
    campaign_report: string;
    is_campaign_report: boolean;
    voicebroadcast_report: string;
    is_voicebroadcast_report: boolean;
    up: string;
    is_up: boolean;
    loginLogout: string;
    is_loginLogout: boolean;
    voicemail: string;
    is_voicemail: boolean;
    sticky_agent_report: string;
    is_sticky_agent_report: boolean;
    recording: string;
    is_recording: boolean;
    omni_channel_report:string,
    is_omni_channel_report: boolean,
    csat_report:string,
    is_csat_report: boolean,


    prompts: string;
    is_prompts: boolean;
    e_smtp: string;
    is_e_smtp: boolean;
    telecomcircle: string;
    is_telecomcircle: boolean;
    breakcode: string;
    is_breakcode: boolean;
    ctc: string;
    is_ctc: boolean;
    webform: string;
    is_webform: boolean;



    crm: string;
    is_crm: boolean;
    // code: string;
    // is_code: boolean;
    api_key: string;
    is_api_key: boolean;
    webhooks: string;
    is_webhooks: boolean;

    google_drive: string;
    is_google_drive: boolean,
    google_sheet: string,
    is_google_sheet: boolean,

    cdrs_report: string;
    is_cdrs_report: boolean;

    activity_log: string;
    is_activity_log: boolean;

    pipeline: string;
    is_pipeline: boolean;

    mail_schedule: string;
    is_mail_schedule: boolean;
    
    email_configs: string;
    is_email_configs: boolean;
    email_templates: string;
    is_email_templates: boolean;
}

export interface BasicRoleTypes {
    title: string;
    name: string;
    min?: number;
    max?: number;
}

export interface AdvanceRoleTypes {
    title: string;
    name: string;
    switchName: string;
}
