"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronRight, RotateCcw, Trash2, Upload } from "lucide-react";
import { type Row } from "@tanstack/react-table";
import { apiInstance } from "@/redux/axiosApi";
import { Danger, Success } from "@/redux/services/toasterServices";
import { LEAD_GROUP } from "@/API/constAPI";
import { type LeadGroup, COL_SPAN } from "./types";
import { IndeterminateCheckbox } from "./IndeterminateCheckbox";
import { DispositionTable } from "./DispositionTable";
import { DeleteLeadModal } from "./DeleteLeadModal";

interface Props {
    row: Row<any>;
    lg: LeadGroup;
    campaignUuid: string;
    campaignName: string;
    tenantUuid: string;
    onRechurn: (campaignUuid: string, leadGroupUuid: string, dispositionUuids: string[]) => void;
    onRefresh: () => void;
    rechurningKey: string | null;
    removeQueuesEndpoint: string;
    resetEndpoint: string;
}

export const LeadGroupRow = ({
    row,
    lg,
    campaignUuid,
    campaignName,
    tenantUuid,
    onRechurn,
    onRefresh,
    rechurningKey,
    removeQueuesEndpoint,
    resetEndpoint,
}: Props) => {
    const router = useRouter();
    const pathname = usePathname();
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(lg.status);
    const [togglingStatus, setTogglingStatus] = useState(false);
    const [localQueueCount, setLocalQueueCount] = useState<number | null>(null);

    useEffect(() => {
        const validUuids = new Set(lg.dispositions.map((d) => d.disposition_uuid));
        setSelected((prev: any) => {
            const filtered = new Set(Array.from(prev as Set<string>).filter((u) => validUuids.has(u)));
            return filtered.size === prev.size ? prev : filtered;
        });
    }, [lg.dispositions.length]);

    const key = `${campaignUuid}-${lg.lead_group_uuid}`;
    const isRechurning = rechurningKey === key;
    const isActive = currentStatus === "0";
    const allUuids = lg.dispositions.filter((d) => !!d.disposition_uuid).map((d) => d.disposition_uuid);
    const allSelected = allUuids.length > 0 && allUuids.every((u) => selected.has(u));
    const someSelected = allUuids.some((u) => selected.has(u)) && !allSelected;
    const selectedLeadCount = lg.dispositions
        .filter((d) => selected.has(d.disposition_uuid))
        .reduce((s, d) => s + d.lead_count, 0);

    const toggleAll = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelected(allSelected || someSelected ? new Set() : new Set(allUuids));
    };

    const toggleDisposition = (uuid: string) => {
        setSelected((prev) => {
            const next = new Set(prev);
            next.has(uuid) ? next.delete(uuid) : next.add(uuid);
            return next;
        });
    };

    const toggleLeadGroupStatus = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const newStatus = isActive ? "1" : "0";
        setTogglingStatus(true);
        setCurrentStatus(newStatus);
        try {
            await apiInstance.patch(`${LEAD_GROUP}/${lg.lead_group_uuid}`, { status: newStatus, tenant_uuid: tenantUuid });

            if (newStatus === "1") {
                setLocalQueueCount(0);
                await apiInstance.post(removeQueuesEndpoint, {
                    campaign_uuid: campaignUuid,
                    lead_group_uuid: lg.lead_group_uuid,
                    tenant_uuid: tenantUuid,
                });
                Success("Lead group marked as Inactive");
            } else {
                await apiInstance.post(resetEndpoint, {
                    campaign_uuid: campaignUuid,
                    lead_group_uuid: lg.lead_group_uuid,
                    tenant_uuid: tenantUuid,
                });
                setLocalQueueCount(null);
                Success("Lead group marked as Active");
            }
            onRefresh();
        } catch (err: any) {
            setCurrentStatus(isActive ? "0" : "1");
            setLocalQueueCount(null);
            Danger(err?.response?.data?.message || "Failed to update status");
        } finally {
            setTogglingStatus(false);
        }
    };

    return (
        <>
            <tr className={`border-b border-gray-100 transition-colors ${isActive ? "bg-gray-50/30 hover:bg-indigo-50/20" : "bg-gray-50/60 hover:bg-gray-100/60 opacity-80"}`}>
                {/* Indent spacer */}
                <td className="w-10 pl-6 py-3">
                    <div className="w-px h-5 bg-gray-200 mx-auto" />
                </td>

                {/* Name: expand toggle + selection checkbox + name */}
                <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => row.toggleExpanded()}
                            className="w-6 h-6 rounded-md flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors flex-shrink-0"
                        >
                            {row.getIsExpanded() ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                        </button>
                        <IndeterminateCheckbox checked={allSelected} indeterminate={someSelected} onChange={toggleAll} size="sm" />
                        <div className="min-w-0">
                            <span className={`text-sm font-medium truncate ${isActive ? "text-gray-800" : "text-gray-500"}`}>
                                {lg.lead_group_name}
                            </span>
                            {selected.size > 0 && (
                                <span className="ml-2 text-[11px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                                    {selected.size} selected - {selectedLeadCount} leads
                                </span>
                            )}
                            <p className="text-[11px] text-gray-400 mt-0.5">
                                {lg.dispositions.length} disposition{lg.dispositions.length !== 1 ? "s" : ""}
                            </p>
                        </div>
                    </div>
                </td>

                {/* Status toggle */}
                <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleLeadGroupStatus}
                            disabled={togglingStatus}
                            title={isActive ? "Deactivate lead group" : "Activate lead group"}
                            className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${
                                isActive ? "bg-green-500" : "bg-gray-300"
                            }`}
                        >
                            <span className={`pointer-events-none inline-flex h-4 w-4 items-center justify-center transform rounded-full bg-white shadow transition duration-200 ease-in-out ${isActive ? "translate-x-4" : "translate-x-0"}`}>
                                {togglingStatus && <span className="w-2 h-2 border-[1.5px] border-gray-400 border-t-transparent rounded-full animate-spin" />}
                            </span>
                        </button>
                        <span className={`text-[11px] font-semibold ${isActive ? "text-green-700" : "text-gray-400"}`}>
                            {isActive ? "Active" : "Inactive"}
                        </span>
                    </div>
                </td>

                {/* Queue */}
                <td className="px-3 py-3 text-center">
                    <span className="text-sm font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg tabular-nums">{localQueueCount ?? lg.queue_count}</span>
                </td>

                {/* Total Leads */}
                <td className="px-3 py-3 text-center">
                    <span className="text-sm font-semibold text-gray-700 tabular-nums">{lg.total_leads}</span>
                </td>

                {/* Dispositions count */}
                <td className="px-3 py-3 text-center">
                    <span className="text-xs text-gray-500 tabular-nums">{lg.dispositions.length}</span>
                </td>

                {/* Actions */}
                <td className="px-3 py-3">
                    <div className="flex items-center gap-1.5 justify-end">
                        <button
                            onClick={() => router.push(`/tenant-leads/import-mapper?lead_group_uuid=${lg.lead_group_uuid}&returnTo=${encodeURIComponent(pathname)}`)}
                            title="Import leads"
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-sky-600 hover:bg-sky-50 border border-sky-200 transition-colors"
                        >
                            <Upload className="w-3 h-3" />
                        </button>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            disabled={lg.total_leads === 0}
                            title="Delete all leads"
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 border border-red-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <Trash2 className="w-3 h-3" />
                        </button>
                        <button
                            onClick={() => onRechurn(campaignUuid, lg.lead_group_uuid, Array.from(selected))}
                            disabled={isRechurning || selected.size === 0}
                            title={selected.size === 0 ? "Select dispositions first" : `Re-churn ${selected.size} disposition(s)`}
                            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <RotateCcw className={`w-3 h-3 ${isRechurning ? "animate-spin" : ""}`} />
                            {selected.size > 0 ? `Re-churn (${selected.size})` : "Re-churn"}
                        </button>
                    </div>
                </td>
            </tr>

            {/* Disposition sub-panel (animated) */}
            <AnimatePresence initial={false}>
                {row.getIsExpanded() && (
                    <tr>
                        <td colSpan={COL_SPAN} className="p-0 bg-white">
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                className="overflow-hidden"
                            >
                                <div className="ml-20 mr-4 my-2 rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                                    <DispositionTable
                                        dispositions={lg.dispositions}
                                        selected={selected}
                                        onToggle={toggleDisposition}
                                    />
                                </div>
                            </motion.div>
                        </td>
                    </tr>
                )}
            </AnimatePresence>

            {/* Delete confirmation modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <DeleteLeadModal
                        lg={lg}
                        campaignName={campaignName}
                        tenantUuid={tenantUuid}
                        onClose={() => setShowDeleteModal(false)}
                        onDeleted={() => { setShowDeleteModal(false); onRefresh(); }}
                    />
                )}
            </AnimatePresence>
        </>
    );
};
