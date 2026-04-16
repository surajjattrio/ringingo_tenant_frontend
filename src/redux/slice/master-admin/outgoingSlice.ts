import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";
import {
    allOutgoing,
    createOutgoing,
    deleteOutgoing,
    outgoing,
    searchOutgoing,
    updateOutgoing,
    updateOutgoingStatus,
} from "@/redux/services/master-admin/outgoingServices";

// TYPES IMPORT
import { OptionTypes } from "@/types/formTypes";

interface InitialState {
    isLoading: boolean;
    outgoingData: any;
    singleOutgoingData: any;
    outgoingOptions: OptionTypes[];
}

const initialState: InitialState = {
    isLoading: false,
    outgoingData: {},
    singleOutgoingData: {},
    outgoingOptions: [],
};

export const outgoingGet = createAsyncThunk(
    "outgoing/get",
    async (params: any) => {
        return await outgoing(params);
    }
);

export const outgoingSearch = createAsyncThunk(
    "outgoing/search",
    async (params: any) => {
        return await searchOutgoing(params);
    }
);

export const outgoingCreate = createAsyncThunk(
    "outgoing/create",
    async (payload: any) => {
        return await createOutgoing(payload);
    }
);

export const outgoingUpdate = createAsyncThunk(
    "outgoing/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateOutgoing(id, rest);
    }
);

export const outgoingStatusUpdate = createAsyncThunk(
    "outgoing-status/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateOutgoingStatus(id, rest);
    }
);
export const outgoingDelete = createAsyncThunk(
    "outgoing/delete",
    async (id: string) => {
        return await deleteOutgoing(id);
    }
);

export const outgoingOptionsGet = createAsyncThunk(
    "outgoing-options/get",
    async () => {
        return await allOutgoing();
    }
);

const outgoingSlice = createSlice({
    name: "outgoing",
    initialState,
    reducers: {
        updateSingleOutgoingData: (state, action) => {
            state.singleOutgoingData = action.payload ? action.payload : {};
        },
        clearOutgoing: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(outgoingGet.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(outgoingGet.fulfilled, (state, action: PayloadAction<any>) => {
                state.outgoingData = action.payload;
                state.isLoading = false;
            })
            .addCase(outgoingGet.rejected, (state) => {
                state.isLoading = false;
            });

        builder
            .addCase(outgoingSearch.pending, (state, action: PayloadAction<any>) => {
                state.isLoading = true;
            })
            .addCase(
                outgoingSearch.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.outgoingData = action.payload;
                    state.isLoading = false;
                }
            )
            .addCase(outgoingSearch.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
            });

        builder.addCase(
            outgoingOptionsGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                const data = action.payload?.data;
                state.outgoingOptions = data?.map((val: any) => ({
                    value: val?.uuid,
                    label: val?.name,
                }));
            }
        );
    },
});

export default outgoingSlice.reducer;
export const { updateSingleOutgoingData, clearOutgoing } =
    outgoingSlice.actions;

export const selectIsLoading = (state: RootState) => state.outgoing.isLoading;
export const useIsLoading = () => {
    const isLoading = useAppSelector(selectIsLoading);
    return useMemo(() => isLoading, [isLoading]);
};

export const selectOutgoing = (state: RootState) => state.outgoing.outgoingData;
export const useOutgoing = () => {
    const outgoing = useAppSelector(selectOutgoing);
    return useMemo(() => outgoing, [outgoing]);
};

export const selectSingleOutgoing = (state: RootState) =>
    state.outgoing.singleOutgoingData;
export const useSingleOutgoing = () => {
    const outgoing = useAppSelector(selectSingleOutgoing);
    return useMemo(() => outgoing, [outgoing]);
};

export const selectOutgoingOptions = (state: RootState) =>
    state.outgoing.outgoingOptions;
export const useOutgoingOptions = () => {
    const options = useAppSelector(selectOutgoingOptions);
    return useMemo(() => options, [options]);
};
