import { useMemo } from "react";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// PROJECT IMPORT
import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";
import {
    callPause,
    getCampaign,
    getRealTimeReport,
    logoutAdmin,
    putAgentOnBreak,
    searchRealTimeReport,
    updateRealTimeReport,
} from "@/redux/services/tenant-admin/realtimeReportServices";

interface InitialState {
    agentsList: any;
    queue_details: any;
    agentsLiveData: any;
    campaignDetails: any;
    campaignOptions: any;
    liveAgentsOnCalls?: any;
    liveCallsCount?: any;
}

const initialState: InitialState = {
    agentsList: [],
    queue_details: [],
    agentsLiveData: {},
    campaignDetails: [],
    campaignOptions: [],
    liveAgentsOnCalls: {},
    liveCallsCount: {},
};

export const adminLogout = createAsyncThunk(
    "agemt-admin-logout/patch",
    async (data: any) => {
        const { id } = data;
        return await logoutAdmin(id, data);
    }
);

export const realTimeReportGet = createAsyncThunk(
    "realtime-report/get",
    async (params: any) => {
        return await getRealTimeReport(params);
    }
);

export const agentCallPause = createAsyncThunk(
    "realtime-report/agent-call-pause",
    async (payload: any) => {
        return await callPause(payload);
    }
);

export const realTimeReportSearch = createAsyncThunk(
    "realtime-report/search",
    async (params: any) => {
        return await searchRealTimeReport(params);
    }
);


export const realTimeReportUpdate = createAsyncThunk(
    "outbound-campaign-dial/update",
    async (payload: any) => {
        const { id, ...rest } = payload;
        return await updateRealTimeReport(id, rest);

    }
);

export const agentPutOnBreak = createAsyncThunk(
    "agent-put-on-break/break",
    async ({ status, breakcode, agent_uuid }: { status: any; breakcode: any; agent_uuid: string }) => {
        return await putAgentOnBreak(status, agent_uuid, breakcode);
    }
);


export const campaignGet = createAsyncThunk("campaign/list", async () => {
    return await getCampaign();
});

const realtimeReportSlice = createSlice({
    name: "realtimeReport",
    initialState,
    reducers: {
        clearRealtimeReport: () => initialState,
    },
    extraReducers: (builder) => {
        builder.addCase(
            realTimeReportGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                state.agentsLiveData = action.payload?.agents_live_data || {}; state.agentsLiveData = action.payload?.agents_live_data || {},
                    state.liveAgentsOnCalls = action.payload?.liveAgentsOnCalls || {};
                state.liveCallsCount = action.payload?.liveCallsCount || {};

                let newAgentsList = action.payload?.agents_list || [];

                newAgentsList?.length &&
                    newAgentsList?.map((x: any) => {
                        x.agent_status =
                            x.status === "0"
                                ? "Idle"
                                : x.status === "1"
                                    ? "On Incoming call"
                                    : x.status === "2"
                                        ? "On Outgoing call"
                                        : x.status === "3"
                                            ? "Break"
                                            : x.status === "4"
                                                ? "Pause"
                                                : x.status === "5"
                                                    ? "ACW"
                                                    : x.status === "6"
                                                    ? "Partially Logout"
                                                    : x.status === "7"
                                                        ? "Hold"
                                                        : "";
                        x.loginTime = x?.from_last_logged_in ? x?.from_last_logged_in : "";
                        x.totalDuration = x?.total_duration ? x?.total_duration : "";
                        x.background =
                            x.status === "0"
                                ? parseInt(x.from_last_logged_in) > 1
                                    ? "#83CB9D" // Deep green if Idle > 1 min
                                    : "#ABFFCA" // Light green if Idle <= 1 min
                                : x.status === "1" || x.status === "2"
                                    ? x.from_last_logged_in
                                        ? parseInt(x.from_last_logged_in) < 3
                                            ? "#C8C7FF"
                                            : parseInt(x.from_last_logged_in) > 15
                                                ? "#C7F7FF"
                                                : parseInt(x.from_last_logged_in) > 5
                                                    ? "#E5E5E5"
                                                    : "#44F43E"
                                        : "#FFFFFF"
                                    : x.status === "3"
                                        ? "#FFA8A8"
                                        : x.status === "4"
                                            ? "#FFFEAB"
                                            : x.status === "5"
                                                ? "#83D5FF"
                                                : x.status === "7"
                                                    ? "#000000"
                                                    : "#FFFFFF";
                    });
                let newCampaignDetails = action.payload?.campaign_details || [];
                newCampaignDetails?.length &&
                    newCampaignDetails?.map((x: any) => {
                        x.campaignName = x.campaign_name?.[0] || "";
                        x.campaignType =
                            x.campaign_type === "0"
                                ? "Outbound"
                                : x.campaign_type === "2"
                                    ? "Blended"
                                    : x.campaign_type === "1"
                                        ? "Inbound"
                                        : "Inbound";
                    });
                // newCampaignDetails.length &&
                //     newCampaignDetails?.sort((a: any, b: any) =>
                //         a["campaignName"]?.toLowerCase() < b["campaignName"]?.toLowerCase()
                //             ? -1
                //             : 1
                //     );

                // newAgentsList.length &&
                //     newAgentsList?.sort((a: any, b: any) =>
                //         a["agent_name"]?.toLowerCase() < b["agent_name"]?.toLowerCase()
                //             ? -1
                //             : 1
                //     );

                state.campaignDetails = newCampaignDetails;
                state.agentsList = newAgentsList;

                let newQueueList = action.payload?.queue_details || [];
                console.log("new queuuee list before", newQueueList)

                newQueueList?.length &&
                    newQueueList?.flatMap((y: any) => y.calls.map((x: any) => {
                        x.status =
                            x.queue_status === "Abandoned"
                                ? "2"
                                : x.queue_status === "Answered"
                                    ? "0"
                                    : x.queue_status === "Offering"
                                        ? "3"
                                        : x.queue_status === "Waiting"
                                            ? "5"
                                            : x.queue_status === "Trying"
                                                ? "1"
                                            //     : x.status === "5"
                                            //         ? "ACW"
                                            //         : x.status === "7"
                                            //             ? "Hold"
                                            : "";
                    }));
                
                console.log("new queuuee list after", newQueueList)
                state.queue_details = newQueueList;
            }
        );
        builder.addCase(
            realTimeReportSearch.fulfilled,
            (state, action: PayloadAction<any>) => {
                let newAgentsList = action.payload?.data || [];
                newAgentsList?.length &&
                    newAgentsList?.map((x: any) => {
                        x.agent_status =
                            x.status === "0"
                                ? "Idle"
                                : x.status === "1"
                                    ? "On Incoming call"
                                    : x.status === "2"
                                        ? "On Outgoing call"
                                        : x.status === "3"
                                            ? "Break"
                                            : x.status === "4"
                                                ? "Pause"
                                                : x.status === "5"
                                                    ? "ACW"
                                                    : x.status === "7"
                                                        ? "Hold"
                                                        : "";
                        x.loginTime = x?.from_last_logged_in ? x?.from_last_logged_in : "";
                        x.totalDuration = x?.total_duration ? x?.total_duration : "";
                        x.background =
                            x.status === "0"
                                ? parseInt(x.from_last_logged_in) > 1
                                    ? "#83CB9D" // Deep green if Idle > 1 min
                                    : "#ABFFCA" // Light green if Idle <= 1 min
                                : x.status === "1" || x.status === "2"
                                    ? x.from_last_logged_in
                                        ? parseInt(x.from_last_logged_in) < 3
                                            ? "#C8C7FF"
                                            : parseInt(x.from_last_logged_in) > 15
                                                ? "#C7F7FF"
                                                : parseInt(x.from_last_logged_in) > 5
                                                    ? "#E5E5E5"
                                                    : "#44F43E"
                                        : "#FFFFFF"
                                    : x.status === "3"
                                        ? "#FFA8A8"
                                        : x.status === "4"
                                            ? "#FFFEAB"
                                            : x.status === "5"
                                                ? "#83D5FF"
                                                : x.status === "7"
                                                    ? "#000000"
                                                    : "#FFFFFF";
                    });

                // newAgentsList.length &&
                //     newAgentsList?.sort((a: any, b: any) =>
                //         a["agent_name"]?.toLowerCase() < b["agent_name"]?.toLowerCase()
                //             ? -1
                //             : 1
                //     );
                state.agentsList = newAgentsList;
            }
        );
        builder.addCase(
            campaignGet.fulfilled,
            (state, action: PayloadAction<any>) => {
                const newData = action.payload.data || [];
                let inboundData = newData?.inbound_campaign || [];
                let outboundData = newData?.outbound_campaign || [];
                let blendedData = newData?.blended_campaign || [];
                let prepareData = [...inboundData, ...outboundData, ...blendedData];
                state.campaignOptions = prepareData?.map((val: any) => ({
                    value: val?.uuid,
                    label: val?.name,
                }));
            }
        );
    },
});

export default realtimeReportSlice.reducer;
export const { clearRealtimeReport } = realtimeReportSlice.actions;

export const selectRealtimeAgentsList = (state: RootState) =>
    state.realtimeReport.agentsList;
export const useRealtimeAgentsList = () => {
    const agentsList = useAppSelector(selectRealtimeAgentsList);
    return useMemo(() => agentsList, [agentsList]);
};

export const selectRealtimeQueueDetails = (state: RootState) =>
    state.realtimeReport.queue_details;
export const useRealtimeQueueDetails = () => {
    const queueDetails = useAppSelector(selectRealtimeQueueDetails);
    return useMemo(() => queueDetails, [queueDetails]);
};

export const selectRealtimeLiveData = (state: RootState) =>
    state.realtimeReport.agentsLiveData;
export const useRealtimeLiveData = () => {
    const agentsLiveData = useAppSelector(selectRealtimeLiveData);
    return useMemo(() => agentsLiveData, [agentsLiveData]);
};

export const selectRealtimeCampaignDetails = (state: RootState) =>
    state.realtimeReport.campaignDetails;
export const useRealtimeCampaignDetails = () => {
    const campaignDetails = useAppSelector(selectRealtimeCampaignDetails);
    return useMemo(() => campaignDetails, [campaignDetails]);
};

export const seletCampaignOptions = (state: RootState) =>
    state.realtimeReport.campaignOptions;
export const useCampaignOptions = () => {
    const campaignOptions = useAppSelector(seletCampaignOptions);
    return useMemo(() => campaignOptions, [campaignOptions]);
};

export const selectRealtimeAgentsOnCallsData = (state: RootState) =>
    state.realtimeReport.liveAgentsOnCalls;
export const useRealtimeliveAgentsOnCallsData = () => {
    const liveAgentsOnCallsData = useAppSelector(selectRealtimeAgentsOnCallsData);
    return useMemo(() => liveAgentsOnCallsData, [liveAgentsOnCallsData]);
};

export const selectRealtimeCallsCountData = (state: RootState) =>
    state.realtimeReport.liveCallsCount
export const useRealtimeCallsCountData = () => {
    const liveCallsCountData = useAppSelector(selectRealtimeCallsCountData);
    return useMemo(() => liveCallsCountData, [liveCallsCountData]);
};
