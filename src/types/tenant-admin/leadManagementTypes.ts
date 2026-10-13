export interface DynamicFormFields {
    [key: string]: string | number | boolean | Date | any;
}

export interface InitialValueType {
    first_name: string
    last_name: string;
    phone_code: string;
    phone_number: string;
    lead_group_uuid: string;
    lead_status: string;
    country_uuid: string;
    address: string;
    status?: string;
    city: string;    
    state: string;
    province: string
    postal_code: string;
    dob: string;
    alternate_phone_number?: string;
    email: string;
    user_uuid: string
    gender: string;
    description: string;
    priority?: string;
    campaign_uuid?: string;
    campaign_name?: string;
    custom_fields?: DynamicFormFields;
};

export interface ImportInitialValueType {
    lead_group_uuid: string;
    filter_by?: string;
    file: string;
    phone_code: string;
    custom_fields?: DynamicFormFields;
}
