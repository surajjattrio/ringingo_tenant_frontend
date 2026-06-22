import { ChevronDown, ChevronRight, Circle } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";
import {
    OUTBOUND_CAMPAIGN_LEAD_CHURNING_DATA,
    OUTBOUND_CAMPAIGN_LEAD_RESET,
    BLENDED_CAMPAIGN_LEAD_CHURNING_DATA,
    BLENDED_CAMPAIGN_LEAD_RESET,
    LEAD_GROUP_REMOVE_QUEUE,
    BLENDED_CAMPAIGN_REMOVE_QUEUE,
} from "@/API/constAPI";
import { Campaign, DispositionRow, DispositionTableMeta } from "./types";

/* ── Campaign helpers ── */

export function getTotalQueue(campaign: Campaign): number {
    return campaign.lead_groups.reduce((s, lg) => s + lg.queue_count, 0);
}
export function getTotalLeads(campaign: Campaign): number {
    return campaign.lead_groups.reduce((s, lg) => s + lg.total_leads, 0);
}
export function getTotalDispositions(campaign: Campaign): number {
    return campaign.lead_groups.reduce((s, lg) => s + lg.dispositions.length, 0);
}

/* ── Campaign TanStack columns ── */

const columnHelper = createColumnHelper<Campaign>();

export const CENTERED_COLS = new Set(["queue", "total_leads", "dispositions"]);

export const campaignColumns = [
    columnHelper.display({
        id: "expand",
        cell: ({ row }) => {
            const isExpanded = row.getIsExpanded();
            return (
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${isExpanded ? "bg-indigo-50 text-indigo-600" : "text-gray-400"}`}>
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
            );
        },
    }),
    columnHelper.accessor("campaign_name", {
        id: "campaign_name",
        cell: ({ row }) => {
            const { campaign_name, status, lead_groups } = row.original;
            const isActive = status === "0";
            return (
                <div className="flex items-center gap-3">
                    <div className={`w-1 h-8 rounded-full flex-shrink-0 ${isActive ? "bg-green-400" : "bg-gray-300"}`} />
                    <div>
                        <span className={`font-bold text-sm ${isActive ? "text-gray-900" : "text-gray-500"}`}>{campaign_name}</span>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                            {lead_groups.length} lead group{lead_groups.length !== 1 ? "s" : ""}
                        </p>
                    </div>
                </div>
            );
        },
    }),
    columnHelper.display({
        id: "status",
        cell: ({ row }) => {
            const isActive = row.original.status === "0";
            return (
                <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                    isActive ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-100 text-gray-500 border-gray-200"
                }`}>
                    <Circle className={`w-2 h-2 fill-current ${isActive ? "text-green-500" : "text-gray-400"}`} />
                    {isActive ? "Active" : "Inactive"}
                </span>
            );
        },
    }),
    columnHelper.display({
        id: "queue",
        cell: ({ row }) => (
            <span className="text-sm font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg tabular-nums">
                {getTotalQueue(row.original)}
            </span>
        ),
    }),
    columnHelper.display({
        id: "total_leads",
        cell: ({ row }) => (
            <span className="text-sm font-bold text-gray-700 tabular-nums">{getTotalLeads(row.original)}</span>
        ),
    }),
    columnHelper.display({
        id: "dispositions",
        cell: ({ row }) => (
            <span className="text-sm text-gray-500 tabular-nums">{getTotalDispositions(row.original)}</span>
        ),
    }),
    columnHelper.display({
        id: "actions",
        cell: () => null,
    }),
];

/* ── Disposition TanStack columns ── */

const dispColumnHelper = createColumnHelper<DispositionRow>();

export const DISP_PAGE_SIZE = 5;
export const DISP_CENTERED_COLS = new Set(["queue_count", "lead_count"]);

export const dispositionGlobalFilter = (row: any, _: string, value: string): boolean => {
    const q = value.toLowerCase();
    return (
        row.original.disposition_name.toLowerCase().includes(q) ||
        row.original.disposition_code.toLowerCase().includes(q)
    );
};

export const dispositionColumns = [
    dispColumnHelper.display({
        id: "checkbox",
        cell: ({ row, table }) => {
            const { selected, onToggle } = table.options.meta as DispositionTableMeta;
            const uuid = row.original.disposition_uuid;
            return (
                <input
                    type="checkbox"
                    checked={selected.has(uuid)}
                    onChange={() => {}}
                    onClick={(e) => { e.stopPropagation(); onToggle(uuid); }}
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
            );
        },
    }),
    dispColumnHelper.accessor("disposition_name", {
        cell: ({ row, table }) => {
            const { selected } = table.options.meta as DispositionTableMeta;
            const isSelected = selected.has(row.original.disposition_uuid);
            return (
                <div>
                    <p className={`font-medium ${isSelected ? "text-indigo-700" : "text-gray-700"}`}>{row.original.disposition_name}</p>
                    <p className="text-xs text-gray-400">{row.original.disposition_code}</p>
                </div>
            );
        },
    }),
    dispColumnHelper.accessor("queue_count", {
        cell: ({ getValue }) => <span className="text-sm font-semibold text-gray-700">{getValue()}</span>,
    }),
    dispColumnHelper.accessor("lead_count", {
        cell: ({ getValue }) => <span className="text-sm font-semibold text-gray-700">{getValue()}</span>,
    }),
];

/* ── Campaign endpoint config ── */

export const CAMPAIGN_ENDPOINTS = {
    outbound: { fetch: OUTBOUND_CAMPAIGN_LEAD_CHURNING_DATA, reset: OUTBOUND_CAMPAIGN_LEAD_RESET, removeQueues: LEAD_GROUP_REMOVE_QUEUE },
    blended:  { fetch: BLENDED_CAMPAIGN_LEAD_CHURNING_DATA,  reset: BLENDED_CAMPAIGN_LEAD_RESET,  removeQueues: BLENDED_CAMPAIGN_REMOVE_QUEUE },
};
