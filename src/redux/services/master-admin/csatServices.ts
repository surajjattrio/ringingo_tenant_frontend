// PROJECT IMPORTS
import { CSAT_REPORT } from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";
import { createAsyncThunk } from "@reduxjs/toolkit";

/* ============================== CDRS SERVICES ============================== */

export const getCsatReport = ( params: any ) => {
    return apiInstance.post( CSAT_REPORT, { params } );
};


