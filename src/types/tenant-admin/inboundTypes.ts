export interface InitialValueType {
    name: string;
    outgoing_rule_uuid: string;
    status?: string;

    description: string;
    call_queue_uuid: [];
    recording: string;
    number_masking: string;
    allow_ring_group_transfer: [];
    allow_call_queue_transfer: [];
    allow_ivr_transfer: [];
    three_way_caller_id: string;
    custom_caller_id: string;
    wrap_up_disposition: any;
    wrap_up_time: any;


    webform_uuid: any;
    auto_answer: string;
    agent_script: string;
    agent_script_text: string;
    
    email_config_uuid: string;
    api_config_uuid: string;
    email_type: string;
    message_config_uuid?: string;
}
