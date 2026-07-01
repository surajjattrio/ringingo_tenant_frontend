"use client";
import { useLayoutEffect, useState } from "react";

// PROJECT IMPORT
import DashboardCard from "@/components/master-admin/dashboard/DashboardCard";
import { DashSelect, Button } from "@/components/forms";
import { Table } from "@/components/ui-components";
import { accountDashboardCardData } from "./mock";
import { useAppDispatch } from "@/redux/hooks";
import {
    accountDetailsGet,
    useAccountDashboard,
    useAccountDashboardOverview,
    useAccountDetails,
} from "@/redux/slice/tenant-admin/accountDashboardSlice";
import { DatePicker } from "@/components/pickers";

const AccountDashboard = () => {
    const dispatch = useAppDispatch();
    const accountDashboardData: any = useAccountDashboard();
    const accountDashboardOverviewData: any = useAccountDashboardOverview();
    const accountDetailsData: any = useAccountDetails();

    const [cardsData, setCardsData] = useState<any>(null);

    // Helper function to format date without timezone issues
    const formatDateForAPI = (date: any) => {
        if (!date) return "";
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Helper to compute start_date and end_date from a preset option
    const getDateRangeForOption = (option: string): { start_date: string; end_date: string } => {
        const today = new Date();
        const fmt = (d: Date) => formatDateForAPI(d);
        const todayStr = fmt(today);

        switch (option) {
            case "today":
                return { start_date: todayStr, end_date: todayStr };
            case "yesterday": {
                const y = new Date(today);
                y.setDate(today.getDate() - 1);
                const yStr = fmt(y);
                return { start_date: yStr, end_date: yStr };
            }
            case "last-7-days": {
                const s = new Date(today);
                s.setDate(today.getDate() - 6);
                return { start_date: fmt(s), end_date: todayStr };
            }
            case "last-30-days": {
                const s = new Date(today);
                s.setDate(today.getDate() - 29);
                return { start_date: fmt(s), end_date: todayStr };
            }
            default:
                return { start_date: "", end_date: "" };
        }
    };

    const getPayoadData = async (feature: any, start_date: any, end_date?: any) => {
        const payload = {
            feature: feature,
            start_date: start_date,
            end_date: end_date
        }
        await dispatch(accountDetailsGet(payload)).unwrap();
    }

    const run = async () => {
        try {
            // Fetch cards data with 'all' feature
            const response = await dispatch(accountDetailsGet({
                feature: "all",
                start_date: "",
                end_date: ""
            })).unwrap();

            // Map API response keys to card names
            const mappedData = {
                managersCount: response?.data?.managersCount || 0,
                agentsCount: response?.data?.agentsCount || 0,
                inboundCount: response?.data?.inboundCount || 0,
                outboundCount: response?.data?.outboundCount || 0,
                blendedCount: response?.data?.blendedCount || 0,
                didsCount: response?.data?.didsCount || 0,
                leadGroupCount: response?.data?.leadGroupCount || 0,
                callCount: response?.data?.callCount || 0,
            };

            setCardsData(mappedData);

            // Fetch campaigns table data with today's date by default
            const { start_date, end_date } = getDateRangeForOption("today");
            await getPayoadData("campaigns", start_date, end_date);
        } catch (error) {
            console.log(error);
        }
    };

    // Separate function to refresh only cards data
    const refreshCards = async () => {
        try {
            const response = await dispatch(accountDetailsGet({
                feature: "all",
                start_date: "",
                end_date: ""
            })).unwrap();

            const mappedData = {
                managersCount: response?.data?.managersCount || 0,
                agentsCount: response?.data?.agentsCount || 0,
                inboundCount: response?.data?.inboundCount || 0,
                outboundCount: response?.data?.outboundCount || 0,
                blendedCount: response?.data?.blendedCount || 0,
                didsCount: response?.data?.didsCount || 0,
                leadGroupCount: response?.data?.leadGroupCount || 0,
                callCount: response?.data?.callCount || 0,
            };

            setCardsData(mappedData);

            // Fetch campaigns table data with today's date by default
            const { start_date, end_date } = getDateRangeForOption("today");
            await getPayoadData("campaigns", start_date, end_date);
        } catch (error) {
            console.log(error);
        }
    };

    useLayoutEffect(() => {
        run();
    }, []);

    const [selectedDataType, setSelectedDataType] = useState<string>("campaigns");
    const [selectedDateRange, setSelectedDateRange] = useState<string>("today");
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [tableStartDate, setTableStartDate] = useState<any>("");
    const [tableEndDate, setTableEndDate] = useState<any>("");

    // Data type options
    const dataTypeOptions = [
        { label: "Campaigns", value: "campaigns" },
        { label: "Lead Groups", value: "lead-groups" },
        { label: "Managers & Agents", value: "manager-and-agent" },
        // { label: "Call Queues", value: "call-queue" },
        { label: "DIDs", value: "dids" },
    ];

    // Data type options
    const dateOptions = [
        { label: "Today", value: "today" },
        { label: "Yesterday", value: "yesterday" },
        { label: "Last 7 Days", value: "last-7-days" },
        { label: "Last 30 Days", value: "last-30-days" },
        { label: "Custom", value: "custom" },
    ];

    // Get table columns based on selected data type
    const getTableColumns = () => {
        return [
            { name: "date", title: "Date", sortable: true },
            { name: "name", title: "Name", sortable: true },
            { name: "type", title: "Type", sortable: true },
            { name: "last_activity", title: "Last Activity", sortable: true },
        ];
    };

    // Get table data based on selected data type and date
    const getTableData = () => {
        const data = accountDetailsData?.data;
        return Array.isArray(data) ? data : [];
    };

    return (
        <>
            <div className="space-y-5">
                {/* Main Cards */}
                {/* Main Cards Row */}
                <div className="grid grid-cols-4 gap-4">
                    {accountDashboardCardData?.map((val: any, index: number) => {
                        return (
                            <div key={index}>
                                <DashboardCard
                                    {...val}
                                    count={cardsData?.[val?.name] ?? "0"}
                                    onRefresh={() => { refreshCards(); }}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Overview Chart with Detailed Data Table */}

                {/* Detailed Data Table inside the chart card */}
                <div className="border-t border-gray-200 p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Detailed Data
                    </h3>
                    <div className="flex justify-end items-center mb-4">
                        <div className="flex gap-2 items-center">
                            <DashSelect
                                name="Select Type"
                                options={dataTypeOptions}
                                value={selectedDataType}
                                onChange={(e: any) => {
                                    const val = e.target.value;
                                    // Reset date range back to today
                                    setSelectedDateRange("today");
                                    setTableStartDate("");
                                    setTableEndDate("");
                                    // Fetch data with today's dates
                                    const { start_date, end_date } = getDateRangeForOption("today");
                                    getPayoadData(val, start_date, end_date);
                                    setSelectedDataType(val);
                                }}
                            />
                            <DashSelect
                                name="Select Date"
                                options={dateOptions}
                                value={selectedDateRange}
                                onChange={(e: any) => {
                                    const val = e.target.value;
                                    setSelectedDateRange(val);
                                    // Reset date filters
                                    setTableStartDate("");
                                    setTableEndDate("");
                                    // Only fetch data immediately for non-custom options
                                    if (val !== "custom") {
                                        const { start_date, end_date } = getDateRangeForOption(val);
                                        getPayoadData(selectedDataType, start_date, end_date);
                                    }
                                }}
                            />
                            {selectedDateRange === "custom" && (
                                <>
                                    <DatePicker
                                        name="table_start_date"
                                        label="From Date"
                                        value={tableStartDate}
                                        onChange={(date: any) => {
                                            setTableStartDate(date);
                                        }}
                                        dateFormat="yyyy-MM-dd"
                                    />
                                    <DatePicker
                                        name="table_end_date"
                                        label="To Date"
                                        value={tableEndDate}
                                        onChange={(date: any) => {
                                            setTableEndDate(date);
                                        }}
                                        dateFormat="yyyy-MM-dd"
                                    />
                                    <Button
                                        text="Apply"
                                        onClick={() => {
                                            const startDate = formatDateForAPI(tableStartDate);
                                            const endDate = formatDateForAPI(tableEndDate);
                                            getPayoadData(selectedDataType, startDate, endDate);
                                        }}
                                    />
                                    <Button
                                        text="Reset"
                                        onClick={() => {
                                            setTableStartDate("");
                                            setTableEndDate("");
                                            setSelectedDataType("campaigns");
                                            setSelectedDateRange("today");
                                            const { start_date, end_date } = getDateRangeForOption("today");
                                            getPayoadData("campaigns", start_date, end_date);
                                        }}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                    <Table
                        columns={getTableColumns()}
                        data={getTableData()}
                        selectedRows={selectedRows}
                        onSelectRow={(checked: boolean, data: any, array: string[]) => { setSelectedRows(array); }}
                        pagination={false}
                        selectable={true}
                    />
                </div>
            </div>
        </>
    );
};

export default AccountDashboard; 