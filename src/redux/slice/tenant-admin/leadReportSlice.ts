import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { leadReport } from "@/redux/services/tenant-admin/leadReportServices";
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";

interface InitialState {
    leadReportData: any;
}

const initialState: InitialState = {
    leadReportData: {},
};

export const leadReportGet = createAsyncThunk(
    "leadReport/get",
    async (params: any) => {
        const { lead_uuid, ...rest } = params;
        return await leadReport(lead_uuid, rest);
    }
);

const prepareData = (payload: any) => {
    const data = payload?.data || [];

    const newData = data?.map((val: any) => {
        return {
            code: val?.code || "",
            disposition_name: val?.disposition_name || "",
            disposition_count: val?.disposition_count || 0,
            "1": val["1"] || "0",
            "2": val["2"] || "0",
            "3": val["3"] || "0",
            "4": val["4"] || "0",
            "5": val["5"] || "0",
            "6": val["6"] || "0",
            "7": val["7"] || "0",
            "8": val["8"] || "0",
            "9": val["9"] || "0",
            "10": val["10"] || "0",
            "11": val["11"] || "0",
            "12": val["12"] || "0",
            "13": val["13"] || "0",
            "14": val["14"] || "0",
            sub_total:
                parseFloat(val["disposition_count"] || "0") +
                parseFloat(val["1"] || "0") +
                parseFloat(val["2"] || "0") +
                parseFloat(val["3"] || "0") +
                parseFloat(val["4"] || "0") +
                parseFloat(val["5"] || "0") +
                parseFloat(val["6"] || "0") +
                parseFloat(val["7"] || "0") +
                parseFloat(val["8"] || "0") +
                parseFloat(val["9"] || "0") +
                parseFloat(val["10"] || "0") +
                parseFloat(val["11"] || "0") +
                parseFloat(val["12"] || "0") +
                parseFloat(val["13"] || "0") +
                parseFloat(val["14"] || "0"),
        };
    });

    let finalTotal: any = {
        code: "",
        disposition_name: "Total",
        "disposition_count" : 0,
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
        "6": 0,
        "7": 0,
        "8": 0,
        "9": 0,
        "10": 0,
        "11": 0,
        "12": 0,
        "13": 0,
        "14": 0,
        sub_total: 0,
    };

    if (newData?.length) {
        newData?.map((val: any) => {
            finalTotal["disposition_count"] = finalTotal["disposition_count"] + parseFloat(val["disposition_count"] || "0");
            finalTotal["1"] = finalTotal["1"] + parseFloat(val["1"] || "0");
            finalTotal["2"] = finalTotal["2"] + parseFloat(val["2"] || "0");
            finalTotal["3"] = finalTotal["3"] + parseFloat(val["3"] || "0");
            finalTotal["4"] = finalTotal["4"] + parseFloat(val["4"] || "0");
            finalTotal["5"] = finalTotal["5"] + parseFloat(val["5"] || "0");
            finalTotal["6"] = finalTotal["6"] + parseFloat(val["6"] || "0");
            finalTotal["7"] = finalTotal["7"] + parseFloat(val["7"] || "0");
            finalTotal["8"] = finalTotal["8"] + parseFloat(val["8"] || "0");
            finalTotal["9"] = finalTotal["9"] + parseFloat(val["9"] || "0");
            finalTotal["10"] = finalTotal["10"] + parseFloat(val["10"] || "0");
            finalTotal["11"] = finalTotal["11"] + parseFloat(val["11"] || "0");
            finalTotal["12"] = finalTotal["12"] + parseFloat(val["12"] || "0");
            finalTotal["13"] = finalTotal["13"] + parseFloat(val["13"] || "0");
            finalTotal["14"] = finalTotal["14"] + parseFloat(val["14"] || "0");
            finalTotal["sub_total"] = finalTotal["sub_total"]  + parseFloat(val["sub_total"] || "0");
        });
    }
    let nData = newData?.length
        ? [...newData, { ...finalTotal, isBold: true }]
        : [...newData];
    return nData;
};

const leadReportSlice = createSlice({
    name: "leadReport",
    initialState,
    reducers: {
        clearLeadReport: () => initialState,
    },
    extraReducers: (builder) => {
        builder.addCase(
            leadReportGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.leadReportData = prepareData(action.payload);
            }
        );
    },
});

export default leadReportSlice.reducer;
export const { clearLeadReport } = leadReportSlice.actions;

export const selectLeadReport = (state: RootState) =>
    state.leadReport.leadReportData;
export const useLeadReport = () => {
    const leadReport = useAppSelector(selectLeadReport);
    return useMemo(() => leadReport, [leadReport]);
};
