import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";
import {
    createSipProfile,
    deleteSipProfile,
    searchSipProfile,
    sipProfile,
    sipProfileAll,
    updateSipProfile,
    updateSipProfileStatus,
} from "../../services/master-admin/sipProfileService";

// TYPES IMPORT
import { OptionTypes } from "@/types/formTypes";

interface InitialState {
    isLoading: boolean;
    sipProfileData: any;
    singleSipProfileData: any;
    sipProfileOptions: OptionTypes[]
}

const initialState: InitialState = {
    isLoading: false,
    sipProfileData: [],
    singleSipProfileData: {},
    sipProfileOptions: []
};

export const sipProfileGet = createAsyncThunk(
    "sip-profile/get",
    async (params: any) => {
        return await sipProfile(params);
    }
);

export const sipProfileOptionsGet = createAsyncThunk(
    "sip-profile/getAll",
    async () => {
        return await sipProfileAll();
    }
);

export const sipProfileSearch = createAsyncThunk(
    "sip-profile/search",
    async (payload: any) => {
        return await searchSipProfile(payload);
    }
);

export const sipProfileCreate = createAsyncThunk(
    "sip-profile/create",
    async (payload: any) => {
        return await createSipProfile(payload);
    }
);

export const sipProfileUpdate = createAsyncThunk(
    "sip-profile/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateSipProfile(id, rest);
    }
);

export const sipProfileStatusUpdate = createAsyncThunk(
    "sip-profile-status/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateSipProfileStatus(id, rest);
    }
);

export const sipProfileDelete = createAsyncThunk(
    "sip-profile/delete",
    async (id: string) => {
        return await deleteSipProfile(id);
    }
);

const sipProfileSlice = createSlice({
    name: "sipProfile",
    initialState,
    reducers: {
        updateSingleSipData: (state, action) => {
            state.singleSipProfileData = action.payload ? action.payload : {}
        },
        clearSip : () => initialState
    },
    extraReducers: (builder) => {
        builder.addCase(
            sipProfileGet.pending,
            (state, action: PayloadAction<any>) => {
                state.isLoading = true
            }
        )
            .addCase(
                sipProfileGet.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.sipProfileData = action.payload;
                    state.isLoading = false
                }
            )
            .addCase(
                sipProfileGet.rejected,
                (state, action: PayloadAction<any>) => {
                    state.isLoading = false
                }
            );

        builder.addCase(
            sipProfileSearch.pending,
            (state, action: PayloadAction<any>) => {
                state.isLoading = true
            }
        )
            .addCase(
                sipProfileSearch.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.sipProfileData = action.payload;
                    state.isLoading = false
                }
            )
            .addCase(
                sipProfileSearch.rejected,
                (state, action: PayloadAction<any>) => {
                    state.isLoading = false
                }
            );

        builder.addCase(sipProfileOptionsGet.fulfilled, (state, action) => {
            const data = action.payload?.data || []
            state.sipProfileOptions = data?.map((val: any) => ({
                value: val.uuid, label: val.name
            }))
        })
    },
});

export default sipProfileSlice.reducer;
export const { clearSip } = sipProfileSlice.actions

export const { updateSingleSipData } = sipProfileSlice.actions

export const selectIsLoading = (state: RootState) =>
    state.sipProfile.isLoading;
export const useIsLoading = () => {
    const isLoading = useAppSelector(selectIsLoading);
    return useMemo(() => isLoading, [isLoading]);
};

export const selectSipProfileData = (state: RootState) =>
    state.sipProfile.sipProfileData;
export const useSipProfileData = () => {
    const sipProfileData = useAppSelector(selectSipProfileData);
    return useMemo(() => sipProfileData, [sipProfileData]);
};

export const selectSingleSipData = (state: RootState) => state.sipProfile.singleSipProfileData;
export const useSingleSipData = () => {
    const singleSipProfileData = useAppSelector(selectSingleSipData);
    return useMemo(() => singleSipProfileData, [singleSipProfileData]);
};

export const selectSipProfileOptions = (state: RootState) =>
    state.sipProfile.sipProfileOptions;
export const useSipProfileOptions = () => {
    const sipProfileOptions = useAppSelector(selectSipProfileOptions);
    return useMemo(() => sipProfileOptions, [sipProfileOptions]);
};
