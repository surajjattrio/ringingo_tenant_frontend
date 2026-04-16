import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import {
    allRecording,
    recording,
    searchRecording,
} from "@/redux/services/tenant-admin/recordingServices";
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";
import { formatTime } from "@/helperFunctions";

// TYPES IMPORT
import { OptionTypes } from "@/types/formTypes";

interface InitialState {
    isLoading: boolean;
    recordingData: any;
    allRecordingData: any;
    recordingOptions: OptionTypes[];
}

const initialState: InitialState = {
    isLoading: false,
    recordingData: {},
    allRecordingData: {},
    recordingOptions: [],
};

export const recordingGet = createAsyncThunk(
    "recording/get",
    async (params: any) => {
        return await recording(params);
    }
);

export const recordingSearch = createAsyncThunk(
    "recording/search",
    async (params: any) => {
        return await searchRecording(params);
    }
);

export const recordingAllGet = createAsyncThunk(
    "recording-all/get",
    async () => {
        const params = { list: "all" };
        return await allRecording(params);
    }
);

export const recordingOptionsGet = createAsyncThunk(
    "recording-options/get",
    async () => {
        return await allRecording();
    }
);

const prepareData = (payload: any) => {
    const data = payload?.data;
    const count = payload?.count;

    const newData = data?.map((val: any) => {
        let fileName = val?.recording_path ? val?.recording_path : "";
        let file = fileName?.split("/");
        return {
            ...val,
            user_name: val?.user?.[0]?.username || "",
            fullname: val?.user?.[0]?.fullname || "",
            billsecond_number: formatTime(parseInt(val?.billsecond), true),
            fileName: file?.length ? file[file?.length - 1] : ""
        };
    });

    return { data: newData, count };
};

const recordingSlice = createSlice({
    name: "recording",
    initialState,
    reducers: {
        clearRecording: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(recordingGet.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(recordingGet.fulfilled, (state, action: PayloadAction<any>) => {
                state.recordingData = prepareData(action.payload);
                state.isLoading = false;
            })
            .addCase(recordingGet.rejected, (state) => {
                state.isLoading = false;
            });

        builder
            .addCase(recordingSearch.pending, (state, action: PayloadAction<any>) => {
                state.isLoading = true;
            })
            .addCase(
                recordingSearch.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.recordingData = prepareData(action.payload);
                    state.isLoading = false;
                }
            )
            .addCase(
                recordingSearch.rejected,
                (state, action: PayloadAction<any>) => {
                    state.isLoading = false;
                }
            );

        builder.addCase(
            recordingAllGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.allRecordingData = action.payload;
            }
        );

        builder.addCase(
            recordingOptionsGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                const data = action.payload?.data;
                state.recordingOptions = data?.map((val: any) => ({
                    value: val?.uuid,
                    label: val?.name,
                }));
            }
        );
    },
});

export default recordingSlice.reducer;
export const { clearRecording } = recordingSlice.actions;

export const selectIsLoading = (state: RootState) => state.recording.isLoading;
export const useIsLoading = () => {
    const isLoading = useAppSelector(selectIsLoading);
    return useMemo(() => isLoading, [isLoading]);
};

export const selectRecording = (state: RootState) =>
    state.recording.recordingData;
export const useRecording = () => {
    const recording = useAppSelector(selectRecording);
    return useMemo(() => recording, [recording]);
};

export const selectAllRecording = (state: RootState) =>
    state.recording.allRecordingData;
export const useAllRecording = () => {
    const allRecording = useAppSelector(selectAllRecording);
    return useMemo(() => allRecording, [allRecording]);
};

export const selectRecordingOptions = (state: RootState) =>
    state.recording.recordingOptions;
export const useRecordingOptions = () => {
    const options = useAppSelector(selectRecordingOptions);
    return useMemo(() => options, [options]);
};
