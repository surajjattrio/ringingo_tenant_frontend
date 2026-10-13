export interface InitialValueType {
    role_name: string;
    status: string;

    //User Module
    user: string;
    is_user: boolean;
    is_create_user: boolean;
    is_list_user: boolean;
    is_edit_user: boolean;
    is_delete_user: boolean;
    is_add_user: boolean;
    add_user_value: any[];

    //User Group Module
    user_group: string;
    is_user_group: boolean;
    is_create_user_group: boolean;
    is_list_user_group: boolean;
    is_edit_user_group: boolean;
    is_delete_user_group: boolean;

    //User Role Module
    user_role: string;
    is_user_role: boolean;
    is_create_user_role: boolean;
    is_list_user_role: boolean;
    is_edit_user_role: boolean;
    is_delete_user_role: boolean;

    //Extension Module
    extension: string;
    is_extension: boolean;
    is_create_extension: boolean;
    is_list_extension: boolean;
    is_edit_extension: boolean;
    is_delete_extension: boolean;
    is_add_extension: boolean;
    add_extension_value: any[];

    //Trunk Module
    trunk: string;
    is_trunk: boolean;
    is_create_trunk: boolean;
    is_list_trunk: boolean;
    is_edit_trunk: boolean;
    is_delete_trunk: boolean;

    //Outgoing Rules Module
    og_rules: string;
    is_og_rules: boolean;
    is_create_og_rules: boolean;
    is_list_og_rules: boolean;
    is_edit_og_rules: boolean;
    is_delete_og_rules: boolean;

    //Caller ID Group Module
    call_id_group: string;
    is_call_id_group: boolean;
    is_create_call_id_group: boolean;
    is_list_call_id_group: boolean;
    is_edit_call_id_group: boolean;
    is_delete_call_id_group: boolean;

    //DID module
    did: string;
    is_did: boolean;
    is_create_did: boolean;
    is_list_did: boolean;
    is_edit_did: boolean;
    is_delete_did: boolean;

    //IP Mapping module
    ip_mapping: string;
    is_ip_mapping: boolean;
    is_create_ip_mapping: boolean;
    is_list_ip_mapping: boolean;
    is_edit_ip_mapping: boolean;
    is_delete_ip_mapping: boolean;

    //Click To Call Module 
    click_to_Call: string;
    is_click_to_Call: boolean;
    is_create_click_to_Call: boolean;
    is_list_click_to_Call: boolean;
    is_edit_click_to_Call: boolean;
    is_delete_click_to_Call: boolean;

    //Ring Group Module
    rg: string;
    is_rg: boolean;
    is_create_rg: boolean;
    is_list_rg: boolean;
    is_edit_rg: boolean;
    is_delete_rg: boolean;

    //IVR Module
    ivr: string;
    is_ivr: boolean;
    is_create_ivr: boolean;
    is_list_ivr: boolean;
    is_edit_ivr: boolean;
    is_delete_ivr: boolean;

    //Time Condition Module
    tc: string;
    is_tc: boolean;
    is_create_tc: boolean;
    is_list_tc: boolean;
    is_edit_tc: boolean;
    is_delete_tc: boolean;

    //Conference Module
    cf: string;
    is_cf: boolean;
    is_create_cf: boolean;
    is_list_cf: boolean;
    is_edit_cf: boolean;
    is_delete_cf: boolean;

    //Call Queue Module
    cq: string;
    is_cq: boolean;
    is_create_cq: boolean;
    is_list_cq: boolean;
    is_edit_cq: boolean;
    is_delete_cq: boolean;

    //Feature Code Module
    fc: string;
    is_fc: boolean;
    is_create_fc: boolean;
    is_list_fc: boolean;
    is_edit_fc: boolean;
    is_delete_fc: boolean;

    //Block Inbound Calls
    block_ic: string;
    is_block_ic: boolean;
    is_create_block_ic: boolean;
    is_list_block_ic: boolean;
    is_edit_block_ic: boolean;
    is_delete_block_ic: boolean;

    //Lead Management Module
    leads: string;
    is_leads: boolean;
    is_create_leads: boolean;
    is_list_leads: boolean;
    is_edit_leads: boolean;
    is_delete_leads: boolean;

    //Lead Group Module   
    lead_group: string;
    is_lead_group: boolean;
    is_create_lead_group: boolean;
    is_list_lead_group: boolean;
    is_edit_lead_group: boolean;
    is_delete_lead_group: boolean;

    //Follow Up Module
    follow_up: string;
    is_follow_up: boolean;
    is_create_follow_up: boolean;
    is_list_follow_up: boolean;
    is_edit_follow_up: boolean;
    is_delete_follow_up: boolean;

      //custom fields Module
    custom_fields: string;
    is_custom_fields: boolean;
    is_create_custom_fields: boolean;
    is_list_custom_fields: boolean;
    is_edit_custom_fields: boolean;
    is_delete_custom_fields: boolean;

    //Outbound Campaign Module
    oc: string;
    is_oc: boolean;
    is_create_oc: boolean;
    is_list_oc: boolean;
    is_edit_oc: boolean;
    is_delete_oc: boolean;
    is_add_oc: boolean;
    add_oc_value: any[];

    //Inbound Campaign Module
    ic: string;
    is_ic: boolean;
    is_create_ic: boolean;
    is_list_ic: boolean;
    is_edit_ic: boolean;
    is_delete_ic: boolean;
    is_add_ic: boolean;
    add_ic_value: any[];

    //Blended Campaign Module
    bc: string;
    is_bc: boolean;
    is_create_bc: boolean;
    is_list_bc: boolean;
    is_edit_bc: boolean;
    is_delete_bc: boolean;
    is_add_bc: boolean;
    add_bc_value: any[];

    //Disposition Module
    td: string;
    is_td: boolean;
    is_create_td: boolean;
    is_list_td: boolean;
    is_edit_td: boolean;
    is_delete_td: boolean;

    //DNC Module
    dnc: string;
    is_dnc: boolean;
    is_create_dnc: boolean;
    is_list_dnc: boolean;
    is_edit_dnc: boolean;
    is_delete_dnc: boolean;

    //Voice Broadcasting Module
    vb: string;
    is_vb: boolean;
    is_create_vb: boolean;
    is_list_vb: boolean;
    is_edit_vb: boolean;
    is_delete_vb: boolean;


    //Cdrs Module
    cdrs: string;
    is_cdrs: boolean;
    is_list_cdrs: boolean;

    //Live Module
    lc: string;
    is_lc: boolean;
    is_list_lc: boolean;

    //Realtime Report Module
    rr: string;
    is_rr: boolean;
    is_list_rr: boolean;

    //Lead Report Module
    lead_report: string;
    is_lead_report: boolean;
    is_list_lead_report: boolean;

    //Campaign Report Module
    campaign_report: string;
    is_campaign_report: boolean;
    is_list_campaign_report: boolean;

    //Voicebroadcast report Module
    voicebroadcast_report: string;
    is_voicebroadcast_report: boolean;
    is_list_voicebroadcast_report: boolean;

       //Missed Call report Module
    missedcall: string;
    is_missedcall: boolean;
    is_list_missedcall: boolean;

    //Login Logout report Module
    loginLogout: string;
    is_loginLogout: boolean;
    is_list_loginLogout: boolean;

    //User Perfomance Module
    up: string;
    is_up: boolean;
    is_list_up: boolean;

    //Voicemail Module
    voicemail: string;
    is_voicemail: boolean;
    is_list_voicemail: boolean;

    //Recording Module
    recording: string;
    is_recording: boolean;
    is_list_recording: boolean;

    prompts: string;
    is_prompts: boolean;
    is_list_prompts : boolean;
    is_create_prompts: boolean;
    is_edit_prompts: boolean;
    is_delete_prompts: boolean;
    
    e_smtp: string;
    is_e_smtp: boolean;
   // is_create_e_smtp: boolean;
    is_list_e_smtp: boolean;
   // is_edit_e_smtp: boolean;
   // is_delete_e_smtp: boolean;

        telecomcircle: string;
    is_telecomcircle: boolean;
    is_create_telecomcircle: boolean;
    is_list_telecomcircle: boolean;
    is_edit_telecomcircle: boolean;
    is_delete_telecomcircle: boolean;


    breakcode: string;
    is_breakcode: boolean;
    is_list_breakcode : boolean;
    is_create_breakcode: boolean;
    is_edit_breakcode: boolean;
    is_delete_breakcode: boolean;

    ctc: string;
    is_ctc: boolean;
    is_list_ctc: boolean;
    is_create_ctc: boolean;
    is_edit_ctc: boolean;
    is_delete_ctc: boolean;

        webform: string;
    is_webform: boolean;
    is_create_webform: boolean;
    is_list_webform: boolean;
    is_edit_webform: boolean;
    is_delete_webform: boolean;
    
    crm: string;
    is_crm: boolean;
  is_create_crm: boolean;
    is_list_crm: boolean;
    is_edit_crm: boolean;
    is_delete_crm: boolean;

    api_key: string;
    is_api_key: boolean;
      is_create_api_key: boolean;
    is_list_api_key: boolean;
    is_edit_api_key: boolean;
    is_delete_api_key: boolean;


    webhooks: string;
    is_webhooks: boolean;
      is_create_webhooks: boolean;
    is_list_webhooks: boolean;
    is_edit_webhooks: boolean;
    is_delete_webhooks: boolean;


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

