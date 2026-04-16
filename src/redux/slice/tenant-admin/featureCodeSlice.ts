import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";
import { featureCode, singleFeatureCode, updateFeatureCode } from "@/redux/services/tenant-admin/featureCodeServices";

interface InitialState {
    isLoading: boolean;
    featureCodeData: any;
    singleFeatureCode: any;
}

const initialState: InitialState = {
    isLoading: true,
    featureCodeData: {},
    singleFeatureCode: {},
};

export const featureCodeGet = createAsyncThunk("featureCode/get", async () => {
    return await featureCode();
});

export const featureCodeSingleGet = createAsyncThunk("featureCode/single-get", async (id: string) => {
    return await singleFeatureCode(id);
});

export const featureCodeUpdate = createAsyncThunk("featureCode/update", async (payload: any) => {
    const { id, ...rest } = payload;
    return await updateFeatureCode(id, rest);
});

const featureCodeSlice = createSlice({
    name: "featureCode",
    initialState,
    reducers: {
        updateSingleFeatureCode: (state, action: PayloadAction<any>) => {
            state.singleFeatureCode = action.payload ? action.payload : {}
        },
        clearFeatureCode:() => initialState
    },
    extraReducers: (builder) => {
        builder.addCase(
            featureCodeGet.pending,
            (state, action: PayloadAction<any>) => {
                state.isLoading = true
            }
        )
            .addCase(
                featureCodeGet.fulfilled,
                (state, action: PayloadAction<any>) => {
                    const data = action.payload?.data || []
                    state.featureCodeData = data
                    state.isLoading = false
                }
            )
            .addCase(
                featureCodeGet.rejected,
                (state, action: PayloadAction<any>) => {
                    state.isLoading = false
                }
            )
    },
});

export default featureCodeSlice.reducer;
export const { updateSingleFeatureCode,clearFeatureCode } = featureCodeSlice.actions;

export const selectIsLoading = (state: RootState) => state.featureCode.isLoading;
export const useIsLoading = () => {
    const isLoading = useAppSelector(selectIsLoading);
    return useMemo(() => isLoading, [isLoading]);
};

export const selectFeatureCode = (state: RootState) => state.featureCode.featureCodeData;
export const useFeatureCode = () => {
    const featureCode = useAppSelector(selectFeatureCode);
    return useMemo(() => featureCode, [featureCode]);
};

export const selectSingleFeatureCode = (state: RootState) => state.featureCode.singleFeatureCode;
export const useSingleFeatureCode = () => {
    const featureCode = useAppSelector(selectSingleFeatureCode);
    return useMemo(() => featureCode, [featureCode]);
};