export interface InitialValueType {
  code: string;
  state_id?: string;
  comment: string;
  type: string;
  start_time: any,
  end_time: any,
  timezone_uuid: string;
  day_light_toggle: string;
};

export interface ImportInitialValueType {
  // state_id: string;
  timezone_uuid: string;
  file: string;
}
