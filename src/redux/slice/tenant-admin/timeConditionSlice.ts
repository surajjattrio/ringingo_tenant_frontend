import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";
import {
    allTimeCondition,
    createTimeCondition,
    deleteTimeCondition,
    searchTimeCondition,
    timeCondition,
    updateTimeCondition,
    updateTimeConditionStatus,
} from "@/redux/services/tenant-admin/timeConditionServices";

// TYPES IMPORT
import { OptionTypes } from "@/types/formTypes";

interface InitialState {
    isLoading: boolean;
    timeConditionData: any;
    singleTimeConditionData: any;
    timeConditionOptions: OptionTypes[];
}

const initialState: InitialState = {
    isLoading: true,
    timeConditionData: {},
    singleTimeConditionData: {},
    timeConditionOptions: [],
};

export const timeConditionGet = createAsyncThunk(
    "timeCondition/get",
    async (params: any) => {
        return await timeCondition(params);
    }
);

export const timeConditionSearch = createAsyncThunk(
    "timeCondition/search",
    async (params: any) => {
        return await searchTimeCondition(params);
    }
);

export const timeConditionCreate = createAsyncThunk(
    "timeCondition/create",
    async (payload: any) => {
        return await createTimeCondition(payload);
    }
);

export const timeConditionUpdate = createAsyncThunk(
    "timeCondition/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateTimeCondition(id, rest);
    }
);

export const timeConditionUpdateStatus = createAsyncThunk(
    "timeCondition-status/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateTimeConditionStatus(id, rest);
    }
);

export const timeConditionDelete = createAsyncThunk(
    "timeCondition/delete",
    async (id: string) => {
        return await deleteTimeCondition(id);
    }
);

export const timeConditionOptionsGet = createAsyncThunk(
    "time-condition-options/get",
    async () => {
        return await allTimeCondition();
    }
);

const timeConditionSlice = createSlice({
    name: "timeCondition",
    initialState,
    reducers: {
        updateSingleTimeConditionData: (state, action) => {
            state.singleTimeConditionData = action.payload ? action.payload : {};
        },
        clearTimeCondition: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(
                timeConditionGet.pending,
                (state, action: PayloadAction<any>) => {
                    state.isLoading = true;
                }
            )
            .addCase(
                timeConditionGet.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.timeConditionData = action.payload;
                    state.isLoading = false;
                }
            )
            .addCase(
                timeConditionGet.rejected,
                (state, action: PayloadAction<any>) => {
                    state.isLoading = false;
                }
            );

        builder
            .addCase(
                timeConditionSearch.pending,
                (state, action: PayloadAction<any>) => {
                    state.isLoading = true;
                }
            )
            .addCase(
                timeConditionSearch.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.timeConditionData = action.payload;
                    state.isLoading = false;
                }
            )
            .addCase(
                timeConditionSearch.rejected,
                (state, action: PayloadAction<any>) => {
                    state.isLoading = false;
                }
            );

        builder.addCase(
            timeConditionOptionsGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                const data = action.payload?.data;
                state.timeConditionOptions = data?.map((val: any) => ({
                    value: val?.uuid,
                    label: val?.name,
                })) || []
            }
        );
    },
});

export default timeConditionSlice.reducer;
export const { updateSingleTimeConditionData, clearTimeCondition } =
    timeConditionSlice.actions;

export const selectIsLoading = (state: RootState) =>
    state.timeCondition.isLoading;
export const useIsLoading = () => {
    const isLoading = useAppSelector(selectIsLoading);
    return useMemo(() => isLoading, [isLoading]);
};

export const selectTimeCondition = (state: RootState) =>
    state.timeCondition.timeConditionData;
export const useTimeCondition = () => {
    const timeCondition = useAppSelector(selectTimeCondition);
    return useMemo(() => timeCondition, [timeCondition]);
};

export const selectSingletimeCondition = (state: RootState) =>
    state.timeCondition.singleTimeConditionData;
export const useSingletimeCondition = () => {
    const timeCondition = useAppSelector(selectSingletimeCondition);
    return useMemo(() => timeCondition, [timeCondition]);
};

export const selectTimeConditionOptions = (state: RootState) =>
    state.timeCondition.timeConditionOptions;
export const useTimeConditionOptions = () => {
    const options = useAppSelector(selectTimeConditionOptions);
    return useMemo(() => options, [options]);
};
