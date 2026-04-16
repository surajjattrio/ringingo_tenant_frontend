import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import {
    allMsgQueue,
    createMsgQueue,
    deleteMsgQueue,
    msgQueues,
    updateMsgQueue,
    searchMsgQueue,
    updateMsgQueueStatus
} from "@/redux/services/tenant-admin/messageQueueServices";
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";


// TYPES IMPORT
import { OptionTypes } from "@/types/formTypes";
import { msgQueueTypeOptions } from "@/config/options";

interface InitialState {
    isLoading: boolean;
    msgQueueData: any;
    singleMsgQueueData: any;
    msgQueueOptions: OptionTypes[];
}

const initialState: InitialState = {
    isLoading: false,
    msgQueueData: {},
    singleMsgQueueData: {},
    msgQueueOptions: [],
};

export const msgQueuesGet = createAsyncThunk("messaging-queue/get", async (params: any) => {
    return await msgQueues(params);
});

export const msgQueueSearch = createAsyncThunk(
    "messaging-queue/search",
    async (params: any) => {
        return await searchMsgQueue(params);
    }
);

export const msgQueueCreate = createAsyncThunk(
    "messaging-queue/create",
    async (payload: any) => {
        return await createMsgQueue(payload);
    }
);

export const msgQueueUpdate = createAsyncThunk(
    "messaging-queue/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateMsgQueue(id, rest);
    }
);

export const msgQueueStatusUpdate = createAsyncThunk(
    "messaging-queue/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateMsgQueueStatus(id, rest);
    }
);

export const msgQueueDelete = createAsyncThunk(
    "messaging-queue/delete",
    async (id: string) => {
        return await deleteMsgQueue(id);
    }
);

export const msgQueueOptionsGet = createAsyncThunk(
    "messaging-queue-options/getAll",
    async () => {
        return await allMsgQueue();
    }
);



const prepareData = (payload: any) => {
    const data = payload?.data;
    const count = payload?.count;

    const newData = data?.map((val: any) => {
        const type = msgQueueTypeOptions?.find(
            (option: any) => option?.value === val?.type
        );
        return {
            ...val,
            type_value: type?.label || "",
        };
    });

    return { data: newData, count };
};

const queueSlice = createSlice({
    name: "messaging-queue",
    initialState,
    reducers: {
        updateSingleQueueData: (state, action) => {
            state.singleMsgQueueData = action.payload ? action.payload : {};
        },
        clearQueue: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(msgQueuesGet.pending, (state, action: PayloadAction<any>) => {
                state.isLoading = true;
            })
            .addCase(msgQueuesGet.fulfilled, (state, action: PayloadAction<any>) => {
                state.msgQueueData = prepareData(action.payload);
                state.isLoading = false;
            })
            .addCase(msgQueuesGet.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
            });

        builder
            .addCase(msgQueueSearch.pending, (state, action: PayloadAction<any>) => {
                state.isLoading = true;
            })
            .addCase(msgQueueSearch.fulfilled, (state, action: PayloadAction<any>) => {
                state.msgQueueData = prepareData(action.payload);
                state.isLoading = false;
            })
            .addCase(msgQueueSearch.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
            });

              builder.addCase(
                msgQueueOptionsGet.fulfilled,
                (state, action: PayloadAction<any>) => {
                    const data = action.payload?.data;
                    state.msgQueueOptions = data?.map((val: any) => ({
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

export default queueSlice.reducer;
export const { updateSingleQueueData, clearQueue } = queueSlice.actions;

export const selectIsLoading = (state: RootState) => state.messagingQueue.isLoading;
export const useIsLoading = () => {
    const isLoading = useAppSelector(selectIsLoading);
    return useMemo(() => isLoading, [isLoading]);
};

export const selectMsgQueue = (state: RootState) => state.messagingQueue.msgQueueData;
export const useMsgQueue = () => {
    const queues = useAppSelector(selectMsgQueue);
    return useMemo(() => queues, [queues]);
};

export const selectSingleMsgQueue = (state: RootState) => state.messagingQueue.singleMsgQueueData;
export const useSingleMsgQueue = () => {
    const queue = useAppSelector(selectSingleMsgQueue);
    return useMemo(() => queue, [queue]);
};


export const selectMsgQueueOptions = (state: RootState) =>
    state.messagingQueue.msgQueueOptions;
export const useMsgQueueOptions = () => {
    const options = useAppSelector(selectMsgQueueOptions);
    return useMemo(() => options, [options]);
};