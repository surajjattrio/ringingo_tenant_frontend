"use client";
import React, { useEffect, useLayoutEffect, useState } from "react";

// PROJECT IMPORTS
import { useAppDispatch } from "@/redux/hooks";
import {
    leadGroupStatsGet,
    useLeadGroupStats,
    useIsLoading,
    clearDashboard,
} from "@/redux/slice/tenant-admin/realtimeDashboardSlice";
import {
    leadGroupOptionsGet,
    useLeadGroupOptions,
} from "@/redux/slice/tenant-admin/leadGroupSlice";
import {
    campaignGet,
    useCampaignOptions,
} from "@/redux/slice/tenant-admin/realtimeReportSlice";
import { Select } from "@/components/forms";
import { timeoutOptions3 } from "@/config/options";
import { setTimes, useTime } from "@/redux/slice/commonSlice";

// THIRD-PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";
import LeadGroupTable from "./LeadGroupTable";

/* ============================== TIMER COMPONENT ============================== */

const LeadGroupTimer = ({
    setResetTimer,
    resetTimer,
    time,
}: {
    setResetTimer: (val: any) => void;
    resetTimer: boolean;
    time: number;
}) => {
    const [second, setSecond] = useState<number>(0);
    const [minute, setMinute] = useState<number>(0);

    useEffect(() => {
        let count: number = time;
        let interval: any;
        if (time > 0) {
            interval = setInterval(() => {
                if (count > 179) {
                    setMinute(3);
                    setSecond(count - 180);
                } else if (count > 119) {
                    setMinute(2);
                    setSecond(count - 120);
                } else if (count > 59) {
                    setMinute(1);
                    setSecond(count - 60);
                } else {
                    setMinute(0);
                    setSecond(count);
                }
                count--;
                if (count < 0) {
                    clearInterval(interval);
                    setResetTimer(!resetTimer);
                }
            }, 1000);
        }
        return () => {
            clearInterval(interval);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [time, resetTimer]);

    return (
        <span className="text-sm font-semibold text-heading">
            {"0" + minute + ":" + (second > 9 ? second : "0" + second)}
        </span>
    );
};

/* ============================== MAIN COMPONENT ============================== */

const LeadGroupRealtimeDashboard = () => {
    const dispatch = useAppDispatch();

    // Redux state
    const leadGroupStats = useLeadGroupStats();
    const isLoading = useIsLoading();
    const leadGroupOptions = useLeadGroupOptions();
    // const campaignOptions = useCampaignOptions();
    const times = useTime();

    // Local state
    const [resetTimer, setResetTimer] = useState<boolean>(false);
    const [time, setTime] = useState<number>(times || 30);
    const [filter, setFilter] = useState<any>({
        lead_group_uuid: "",
        campaign_uuid: "",
    });

    // Load filter options on mount
    // useEffect(() => {
    //     // dispatch(leadGroupOptionsGet()); // Removed for lazy loading on click
    //     dispatch(campaignGet());
    //     return () => {
    //         dispatch(clearDashboard());
    //     };
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    // Debounced API call
    const debouncedFetch = useDebouncedCallback(() => {
        // Enforce selection of at least one filter
        if (!filter.lead_group_uuid && !filter.campaign_uuid) {
            dispatch(clearDashboard());
            return;
        }

        const params: any = {};
        if (filter.lead_group_uuid) params.lead_group_uuid = filter.lead_group_uuid;
        if (filter.campaign_uuid) params.campaign_uuid = filter.campaign_uuid;
        dispatch(leadGroupStatsGet(params));
    }, 300);

    // Polling: re-fetch on resetTimer toggle or filter change
    useLayoutEffect(() => {
        debouncedFetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resetTimer, filter]);

    // Handle timer change
    const onTimeChange = (val: any) => {
        const newTime = Number(val?.target?.value) || Number(val?.value) || 30;
        setTime(newTime);
        dispatch(setTimes(newTime));
    };

    // Handle filter changes
    const onFilterChange = (key: string, val: any) => {
        setFilter((prev: any) => ({
            ...prev,
            [key]: val?.value || "",
        }));
    };

    const hasSelection = filter.lead_group_uuid || filter.campaign_uuid;

    return (
        <div className="px-5 py-4">

            {/* ====== HEADER: Filters + Timer ====== */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="min-w-[200px]">
                        <Select
                            name="lead_group_uuid"
                            label="Lead Group"
                            options={leadGroupOptions || []}
                            value={filter.lead_group_uuid}
                            placeholder="All Lead Groups"
                            removable
                            isManual
                            onFocus={() => dispatch(leadGroupOptionsGet({ status: "0" }))}
                            onChange={(val: any) => onFilterChange("lead_group_uuid", val)}
                        />
                    </div>
                    {/* <div className="min-w-[200px]">
                        <Select
                            name="campaign_uuid"
                            label="Campaign"
                            options={campaignOptions || []}
                            value={filter.campaign_uuid}
                            placeholder="All Campaigns"
                            removable
                            isManual
                            onChange={(val: any) => onFilterChange("campaign_uuid", val)}
                        />
                    </div> */}
                </div>

                {/* Timer Controls */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                        <span className="text-xs text-txt-primary font-medium">Auto Refresh</span>
                        <LeadGroupTimer
                            setResetTimer={setResetTimer}
                            resetTimer={resetTimer}
                            time={time}
                        />
                    </div>
                    <div className="min-w-[120px]">
                        <Select
                            name="timer"
                            options={timeoutOptions3}
                            value={time}
                            isNum
                            onChange={onTimeChange}
                            placeholder="Timer"
                            isShowLabel={false}
                        />
                    </div>
                    <button
                        onClick={() => setResetTimer(!resetTimer)}
                        disabled={!hasSelection}
                        className={`px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                            hasSelection 
                                ? "bg-blue-600 text-white hover:bg-blue-700" 
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                    >
                        Refresh Now
                    </button>
                </div>
            </div>

            {/* ====== MAIN CONTENT ====== */}
            {hasSelection ? (
                <LeadGroupTable data={leadGroupStats} isLoading={isLoading} />
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                        <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-heading">Ready to see Real-time Stats?</h3>
                    <p className="text-txt-primary text-sm max-w-sm text-center mt-2">
                        Please select at least one <strong>Lead Group</strong> from the dropdowns above to begin tracking performance.
                    </p>
                </div>
            )}
        </div>
    );
};

export default LeadGroupRealtimeDashboard;
