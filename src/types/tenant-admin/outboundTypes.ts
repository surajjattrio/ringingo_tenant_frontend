export interface InitialValueType {
    name: string;
    dial_method: string;
    lead_group_uuid: string;
    outgoing_rule_uuid: string;
    lead_type: string;
    status?: string;

    call_id_type: string;
    call_id_value: string;
    description: string;
    concurrent_call: string;
    call_retries: string;
    timeout: string;
    agent_timeout: string;
    max_dial_level: string;
    greeting_uuid: string;
    recording: string;
    number_masking: string;
    max_retries: string;
    retries_time: string;
    caller_id_time: string;
    three_way_caller_id: string;
    custom_caller_id: string;
    call_queue_uuid: any;
    ring_group_uuid: any;
    allow_ring_group_transfer: any;
    allow_call_queue_transfer: any;
    allow_ivr_transfer: any;
    max_retries_disposition: any;
    wrap_up_disposition: any;
    wrap_up_time: any;
    target_drop_percentage: string;
    max_predictive_call_count: string;
    answering_machine_detection: string;
    cps: string;
    amd_promptuuid: string;
    manual_outgoing_rule_uuid: string;
    threeway_outgoing_rule_uuid: string;
    webform_uuid  : any;
    auto_answer: string;
    agent_script: string;
    agent_script_text: string;

        human_answer?: string;
    sale?: string;

}
