import { PIPELINE_BOARD, PIPELINE_IMPORT, PIPELINE_LEAD, PIPELINE_STAGE, PIPELINE_ASSIGNMENT_CONFIG, PIPELINE_DISTRIBUTE_EXISTING, PIPELINE_LEAD_BULK_DELETE, PIPELINE_LEAD_BULK_UPDATE } from "@/API/constAPI";
import { apiInstance } from "../../axiosApi";

/* ══════════════════════════════════════════
   PIPELINE STAGE SERVICES
══════════════════════════════════════════ */

export const getPipelineBoard = (params: any) => {
    return apiInstance.get(PIPELINE_BOARD, { params });
};

export const getAllPipelineStages = (params: any) => {
    return apiInstance.get(PIPELINE_STAGE, { params });
};

export const createPipelineStage = (payload: any) => {
    return apiInstance.post(PIPELINE_STAGE, payload);
};

export const updatePipelineStage = (uuid: string, payload: any) => {
    return apiInstance.put(PIPELINE_STAGE + `/${uuid}`, payload);
};

export const deletePipelineStage = (uuid: string) => {
    return apiInstance.delete(PIPELINE_STAGE + `/${uuid}`);
};

/* ══════════════════════════════════════════
   PIPELINE LEAD SERVICES
══════════════════════════════════════════ */

export const createPipelineLead = (payload: any) => {
    return apiInstance.post(PIPELINE_LEAD, payload);
};

export const getPipelineLeadsByStage = (stageUuid: string, params?: any) => {
    return apiInstance.get(PIPELINE_LEAD + `/${stageUuid}`, { params });
};

export const updatePipelineLead = (uuid: string, payload: any) => {
    return apiInstance.put(PIPELINE_LEAD + `/${uuid}`, payload);
};

export const movePipelineLead = (uuid: string, stage_uuid: string) => {
    return apiInstance.patch(PIPELINE_LEAD + `/${uuid}/move`, { stage_uuid });
};

export const deletePipelineLead = (uuid: string) => {
    return apiInstance.delete(PIPELINE_LEAD + `/${uuid}`);
};

/* ══════════════════════════════════════════
   IMPORT LEADS SERVICE
══════════════════════════════════════════ */

export const importPipelineLeads = (payload: any) => {
    return apiInstance.post(PIPELINE_IMPORT, payload);
};

/* ══════════════════════════════════════════
   AUTO-ASSIGN CONFIG SERVICES
══════════════════════════════════════════ */

export const getAssignmentConfig = (tenant_uuid: string) => {
    return apiInstance.get(PIPELINE_ASSIGNMENT_CONFIG, { params: { tenant_uuid } });
};

export const upsertAssignmentConfig = (payload: any) => {
    return apiInstance.put(PIPELINE_ASSIGNMENT_CONFIG, payload);
};

export const distributeExistingPipelineLeads = (payload: { tenant_uuid: string }) => {
    return apiInstance.post(PIPELINE_DISTRIBUTE_EXISTING, payload);
};

export const bulkDeletePipelineLeads = (lead_uuids: string[]) => {
    return apiInstance.post(PIPELINE_LEAD_BULK_DELETE, { lead_uuids });
};

export const bulkUpdatePipelineLeads = (payload: any) => {
    return apiInstance.post(PIPELINE_LEAD_BULK_UPDATE, payload);
};

