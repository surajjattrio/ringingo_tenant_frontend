import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";
import {
    allConference,
    conference,
    createConference,
    deleteConference,
    searchConference,
    updateConference,
    updateConferenceStatus,
} from "@/redux/services/tenant-admin/conferenceServices";

// TYPES IMPORT
import { OptionTypes } from "@/types/formTypes";

interface InitialState {
    isLoading: boolean;
    conferenceData: any;
    singleConferenceData: any;
    conferenceOptions: OptionTypes[];
}

const initialState: InitialState = {
    isLoading: false,
    conferenceData: {},
    singleConferenceData: {},
    conferenceOptions: [],
};

export const conferenceGet = createAsyncThunk(
    "conference/get",
    async (params: any) => {
        return await conference(params);
    }
);

export const conferenceSearch = createAsyncThunk(
    "conference/search",
    async (params: any) => {
        return await searchConference(params);
    }
);

export const conferenceCreate = createAsyncThunk(
    "conference/create",
    async (payload: any) => {
        return await createConference(payload);
    }
);

export const conferenceUpdate = createAsyncThunk(
    "conference/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateConference(id, rest);
    }
);

export const conferenceStatusUpdate = createAsyncThunk(
    "conference-status/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateConferenceStatus(id, rest);
    }
);
export const conferenceDelete = createAsyncThunk(
    "conference/delete",
    async (id: string) => {
        return await deleteConference(id);
    }
);

export const conferenceOptionsGet = createAsyncThunk(
    "conference-options/get",
    async () => {
        return await allConference();
    }
);

const conferenceSlice = createSlice({
    name: "conference",
    initialState,
    reducers: {
        updateSingleConferenceData: (state, action) => {
            state.singleConferenceData = action.payload ? action.payload : {};
        },
        clearConference: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(conferenceGet.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(conferenceGet.fulfilled, (state, action: PayloadAction<any>) => {
                state.conferenceData = action.payload;
                state.isLoading = false;
            })
            .addCase(conferenceGet.rejected, (state) => {
                state.isLoading = false;
            });

        builder
            .addCase(
                conferenceSearch.pending,
                (state, action: PayloadAction<any>) => {
                    state.isLoading = true;
                }
            )
            .addCase(
                conferenceSearch.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.conferenceData = action.payload;
                    state.isLoading = false;
                }
            )
            .addCase(
                conferenceSearch.rejected,
                (state, action: PayloadAction<any>) => {
                    state.isLoading = false;
                }
            );

        builder.addCase(
            conferenceOptionsGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                const data = action.payload?.data;
                state.conferenceOptions = data?.map((val: any) => ({
                    value: val?.uuid,
                    label: val?.name,
                })) || []
            }
        );
    },
});

export default conferenceSlice.reducer;
export const { updateSingleConferenceData, clearConference } =
    conferenceSlice.actions;

export const selectIsLoading = (state: RootState) => state.conference.isLoading;
export const useIsLoading = () => {
    const isLoading = useAppSelector(selectIsLoading);
    return useMemo(() => isLoading, [isLoading]);
};

export const selectConference = (state: RootState) =>
    state.conference.conferenceData;
export const useConference = () => {
    const conference = useAppSelector(selectConference);
    return useMemo(() => conference, [conference]);
};

export const selectSingleConference = (state: RootState) =>
    state.conference.singleConferenceData;
export const useSingleConference = () => {
    const conference = useAppSelector(selectSingleConference);
    return useMemo(() => conference, [conference]);
};

export const selectConferenceOptions = (state: RootState) =>
    state.conference.conferenceOptions;
export const useConferenceOptions = () => {
    const options = useAppSelector(selectConferenceOptions);
    return useMemo(() => options, [options]);
};
