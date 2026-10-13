export interface InitialValueType {
    name: string;
    status: string;
    pbx_mode: string;
    call_center_mode: string;
    call_report: string;
    login_logout_report: string;
    recording: string;
    follow_up: string;
    sticky_agent: string;
    number_masking: string;
    settings: string;
    breakcode: string;
    allow_black_list: string;
    whatsapp:string;
    instagram:string,
    facebook:string,
    sms:string;
    unallocated_leads:string;
    force_login:string;
    auto_logout:string;
    idle_timeout:string;
    callqueue_selection:string;
    bot_lead_info:string;
    is_lead_edit?:string;
    knowledge_base?:string;
}
