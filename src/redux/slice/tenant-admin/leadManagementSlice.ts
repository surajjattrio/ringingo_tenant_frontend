import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";

// TYPES IMPORT
import { OptionTypes } from "@/types/formTypes";
import {
    allLead,
    batchUpdate,
    createLead,
    deleteLead,
    distributionLead,
    importLeadManagement,
    importMapperLead,
    lead,
    noteCreate,
    notesGet,
    searchLead,
    singleLead,
    singleLeadInfo,
    updateLead,
    updateLeadStatus,
    singleLeadCustomFields,
    createNewLead,
    updateNewLead,
} from "@/redux/services/tenant-admin/leadManagementServices";

interface InitialState {
    isLoading: boolean;
    leadData: any;
    allLeadData: any;
    singleLeadData: any;
    leadOptions: OptionTypes[];
}

const initialState: InitialState = {
    isLoading: false,
    leadData: {},
    allLeadData: {},
    singleLeadData: {},
    leadOptions: [],
};

export const leadAllGet = createAsyncThunk(
    "lead/get-all",
    async (params: any) => {
        return await lead(params);
    }
);

export const leadAllSearch = createAsyncThunk(
    "lead/search-all",
    async (params: any) => {
        return await searchLead(params);
    }
);

export const leadGet = createAsyncThunk("lead/get", async (params: any) => {
    return await lead(params);
});

export const leadSearch = createAsyncThunk(
    "lead/search",
    async (params: any) => {
        return await searchLead(params);
    }
);

export const leadCreate = createAsyncThunk(
    "lead/create",
    async (payload: any) => {
        return await createLead(payload);
    }
);
export const leadNewCreate = createAsyncThunk(
    "lead/create/new",
    async (payload: any) => {
        return await createNewLead(payload);
    }
);
export const getSingleLead = createAsyncThunk(
    "lead/single",
    async (params: any) => {
        return await singleLead(params);
    }
);

export const getSingleLeadCustomFields = createAsyncThunk(
    "/lead/custom-fields",
    async (params: any) => {
        return await singleLeadCustomFields(params);
    }
);

export const getSingleLeadInfo = createAsyncThunk(
    "lead/singleInfo",
    async (params: any) => {
        return await singleLeadInfo(params);
    }
);

export const getNotesList = createAsyncThunk(
    "notes/list",
    async (uuid: string) => {
        return await notesGet(uuid);
    }
);

export const createNewNote = createAsyncThunk(
    "notes/create",
    async (payload: any) => {
        return await noteCreate(payload);
    }
);

export const leadMapperImport = createAsyncThunk(
    "lead/import",
    async (payload: any) => {
        return await importMapperLead(payload);
    }
);

export const leadDistribution = createAsyncThunk(
    "lead/distribution",
    async (payload: any) => {
        return await distributionLead(payload);
    }
);

export const leadUpdate = createAsyncThunk(
    "lead/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateLead(id, rest);
    }
);
export const leadNewUpdate = createAsyncThunk(
    "lead/update/new",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateNewLead(id, rest);
    }
);
export const leadStatusUpdate = createAsyncThunk(
    "lead-status/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateLeadStatus(id, rest);
    }
);
export const leadDelete = createAsyncThunk(
    "lead/delete",
    async (id: string) => {
        return await deleteLead(id);
    }
);
export const leadBatchUpdate = createAsyncThunk(
    "lead/batch-update",
    async (payload: any) => {
        return await batchUpdate(payload);
    }
);

export const LeadManagementImport = createAsyncThunk(
    "did/import",
    async (payload: any) => {
        return await importLeadManagement(payload);
    }
);

export const leadOptionsGet = createAsyncThunk("lead-options/get", async () => {
    return await allLead();
});

const prepareData = (payload: any) => {
    console.log("lead preparedataa", payload);

    const data = payload?.data;
    const count = payload?.count;

    const newData = data?.map((val: any) => {
        // Collect all levels we might have
        const levels = [
            val?.disposition_2?.[0]?.name, // Top parent
            val?.disposition_1?.[0]?.name, // Middle
            val?.disposition?.[0]?.name    // Last child
        ].filter(Boolean); // Remove null/undefined
        return {
            ...val,
            uuid: val?.lead_management_uuid,
            user_name: val?.user?.[0]?.username || "",
            fullname: val?.user?.[0]?.fullname || "",
            lead_group_name: val?.lead_group?.[0]?.name || "",
            campaign_name: val?.campaign_details?.[0]?.name || "",
            leadStatus: levels[0] || "",
            leadStatus1: levels[1] || "",
            leadStatus2: levels[2] || "",
            // leadStatus: val?.disposition?.[0]?.name || "",
            // leadStatus1: val?.disposition_1?.[0]?.name || "",
            // leadStatus2: val?.disposition_2?.[0]?.name || "",
            country: val?.country?.[0]?.country || "",
            genderValue: val?.gender ? (val?.gender === "0" ? "Male" : "Female") : "",
        };
    });

    return { data: newData, count };
};

const leadManagementSlice = createSlice({
    name: "lead",
    initialState,
    reducers: {
        updateSingleLeadData: (state, action) => {
            state.singleLeadData = action.payload ? action.payload : {};
        },
        clearLead: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(leadGet.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(leadGet.fulfilled, (state, action: PayloadAction<any>) => {
                state.leadData = prepareData(action.payload);
                state.isLoading = false;
            })
            .addCase(leadGet.rejected, (state) => {
                state.isLoading = false;
            });

        builder
            .addCase(leadSearch.pending, (state, action: PayloadAction<any>) => {
                state.isLoading = true;
            })
            .addCase(leadSearch.fulfilled, (state, action: PayloadAction<any>) => {
                state.leadData = prepareData(action.payload);
                state.isLoading = false;
            })
            .addCase(leadSearch.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
            });

        builder.addCase(
            leadOptionsGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                const data = action.payload?.data;
                state.leadOptions = data?.map((val: any) => ({
                    value: val?.uuid,
                    label: val?.name,
                }));
            }
        );

        builder.addCase(
            leadAllGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.allLeadData = prepareData(action.payload);
            }
        );

        builder.addCase(
            leadAllSearch.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.allLeadData = prepareData(action.payload);
            }
        );
    },
});

export default leadManagementSlice.reducer;
export const { updateSingleLeadData, clearLead } = leadManagementSlice.actions;

export const selectIsLoading = (state: RootState) => state.lead.isLoading;
export const useIsLoading = () => {
    const isLoading = useAppSelector(selectIsLoading);
    return useMemo(() => isLoading, [isLoading]);
};

export const selectLead = (state: RootState) => state.lead.leadData;
export const useLead = () => {
    const lead = useAppSelector(selectLead);
    return useMemo(() => lead, [lead]);
};

export const selectAllLead = (state: RootState) => state.lead.allLeadData;
export const useAllLead = () => {
    const allLeadData = useAppSelector(selectAllLead);
    return useMemo(() => allLeadData, [allLeadData]);
};

export const selectSingleLead = (state: RootState) => state.lead.singleLeadData;
export const useSingleLead = () => {
    const lead = useAppSelector(selectSingleLead);
    return useMemo(() => lead, [lead]);
};

export const selectLeadOptions = (state: RootState) => state.lead.leadOptions;
export const useLeadOptions = () => {
    const options = useAppSelector(selectLeadOptions);
    return useMemo(() => options, [options]);
};
