import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import {
    allInbound,
    createInbound,
    deleteInbound,
    inbound,
    searchInbound,
    singleInbound,
    updateInbound,
    updateInboundStatus,
        singlePreset,
    getPresetInbound,
    addPresetInbound,
    deletePresetInbound,
    updatePresetInbound,
        addHangupInbound,
    deleteHangupInbound,
    singleHangupInbound,
} from "@/redux/services/tenant-admin/inboundServices";
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";

// TYPES IMPORT
import { OptionTypes } from "@/types/formTypes";

interface InitialState {
    isLoading: boolean;
    inboundData: any;
    singleInboundData: any;
    inboundOptions: OptionTypes[];
}

const initialState: InitialState = {
    isLoading: true,
    inboundData: {},
    singleInboundData: {},
    inboundOptions: [],
};

export const inboundGet = createAsyncThunk(
    "inbound/get",
    async (params: any) => {
        return await inbound(params);
    }
);

export const managerInboundGet = createAsyncThunk(
    "manager-inbound/get",
    async (params: any) => {
        return await inbound(params);
    }
);

export const managerInboundSearch = createAsyncThunk(
    "manager-inbound/search",
    async (params: any) => {
        return await searchInbound(params);
    }
);

export const inboundSearch = createAsyncThunk(
    "inbound/search",
    async (params: any) => {
        return await searchInbound(params);
    }
);

export const inboundSingleGet = createAsyncThunk(
    "inbound-single/get",
    async (od: string) => {
        return await singleInbound(od);
    }
);

export const inboundCreate = createAsyncThunk(
    "inbound/create",
    async (payload: any) => {
        return await createInbound(payload);
    }
);

export const inboundUpdate = createAsyncThunk(
    "inbound/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateInbound(id, rest);
    }
);

export const inboundStatusUpdate = createAsyncThunk(
    "inbound-status/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateInboundStatus(id, rest);
    }
);

export const inboundDelete = createAsyncThunk(
    "inbound/delete",
    async (id: string) => {
        return await deleteInbound(id);
    }
);

export const inboundHangupAdd = createAsyncThunk(
    "inbound-hangup/add",
    async (payload: any) => {
        return await addHangupInbound(payload);
    }
);

export const inboundHangupDelete = createAsyncThunk(
    "inbound-hangup/delete",
    async (id: string) => {
        return await deleteHangupInbound(id);
    }
);

export const inboundSingleHangupGet = createAsyncThunk(
    "inbound-hangup/get", 
        async (id: string) => {
            return await singleHangupInbound(id);
        }
);

export const inboundOptionsGet = createAsyncThunk(
    "inbound-options/get",
    async () => {
        return await allInbound();
    }
);


export const inboundPresetGet = createAsyncThunk(
    "inbound-preset/get",
    async (params: any) => {
        console.log(params,'Param');
        const { id, feature, ...rest } = params;
        return await getPresetInbound(feature, id, rest);
    }
);

export const inboundPresetAdd = createAsyncThunk(
    "inbound-preset/add",
    async (payload: any) => {
        return await addPresetInbound(payload);
    }
);

export const inboundPresetDelete = createAsyncThunk(
    "inbound-preset/delete",
    async (id: string) => {
        return await deletePresetInbound(id);
    }
);

export const inboundPresetUpdate = createAsyncThunk(
    "inbound-preset/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updatePresetInbound(id, rest);
    }
);

export const inboundPresetSingleGet = createAsyncThunk(
    "preset/single-get", async (id: string) => {
    return await singlePreset(id);
  });

const prepareData = (payload: any) => {
    const data = payload?.data;
    const count = payload?.count;

    const newData = data?.map((option: any) => {
        return {
            ...option,
            disabled: option?.created_flag === "1",
        };
    });

    return { data: newData, count };
};

const inboundSlice = createSlice({
    name: "inbound",
    initialState,
    reducers: {
        updateSingleInboundData: (state, action) => {
            state.singleInboundData = action.payload ? action.payload : {};
        },
        clearInbound: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(inboundGet.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(inboundGet.fulfilled, (state, action: PayloadAction<any>) => {
                state.inboundData = action.payload;
                state.isLoading = false;
            })
            .addCase(inboundGet.rejected, (state) => {
                state.isLoading = false;
            });

        builder
            .addCase(inboundSearch.pending, (state, action: PayloadAction<any>) => {
                state.isLoading = true;
            })
            .addCase(inboundSearch.fulfilled, (state, action: PayloadAction<any>) => {
                state.inboundData = action.payload;
                state.isLoading = false;
            })
            .addCase(inboundSearch.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
            });

        builder.addCase(
            managerInboundGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.inboundData = prepareData(action.payload);
                state.isLoading = false;
            }
        );

        builder.addCase(
            managerInboundSearch.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.inboundData = prepareData(action.payload);
                state.isLoading = false;
            }
        );

        builder.addCase(
            inboundOptionsGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                const data = action.payload?.data;
                state.inboundOptions = data?.map((val: any) => ({
                    value: val?.uuid,
                    label: val?.name,
                }));
            }
        );
    },
});

export default inboundSlice.reducer;
export const { updateSingleInboundData, clearInbound } = inboundSlice.actions;

export const selectIsLoading = (state: RootState) => state.inbound.isLoading;
export const useIsLoading = () => {
    const isLoading = useAppSelector(selectIsLoading);
    return useMemo(() => isLoading, [isLoading]);
};

export const selectInboundData = (state: RootState) =>
    state.inbound.inboundData;
export const useInboundData = () => {
    const inbound = useAppSelector(selectInboundData);
    return useMemo(() => inbound, [inbound]);
};

export const selectSingleInbound = (state: RootState) =>
    state.inbound.singleInboundData;
export const useSingleInbound = () => {
    const leadGroupData = useAppSelector(selectSingleInbound);
    return useMemo(() => leadGroupData, [leadGroupData]);
};

export const selectInboundOptions = (state: RootState) =>
    state.inbound.inboundOptions;
export const useInboundOptions = () => {
    const options = useAppSelector(selectInboundOptions);
    return useMemo(() => options, [options]);
};
