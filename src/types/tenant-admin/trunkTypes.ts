export interface InitialValueType {
    name: string;
    sip_profile_uuid?: string;
    register: string;
    username: string;
    password: string;
    domain: string;
    outbound_proxy: string;
    status: string;

    from_domain: string;
    from_user: string;
    realm: string;
    extension_in_contact: string;
    extension: string;
    expire_seconds: string;
    reg_transport: string;
    contact_params: string;
    ping: string;
    retry_seconds: string;
    register_proxy: string;
    dialplan_variable: string;
}
