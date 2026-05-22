import { INBOUND_CALL_DEBUG_SNAPSHOT, INBOUND_CALL_DEBUG_FORM_OPTIONS } from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

export type InboundCallDebugParams = {
  campaign_uuid: string;
  extension?: string;
  user_uuid?: string;
  call_queue_uuid?: string;
};

export const getInboundCallDebugSnapshot = ( params: InboundCallDebugParams ) => {
  return apiInstance.get( INBOUND_CALL_DEBUG_SNAPSHOT, { params } );
};

export const getInboundCallDebugFormOptions = ( params?: { campaign_uuid?: string } ) => {
  return apiInstance.get( INBOUND_CALL_DEBUG_FORM_OPTIONS, { params } );
};
