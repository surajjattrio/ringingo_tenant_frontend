import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import {
    allBlended,
    createBlended,
    deleteBlended,
    blended,
    searchBlended,
    singleFeatureBlended,
    singleBlended,
    dialableTableBlended,
    updateFeatureBlended,
    updateBlended,
    updateBlendedStatus,
    addDialableTableBlended,
    deleteDialableBlended,
    resetLeadBlended,
    addHangupBlended,
    deleteHangupBlended,
        singlePreset,
    getPresetBlended,
    addPresetBlended,
    deletePresetBlended,
    updatePresetBlended,
    allBlendedLead,
    deleteCampaignLeadGroup,
} from "@/redux/services/tenant-admin/blendedServices";
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";

// TYPES IMPORT
import { OptionTypes } from "@/types/formTypes";

// OPTIONS IMPORT
import { dialMethodOptions } from "@/config/options";

interface InitialState {
    isLoading: boolean;
    blendedData: any;
    blendedOptions: OptionTypes[];
    blendedLeadOptions: OptionTypes[];
        singleBlendedData: any;
}

const initialState: InitialState = {
    isLoading: true,
    blendedData: {},
    blendedOptions: [],
    blendedLeadOptions: [],
       singleBlendedData: {},
};

export const blendedGet = createAsyncThunk(
    "blended/get",
    async (params: any) => {
        return await blended(params);
    }
);

export const managerBlendedGet = createAsyncThunk(
    "manager-blended/get",
    async (params: any) => {
        return await blended(params);
    }
);

export const blendedSingleGet = createAsyncThunk(
    "blended-single/get",
    async (od: string) => {
        return await singleBlended(od);
    }
);

export const blendedSingleFeatureGet = createAsyncThunk(
    "blended-single-feature/get",
    async (params: any) => {
        const { id, feature, ...rest } = params;
        return await singleFeatureBlended(feature, id, rest);
    }
);

export const blendedDialableTableGet = createAsyncThunk(
    "blended-single-table/get",
    async (params: any) => {
        return await dialableTableBlended(params);
    }
);

export const campaignLeadGroupDelete = createAsyncThunk(
    "blended-lead-group/delete",
    async (params: any) => {
        return await deleteCampaignLeadGroup(params);
    }
);

export const blendedSearch = createAsyncThunk(
    "blended/search",
    async (params: any) => {
        return await searchBlended(params);
    }
);

export const managerBlendedSearch = createAsyncThunk(
    "manager-blended/search",
    async (params: any) => {
        return await searchBlended(params);
    }
);

export const blendedCreate = createAsyncThunk(
    "blended/create",
    async (payload: any) => {
        return await createBlended(payload);
    }
);

export const blendedDialableAdd = createAsyncThunk(
    "blended-dialable/add",
    async (payload: any) => {
        return await addDialableTableBlended(payload);
    }
);

export const blendedHangupAdd = createAsyncThunk(
    "blended-hangup/add",
    async (payload: any) => {
        return await addHangupBlended(payload);
    }
);

export const blendedLeadReset = createAsyncThunk(
    "blended-lead/reset",
    async (payload: any) => {
        return await resetLeadBlended(payload);
    }
);

export const blendedUpdate = createAsyncThunk(
    "blended/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateBlended(id, rest);
    }
);

export const blendedStatusUpdate = createAsyncThunk(
    "blended-status/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateBlendedStatus(id, rest);
    }
);

export const blendedFeatureUpdate = createAsyncThunk(
    "blended-feature/update",
    async (payload: any) => {
        const { feature, ...rest } = payload;
        return await updateFeatureBlended(feature, rest);
    }
);

export const blendedDelete = createAsyncThunk(
    "blended/delete",
    async (id: string) => {
        return await deleteBlended(id);
    }
);

export const blendedHangupDelete = createAsyncThunk(
    "blended-hangup/delete",
    async (id: string) => {
        return await deleteHangupBlended(id);
    }
);

export const blendedDialableDelete = createAsyncThunk(
    "blended-dialable/delete",
    async (id: string) => {
        return await deleteDialableBlended(id);
    }
);

export const blendedOptionsGet = createAsyncThunk(
    "blended-options/get",
    async () => {
        return await allBlended();
    }
);

export const blendedLeadOptionsGet = createAsyncThunk(
    "blended-lead-options/get",
    async () => {
        return await allBlendedLead();
    }
);


export const blendedPresetGet = createAsyncThunk(
    "blended-preset/get",
    async (params: any) => {
        console.log(params,'Param');
        const { id, feature, ...rest } = params;
        return await getPresetBlended(feature, id, rest);
    }
);


export const blendedPresetAdd = createAsyncThunk(
    "blended-preset/add",
    async (payload: any) => {
        return await addPresetBlended(payload);
    }
);

export const blendedPresetDelete = createAsyncThunk(
    "blended-preset/delete",
    async (id: string) => {
        return await deletePresetBlended(id);
    }
);

export const blendedPresetUpdate = createAsyncThunk(
    "blended-preset/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updatePresetBlended(id, rest);
    }
);

export const blendedPresetSingleGet = createAsyncThunk(
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

const blendedSlice = createSlice({
    name: "blended",
    initialState,
    reducers: {
        updateSingleBlendedData: (state, action) => {
       
            state.singleBlendedData = action.payload ? action.payload : {};
          },
        clearBlended: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(blendedGet.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(blendedGet.fulfilled, (state, action: PayloadAction<any>) => {
                state.blendedData = prepareData(action.payload);
                state.isLoading = false;
            })
            .addCase(blendedGet.rejected, (state) => {
                state.isLoading = false;
            });

        builder
            .addCase(blendedSearch.pending, (state, action: PayloadAction<any>) => {
                state.isLoading = true;
            })
            .addCase(
                blendedSearch.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.blendedData = prepareData(action.payload);
                    state.isLoading = false;
                }
            )
            .addCase(blendedSearch.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
            });

        builder.addCase(
            blendedOptionsGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                const data = action.payload?.data;
                state.blendedOptions = data?.map((val: any) => ({
                    value: val?.uuid,
                    label: val?.name,
                }));
            }
        );

        builder.addCase(
            blendedLeadOptionsGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                const data = action.payload?.data;
                state.blendedLeadOptions = data?.map((val: any) => ({
                    value: val?.disposition_uuid,
                    label: val?.name,
                }));
            }
        );

        builder.addCase(
            managerBlendedGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.blendedData = managerPrepareData(action.payload);
            }
        );

        builder.addCase(
            managerBlendedSearch.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.blendedData = managerPrepareData(action.payload);
            }
        );
    },
});

export default blendedSlice.reducer;
export const {  updateSingleBlendedData, clearBlended } = blendedSlice.actions;

export const selectIsLoading = (state: RootState) => state.blended.isLoading;
export const useIsLoading = () => {
    const isLoading = useAppSelector(selectIsLoading);
    return useMemo(() => isLoading, [isLoading]);
};

export const selectBlendedData = (state: RootState) =>
    state.blended.blendedData;
export const useBlendedData = () => {
    const blended = useAppSelector(selectBlendedData);
    return useMemo(() => blended, [blended]);
};

export const selectBlendedOptions = (state: RootState) =>
    state.blended.blendedOptions;
export const useBlendedOptions = () => {
    const options = useAppSelector(selectBlendedOptions);
    return useMemo(() => options, [options]);
};

export const selectBlendedLeadOptions = (state: RootState) =>
    state.blended.blendedLeadOptions;
export const useBlendedLeadOptions = () => {
    const options = useAppSelector(selectBlendedLeadOptions);
    return useMemo(() => options, [options]);
};


export const selectSingleBlended = (state: RootState) =>
  state.blended.singleBlendedData;
export const useSingleBlended = () => {
  const blended = useAppSelector(selectSingleBlended);
  return useMemo(() => blended, [blended]);
};