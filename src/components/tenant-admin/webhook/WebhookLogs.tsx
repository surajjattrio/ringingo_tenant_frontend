"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { IoEyeOutline, IoTerminalOutline } from "react-icons/io5";

// PROJECT IMPORTS
import {
    useTenantWebhookLogsData,
    useIsLogsLoading,
    tenantWebhookLogsGet,
    tenantWebhookGet,
    useTenantWebhookData,
} from "@/redux/slice/tenant-admin/tenantWebhookSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Head, Table } from "@/components/ui-components";
import { Input, Select } from "@/components/forms";
import { DatePicker } from "@/components/pickers";
import { convertUtcToIst, formatDate } from "@/helperFunctions";
import { Danger, Success } from "@/redux/services/toasterServices";
import WebhookLogDetailModal from "./WebhookLogDetailModal";

// TYPES
import { ColumnsType } from "@/types/tableTypes";
import { FilterTypes } from "@/types/filterTypes";

// Cast icons to fix react-icons v5 type incompatibility with React 18 types
const EyeIcon = IoEyeOutline as React.ElementType;
const TerminalIcon = IoTerminalOutline as React.ElementType;

const STATUS_OPTIONS = [
    { label: "All Statuses", value: "" },
    { label: "Success", value: "success" },
    { label: "Failed", value: "failed" },
];

const WEBHOOK_TYPE_OPTIONS = [
    { label: "All Types", value: "" },
    { label: "CDR", value: "cdr" },
    { label: "Voice Broadcast", value: "voice_broadcast" },
];

const initialAdvancedFilter = {
    status: "",
    webhook_uuid: "",
    webhook_type: "",
    status_code: "",
    from_date: null as any,
    to_date: null as any,
};

// From/To Date are treated as inclusive calendar-day boundaries, not precise
// timestamps — picking "16 Jul" as From means "starting midnight on the 16th," and
// as To means "through the last instant of the 16th." Without this, react-datepicker
// defaults an unedited pick to 00:00:00, so a To Date of "16 Jul" silently excluded
// almost the entire day. Normalizing here (rather than only at request-build time)
// means the widget's own displayed time always matches what's actually queried.
const toStartOfDay = (date: any) => {
    if (!date) return date;
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
};

const toEndOfDay = (date: any) => {
    if (!date) return date;
    const normalized = new Date(date);
    normalized.setHours(23, 59, 59, 999);
    return normalized;
};

/* ============================== WEBHOOK LOGS PAGE ============================== */
// Filter pattern mirrors the canonical tenant-user table (User.tsx): advanced-filter
// field edits are pure local state (no fetch); a single filter.isAdvance flag, set
// only by the Search button, gates whether onGetData includes those fields. Closing
// the panel (Cancel, the X icon, or re-toggling the Filters button — all the same
// Head-internal onClose) always calls onHide, which resets fields to initial AND
// flips isAdvance back to false and page back to 1, immediately refetching the
// unfiltered list. There is no "discard draft but keep applied" state and no
// active-filter chip/badge — filters are only ever visible/active while the panel
// itself is open, exactly like the reference.

const WebhookLogs = () => {
    const dispatch = useAppDispatch();
    const logsData = useTenantWebhookLogsData();
    const isLoading = useIsLogsLoading();
    const webhookData = useTenantWebhookData();

    const [filter, setFilter] = useState<FilterTypes>({
        page: 1,
        limit: 10,
        isAdvance: false,
    });
    const [advancedFilter, setAdvancedFilter] = useState<any>(initialAdvancedFilter);
    const [selectedLog, setSelectedLog] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    // Feedback goes through the app's toast system rather than inline per-row state:
    // the Table component snapshots `columns` into its own useState on mount and only
    // ever re-syncs it via its internal sort handler, so a changing local state value
    // read inside a column's `action` closure here would never visually update after
    // the first render. Row-data-driven rendering (e.g. row.curlCommand) is unaffected
    // — only "state that changes over time inside a closure" is the trap.
    const handleCopyCurl = (row: any) => {
        if (!row?.curlCommand) return;
        navigator.clipboard
            .writeText(row.curlCommand)
            .then(() => Success("cURL copied to clipboard"))
            .catch(() => Danger("Failed to copy cURL"));
    };

    const webhookOptions = [
        { label: "All Webhooks", value: "" },
        ...(webhookData?.data || []).map((wh: any) => ({
            label: wh.name,
            value: wh.uuid,
        })),
    ];

    const columns: ColumnsType[] = [
        {
            name: "createdAt",
            title: "Timestamp",
            action: (row: any) => (
                <span className="text-xs text-gray-600 whitespace-nowrap">
                    {row?.createdAt
                        ? convertUtcToIst(String(row.createdAt).replace("Z", ""))
                        : "-"}
                </span>
            ),
        },
        {
            name: "webhookName",
            title: "Webhook",
        },
        {
            name: "webhook_type",
            title: "Type",
            action: (row: any) => (
                <span className="text-xs uppercase text-gray-500">
                    {row?.webhook_type || "cdr"}
                </span>
            ),
        },
        {
            name: "status",
            title: "Status",
            action: (row: any) => (
                <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${row?.status === "success"
                            ? "bg-primary-success/10 text-primary-success"
                            : "bg-error/10 text-error"
                        }`}
                >
                    {row?.status === "success" ? "Success" : "Failed"}
                </span>
            ),
        },
        {
            name: "statusCode",
            title: "Status Code",
        },
        {
            name: "attempt",
            title: "Attempt",
        },
        {
            name: "duration",
            title: "Duration (ms)",
            action: (row: any) => (
                <span className="text-xs text-gray-600">
                    {row?.duration != null ? `${row.duration} ms` : "-"}
                </span>
            ),
        },
        {
            name: "details",
            title: "Details",
            action: (row: any) => (
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => {
                            setSelectedLog(row);
                            setIsModalOpen(true);
                        }}
                        className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                        title="View details"
                    >
                        <EyeIcon size={16} className="text-gray-500" />
                    </button>
                    <button
                        onClick={() => handleCopyCurl(row)}
                        disabled={!row?.curlCommand}
                        className={`p-1.5 rounded-full transition-colors ${
                            row?.curlCommand
                                ? "hover:bg-gray-100"
                                : "opacity-30 cursor-not-allowed"
                        }`}
                        title={row?.curlCommand ? "Copy cURL" : "cURL not available for this log"}
                    >
                        <TerminalIcon size={16} className="text-gray-500" />
                    </button>
                </div>
            ),
        },
    ];

    useLayoutEffect(() => {
        dispatch(tenantWebhookGet({}));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onGetData = async () => {
        try {
            const baseParams = {
                limit: filter.limit,
                skip: (filter.page - 1) * filter.limit,
            };
            const params = filter.isAdvance
                ? {
                    ...baseParams,
                    status: advancedFilter.status || undefined,
                    webhook_uuid: advancedFilter.webhook_uuid || undefined,
                    webhook_type: advancedFilter.webhook_type || undefined,
                    status_code: advancedFilter.status_code || undefined,
                    from_date: advancedFilter.from_date
                        ? formatDate(advancedFilter.from_date, true)
                        : undefined,
                    to_date: advancedFilter.to_date
                        ? formatDate(advancedFilter.to_date, true)
                        : undefined,
                }
                : baseParams;
            await dispatch(tenantWebhookLogsGet(params)).unwrap();
        } catch (e: any) {
            console.error("Get Webhook Logs Error --->", e.message);
        }
    };

    // Single effect gated on `filter` (never on `advancedFilter` directly) — editing
    // filter fields alone never fetches. Search/Clear (which flip filter.isAdvance)
    // and plain pagination clicks are the only things that change `filter`.
    useEffect(() => {
        onGetData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    const handleFilterChange = (key: string, value: any) => {
        setAdvancedFilter((prev: any) => ({ ...prev, [key]: value }));
    };

    const handleSearch = () => {
        setFilter((prev) => ({ ...prev, page: 1, isAdvance: true }));
    };

    // Wired to Head's onHide, which fires for the Cancel button, the top-right X, and
    // re-toggling the Filters pill while open — all the same Head-internal onClose.
    // Always fully resets fields and applied filter, regardless of whether Search was
    // ever clicked; there is no "discard draft, keep applied" distinction here.
    const handleClear = () => {
        setAdvancedFilter(initialAdvancedFilter);
        setFilter((prev) => ({ ...prev, page: 1, isAdvance: false }));
    };

    const renderFilters = () => (
        <>
            <div className="flex flex-col">
                <Select
                    name="status"
                    label="Status"
                    value={advancedFilter.status}
                    options={STATUS_OPTIONS}
                    onChange={(e: any) => handleFilterChange("status", e.target.value)}
                />
            </div>
            <div className="flex flex-col">
                <Select
                    name="webhook_uuid"
                    label="Webhook"
                    value={advancedFilter.webhook_uuid}
                    options={webhookOptions}
                    onChange={(e: any) => handleFilterChange("webhook_uuid", e.target.value)}
                />
            </div>
            <div className="flex flex-col">
                <Select
                    name="webhook_type"
                    label="Webhook Type"
                    value={advancedFilter.webhook_type}
                    options={WEBHOOK_TYPE_OPTIONS}
                    onChange={(e: any) => handleFilterChange("webhook_type", e.target.value)}
                />
            </div>
            <div className="flex flex-col">
                <Input
                    name="status_code"
                    label="Status Code"
                    value={advancedFilter.status_code}
                    onChange={(e: any) => handleFilterChange("status_code", e.target.value)}
                    type="number"
                />
            </div>
            <DatePicker
                name="from_date"
                label="From Date"
                value={advancedFilter.from_date}
                onChange={(date: any) =>
                    handleFilterChange("from_date", toStartOfDay(date))
                }
                isInfo
                showTimeSelect
                timeIntervals={15}
                dateFormat="yyyy-MM-dd HH:mm"
            />
            <DatePicker
                name="to_date"
                label="To Date"
                value={advancedFilter.to_date}
                onChange={(date: any) => handleFilterChange("to_date", toEndOfDay(date))}
                isInfo
                showTimeSelect
                timeIntervals={15}
                dateFormat="yyyy-MM-dd HH:mm"
            />
        </>
    );

    return (
        <div className="bg-white p-5 rounded-[25px]">
            <Head
                length={logsData?.count}
                onSearchClick={handleSearch}
                onHide={handleClear}
            >
                {renderFilters()}
            </Head>

            <div className="mt-5">
                <Table
                    isLoading={isLoading}
                    title="Webhook Log"
                    selectable={false}
                    columns={columns}
                    data={logsData?.data?.length ? logsData.data : []}
                    page={filter.page}
                    totalCount={logsData?.count || 0}
                    limit={filter.limit}
                    onPageClick={(page: number) => setFilter({ ...filter, page })}
                    onLimitChange={(limit: number) =>
                        setFilter({ ...filter, page: 1, limit })
                    }
                    onRefresh={() => onGetData()}
                />
            </div>
            <WebhookLogDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                data={selectedLog}
            />
        </div>
    );
};

export default WebhookLogs;
