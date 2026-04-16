import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import {
    allRings,
    createRing,
    deleteRing,
    rings,
    searchRing,
    updateRing,
} from "@/redux/services/tenant-admin/ringServices";
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";

// TYPES IMPORT
import { ObjectOptionTypes, OptionTypes } from "@/types/formTypes";
import { timeoutOptions2, typeOptions } from "@/config/options";

interface InitialState {
    isLoading: boolean;
    ringsData: any;
    singleRingData: any;
    ringGroupOptions: OptionTypes[];
    ringGroupCallCenterOptions: OptionTypes[];
    allowedRingGroupOptions: ObjectOptionTypes[];
}

const initialState: InitialState = {
    isLoading: false,
    ringsData: {},
    singleRingData: {},
    ringGroupOptions: [],
    ringGroupCallCenterOptions: [],
    allowedRingGroupOptions: [],
};

export const ringsGet = createAsyncThunk("ring/get", async (params: any) => {
    return await rings(params);
});

export const ringSearch = createAsyncThunk(
    "ring/search",
    async (params: any) => {
        return await searchRing(params);
    }
);

export const ringCreate = createAsyncThunk(
    "ring/create",
    async (payload: any) => {
        return await createRing(payload);
    }
);

export const ringUpdate = createAsyncThunk(
    "ring/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateRing(id, rest);
    }
);

export const ringDelete = createAsyncThunk(
    "ring/delete",
    async (id: string) => {
        return await deleteRing(id);
    }
);

export const ringOptionsGet = createAsyncThunk("ring-options/get", async () => {
    return await allRings();
});

export const allowedRingOptionsGet = createAsyncThunk(
    "allowed-ring-options/get",
    async () => {
        return await allRings();
    }
);

export const callCenterRingOptionsGet = createAsyncThunk(
    "call-center-ring-group-options/get",
    async () => {
        return await rings({ mode: "call-center" });
    }
);

const prepareData = (payload: any) => {
    const data = payload?.data;
    const count = payload?.count;

    const newData = data?.map((val: any) => {
        const type = typeOptions?.find(
            (option: any) => option?.value === val?.type
        );
        const timeout = timeoutOptions2?.find(
            (option: any) => option?.value === val?.timeout
        );
        return {
            ...val,
            ringType: type?.value || "",
            type: type?.label || "",
            timeout_value: timeout?.label || "",
        };
    });

    return { data: newData, count };
};

const ringSlice = createSlice({
    name: "ring",
    initialState,
    reducers: {
        updateSingleRingData: (state, action) => {
            state.singleRingData = action.payload ? action.payload : {};
        },
        clearRing: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(ringsGet.pending, (state, action: PayloadAction<any>) => {
                state.isLoading = true;
            })
            .addCase(ringsGet.fulfilled, (state, action: PayloadAction<any>) => {
                state.ringsData = prepareData(action.payload);
                state.isLoading = false;
            })
            .addCase(ringsGet.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
            });

        builder
            .addCase(ringSearch.pending, (state, action: PayloadAction<any>) => {
                state.isLoading = true;
            })
            .addCase(ringSearch.fulfilled, (state, action: PayloadAction<any>) => {
                state.ringsData = prepareData(action.payload);
                state.isLoading = false;
            })
            .addCase(ringSearch.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
            });

        builder.addCase(
            ringOptionsGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                const data = action.payload?.data;
                state.ringGroupOptions =
                    data?.map((val: any) => ({
                        value: val?.uuid,
                        label: val?.name,
                    })) || [];
            }
        );

        builder.addCase(
            allowedRingOptionsGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                const data = action.payload?.data;
                state.allowedRingGroupOptions =
                    data?.map((val: any) => ({
                        value: {
                            name: val?.name,
                            uuid: val?.uuid,
                        },
                        label: val?.name,
                    })) || [];
            }
        );

        builder.addCase(
            callCenterRingOptionsGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                const data = action.payload?.data;
                state.ringGroupCallCenterOptions =
                    data?.map((val: any) => ({
                        value: val?.uuid,
                        label: val?.name,
                    })) || [];
            }
        );
    },
});

export default ringSlice.reducer;
export const { updateSingleRingData, clearRing } = ringSlice.actions;

export const selectIsLoading = (state: RootState) => state.ring.isLoading;
export const useIsLoading = () => {
    const isLoading = useAppSelector(selectIsLoading);
    return useMemo(() => isLoading, [isLoading]);
};

export const selectRings = (state: RootState) => state.ring.ringsData;
export const useRings = () => {
    const rings = useAppSelector(selectRings);
    return useMemo(() => rings, [rings]);
};

export const selectSingleRing = (state: RootState) => state.ring.singleRingData;
export const useSingleRing = () => {
    const ring = useAppSelector(selectSingleRing);
    return useMemo(() => ring, [ring]);
};

export const selectRingOptions = (state: RootState) =>
    state.ring.ringGroupOptions;
export const useRingOptions = () => {
    const options = useAppSelector(selectRingOptions);
    return useMemo(() => options, [options]);
};

export const selectAllowedRingOptions = (state: RootState) =>
    state.ring.allowedRingGroupOptions;
export const useAllowedRingOptions = () => {
    const allowedRingGroupOptions = useAppSelector(selectAllowedRingOptions);
    return useMemo(() => allowedRingGroupOptions, [allowedRingGroupOptions]);
};

export const selectCallCenterRingOptions = (state: RootState) =>
    state.ring.ringGroupCallCenterOptions;
export const useCallCenterRingOptions = () => {
    const ringGroupCallCenterOptions = useAppSelector(
        selectCallCenterRingOptions
    );
    return useMemo(
        () => ringGroupCallCenterOptions,
        [ringGroupCallCenterOptions]
    );
};
