import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import {
    allOutbound,
    createOutbound,
    deleteOutbound,
    outbound,
    searchOutbound,
    singleFeatureOutbound,
    singleOutbound,
    dialableTableOutbound,
    updateFeatureOutbound,
    updateOutbound,
    updateOutboundStatus,
    addDialableTableOutbound,
    deleteDialableOutbound,
    resetLeadOutbound,
    getLeadResetJobStatus,
    addHangupOutbound,
    deleteHangupOutbound,
        singlePreset,
    getPresetOutbound,
    addPresetOutbound,
    deletePresetOutbound,
    updatePresetOutbound,
    allOutboundLead,
    deleteCampaignLeadGroup,
} from "@/redux/services/tenant-admin/outboundServices";
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";

// TYPES IMPORT
import { OptionTypes } from "@/types/formTypes";

// OPTIONS IMPORT
import { dialMethodOptions } from "@/config/options";

interface InitialState {
    isLoading: boolean;
    outboundData: any;
    outboundOptions: OptionTypes[];
    outboundLeadOptions: OptionTypes[];
        singleOutboundData: any;
}

const initialState: InitialState = {
    isLoading: true,
    outboundData: {},
    outboundOptions: [],
    outboundLeadOptions: [],
       singleOutboundData: {},
};

export const outboundGet = createAsyncThunk(
    "outbound/get",
    async (params: any) => {
        return await outbound(params);
    }
);

export const managerOutboundGet = createAsyncThunk(
    "manager-outbound/get",
    async (params: any) => {
        return await outbound(params);
    }
);

export const outboundSingleGet = createAsyncThunk(
    "outbound-single/get",
    async (od: string) => {
        return await singleOutbound(od);
    }
);

export const outboundSingleFeatureGet = createAsyncThunk(
    "outbound-single-feature/get",
    async (params: any) => {
        const { id, feature, ...rest } = params;
        return await singleFeatureOutbound(feature, id, rest);
    }
);

export const outboundDialableTableGet = createAsyncThunk(
    "outbound-single-table/get",
    async (params: any) => {
        return await dialableTableOutbound(params);
    }
);

export const campaignLeadGroupDelete = createAsyncThunk(
    "outbound-lead-group/delete",
    async (params: any) => {
        return await deleteCampaignLeadGroup(params);
    }
);

export const outboundSearch = createAsyncThunk(
    "outbound/search",
    async (params: any) => {
        return await searchOutbound(params);
    }
);

export const managerOutboundSearch = createAsyncThunk(
    "manager-outbound/search",
    async (params: any) => {
        return await searchOutbound(params);
    }
);

export const outboundCreate = createAsyncThunk(
    "outbound/create",
    async (payload: any) => {
        return await createOutbound(payload);
    }
);

export const outboundDialableAdd = createAsyncThunk(
    "outbound-dialable/add",
    async (payload: any) => {
        return await addDialableTableOutbound(payload);
    }
);

export const outboundHangupAdd = createAsyncThunk(
    "outbound-hangup/add",
    async (payload: any) => {
        return await addHangupOutbound(payload);
    }
);

export const outboundLeadReset = createAsyncThunk(
    "outbound-lead/reset",
    async (payload: any) => {
        return await resetLeadOutbound(payload);
    }
);

// Polls the status of an async lead-reset job (job_uuid returned by
// outboundLeadReset when the backend has ENABLE_LEAD_RECHURN_MICROSERVICE=true).
export const outboundLeadResetStatusGet = createAsyncThunk(
    "outbound-lead-reset-status/get",
    async (params: { job_uuid: string; tenant_uuid: string }) => {
        return await getLeadResetJobStatus(params.job_uuid, params.tenant_uuid);
    }
);

export const outboundUpdate = createAsyncThunk(
    "outbound/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateOutbound(id, rest);
    }
);

export const outboundStatusUpdate = createAsyncThunk(
    "outbound-status/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateOutboundStatus(id, rest);
    }
);

export const outboundFeatureUpdate = createAsyncThunk(
    "outbound-feature/update",
    async (payload: any) => {
        const { feature, ...rest } = payload;
        return await updateFeatureOutbound(feature, rest);
    }
);

export const outboundDelete = createAsyncThunk(
    "outbound/delete",
    async (id: string) => {
        return await deleteOutbound(id);
    }
);

export const outboundHangupDelete = createAsyncThunk(
    "outbound-hangup/delete",
    async (id: string) => {
        return await deleteHangupOutbound(id);
    }
);

export const outboundDialableDelete = createAsyncThunk(
    "outbound-dialable/delete",
    async (id: string) => {
        return await deleteDialableOutbound(id);
    }
);

export const outboundOptionsGet = createAsyncThunk(
    "outbound-options/get",
    async () => {
        return await allOutbound();
    }
);

export const outboundLeadOptionsGet = createAsyncThunk(
    "outbound-lead-options/get",
    async () => {
        return await allOutboundLead();
    }
);


export const outboundPresetGet = createAsyncThunk(
    "outbound-preset/get",
    async (params: any) => {
        console.log(params,'Param');
        const { id, feature, ...rest } = params;
        return await getPresetOutbound(feature, id, rest);
    }
);


export const outboundPresetAdd = createAsyncThunk(
    "outbound-preset/add",
    async (payload: any) => {
        return await addPresetOutbound(payload);
    }
);

export const outboundPresetDelete = createAsyncThunk(
    "outbound-preset/delete",
    async (id: string) => {
        return await deletePresetOutbound(id);
    }
);

export const outboundPresetUpdate = createAsyncThunk(
    "outbound-preset/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updatePresetOutbound(id, rest);
    }
);

export const outboundPresetSingleGet = createAsyncThunk(
    "preset/single-get", async (id: string) => {
    return await singlePreset(id);
  });


const prepareData = (payload: any) => {
    const data = payload?.data;
    const count = payload?.count;

    const newData = data?.map((option: any) => {
        const dialMethod = dialMethodOptions?.find(
            (val: OptionTypes) => val?.value === option?.dial_method
        );
        return {
            ...option,
            dial_method_name: dialMethod?.label || "",
            outgoing_rule_name: option?.outgoing_rule?.[0]?.name || "",
        };
    });

    return { data: newData, count };
};

const managerPrepareData = (payload: any) => {
    const data = payload?.data;
    const count = payload?.count;

    const newData = data?.map((option: any) => {
        const dialMethod = dialMethodOptions?.find(
            (val: OptionTypes) => val?.value === option?.dial_method
        );
        return {
            ...option,
            disabled: option?.created_flag === "1",
            dial_method_name: dialMethod?.label || "",
            outgoing_rule_name: option?.outgoing_rule?.[0]?.name || "",
        };
    });

    return { data: newData, count };
};

const outboundSlice = createSlice({
    name: "outbound",
    initialState,
    reducers: {
        updateSingleOutboundData: (state, action) => {
       
            state.singleOutboundData = action.payload ? action.payload : {};
          },
        clearOutbound: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(outboundGet.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(outboundGet.fulfilled, (state, action: PayloadAction<any>) => {
                state.outboundData = prepareData(action.payload);
                state.isLoading = false;
            })
            .addCase(outboundGet.rejected, (state) => {
                state.isLoading = false;
            });

        builder
            .addCase(outboundSearch.pending, (state, action: PayloadAction<any>) => {
                state.isLoading = true;
            })
            .addCase(
                outboundSearch.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.outboundData = prepareData(action.payload);
                    state.isLoading = false;
                }
            )
            .addCase(outboundSearch.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
            });

        builder.addCase(
            outboundOptionsGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                const data = action.payload?.data;
                state.outboundOptions = data?.map((val: any) => ({
                    value: val?.uuid,
                    label: val?.name,
                }));
            }
        );

        builder.addCase(
            outboundLeadOptionsGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                const data = action.payload?.data;
                state.outboundLeadOptions = data?.map((val: any) => ({
                    value: val?.disposition_uuid,
                    label: val?.name,
                }));
            }
        );

        builder.addCase(
            managerOutboundGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.outboundData = managerPrepareData(action.payload);
            }
        );

        builder.addCase(
            managerOutboundSearch.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.outboundData = managerPrepareData(action.payload);
            }
        );
    },
});

export default outboundSlice.reducer;
export const {  updateSingleOutboundData, clearOutbound } = outboundSlice.actions;

export const selectIsLoading = (state: RootState) => state.outbound.isLoading;
export const useIsLoading = () => {
    const isLoading = useAppSelector(selectIsLoading);
    return useMemo(() => isLoading, [isLoading]);
};

export const selectOutboundData = (state: RootState) =>
    state.outbound.outboundData;
export const useOutboundData = () => {
    const outbound = useAppSelector(selectOutboundData);
    return useMemo(() => outbound, [outbound]);
};

export const selectOutboundOptions = (state: RootState) =>
    state.outbound.outboundOptions;
export const useOutboundOptions = () => {
    const options = useAppSelector(selectOutboundOptions);
    return useMemo(() => options, [options]);
};

export const selectOutboundLeadOptions = (state: RootState) =>
    state.outbound.outboundLeadOptions;
export const useOutboundLeadOptions = () => {
    const options = useAppSelector(selectOutboundLeadOptions);
    return useMemo(() => options, [options]);
};


export const selectSingleOutbound = (state: RootState) =>
  state.outbound.singleOutboundData;
export const useSingleOutbound = () => {
  const outbound = useAppSelector(selectSingleOutbound);
  return useMemo(() => outbound, [outbound]);
};