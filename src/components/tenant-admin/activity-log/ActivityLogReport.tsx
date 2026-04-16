"use client";
import { useEffect, useState } from "react";

// PROJECT IMPORT
import { Head, Table } from "@/components/ui-components";
import { Input, Select } from "@/components/forms";
import { DatePicker } from "@/components/pickers";
import { allActivityLog } from "@/redux/services/tenant-admin/activityLogServices";
import { convertUtcToIst, formatDate } from "@/helperFunctions";
import ActivityDetailModal from "./ActivityDetailModal";

// TYPES IMPORT
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";
import { ManagerPageTypes } from "@/types/formTypes";
import { useDebouncedCallback } from "use-debounce";

const now = new Date();
const startOfToday = new Date(now);
startOfToday.setHours(0, 0, 0, 0);
const endOfToday = new Date(now);
endOfToday.setHours(23, 59, 59, 999);

const initialValues: any = {
    from_date: startOfToday,
    to_date: endOfToday,
    module: "",
    action: "",
    method: "",
    status_code: "",
    role: "",
    ip_address: "",
    browser: "",
};

// Filter Options
const ROLE_OPTIONS = [
    { label: "Select Role", value: "" },
    { label: "Agent", value: "agent" },
    { label: "Manager", value: "manager" },
    { label: "Tenant", value: "tenant" },
    { label: "Master Admin", value: "master_admin" },
];

const MODULE_OPTIONS = [
    { label: "Select Module", value: "" },
    { label: "User", value: "User" },
    { label: "Role", value: "Role" },
    { label: "Tenant", value: "Tenant" },
    { label: "Campaign", value: "Campaign" },
    { label: "DID", value: "DID" },
    { label: "Trunk", value: "Trunk" },
    { label: "IVR", value: "IVR" },
    { label: "RingGroup", value: "RingGroup" },
    { label: "CallQueue", value: "CallQueue" },
    { label: "Conference", value: "Conference" },
    { label: "Lead", value: "Lead" },
    { label: "VoiceBroadcast", value: "VoiceBroadcast" },
    { label: "Recording", value: "Recording" },
    { label: "Report", value: "Report" },
];

const ACTION_OPTIONS = [
    { label: "Select Action", value: "" },
    { label: "Create", value: "Create" },
    { label: "Update", value: "Update" },
    { label: "Delete", value: "Delete" },
];

const BROWSER_OPTIONS = [
    { label: "Select Browser", value: "" },
    { label: "Chrome", value: "Chrome" },
    { label: "Firefox", value: "Firefox" },
    { label: "Safari", value: "Safari" },
    { label: "Edge", value: "Edge" },
    { label: "Opera", value: "Opera" },
    { label: "Samsung Browser", value: "Samsung Browser" },
    { label: "Internet Explorer", value: "Internet Explorer" },
    { label: "Unknown", value: "Unknown" },
];

const ActivityLogReport = (props: ManagerPageTypes) => {
    const [filter, setFilter] = useState<FilterTypes>({
        page: 1,
        limit: 10,
        search: "",
        isAdvance: false,
    });
    const [advancedFilter, setAdvancedFilter] = useState<any>(initialValues);
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<any[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [filterOpen, setFilterOpen] = useState<boolean>(false);
    const [selectedLog, setSelectedLog] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const columns: ColumnsType[] = [
        {
            name: "createdAt",
            title: "Activity",
            sortable: true,
            action: (row: any) => {
                const methodColors: any = {
                    POST: "bg-green-100 text-green-700",
                    PUT: "bg-amber-100 text-amber-700",
                    PATCH: "bg-amber-100 text-amber-700",
                    DELETE: "bg-red-100 text-red-700",
                    GET: "bg-blue-100 text-blue-700",
                };
                const color = methodColors[row.method] || "bg-gray-100 text-gray-700";

                return (
                    <div className="flex flex-col gap-1 items-start py-1">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${color}`}>
                            {row.action || row.method}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
                            {convertUtcToIst(row.createdAt?.replace('Z', ''))}
                        </span>
                    </div>
                );
            },
        },
        {
            name: "user_name",
            title: "Performed By",
            sortable: true,
            action: (row: any) => (
                <div className="flex flex-col py-1">
                    <span className="text-sm font-semibold text-gray-800">
                        {row.user_name}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">
                        {row.role} / {row.tenant_name}
                    </span>
                </div>
            ),
        },
        {
            name: "ip_address",
            title: "System",
            sortable: true,
            action: (row: any) => (
                <div className="flex flex-col py-1">
                    <span className="text-sm font-semibold text-gray-800">
                        {row.ip_address || "N/A"}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">
                        {row.browser || "Unknown"}
                    </span>
                </div>
            ),
        },
        {
            name: "location",
            title: "Location",
            sortable: false,
            action: (row: any) => (
                <div className="group relative">
                    <span className="text-sm font-medium text-gray-600 truncate max-w-[150px] inline-block cursor-pointer">
                        {row.location || "Unknown"}
                    </span>
                    {row.location && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center z-50">
                            <span className="px-3 py-1 text-xs text-white bg-[#313349] rounded shadow-md whitespace-nowrap">
                                {row.location}
                            </span>
                            <div className="w-2 h-2 rotate-45 bg-[#313349] mt-[-4px]"></div>
                        </div>
                    )}
                </div>
            ),
        },
        {
            name: "module",
            title: "Resource",
            sortable: true,
            action: (row: any) => (
                <div className="flex flex-col py-1">
                    <span className="text-sm font-semibold text-gray-800">
                        {row.module}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium uppercase font-mono">{row.method}</span>
                </div>
            ),
        },
        {
            name: "campaign_name",
            title: "Campaign",
            sortable: true,
            action: (row: any) => (
                <span className="text-sm font-medium text-gray-600">
                    {row.campaign_name}
                </span>
            ),
        },
        {
            name: "status_code",
            title: "Status",
            sortable: true,
            action: (row: any) => {
                const isError = row.status_code >= 400;
                return (
                    <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${isError ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
                            }`}
                    >
                        {row.status_code}
                    </span>
                );
            },
        },
        {
            name: "uuid",
            title: "Log ID",
            sortable: true,
            action: (row: any) => (
                <button
                    onClick={() => {
                        setSelectedLog(row);
                        setIsModalOpen(true);
                    }}
                    className="text-blue-500 hover:text-blue-700 font-mono text-xs transition-colors py-1"
                >
                    {row.uuid.substring(0, 8)}...
                </button>
            ),
        },
    ];

    const onGetData = useDebouncedCallback(async () => {
        setLoading(true);
        try {
            const params: any = {
                page: filter.page,
                limit: filter.limit,
                search: filter.search,
                tableName: "activity_log",
            };

            if (filter.isAdvance) {
                if (advancedFilter.from_date)
                    params.from_date = formatDate(advancedFilter.from_date, true);
                if (advancedFilter.to_date)
                    params.to_date = formatDate(advancedFilter.to_date, true);
                if (advancedFilter.module) params.module = advancedFilter.module;
                if (advancedFilter.action) params.action = advancedFilter.action;
                if (advancedFilter.method) params.method = advancedFilter.method;
                if (advancedFilter.status_code)
                    params.status_code = advancedFilter.status_code;
                if (advancedFilter.role) params.filter_role = advancedFilter.role;
                if (advancedFilter.ip_address) params.ip_address = advancedFilter.ip_address;
                if (advancedFilter.browser) params.browser = advancedFilter.browser;
            }

            const response: any = await allActivityLog(params);
            if (Array.isArray(response.data)) {
                setData(response.data as any);
                setTotalCount((response.count as number) || 0);
            }
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.error("Get Activity Log Err =-=>", err);
        }
    }, 500);

    useEffect(() => {
        onGetData();
    }, [filter]);

    const handleAdvancedFilterChange = (key: string, val: any) => {
        setAdvancedFilter({
            ...advancedFilter,
            [key]: val,
        });
    };

    const renderAdvancedFilters = () => (
        <>
            <DatePicker
                name="from_date"
                label="From Date"
                value={advancedFilter.from_date}
                onChange={(date: any) => handleAdvancedFilterChange("from_date", date)}
                isInfo
                showTimeSelect
                timeIntervals={15}
                dateFormat="yyyy-MM-dd HH:mm"
            />
            <DatePicker
                name="to_date"
                label="To Date"
                value={advancedFilter.to_date}
                onChange={(date: any) => handleAdvancedFilterChange("to_date", date)}
                isInfo
                showTimeSelect
                timeIntervals={15}
                dateFormat="yyyy-MM-dd HH:mm"
            />
            <div className="flex flex-col">
                <Select
                    name="module"
                    label="Module"
                    value={advancedFilter.module}
                    options={MODULE_OPTIONS}
                    onChange={(e: any) => handleAdvancedFilterChange("module", e.target.value)}
                />
            </div>
            <div className="flex flex-col">
                <Select
                    name="action"
                    label="Action"
                    value={advancedFilter.action}
                    options={ACTION_OPTIONS}
                    onChange={(e: any) => handleAdvancedFilterChange("action", e.target.value)}
                />
            </div>
            <div className="flex flex-col">
                <Input
                    name="status_code"
                    label="Status Code"
                    value={advancedFilter.status_code}
                    onChange={(e: any) =>
                        handleAdvancedFilterChange("status_code", e.target.value)
                    }
                    type="number"
                />
            </div>
            <div className="flex flex-col">
                <Select
                    name="role"
                    label="Role"
                    value={advancedFilter.role}
                    options={ROLE_OPTIONS}
                    onChange={(e: any) => handleAdvancedFilterChange("role", e.target.value)}
                />
            </div>
            <div className="flex flex-col">
                <Input
                    name="ip_address"
                    label="IP Address"
                    value={advancedFilter.ip_address}
                    onChange={(e: any) =>
                        handleAdvancedFilterChange("ip_address", e.target.value)
                    }
                />
            </div>
            <div className="flex flex-col">
                <Select
                    name="browser"
                    label="Browser"
                    value={advancedFilter.browser}
                    options={BROWSER_OPTIONS}
                    onChange={(e: any) => handleAdvancedFilterChange("browser", e.target.value)}
                />
            </div>
        </>
    );

    return (
        <div className="bg-white p-5 rounded-[25px]">
            <Head
                search={filter?.search}
                onChange={(e: any) => {
                    setFilter({
                        ...filter,
                        page: 1,
                        limit: 10,
                        isAdvance: false,
                        search: e.target.value,
                    });
                }}
                onSearchClick={() => {
                    setFilter({ ...filter, isAdvance: true, page: 1 });
                }}
                filterOpen={filterOpen}
                onToggleAdvance={() => setFilterOpen(!filterOpen)}
                onHide={() => {
                    setAdvancedFilter(initialValues);
                    setFilter({ ...filter, isAdvance: false, page: 1 });
                }}
            >
                {renderAdvancedFilters()}
            </Head>
            <div className="mt-5">
                <Table
                    isLoading={loading}
                    columns={columns}
                    data={data}
                    page={filter.page}
                    totalCount={totalCount}
                    limit={filter.limit}
                    onPageClick={(page: number) => {
                        setFilter({
                            ...filter,
                            page,
                        });
                    }}
                    onLimitChange={(limit: number) => {
                        setFilter({
                            ...filter,
                            page: 1,
                            limit,
                        });
                    }}
                    onRefresh={() => onGetData()}
                />
            </div>
            <ActivityDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                data={selectedLog}
            />
        </div>
    );
};

export default ActivityLogReport;
