import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import {
    allMsgChannel,
    createMsgChannel,
    deleteMsgChannel,
    msgChannels,
    updateMsgChannel,
    searchMsgChannel,
     whatsappMsgChannel,
     smsMsgChannel
} from "@/redux/services/tenant-admin/messageChannelServices";
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";

// TYPES IMPORT
import { ObjectOptionTypes, OptionTypes } from "@/types/formTypes";
import { msgChannelProviderOptions, msgChannelTypeOptions } from "@/config/options";

interface InitialState {
    isLoading: boolean;
    msgChannelData: any;
    singleMsgChannelData: any;
     msgChannelOptions: OptionTypes[];
}

const initialState: InitialState = {
    isLoading: false,
    msgChannelData: {},
    singleMsgChannelData: {},
      msgChannelOptions: [],
};

export const msgChannelsGet = createAsyncThunk("messaging-channel/get", async (params: any) => {
    return await msgChannels(params);
});

export const msgChannelSearch = createAsyncThunk(
    "messaging-channel/search",
    async (params: any) => {
        return await searchMsgChannel(params);
    }
);

export const msgChannelCreate = createAsyncThunk(
    "messaging-channel/create",
    async (payload: any) => {
        return await createMsgChannel(payload);
    }
);

export const msgChannelUpdate = createAsyncThunk(
    "messaging-channel/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateMsgChannel(id, rest);
    }
);

export const msgChannelDelete = createAsyncThunk(
    "messaging-channel/delete",
    async (id: string) => {
        return await deleteMsgChannel(id);
    }
);

export const msgChannelOptionsGet = createAsyncThunk(
    "messaging-channel-options/getAll",
    async () => {
        return await allMsgChannel();
    }
);

export const msgChannelWhatsapp = createAsyncThunk(
    "messaging-channel/getAll",
    async () => {
        return await whatsappMsgChannel();
    }
);

export const msgChannelSMS = createAsyncThunk(
    "messaging-channel-sms/getAll",
    async () => {
        return await smsMsgChannel();
    }
);


const prepareData = (payload: any) => {
    const data = payload?.data;
    const count = payload?.count;

    const newData = data?.map((val: any) => {
        const type = msgChannelTypeOptions?.find(
            (option: any) => option?.value === val?.type
        );
        const provider = msgChannelProviderOptions?.find(
            (option: any) => option?.value === val?.provider
        );
        return {
            ...val,
            type: type?.label || "",
            provider: provider?.label || "",
            from_number: val.customFields?.from_number
        };
    });

    return { data: newData, count };
};

const channelSlice = createSlice({
    name: "messaging-channel",
    initialState,
    reducers: {
        updateSingleChannelData: (state, action) => {
            state.singleMsgChannelData = action.payload ? action.payload : {};
        },
        clearChannel: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(msgChannelsGet.pending, (state, action: PayloadAction<any>) => {
                state.isLoading = true;
            })
            .addCase(msgChannelsGet.fulfilled, (state, action: PayloadAction<any>) => {
                state.msgChannelData = {data: action.payload?.data, count: action.payload?.count};                
                state.isLoading = false;
            })
            .addCase(msgChannelsGet.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
            });

        builder
            .addCase(msgChannelSearch.pending, (state, action: PayloadAction<any>) => {
                state.isLoading = true;
            })
            .addCase(msgChannelSearch.fulfilled, (state, action: PayloadAction<any>) => {
                state.msgChannelData = prepareData(action.payload);
                state.isLoading = false;
            })
            .addCase(msgChannelSearch.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
            });

               builder.addCase(
                msgChannelOptionsGet.fulfilled,
                (state, action: PayloadAction<any>) => {
                    const data = action.payload?.data;
                    state.msgChannelOptions = data?.map((val: any) => ({
                        value: {
                            name: val?.name,
                            uuid: val?.uuid,
                        },
                        label: val?.name,
                    })) || [];

            }
        );     

    },
});

export default channelSlice.reducer;
export const { updateSingleChannelData, clearChannel } = channelSlice.actions;

export const selectIsLoading = (state: RootState) => state.messagingChannel.isLoading;
export const useIsLoading = () => {
    const isLoading = useAppSelector(selectIsLoading);
    return useMemo(() => isLoading, [isLoading]);
};

export const selectMsgChannel = (state: RootState) => state.messagingChannel.msgChannelData;
export const useMsgChannel = () => {
    const channels = useAppSelector(selectMsgChannel);
    return useMemo(() => channels, [channels]);
};

export const selectSingleMsgChannel = (state: RootState) => state.messagingChannel.singleMsgChannelData;
export const useSingleMsgChannel = () => {
    const channel = useAppSelector(selectSingleMsgChannel);
    return useMemo(() => channel, [channel]);
};

export const selectMsgChannelOptions = (state: RootState) =>
    state.messagingChannel.msgChannelOptions;
export const useMsgChannelOptions = () => {
    const options = useAppSelector(selectMsgChannelOptions);
    return useMemo(() => options, [options]);
};