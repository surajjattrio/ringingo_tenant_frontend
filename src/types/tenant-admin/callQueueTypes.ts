export interface InitialValueType {
    name: string;
    status: string;
    // sticky_agent: string;
    strategy: string;
    user_uuid: string;
    call_waiting_greeting_uuid: string;
    call_welcome_greeting_uuid: string;
    timeout: string;
    agent_timeout: string;
    for_pbx: string;
    failover_routing_type?: string;
    failover_routing_options?: string;
    fail_over_routing_name?: string;
};