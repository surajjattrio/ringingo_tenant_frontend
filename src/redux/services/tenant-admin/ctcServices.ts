// PROJECT IMPORTS
import { CTC_DIAL, CTC_HISTORY } from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== CTC (CLICK TO CALL DIALER) SERVICES ==============================
 * Bridges a tenant agent (extension or trunk) to a customer number.
 * NOTE: `CTC_DIAL` / `CTC_HISTORY` are placeholder paths on the tenant backend
 * (`apiInstance`, same as every other module here) which is expected to proxy the
 * request to the PBX click-to-call API. Update the paths / payload mapping below
 * once the real backend contract is confirmed.
 * ================================================================================================ */

export const ctcDial = (payload: any) => {
  return apiInstance.post(CTC_DIAL, payload);
};

export const ctcHistory = (params?: any) => {
  return apiInstance.get(CTC_HISTORY, { params });
};
