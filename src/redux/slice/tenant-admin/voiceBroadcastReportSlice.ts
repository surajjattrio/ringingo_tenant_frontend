import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";
import {
    allVoiceBroadcastReport,
    voiceBroadcastReport,
    searchVoiceBroadcastReport,
    singleVoiceInfo,

} from "@/redux/services/tenant-admin/voiceBroadcastReportServices";

// TYPES IMPORT
import { OptionTypes } from "@/types/formTypes";
import { formatTime } from "@/helperFunctions";
import {
    callModeOptions,
    callTypeOptions,
    directionOptions,
    dispositionOptions,
} from "@/config/options";

interface InitialState {
    isLoading: boolean;
    voiceBroadcastReportData: any;
    allVoiceBroadcastReportData: any;
    voiceBroadcastReportOptions: OptionTypes[];
}

const initialState: InitialState = {
    isLoading: false,
    voiceBroadcastReportData: {},
    allVoiceBroadcastReportData: {},
    voiceBroadcastReportOptions: [],
};

export const voiceBroadcastReportGet = createAsyncThunk(
    "voiceBroadcastReport/get",
    async (params: any) => {
        return await voiceBroadcastReport(params);
    }
);

export const voiceBroadcastReportSearch = createAsyncThunk(
    "voiceBroadcastReport/search",
    async (params: any) => {
        return await searchVoiceBroadcastReport(params);
    }
);

export const voiceBroadcastReportAllSearch = createAsyncThunk(
    "voiceBroadcastReport-all-search/search",
    async (params: any) => {
        return await searchVoiceBroadcastReport(params);
    }
);

export const voiceBroadcastReportAllGet = createAsyncThunk(
    "voiceBroadcastReport-all/get",
    async (params?: any) => {
        return await allVoiceBroadcastReport(params);
    }
);

export const voiceBroadcastOptionsGet = createAsyncThunk(
    "voiceBroadcastReport-options/get",
    async () => {
        return await allVoiceBroadcastReport();
    }
);

export const getSingleVoiceInfo = createAsyncThunk(
    "voiceBroadcastReport/singleInfo",
    async (params: any) => {
       return await singleVoiceInfo(params);
    }
);

const prepareData = (payload: any) => {
    const data = payload ?.data;
    const count = payload ?.count;
    const newData = data ?.map((val: any) => {
        return {
            ...val,
        disposition_name: val?.disposition?.[0]?.name || "",  
        name: val?.voice_broadcast?.[0]?.name || "",
        type : val.type == "0" ? "Survey" : "IVR"
        };
    });
    
    return { data: newData, count };
};


const voiceBroadcastReportSlice = createSlice({
    name: "voiceBroadcastReport",
    initialState,
    reducers: {
        clearVoiceBroadcastReport: () => initialState,
    },
    extraReducers: (builder) => {
        builder.addCase(
            voiceBroadcastReportGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                    
                    const newData =
                      typeof action.payload === "string" ? [] : action.payload;
                newData?.data?.map((val: any) => {
                    (val.uuid = val?.voicebroadcast_uuid),
                      (val.fullName =
                        val.lead_details.length && val.lead_details[0].first_name
                          ? val.lead_details[0].first_name +
                          " " +
                          (val.lead_details[0].last_name || "")
                          : "");
    
                state.voiceBroadcastReportData = prepareData(action.payload);
                state.isLoading = false;
                      });
            }
        )
        builder
            .addCase(
                voiceBroadcastReportSearch.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.voiceBroadcastReportData = prepareData(action.payload);
                    state.isLoading = true;
                }
            )



        builder.addCase(
            voiceBroadcastReportAllGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.allVoiceBroadcastReportData = prepareData(action.payload);
             
            }

        );

        builder.addCase(
            voiceBroadcastReportAllSearch.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.allVoiceBroadcastReportData = prepareData(action.payload);
            }
        );

        builder.addCase(
            voiceBroadcastOptionsGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                const data = action.payload ?.data;
                state.voiceBroadcastReportOptions = data ?.map((val: any) => ({
                    value: val ?.uuid,
                    label: val ?.name,
                }));
            }
        );

    },
});

export default voiceBroadcastReportSlice.reducer;
export const { clearVoiceBroadcastReport } = voiceBroadcastReportSlice.actions;

export const selectIsLoading = (state: RootState) => state.voiceBroadcastReport.isLoading;
export const useIsLoading = () => {
    const isLoading = useAppSelector(selectIsLoading);
    return useMemo(() => isLoading, [isLoading]);
};

export const selectVoiceBroadcastReport = (state: RootState) => state.voiceBroadcastReport.voiceBroadcastReportData;
export const useVoiceBroadcastReport = () => {
    const voiceBroadcastReport = useAppSelector(selectVoiceBroadcastReport);
    return useMemo(() => voiceBroadcastReport, [voiceBroadcastReport]);
};

export const selectAllVoiceBroadcastReport = (state: RootState) =>
    state.voiceBroadcastReport.allVoiceBroadcastReportData;
export const useAllVoiceBroadcastReport = () => {
    const allVoiceBroadcastReport = useAppSelector(selectAllVoiceBroadcastReport);
    return useMemo(() => allVoiceBroadcastReport, [allVoiceBroadcastReport]);
};

export const selectVoiceBroadcastReportOptions = (state: RootState) =>
    state.voiceBroadcastReport.voiceBroadcastReportOptions;
export const useVoiceBroadcastReportOptions = () => {
    const options = useAppSelector(selectVoiceBroadcastReportOptions);
    return useMemo(() => options, [options]);
};

