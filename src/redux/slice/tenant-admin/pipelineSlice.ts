import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";
import {
    createPipelineLead,
    createPipelineStage,
    deletePipelineLead,
    deletePipelineStage,
    getPipelineBoard,
    importPipelineLeads,
    movePipelineLead,
    updatePipelineLead,
    updatePipelineStage,
    getAssignmentConfig,
    upsertAssignmentConfig,
    distributeExistingPipelineLeads,
    bulkDeletePipelineLeads,
    bulkUpdatePipelineLeads,
} from "@/redux/services/tenant-admin/pipelineServices";

/* ─────────── STATE ─────────── */
interface PipelineState {
    isLoading: boolean;
    boardData: any[];
    totalLeads: number;
    assignmentConfig: any | null;
    assignmentConfigLoading: boolean;
}

const initialState: PipelineState = {
    isLoading: false,
    boardData: [],
    totalLeads: 0,
    assignmentConfig: null,
    assignmentConfigLoading: false,
};

/* ─────────── ASYNC THUNKS ─────────── */

export const pipelineBoardGet = createAsyncThunk(
    "pipeline/board-get",
    async (params: any, { rejectWithValue }) => {
        try {
            const res: any = await getPipelineBoard(params);
            if (res?.statusCode && res.statusCode >= 400) return rejectWithValue(res.message);
            return res;
        } catch (err: any) {
            return rejectWithValue(err?.response?.data?.message || err?.message);
        }
    }
);

export const pipelineStageCreate = createAsyncThunk(
    "pipeline/stage-create",
    async (payload: any, { rejectWithValue }) => {
        try {
            const res: any = await createPipelineStage(payload);
            if (res?.statusCode && res.statusCode >= 400) return rejectWithValue(res.message);
            return res;
        } catch (err: any) {
            return rejectWithValue(err?.response?.data?.message || err?.message);
        }
    }
);

export const pipelineStageUpdate = createAsyncThunk(
    "pipeline/stage-update",
    async (payload: any, { rejectWithValue }) => {
        try {
            const { uuid, ...rest } = payload;
            const res: any = await updatePipelineStage(uuid, rest);
            if (res?.statusCode && res.statusCode >= 400) return rejectWithValue(res.message);
            return res;
        } catch (err: any) {
            return rejectWithValue(err?.response?.data?.message || err?.message);
        }
    }
);

export const pipelineStageDelete = createAsyncThunk(
    "pipeline/stage-delete",
    async (uuid: string, { rejectWithValue }) => {
        try {
            const res: any = await deletePipelineStage(uuid);
            if (res?.statusCode && res.statusCode >= 400) return rejectWithValue(res.message);
            return res;
        } catch (err: any) {
            return rejectWithValue(err?.response?.data?.message || err?.message);
        }
    }
);

export const pipelineLeadCreate = createAsyncThunk(
    "pipeline/lead-create",
    async (payload: any, { rejectWithValue }) => {
        try {
            const res: any = await createPipelineLead(payload);
            if (res?.statusCode && res.statusCode >= 400) return rejectWithValue(res.message);
            return res;
        } catch (err: any) {
            return rejectWithValue(err?.response?.data?.message || err?.message);
        }
    }
);

export const pipelineLeadUpdate = createAsyncThunk(
    "pipeline/lead-update",
    async (payload: any, { rejectWithValue }) => {
        try {
            const { uuid, ...rest } = payload;
            const res: any = await updatePipelineLead(uuid, rest);
            if (res?.statusCode && res.statusCode >= 400) return rejectWithValue(res.message);
            return res;
        } catch (err: any) {
            return rejectWithValue(err?.response?.data?.message || err?.message);
        }
    }
);

export const pipelineLeadMove = createAsyncThunk(
    "pipeline/lead-move",
    async (payload: { uuid: string; stage_uuid: string }, { rejectWithValue }) => {
        try {
            const res: any = await movePipelineLead(payload.uuid, payload.stage_uuid);
            if (res?.statusCode && res.statusCode >= 400) return rejectWithValue(res.message);
            return res;
        } catch (err: any) {
            return rejectWithValue(err?.response?.data?.message || err?.message);
        }
    }
);

export const pipelineLeadDelete = createAsyncThunk(
    "pipeline/lead-delete",
    async (uuid: string, { rejectWithValue }) => {
        try {
            const res: any = await deletePipelineLead(uuid);
            if (res?.statusCode && res.statusCode >= 400) return rejectWithValue(res.message);
            return res;
        } catch (err: any) {
            return rejectWithValue(err?.response?.data?.message || err?.message);
        }
    }
);

export const pipelineLeadsImport = createAsyncThunk(
    "pipeline/leads-import",
    async (payload: any, { rejectWithValue }) => {
        try {
            const res: any = await importPipelineLeads(payload);
            if (res?.statusCode && res.statusCode >= 400) return rejectWithValue(res.message);
            return res;
        } catch (err: any) {
            return rejectWithValue(err?.response?.data?.message || err?.message);
        }
    }
);

export const pipelineAssignmentConfigGet = createAsyncThunk(
    "pipeline/assignment-config-get",
    async (tenant_uuid: string, { rejectWithValue }) => {
        try {
            const res: any = await getAssignmentConfig(tenant_uuid);
            if (res?.statusCode && res.statusCode >= 400) return rejectWithValue(res.message);
            return res;
        } catch (err: any) {
            return rejectWithValue(err?.response?.data?.message || err?.message);
        }
    }
);

export const pipelineAssignmentConfigSave = createAsyncThunk(
    "pipeline/assignment-config-save",
    async (payload: any, { rejectWithValue }) => {
        try {
            const res: any = await upsertAssignmentConfig(payload);
            if (res?.statusCode && res.statusCode >= 400) return rejectWithValue(res.message);
            return res;
        } catch (err: any) {
            return rejectWithValue(err?.response?.data?.message || err?.message);
        }
    }
);

export const pipelineDistributeExistingLeads = createAsyncThunk(
    "pipeline/distribute-existing",
    async (tenant_uuid: string, { rejectWithValue }) => {
        try {
            const res: any = await distributeExistingPipelineLeads({ tenant_uuid });
            if (res?.statusCode && res.statusCode >= 400) return rejectWithValue(res.message);
            return res;
        } catch (err: any) {
            return rejectWithValue(err?.response?.data?.message || err?.message);
        }
    }
);

export const pipelineLeadBulkDelete = createAsyncThunk(
    "pipeline/lead-bulk-delete",
    async (lead_uuids: string[], { rejectWithValue }) => {
        try {
            const res: any = await bulkDeletePipelineLeads(lead_uuids);
            if (res?.statusCode && res.statusCode >= 400) return rejectWithValue(res.message);
            return res;
        } catch (err: any) {
            return rejectWithValue(err?.response?.data?.message || err?.message);
        }
    }
);

export const pipelineLeadBulkUpdate = createAsyncThunk(
    "pipeline/lead-bulk-update",
    async (payload: any, { rejectWithValue }) => {
        try {
            const res: any = await bulkUpdatePipelineLeads(payload);
            if (res?.statusCode && res.statusCode >= 400) return rejectWithValue(res.message);
            return res;
        } catch (err: any) {
            return rejectWithValue(err?.response?.data?.message || err?.message);
        }
    }
);



/* ─────────── SLICE ─────────── */
const pipelineSlice = createSlice({
    name: "pipeline",
    initialState,
    reducers: {
        clearPipeline: () => initialState,
    },
    extraReducers: (builder) => {
        /* ── board get ── */
        builder
            .addCase(pipelineBoardGet.pending, (state) => { state.isLoading = true; })
            .addCase(pipelineBoardGet.fulfilled, (state, action: PayloadAction<any>) => {
                state.boardData = action.payload?.data ?? [];
                state.totalLeads = (action.payload?.data ?? []).reduce(
                    (sum: number, stage: any) => sum + (stage.leadsCount ?? 0), 0
                );
                state.isLoading = false;
            })
            .addCase(pipelineBoardGet.rejected, (state) => { state.isLoading = false; });

        /* ── stage create ── */
        builder.addCase(pipelineStageCreate.fulfilled, (state, action: PayloadAction<any>) => {
            if (action.payload?.data) {
                const newStage = { ...action.payload.data, leads: [], leadsCount: 0 };
                state.boardData = [...state.boardData, newStage];
            }
        });

        /* ── stage update ── */
        builder.addCase(pipelineStageUpdate.fulfilled, (state, action: PayloadAction<any>) => {
            const updated = action.payload?.data;
            if (!updated) return;
            state.boardData = state.boardData.map((s) => {
                if (s.stage_uuid === updated.stage_uuid) {
                    return { ...s, ...updated, leads: s.leads ?? [], leadsCount: s.leadsCount ?? 0 };
                }
                return s;
            });
        });

        /* ── stage delete ── */
        builder.addCase(pipelineStageDelete.fulfilled, (state, action: any) => {
            const uuid = action.meta?.arg;
            state.boardData = state.boardData.filter((s) => s.stage_uuid !== uuid);
        });

        /* ── lead create ── */
        builder.addCase(pipelineLeadCreate.fulfilled, (state, action: PayloadAction<any>) => {
            const lead = action.payload?.data;
            if (!lead) return;
            state.boardData = state.boardData.map((stage) => {
                if (stage.stage_uuid === lead.stage_uuid) {
                    return {
                        ...stage,
                        leads: [lead, ...(stage.leads ?? [])],
                        leadsCount: (stage.leadsCount ?? 0) + 1,
                    };
                }
                return stage;
            });
            state.totalLeads = state.totalLeads + 1;
        });

        /* ── lead update ── */
        builder.addCase(pipelineLeadUpdate.fulfilled, (state, action: PayloadAction<any>) => {
            const lead = action.payload?.data;
            if (!lead) return;
            state.boardData = state.boardData.map((stage) => {
                if (stage.stage_uuid === lead.stage_uuid) {
                    return {
                        ...stage,
                        leads: (stage.leads ?? []).map((l: any) => l.lead_uuid === lead.lead_uuid ? lead : l),
                    };
                }
                return stage;
            });
        });

        /* ── lead move (optimistic on pending) ── */
        builder.addCase(pipelineLeadMove.pending, (state, action: any) => {
            const { uuid, stage_uuid } = action.meta?.arg || {};
            if (!uuid || !stage_uuid) return;
            let movingLead: any = null;
            state.boardData = state.boardData.map((stage) => {
                const found = (stage.leads ?? []).find((l: any) => l.lead_uuid === uuid);
                if (found) {
                    movingLead = { ...found, stage_uuid };
                    const filtered = stage.leads.filter((l: any) => l.lead_uuid !== uuid);
                    return { ...stage, leads: filtered, leadsCount: filtered.length };
                }
                return stage;
            });
            if (movingLead) {
                state.boardData = state.boardData.map((stage) => {
                    if (stage.stage_uuid === stage_uuid) {
                        movingLead.tags = [stage.name?.toUpperCase() || stage.name];
                        return {
                            ...stage,
                            leads: [movingLead, ...(stage.leads ?? [])],
                            leadsCount: (stage.leadsCount ?? 0) + 1,
                        };
                    }
                    return stage;
                });
            }
        });

        /* ── lead move (server confirmed) ── */
        builder.addCase(pipelineLeadMove.fulfilled, (state, action: PayloadAction<any>) => {
            const movedLead = action.payload?.data;
            if (!movedLead) return;
            state.boardData = state.boardData.map((stage) => {
                // Remove from old stage
                const filteredLeads = (stage.leads ?? []).filter(
                    (l: any) => l.lead_uuid !== movedLead.lead_uuid
                );
                // Add to new stage
                if (stage.stage_uuid === movedLead.stage_uuid) {
                    return {
                        ...stage,
                        leads: [movedLead, ...filteredLeads],
                        leadsCount: filteredLeads.length + 1,
                    };
                }
                return {
                    ...stage,
                    leads: filteredLeads,
                    leadsCount: filteredLeads.length,
                };
            });
        });

        /* ── lead delete ── */
        builder.addCase(pipelineLeadDelete.fulfilled, (state, action: any) => {
            const uuid = action.meta?.arg;
            state.boardData = state.boardData.map((stage) => {
                const filtered = (stage.leads ?? []).filter((l: any) => l.lead_uuid !== uuid);
                return { ...stage, leads: filtered, leadsCount: filtered.length };
            });
            state.totalLeads = Math.max(0, state.totalLeads - 1);
        });

        /* ── assignment config get ── */
        builder
            .addCase(pipelineAssignmentConfigGet.pending,  (state) => { state.assignmentConfigLoading = true; })
            .addCase(pipelineAssignmentConfigGet.fulfilled, (state, action: PayloadAction<any>) => {
                state.assignmentConfig       = action.payload?.data ?? null;
                state.assignmentConfigLoading = false;
            })
            .addCase(pipelineAssignmentConfigGet.rejected, (state) => { state.assignmentConfigLoading = false; });

        /* ── assignment config save ── */
        builder
            .addCase(pipelineAssignmentConfigSave.pending,  (state) => { state.assignmentConfigLoading = true; })
            .addCase(pipelineAssignmentConfigSave.fulfilled, (state, action: PayloadAction<any>) => {
                state.assignmentConfig       = action.payload?.data ?? null;
                state.assignmentConfigLoading = false;
            })
            .addCase(pipelineAssignmentConfigSave.rejected, (state) => { state.assignmentConfigLoading = false; });
    },
});

export default pipelineSlice.reducer;
export const { clearPipeline } = pipelineSlice.actions;

/* ─────────── SELECTORS ─────────── */
export const selectPipelineLoading        = (s: RootState) => s.pipeline.isLoading;
export const selectPipelineBoardData      = (s: RootState) => s.pipeline.boardData;
export const selectPipelineTotalLeads     = (s: RootState) => s.pipeline.totalLeads;
export const selectAssignmentConfig       = (s: RootState) => s.pipeline.assignmentConfig;
export const selectAssignmentConfigLoading = (s: RootState) => s.pipeline.assignmentConfigLoading;

export const usePipelineLoading = () => {
    const v = useAppSelector(selectPipelineLoading);
    return useMemo(() => v, [v]);
};
export const usePipelineBoardData = () => {
    const v = useAppSelector(selectPipelineBoardData);
    return useMemo(() => v, [v]);
};
export const usePipelineTotalLeads = () => {
    const v = useAppSelector(selectPipelineTotalLeads);
    return useMemo(() => v, [v]);
};
export const useAssignmentConfig = () => {
    const v = useAppSelector(selectAssignmentConfig);
    return useMemo(() => v, [v]);
};
export const useAssignmentConfigLoading = () => {
    const v = useAppSelector(selectAssignmentConfigLoading);
    return useMemo(() => v, [v]);
};
