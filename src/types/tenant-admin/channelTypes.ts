export interface InitialValueType {
    name: string;
    user_uuid: string
    type: string;
    provider: string;
    status: string;
    token:string,
    verify_token:string,
    whatsapp_business_account_id:string,
    phone_number_id:string,
    from_number:string,
    instagram_business_account_id:string,
    facebook_page_id:string
};

export interface InitialQueueValueType {
    name: string;
    user_uuid: string
    type: string;
    status: string;
};