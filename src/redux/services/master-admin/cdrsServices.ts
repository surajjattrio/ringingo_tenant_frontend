// PROJECT IMPORTS
import { CDRS, CDRS_IVR_GROUP, CDRS_SEARCH, CDRS_QUARTELY_ARCHIVED_COLLECTIONS } from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== CDRS SERVICES ============================== */

export const cdrs = ( params: any ) => {
    return apiInstance.get( CDRS, { params } );
};

export const allCdrs = ( params?: any ) => {
    return apiInstance.get( CDRS, { params } );
};

export const searchCdrs = ( payload: any ) => {
    return apiInstance.post( CDRS_SEARCH, payload );
};

export const getIvrGroupList = () => {
    return apiInstance.get( CDRS_IVR_GROUP, { params: { list: "all" } } );
};

export const getCdrsArchiveList = () => {
    return apiInstance.get( CDRS_QUARTELY_ARCHIVED_COLLECTIONS, { params: { list: "all" } } );
};
