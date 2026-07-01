import { apiInstance } from "../../axiosApi";

export const createMailSchedule = async (payload: any) => {
    return await apiInstance.post("/mail-schedule", payload);
};

export const listMailSchedules = async (params: any) => {
    return await apiInstance.get("/mail-schedule", { params });
};

export const getMailSchedule = async (uuid: string) => {
    return await apiInstance.get(`/mail-schedule/${uuid}`);
};

export const deleteMailSchedule = async (uuid: string) => {
    return await apiInstance.delete(`/mail-schedule/${uuid}`);
};

export const updateMailSchedule = async (uuid: string, payload: any) => {
    return await apiInstance.put(`/mail-schedule/${uuid}`, payload);
};

export const updateMailScheduleStatus = async (payload: any) => {
    return await apiInstance.put(`/mail-schedule/status/update`, payload);
};

export const deleteMultipleMailSchedules = async (payload: any) => {
    return await apiInstance.delete(`/mail-schedule/multiple/delete`, { data: payload });
};
