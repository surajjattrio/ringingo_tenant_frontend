"use client";

import React, { useEffect, useState } from "react";
import {
    FaUserTie,
    FaCheckCircle,
    FaTimesCircle,
    FaClock,
    FaCloudDownloadAlt,
} from "react-icons/fa";
import { googleDriveService } from "@/services/googleDriveService";
import { useAuth } from "@/contexts/hooks/useAuth";
import { Head, Table } from "@/components/ui-components";
import { ColumnsType } from "@/types/tableTypes";
import { useAppDispatch } from "@/redux/hooks";
import { useUserOptions, userOptionsGet } from "@/redux/slice/tenant-admin/userSlice";
import { DatePicker } from "@/components/pickers";
import { Select } from "@/components/forms";
import { formatDate } from "@/helperFunctions";

// Icons
const UserTieIcon = FaUserTie as any;
const CheckCircleIcon = FaCheckCircle as any;
const TimesCircleIcon = FaTimesCircle as any;
const ClockIcon = FaClock as any;
const CloudDownloadIcon = FaCloudDownloadAlt as any;

interface ActivityLogsProps {
    refreshTrigger?: number;
}

// Sample Data Structure
interface RecordingLog {
    file_id: string;
    public_url: string;
    agent_name: string;
    upload_duration_ms: number;
    attempt: number;
    status: "success" | "failed";
    error: string | null;
    tenant_uuid: string;
    uploaded_at: { $date: string } | string;
    // New Fields
    call_duration_formatted?: string;
}

const ActivityLogs = ({ refreshTrigger = 0 }: ActivityLogsProps) => {
    const { user } = useAuth();
    const dispatch = useAppDispatch();
    const userOptions = useUserOptions();

    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState<RecordingLog[]>([]);

    const [pagination, setPagination] = useState<any>(null);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [isAdvance, setIsAdvance] = useState(false);

    // Advanced Filter State
    const [filters, setFilters] = useState({
        start_date: "",
        end_date: "",
        user_uuid: "",
        status: ""
    });

    useEffect(() => {
        if (isAdvance) {
            dispatch(userOptionsGet());
        }
    }, [dispatch, isAdvance]);

    useEffect(() => {
        fetchLogs();
    }, [refreshTrigger, page, limit, isAdvance]);

    const fetchLogs = async (customParams: any = {}) => {
        try {
            setLoading(true);
            const tenantUuid = user?.tenant_detail?.uuid;
            if (!tenantUuid) return;

            // Base params
            const params: any = {
                tenant_uuid: tenantUuid,
                page,
                limit,
                ...customParams
            };



            // Advanced Search
            if (isAdvance) {
                if (filters.start_date) params.start_date = formatDate(filters.start_date, true);
                if (filters.end_date) params.end_date = formatDate(filters.end_date, true);
                if (filters.user_uuid) params.user_uuid = filters.user_uuid;
                if (filters.status) params.status = filters.status;
            }

            const res = await googleDriveService.getRecordingLogs(params);
            if (res.success) {
                setLogs(res.data.recordings);
                setPagination(res.data.pagination);
            }
        } catch (error) {
            console.error("Failed to load logs", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key: string, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleAdvancedSearch = () => {
        setPage(1);
        if (isAdvance) {
            fetchLogs();
        } else {
            setIsAdvance(true);
        }
    };

    const handleClearFilters = () => {
        setFilters({
            start_date: "",
            end_date: "",
            user_uuid: "",
            status: ""
        });
        setIsAdvance(false);
        setPage(1);
    };

    // Helper to convert Drive view URL to direct download URL
    const getDownloadUrl = (url: string) => {
        if (!url) return "";
        try {
            // Extract File ID
            const match = url.match(/\/d\/(.+?)\//);
            if (match && match[1]) {
                return `https://drive.google.com/uc?export=download&id=${match[1]}`;
            }
            return url;
        } catch (e) {
            return url;
        }
    };

    const columns: ColumnsType[] = [
        {
            name: "status",
            title: "Status",
            action: (log: RecordingLog) => (
                <div className="flex flex-col gap-1">
                    {log.status === "success" ? (
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 w-fit">
                            <CheckCircleIcon size={12} /> Success
                        </span>
                    ) : (
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 w-fit">
                            <TimesCircleIcon size={12} /> Failed
                        </span>
                    )}
                </div>
            )
        },
        {
            name: "converted_date",
            title: "Date & Time",
            action: (log: RecordingLog) => {
                const getDate = (date: any) => {
                    if (!date) return null;
                    if (typeof date === 'string') return new Date(date);
                    if (date.$date) return new Date(date.$date);
                    return null;
                };

                const dateObj = getDate(log.uploaded_at);

                if (!dateObj) return <span className="text-gray-400">-</span>;

                return (
                    <div className="flex flex-col">
                        <span className="text-gray-900 dark:text-gray-200 font-medium">
                            {dateObj.toLocaleDateString()}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                            <ClockIcon size={10} />
                            {dateObj.toLocaleTimeString()}
                        </span>
                    </div>
                );
            }
        },

        {
            name: "agent_name",
            title: "Agent",
            action: (log: RecordingLog) => (
                <div className="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300">
                    <UserTieIcon className="text-gray-400" />
                    {log.agent_name}
                </div>
            )
        },
        {
            name: "duration",
            title: "Duration",
            action: (log: RecordingLog) => (
                <div className="flex flex-col">
                    <span className="text-gray-700 dark:text-gray-200 font-medium">{log.call_duration_formatted || "0s"}</span>
                    <span className="text-xs text-gray-400">Call Time</span>
                </div>
            )
        },
        {
            name: "action",
            title: "Action",
            action: (log: RecordingLog) => {
                if (log.status !== "success" || !log.public_url) {
                    return (
                        <button
                            disabled
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed text-sm font-medium"
                            title="Recording processing failed or pending"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <CloudDownloadIcon size={16} />
                            Unavailable
                        </button>
                    );
                }
                return (
                    <a
                        href={getDownloadUrl(log.public_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                        title="Download Recording"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <CloudDownloadIcon size={16} />
                        Download
                    </a>
                );
            }
        }
    ];

    return (
        <div className="bg-white px-3 pb-3 pt-1 rounded-[25px]">
            <Head
                onSearchClick={handleAdvancedSearch}
                onHide={handleClearFilters}
                filterOpen={isAdvance}
            >
                <DatePicker
                    name="start_date"
                    label="Start Date"
                    placeholder="Start Date"
                    dateFormat="yyyy-MM-dd HH:mm:ss"
                    value={filters.start_date}
                    startDate={filters.start_date}
                    endDate={filters.end_date}
                    maxDate={filters.end_date || new Date()}
                    onChange={(e: any) => handleFilterChange("start_date", e)}
                    showTimeSelect
                    selectsStart
                    isInfo
                />
                <DatePicker
                    name="end_date"
                    label="End Date"
                    placeholder="End Date"
                    dateFormat="yyyy-MM-dd HH:mm:ss"
                    value={filters.end_date}
                    startDate={filters.start_date}
                    endDate={filters.end_date}
                    minDate={filters.start_date}
                    maxDate={new Date()}
                    onChange={(e: any) => handleFilterChange("end_date", e)}
                    showTimeSelect
                    selectsEnd
                    isInfo
                />
                <Select
                    name="user_uuid"
                    label="Agent"
                    placeholder="Select Agent"
                    removable
                    value={filters.user_uuid}
                    options={userOptions}
                    onChange={(e: any) => handleFilterChange("user_uuid", e.target.value)}
                    isInfo
                />
                <Select
                    name="status"
                    label="Status"
                    placeholder="Status"
                    removable
                    value={filters.status}
                    options={[
                        { label: "Success", value: "success" },
                        { label: "Failed", value: "failed" }
                    ]}
                    onChange={(e: any) => handleFilterChange("status", e.target.value)}
                    isInfo
                />
            </Head>

            <div className="mt-5">
                <Table
                    isLoading={loading}
                    columns={columns}
                    data={logs}
                    page={page}
                    totalCount={pagination?.total_records || 0}
                    limit={limit}
                    selectable={false}
                    onPageClick={(newPage: number) => setPage(newPage)}
                    onLimitChange={(newLimit: number) => {
                        setLimit(newLimit);
                        setPage(1);
                    }}
                    onRefresh={fetchLogs}
                />
            </div>
        </div>
    );
};

export default ActivityLogs;
