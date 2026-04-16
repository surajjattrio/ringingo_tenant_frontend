export interface InitialValueType {
    username: string;
    fullname: string;
    email: string;
    password: string;
    default_timeout: string;
    user_role_uuid: string;
    user_group_uuid: string;
    // sms_messaging_channel_uuid: string;
    // whatsapp_messaging_channel_uuid: string;
    recording?: string;
    status?: string;
    extension_type: string;
    default_extension: string;
    zoho_user_id: string;
    campaign_uuid: string;
    allowed_campaign:any;
    omni_messaging_channel_uuid:any
    create_sip_device:any
    caller_id_name: any
    caller_id_number: any
}
