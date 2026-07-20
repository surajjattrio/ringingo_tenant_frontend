"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// PROJECT IMPORTS
import {
    useTenantWebhookData,
    tenantWebhookGet,
    tenantWebhookUpdate,
    tenantWebhookDelete,
    tenantWebhookTest,
} from "@/redux/slice/tenant-admin/tenantWebhookSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { Head, Table, Icon } from "@/components/ui-components";
import { Input, Select } from "@/components/forms";
import { DeleteModal } from "@/components/modals";

// TYPES
import { ColumnsType } from "@/types/tableTypes";
import { ManagerPageTypes } from "@/types/formTypes";

/* ============================== WEBHOOKS PAGE ============================== */
// Filter pattern mirrors the canonical tenant-user table (User.tsx): advanced-filter
// field edits are pure local state (no fetch); a single filter.isAdvance flag, set
// only by the Search button, gates whether onGetData includes those fields. Closing
// the panel (Cancel, the X icon, or re-toggling the Filters button — all the same
// Head-internal onClose) always calls onHide, which resets fields to initial AND
// flips isAdvance back to false, immediately refetching the unfiltered list. There
// is no "discard draft but keep applied" state and no active-filter chip/badge —
// matching the reference exactly, filters are only ever visible/active while the
// panel itself is open.

const STATUS_OPTIONS = [
    { label: "All Statuses", value: "" },
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
];

const WEBHOOK_TYPE_OPTIONS = [
    { label: "All Types", value: "" },
    { label: "CDR", value: "cdr" },
    { label: "Voice Broadcast", value: "voice_broadcast" },
];

const TRANSFORM_STRATEGY_OPTIONS = [
    { label: "All Strategies", value: "" },
    { label: "UI Template", value: "ui" },
    { label: "Legacy", value: "legacy" },
];

const METHOD_OPTIONS = [
    { label: "All Methods", value: "" },
    { label: "POST", value: "POST" },
    { label: "PUT", value: "PUT" },
    { label: "PATCH", value: "PATCH" },
];

const initialAdvancedFilter = {
    name: "",
    is_active: "",
    webhook_type: "",
    transform_strategy: "",
    method: "",
};

const Webhooks = (props: ManagerPageTypes) => {
    const { name = null } = props;
    const dispatch = useAppDispatch();
    const router = useRouter();
    const webhookData = useTenantWebhookData();

    const [loading, setLoading] = useState<boolean>(true);
    const [deleteId, setDeleteId] = useState<any>("");
    const [testingId, setTestingId] = useState<string>("");
    // No pagination on this table (Table pagination={false} below), so — unlike the
    // tenant-user reference, which always carries page/limit — filter here is just
    // the isAdvance gate.
    const [filter, setFilter] = useState<{ isAdvance: boolean }>({ isAdvance: false });
    const [advancedFilter, setAdvancedFilter] = useState<any>(initialAdvancedFilter);

    const columns: ColumnsType[] = [
        {
            name: "name",
            title: "Name",
            action: (row: any) => (
                <div className="flex gap-2 items-center">
                    <span
                        className={`rounded-full h-[10px] w-[10px] ${row?.is_active ? "bg-primary-success" : "bg-error"
                            }`}
                    ></span>
                    <span>{row?.name}</span>
                </div>
            ),
        },
        {
            name: "webhook_url",
            title: "URL",
        },
        {
            name: "webhook_type",
            title: "Type",
        },
        {
            name: "method",
            title: "Method",
        },
        {
            name: "status",
            title: "Active",
            action: (row: any) => (
                <button
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${row?.is_active
                            ? "bg-primary-success/10 text-primary-success"
                            : "bg-error/10 text-error"
                        }`}
                    onClick={() => onUpdateStatus(row)}
                >
                    {row?.is_active ? "Active" : "Inactive"}
                </button>
            ),
        },
        {
            name: "actions",
            title: "Actions",
            action: (row: any) => (
                <div className="flex gap-2 items-center">
                    <Icon
                        tooltip="Test"
                        name="Refresh2"
                        width={20}
                        height={20}
                        alt="Test"
                        onClick={() => onTestWebhook(row)}
                    />
                    <Icon
                        tooltip="Edit"
                        name="Edit"
                        width={20}
                        height={20}
                        alt="Edit"
                        onClick={() => onEditClick(row)}
                    />
                    <Icon
                        tooltip="Delete"
                        name="DeleteRed"
                        width={20}
                        height={20}
                        alt="Delete"
                        onClick={() => setDeleteId(row?.uuid)}
                    />
                </div>
            ),
        },
    ];

    const onGetData = async () => {
        setLoading(true);
        try {
            const params = filter.isAdvance
                ? {
                    name: advancedFilter.name || undefined,
                    is_active: advancedFilter.is_active || undefined,
                    webhook_type: advancedFilter.webhook_type || undefined,
                    transform_strategy: advancedFilter.transform_strategy || undefined,
                    method: advancedFilter.method || undefined,
                }
                : {};
            await dispatch(tenantWebhookGet(params)).unwrap();
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Get Webhooks Error --->", e.message);
        }
    };

    // Single effect gated on `filter` (never on `advancedFilter` directly) — editing
    // filter fields alone never fetches. Only Search (sets isAdvance: true) or
    // Clear/Cancel/X (sets isAdvance: false) change `filter` and trigger a refetch.
    useEffect(() => {
        onGetData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    const handleFilterChange = (key: string, value: any) => {
        setAdvancedFilter((prev: any) => ({ ...prev, [key]: value }));
    };

    const handleSearch = () => {
        setFilter({ isAdvance: true });
    };

    // Wired to Head's onHide, which fires for the Cancel button, the top-right X, and
    // re-toggling the Filters pill while open — all the same Head-internal onClose.
    // Always fully resets fields and applied filter, regardless of whether Search was
    // ever clicked; there is no "discard draft, keep applied" distinction here.
    const handleClear = () => {
        setAdvancedFilter(initialAdvancedFilter);
        setFilter({ isAdvance: false });
    };

    const onCreateWebhook = () => router.push("/tenant-webhooks/create");

    const onEditClick = (row: any) => router.push("/tenant-webhooks/" + row?.uuid);

    const onUpdateStatus = async (row: any) => {
        setLoading(true);
        try {
            await dispatch(
                tenantWebhookUpdate({ id: row?.uuid, is_active: !row?.is_active })
            ).unwrap();
            onGetData();
            Success("Webhook status updated successfully");
        } catch (e: any) {
            setLoading(false);
            console.error("Update Webhook Status Err --->", e?.message);
        }
    };

    const onTestWebhook = async (row: any) => {
        setTestingId(row?.uuid);
        try {
            const res: any = await dispatch(
                tenantWebhookTest({ id: row?.uuid })
            ).unwrap();
            if (res?.data?.success) {
                Success("Test delivery successful");
            } else {
                Danger(res?.data?.message || "Test delivery failed");
            }
        } catch (e: any) {
            Danger("Test delivery failed");
            console.error("Test Webhook Err --->", e?.message);
        } finally {
            setTestingId("");
        }
    };

    const onDeleteWebhook = async (id: any) => {
        setLoading(true);
        try {
            await dispatch(tenantWebhookDelete(id)).unwrap();
            setDeleteId("");
            onGetData();
            Success("Successfully Deleted");
        } catch (e: any) {
            setLoading(false);
            setDeleteId("");
            Danger("Failed to delete webhook");
            console.error("Delete Webhook Err --->", e?.message);
        }
    };

    const renderFilters = () => (
        <>
            <div className="flex flex-col">
                <Input
                    name="name"
                    label="Name"
                    value={advancedFilter.name}
                    onChange={(e: any) => handleFilterChange("name", e.target.value)}
                />
            </div>
            <div className="flex flex-col">
                <Select
                    name="is_active"
                    label="Status"
                    value={advancedFilter.is_active}
                    options={STATUS_OPTIONS}
                    onChange={(e: any) => handleFilterChange("is_active", e.target.value)}
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
                <Select
                    name="transform_strategy"
                    label="Transform Strategy"
                    value={advancedFilter.transform_strategy}
                    options={TRANSFORM_STRATEGY_OPTIONS}
                    onChange={(e: any) =>
                        handleFilterChange("transform_strategy", e.target.value)
                    }
                />
            </div>
            <div className="flex flex-col">
                <Select
                    name="method"
                    label="Method"
                    value={advancedFilter.method}
                    options={METHOD_OPTIONS}
                    onChange={(e: any) => handleFilterChange("method", e.target.value)}
                />
            </div>
        </>
    );

    return (
        <div className="bg-white p-5 rounded-[25px]">
            <Head
                name={name}
                length={webhookData?.count}
                createText="Create Webhook"
                onCreateClick={onCreateWebhook}
                onSearchClick={handleSearch}
                onHide={handleClear}
            >
                {renderFilters()}
            </Head>

            <div className="mt-5">
                <Table
                    isLoading={loading}
                    title="Webhook"
                    name={name}
                    selectable={false}
                    pagination={false}
                    columns={columns}
                    data={webhookData?.data?.length ? webhookData.data : []}
                />
            </div>
            <DeleteModal
                loading={loading}
                visible={!!deleteId}
                onCancelClick={() => setDeleteId("")}
                onDoneClick={() => onDeleteWebhook(deleteId)}
            />
        </div>
    );
};

export default Webhooks;
