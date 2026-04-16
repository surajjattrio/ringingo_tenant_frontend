import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { allVoiceMail, searchVoiceMail, voiceMail } from "@/redux/services/tenant-admin/voiceMailServices";
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";

// TYPES IMPORT
import { OptionTypes } from "@/types/formTypes";

interface InitialState {
    isLoading: boolean;
    voiceMailData: any;
    allVoiceMailData: any;
    voiceMailOptions: OptionTypes[];
}

const initialState: InitialState = {
    isLoading: false,
    voiceMailData: {},
    allVoiceMailData: {},
    voiceMailOptions: [],
};

export const voiceMailGet = createAsyncThunk(
    "voiceMail/get",
    async (params: any) => {
        return await voiceMail(params);
    }
);

export const voiceMailSearch = createAsyncThunk(
    "voiceMail/search",
    async (params: any) => {
        return await searchVoiceMail(params);
    }
);

export const voiceMailAllGet = createAsyncThunk(
    "voiceMail-all/get",
    async () => {
        const params = { list: "all" };
        return await allVoiceMail(params);
    }
);

export const voiceMailOptionsGet = createAsyncThunk(
    "voiceMail-options/get",
    async () => {
        return await allVoiceMail();
    }
);

const voiceMailSlice = createSlice({
    name: "voiceMail",
    initialState,
    reducers: {
        clearVoiceMail: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(voiceMailGet.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(voiceMailGet.fulfilled, (state, action: PayloadAction<any>) => {
                state.voiceMailData = action.payload;
                state.isLoading = false;
            })
            .addCase(voiceMailGet.rejected, (state) => {
                state.isLoading = false;
            });

        builder
            .addCase(voiceMailSearch.pending, (state, action: PayloadAction<any>) => {
                state.isLoading = true;
            })
            .addCase(
                voiceMailSearch.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.voiceMailData = action.payload;
                    state.isLoading = false;
                }
            )
            .addCase(
                voiceMailSearch.rejected,
                (state, action: PayloadAction<any>) => {
                    state.isLoading = false;
                }
            );

        builder.addCase(
            voiceMailAllGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.allVoiceMailData = action.payload;
            }
        );

        builder.addCase(
            voiceMailOptionsGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                const data = action.payload?.data;
                state.voiceMailOptions = data?.map((val: any) => ({
                    value: val?.uuid,
                    label: val?.name,
                }));
            }
        );
    },
});

export default voiceMailSlice.reducer;
export const { clearVoiceMail } = voiceMailSlice.actions;

export const selectIsLoading = (state: RootState) => state.voiceMail.isLoading;
export const useIsLoading = () => {
    const isLoading = useAppSelector(selectIsLoading);
    return useMemo(() => isLoading, [isLoading]);
};

export const selectVoiceMAil = (state: RootState) =>
    state.voiceMail.voiceMailData;
export const useVoiceMail = () => {
    const voiceMail = useAppSelector(selectVoiceMAil);
    return useMemo(() => voiceMail, [voiceMail]);
};

export const selectAllVoiceMAil = (state: RootState) =>
    state.voiceMail.allVoiceMailData;
export const useAllVoiceMAil = () => {
    const allVoiceMAil = useAppSelector(selectAllVoiceMAil);
    return useMemo(() => allVoiceMAil, [allVoiceMAil]);
};

export const selectVoiceMAilOptions = (state: RootState) =>
    state.voiceMail.voiceMailOptions;
export const useVoiceMAilOptions = () => {
    const options = useAppSelector(selectVoiceMAilOptions);
    return useMemo(() => options, [options]);
};
