"use client";
import { useState, useEffect, useCallback, useRef, Fragment } from "react";
import { RefreshCw, Layers, ChevronsDownUp, ChevronsUpDown, Search, X, Users } from "lucide-react";
import Cookies from "js-cookie";
import { useDebouncedCallback } from "use-debounce";
import {
    useReactTable,
    getCoreRowModel,
    getExpandedRowModel,
    flexRender,
    type ExpandedState,
} from "@tanstack/react-table";
import { apiInstance } from "@/redux/axiosApi";
import { getLeadResetJobStatus } from "@/redux/services/tenant-admin/outboundServices";
import { Danger, Success } from "@/redux/services/toasterServices";
import { Loader, Pagination } from "@/components/ui-components";
import { type Campaign, type LeadGroup, type ManagerPageTypes, type CampaignType, type StatusFilter, COL_SPAN } from "./types";
import { campaignColumns, CENTERED_COLS, CAMPAIGN_ENDPOINTS } from "./columns";
import { LeadGroupRow } from "./LeadGroupRow";

/* ── Campaign endpoint config (local to this module) ── */

const LeadChurning = ({ managerName }: ManagerPageTypes) => {
    const cookie = Cookies.get("user");
    const userData = JSON.parse(cookie || "{}");
    const { tenant_uuid, role } = userData;

    const [campaignType, setCampaignType] = useState<CampaignType>("blended");
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [expanded, setExpanded] = useState<ExpandedState>({});
    const [rechurningKey, setRechurningKey] = useState<string | null>(null);
    const initialLoadDone = useRef(false);
    const activePollTimeouts = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

    // Stop any in-flight lead-reset-job polling when this page/tab unmounts.
    useEffect(() => {
        return () => {
            activePollTimeouts.current.forEach((t) => clearTimeout(t));
            activePollTimeouts.current.clear();
        };
    }, []);

    // Search, filter, pagination
    const [searchInput, setSearchInput] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCampaigns, setTotalCampaigns] = useState(0);

    const setDebouncedSearchDebounced = useDebouncedCallback(setDebouncedSearch, 400);

    useEffect(() => { setCurrentPage(1); }, [debouncedSearch, statusFilter, campaignType, pageSize]);

    const fetchData = useCallback(async () => {
        if (!initialLoadDone.current) {
            setIsLoading(true);
        } else {
            setIsRefreshing(true);
        }
        try {
            const params: Record<string, string | number> = {
                tenant_uuid, role,
                page: currentPage,
                limit: pageSize,
            };
            if (statusFilter !== "all") params.status = statusFilter;
            if (debouncedSearch.trim()) params.search = debouncedSearch.trim();

            const res: any = await apiInstance.get(CAMPAIGN_ENDPOINTS[campaignType].fetch, { params });
            const data = res?.data ?? res;
            const count = res?.count ?? 0;
            setCampaigns(Array.isArray(data) ? data : []);
            setTotalCampaigns(typeof count === "number" ? count : 0);
        } catch (err: any) {
            Danger(err?.response?.data?.message || "Failed to fetch lead churning data");
            setCampaigns([]);
            setTotalCampaigns(0);
        } finally {
            initialLoadDone.current = true;
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [tenant_uuid, role, campaignType, debouncedSearch, statusFilter, currentPage, pageSize]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const switchCampaignType = (type: CampaignType) => {
        initialLoadDone.current = false;
        setCampaignType(type);
        setExpanded({});
        setCampaigns([]);
        setTotalCampaigns(0);
    };

    const collapseAll = () => setExpanded({});
    const expandAll = () => setExpanded(true);

    // Polls GET /outbound-campaign/lead-reset-status until the async reset job
    // (job_uuid returned by the reset POST when the backend has
    // ENABLE_LEAD_RECHURN_MICROSERVICE=true) reaches a terminal state. Not
    // reached at all for the synchronous fallback or blended campaigns, which
    // never return a job_uuid in the first place.
    const pollLeadResetJob = (jobUuid: string, key: string) => {
        const POLL_INTERVAL_MS = 3000;
        const MAX_ATTEMPTS = 100; // ~5 minutes at 3s per attempt

        let attempts = 0;

        const poll = async () => {
            attempts += 1;
            try {
                const res: any = await getLeadResetJobStatus(jobUuid, tenant_uuid);
                const job = res?.data ?? res;

                if (job?.status === "completed") {
                    Success("Lead reset completed");
                    fetchData();
                    setRechurningKey((k) => (k === key ? null : k));
                    return;
                }
                if (job?.status === "failed") {
                    Danger(job?.error_message || "Lead reset failed");
                    fetchData();
                    setRechurningKey((k) => (k === key ? null : k));
                    return;
                }
                // status is "pending"/"inprogress" (or the lookup itself
                // 404'd transiently right after queuing) — keep polling below.
            } catch {
                // Transient network/poll failure — keep retrying until MAX_ATTEMPTS.
            }

            if (attempts >= MAX_ATTEMPTS) {
                Danger("Lead reset is taking longer than expected — refresh later to check its status");
                setRechurningKey((k) => (k === key ? null : k));
                return;
            }

            const timeoutId = setTimeout(poll, POLL_INTERVAL_MS);
            activePollTimeouts.current.add(timeoutId);
        };

        poll();
    };

    const handleRechurn = async (
        campaignUuid: string,
        leadGroupUuid: string,
        dispositionUuids: string[]
    ) => {
        if (!dispositionUuids.length) return;

        const key = `${campaignUuid}-${leadGroupUuid}`;
        setRechurningKey(key);

        setCampaigns((prev) =>
            prev.map((c) => {
                if (c.campaign_uuid !== campaignUuid) return c;
                return {
                    ...c,
                    lead_groups: c.lead_groups.map((lg) => {
                        if (lg.lead_group_uuid !== leadGroupUuid) return lg;
                        const added = lg.dispositions
                            .filter((d) => dispositionUuids.includes(d.disposition_uuid))
                            .reduce((s, d) => s + d.lead_count, 0);
                        return { ...lg, queue_count: Math.min(lg.queue_count + added, lg.total_leads) };
                    }),
                };
            })
        );

        // Stays true only when the backend queued an async job — in that case
        // the spinner (rechurningKey) is cleared later by pollLeadResetJob
        // once the job actually finishes, not immediately in `finally` below.
        let queuedAsync = false;

        try {
            const res: any = await apiInstance.post(CAMPAIGN_ENDPOINTS[campaignType].reset, {
                campaign_uuid: campaignUuid,
                lead_group_uuid: leadGroupUuid,
                tenant_uuid,
                disposition_uuids: dispositionUuids,
            });

            const jobUuid = res?.job_uuid;
            if (jobUuid) {
                queuedAsync = true;
                Success("Lead reset queued — processing started");
                pollLeadResetJob(jobUuid, key);
            } else {
                Success("Leads moved to queue successfully");
                fetchData();
            }
        } catch (err: any) {
            Danger(err?.response?.data?.message || "Failed to re-churn leads");
            fetchData();
        } finally {
            if (!queuedAsync) setRechurningKey(null);
        }
    };

    const table = useReactTable({
        data: campaigns as any[],
        columns: campaignColumns as any,
        state: { expanded },
        onExpandedChange: setExpanded,
        getRowId: (row: any) => row.campaign_uuid ?? row.lead_group_uuid,
        getSubRows: (row: any) => row.lead_groups,
        getRowCanExpand: () => true,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
    });

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-5">
            {/* Header bar */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl">
                    {(["blended", "outbound"] as CampaignType[]).map((type) => (
                        <button
                            key={type}
                            onClick={() => switchCampaignType(type)}
                            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all capitalize ${
                                campaignType === type ? "bg-white text-indigo-700 shadow-sm" : "text-gray-500 hover:text-gray-800"
                            }`}
                        >
                            {type === "blended" ? "Blended" : "Outbound"}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={collapseAll} title="Collapse all" className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors">
                        <ChevronsDownUp className="w-4 h-4" />
                    </button>
                    <button onClick={expandAll} title="Expand all" className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors">
                        <ChevronsUpDown className="w-4 h-4" />
                    </button>
                    <button
                        onClick={fetchData}
                        disabled={isLoading || isRefreshing}
                        className="flex items-center gap-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl transition-colors disabled:opacity-60"
                    >
                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Search + Filter bar */}
            <div className="flex items-center gap-3 flex-wrap">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => { setSearchInput(e.target.value); setDebouncedSearchDebounced(e.target.value); }}
                        placeholder="Search campaigns..."
                        className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 placeholder:text-gray-400"
                    />
                    {searchInput && (
                        <button onClick={() => { setSearchInput(""); setDebouncedSearch(""); }} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                    {(["all", "active", "inactive"] as StatusFilter[]).map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${
                                statusFilter === s ? "bg-white text-indigo-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            {s === "all" ? "All" : s === "active" ? "Active" : "Inactive"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <Loader className="min-h-[200px]" />
            ) : campaigns.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                    <Layers className="w-12 h-12 text-gray-300 mb-4" />
                    <p className="text-base font-semibold text-gray-500">
                        {debouncedSearch
                            ? `No campaigns match "${debouncedSearch}"`
                            : `No ${statusFilter !== "all" ? statusFilter + " " : ""}${campaignType} campaigns found`
                        }
                    </p>
                    {debouncedSearch ? (
                        <button onClick={() => setSearchInput("")} className="mt-3 text-sm text-indigo-600 hover:underline">
                            Clear search
                        </button>
                    ) : (
                        <p className="text-sm text-gray-400 mt-1">Try clicking Refresh or check back later.</p>
                    )}
                </div>
            ) : (
                <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="w-10" />
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Campaign / Lead Group</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Queue</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Leads</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Dispositions</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map((row) => {
                                /* depth 0 — campaign row */
                                if (row.depth === 0) {
                                    const campaign = row.original as Campaign;
                                    const isActive = campaign.status === "0";
                                    return (
                                        <Fragment key={row.id}>
                                            <tr
                                                onClick={() => row.toggleExpanded()}
                                                className={`border-b border-gray-200 cursor-pointer select-none transition-colors ${
                                                    isActive ? "bg-white hover:bg-indigo-50/30" : "bg-gray-50/60 hover:bg-gray-100/60 opacity-80"
                                                }`}
                                            >
                                                {row.getVisibleCells().map((cell) => (
                                                    <td
                                                        key={cell.id}
                                                        className={`${cell.column.id === "expand" ? "w-10 px-3 py-3.5" : "px-4 py-3.5"}${CENTERED_COLS.has(cell.column.id) ? " text-center" : ""}`}
                                                    >
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </td>
                                                ))}
                                            </tr>
                                            {row.getIsExpanded() && row.subRows.length === 0 && (
                                                <tr className="border-b border-gray-100 bg-gray-50/30">
                                                    <td colSpan={COL_SPAN} className="px-10 py-6 text-center">
                                                        <div className="flex items-center justify-center gap-2 text-gray-400">
                                                            <Users className="w-4 h-4 opacity-50" />
                                                            <span className="text-sm">No lead groups with leads in this campaign</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </Fragment>
                                    );
                                }

                                /* depth 1 — lead group row */
                                if (row.depth === 1) {
                                    const lg = row.original as LeadGroup;
                                    const parentCampaign = row.getParentRow()!.original as Campaign;
                                    return (
                                        <LeadGroupRow
                                            key={row.id}
                                            row={row}
                                            lg={lg}
                                            campaignUuid={parentCampaign.campaign_uuid}
                                            campaignName={parentCampaign.campaign_name}
                                            tenantUuid={tenant_uuid}
                                            onRechurn={handleRechurn}
                                            onRefresh={fetchData}
                                            rechurningKey={rechurningKey}
                                            removeQueuesEndpoint={CAMPAIGN_ENDPOINTS[campaignType].removeQueues}
                                            resetEndpoint={CAMPAIGN_ENDPOINTS[campaignType].reset}
                                        />
                                    );
                                }

                                return null;
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {!isLoading && (
                <Pagination
                    page={currentPage}
                    limit={pageSize}
                    totalCount={totalCampaigns}
                    onPageClick={setCurrentPage}
                    onLimitChange={(limit: number) => { setPageSize(limit); setCurrentPage(1); }}
                    onRefresh={fetchData}
                />
            )}
        </div>
    );
};

export default LeadChurning;
