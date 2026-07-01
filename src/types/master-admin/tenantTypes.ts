export interface InitialValueType {
    tenant_name: string;
    username: string;
    password: string;
    domain: string;
    status: string;
    time_zone_uuid: string;
    role_uuid: string;
    country_uuid: string;
    email: string;
    sip_profile_uuid: string;
    outgoing_rule_uuid: string;
    account_code: string;
    concurrent_calls:string;
    add_anonymous_lead: string;
    system_disposition: string;
    company_code: string;
    mobile_number?: string;
    vendor_uid?: string;
    vendor_token?: string;
}
