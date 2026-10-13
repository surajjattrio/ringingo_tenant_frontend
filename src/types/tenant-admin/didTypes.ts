export interface InitialValueType {
    number: string;
    status: string;
    timeout: string;
    codec: string;
    user_uuid: string;
    did_as_cid: string;
    name: string;
}

export interface ForwardingInitialValueType {
    did_forwarding_type: string;
    did_forwarding_value: string;
}

export interface ImportInitialValueType {
    user_uuid: string;
    file: string;
}
