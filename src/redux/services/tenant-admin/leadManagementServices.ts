// PROJECT IMPORTS
import {
    LEAD_MANAGEMENT,
    LEAD_MANAGEMENT_CUSTOM_FIELDS,
    LEAD_MANAGEMENT_BATCH_UPDATE,
    LEAD_MANAGEMENT_DISTRIBUTION,
    LEAD_MANAGEMENT_IMPORT,
    LEAD_MANAGEMENT_IMPORT_MAPPER,
    LEAD_MANAGEMENT_INFORMATION,
    LEAD_MANAGEMENT_SEARCH,
    NOTES,
    LEAD_MANAGEMENT_CREATE_NEW,
    LEAD_MANAGEMENT_UPDATE_NEW,
} from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ============================== LEAD - MANAGEMENT SERVICES ============================== */

export const lead = (params: any) => {
    return apiInstance.get(LEAD_MANAGEMENT, { params });
};

export const singleLead = (id: string) => {
    return apiInstance.get(LEAD_MANAGEMENT + `/${id}`);
};

export const singleLeadCustomFields = (id: string) => {
    return apiInstance.get(LEAD_MANAGEMENT_CUSTOM_FIELDS + `/${id}`);
};

export const allLead = () => {
    return apiInstance.get(LEAD_MANAGEMENT);
};

export const searchLead = (payload: any) => {
    return apiInstance.post(LEAD_MANAGEMENT_SEARCH, payload);
};

export const createLead = (payload: any) => {
    return apiInstance.post(LEAD_MANAGEMENT, payload);
};

export const createNewLead = (payload: any) => {
    return apiInstance.post(LEAD_MANAGEMENT_CREATE_NEW, payload);
};

export const singleLeadInfo = (id: string) => {
    return apiInstance.get(LEAD_MANAGEMENT_INFORMATION + `/${id}`);
};

export const importMapperLead = (payload: any) => {
    return apiInstance.post(LEAD_MANAGEMENT_IMPORT_MAPPER, payload);
};

export const distributionLead = (payload: any) => {
    return apiInstance.post(LEAD_MANAGEMENT_DISTRIBUTION, payload);
};

export const updateLead = (id: string, payload: any) => {
    return apiInstance.put(LEAD_MANAGEMENT + `/${id}`, payload);
};

export const updateNewLead = (id: string, payload: any) => {
    return apiInstance.put(LEAD_MANAGEMENT_UPDATE_NEW + `/${id}`, payload);
};

export const updateLeadStatus = (id: string, payload: any) => {
    return apiInstance.patch(LEAD_MANAGEMENT + `/${id}`, payload);
};

export const deleteLead = (id: string) => {
    return apiInstance.delete(LEAD_MANAGEMENT + `/${id}`);
};

export const batchUpdate = (payload: any) => {
    return apiInstance.patch(LEAD_MANAGEMENT_BATCH_UPDATE, payload);
};

export const importLeadManagement = (payload: any) => {
    return apiInstance.post(LEAD_MANAGEMENT_IMPORT, payload);
};

export const notesGet = (uuid: string) => {
    return apiInstance.get(NOTES + `/${uuid}`);
};

export const noteCreate = (payload: any) => {
    return apiInstance.post(NOTES, payload);
};
