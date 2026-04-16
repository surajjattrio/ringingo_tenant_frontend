export interface InitialValueType {
    number: string;
    codec: string;
    timeout: string;
    status: string;
    assign_tenant_uuid: string;
}

export interface ImportInitialValueType {
    assign_tenant_uuid: string;
    file: string;
}
