import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";
import {
    allVoiceBroadcastGet,
    createVoiceBroadcast,
    deleteVoiceBroadcast,
    singleVoiceBroadcast,
    updateVoiceBroadcast,
    updateVoiceBroadcastStatus,
    voiceBroadcast,
    leadGroupListVoiceBroadcast,
    searchVoiceBroadcast,
    resetVoiceBroadcast,
    updateVoiceBroadcastFeature,
    deleteVoiceBroadcastLeadGroup,
} from "@/redux/services/tenant-admin/voiceBroadcastServices";
import { format } from "date-fns";

interface InitialState {
    voiceBroadcastData: any;
    voiceBroadcastOptions: any;
    allVoiceBroadcast: any;
    allVoiceBroadcastData: any;
}

const initialState: InitialState = {
    voiceBroadcastData: [],
    voiceBroadcastOptions: [],
    allVoiceBroadcast: [],
    allVoiceBroadcastData: []
};

export const voiceBroadcastGet = createAsyncThunk(
    "voice-broadcast/get",
    async (params: any) => {
        return await voiceBroadcast(params);
    }
);

export const voiceBroadcastLeadGroupDelete = createAsyncThunk(
    "voice-broadcast-lead-group/delete",
    async (payload: any) => {
        return await deleteVoiceBroadcastLeadGroup(payload);
    }
);


export const voiceBroadcastSingleGet = createAsyncThunk(
    "voice-broadcast-single/get",
    async (od: string) => {
        return await singleVoiceBroadcast(od);
    }
);

export const voiceBroadcastStatusUpdate = createAsyncThunk(
    "voiceBroadcast-status/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateVoiceBroadcastStatus(id, rest);
    }
);

export const voiceBroadcastDelete = createAsyncThunk(
    "voiceBroadcast/delete",
    async (id: string) => {
        return await deleteVoiceBroadcast(id);
    }
);

export const voiceBroadcastAdd = createAsyncThunk(
    "voice-broadcast/create",
    async (payload: any) => {
        return await createVoiceBroadcast(payload);
    }
);
export const leadGroupVoiceBroadcastGet = createAsyncThunk(
    "voice-broadcast-lead-group/get",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await leadGroupListVoiceBroadcast(id, rest);
    }
);

export const voiceBroadcastUpdate = createAsyncThunk(
    "voice-broadcast/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateVoiceBroadcast(id, rest);
    }
);

export const voiceBroadcastFeature = createAsyncThunk(
    "voice-broadcast/feature",
    async (payload: any) => {
        const { feature, ...rest } = payload;
        return await updateVoiceBroadcastFeature(feature, rest);
    }
);

export const voiceBroadcastSearch = createAsyncThunk(
    "voice-broadcast/search",
    async (payload: any) => {
        return await searchVoiceBroadcast(payload);
    }
);

export const voiceBroadcastLeadReset = createAsyncThunk(
    "voice-broadcast/reset",
    async (payload: any) => {
        return await resetVoiceBroadcast(payload);
    }
);

export const voiceBroadcastAllGet = createAsyncThunk(
    "voiceBroadcast-all/get",
    async (params?: any) => {
        return await allVoiceBroadcastGet(params);
    }
);

export const voiceBroadcastOptionsGet = createAsyncThunk(
    "voiceBroadcast-options/get",
    async () => {
        return await allVoiceBroadcastGet();
    }
);

const prepareData = (payload: any) => {
    const data = payload?.data;
    const count = payload?.count;

    const newData = data?.map((val: any) => {
        return {
            ...val,
            isShowButton : true,
            //voice_broadcast_name: val?.voice?.[0]?.username || "",
            voice_broadcast_name: val?.voice_broadcast_uuid,

            startDate: val?.start_date
                ? format(new Date(val?.start_date), "yyyy-MM-dd HH:mm:ss")
                : "",
            endDate: val?.end_date
                ? format(new Date(val?.end_date), "yyyy-MM-dd HH:mm:ss")
                : "",
        };
    });

    return { data: newData, count };
};


const preparedData = (state:any, payload:any) => {
    const data = JSON.parse(JSON.stringify(state))
    const count = data?.count;

    const newData = data?.data?.map((val: any) => {
        return {
            ...val,
            isShowButton: val?.uuid === payload?.uuid ? false : val?.isShowButton,
            showCount: val?.uuid === payload?.uuid ? payload?.showCount || 0 : val?.showCount 
        };
    });

    return { data: newData, count };
}

const voiceBroadcastSlice = createSlice({
    name: "voiceBroadcast",
    initialState,
    reducers: {
        setProcessedCount:(state, action)=>{
            state.voiceBroadcastData = preparedData(state.voiceBroadcastData, action.payload);
        },
        clearVoiceBroadcast: () => initialState,
    },
    extraReducers: (builder) => {
        builder.addCase(
            voiceBroadcastGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.voiceBroadcastData = prepareData(action.payload);
            }
        );

        builder.addCase(
            voiceBroadcastAllGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.allVoiceBroadcastData = prepareData(action.payload);
            }
        );

        builder.addCase(
            voiceBroadcastSearch.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.voiceBroadcastData = prepareData(action.payload);
            }
        );

        builder.addCase(
            voiceBroadcastOptionsGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                const data = action.payload?.data;
                // const data = action.payload?.data?.length ? action.payload?.data : [];

                state.voiceBroadcastOptions = data?.map((val: any) => ({
                    value: val?.uuid,
                    label: val?.name,
                }));
            }
        );
    },
});

export default voiceBroadcastSlice.reducer;
export const { clearVoiceBroadcast, setProcessedCount } = voiceBroadcastSlice.actions;

export const selectVoiceBroadcastData = (state: RootState) =>
    state.voiceBroadcast.voiceBroadcastData;
export const useVoiceBroadcastData = () => {
    const voiceBroadcast = useAppSelector(selectVoiceBroadcastData);
    return useMemo(() => voiceBroadcast, [voiceBroadcast]);
};

export const selectAllVoiceBroadcast = (state: RootState) =>
    state.voiceBroadcast.allVoiceBroadcastData;
export const useAllVoiceBroadcast = () => {
    const allVoiceBroadcast = useAppSelector(selectAllVoiceBroadcast);
    return useMemo(() => allVoiceBroadcast, [allVoiceBroadcast]);
};

export const selectVoiceBroadcastOptions = (state: RootState) =>
    state.voiceBroadcast.voiceBroadcastOptions;
export const useVoiceBroadcastOptions = () => {
    const options = useAppSelector(selectVoiceBroadcastOptions);
    return useMemo(() => options, [options]);
};
