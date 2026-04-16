export interface InitialValueType {
    phone_number: string;
    campaign_uuid: string;
    status?: string;
    concurrent_cam:string;
    global_status: string;
};

export interface ImportInitialValueType {
  //  user_uuid: string;
    file: string;
}
