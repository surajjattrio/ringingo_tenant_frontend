import { REQUEST_SCHEDULER_CREATE,  REQUEST_SCHEDULER, REQUEST_SCHEDULER_DELETE } from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== SCHEDULE REPORT SERVICES ============================== */

export const createScheduleReport = (payload: any) => {
    return apiInstance.post(REQUEST_SCHEDULER_CREATE, payload);
};

export const listScheduleReports = (params: any) => {
    return apiInstance.get(REQUEST_SCHEDULER, { params });
};

export const updateScheduleReport = (uuid: string, payload: any) => {
    return apiInstance.put(`${REQUEST_SCHEDULER}/${uuid}`, payload);
};

export const deleteScheduleReport = (uuid: string) => {
    return apiInstance.delete(`${REQUEST_SCHEDULER_DELETE}/${uuid}`);
};
