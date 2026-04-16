export interface InitialValueType {
    name: string;
    status: string;
    user: string;
    sub_tenant: string;
    sub_tenant_role: string;
    extension: string;
    did: string;
    ip_mapping: string;
    trunk: string;
    agent_group: string;
    call_id_group: string;
    prompts: string;
    concurrent_call: string;
    isrg_count_role: boolean;
    rg: string;
    isivr_count_role: boolean;
    ivr: string;
    istc_count_role: boolean;
    tc: string;
    isfc_count_role: boolean;
    fc: string;
    iscc_count_role: boolean;
    cc: string;
    iscf_count_role: boolean;
    cf: string;
    iscq_count_role: boolean;
    cq: string;
    isoc_count_role: boolean;
    oc: string;
    isic_count_role: boolean;
    ic: string;
    isbc_count_role: boolean;
    bc: string;
    islg_count_role: boolean;
    lg: string;
    islm_count_role: boolean;
    lm: string;
    isdnc_count_role: boolean;
    dnc: string;
}

export interface BasicRoleTypes {
    title: string;
    name: string;
}

export interface PbxRoleTypes {
    title: string;
    name: string;
    switchName: string;
}
export interface CallCenterRoleTypes {
    title: string;
    name: string;
    switchName: string;
}
