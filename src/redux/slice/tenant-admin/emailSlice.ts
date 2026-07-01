import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import {
    emailConfigs,
    createEmailConfig,
    updateEmailConfig,
    testEmailConfig,
    emailTemplates,
    searchEmailTemplate,
    createEmailTemplate,
    updateEmailTemplate,
    emailChannels,
    searchEmailChannel,
    deleteEmailTemplate,
    deleteEmailChannel
} from "@/redux/services/tenant-admin/emailServices";
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";

interface InitialState {
    isLoading: boolean;
    configData: any;
    templateData: any;
    channelData: any;
    singleConfigData: any;
    singleTemplateData: any;
    singleChannelData: any;
}

const initialState: InitialState = {
    isLoading: false,
    configData: {},
    templateData: {},
    channelData: {},
    singleConfigData: {},
    singleTemplateData: {},
    singleChannelData: {},
};

export const emailConfigsGet = createAsyncThunk("email/configs/get", async (params: any) => {
    return await emailConfigs(params);
});

export const emailConfigCreate = createAsyncThunk("email/configs/create", async (payload: any) => {
    return await createEmailConfig(payload);
});

export const emailConfigUpdate = createAsyncThunk("email/configs/update", async (payload: any) => {
    const { id, ...rest } = payload;
    return await updateEmailConfig(id, rest);
});

export const emailConfigTest = createAsyncThunk("email/configs/test", async (payload: any) => {
    return await testEmailConfig(payload);
});

export const emailTemplatesGet = createAsyncThunk("email/templates/get", async (params: any) => {
    return await emailTemplates(params);
});

export const emailTemplateSearch = createAsyncThunk("email/templates/search", async (params: any) => {
    return await searchEmailTemplate(params);
});

export const emailTemplateCreate = createAsyncThunk("email/templates/create", async (payload: any) => {
    return await createEmailTemplate(payload);
});

export const emailTemplateUpdate = createAsyncThunk("email/templates/update", async (payload: any) => {
    const { id, ...rest } = payload;
    return await updateEmailTemplate(id, rest);
});

export const emailTemplateDelete = createAsyncThunk("email/templates/delete", async (id: string) => {
    return await deleteEmailTemplate(id);
});

export const emailChannelsGet = createAsyncThunk("email/channels/get", async (params: any) => {
    return await emailChannels(params);
});

export const emailChannelSearch = createAsyncThunk("email/channels/search", async (params: any) => {
    return await searchEmailChannel(params);
});

const emailSlice = createSlice({
    name: "email",
    initialState,
    reducers: {
        updateSingleConfigData: (state, action) => {
            state.singleConfigData = action.payload ? action.payload : {};
        },
        updateSingleTemplateData: (state, action) => {
            state.singleTemplateData = action.payload ? action.payload : {};
        },
        updateSingleChannelData: (state, action) => {
            state.singleChannelData = action.payload ? action.payload : {};
        },
        clearEmail: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(emailConfigsGet.pending, (state) => { state.isLoading = true; })
            .addCase(emailConfigsGet.fulfilled, (state, action: PayloadAction<any>) => {
                state.configData = { data: action.payload?.data, count: action.payload?.count };
                state.isLoading = false;
            })
            .addCase(emailConfigsGet.rejected, (state) => { state.isLoading = false; });

        builder
            .addCase(emailTemplatesGet.pending, (state) => { state.isLoading = true; })
            .addCase(emailTemplatesGet.fulfilled, (state, action: PayloadAction<any>) => {
                state.templateData = { data: action.payload?.data, count: action.payload?.count };
                state.isLoading = false;
            })
            .addCase(emailTemplatesGet.rejected, (state) => { state.isLoading = false; });

        builder
            .addCase(emailTemplateSearch.fulfilled, (state, action: PayloadAction<any>) => {
                state.templateData = { data: action.payload?.data, count: action.payload?.count };
            });

        builder
            .addCase(emailChannelsGet.pending, (state) => { state.isLoading = true; })
            .addCase(emailChannelsGet.fulfilled, (state, action: PayloadAction<any>) => {
                state.channelData = { data: action.payload?.data, count: action.payload?.count };
                state.isLoading = false;
            })
            .addCase(emailChannelsGet.rejected, (state) => { state.isLoading = false; });

        builder
            .addCase(emailChannelSearch.fulfilled, (state, action: PayloadAction<any>) => {
                state.channelData = { data: action.payload?.data, count: action.payload?.count };
            });
    },
});

export default emailSlice.reducer;
export const { 
    updateSingleConfigData, 
    updateSingleTemplateData, 
    updateSingleChannelData, 
    clearEmail 
} = emailSlice.actions;

export const useEmailIsLoading = () => {
    const isLoading = useAppSelector((state: RootState) => state.email.isLoading);
    return useMemo(() => isLoading, [isLoading]);
};

export const useEmailConfigs = () => {
    const data = useAppSelector((state: RootState) => state.email.configData);
    return useMemo(() => data, [data]);
};

export const useEmailTemplates = () => {
    const data = useAppSelector((state: RootState) => state.email.templateData);
    return useMemo(() => data, [data]);
};

export const useEmailChannels = () => {
    const data = useAppSelector((state: RootState) => state.email.channelData);
    return useMemo(() => data, [data]);
};

export const useSingleTemplateData = () => {
    const data = useAppSelector((state: RootState) => state.email.singleTemplateData);
    return useMemo(() => data, [data]);
};

export const useSingleConfigData = () => {
    const data = useAppSelector((state: RootState) => state.email.singleConfigData);
    return useMemo(() => data, [data]);
};
