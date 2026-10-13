"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { useAuth } from "@/contexts/hooks/useAuth";
import {
    pipelineBoardGet,
    pipelineStageCreate,
    pipelineStageUpdate,
    pipelineStageDelete,
    pipelineLeadCreate,
    pipelineLeadUpdate,
    pipelineLeadDelete,
    pipelineLeadMove,
    pipelineLeadsImport,
    pipelineAssignmentConfigGet,
    pipelineAssignmentConfigSave,
    pipelineDistributeExistingLeads,
    pipelineLeadBulkDelete,
    pipelineLeadBulkUpdate,
    useAssignmentConfig,
    usePipelineBoardData,
    usePipelineLoading,
} from "@/redux/slice/tenant-admin/pipelineSlice";
import {
    tenantDispositionOptionsGet,
    useTenantDispositionOptions,
} from "@/redux/slice/tenant-admin/tenantDispositionSlice";
import {
    leadGroupOptionsGet,
    useLeadGroupOptions,
} from "@/redux/slice/tenant-admin/leadGroupSlice";
import {
    userOptionsGet,
    useUserOptions,
} from "@/redux/slice/tenant-admin/userSlice";
import {
    outboundOptionsGet,
    useOutboundOptions,
} from "@/redux/slice/tenant-admin/outboundSlice";
import {
    inboundOptionsGet,
    useInboundOptions,
} from "@/redux/slice/tenant-admin/inboundSlice";
import {
    blendedOptionsGet,
    useBlendedOptions,
} from "@/redux/slice/tenant-admin/blendedSlice";
import {
    getSingleLead,
} from "@/redux/slice/tenant-admin/leadManagementSlice";
import { useCountryOptions } from "@/redux/slice/master-admin/countrySlice";
import { Success, Danger } from "@/redux/services/toasterServices";
import KanbanLeadModal from "@/components/tenant-admin/kanban/KanbanLeadModal";

/* ═══════════════════════════════════════
   TYPES
═══════════════════════════════════════ */
interface Lead {
    id: string;
    phone: string;
    name: string;
    initials: string;
    avatarColor: string;
    date: string;
    relativeTime: string;
    email: string;
    priority: "High" | "Medium" | "Low";
    value: string;
    tags: string[];
    campaign_name?: string;
    campaign_uuid?: string;
    lead_group_name?: string;
    lead_group_uuid?: string;
    user_name?: string;
    user_uuid?: string;
    lead_management_uuid?: string;
    lead_details?: any;
}

interface Stage {
    id: string;
    title: string;
    color: string;
    bgColor: string;
    textColor: string;
    leads: Lead[];
    target: number;
}

/* ═══════════════════════════════════════
   MOCK DATA
═══════════════════════════════════════ */
const INITIAL_STAGES: Stage[] = [
    {
        id: "new",
        title: "NEW",
        color: "#f59e0b",
        bgColor: "rgba(245,158,11,0.08)",
        textColor: "#d97706",
        target: 5,
        leads: [
            { id: "l1", phone: "1234567890", name: "John Doe", initials: "JD", avatarColor: "#6366f1", date: "14 Sep 2026, 06:44 PM", relativeTime: "2h ago", email: "john@example.com", priority: "High", value: "₹45,000", tags: ["inbound", "hot"] },
            { id: "l2", phone: "9876543210", name: "Priya Sharma", initials: "PS", avatarColor: "#f59e0b", date: "14 Sep 2026, 04:12 PM", relativeTime: "4h ago", email: "priya@mail.com", priority: "Medium", value: "₹28,000", tags: ["follow-up"] },
        ],
    },
    {
        id: "contacted",
        title: "CONTACTED",
        color: "#342df2",
        bgColor: "rgba(52,45,242,0.07)",
        textColor: "#342df2",
        target: 4,
        leads: [
            { id: "l3", phone: "5551234567", name: "Ali Khan", initials: "AK", avatarColor: "#10b981", date: "13 Sep 2026, 02:30 PM", relativeTime: "1d ago", email: "ali@crm.io", priority: "Low", value: "₹12,500", tags: ["demo-done"] },
        ],
    },
    {
        id: "qualified",
        title: "QUALIFIED",
        color: "#8b5cf6",
        bgColor: "rgba(139,92,246,0.07)",
        textColor: "#7c3aed",
        target: 3,
        leads: [
            { id: "l4", phone: "7779001234", name: "Sara Lee", initials: "SL", avatarColor: "#ef4444", date: "12 Sep 2026, 11:00 AM", relativeTime: "2d ago", email: "sara@biz.com", priority: "High", value: "₹92,000", tags: ["enterprise", "urgent"] },
        ],
    },
    {
        id: "disposed",
        title: "DISPOSED",
        color: "#10b981",
        bgColor: "rgba(16,185,129,0.07)",
        textColor: "#059669",
        target: 6,
        leads: [],
    },
];

/* ═══════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════ */
const PRIORITY_CONFIG = {
    High:   { bg: "rgba(239,68,68,0.1)",   text: "#ef4444", dot: "#ef4444",   border: "rgba(239,68,68,0.2)" },
    Medium: { bg: "rgba(245,158,11,0.1)",  text: "#d97706", dot: "#f59e0b",  border: "rgba(245,158,11,0.2)" },
    Low:    { bg: "rgba(16,185,129,0.1)",  text: "#059669", dot: "#10b981",  border: "rgba(16,185,129,0.2)" },
};

const STAGE_COLORS = ["#342df2","#f59e0b","#10b981","#ef4444","#8b5cf6","#06b6d4","#f43f5e"];

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
    "inbound":    { bg: "rgba(52,45,242,0.08)",  text: "#342df2" },
    "hot":        { bg: "rgba(239,68,68,0.08)",  text: "#ef4444" },
    "follow-up":  { bg: "rgba(245,158,11,0.08)", text: "#d97706" },
    "demo-done":  { bg: "rgba(16,185,129,0.08)", text: "#059669" },
    "enterprise": { bg: "rgba(139,92,246,0.08)", text: "#7c3aed" },
    "urgent":     { bg: "rgba(239,68,68,0.08)",  text: "#ef4444" },
};

/* ═══════════════════════════════════════
   SVG ICONS
═══════════════════════════════════════ */
const Ic = {
    Phone: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
    User: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    Calendar: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    Search: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
    Filter: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>,
    Edit: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
    Trash: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
    Plus: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>,
    ChevronDown: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>,
    Grid: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
    List: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>,
    Share: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>,
    Download: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>,
    Upload: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>,
    Sheet: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#16a34a" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>,
    Assign: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#7c3aed" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    Mail: () => <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    Bolt: () => <svg className="w-3.5 h-3.5" fill="#f59e0b" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>,
    Settings: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>,
    Money: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    TrendUp: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
    Target: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
    Clock: () => <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    Check: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>,
    Close: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>,
    Megaphone: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>,
    PhoneCall: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
    Folder: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>,
    Layers: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
};

/* ═══════════════════════════════════════
   LEAD CARD
═══════════════════════════════════════ */
const LeadCard = ({
    lead,
    stageColor,
    onClick,
    onEdit,
    onDelete,
    onDragStart,
    onDragEnd,
    isDragging,
    isSelected = false,
    onToggleSelect,
    isSelectionActive = false,
}: {
    lead: Lead;
    stageColor: string;
    onClick: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onDragStart?: (e: React.DragEvent) => void;
    onDragEnd?: () => void;
    isDragging?: boolean;
    isSelected?: boolean;
    onToggleSelect?: (e: React.MouseEvent) => void;
    isSelectionActive?: boolean;
}) => {
    const [hovered, setHovered] = useState(false);
    const pCfg = PRIORITY_CONFIG[lead.priority] || PRIORITY_CONFIG.Medium;

    return (
        <div
            draggable
            onClick={onClick}
            onDragStart={(e) => {
                e.stopPropagation();
                onDragStart?.(e);
            }}
            onDragEnd={() => onDragEnd?.()}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: isSelected
                    ? "linear-gradient(145deg, #f5f4ff, #ffffff)"
                    : hovered
                    ? "linear-gradient(145deg,#ffffff,#fafbff)"
                    : "#ffffff",
                boxShadow: isSelected
                    ? `0 0 0 2px #342df2, 0 10px 30px rgba(52,45,242,0.18)`
                    : hovered
                    ? `0 12px 40px rgba(52,45,242,0.12), 0 0 0 1.5px ${stageColor}30`
                    : "0 2px 12px rgba(0,0,0,0.05)",
                transform: isDragging
                    ? "rotate(2deg) scale(1.03)"
                    : hovered ? "translateY(-2px) scale(1.01)" : "translateY(0) scale(1)",
                opacity: isDragging ? 0.55 : 1,
                transition: "all 0.2s cubic-bezier(.4,0,.2,1)",
                borderRadius: "16px",
                overflow: "hidden",
                position: "relative",
                cursor: isDragging ? "grabbing" : "grab",
            }}
        >
            {/* top accent strip */}
            <div style={{ height: "3px", background: isSelected ? "linear-gradient(90deg, #342df2, #7c3aed)" : `linear-gradient(90deg,${stageColor},${stageColor}80)`, width: "100%" }} />

            <div style={{ padding: "14px 14px 12px" }}>
                {/* row 1: avatar + name + actions */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {/* Checkbox */}
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleSelect?.(e);
                            }}
                            title={isSelected ? "Deselect lead" : "Select lead"}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                opacity: (hovered || isSelected || isSelectionActive) ? 1 : 0,
                                width: (hovered || isSelected || isSelectionActive) ? 20 : 0,
                                transition: "all .15s ease",
                                overflow: "hidden",
                                flexShrink: 0
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {}}
                                style={{ width: 16, height: 16, accentColor: "#342df2", cursor: "pointer" }}
                            />
                        </div>

                        <div style={{
                            width: 36, height: 36,
                            borderRadius: "50%",
                            background: `linear-gradient(135deg,${lead.avatarColor},${lead.avatarColor}bb)`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "12px", fontWeight: 700, color: "#fff",
                            flexShrink: 0,
                            boxShadow: `0 4px 12px ${lead.avatarColor}40`
                        }}>
                            {lead.initials}
                        </div>
                        <div>
                            <p style={{ fontSize: "13px", fontWeight: 700, color: "#1e1b4b", margin: 0, lineHeight: 1.2 }}>{lead.name}</p>
                            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                                <span style={{ color: "#94a3b8" }}><Ic.Clock /></span>
                                <span style={{ fontSize: "10px", color: "#94a3b8" }}>{lead.relativeTime || lead.date}</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: 4, opacity: hovered ? 1 : 0, transition: "opacity .2s" }}>
                        <button
                            onClick={(e) => { e.stopPropagation(); onEdit(); }}
                            title="Edit Lead"
                            style={{ padding: "5px", borderRadius: "8px", background: "rgba(52,45,242,0.07)", border: "none", cursor: "pointer", color: "#342df2", display: "flex" }}
                        >
                            <Ic.Edit />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(); }}
                            title="Delete Lead"
                            style={{ padding: "5px", borderRadius: "8px", background: "rgba(239,68,68,0.07)", border: "none", cursor: "pointer", color: "#ef4444", display: "flex" }}
                        >
                            <Ic.Trash />
                        </button>
                    </div>
                </div>

                {/* info rows */}
                <div style={{ display: "flex", flexDirection: "column", gap: "7px", marginBottom: "12px" }}>
                    {/* Phone */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ color: stageColor, opacity: 0.7, display: "flex" }}><Ic.Phone /></span>
                        <span style={{ fontSize: "12px", fontWeight: 600, color: "#374151", letterSpacing: "0.3px" }}>{lead.phone}</span>
                    </div>

                    {/* Assigned Lead Group */}
                    {lead.lead_group_name && (
                        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                            <span style={{ color: "#0284c7", display: "flex", flexShrink: 0 }}><Ic.Folder /></span>
                            <span style={{
                                fontSize: "11px",
                                background: "rgba(2,132,199,0.08)", padding: "2px 8px",
                                borderRadius: "6px", border: "1px solid rgba(2,132,199,0.22)",
                                maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                                display: "inline-flex", alignItems: "center", gap: 4
                            }} title={`Lead Group: ${lead.lead_group_name}`}>
                                <span style={{ fontSize: "10px", fontWeight: 600, color: "#0369a1", opacity: 0.8 }}>Group:</span>
                                <span style={{ fontWeight: 700, color: "#0284c7" }}>{lead.lead_group_name}</span>
                            </span>
                        </div>
                    )}

                    {/* Assigned User */}
                    {lead.user_name && (
                        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                            <span style={{ color: "#4f46e5", display: "flex", flexShrink: 0 }}><Ic.User /></span>
                            <span style={{
                                fontSize: "11px",
                                background: "rgba(79,70,229,0.08)", padding: "2px 8px",
                                borderRadius: "6px", border: "1px solid rgba(79,70,229,0.22)",
                                maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                                display: "inline-flex", alignItems: "center", gap: 4
                            }} title={`Assigned User: ${lead.user_name}`}>
                                <span style={{ fontSize: "10px", fontWeight: 600, color: "#4338ca", opacity: 0.8 }}>User:</span>
                                <span style={{ fontWeight: 700, color: "#4f46e5" }}>{lead.user_name}</span>
                            </span>
                        </div>
                    )}

                    {/* Associated Campaign */}
                    {lead.campaign_name && (
                        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                            <span style={{ color: "#7c3aed", display: "flex", flexShrink: 0 }}><Ic.Megaphone /></span>
                            <span style={{
                                fontSize: "11px",
                                background: "rgba(124,58,237,0.08)", padding: "2px 8px",
                                borderRadius: "6px", border: "1px solid rgba(124,58,237,0.22)",
                                maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                                display: "inline-flex", alignItems: "center", gap: 4
                            }} title={`Campaign: ${lead.campaign_name}`}>
                                <span style={{ fontSize: "10px", fontWeight: 600, color: "#6d28d9", opacity: 0.8 }}>Campaign:</span>
                                <span style={{ fontWeight: 700, color: "#7c3aed" }}>{lead.campaign_name}</span>
                            </span>
                        </div>
                    )}

                    {/* Date */}
                    {lead.date && (
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ color: "#94a3b8", display: "flex" }}><Ic.Calendar /></span>
                            <span style={{ fontSize: "11px", color: "#6b7280" }}>{lead.date}</span>
                        </div>
                    )}
                </div>

                {/* Priority row (Email removed per user requirement) */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginBottom: 6 }}>
                    <span style={{ fontSize: "10px", fontWeight: 700, color: pCfg.text, background: pCfg.bg, border: `1px solid ${pCfg.border}`, borderRadius: "20px", padding: "2px 8px", display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: pCfg.dot, display: "inline-block" }} />
                        {lead.priority}
                    </span>
                </div>

                {/* tags + calling action */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {(lead.tags ?? []).map((t) => {
                            const tc = TAG_COLORS[t] || { bg: "rgba(100,100,100,0.08)", text: "#555" };
                            return (
                                <span key={t} style={{ fontSize: "9px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", background: tc.bg, color: tc.text, borderRadius: "4px", padding: "2px 6px" }}>
                                    {t}
                                </span>
                            );
                        })}
                    </div>
                    {/* calling action button */}
                    <a
                        href={lead.phone ? `tel:${lead.phone}` : undefined}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                        title={lead.phone ? `Call ${lead.name || lead.phone} (${lead.phone})` : "No phone available"}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "30px",
                            height: "30px",
                            borderRadius: "8px",
                            background: "rgba(16,185,129,0.12)",
                            color: "#059669",
                            border: "1px solid rgba(16,185,129,0.25)",
                            cursor: lead.phone ? "pointer" : "default",
                            textDecoration: "none",
                            transition: "all .18s ease-in-out",
                            boxShadow: "0 2px 6px rgba(16,185,129,0.12)",
                            flexShrink: 0,
                        }}
                        onMouseEnter={(e) => {
                            if (lead.phone) {
                                e.currentTarget.style.background = "#10b981";
                                e.currentTarget.style.color = "#ffffff";
                                e.currentTarget.style.transform = "scale(1.08)";
                                e.currentTarget.style.boxShadow = "0 4px 12px rgba(16,185,129,0.35)";
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(16,185,129,0.12)";
                            e.currentTarget.style.color = "#059669";
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow = "0 2px 6px rgba(16,185,129,0.12)";
                        }}
                    >
                        <Ic.PhoneCall />
                    </a>
                </div>
            </div>
        </div>
    );
};

/* ═══════════════════════════════════════
   STAGE COLUMN
═══════════════════════════════════════ */
const StageColumn = ({
    stage,
    onEdit,
    onDelete,
    onAddLead,
    onClickLead,
    onEditLead,
    onDeleteLead,
    onLeadDragStart,
    onColumnDragOver,
    onColumnDrop,
    onColumnDragLeave,
    isDragOver,
    draggingLeadId,
    selectedLeadIds = [],
    onToggleSelectLead,
    onToggleSelectStage,
}: {
    stage: Stage;
    onEdit: (stage: Stage) => void;
    onDelete: (stage: Stage) => void;
    onAddLead: (stageId: string, stageTitle?: string) => void;
    onClickLead: (lead: Lead) => void;
    onEditLead: (lead: Lead) => void;
    onDeleteLead: (lead: Lead) => void;
    onLeadDragStart: (e: React.DragEvent, leadId: string, stageId: string) => void;
    onColumnDragOver: (e: React.DragEvent) => void;
    onColumnDrop: (e: React.DragEvent, stageId: string) => void;
    onColumnDragLeave: () => void;
    isDragOver: boolean;
    draggingLeadId: string | null;
    selectedLeadIds?: string[];
    onToggleSelectLead?: (leadId: string) => void;
    onToggleSelectStage?: (stageId: string) => void;
}) => {
    // Use a counter to handle the HTML5 drag-leave flicker:
    // onDragEnter/Leave fire on every child element crossing, so we only
    // truly leave the column when the counter drops back to 0.
    const dragCounterRef = useRef(0);

    const stageLeadIds = stage.leads.map(l => l.id);
    const stageSelectedCount = stageLeadIds.filter(id => selectedLeadIds.includes(id)).length;
    const allStageSelected = stage.leads.length > 0 && stageSelectedCount === stage.leads.length;
    const isStageIndeterminate = stageSelectedCount > 0 && !allStageSelected;

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        dragCounterRef.current += 1;
        onColumnDragOver(e); // activate highlight
    };

    const handleDragLeave = () => {
        dragCounterRef.current -= 1;
        if (dragCounterRef.current <= 0) {
            dragCounterRef.current = 0;
            onColumnDragLeave(); // only deactivate when truly leaving the column
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        dragCounterRef.current = 0;
        onColumnDrop(e, stage.id);
    };

    return (
        <div
            style={{ width: 290, flexShrink: 0, display: "flex", flexDirection: "column" }}
            onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {/* column header */}
            <div style={{
                background: isDragOver ? `${stage.color}15` : stage.bgColor,
                borderRadius: "16px",
                padding: "14px 16px",
                marginBottom: "12px",
                border: `1.5px solid ${stage.color}20`,
                position: "relative",
                overflow: "hidden"
            }}>
                {/* subtle glow */}
                <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: stage.color, opacity: 0.07, pointerEvents: "none" }} />

                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {/* Stage select-all checkbox */}
                        {stage.leads.length > 0 && (
                            <div
                                title={allStageSelected ? "Deselect all leads in this stage" : "Select all leads in this stage"}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleSelectStage?.(stage.id);
                                }}
                                style={{
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    cursor: "pointer",
                                    padding: "2px",
                                    borderRadius: "6px",
                                    background: stageSelectedCount > 0 ? `${stage.color}20` : "rgba(255,255,255,0.8)",
                                    border: `1.5px solid ${stageSelectedCount > 0 ? stage.color : "rgba(0,0,0,0.15)"}`,
                                    transition: "all .15s",
                                    marginRight: 2
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={allStageSelected}
                                    ref={el => {
                                        if (el) el.indeterminate = isStageIndeterminate;
                                    }}
                                    onChange={() => {}}
                                    style={{ width: 14, height: 14, accentColor: stage.color, cursor: "pointer" }}
                                />
                            </div>
                        )}
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: stage.color, boxShadow: `0 0 8px ${stage.color}80` }} />
                        <div>
                            <h3 style={{ fontSize: "11px", fontWeight: 800, color: stage.textColor, letterSpacing: "1.5px", margin: 0 }}>{stage.title}</h3>
                            <p style={{ fontSize: "10px", color: stageSelectedCount > 0 ? stage.color : "#94a3b8", fontWeight: stageSelectedCount > 0 ? 700 : 500, margin: "2px 0 0 0" }}>
                                {stageSelectedCount > 0 ? `${stageSelectedCount} of ${stage.leads.length} selected` : `${stage.leads.length} leads`}
                            </p>
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: 4 }}>
                        <button
                            onClick={() => onEdit(stage)}
                            title="Edit Stage"
                            style={{ padding: "5px", borderRadius: "8px", background: "rgba(255,255,255,0.8)", border: "none", cursor: "pointer", color: "#64748b", display: "flex", transition: "all .15s" }}
                            onMouseEnter={e => (e.currentTarget.style.color = stage.color)}
                            onMouseLeave={e => (e.currentTarget.style.color = "#64748b")}
                        >
                            <Ic.Edit />
                        </button>
                        <button
                            onClick={() => onDelete(stage)}
                            title="Delete Stage"
                            style={{ padding: "5px", borderRadius: "8px", background: "rgba(239,68,68,0.08)", border: "none", cursor: "pointer", color: "#ef4444", display: "flex", transition: "all .15s" }}
                            onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.18)")}
                            onMouseLeave={e => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
                        >
                            <Ic.Trash />
                        </button>
                    </div>
                </div>
            </div>

            {/* lead cards drop zone */}
            <div style={{
                display: "flex", flexDirection: "column", gap: 10, flex: 1,
                minHeight: 80,
                borderRadius: "14px",
                padding: isDragOver ? "6px" : "0",
                border: isDragOver ? `2px dashed ${stage.color}60` : "2px dashed transparent",
                background: isDragOver ? `${stage.color}06` : "transparent",
                transition: "all .2s ease",
            }}>
                {stage.leads.length === 0 ? (
                    <div style={{
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                        minHeight: 120, borderRadius: "14px",
                        border: isDragOver ? `2px dashed ${stage.color}70` : `2px dashed ${stage.color}30`,
                        background: isDragOver ? `${stage.color}10` : stage.bgColor,
                        transition: "all .2s ease",
                    }}>
                        {isDragOver ? (
                            <>
                                <div style={{ fontSize: "22px", marginBottom: 6 }}>⬇</div>
                                <p style={{ fontSize: "11px", color: stage.color, fontWeight: 700, margin: 0 }}>Drop here</p>
                            </>
                        ) : (
                            <>
                                <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${stage.color}10`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                                    <span style={{ fontSize: "18px", color: `${stage.color}60` }}>○</span>
                                </div>
                                <p style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 500, margin: 0 }}>No deals in this stage</p>
                            </>
                        )}
                    </div>
                ) : (
                    stage.leads.map((lead) => (
                        <LeadCard
                            key={lead.id}
                            lead={lead}
                            stageColor={stage.color}
                            onClick={() => onClickLead(lead)}
                            onEdit={() => onEditLead(lead)}
                            onDelete={() => onDeleteLead(lead)}
                            isDragging={draggingLeadId === lead.id}
                            onDragStart={(e) => onLeadDragStart(e, lead.id, stage.id)}
                            onDragEnd={() => {}}
                            isSelected={selectedLeadIds.includes(lead.id)}
                            onToggleSelect={() => onToggleSelectLead?.(lead.id)}
                            isSelectionActive={selectedLeadIds.length > 0}
                        />
                    ))
                )}
                {/* drag-over indicator when column already has cards */}
                {isDragOver && stage.leads.length > 0 && (
                    <div style={{
                        height: 4, borderRadius: "4px",
                        background: `linear-gradient(90deg,${stage.color},${stage.color}60)`,
                        animation: "pulseBar .8s ease-in-out infinite alternate",
                        marginTop: 4,
                    }} />
                )}
            </div>

            {/* add lead btn — also acts as a drop zone so dragging here still works */}
            <button
                onClick={() => onAddLead(stage.id, stage.title)}
                onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }}
                onDrop={handleDrop}
                style={{
                    marginTop: 12,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    padding: "10px 0",
                    borderRadius: "14px",
                    border: isDragOver ? `1.5px dashed ${stage.color}80` : `1.5px dashed ${stage.color}40`,
                    background: isDragOver ? `${stage.color}08` : "transparent",
                    color: stage.textColor,
                    fontSize: "12px", fontWeight: 600,
                    cursor: "pointer",
                    transition: "all .2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = stage.bgColor)}
                onMouseLeave={e => (e.currentTarget.style.background = isDragOver ? `${stage.color}08` : "transparent")}
            >
                <Ic.Plus /> Add Lead
            </button>
        </div>
    );
};

/* ═══════════════════════════════════════
   LEAD DETAILS MODAL
═══════════════════════════════════════ */
const LeadDetailsModal = ({
    lead,
    stage,
    onClose,
    onEdit,
}: {
    lead: Lead;
    stage?: Stage;
    onClose: () => void;
    onEdit: () => void;
}) => {
    const dispatch = useAppDispatch();
    const leadGroupOptions = useLeadGroupOptions() || [];
    const countryOptions = useCountryOptions() || [];
    const [extraDetails, setExtraDetails] = useState<any>(lead.lead_details || null);

    useEffect(() => {
        const leadUuid = lead.lead_management_uuid || lead.id;
        if (leadUuid) {
            dispatch(getSingleLead(leadUuid))
                .unwrap()
                .then((res: any) => {
                    const d = res?.data || res?.message || res;
                    if (d && typeof d === "object") {
                        setExtraDetails(d);
                    }
                })
                .catch(() => {});
        }
    }, [lead.lead_management_uuid, lead.id, dispatch]);

    const details = extraDetails || lead.lead_details || {};
    const firstName = details.first_name || lead.name.split(" ")[0] || "";
    const lastName = details.last_name || lead.name.split(" ").slice(1).join(" ") || "";
    const fullName = `${firstName} ${lastName}`.trim() || lead.name || lead.phone;
    const phone = details.phone_number || lead.phone;
    const altPhone = details.alternate_phone_number || "";
    const email = details.email || lead.email;

    // Resolve lead group: Match against leadGroupOptions first using details or lead UUID
    const effectiveLgUuid = details.lead_group_uuid || lead.lead_group_uuid;
    const matchedLg = (leadGroupOptions || []).find((g: any) => g.value === effectiveLgUuid);
    const leadGroupName =
        matchedLg?.label ||
        details.lead_group_name ||
        details.lead_group?.name ||
        lead.lead_group_name ||
        "";

    const userName = lead.user_name || details.user_name || details.user?.fullname || details.user?.username || "";
    const campaignName = lead.campaign_name || details.campaign_name || "";
    const dispositionName = details.disposition_name || details.disposition?.[0]?.name || (lead.tags && lead.tags[0]) || stage?.title || details.status || "";

    const rawGender = String(details.gender ?? "").trim().toLowerCase();
    const gender = rawGender === "0" || rawGender === "male"
        ? "Male"
        : rawGender === "1" || rawGender === "female"
        ? "Female"
        : details.gender || "";

    const description = details.description || "";
    const address = details.address || "";
    const city = details.city || "";
    const stateName = details.state || "";
    const province = details.province || "";
    const postalCode = details.postal_code || "";
    const matchedCountry = (countryOptions || []).find((c: any) => c.value === details.country_uuid);
    const country = matchedCountry?.label || details.country || details.country_name || "";
    const dateStr = details.created_at || details.date || details.dob || lead.date;

    const pCfg = PRIORITY_CONFIG[lead.priority] || PRIORITY_CONFIG.Medium;

    return (
        <div
            style={{
                position: "fixed", inset: 0, zIndex: 9998,
                background: "rgba(15, 23, 42, 0.55)", backdropFilter: "blur(6px)",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "20px"
            }}
            onClick={onClose}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: "#ffffff", borderRadius: "24px",
                    width: "100%", maxWidth: "780px", maxHeight: "90vh",
                    boxShadow: "0 25px 70px rgba(15,23,42,0.22)",
                    display: "flex", flexDirection: "column",
                    overflow: "hidden", animation: "fadeUp .22s ease-out"
                }}
            >
                {/* Modal Header */}
                <div style={{
                    padding: "20px 24px", borderBottom: "1px solid #f1f5f9",
                    background: "linear-gradient(135deg, #fafbff, #ffffff)",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    gap: 16
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{
                            width: 48, height: 48, borderRadius: "50%",
                            background: `linear-gradient(135deg, ${lead.avatarColor || "#342df2"}, ${lead.avatarColor || "#342df2"}bb)`,
                            color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "16px", fontWeight: 800,
                            boxShadow: `0 6px 16px ${lead.avatarColor || "#342df2"}40`,
                            flexShrink: 0
                        }}>
                            {lead.initials || "LD"}
                        </div>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#1e1b4b", margin: 0 }}>
                                    {fullName}
                                </h2>
                                {stage && (
                                    <span style={{
                                        fontSize: "11px", fontWeight: 800, color: stage.textColor,
                                        background: stage.bgColor, padding: "2px 10px", borderRadius: "20px",
                                        border: `1px solid ${stage.color}40`, letterSpacing: "0.5px"
                                    }}>
                                        {stage.title}
                                    </span>
                                )}
                                <span style={{
                                    fontSize: "10px", fontWeight: 700, color: pCfg.text,
                                    background: pCfg.bg, border: `1px solid ${pCfg.border}`,
                                    borderRadius: "20px", padding: "2px 8px",
                                    display: "flex", alignItems: "center", gap: 4
                                }}>
                                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: pCfg.dot, display: "inline-block" }} />
                                    {lead.priority} Priority
                                </span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4, flexWrap: "wrap" }}>
                                <span style={{ fontSize: "12px", color: "#64748b", display: "flex", alignItems: "center", gap: 4 }}>
                                    <Ic.Phone /> {phone}
                                </span>
                                {dateStr && (
                                    <span style={{ fontSize: "11px", color: "#94a3b8", display: "flex", alignItems: "center", gap: 4 }}>
                                        <Ic.Calendar /> {dateStr}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action buttons in header */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <a
                            href={phone ? `tel:${phone}` : undefined}
                            title="Call Now"
                            style={{
                                display: "inline-flex", alignItems: "center", gap: 6,
                                padding: "8px 14px", borderRadius: "10px",
                                background: "#10b981", color: "#fff",
                                fontSize: "12px", fontWeight: 700, textDecoration: "none",
                                boxShadow: "0 4px 12px rgba(16,185,129,0.3)",
                                cursor: phone ? "pointer" : "not-allowed",
                                opacity: phone ? 1 : 0.6
                            }}
                        >
                            <Ic.PhoneCall /> Call
                        </a>
                        <button
                            onClick={onEdit}
                            title="Edit Lead"
                            style={{
                                display: "inline-flex", alignItems: "center", gap: 6,
                                padding: "8px 14px", borderRadius: "10px",
                                background: "rgba(52,45,242,0.08)", color: "#342df2",
                                border: "1px solid rgba(52,45,242,0.2)",
                                fontSize: "12px", fontWeight: 700, cursor: "pointer"
                            }}
                        >
                            <Ic.Edit /> Edit
                        </button>
                        <button
                            onClick={onClose}
                            style={{
                                width: 34, height: 34, borderRadius: "10px",
                                background: "#f1f5f9", border: "none",
                                color: "#64748b", cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "14px", fontWeight: 700
                            }}
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Modal Body - Scrollable content */}
                <div style={{
                    padding: "24px", overflowY: "auto", flex: 1,
                    display: "flex", flexDirection: "column", gap: "20px"
                }}>
                    {/* Summary Badges strip */}
                    <div style={{
                        display: "flex", flexWrap: "wrap", gap: 10,
                        padding: "12px 16px", borderRadius: "14px",
                        background: "#f8fafc", border: "1px solid #e2e8f0"
                    }}>
                        {leadGroupName && (
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span style={{ color: "#0284c7" }}><Ic.Folder /></span>
                                <span style={{ fontSize: "11px", fontWeight: 600, color: "#475569" }}>Lead Group:</span>
                                <span style={{
                                    fontSize: "11px", fontWeight: 700, color: "#0369a1",
                                    background: "rgba(2,132,199,0.1)", padding: "2px 8px", borderRadius: "6px"
                                }}>
                                    {leadGroupName}
                                </span>
                            </div>
                        )}
                        {userName && (
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span style={{ color: "#4f46e5" }}><Ic.User /></span>
                                <span style={{ fontSize: "11px", fontWeight: 600, color: "#475569" }}>Assigned User:</span>
                                <span style={{
                                    fontSize: "11px", fontWeight: 700, color: "#4338ca",
                                    background: "rgba(79,70,229,0.1)", padding: "2px 8px", borderRadius: "6px"
                                }}>
                                    {userName}
                                </span>
                            </div>
                        )}
                        {campaignName && (
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span style={{ color: "#7c3aed" }}><Ic.Megaphone /></span>
                                <span style={{ fontSize: "11px", fontWeight: 600, color: "#475569" }}>Campaign:</span>
                                <span style={{
                                    fontSize: "11px", fontWeight: 700, color: "#6d28d9",
                                    background: "rgba(124,58,237,0.1)", padding: "2px 8px", borderRadius: "6px"
                                }}>
                                    {campaignName}
                                </span>
                            </div>
                        )}
                        {dispositionName && (
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span style={{ color: "#10b981" }}><Ic.Target /></span>
                                <span style={{ fontSize: "11px", fontWeight: 600, color: "#475569" }}>Status / Disposition:</span>
                                <span style={{
                                    fontSize: "11px", fontWeight: 700, color: "#059669",
                                    background: "rgba(16,185,129,0.1)", padding: "2px 8px", borderRadius: "6px"
                                }}>
                                    {dispositionName}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Section 1: Contact Information */}
                    <div style={{
                        borderRadius: "16px", border: "1px solid #e2e8f0",
                        padding: "16px 20px", background: "#ffffff"
                    }}>
                        <h4 style={{ fontSize: "13px", fontWeight: 800, color: "#1e1b4b", margin: "0 0 14px 0", letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#342df2" }} />
                            Contact Information
                        </h4>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}>
                            <div>
                                <label style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8", display: "block" }}>First Name</label>
                                <span style={{ fontSize: "13px", fontWeight: 700, color: "#1e293b" }}>{firstName || "—"}</span>
                            </div>
                            <div>
                                <label style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8", display: "block" }}>Last Name</label>
                                <span style={{ fontSize: "13px", fontWeight: 700, color: "#1e293b" }}>{lastName || "—"}</span>
                            </div>
                            <div>
                                <label style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8", display: "block" }}>Phone Number</label>
                                <span style={{ fontSize: "13px", fontWeight: 700, color: "#1e293b" }}>{phone || "—"}</span>
                            </div>
                            <div>
                                <label style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8", display: "block" }}>Alternate Phone</label>
                                <span style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>{altPhone || "—"}</span>
                            </div>
                            <div>
                                <label style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8", display: "block" }}>Email</label>
                                <span style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>{email || "—"}</span>
                            </div>
                            <div>
                                <label style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8", display: "block" }}>Gender</label>
                                <span style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>{gender || "—"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Address & Location */}
                    <div style={{
                        borderRadius: "16px", border: "1px solid #e2e8f0",
                        padding: "16px 20px", background: "#ffffff"
                    }}>
                        <h4 style={{ fontSize: "13px", fontWeight: 800, color: "#1e1b4b", margin: "0 0 14px 0", letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }} />
                            Address & Location
                        </h4>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}>
                            <div style={{ gridColumn: "1 / -1" }}>
                                <label style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8", display: "block" }}>Address</label>
                                <span style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>{address || "—"}</span>
                            </div>
                            <div>
                                <label style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8", display: "block" }}>City</label>
                                <span style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>{city || "—"}</span>
                            </div>
                            <div>
                                <label style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8", display: "block" }}>State</label>
                                <span style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>{stateName || "—"}</span>
                            </div>
                            <div>
                                <label style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8", display: "block" }}>Province</label>
                                <span style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>{province || "—"}</span>
                            </div>
                            <div>
                                <label style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8", display: "block" }}>Postal Code</label>
                                <span style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>{postalCode || "—"}</span>
                            </div>
                            <div>
                                <label style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8", display: "block" }}>Country</label>
                                <span style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>{country || "—"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Description / Notes */}
                    <div style={{
                        borderRadius: "16px", border: "1px solid #e2e8f0",
                        padding: "16px 20px", background: "#ffffff"
                    }}>
                        <h4 style={{ fontSize: "13px", fontWeight: 800, color: "#1e1b4b", margin: "0 0 10px 0", letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b" }} />
                            Description & Notes
                        </h4>
                        <p style={{ fontSize: "13px", color: description ? "#334155" : "#94a3b8", margin: 0, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                            {description || "No description provided for this lead."}
                        </p>
                    </div>

                    {/* Section 4: Tags */}
                    {lead.tags && lead.tags.length > 0 && (
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                            <span style={{ fontSize: "12px", fontWeight: 600, color: "#64748b" }}>Tags:</span>
                            {lead.tags.map((t) => (
                                <span key={t} style={{
                                    fontSize: "10px", fontWeight: 700, textTransform: "uppercase",
                                    padding: "3px 8px", borderRadius: "6px",
                                    background: "rgba(52,45,242,0.08)", color: "#342df2"
                                }}>
                                    {t}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div style={{
                    padding: "16px 24px", borderTop: "1px solid #f1f5f9",
                    background: "#fafbff", display: "flex", alignItems: "center",
                    justifyContent: "flex-end", gap: 12
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: "9px 18px", borderRadius: "10px",
                            border: "1.5px solid #e2e8f0", background: "#ffffff",
                            color: "#64748b", fontSize: "13px", fontWeight: 600,
                            cursor: "pointer"
                        }}
                    >
                        Close
                    </button>
                    <button
                        onClick={onEdit}
                        style={{
                            padding: "9px 20px", borderRadius: "10px",
                            background: "linear-gradient(135deg, #342df2, #554df8)",
                            color: "#ffffff", fontSize: "13px", fontWeight: 700,
                            border: "none", cursor: "pointer",
                            boxShadow: "0 4px 12px rgba(52,45,242,0.25)",
                            display: "flex", alignItems: "center", gap: 6
                        }}
                    >
                        <Ic.Edit /> Edit Lead
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ═══════════════════════════════════════
   TOOLS DROPDOWN
═══════════════════════════════════════ */
const ToolsDropdown = () => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
        document.addEventListener("mousedown", h);
        return () => document.removeEventListener("mousedown", h);
    }, []);

    const items = [
        // { icon: <Ic.Share />, label: "Share Lead Form", color: "#342df2" },
        // { icon: <Ic.Download />, label: "Export Leads (Custom)", color: "#f59e0b" },
        // { icon: <Ic.Upload />, label: "Bulk Import Leads", color: "#10b981" },
        { icon: <Ic.Sheet />, label: "Google Sheets", color: "#16a34a" },
        // { icon: <Ic.Assign />, label: "Auto-Assign Settings", color: "#7c3aed" },
    ];

    return (
        <div ref={ref} style={{ position: "relative" }}>
            <button onClick={() => setOpen(!open)} style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "9px 18px", borderRadius: "12px",
                border: "1.5px solid #e5e7eb",
                background: "#fff",
                fontSize: "13px", fontWeight: 600, color: "#374151",
                cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                transition: "all .2s"
            }}>
                <Ic.Settings /> Tools
                <Ic.ChevronDown />
            </button>
            {open && (
                <div style={{
                    position: "absolute", right: 0, top: "calc(100% + 8px)",
                    width: 220, background: "#fff",
                    borderRadius: "18px",
                    boxShadow: "0 24px 64px rgba(52,45,242,0.14), 0 4px 16px rgba(0,0,0,0.06)",
                    border: "1px solid #f1f5f9",
                    padding: "8px",
                    zIndex: 999,
                    animation: "fadeSlideDown .18s ease-out"
                }}>
                    {items.map((item, i) => (
                        <button key={i} style={{
                            width: "100%", display: "flex", alignItems: "center", gap: 12,
                            padding: "10px 12px", borderRadius: "12px",
                            border: "none", background: "transparent",
                            fontSize: "13px", color: "#374151", cursor: "pointer",
                            fontWeight: 500, textAlign: "left",
                            transition: "background .15s"
                        }}
                            onMouseEnter={e => (e.currentTarget.style.background = `${item.color}08`)}
                            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        >
                            <span style={{ display: "flex", color: item.color }}>{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

/* ═══════════════════════════════════════
   STAT CARD
═══════════════════════════════════════ */
const StatCard = ({ icon, label, value, sub, gradient, iconBg }: {
    icon: React.ReactNode; label: string; value: string; sub: string;
    gradient: string; iconBg: string;
}) => (
    <div style={{
        background: "#fff", borderRadius: "20px",
        padding: "18px 20px",
        boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
        border: "1px solid #f1f5f9",
        position: "relative", overflow: "hidden",
        flex: "1 1 0", minWidth: 0
    }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: gradient }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: "12px", background: iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {icon}
            </div>
            <span style={{ fontSize: "10px", fontWeight: 600, color: "#10b981", background: "rgba(16,185,129,0.1)", borderRadius: "20px", padding: "2px 8px" }}>↑ Live</span>
        </div>
        <p style={{ fontSize: "24px", fontWeight: 800, color: "#1e1b4b", margin: 0, lineHeight: 1 }}>{value}</p>
        <p style={{ fontSize: "12px", color: "#64748b", fontWeight: 500, margin: "4px 0 0" }}>{label}</p>
        <p style={{ fontSize: "10px", color: "#94a3b8", margin: "2px 0 0" }}>{sub}</p>
    </div>
);

/* ═══════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════ */
const TenantPipelines = () => {
    // ── Redux ──
    const dispatch = useAppDispatch();
    const { user } = useAuth();
    const boardData  = usePipelineBoardData();
    const apiLoading = usePipelineLoading();
    const dispositionOptions = useTenantDispositionOptions() || [];
    const leadGroupOptions = useLeadGroupOptions() || [];
    const userOptions = useUserOptions() || [];
    const outboundOptions = useOutboundOptions() || [];
    const inboundOptions = useInboundOptions() || [];
    const blendedOptions = useBlendedOptions() || [];

    // Combine all campaign types: Outbound, Inbound, and Blended
    const campaignOptions = useMemo(() => {
        const map = new Map<string, any>();

        (outboundOptions || []).forEach((c: any) => {
            if (c.value) {
                map.set(c.value, {
                    value: c.value,
                    label: c.label ? `${c.label} (Outbound)` : c.label,
                    cleanName: c.label,
                    type: "Outbound"
                });
            }
        });

        (inboundOptions || []).forEach((c: any) => {
            if (c.value && !map.has(c.value)) {
                map.set(c.value, {
                    value: c.value,
                    label: c.label ? `${c.label} (Inbound)` : c.label,
                    cleanName: c.label,
                    type: "Inbound"
                });
            }
        });

        (blendedOptions || []).forEach((c: any) => {
            if (c.value && !map.has(c.value)) {
                map.set(c.value, {
                    value: c.value,
                    label: c.label ? `${c.label} (Blended)` : c.label,
                    cleanName: c.label,
                    type: "Blended"
                });
            }
        });

        return Array.from(map.values()).sort((a, b) => (a.cleanName || a.label || "").localeCompare(b.cleanName || b.label || ""));
    }, [outboundOptions, inboundOptions, blendedOptions]);


    // ── Map API board data → Stage[] format used by UI ──
    const stages: Stage[] = useMemo(() => {
        return (boardData ?? []).map((s: any) => ({
            id:        s.stage_uuid,
            title:     s.name?.toUpperCase() ?? "",
            color:     s.color ?? "#342df2",
            bgColor:   `${s.color ?? "#342df2"}10`,
            textColor: s.color ?? "#342df2",
            target:    5,
            leads: (s.leads ?? []).map((l: any) => {
                const effectiveLgUuid = l.lead_group_uuid || l.lead_details?.lead_group_uuid;
                const lgFromOptions = (leadGroupOptions || []).find(
                    (g: any) => g.value === effectiveLgUuid
                );
                const leadGroupName =
                    lgFromOptions?.label ||
                    l.lead_group_name ||
                    l.lead_details?.lead_group?.name ||
                    "";

                return {
                    id:           l.lead_uuid,
                    phone:        l.phone ?? "",
                    name:         l.name  ?? l.phone ?? "Unknown",
                    initials:     (l.name ?? l.phone ?? "?").substring(0, 2).toUpperCase(),
                    avatarColor:  s.color ?? "#342df2",
                    date:         new Date(l.createdAt ?? Date.now()).toLocaleString("en-IN"),
                    relativeTime: "",
                    email:        l.email ?? "",
                    priority:     l.priority ?? "Medium",
                    value:        l.value ? `₹${Number(l.value).toLocaleString("en-IN")}` : "₹0",
                    tags:         l.tags ?? [],
                    campaign_name: l.campaign_name || "",
                    campaign_uuid: l.campaign_uuid || "",
                    lead_group_name: leadGroupName,
                    lead_group_uuid: l.lead_group_uuid || l.lead_details?.lead_group_uuid || "",
                    user_name:     l.user_name || l.lead_details?.user?.fullname || l.lead_details?.user?.username || "",
                    user_uuid:     l.user_uuid || l.lead_details?.user_uuid || "",
                    lead_management_uuid: l.lead_management_uuid || l.lead_details?.lead_management_uuid || l.lead_details?.uuid || "",
                    lead_details:  l.lead_details || null,
                };
            }),
        }));
    }, [boardData, leadGroupOptions]);

    // ── Drag & Drop state ──
    const [draggingLead, setDraggingLead] = useState<{ leadId: string; sourceStageId: string } | null>(null);
    const [dragOverStageId, setDragOverStageId] = useState<string | null>(null);

    // ── UI state & Filters ──
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 350);
        return () => clearTimeout(timer);
    }, [search]);

    const [activeView, setActiveView] = useState<"grid" | "list" | "calendar">("grid");
    const [activeDateFilter, setActiveDateFilter] = useState<string | null>(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [dateRangeOpen, setDateRangeOpen] = useState(false);
    const dateRangeRef = useRef<HTMLDivElement>(null);

    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [userFilterOpen, setUserFilterOpen] = useState(false);
    const [userSearchQuery, setUserSearchQuery] = useState("");
    const userFilterRef = useRef<HTMLDivElement>(null);

    const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);

    const [moreFiltersOpen, setMoreFiltersOpen] = useState(false);
    const [selectedFilterLeadGroup, setSelectedFilterLeadGroup] = useState<string | null>(null);
    const [selectedFilterCampaign, setSelectedFilterCampaign] = useState<string | null>(null);
    const [filterLeadGroupOpen, setFilterLeadGroupOpen] = useState(false);
    const [filterLeadGroupSearch, setFilterLeadGroupSearch] = useState("");
    const [filterCampaignOpen, setFilterCampaignOpen] = useState(false);
    const [filterCampaignSearch, setFilterCampaignSearch] = useState("");
    const moreFiltersRef = useRef<HTMLDivElement>(null);

    const [showAddStage, setShowAddStage] = useState(false);
    const [newStageName, setNewStageName] = useState("");
    const [newStageColor, setNewStageColor] = useState(STAGE_COLORS[0]);

    const PALETTE_COLORS = [
        "#342df2", "#7c3aed", "#6366f1", "#3b82f6", "#06b6d4",
        "#10b981", "#22c55e", "#84cc16", "#f59e0b", "#f97316",
        "#ef4444", "#ec4899", "#f43f5e", "#8b5cf6", "#64748b",
    ];

    const [createLoading, setCreateLoading] = useState(false);

    // ── Edit Stage state ──
    const [editStageModal, setEditStageModal] = useState<Stage | null>(null);
    const [editStageName, setEditStageName] = useState("");
    const [editStageColor, setEditStageColor] = useState("");
    const [editStageLoading, setEditStageLoading] = useState(false);

    // ── Stage Filter state (Multi-Select) ──
    const [selectedStages, setSelectedStages] = useState<string[]>([]);
    const [stageFilterOpen, setStageFilterOpen] = useState(false);
    const stageFilterRef = useRef<HTMLDivElement>(null);

    const allStageIds = useMemo(() => {
        return stages.map(s => s.id).filter(Boolean);
    }, [stages]);

    const isNoneStagesSelected = selectedStages.length === 1 && selectedStages[0] === "__NONE__";
    const isAllStagesSelected = !isNoneStagesSelected && (
        selectedStages.length === 0 ||
        (allStageIds.length > 0 && allStageIds.every(id => selectedStages.includes(id)))
    );

    const isStageChecked = (stageId: string) => {
        if (isNoneStagesSelected) return false;
        if (isAllStagesSelected) return true;
        return selectedStages.includes(stageId);
    };

    const handleToggleStage = (stageId: string) => {
        if (isAllStagesSelected) {
            setSelectedStages(allStageIds.filter(id => id !== stageId));
        } else if (isNoneStagesSelected) {
            setSelectedStages([stageId]);
        } else {
            const next = selectedStages.includes(stageId)
                ? selectedStages.filter(id => id !== stageId)
                : [...selectedStages, stageId];
            if (next.length === 0) {
                setSelectedStages(["__NONE__"]);
            } else if (allStageIds.length > 0 && allStageIds.every(id => next.includes(id))) {
                setSelectedStages([]);
            } else {
                setSelectedStages(next);
            }
        }
    };

    const handleToggleAllStages = () => {
        if (isAllStagesSelected) {
            setSelectedStages(["__NONE__"]);
        } else {
            setSelectedStages([]);
        }
    };

    const allUserUuids = useMemo(() => {
        return (userOptions || []).map((u: any) => u.value || u.uuid).filter(Boolean);
    }, [userOptions]);

    const isNoneUsersSelected = selectedUsers.length === 1 && selectedUsers[0] === "__NONE__";
    const isAllUsersSelected = !isNoneUsersSelected && (
        selectedUsers.length === 0 ||
        (allUserUuids.length > 0 && allUserUuids.every(id => selectedUsers.includes(id)))
    );

    const isUserChecked = (userUuid: string) => {
        if (isNoneUsersSelected) return false;
        if (isAllUsersSelected) return true;
        return selectedUsers.includes(userUuid);
    };

    const handleToggleUser = (userUuid: string) => {
        if (isAllUsersSelected) {
            setSelectedUsers(allUserUuids.filter(id => id !== userUuid));
        } else if (isNoneUsersSelected) {
            setSelectedUsers([userUuid]);
        } else {
            const next = selectedUsers.includes(userUuid)
                ? selectedUsers.filter(id => id !== userUuid)
                : [...selectedUsers, userUuid];
            if (next.length === 0) {
                setSelectedUsers(["__NONE__"]);
            } else if (allUserUuids.length > 0 && allUserUuids.every(id => next.includes(id))) {
                setSelectedUsers([]);
            } else {
                setSelectedUsers(next);
            }
        }
    };

    const handleToggleAllUsers = () => {
        if (isAllUsersSelected) {
            setSelectedUsers(["__NONE__"]);
        } else {
            setSelectedUsers([]);
        }
    };

    const handleTogglePriority = (p: string) => {
        setSelectedPriorities(prev =>
            prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
        );
    };

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (stageFilterRef.current && !stageFilterRef.current.contains(e.target as Node)) {
                setStageFilterOpen(false);
            }
            if (dateRangeRef.current && !dateRangeRef.current.contains(e.target as Node)) {
                setDateRangeOpen(false);
            }
            if (userFilterRef.current && !userFilterRef.current.contains(e.target as Node)) {
                setUserFilterOpen(false);
            }
            if (moreFiltersRef.current && !moreFiltersRef.current.contains(e.target as Node)) {
                setMoreFiltersOpen(false);
                setFilterLeadGroupOpen(false);
                setFilterCampaignOpen(false);
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    const activeStageObj = useMemo(() => {
        if (selectedStages.length === 1) {
            return stages.find((st) => st.id === selectedStages[0]);
        }
        return null;
    }, [stages, selectedStages]);

    const activeUserObj = useMemo(() => {
        if (selectedUsers.length === 1) {
            return (userOptions || []).find((u: any) => u.value === selectedUsers[0]);
        }
        return null;
    }, [userOptions, selectedUsers]);

    const activeFilterLeadGroupObj = useMemo(() => {
        return (leadGroupOptions || []).find((g: any) => g.value === selectedFilterLeadGroup);
    }, [leadGroupOptions, selectedFilterLeadGroup]);

    const activeFilterCampaignObj = useMemo(() => {
        return (campaignOptions || []).find((c: any) => c.value === selectedFilterCampaign);
    }, [campaignOptions, selectedFilterCampaign]);

    const filteredFilterLeadGroups = useMemo(() => {
        if (!filterLeadGroupSearch.trim()) return leadGroupOptions || [];
        const q = filterLeadGroupSearch.toLowerCase();
        return (leadGroupOptions || []).filter((g: any) =>
            (g.label || "").toLowerCase().includes(q)
        );
    }, [leadGroupOptions, filterLeadGroupSearch]);

    const filteredFilterCampaigns = useMemo(() => {
        if (!filterCampaignSearch.trim()) return campaignOptions || [];
        const q = filterCampaignSearch.toLowerCase();
        return (campaignOptions || []).filter((c: any) =>
            (c.label || "").toLowerCase().includes(q)
        );
    }, [campaignOptions, filterCampaignSearch]);

    const filteredUserOptions = useMemo(() => {
        if (!userSearchQuery.trim()) return userOptions || [];
        const q = userSearchQuery.toLowerCase();
        return (userOptions || []).filter((u: any) =>
            (u.label || "").toLowerCase().includes(q)
        );
    }, [userOptions, userSearchQuery]);

    const moreFilterCount = (selectedFilterLeadGroup ? 1 : 0) + (selectedFilterCampaign ? 1 : 0);

    const hasAnyFilterActive = Boolean(
        search.trim() ||
        activeDateFilter ||
        startDate ||
        endDate ||
        !isAllStagesSelected ||
        !isAllUsersSelected ||
        selectedPriorities.length > 0 ||
        selectedFilterLeadGroup ||
        selectedFilterCampaign
    );

    const handleResetAllFilters = () => {
        setSearch("");
        setDebouncedSearch("");
        setActiveDateFilter(null);
        setStartDate("");
        setEndDate("");
        setSelectedStages([]);
        setSelectedUsers([]);
        setSelectedPriorities([]);
        setSelectedFilterLeadGroup(null);
        setSelectedFilterCampaign(null);
        setFilterLeadGroupOpen(false);
        setFilterCampaignOpen(false);
        setFilterLeadGroupSearch("");
        setFilterCampaignSearch("");
    };

    const visibleStages = useMemo(() => {
        if (isAllStagesSelected) return stages;
        if (isNoneStagesSelected) return [];
        return stages.filter((st) => selectedStages.includes(st.id));
    }, [stages, isAllStagesSelected, isNoneStagesSelected, selectedStages]);

    // ── Bulk Selection & Delete State ──
    const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
    const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
    const [bulkDeleting, setBulkDeleting] = useState(false);

    const allVisibleLeadIds = useMemo(() => {
        return visibleStages.flatMap(s => s.leads.map(l => l.id));
    }, [visibleStages]);

    const isAllLeadsSelected = allVisibleLeadIds.length > 0 && allVisibleLeadIds.every(id => selectedLeadIds.includes(id));
    const isAnyLeadSelected = selectedLeadIds.length > 0;

    const toggleSelectAllLeads = () => {
        if (isAllLeadsSelected) {
            setSelectedLeadIds([]);
        } else {
            setSelectedLeadIds(allVisibleLeadIds);
        }
    };

    const toggleSelectStageLeads = (stageId: string) => {
        const stage = visibleStages.find(s => s.id === stageId);
        if (!stage) return;
        const stageLeadIds = stage.leads.map(l => l.id);
        const allInStageSelected = stageLeadIds.length > 0 && stageLeadIds.every(id => selectedLeadIds.includes(id));

        if (allInStageSelected) {
            setSelectedLeadIds(prev => prev.filter(id => !stageLeadIds.includes(id)));
        } else {
            setSelectedLeadIds(prev => Array.from(new Set([...prev, ...stageLeadIds])));
        }
    };

    const toggleSelectLead = (leadId: string) => {
        setSelectedLeadIds(prev =>
            prev.includes(leadId) ? prev.filter(id => id !== leadId) : [...prev, leadId]
        );
    };

    const handleConfirmBulkDelete = async () => {
        if (selectedLeadIds.length === 0) return;
        setBulkDeleting(true);
        try {
            const res: any = await dispatch(pipelineLeadBulkDelete(selectedLeadIds));
            if (res?.payload?.statusCode >= 400 || res?.error) {
                Danger(res?.payload?.message || "Failed to delete selected leads");
            } else {
                Success(res?.payload?.message || `Successfully deleted ${selectedLeadIds.length} lead(s)`);
                setSelectedLeadIds([]);
                setShowBulkDeleteModal(false);
                refreshBoard();
            }
        } catch {
            Danger("Failed to delete selected leads");
        } finally {
            setBulkDeleting(false);
        }
    };

    // ── Batch Update Leads Modal state ──
    const [showBulkUpdateModal, setShowBulkUpdateModal] = useState(false);
    const [bulkUpdating, setBulkUpdating] = useState(false);
    const [bulkUpdateCampaignUuid, setBulkUpdateCampaignUuid] = useState("");
    const [bulkUpdateLeadGroupUuid, setBulkUpdateLeadGroupUuid] = useState("");
    const [bulkUpdateUserUuid, setBulkUpdateUserUuid] = useState("");
    const [bulkUpdateStageUuid, setBulkUpdateStageUuid] = useState("");

    const handleConfirmBulkUpdate = async () => {
        if (selectedLeadIds.length === 0) return;

        if (!bulkUpdateCampaignUuid && !bulkUpdateLeadGroupUuid && !bulkUpdateUserUuid && !bulkUpdateStageUuid) {
            Danger("Please select at least one field to update");
            return;
        }

        setBulkUpdating(true);
        try {
            const payload: any = {
                lead_uuids: selectedLeadIds,
            };

            if (bulkUpdateCampaignUuid) {
                payload.campaign_uuid = bulkUpdateCampaignUuid;
                const camp = (campaignOptions || []).find((c: any) => c.value === bulkUpdateCampaignUuid);
                if (camp?.cleanName || camp?.label) payload.campaign_name = camp.cleanName || camp.label;
            }

            if (bulkUpdateLeadGroupUuid) {
                payload.lead_group_uuid = bulkUpdateLeadGroupUuid;
                const lg = (leadGroupOptions || []).find((g: any) => g.value === bulkUpdateLeadGroupUuid);
                if (lg?.label) payload.lead_group_name = lg.label;
            }

            if (bulkUpdateUserUuid) {
                payload.user_uuid = bulkUpdateUserUuid;
                const u = (userOptions || []).find((usr: any) => usr.value === bulkUpdateUserUuid);
                if (u?.label) payload.user_name = u.label;
            }

            if (bulkUpdateStageUuid) {
                payload.stage_uuid = bulkUpdateStageUuid;
            }

            const res: any = await dispatch(pipelineLeadBulkUpdate(payload));
            if (res?.payload?.statusCode >= 400 || res?.error) {
                Danger(res?.payload?.message || "Failed to update selected leads");
            } else {
                Success(res?.payload?.message || `Successfully updated ${selectedLeadIds.length} lead(s)`);
                setSelectedLeadIds([]);
                setShowBulkUpdateModal(false);
                setBulkUpdateCampaignUuid("");
                setBulkUpdateLeadGroupUuid("");
                setBulkUpdateUserUuid("");
                setBulkUpdateStageUuid("");
                refreshBoard();
            }
        } catch {
            Danger("Failed to update selected leads");
        } finally {
            setBulkUpdating(false);
        }
    };


    // ── Delete Stage confirmation modal state ──
    const [deleteStageTarget, setDeleteStageTarget] = useState<Stage | null>(null);
    const [deleteStageLoading, setDeleteStageLoading] = useState(false);

    // ── Lead Add/Edit/Details modal state ──
    const [showAddLeadModal, setShowAddLeadModal] = useState<{ stageId: string; stageTitle: string } | null>(null);
    const [editLeadModal, setEditLeadModal] = useState<{ lead: Lead; stageId: string } | null>(null);
    const [selectedLeadDetails, setSelectedLeadDetails] = useState<{ lead: Lead; stage?: Stage } | null>(null);

    // ── Delete Lead confirmation modal state ──
    const [deleteLeadTarget, setDeleteLeadTarget] = useState<Lead | null>(null);
    const [deleteLeadLoading, setDeleteLeadLoading] = useState(false);

    // ── Import Leads from Dispositions & Lead Group state ──
    const [showImportModal, setShowImportModal] = useState(false);
    const [selectedLeadGroup, setSelectedLeadGroup] = useState("");
    const [selectedDispositions, setSelectedDispositions] = useState<string[]>([]);
    const [dispSearch, setDispSearch] = useState("");
    const [importLoading, setImportLoading] = useState(false);
    const [autoImportEnabled, setAutoImportEnabled] = useState(false);
    const [autoImportSaving, setAutoImportSaving] = useState(false);

    // ── Auto-Assign Round-Robin state ──
    const savedConfig       = useAssignmentConfig();
    const [showAssignDrawer, setShowAssignDrawer] = useState(false);
    const [assignEnabled, setAssignEnabled]       = useState(false);
    const [assignUsers, setAssignUsers]           = useState<{ user_uuid: string; user_name: string; checked: boolean; frequency: number }[]>([]);
    const [assignSaving, setAssignSaving]         = useState(false);
    const [assignDistributing, setAssignDistributing] = useState(false);

    // ── Tenant UUID from Auth (supports tenant admin, manager, or direct uuid) ──
    const tenantUuid =
        user?.tenant_detail?.uuid ||
        user?.tenant_uuid ||
        user?.manager_detail?.tenant_uuid ||
        user?.data?.tenant_detail?.uuid ||
        user?.uuid;

    // ── Computed ──
    const totalLeads  = stages.reduce((s, st) => s + st.leads.length, 0);
    const totalValue  = stages.reduce((s, st) => s + st.leads.reduce((a, l) => a + parseInt(l.value.replace(/[^\d]/g, ""), 10), 0), 0);
    const highPriority = stages.reduce((s, st) => s + st.leads.filter(l => l.priority === "High").length, 0);

    // ── Initial static options load (runs only once on mount or tenant change) ──
    useEffect(() => {
        if (tenantUuid) {
            dispatch(tenantDispositionOptionsGet());
            dispatch(leadGroupOptionsGet(undefined));
            dispatch(userOptionsGet());
            dispatch(outboundOptionsGet());
            dispatch(inboundOptionsGet());
            dispatch(blendedOptionsGet());
            // Fetch saved assignment config
            dispatch(pipelineAssignmentConfigGet(tenantUuid));
        }
    }, [tenantUuid, dispatch]);

    // ── Sync active users into auto-assign drawer state ──
    useEffect(() => {
        if (!showAssignDrawer) return;
        const userOptions_ = userOptions || [];
        setAssignUsers(
            userOptions_
                .filter((u: any) => String(u.status) !== "1" && u.status !== "inactive")
                .map((u: any) => {
                    const saved = (savedConfig?.users || []).find((su: any) => su.user_uuid === (u.value || u.uuid));
                    return {
                        user_uuid: u.value || u.uuid || "",
                        user_name: u.label || u.fullname || u.username || "",
                        checked:   !!saved,
                        frequency: saved?.frequency ?? 1,
                    };
                })
        );
    }, [showAssignDrawer, userOptions, savedConfig]);

    // ── Fetch board view with all active backend filters (only board API is called on filter change) ──
    useEffect(() => {
        if (tenantUuid) {
            dispatch(pipelineBoardGet({
                tenant_uuid: tenantUuid,
                search: debouncedSearch.trim() || undefined,
                priority: selectedPriorities.length > 0 ? selectedPriorities.join(",") : undefined,
                stage_uuid: isNoneStagesSelected
                    ? "__NONE__"
                    : isAllStagesSelected
                    ? undefined
                    : selectedStages.join(","),
                user_uuid: isNoneUsersSelected
                    ? "__NONE__"
                    : isAllUsersSelected
                    ? undefined
                    : selectedUsers.join(","),
                date_filter: activeDateFilter || undefined,
                start_date: startDate || undefined,
                end_date: endDate || undefined,
                lead_group_uuid: selectedFilterLeadGroup || undefined,
                campaign_uuid: selectedFilterCampaign || undefined,
            }));
        }
    }, [
        tenantUuid,
        debouncedSearch,
        selectedPriorities,
        selectedStages,
        selectedUsers,
        isAllStagesSelected,
        isNoneStagesSelected,
        isAllUsersSelected,
        isNoneUsersSelected,
        activeDateFilter,
        startDate,
        endDate,
        selectedFilterLeadGroup,
        selectedFilterCampaign,
        dispatch,
    ]);

    const refreshBoard = () => {
        if (!tenantUuid) return;
        dispatch(pipelineBoardGet({
            tenant_uuid: tenantUuid,
            search: debouncedSearch.trim() || undefined,
            priority: selectedPriorities.length > 0 ? selectedPriorities.join(",") : undefined,
            stage_uuid: isNoneStagesSelected
                ? "__NONE__"
                : isAllStagesSelected
                ? undefined
                : selectedStages.join(","),
            user_uuid: isNoneUsersSelected
                ? "__NONE__"
                : isAllUsersSelected
                ? undefined
                : selectedUsers.join(","),
            date_filter: activeDateFilter || undefined,
            start_date: startDate || undefined,
            end_date: endDate || undefined,
            lead_group_uuid: selectedFilterLeadGroup || undefined,
            campaign_uuid: selectedFilterCampaign || undefined,
        }));
    };

    // Fetch options again if modal opens and sync auto-import preferences
    useEffect(() => {
        if (showImportModal) {
            dispatch(tenantDispositionOptionsGet());
            dispatch(leadGroupOptionsGet(undefined));
            setAutoImportEnabled(!!savedConfig?.auto_import);
            if (savedConfig?.auto_import_dispositions && savedConfig.auto_import_dispositions.length > 0) {
                setSelectedDispositions(prev => prev.length === 0 ? savedConfig.auto_import_dispositions : prev);
            }
        }
    }, [showImportModal, dispatch, savedConfig]);

    // Filtered dispositions by search
    const filteredDispositions = useMemo(() => {
        if (!dispSearch.trim()) return dispositionOptions;
        const q = dispSearch.toLowerCase();
        return dispositionOptions.filter((d: any) =>
            (d.label || "").toLowerCase().includes(q)
        );
    }, [dispositionOptions, dispSearch]);

    const handleToggleDisposition = (dispUuid: string) => {
        setSelectedDispositions(prev =>
            prev.includes(dispUuid)
                ? prev.filter(id => id !== dispUuid)
                : [...prev, dispUuid]
        );
    };

    const handleSelectAllDispositions = () => {
        const allUuids = filteredDispositions.map((d: any) => d.value).filter(Boolean);
        setSelectedDispositions(prev => Array.from(new Set([...prev, ...allUuids])));
    };

    const handleDeselectAllDispositions = () => {
        setSelectedDispositions([]);
    };
    const handleClearAllDispositions = handleDeselectAllDispositions;

    const handleSaveAutoImportOnly = async () => {
        if (!tenantUuid) {
            Danger("Tenant information missing. Please re-login.");
            return;
        }
        if (autoImportEnabled && selectedDispositions.length === 0) {
            Danger("Please select at least one disposition for auto-import");
            return;
        }

        setAutoImportSaving(true);
        try {
            await dispatch(pipelineAssignmentConfigSave({
                tenant_uuid: tenantUuid,
                auto_import: autoImportEnabled,
                auto_import_dispositions: autoImportEnabled ? selectedDispositions : [],
            })).unwrap();

            Success(autoImportEnabled ? "Auto-import enabled for selected dispositions!" : "Auto-import settings saved");
            setShowImportModal(false);
        } catch (err: any) {
            Danger(err?.message || "Failed to save auto-import settings");
        } finally {
            setAutoImportSaving(false);
        }
    };

    const handleConfirmImport = async () => {
        if (!tenantUuid) {
            Danger("Tenant information missing. Please re-login.");
            return;
        }
        if (selectedDispositions.length === 0) {
            Danger("Please select at least one disposition");
            return;
        }

        setImportLoading(true);
        try {
            const payload: any = {
                tenant_uuid: tenantUuid,
                disposition_uuids: selectedDispositions,
            };
            if (selectedLeadGroup) {
                payload.lead_group_uuid = selectedLeadGroup;
            }

            const res: any = await dispatch(pipelineLeadsImport(payload)).unwrap();

            // Persist auto-import setting alongside the import
            try {
                await dispatch(pipelineAssignmentConfigSave({
                    tenant_uuid: tenantUuid,
                    auto_import: autoImportEnabled,
                    auto_import_dispositions: autoImportEnabled ? selectedDispositions : [],
                })).unwrap();
            } catch (cfgErr) {
                console.error("Failed to save auto-import preference:", cfgErr);
            }

            Success(res?.message || "Leads imported successfully!");
            setShowImportModal(false);
            setSelectedDispositions([]);
            setSelectedLeadGroup("");
            setDispSearch("");
            // Refresh kanban board
            refreshBoard();
        } catch (err: any) {
            Danger(err?.message || "Failed to import leads");
        } finally {
            setImportLoading(false);
        }
    };
    const handleImportLeads = handleConfirmImport;

    // ── Handlers ──
    const handleOpenEditStage = (stage: Stage) => {
        setEditStageModal(stage);
        setEditStageName(stage.title);
        setEditStageColor(stage.color);
    };

    const handleUpdateStage = async () => {
        if (!editStageModal) return;
        if (!editStageName.trim()) {
            Danger("Please enter stage name");
            return;
        }
        setEditStageLoading(true);
        try {
            await dispatch(pipelineStageUpdate({
                uuid: editStageModal.id,
                name: editStageName.trim(),
                color: editStageColor,
                tenant_uuid: tenantUuid,
            })).unwrap();
            Success("Stage updated successfully");
            setEditStageModal(null);
            if (tenantUuid) {
                dispatch(pipelineBoardGet({ tenant_uuid: tenantUuid }));
            }
        } catch (err: any) {
            Danger(err?.message || "Failed to update stage");
        } finally {
            setEditStageLoading(false);
        }
    };

    const handleOpenDeleteStage = (stage: Stage) => {
        setDeleteStageTarget(stage);
    };

    const handleConfirmDeleteStage = async () => {
        if (!deleteStageTarget) return;
        setDeleteStageLoading(true);
        try {
            await dispatch(pipelineStageDelete(deleteStageTarget.id)).unwrap();
            Success("Stage deleted successfully");
            setDeleteStageTarget(null);
            if (tenantUuid) {
                dispatch(pipelineBoardGet({ tenant_uuid: tenantUuid }));
            }
        } catch (err: any) {
            Danger(err?.message || "Failed to delete stage");
        } finally {
            setDeleteStageLoading(false);
        }
    };

    const handleAddStage = async () => {
        if (!newStageName.trim()) {
            Danger("Please enter stage name");
            return;
        }
        if (!tenantUuid) {
            Danger("Tenant information not found. Please re-login.");
            return;
        }
        setCreateLoading(true);
        try {
            await dispatch(pipelineStageCreate({
                name:        newStageName.trim(),
                color:       newStageColor,
                tenant_uuid: tenantUuid,
                status:      "0",
            })).unwrap();
            Success("Stage created successfully");
            setNewStageName("");
            setNewStageColor(STAGE_COLORS[0]);
            setShowAddStage(false);
            dispatch(pipelineBoardGet({ tenant_uuid: tenantUuid }));
        } catch (err: any) {
            Danger(err?.message || "Failed to create stage");
        } finally {
            setCreateLoading(false);
        }
    };

    const handleOpenAddLead = (stageId: string, stageTitle?: string) => {
        const stage = stages.find(s => s.id === stageId);
        setShowAddLeadModal({
            stageId,
            stageTitle: stageTitle || stage?.title || "",
        });
    };

    const handleLeadCreatedSuccess = async (createdPayload: any, apiRes?: any) => {
        const stageId = showAddLeadModal?.stageId;
        const stageTitle = showAddLeadModal?.stageTitle;
        const leadMgmtUuid = apiRes?.data?.lead_management_uuid ||
                             apiRes?.message?.lead_management_uuid ||
                             apiRes?.lead_uuid || "";
        const leadName = `${createdPayload?.first_name || ""} ${createdPayload?.last_name || ""}`.trim() || createdPayload?.phone_number;

        const lg = leadGroupOptions.find((o: any) => o.value === createdPayload?.lead_group_uuid);
        const leadGroupName = lg?.label || "";

        const camp = (campaignOptions || []).find((o: any) => o.value === createdPayload?.campaign_uuid);
        const campaignName = camp?.cleanName || camp?.label || createdPayload?.campaign_name || undefined;

        if (stageId && tenantUuid) {
            try {
                await dispatch(pipelineLeadCreate({
                    stage_uuid: stageId,
                    tenant_uuid: tenantUuid,
                    phone: createdPayload?.phone_number,
                    name: leadName,
                    email: createdPayload?.email || undefined,
                    priority: createdPayload?.priority || "Medium",
                    value: "0",
                    tags: stageTitle ? [stageTitle] : ["inbound"],
                    lead_management_uuid: leadMgmtUuid,
                    lead_group_uuid: createdPayload?.lead_group_uuid || undefined,
                    lead_group_name: leadGroupName || undefined,
                    campaign_uuid: createdPayload?.campaign_uuid || undefined,
                    campaign_name: campaignName || undefined,
                    user_uuid: createdPayload?.user_uuid || undefined,
                })).unwrap();
            } catch (err: any) {
                console.warn("Pipeline lead creation error:", err);
            }
        }

        setShowAddLeadModal(null);
        refreshBoard();
    };

    const handleOpenEditLead = (lead: Lead, stageId: string) => {
        setEditLeadModal({ lead, stageId });
    };

    const handleOpenLeadDetails = (lead: Lead, stage?: Stage) => {
        setSelectedLeadDetails({ lead, stage });
    };

    const handleLeadUpdatedSuccess = async (updatedPayload: any, apiRes?: any) => {
        const leadToEdit = editLeadModal?.lead;
        const leadName = `${updatedPayload?.first_name || ""} ${updatedPayload?.last_name || ""}`.trim() || updatedPayload?.phone_number || leadToEdit?.name;

        const lg = leadGroupOptions.find((o: any) => o.value === updatedPayload?.lead_group_uuid);
        const leadGroupName = lg?.label || leadToEdit?.lead_group_name;

        const camp = (campaignOptions || []).find((o: any) => o.value === updatedPayload?.campaign_uuid);
        const campaignName = camp?.cleanName || camp?.label || updatedPayload?.campaign_name || leadToEdit?.campaign_name;

        if (leadToEdit && tenantUuid) {
            try {
                await dispatch(pipelineLeadUpdate({
                    uuid: leadToEdit.id,
                    tenant_uuid: tenantUuid,
                    phone: updatedPayload?.phone_number || leadToEdit.phone,
                    name: leadName,
                    email: updatedPayload?.email || "",
                    priority: updatedPayload?.priority || leadToEdit.priority || "Medium",
                    campaign_name: campaignName || undefined,
                    campaign_uuid: updatedPayload?.campaign_uuid || leadToEdit?.campaign_uuid || undefined,
                    lead_group_uuid: updatedPayload?.lead_group_uuid || leadToEdit.lead_group_uuid || undefined,
                    lead_group_name: leadGroupName || undefined,
                    user_uuid: updatedPayload?.user_uuid || leadToEdit.user_uuid || undefined,
                })).unwrap();
            } catch (err: any) {
                console.warn("Pipeline lead update error:", err);
            }
        }

        setEditLeadModal(null);
        if (selectedLeadDetails) {
            setSelectedLeadDetails(null);
        }

        refreshBoard();
    };

    const handleOpenDeleteLead = (lead: Lead) => {
        setDeleteLeadTarget(lead);
    };

    const handleConfirmDeleteLead = async () => {
        if (!deleteLeadTarget) return;
        setDeleteLeadLoading(true);
        try {
            await dispatch(pipelineLeadDelete(deleteLeadTarget.id)).unwrap();
            Success("Lead deleted successfully");
            setDeleteLeadTarget(null);
            refreshBoard();
        } catch (err: any) {
            Danger(err?.message || "Failed to delete lead");
        } finally {
            setDeleteLeadLoading(false);
        }
    };

    // ── Drag & Drop handlers ──
    const handleLeadDragStart = (e: React.DragEvent, leadId: string, sourceStageId: string) => {
        e.dataTransfer.setData("text/plain", JSON.stringify({ leadId, sourceStageId }));
        e.dataTransfer.effectAllowed = "move";
        setDraggingLead({ leadId, sourceStageId });
    };

    const handleColumnDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleColumnDragEnter = (stageId: string) => {
        setDragOverStageId(stageId);
    };

    const handleColumnDragLeave = () => {
        // slight delay so sub-element drag-leave doesn't flicker
        setTimeout(() => setDragOverStageId(null), 60);
    };

    const handleColumnDrop = async (e: React.DragEvent, targetStageId: string) => {
        e.preventDefault();
        setDragOverStageId(null);

        let leadId: string | null = null;
        let sourceStageId: string | null = null;
        try {
            const parsed = JSON.parse(e.dataTransfer.getData("text/plain"));
            leadId = parsed.leadId;
            sourceStageId = parsed.sourceStageId;
        } catch {
            leadId = draggingLead?.leadId ?? null;
            sourceStageId = draggingLead?.sourceStageId ?? null;
        }
        setDraggingLead(null);

        if (!leadId || !sourceStageId) return;
        if (sourceStageId === targetStageId) return; // same column — no-op

        const targetStage = stages.find((s) => s.id === targetStageId);
        if (!targetStage) return;

        // Move lead: pipelineSlice optimistically moves card in Redux & backend syncs status
        try {
            await dispatch(pipelineLeadMove({ uuid: leadId, stage_uuid: targetStageId })).unwrap();
        } catch (err: any) {
            Danger(err?.message || "Failed to move lead");
            refreshBoard();
        }
    };


    return (
        <div style={{ minHeight: "100vh", background: "#f4f7fe", fontFamily: "'Noto Sans', sans-serif" }}>
            <style>{`
                @keyframes fadeSlideDown {
                    from { opacity:0; transform:translateY(-8px) }
                    to   { opacity:1; transform:translateY(0) }
                }
                @keyframes fadeUp {
                    from { opacity:0; transform:translateY(12px) }
                    to   { opacity:1; transform:translateY(0) }
                }
                @keyframes pulseBar {
                    from { opacity: 0.4; transform: scaleX(0.95) }
                    to   { opacity: 1;   transform: scaleX(1) }
                }
                .pipeline-scroll::-webkit-scrollbar { height: 6px }
                .pipeline-scroll::-webkit-scrollbar-track { background: transparent }
                .pipeline-scroll::-webkit-scrollbar-thumb { background: #342df230; border-radius: 99px }
            `}</style>

            {/* ──────────── TOP BAR ──────────── */}
            <div style={{
                background: "#fff",
                borderBottom: "1px solid #f1f5f9",
                padding: "14px 28px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                position: "sticky", top: 0, zIndex: 50,
                boxShadow: "0 1px 12px rgba(52,45,242,0.06)"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    {/* view toggle */}
                    {/* <div style={{ display: "flex", background: "#f4f7fe", borderRadius: "12px", padding: 4, gap: 2 }}>
                        {(["grid","list","calendar"] as const).map((v) => (
                            <button key={v} onClick={() => setActiveView(v)} style={{
                                padding: "7px 10px", borderRadius: "8px", border: "none", cursor: "pointer",
                                background: activeView === v ? "#fff" : "transparent",
                                color: activeView === v ? "#342df2" : "#94a3b8",
                                boxShadow: activeView === v ? "0 1px 6px rgba(52,45,242,0.1)" : "none",
                                transition: "all .2s", display: "flex"
                            }}>
                                {v === "grid" ? <Ic.Grid /> : v === "list" ? <Ic.List /> : <Ic.Calendar />}
                            </button>
                        ))}
                    </div> */}
                    {/* total leads badge */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", letterSpacing: "1px", textTransform: "uppercase" }}>Total Leads</span>
                        <span style={{
                            fontSize: "13px", fontWeight: 800, color: "#fff",
                            background: "linear-gradient(135deg,#342df2,#7c3aed)",
                            borderRadius: "20px", padding: "2px 12px",
                            boxShadow: "0 4px 12px rgba(52,45,242,0.3)"
                        }}>{totalLeads}</span>
                    </div>

                    {/* Select All Leads across all stages toggle */}
                    {totalLeads > 0 && (
                        <button
                            type="button"
                            id="toggle-select-all-leads-btn"
                            onClick={toggleSelectAllLeads}
                            style={{
                                display: "flex", alignItems: "center", gap: 8,
                                padding: "6px 12px", borderRadius: "10px",
                                border: isAllLeadsSelected ? "1.5px solid #342df2" : "1.5px solid #e2e8f0",
                                background: isAllLeadsSelected
                                    ? "linear-gradient(135deg,rgba(52,45,242,0.1),rgba(124,58,237,0.06))"
                                    : "#f8fafc",
                                color: isAllLeadsSelected ? "#342df2" : "#64748b",
                                fontSize: "12px", fontWeight: 700, cursor: "pointer",
                                transition: "all .15s"
                            }}
                            title={isAllLeadsSelected ? "Deselect all leads across all stages" : "Select all leads across all stages"}
                        >
                            <input
                                type="checkbox"
                                checked={isAllLeadsSelected}
                                ref={el => {
                                    if (el) el.indeterminate = isAnyLeadSelected && !isAllLeadsSelected;
                                }}
                                onChange={() => {}}
                                style={{ width: 14, height: 14, accentColor: "#342df2", cursor: "pointer" }}
                            />
                            <span>{isAllLeadsSelected ? "All Leads Selected" : "Select All Leads"}</span>
                        </button>
                    )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <ToolsDropdown />
                    {/* ─ Auto-Assign Button ─ */}
                    <button
                        id="auto-assign-config-btn"
                        onClick={() => {
                            // Sync latest saved config into local state when opening drawer
                            setAssignEnabled(savedConfig?.enabled ?? false);
                            if (!userOptions || userOptions.length === 0) {
                                dispatch(userOptionsGet());
                            }
                            const userOptions_ = userOptions || [];
                            setAssignUsers(
                                userOptions_
                                    .filter((u: any) => String(u.status) !== "1" && u.status !== "inactive")
                                    .map((u: any) => {
                                        const saved = (savedConfig?.users || []).find((su: any) => su.user_uuid === (u.value || u.uuid));
                                        return {
                                            user_uuid: u.value || u.uuid || "",
                                            user_name: u.label || u.fullname || u.username || "",
                                            checked:   !!saved,
                                            frequency: saved?.frequency ?? 1,
                                        };
                                    })
                            );
                            setShowAssignDrawer(true);
                        }}
                        style={{
                            display: "flex", alignItems: "center", gap: 8,
                            padding: "10px 18px", borderRadius: "12px",
                            background: savedConfig?.enabled
                                ? "linear-gradient(135deg,#10b981,#059669)"
                                : "linear-gradient(135deg,#64748b,#475569)",
                            color: "#fff", fontSize: "13px", fontWeight: 700,
                            border: "none", cursor: "pointer",
                            boxShadow: savedConfig?.enabled
                                ? "0 6px 20px rgba(16,185,129,0.35)"
                                : "0 6px 20px rgba(100,116,139,0.35)",
                            transition: "all .2s",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")}
                        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                        title={savedConfig?.enabled ? "Auto-Assign: ON" : "Auto-Assign: OFF"}
                    >
                        {/* gear icon inline */}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="3"/>
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                        </svg>
                        Auto-Assign {savedConfig?.enabled ? "(ON)" : "(OFF)"}
                    </button>
                    <button
                        onClick={() => setShowImportModal(true)}
                        style={{
                            display: "flex", alignItems: "center", gap: 8,
                            padding: "10px 22px", borderRadius: "12px",
                            background: "linear-gradient(135deg,#342df2,#7c3aed)",
                            color: "#fff", fontSize: "13px", fontWeight: 700,
                            border: "none", cursor: "pointer",
                            boxShadow: "0 6px 20px rgba(52,45,242,0.35)",
                            transition: "all .2s"
                        }}
                        onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 8px 28px rgba(52,45,242,0.5)")}
                        onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 6px 20px rgba(52,45,242,0.35)")}
                    >
                        <Ic.Plus /> Import Leads
                    </button>
                </div>
            </div>

            {/* ──────────── STAT CARDS ──────────── */}
            {/* <div style={{ padding: "10px 0", display: "flex", gap: 16, animation: "fadeUp .4s ease-out" }}>
                <StatCard icon={<Ic.User />} label="Total Leads" value={String(totalLeads)} sub="Across all stages"
                    gradient="linear-gradient(90deg,#342df2,#7c3aed)" iconBg="rgba(52,45,242,0.08)" />
                <StatCard icon={<Ic.Money />} label="Total Pipeline Value" value={`₹${totalValue.toLocaleString("en-IN")}`} sub="Combined deal value"
                    gradient="linear-gradient(90deg,#10b981,#059669)" iconBg="rgba(16,185,129,0.08)" />
                <StatCard icon={<Ic.Target />} label="High Priority" value={String(highPriority)} sub="Needs attention"
                    gradient="linear-gradient(90deg,#ef4444,#f87171)" iconBg="rgba(239,68,68,0.08)" />
                <StatCard icon={<Ic.TrendUp />} label="Active Stages" value={String(stages.length)} sub="Pipeline stages"
                    gradient="linear-gradient(90deg,#f59e0b,#f97316)" iconBg="rgba(245,158,11,0.08)" />
            </div> */}

            {/* ──────────── FILTERS BAR ──────────── */}
            <div style={{
                margin: "5px 0",
                background: "#fff", borderRadius: "18px",
                padding: "14px 18px",
                display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10,
                boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
                border: "1px solid #f1f5f9"
            }}>
                {/* filters label & active reset */}
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <button
                        title="Pipeline Filters"
                        style={{
                            display: "flex", alignItems: "center", gap: 6,
                            fontSize: "12px", fontWeight: 800, color: "#342df2",
                            background: "rgba(52,45,242,0.06)", border: "none",
                            borderRadius: "10px", padding: "7px 12px",
                            cursor: "default", letterSpacing: "0.5px"
                        }}
                    >
                        <Ic.Filter />
                    </button>
                    {hasAnyFilterActive && (
                        <button
                            onClick={handleResetAllFilters}
                            title="Clear all active filters"
                            style={{
                                display: "flex", alignItems: "center", gap: 4,
                                fontSize: "11px", fontWeight: 700, color: "#ef4444",
                                background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                                borderRadius: "10px", padding: "6px 10px", cursor: "pointer",
                                transition: "all .15s"
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.18)")}
                            onMouseLeave={e => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
                        >
                            ✕ Reset All
                        </button>
                    )}
                </div>

                {/* search */}
                <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: "#f8faff", border: "1.5px solid #e8edf8",
                    borderRadius: "12px", padding: "7px 12px", width: 220,
                    transition: "all .2s"
                }}>
                    <span style={{ color: "#94a3b8" }}><Ic.Search /></span>
                    <input
                        type="text"
                        placeholder="Search name, phone, etc..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ background: "transparent", border: "none", outline: "none", fontSize: "12px", color: "#374151", width: "100%" }}
                    />
                    {search && (
                        <span
                            onClick={() => setSearch("")}
                            title="Clear search"
                            style={{ cursor: "pointer", fontSize: "11px", color: "#94a3b8", fontWeight: 700 }}
                        >
                            ✕
                        </span>
                    )}
                </div>

                {/* date quick filters */}
                {["Today","Yesterday"].map(d => (
                    <button
                        key={d}
                        onClick={() => {
                            if (activeDateFilter === d) {
                                setActiveDateFilter(null);
                            } else {
                                setActiveDateFilter(d);
                                setStartDate("");
                                setEndDate("");
                            }
                        }}
                        style={{
                            padding: "7px 14px", borderRadius: "10px", fontSize: "12px", fontWeight: 600, cursor: "pointer",
                            border: `1.5px solid ${activeDateFilter === d ? "#342df2" : "#e5e7eb"}`,
                            background: activeDateFilter === d ? "linear-gradient(135deg,#342df2,#7c3aed)" : "#fff",
                            color: activeDateFilter === d ? "#fff" : "#64748b",
                            boxShadow: activeDateFilter === d ? "0 4px 12px rgba(52,45,242,0.25)" : "none",
                            transition: "all .2s"
                        }}
                    >
                        {d}
                    </button>
                ))}

                {/* Date Range Popover */}
                <div ref={dateRangeRef} style={{ position: "relative" }}>
                    <button
                        type="button"
                        onClick={() => setDateRangeOpen(prev => !prev)}
                        style={{
                            display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: "10px",
                            fontSize: "12px", fontWeight: (startDate || endDate) ? 700 : 500,
                            border: `1.5px solid ${(startDate || endDate) ? "#342df2" : (dateRangeOpen ? "#342df2" : "#e5e7eb")}`,
                            background: (startDate || endDate) ? "rgba(52,45,242,0.08)" : (dateRangeOpen ? "rgba(52,45,242,0.04)" : "#fff"),
                            color: (startDate || endDate) ? "#342df2" : "#64748b",
                            cursor: "pointer", transition: "all .2s"
                        }}
                    >
                        <Ic.Calendar />
                        {startDate || endDate ? (
                            <>
                                <span>{startDate || "Start"} → {endDate || "End"}</span>
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setStartDate("");
                                        setEndDate("");
                                        setDateRangeOpen(false);
                                    }}
                                    title="Reset Date Range"
                                    style={{
                                        marginLeft: 4, display: "inline-flex", alignItems: "center", justifyContent: "center",
                                        width: 16, height: 16, borderRadius: "50%", background: "rgba(0,0,0,0.08)",
                                        fontSize: "10px", color: "#475569", cursor: "pointer"
                                    }}
                                >
                                    ✕
                                </span>
                            </>
                        ) : (
                            <span>Date Range</span>
                        )}
                    </button>

                    {dateRangeOpen && (
                        <div style={{
                            position: "absolute", top: "calc(100% + 6px)", left: 0,
                            background: "#fff", borderRadius: "14px", padding: "14px",
                            boxShadow: "0 12px 36px rgba(0,0,0,0.14)", border: "1.5px solid #eef2f6",
                            minWidth: "260px", zIndex: 100, animation: "fadeUp .15s ease-out"
                        }}>
                            <p style={{ fontSize: "12px", fontWeight: 700, color: "#1e1b4b", margin: "0 0 10px 0" }}>Filter By Date Range</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                <div>
                                    <label style={{ fontSize: "11px", fontWeight: 600, color: "#64748b", display: "block", marginBottom: 4 }}>From</label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={e => {
                                            setStartDate(e.target.value);
                                            setActiveDateFilter(null);
                                        }}
                                        style={{
                                            width: "100%", padding: "7px 10px", borderRadius: "8px",
                                            border: "1.5px solid #e2e8f0", fontSize: "12px", color: "#334155",
                                            boxSizing: "border-box", outline: "none"
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: "11px", fontWeight: 600, color: "#64748b", display: "block", marginBottom: 4 }}>To</label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={e => {
                                            setEndDate(e.target.value);
                                            setActiveDateFilter(null);
                                        }}
                                        style={{
                                            width: "100%", padding: "7px 10px", borderRadius: "8px",
                                            border: "1.5px solid #e2e8f0", fontSize: "12px", color: "#334155",
                                            boxSizing: "border-box", outline: "none"
                                        }}
                                    />
                                </div>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, marginTop: 4 }}>
                                    <button
                                        onClick={() => {
                                            setStartDate("");
                                            setEndDate("");
                                            setDateRangeOpen(false);
                                        }}
                                        style={{
                                            padding: "6px 12px", borderRadius: "8px", border: "1px solid #e2e8f0",
                                            background: "#f8fafc", color: "#64748b", fontSize: "11px", fontWeight: 600, cursor: "pointer"
                                        }}
                                    >
                                        Clear
                                    </button>
                                    <button
                                        onClick={() => setDateRangeOpen(false)}
                                        style={{
                                            padding: "6px 14px", borderRadius: "8px", border: "none",
                                            background: "#342df2", color: "#fff", fontSize: "11px", fontWeight: 700, cursor: "pointer"
                                        }}
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* All Stages Dropdown Filter */}
                <div ref={stageFilterRef} style={{ position: "relative" }}>
                    <button
                        type="button"
                        onClick={() => setStageFilterOpen(prev => !prev)}
                        style={{
                            display: "flex", alignItems: "center", gap: 8, padding: "7px 14px", borderRadius: "10px",
                            fontSize: "12px", fontWeight: !isAllStagesSelected ? 700 : 500,
                            border: `1.5px solid ${!isAllStagesSelected ? (activeStageObj?.color || "#342df2") : (stageFilterOpen ? "#342df2" : "#e5e7eb")}`,
                            background: !isAllStagesSelected ? `${activeStageObj?.color || "#342df2"}12` : (stageFilterOpen ? "rgba(52,45,242,0.04)" : "#fff"),
                            color: !isAllStagesSelected ? (activeStageObj?.color || "#342df2") : (stageFilterOpen ? "#342df2" : "#64748b"),
                            cursor: "pointer",
                            transition: "all .2s",
                            boxShadow: !isAllStagesSelected ? `0 2px 8px ${activeStageObj?.color || "#342df2"}25` : "none"
                        }}
                    >
                        {isAllStagesSelected ? (
                            <>
                                <span>All Stages</span>
                                <span style={{ transform: stageFilterOpen ? "rotate(180deg)" : "none", transition: "transform .2s", display: "flex" }}>
                                    <Ic.ChevronDown />
                                </span>
                            </>
                        ) : isNoneStagesSelected ? (
                            <>
                                <span style={{
                                    width: 18, height: 18, borderRadius: "50%", background: "#ef4444", color: "#fff",
                                    display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 800
                                }}>
                                    0
                                </span>
                                <span>Stages</span>
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedStages([]);
                                    }}
                                    title="Reset to All Stages"
                                    style={{
                                        marginLeft: 2, display: "inline-flex", alignItems: "center", justifyContent: "center",
                                        width: 16, height: 16, borderRadius: "50%", background: "rgba(0,0,0,0.08)",
                                        fontSize: "10px", color: "#475569", cursor: "pointer"
                                    }}
                                >
                                    ✕
                                </span>
                            </>
                        ) : selectedStages.length === 1 && activeStageObj ? (
                            <>
                                <span style={{ width: 8, height: 8, borderRadius: "50%", background: activeStageObj.color, display: "inline-block" }} />
                                <span>{activeStageObj.title}</span>
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedStages([]);
                                    }}
                                    title="Reset to All Stages"
                                    style={{
                                        marginLeft: 2, display: "inline-flex", alignItems: "center", justifyContent: "center",
                                        width: 16, height: 16, borderRadius: "50%", background: "rgba(0,0,0,0.08)",
                                        fontSize: "10px", color: "#475569", cursor: "pointer"
                                    }}
                                >
                                    ✕
                                </span>
                            </>
                        ) : (
                            <>
                                <span style={{
                                    width: 18, height: 18, borderRadius: "50%", background: "#342df2", color: "#fff",
                                    display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 800
                                }}>
                                    {selectedStages.length}
                                </span>
                                <span>Stages</span>
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedStages([]);
                                    }}
                                    title="Clear Stages Filter"
                                    style={{
                                        marginLeft: 2, display: "inline-flex", alignItems: "center", justifyContent: "center",
                                        width: 16, height: 16, borderRadius: "50%", background: "rgba(0,0,0,0.08)",
                                        fontSize: "10px", color: "#475569", cursor: "pointer"
                                    }}
                                >
                                    ✕
                                </span>
                            </>
                        )}
                    </button>

                    {stageFilterOpen && (
                        <div style={{
                            position: "absolute", top: "calc(100% + 6px)", left: 0,
                            background: "#fff", borderRadius: "14px", padding: "8px",
                            boxShadow: "0 12px 36px rgba(0,0,0,0.14)", border: "1.5px solid #eef2f6",
                            minWidth: "240px", zIndex: 100, animation: "fadeUp .15s ease-out"
                        }}>
                            {/* Header Info */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 8px 8px", borderBottom: "1px solid #f1f5f9", marginBottom: 4 }}>
                                <span style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                    Filter Stages
                                </span>
                                {!isNoneStagesSelected ? (
                                    <button
                                        type="button"
                                        onClick={() => setSelectedStages(["__NONE__"])}
                                        style={{ border: "none", background: "none", color: "#ef4444", fontSize: "10px", fontWeight: 700, cursor: "pointer", padding: 0 }}
                                    >
                                        Clear All
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setSelectedStages([])}
                                        style={{ border: "none", background: "none", color: "#342df2", fontSize: "10px", fontWeight: 700, cursor: "pointer", padding: 0 }}
                                    >
                                        Select All
                                    </button>
                                )}
                            </div>

                            {/* Option: All Stages */}
                            <div
                                onClick={handleToggleAllStages}
                                style={{
                                    display: "flex", alignItems: "center", justifyContent: "space-between",
                                    padding: "8px 10px", borderRadius: "8px", cursor: "pointer",
                                    background: isAllStagesSelected ? "rgba(52,45,242,0.08)" : "transparent",
                                    color: isAllStagesSelected ? "#342df2" : "#334155",
                                    fontWeight: isAllStagesSelected ? 700 : 500, fontSize: "12px",
                                    transition: "all .15s"
                                }}
                                onMouseEnter={e => { if (!isAllStagesSelected) e.currentTarget.style.background = "#f8fafc"; }}
                                onMouseLeave={e => { if (!isAllStagesSelected) e.currentTarget.style.background = "transparent"; }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <div style={{
                                        width: 16, height: 16, borderRadius: "4px",
                                        border: `1.5px solid ${isAllStagesSelected ? "#342df2" : "#cbd5e1"}`,
                                        background: isAllStagesSelected ? "#342df2" : "#fff",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        color: "#fff", fontSize: "10px", transition: "all .15s"
                                    }}>
                                        {isAllStagesSelected && <Ic.Check />}
                                    </div>
                                    <span>All Stages</span>
                                </div>
                                <span style={{
                                    fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "10px",
                                    background: isAllStagesSelected ? "rgba(52,45,242,0.15)" : "#f1f5f9",
                                    color: isAllStagesSelected ? "#342df2" : "#64748b"
                                }}>
                                    {totalLeads}
                                </span>
                            </div>

                            <div style={{ height: "1px", background: "#f1f5f9", margin: "4px 0" }} />

                            {/* List of Stages */}
                            <div style={{ maxHeight: "240px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
                                {stages.length === 0 ? (
                                    <div style={{ padding: "10px 12px", fontSize: "12px", color: "#94a3b8", textAlign: "center" }}>
                                        No stages available
                                    </div>
                                ) : (
                                    stages.map((st) => {
                                        const isSelected = isStageChecked(st.id);
                                        return (
                                            <div
                                                key={st.id}
                                                onClick={() => handleToggleStage(st.id)}
                                                style={{
                                                    display: "flex", alignItems: "center", justifyContent: "space-between",
                                                    padding: "8px 10px", borderRadius: "8px", cursor: "pointer",
                                                    background: isSelected ? `${st.color}15` : "transparent",
                                                    color: isSelected ? st.textColor : "#334155",
                                                    fontWeight: isSelected ? 700 : 500, fontSize: "12px",
                                                    transition: "all .15s"
                                                }}
                                                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "#f8fafc"; }}
                                                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
                                            >
                                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                    <div style={{
                                                        width: 16, height: 16, borderRadius: "4px",
                                                        border: `1.5px solid ${isSelected ? st.color : "#cbd5e1"}`,
                                                        background: isSelected ? st.color : "#fff",
                                                        display: "flex", alignItems: "center", justifyContent: "center",
                                                        color: "#fff", fontSize: "10px", transition: "all .15s"
                                                    }}>
                                                        {isSelected && <Ic.Check />}
                                                    </div>
                                                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: st.color, display: "inline-block", flexShrink: 0 }} />
                                                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "130px" }}>
                                                        {st.title}
                                                    </span>
                                                </div>
                                                <span style={{
                                                    fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "10px",
                                                    background: isSelected ? `${st.color}25` : "#f1f5f9",
                                                    color: isSelected ? st.textColor : "#64748b"
                                                }}>
                                                    {st.leads.length}
                                                </span>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* All Assignees Dropdown (Multi-Select) */}
                <div ref={userFilterRef} style={{ position: "relative" }}>
                    <button
                        type="button"
                        onClick={() => setUserFilterOpen(prev => !prev)}
                        style={{
                            display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: "10px",
                            fontSize: "12px", fontWeight: !isAllUsersSelected ? 700 : 500,
                            border: `1.5px solid ${!isAllUsersSelected ? "#342df2" : (userFilterOpen ? "#342df2" : "#e5e7eb")}`,
                            background: !isAllUsersSelected ? "rgba(52,45,242,0.08)" : (userFilterOpen ? "rgba(52,45,242,0.04)" : "#fff"),
                            color: !isAllUsersSelected ? "#342df2" : "#64748b",
                            cursor: "pointer", transition: "all .2s"
                        }}
                    >
                        <Ic.User />
                        {isAllUsersSelected ? (
                            <>
                                <span>All Assignees</span>
                                <span style={{ transform: userFilterOpen ? "rotate(180deg)" : "none", transition: "transform .2s", display: "flex" }}>
                                    <Ic.ChevronDown />
                                </span>
                            </>
                        ) : isNoneUsersSelected ? (
                            <>
                                <span style={{
                                    width: 18, height: 18, borderRadius: "50%", background: "#ef4444", color: "#fff",
                                    display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 800
                                }}>
                                    0
                                </span>
                                <span>Assignees</span>
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedUsers([]);
                                    }}
                                    title="Reset Assignees"
                                    style={{
                                        marginLeft: 2, display: "inline-flex", alignItems: "center", justifyContent: "center",
                                        width: 16, height: 16, borderRadius: "50%", background: "rgba(0,0,0,0.08)",
                                        fontSize: "10px", color: "#475569", cursor: "pointer"
                                    }}
                                >
                                    ✕
                                </span>
                            </>
                        ) : selectedUsers.length === 1 && activeUserObj ? (
                            <>
                                <span style={{ maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {activeUserObj.label}
                                </span>
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedUsers([]);
                                    }}
                                    title="Reset Assignees"
                                    style={{
                                        marginLeft: 2, display: "inline-flex", alignItems: "center", justifyContent: "center",
                                        width: 16, height: 16, borderRadius: "50%", background: "rgba(0,0,0,0.08)",
                                        fontSize: "10px", color: "#475569", cursor: "pointer"
                                    }}
                                >
                                    ✕
                                </span>
                            </>
                        ) : (
                            <>
                                <span style={{
                                    width: 18, height: 18, borderRadius: "50%", background: "#342df2", color: "#fff",
                                    display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 800
                                }}>
                                    {selectedUsers.length}
                                </span>
                                <span>Assignees</span>
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedUsers([]);
                                    }}
                                    title="Reset Assignees"
                                    style={{
                                        marginLeft: 2, display: "inline-flex", alignItems: "center", justifyContent: "center",
                                        width: 16, height: 16, borderRadius: "50%", background: "rgba(0,0,0,0.08)",
                                        fontSize: "10px", color: "#475569", cursor: "pointer"
                                    }}
                                >
                                    ✕
                                </span>
                            </>
                        )}
                    </button>

                    {userFilterOpen && (
                        <div style={{
                            position: "absolute", top: "calc(100% + 6px)", left: 0,
                            background: "#fff", borderRadius: "14px", padding: "8px",
                            boxShadow: "0 12px 36px rgba(0,0,0,0.14)", border: "1.5px solid #eef2f6",
                            minWidth: "250px", zIndex: 100, animation: "fadeUp .15s ease-out"
                        }}>
                            {/* Search */}
                            <div style={{ marginBottom: 6 }}>
                                <input
                                    type="text"
                                    placeholder="Search assignee..."
                                    value={userSearchQuery}
                                    onChange={e => setUserSearchQuery(e.target.value)}
                                    style={{
                                        width: "100%", padding: "6px 10px", borderRadius: "8px",
                                        border: "1.5px solid #e2e8f0", fontSize: "11px", color: "#334155",
                                        boxSizing: "border-box", outline: "none"
                                    }}
                                />
                            </div>

                            {/* Header info */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "2px 6px 6px", borderBottom: "1px solid #f1f5f9", marginBottom: 4 }}>
                                <span style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                    Select Assignees
                                </span>
                                {!isNoneUsersSelected ? (
                                    <button
                                        type="button"
                                        onClick={() => setSelectedUsers(["__NONE__"])}
                                        style={{ border: "none", background: "none", color: "#ef4444", fontSize: "10px", fontWeight: 700, cursor: "pointer", padding: 0 }}
                                    >
                                        Clear All
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setSelectedUsers([])}
                                        style={{ border: "none", background: "none", color: "#342df2", fontSize: "10px", fontWeight: 700, cursor: "pointer", padding: 0 }}
                                    >
                                        Select All
                                    </button>
                                )}
                            </div>

                            {/* Option: All Assignees */}
                            <div
                                onClick={handleToggleAllUsers}
                                style={{
                                    display: "flex", alignItems: "center", gap: 8,
                                    padding: "7px 10px", borderRadius: "8px", cursor: "pointer",
                                    background: isAllUsersSelected ? "rgba(52,45,242,0.08)" : "transparent",
                                    color: isAllUsersSelected ? "#342df2" : "#334155",
                                    fontWeight: isAllUsersSelected ? 700 : 500, fontSize: "12px",
                                    transition: "all .15s"
                                }}
                                onMouseEnter={e => { if (!isAllUsersSelected) e.currentTarget.style.background = "#f8fafc"; }}
                                onMouseLeave={e => { if (!isAllUsersSelected) e.currentTarget.style.background = "transparent"; }}
                            >
                                <div style={{
                                    width: 16, height: 16, borderRadius: "4px",
                                    border: `1.5px solid ${isAllUsersSelected ? "#342df2" : "#cbd5e1"}`,
                                    background: isAllUsersSelected ? "#342df2" : "#fff",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    color: "#fff", fontSize: "10px", transition: "all .15s"
                                }}>
                                    {isAllUsersSelected && <Ic.Check />}
                                </div>
                                <span>All Assignees</span>
                            </div>

                            <div style={{ height: "1px", background: "#f1f5f9", margin: "4px 0" }} />

                            {/* List of Users */}
                            <div style={{ maxHeight: "200px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
                                {filteredUserOptions.length === 0 ? (
                                    <div style={{ padding: "10px", fontSize: "11px", color: "#94a3b8", textAlign: "center" }}>
                                        No users found
                                    </div>
                                ) : (
                                    filteredUserOptions.map((u: any) => {
                                        const isSelected = isUserChecked(u.value);
                                        return (
                                            <div
                                                key={u.value}
                                                onClick={() => handleToggleUser(u.value)}
                                                style={{
                                                    display: "flex", alignItems: "center", justifyContent: "space-between",
                                                    padding: "7px 10px", borderRadius: "8px", cursor: "pointer",
                                                    background: isSelected ? "rgba(52,45,242,0.08)" : "transparent",
                                                    color: isSelected ? "#342df2" : "#334155",
                                                    fontWeight: isSelected ? 700 : 500, fontSize: "12px",
                                                    transition: "all .15s"
                                                }}
                                                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "#f8fafc"; }}
                                                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
                                            >
                                                <div style={{ display: "flex", alignItems: "center", gap: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                    <div style={{
                                                        width: 16, height: 16, borderRadius: "4px",
                                                        border: `1.5px solid ${isSelected ? "#342df2" : "#cbd5e1"}`,
                                                        background: isSelected ? "#342df2" : "#fff",
                                                        display: "flex", alignItems: "center", justifyContent: "center",
                                                        color: "#fff", fontSize: "10px", transition: "all .15s",
                                                        flexShrink: 0
                                                    }}>
                                                        {isSelected && <Ic.Check />}
                                                    </div>
                                                    <span style={{
                                                        width: 22, height: 22, borderRadius: "50%",
                                                        background: isSelected ? "#342df2" : "#e2e8f0",
                                                        color: isSelected ? "#fff" : "#64748b",
                                                        display: "flex", alignItems: "center", justifyContent: "center",
                                                        fontSize: "10px", fontWeight: 700, flexShrink: 0
                                                    }}>
                                                        {(u.label || "?").substring(0, 1).toUpperCase()}
                                                    </span>
                                                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                        {u.label}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* priority multiselect pills */}
                <div style={{ display: "flex", gap: 6 }}>
                    {(["High","Medium","Low"] as const).map(p => {
                        const c = PRIORITY_CONFIG[p];
                        const active = selectedPriorities.includes(p);
                        return (
                            <button
                                key={p}
                                type="button"
                                onClick={() => handleTogglePriority(p)}
                                style={{
                                    padding: "6px 14px", borderRadius: "10px", fontSize: "11px", fontWeight: 700, cursor: "pointer",
                                    border: `1.5px solid ${active ? c.dot : "#e5e7eb"}`,
                                    background: active ? c.bg : "#fff",
                                    color: active ? c.text : "#64748b",
                                    transition: "all .2s",
                                    display: "inline-flex", alignItems: "center", gap: 5,
                                    boxShadow: active ? `0 2px 8px ${c.dot}30` : "none"
                                }}
                            >
                                <span style={{ width: 6, height: 6, borderRadius: "50%", background: active ? c.dot : "#cbd5e1" }} />
                                {p}
                            </button>
                        );
                    })}
                </div>

                {/* More Filters Popover */}
                <div ref={moreFiltersRef} style={{ position: "relative" }}>
                    <button
                        type="button"
                        onClick={() => setMoreFiltersOpen(prev => !prev)}
                        style={{
                            display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: "10px",
                            fontSize: "12px", fontWeight: 700,
                            border: `1.5px solid ${moreFilterCount > 0 ? "#f59e0b" : "rgba(245,158,11,0.3)"}`,
                            background: moreFilterCount > 0 ? "rgba(245,158,11,0.15)" : "rgba(245,158,11,0.06)",
                            color: "#d97706", cursor: "pointer", transition: "all .2s"
                        }}
                    >
                        <Ic.Bolt /> 
                        More
                        {moreFilterCount > 0 && (
                            <span style={{
                                background: "#d97706", color: "#fff", borderRadius: "50%",
                                width: 16, height: 16, display: "inline-flex", alignItems: "center",
                                justifyContent: "center", fontSize: "10px", fontWeight: 800, marginLeft: 2
                            }}>
                                {moreFilterCount}
                            </span>
                        )}
                    </button>

                    {moreFiltersOpen && (
                        <div style={{
                            position: "absolute", top: "calc(100% + 8px)", right: 0,
                            background: "#ffffff", borderRadius: "20px", padding: "18px 20px",
                            boxShadow: "0 24px 60px rgba(15,23,42,0.16), 0 4px 16px rgba(52,45,242,0.06)",
                            border: "1.5px solid #eef2f6",
                            width: "350px", zIndex: 110,
                            animation: "fadeUp .18s ease-out"
                        }}>
                            {/* Header */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <div style={{
                                        width: 34, height: 34, borderRadius: "10px",
                                        background: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(249,115,22,0.15))",
                                        color: "#d97706", display: "flex", alignItems: "center", justifyContent: "center"
                                    }}>
                                        <Ic.Bolt />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: "14px", fontWeight: 800, color: "#1e1b4b", margin: 0, lineHeight: 1.2 }}>
                                            More Filters
                                        </p>
                                        <p style={{ fontSize: "11px", color: "#94a3b8", margin: "2px 0 0", fontWeight: 500 }}>
                                            Filter by Lead Group & Campaign
                                        </p>
                                    </div>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    {moreFilterCount > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedFilterLeadGroup(null);
                                                setSelectedFilterCampaign(null);
                                                setFilterLeadGroupOpen(false);
                                                setFilterCampaignOpen(false);
                                            }}
                                            style={{
                                                background: "rgba(239,68,68,0.08)", border: "none", color: "#ef4444",
                                                fontSize: "11px", fontWeight: 700, cursor: "pointer",
                                                padding: "4px 8px", borderRadius: "8px", transition: "all .15s"
                                            }}
                                            onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.16)")}
                                            onMouseLeave={e => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
                                        >
                                            Reset
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMoreFiltersOpen(false);
                                            setFilterLeadGroupOpen(false);
                                            setFilterCampaignOpen(false);
                                        }}
                                        style={{
                                            width: 28, height: 28, borderRadius: "8px", background: "#f8fafc",
                                            border: "none", cursor: "pointer", fontSize: "12px", color: "#94a3b8",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            transition: "all .15s"
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.background = "#f1f5f9")}
                                        onMouseLeave={e => (e.currentTarget.style.background = "#f8fafc")}
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>

                            {/* Lead Group Custom Selector */}
                            <div style={{ marginBottom: 14, position: "relative" }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                                    <label style={{ fontSize: "11px", fontWeight: 700, color: "#475569", display: "flex", alignItems: "center", gap: 6 }}>
                                        <span style={{ color: "#342df2", display: "flex" }}><Ic.Folder /></span>
                                        Lead Group
                                    </label>
                                    {selectedFilterLeadGroup && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedFilterLeadGroup(null);
                                            }}
                                            style={{
                                                border: "none", background: "none", color: "#ef4444",
                                                fontSize: "10px", fontWeight: 700, cursor: "pointer", padding: 0
                                            }}
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>

                                {/* Trigger Button */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFilterLeadGroupOpen(prev => !prev);
                                        setFilterCampaignOpen(false);
                                    }}
                                    style={{
                                        width: "100%", height: "42px", padding: "0 12px",
                                        borderRadius: "12px",
                                        border: `1.5px solid ${selectedFilterLeadGroup ? "#342df2" : (filterLeadGroupOpen ? "#342df2" : "#e2e8f0")}`,
                                        background: selectedFilterLeadGroup ? "rgba(52,45,242,0.05)" : (filterLeadGroupOpen ? "rgba(52,45,242,0.02)" : "#fff"),
                                        display: "flex", alignItems: "center", justifyContent: "space-between",
                                        cursor: "pointer", transition: "all .18s",
                                        boxShadow: filterLeadGroupOpen ? "0 0 0 3px rgba(52,45,242,0.12)" : "none"
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        <span style={{
                                            width: 22, height: 22, borderRadius: "6px",
                                            background: selectedFilterLeadGroup ? "#342df2" : "#f1f5f9",
                                            color: selectedFilterLeadGroup ? "#fff" : "#94a3b8",
                                            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                                        }}>
                                            <Ic.Folder />
                                        </span>
                                        <span style={{
                                            fontSize: "12px",
                                            fontWeight: selectedFilterLeadGroup ? 700 : 500,
                                            color: selectedFilterLeadGroup ? "#1e1b4b" : "#64748b",
                                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                                        }}>
                                            {activeFilterLeadGroupObj?.label || "All Lead Groups"}
                                        </span>
                                    </div>

                                    <span style={{
                                        transform: filterLeadGroupOpen ? "rotate(180deg)" : "none",
                                        transition: "transform .2s", color: "#94a3b8", display: "flex"
                                    }}>
                                        <Ic.ChevronDown />
                                    </span>
                                </button>

                                {/* Custom Dropdown Menu */}
                                {filterLeadGroupOpen && (
                                    <div style={{
                                        marginTop: 6,
                                        background: "#ffffff", borderRadius: "14px", padding: "8px",
                                        boxShadow: "0 12px 30px rgba(0,0,0,0.14)", border: "1.5px solid #eef2f6",
                                        animation: "fadeUp .15s ease-out"
                                    }}>
                                        {/* Search */}
                                        <div style={{
                                            display: "flex", alignItems: "center", gap: 6,
                                            padding: "6px 10px", borderRadius: "8px",
                                            background: "#f8fafc", border: "1px solid #e2e8f0",
                                            marginBottom: 6
                                        }}>
                                            <span style={{ color: "#94a3b8", display: "flex" }}><Ic.Search /></span>
                                            <input
                                                type="text"
                                                placeholder="Search lead groups..."
                                                value={filterLeadGroupSearch}
                                                onChange={e => setFilterLeadGroupSearch(e.target.value)}
                                                style={{
                                                    width: "100%", border: "none", outline: "none",
                                                    background: "transparent", fontSize: "11px", color: "#1e293b"
                                                }}
                                            />
                                            {filterLeadGroupSearch && (
                                                <span
                                                    onClick={() => setFilterLeadGroupSearch("")}
                                                    style={{ cursor: "pointer", fontSize: "10px", color: "#94a3b8" }}
                                                >
                                                    ✕
                                                </span>
                                            )}
                                        </div>

                                        {/* All Option */}
                                        <div
                                            onClick={() => {
                                                setSelectedFilterLeadGroup(null);
                                                setFilterLeadGroupOpen(false);
                                            }}
                                            style={{
                                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                                padding: "8px 10px", borderRadius: "8px", cursor: "pointer",
                                                background: !selectedFilterLeadGroup ? "rgba(52,45,242,0.08)" : "transparent",
                                                color: !selectedFilterLeadGroup ? "#342df2" : "#334155",
                                                fontWeight: !selectedFilterLeadGroup ? 700 : 500, fontSize: "12px",
                                                transition: "all .15s"
                                            }}
                                            onMouseEnter={e => { if (selectedFilterLeadGroup) e.currentTarget.style.background = "#f8fafc"; }}
                                            onMouseLeave={e => { if (selectedFilterLeadGroup) e.currentTarget.style.background = "transparent"; }}
                                        >
                                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#94a3b8" }} />
                                                <span>All Lead Groups</span>
                                            </div>
                                            {!selectedFilterLeadGroup && <span style={{ color: "#342df2", display: "flex" }}><Ic.Check /></span>}
                                        </div>

                                        <div style={{ height: 1, background: "#f1f5f9", margin: "4px 0" }} />

                                        {/* Options List */}
                                        <div style={{ maxHeight: 160, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
                                            {filteredFilterLeadGroups.length === 0 ? (
                                                <div style={{ padding: "12px 10px", textAlign: "center", color: "#94a3b8", fontSize: "11px" }}>
                                                    No lead groups found
                                                </div>
                                            ) : (
                                                filteredFilterLeadGroups.map((g: any) => {
                                                    const isSelected = selectedFilterLeadGroup === g.value;
                                                    return (
                                                        <div
                                                            key={g.value}
                                                            onClick={() => {
                                                                setSelectedFilterLeadGroup(g.value);
                                                                setFilterLeadGroupOpen(false);
                                                            }}
                                                            style={{
                                                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                                                padding: "7px 10px", borderRadius: "8px", cursor: "pointer",
                                                                background: isSelected ? "rgba(52,45,242,0.08)" : "transparent",
                                                                color: isSelected ? "#342df2" : "#334155",
                                                                fontWeight: isSelected ? 700 : 500, fontSize: "12px",
                                                                transition: "all .15s"
                                                            }}
                                                            onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "#f8fafc"; }}
                                                            onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
                                                        >
                                                            <div style={{ display: "flex", alignItems: "center", gap: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                                <span style={{ color: isSelected ? "#342df2" : "#94a3b8", display: "flex", flexShrink: 0 }}>
                                                                    <Ic.Folder />
                                                                </span>
                                                                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                                    {g.label}
                                                                </span>
                                                            </div>
                                                            {isSelected && <span style={{ color: "#342df2", display: "flex", flexShrink: 0 }}><Ic.Check /></span>}
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Campaign Custom Selector */}
                            <div style={{ marginBottom: 16, position: "relative" }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                                    <label style={{ fontSize: "11px", fontWeight: 700, color: "#475569", display: "flex", alignItems: "center", gap: 6 }}>
                                        <span style={{ color: "#10b981", display: "flex" }}><Ic.Megaphone /></span>
                                        Campaign
                                    </label>
                                    {selectedFilterCampaign && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedFilterCampaign(null);
                                            }}
                                            style={{
                                                border: "none", background: "none", color: "#ef4444",
                                                fontSize: "10px", fontWeight: 700, cursor: "pointer", padding: 0
                                            }}
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>

                                {/* Trigger Button */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFilterCampaignOpen(prev => !prev);
                                        setFilterLeadGroupOpen(false);
                                    }}
                                    style={{
                                        width: "100%", height: "42px", padding: "0 12px",
                                        borderRadius: "12px",
                                        border: `1.5px solid ${selectedFilterCampaign ? "#10b981" : (filterCampaignOpen ? "#10b981" : "#e2e8f0")}`,
                                        background: selectedFilterCampaign ? "rgba(16,185,129,0.06)" : (filterCampaignOpen ? "rgba(16,185,129,0.02)" : "#fff"),
                                        display: "flex", alignItems: "center", justifyContent: "space-between",
                                        cursor: "pointer", transition: "all .18s",
                                        boxShadow: filterCampaignOpen ? "0 0 0 3px rgba(16,185,129,0.12)" : "none"
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        <span style={{
                                            width: 22, height: 22, borderRadius: "6px",
                                            background: selectedFilterCampaign ? "#10b981" : "#f1f5f9",
                                            color: selectedFilterCampaign ? "#fff" : "#94a3b8",
                                            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                                        }}>
                                            <Ic.Megaphone />
                                        </span>
                                        <span style={{
                                            fontSize: "12px",
                                            fontWeight: selectedFilterCampaign ? 700 : 500,
                                            color: selectedFilterCampaign ? "#065f46" : "#64748b",
                                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                                        }}>
                                            {activeFilterCampaignObj?.label || "All Campaigns"}
                                        </span>
                                    </div>

                                    <span style={{
                                        transform: filterCampaignOpen ? "rotate(180deg)" : "none",
                                        transition: "transform .2s", color: "#94a3b8", display: "flex"
                                    }}>
                                        <Ic.ChevronDown />
                                    </span>
                                </button>

                                {/* Custom Dropdown Menu */}
                                {filterCampaignOpen && (
                                    <div style={{
                                        marginTop: 6,
                                        background: "#ffffff", borderRadius: "14px", padding: "8px",
                                        boxShadow: "0 12px 30px rgba(0,0,0,0.14)", border: "1.5px solid #eef2f6",
                                        animation: "fadeUp .15s ease-out"
                                    }}>
                                        {/* Search */}
                                        <div style={{
                                            display: "flex", alignItems: "center", gap: 6,
                                            padding: "6px 10px", borderRadius: "8px",
                                            background: "#f8fafc", border: "1px solid #e2e8f0",
                                            marginBottom: 6
                                        }}>
                                            <span style={{ color: "#94a3b8", display: "flex" }}><Ic.Search /></span>
                                            <input
                                                type="text"
                                                placeholder="Search campaigns..."
                                                value={filterCampaignSearch}
                                                onChange={e => setFilterCampaignSearch(e.target.value)}
                                                style={{
                                                    width: "100%", border: "none", outline: "none",
                                                    background: "transparent", fontSize: "11px", color: "#1e293b"
                                                }}
                                            />
                                            {filterCampaignSearch && (
                                                <span
                                                    onClick={() => setFilterCampaignSearch("")}
                                                    style={{ cursor: "pointer", fontSize: "10px", color: "#94a3b8" }}
                                                >
                                                    ✕
                                                </span>
                                            )}
                                        </div>

                                        {/* All Option */}
                                        <div
                                            onClick={() => {
                                                setSelectedFilterCampaign(null);
                                                setFilterCampaignOpen(false);
                                            }}
                                            style={{
                                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                                padding: "8px 10px", borderRadius: "8px", cursor: "pointer",
                                                background: !selectedFilterCampaign ? "rgba(16,185,129,0.08)" : "transparent",
                                                color: !selectedFilterCampaign ? "#059669" : "#334155",
                                                fontWeight: !selectedFilterCampaign ? 700 : 500, fontSize: "12px",
                                                transition: "all .15s"
                                            }}
                                            onMouseEnter={e => { if (selectedFilterCampaign) e.currentTarget.style.background = "#f8fafc"; }}
                                            onMouseLeave={e => { if (selectedFilterCampaign) e.currentTarget.style.background = "transparent"; }}
                                        >
                                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#94a3b8" }} />
                                                <span>All Campaigns</span>
                                            </div>
                                            {!selectedFilterCampaign && <span style={{ color: "#059669", display: "flex" }}><Ic.Check /></span>}
                                        </div>

                                        <div style={{ height: 1, background: "#f1f5f9", margin: "4px 0" }} />

                                        {/* Options List */}
                                        <div style={{ maxHeight: 160, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
                                            {filteredFilterCampaigns.length === 0 ? (
                                                <div style={{ padding: "12px 10px", textAlign: "center", color: "#94a3b8", fontSize: "11px" }}>
                                                    No campaigns found
                                                </div>
                                            ) : (
                                                filteredFilterCampaigns.map((c: any) => {
                                                    const isSelected = selectedFilterCampaign === c.value;
                                                    return (
                                                        <div
                                                            key={c.value}
                                                            onClick={() => {
                                                                setSelectedFilterCampaign(c.value);
                                                                setFilterCampaignOpen(false);
                                                            }}
                                                            style={{
                                                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                                                padding: "7px 10px", borderRadius: "8px", cursor: "pointer",
                                                                background: isSelected ? "rgba(16,185,129,0.08)" : "transparent",
                                                                color: isSelected ? "#059669" : "#334155",
                                                                fontWeight: isSelected ? 700 : 500, fontSize: "12px",
                                                                transition: "all .15s"
                                                            }}
                                                            onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "#f8fafc"; }}
                                                            onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
                                                        >
                                                            <div style={{ display: "flex", alignItems: "center", gap: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                                <span style={{ color: isSelected ? "#059669" : "#94a3b8", display: "flex", flexShrink: 0 }}>
                                                                    <Ic.Megaphone />
                                                                </span>
                                                                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                                    {c.label}
                                                                </span>
                                                            </div>
                                                            {isSelected && <span style={{ color: "#059669", display: "flex", flexShrink: 0 }}><Ic.Check /></span>}
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer Actions */}
                            <div style={{ display: "flex", gap: 10, paddingTop: 6, borderTop: "1px solid #f1f5f9" }}>
                                <button
                                    type="button"
                                    onClick={handleResetAllFilters}
                                    style={{
                                        flex: 1, padding: "10px 14px", borderRadius: "12px",
                                        border: "1.5px solid #e2e8f0", background: "#f8fafc",
                                        color: "#64748b", fontSize: "12px", fontWeight: 700,
                                        cursor: "pointer", transition: "all .15s"
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.background = "#f1f5f9")}
                                    onMouseLeave={e => (e.currentTarget.style.background = "#f8fafc")}
                                >
                                    Reset All
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMoreFiltersOpen(false);
                                        setFilterLeadGroupOpen(false);
                                        setFilterCampaignOpen(false);
                                    }}
                                    style={{
                                        flex: 1.2, padding: "10px 16px", borderRadius: "12px",
                                        border: "none", background: "linear-gradient(135deg, #342df2, #554df8)",
                                        color: "#ffffff", fontSize: "12px", fontWeight: 700,
                                        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                                        boxShadow: "0 4px 14px rgba(52,45,242,0.3)",
                                        transition: "all .15s"
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 6px 20px rgba(52,45,242,0.45)")}
                                    onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 4px 14px rgba(52,45,242,0.3)")}
                                >
                                    <Ic.Check /> Done
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ──────────── KANBAN BOARD ──────────── */}
            <div className="pipeline-scroll" style={{ overflowX: "auto", overflowY: "hidden", padding: "5px 0", width: "100%" }}>
                <div style={{ display: "inline-flex", flexWrap: "nowrap", gap: 16, alignItems: "flex-start" }}>
                    {visibleStages.map((stage) => (
                        <StageColumn
                            key={stage.id}
                            stage={stage}
                            onEdit={handleOpenEditStage}
                            onDelete={handleOpenDeleteStage}
                            onAddLead={handleOpenAddLead}
                            onClickLead={(lead) => handleOpenLeadDetails(lead, stage)}
                            onEditLead={(lead) => handleOpenEditLead(lead, stage.id)}
                            onDeleteLead={handleOpenDeleteLead}
                            onLeadDragStart={handleLeadDragStart}
                            onColumnDragOver={(e) => { handleColumnDragOver(e); handleColumnDragEnter(stage.id); }}
                            onColumnDrop={handleColumnDrop}
                            onColumnDragLeave={handleColumnDragLeave}
                            isDragOver={dragOverStageId === stage.id}
                            draggingLeadId={draggingLead?.leadId ?? null}
                            selectedLeadIds={selectedLeadIds}
                            onToggleSelectLead={toggleSelectLead}
                            onToggleSelectStage={toggleSelectStageLeads}
                        />
                    ))}

                    {/* ADD STAGE */}
                    <div style={{ width: 260, flexShrink: 0 }}>
                        {showAddStage ? (
                            <div style={{
                                background: "#fff", borderRadius: "20px", padding: "20px",
                                boxShadow: "0 12px 40px rgba(52,45,242,0.14)",
                                border: "1.5px solid rgba(52,45,242,0.12)",
                                animation: "fadeUp .2s ease-out",
                                width: 280
                            }}>
                                {/* header */}
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                                    <p style={{ fontSize: "13px", fontWeight: 800, color: "#1e1b4b", margin: 0 }}>Create New Stage</p>
                                    <button onClick={() => { setShowAddStage(false); setNewStageName(""); }} style={{
                                        width: 28, height: 28, borderRadius: "8px", background: "#f4f7fe",
                                        border: "none", cursor: "pointer", fontSize: "14px", color: "#94a3b8",
                                        display: "flex", alignItems: "center", justifyContent: "center"
                                    }}>✕</button>
                                </div>

                                {/* stage name input */}
                                <label style={{ fontSize: "11px", fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>Stage Name <span style={{ color: "#ef4444" }}>*</span></label>
                                <input autoFocus type="text" placeholder="e.g. Qualified, Negotiation..." value={newStageName}
                                    onChange={e => setNewStageName(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && handleAddStage()}
                                    style={{
                                        width: "100%", padding: "10px 12px", borderRadius: "10px",
                                        border: "1.5px solid #e5e7eb", outline: "none",
                                        fontSize: "13px", color: "#374151", marginBottom: "16px",
                                        boxSizing: "border-box", fontFamily: "inherit",
                                        transition: "border-color .2s"
                                    }}
                                    onFocus={e => (e.currentTarget.style.borderColor = "#342df2")}
                                    onBlur={e => (e.currentTarget.style.borderColor = "#e5e7eb")}
                                />

                                {/* color picker section */}
                                <label style={{ fontSize: "11px", fontWeight: 600, color: "#64748b", display: "block", marginBottom: 8 }}>Choose a color to identify this stage</label>

                                {/* color swatch + hex input */}
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                                    <div
                                        onClick={() => {
                                            const el = document.getElementById("stage-color-picker");
                                            if (el) el.click();
                                        }}
                                        style={{
                                            width: 38, height: 38, borderRadius: "10px",
                                            background: newStageColor,
                                            boxShadow: `0 4px 12px ${newStageColor}50`,
                                            flexShrink: 0,
                                            transition: "all .25s",
                                            border: "2px solid #fff",
                                            outline: `2px solid ${newStageColor}40`,
                                            cursor: "pointer",
                                            position: "relative"
                                        }}
                                    >
                                        {/* pencil icon overlay */}
                                        <div style={{
                                            position: "absolute", inset: 0,
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            background: "rgba(0,0,0,0.15)", borderRadius: "8px",
                                            opacity: 0, transition: "opacity .2s"
                                        }}
                                            onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                                            onMouseLeave={e => (e.currentTarget.style.opacity = "0")}
                                        >
                                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </div>
                                    </div>
                                    {/* hidden native color picker */}
                                    <input
                                        id="stage-color-picker"
                                        type="color"
                                        value={newStageColor}
                                        onChange={e => setNewStageColor(e.target.value)}
                                        style={{ position: "absolute", width: 0, height: 0, opacity: 0, pointerEvents: "none" }}
                                    />
                                    <input type="text" value={newStageColor.toUpperCase()}
                                        onChange={e => {
                                            const v = e.target.value;
                                            if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) setNewStageColor(v);
                                        }}
                                        style={{
                                            flex: 1, padding: "8px 12px", borderRadius: "10px",
                                            border: "1.5px solid #e5e7eb", outline: "none",
                                            fontSize: "12px", fontWeight: 600, color: "#374151",
                                            fontFamily: "monospace", boxSizing: "border-box",
                                            letterSpacing: "0.5px"
                                        }} />
                                </div>

                                {/* palette grid */}
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                                    {PALETTE_COLORS.map(c => (
                                        <button key={c} onClick={() => setNewStageColor(c)} style={{
                                            width: 28, height: 28, borderRadius: "8px",
                                            background: c, border: "none", cursor: "pointer",
                                            outline: newStageColor === c ? `2.5px solid ${c}` : "2.5px solid transparent",
                                            outlineOffset: "2px",
                                            transform: newStageColor === c ? "scale(1.15)" : "scale(1)",
                                            transition: "all .2s cubic-bezier(.4,0,.2,1)",
                                            boxShadow: newStageColor === c ? `0 4px 12px ${c}50` : "0 1px 3px rgba(0,0,0,0.1)"
                                        }} />
                                    ))}
                                </div>

                                {/* preview info */}
                                <div style={{
                                    display: "flex", alignItems: "center", gap: 8,
                                    padding: "10px 12px", borderRadius: "10px",
                                    background: `${newStageColor}08`,
                                    border: `1px solid ${newStageColor}20`,
                                    marginBottom: 16
                                }}>
                                    <div style={{ width: 16, height: 16, borderRadius: "50%", background: "rgba(52,45,242,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        <span style={{ fontSize: "10px", color: "#342df2" }}>ℹ</span>
                                    </div>
                                    <span style={{ fontSize: "11px", color: "#64748b", lineHeight: 1.4 }}>
                                        <strong style={{ color: "#374151" }}>Preview:</strong> Stage will be added at the end of your pipeline
                                    </span>
                                </div>

                                {/* create button */}
                                <button
                                    onClick={handleAddStage}
                                    disabled={createLoading}
                                    style={{
                                        width: "100%", padding: "11px 0", borderRadius: "12px",
                                        background: `linear-gradient(135deg,${newStageColor},${newStageColor}cc)`,
                                        color: "#fff", fontSize: "13px", fontWeight: 700,
                                        border: "none", cursor: createLoading ? "not-allowed" : "pointer",
                                        boxShadow: `0 6px 20px ${newStageColor}40`,
                                        letterSpacing: "1px", textTransform: "uppercase",
                                        transition: "all .2s",
                                        opacity: createLoading ? 0.7 : 1,
                                    }}
                                    onMouseEnter={e => !createLoading && (e.currentTarget.style.boxShadow = `0 8px 28px ${newStageColor}60`)}
                                    onMouseLeave={e => !createLoading && (e.currentTarget.style.boxShadow = `0 6px 20px ${newStageColor}40`)}
                                >
                                    {createLoading ? "CREATING..." : "CREATE STAGE"}
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => setShowAddStage(true)} style={{
                                width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10,
                                padding: "36px 0", borderRadius: "20px",
                                border: "2px dashed rgba(52,45,242,0.2)",
                                background: "rgba(52,45,242,0.02)",
                                cursor: "pointer", transition: "all .2s", color: "#342df2"
                            }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = "rgba(52,45,242,0.06)";
                                    e.currentTarget.style.borderColor = "rgba(52,45,242,0.4)";
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = "rgba(52,45,242,0.02)";
                                    e.currentTarget.style.borderColor = "rgba(52,45,242,0.2)";
                                }}
                            >
                                <div style={{
                                    width: 44, height: 44, borderRadius: "14px",
                                    background: "rgba(52,45,242,0.08)",
                                    display: "flex", alignItems: "center", justifyContent: "center"
                                }}>
                                    <Ic.Plus />
                                </div>
                                <span style={{ fontSize: "13px", fontWeight: 700, color: "#342df2" }}>Add Stage</span>
                                <span style={{ fontSize: "11px", color: "#94a3b8" }}>Click to create a new pipeline stage</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════
               EDIT STAGE MODAL
            ═══════════════════════════════════════ */}
            {editStageModal && (
                <div style={{
                    position: "fixed", inset: 0, zIndex: 9999,
                    background: "rgba(15, 23, 42, 0.45)", backdropFilter: "blur(5px)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: 16
                }}
                    onClick={() => setEditStageModal(null)}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            background: "#fff", borderRadius: "24px", padding: "24px 26px",
                            boxShadow: "0 20px 60px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.04)",
                            width: "100%", maxWidth: 360,
                            animation: "fadeUp .2s ease-out"
                        }}
                    >
                        {/* Header */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{ width: 12, height: 12, borderRadius: "50%", background: editStageColor, boxShadow: `0 0 10px ${editStageColor}80` }} />
                                <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#1e1b4b", margin: 0 }}>Edit Stage</h3>
                            </div>
                            <button
                                onClick={() => setEditStageModal(null)}
                                style={{ width: 28, height: 28, borderRadius: "8px", background: "#f4f7fe", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center" }}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Stage Name input */}
                        <label style={{ fontSize: "11px", fontWeight: 600, color: "#64748b", display: "block", marginBottom: 6 }}>
                            Stage Name <span style={{ color: "#ef4444" }}>*</span>
                        </label>
                        <input
                            autoFocus
                            type="text"
                            value={editStageName}
                            onChange={e => setEditStageName(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleUpdateStage()}
                            placeholder="Stage Name"
                            style={{
                                width: "100%", padding: "10px 14px", borderRadius: "12px",
                                border: "1.5px solid #e5e7eb", outline: "none",
                                fontSize: "13px", fontWeight: 600, color: "#374151",
                                boxSizing: "border-box", marginBottom: 16,
                                transition: "border-color .2s"
                            }}
                            onFocus={e => (e.currentTarget.style.borderColor = editStageColor)}
                            onBlur={e => (e.currentTarget.style.borderColor = "#e5e7eb")}
                        />

                        {/* Color Selector */}
                        <label style={{ fontSize: "11px", fontWeight: 600, color: "#64748b", display: "block", marginBottom: 8 }}>
                            Choose Color
                        </label>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                            <div
                                onClick={() => {
                                    const el = document.getElementById("edit-stage-color-picker");
                                    if (el) el.click();
                                }}
                                style={{
                                    width: 38, height: 38, borderRadius: "10px",
                                    background: editStageColor,
                                    boxShadow: `0 4px 12px ${editStageColor}50`,
                                    flexShrink: 0,
                                    border: "2px solid #fff",
                                    outline: `2px solid ${editStageColor}40`,
                                    cursor: "pointer",
                                    display: "flex", alignItems: "center", justifyContent: "center"
                                }}
                            >
                                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                            </div>
                            <input
                                id="edit-stage-color-picker"
                                type="color"
                                value={editStageColor}
                                onChange={e => setEditStageColor(e.target.value)}
                                style={{ position: "absolute", width: 0, height: 0, opacity: 0, pointerEvents: "none" }}
                            />
                            <input
                                type="text"
                                value={editStageColor.toUpperCase()}
                                onChange={e => {
                                    const v = e.target.value;
                                    if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) setEditStageColor(v);
                                }}
                                style={{
                                    flex: 1, padding: "8px 12px", borderRadius: "10px",
                                    border: "1.5px solid #e5e7eb", outline: "none",
                                    fontSize: "12px", fontWeight: 600, color: "#374151",
                                    fontFamily: "monospace", boxSizing: "border-box"
                                }}
                            />
                        </div>

                        {/* Palette Dots */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
                            {PALETTE_COLORS.map(c => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setEditStageColor(c)}
                                    style={{
                                        width: 28, height: 28, borderRadius: "8px",
                                        background: c, border: "none", cursor: "pointer",
                                        outline: editStageColor === c ? `2.5px solid ${c}` : "2.5px solid transparent",
                                        outlineOffset: "2px",
                                        transform: editStageColor === c ? "scale(1.15)" : "scale(1)",
                                        transition: "all .2s cubic-bezier(.4,0,.2,1)"
                                    }}
                                />
                            ))}
                        </div>

                        {/* Buttons */}
                        <div style={{ display: "flex", gap: 10 }}>
                            <button
                                type="button"
                                onClick={() => setEditStageModal(null)}
                                style={{
                                    flex: 1, padding: "10px 0", borderRadius: "12px",
                                    border: "1.5px solid #e5e7eb", background: "#fff",
                                    color: "#64748b", fontSize: "13px", fontWeight: 600,
                                    cursor: "pointer"
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleUpdateStage}
                                disabled={editStageLoading}
                                style={{
                                    flex: 1.5, padding: "10px 0", borderRadius: "12px",
                                    background: `linear-gradient(135deg,${editStageColor},${editStageColor}cc)`,
                                    color: "#fff", fontSize: "13px", fontWeight: 700,
                                    border: "none", cursor: editStageLoading ? "not-allowed" : "pointer",
                                    boxShadow: `0 6px 20px ${editStageColor}40`,
                                    opacity: editStageLoading ? 0.7 : 1
                                }}
                            >
                                {editStageLoading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════
               DELETE STAGE CONFIRMATION MODAL
            ═══════════════════════════════════════ */}
            {deleteStageTarget && (
                <div style={{
                    position: "fixed", inset: 0, zIndex: 9999,
                    background: "rgba(15, 23, 42, 0.45)", backdropFilter: "blur(5px)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: 16
                }}
                    onClick={() => setDeleteStageTarget(null)}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            background: "#fff", borderRadius: "24px", padding: "24px 26px",
                            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                            width: "100%", maxWidth: 380,
                            animation: "fadeUp .2s ease-out",
                            textAlign: "center"
                        }}
                    >
                        <div style={{
                            width: 52, height: 52, borderRadius: "50%",
                            background: "rgba(239, 68, 68, 0.1)",
                            color: "#ef4444", margin: "0 auto 16px",
                            display: "flex", alignItems: "center", justifyContent: "center"
                        }}>
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#1e1b4b", margin: "0 0 8px" }}>
                            Delete Stage
                        </h3>
                        <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 20px", lineHeight: 1.5 }}>
                            Are you sure you want to delete stage <strong style={{ color: "#1e1b4b" }}>"{deleteStageTarget.title}"</strong>? Any leads in this stage will be marked inactive.
                        </p>
                        <div style={{ display: "flex", gap: 10 }}>
                            <button
                                type="button"
                                onClick={() => setDeleteStageTarget(null)}
                                style={{
                                    flex: 1, padding: "10px 0", borderRadius: "12px",
                                    border: "1.5px solid #e5e7eb", background: "#fff",
                                    color: "#64748b", fontSize: "13px", fontWeight: 600,
                                    cursor: "pointer"
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmDeleteStage}
                                disabled={deleteStageLoading}
                                style={{
                                    flex: 1, padding: "10px 0", borderRadius: "12px",
                                    background: "#ef4444", color: "#fff",
                                    fontSize: "13px", fontWeight: 700, border: "none",
                                    cursor: deleteStageLoading ? "not-allowed" : "pointer",
                                    boxShadow: "0 6px 20px rgba(239,68,68,0.35)",
                                    opacity: deleteStageLoading ? 0.7 : 1
                                }}
                            >
                                {deleteStageLoading ? "Deleting..." : "Delete Stage"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════
               CREATE LEAD (KANBAN FORM) MODAL
            ═══════════════════════════════════════ */}
            {showAddLeadModal && (
                <KanbanLeadModal
                    modalTitle="Add New Lead"
                    defaultStageId={showAddLeadModal.stageId}
                    defaultStageTitle={showAddLeadModal.stageTitle}
                    initialData={{ priority: "Medium" }}
                    onClose={() => setShowAddLeadModal(null)}
                    onSuccess={handleLeadCreatedSuccess}
                />
            )}

            {/* ═══════════════════════════════════════
               EDIT LEAD (KANBAN FORM) MODAL
            ═══════════════════════════════════════ */}
            {editLeadModal && (
                <KanbanLeadModal
                    modalTitle="Edit Lead"
                    leadId={editLeadModal.lead.lead_management_uuid || editLeadModal.lead.id}
                    initialData={{
                        ...(editLeadModal.lead.lead_details || {}),
                        ...editLeadModal.lead,
                        campaign_uuid: editLeadModal.lead.campaign_uuid || editLeadModal.lead.lead_details?.campaign_uuid || "",
                        campaign_name: editLeadModal.lead.campaign_name || editLeadModal.lead.lead_details?.campaign_name || "",
                        dob: editLeadModal.lead.lead_details?.dob || undefined,
                        date: undefined,
                        priority: editLeadModal.lead.priority || editLeadModal.lead.lead_details?.priority || "Medium",
                    }}
                    defaultStageId={editLeadModal.stageId}
                    onClose={() => setEditLeadModal(null)}
                    onSuccess={handleLeadUpdatedSuccess}
                />
            )}

            {/* ═══════════════════════════════════════
               LEAD DETAILS MODAL
            ═══════════════════════════════════════ */}
            {selectedLeadDetails && (
                <LeadDetailsModal
                    lead={selectedLeadDetails.lead}
                    stage={selectedLeadDetails.stage}
                    onClose={() => setSelectedLeadDetails(null)}
                    onEdit={() => {
                        const targetLead = selectedLeadDetails.lead;
                        const targetStageId = selectedLeadDetails.stage?.id || "";
                        setSelectedLeadDetails(null);
                        handleOpenEditLead(targetLead, targetStageId);
                    }}
                />
            )}

            {/* ═══════════════════════════════════════
               DELETE LEAD CONFIRMATION MODAL
            ═══════════════════════════════════════ */}
            {deleteLeadTarget && (
                <div style={{
                    position: "fixed", inset: 0, zIndex: 9999,
                    background: "rgba(15, 23, 42, 0.45)", backdropFilter: "blur(5px)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: 16
                }}
                    onClick={() => setDeleteLeadTarget(null)}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            background: "#fff", borderRadius: "24px", padding: "24px 26px",
                            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                            width: "100%", maxWidth: 360,
                            animation: "fadeUp .2s ease-out",
                            textAlign: "center"
                        }}
                    >
                        <div style={{
                            width: 48, height: 48, borderRadius: "50%",
                            background: "rgba(239, 68, 68, 0.1)",
                            color: "#ef4444", margin: "0 auto 14px",
                            display: "flex", alignItems: "center", justifyContent: "center"
                        }}>
                            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#1e1b4b", margin: "0 0 6px" }}>
                            Delete Lead
                        </h3>
                        <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 18px", lineHeight: 1.5 }}>
                            Are you sure you want to remove <strong style={{ color: "#1e1b4b" }}>"{deleteLeadTarget.name || deleteLeadTarget.phone}"</strong> from the pipeline?
                        </p>
                        <div style={{ display: "flex", gap: 10 }}>
                            <button
                                type="button"
                                onClick={() => setDeleteLeadTarget(null)}
                                style={{
                                    flex: 1, padding: "9px 0", borderRadius: "10px",
                                    border: "1.5px solid #e5e7eb", background: "#fff",
                                    color: "#64748b", fontSize: "12px", fontWeight: 600,
                                    cursor: "pointer"
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmDeleteLead}
                                disabled={deleteLeadLoading}
                                style={{
                                    flex: 1, padding: "9px 0", borderRadius: "10px",
                                    background: "#ef4444", color: "#fff",
                                    fontSize: "12px", fontWeight: 700, border: "none",
                                    cursor: deleteLeadLoading ? "not-allowed" : "pointer",
                                    boxShadow: "0 6px 20px rgba(239,68,68,0.35)",
                                    opacity: deleteLeadLoading ? 0.7 : 1
                                }}
                            >
                                {deleteLeadLoading ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════
               IMPORT LEADS MODAL
            ═══════════════════════════════════════ */}
            {showImportModal && (
                <div style={{
                    position: "fixed", inset: 0, zIndex: 9999,
                    background: "rgba(15, 23, 42, 0.45)", backdropFilter: "blur(6px)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: 16
                }}
                    onClick={() => !importLoading && setShowImportModal(false)}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            background: "#fff", borderRadius: "24px", padding: "26px 28px",
                            boxShadow: "0 24px 70px rgba(0,0,0,0.18)",
                            width: "100%", maxWidth: 540,
                            maxHeight: "90vh", display: "flex", flexDirection: "column",
                            animation: "fadeUp .22s ease-out",
                            position: "relative"
                        }}
                    >
                        {/* Header */}
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <div style={{
                                    width: 44, height: 44, borderRadius: "14px",
                                    background: "linear-gradient(135deg, rgba(52,45,242,0.12), rgba(124,58,237,0.12))",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    color: "#342df2",
                                }}>
                                    <Ic.Upload />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#1e1b4b", margin: 0 }}>
                                        Import Leads to Pipeline
                                    </h3>
                                    <p style={{ fontSize: "12px", color: "#64748b", margin: "2px 0 0" }}>
                                        Dispositions will become pipeline stages and matching leads will be imported.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => !importLoading && setShowImportModal(false)}
                                style={{
                                    border: "none", background: "#f1f5f9", borderRadius: "50%",
                                    width: 32, height: 32, display: "flex", alignItems: "center",
                                    justifyContent: "center", cursor: "pointer", color: "#64748b",
                                    transition: "all .15s"
                                }}
                            >
                                <Ic.Close />
                            </button>
                        </div>

                        {/* Body - Scrollable */}
                        <div style={{ overflowY: "auto", flex: 1, paddingRight: 4, display: "flex", flexDirection: "column", gap: 18 }}>
                            {/* Step 1: Select Lead Group (Optional) */}
                            <div>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155", margin: 0 }}>
                                        Select Lead Group <span style={{ fontSize: "11px", fontWeight: 500, color: "#64748b" }}>(Optional)</span>
                                    </label>
                                    {selectedLeadGroup && (
                                        <button
                                            type="button"
                                            onClick={() => setSelectedLeadGroup("")}
                                            style={{
                                                fontSize: "11px", fontWeight: 600, color: "#ef4444",
                                                background: "rgba(239,68,68,0.08)", border: "none",
                                                borderRadius: "6px", padding: "2px 7px", cursor: "pointer"
                                            }}
                                        >
                                            Clear selection
                                        </button>
                                    )}
                                </div>
                                <div style={{ position: "relative" }}>
                                    <select
                                        value={selectedLeadGroup}
                                        onChange={e => setSelectedLeadGroup(e.target.value)}
                                        style={{
                                            width: "100%", padding: "10px 14px", borderRadius: "12px",
                                            border: "1.5px solid #e2e8f0", outline: "none", fontSize: "13px",
                                            background: "#fff", color: selectedLeadGroup ? "#1e293b" : "#64748b",
                                            fontWeight: 500, cursor: "pointer",
                                            boxSizing: "border-box"
                                        }}
                                    >
                                        <option value="">-- All Leads / Entire Lead Management (Optional) --</option>
                                        {leadGroupOptions.map((group: any) => (
                                            <option key={group.value} value={group.value}>
                                                {group.label || group.name || group.value}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Step 2: Select Dispositions */}
                            <div>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155", margin: 0 }}>
                                        Select Dispositions (Pipeline Stages) <span style={{ color: "#ef4444" }}>*</span>
                                    </label>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <button
                                            type="button"
                                            onClick={handleSelectAllDispositions}
                                            style={{
                                                fontSize: "11px", fontWeight: 700, color: "#342df2",
                                                background: "rgba(52,45,242,0.08)", border: "none",
                                                borderRadius: "6px", padding: "3px 8px", cursor: "pointer"
                                            }}
                                        >
                                            Select All
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleClearAllDispositions}
                                            style={{
                                                fontSize: "11px", fontWeight: 700, color: "#64748b",
                                                background: "#f1f5f9", border: "none",
                                                borderRadius: "6px", padding: "3px 8px", cursor: "pointer"
                                            }}
                                        >
                                            Clear
                                        </button>
                                        <span style={{
                                            fontSize: "11px", fontWeight: 800, color: "#342df2",
                                            background: "rgba(52,45,242,0.1)", padding: "2px 8px",
                                            borderRadius: "12px"
                                        }}>
                                            {selectedDispositions.length} selected
                                        </span>
                                    </div>
                                </div>

                                {/* Filter Search */}
                                <div style={{
                                    display: "flex", alignItems: "center", gap: 8,
                                    padding: "8px 12px", borderRadius: "10px",
                                    border: "1.5px solid #e2e8f0", background: "#f8fafc",
                                    marginBottom: 10
                                }}>
                                    <span style={{ color: "#94a3b8" }}><Ic.Search /></span>
                                    <input
                                        type="text"
                                        value={dispSearch}
                                        onChange={e => setDispSearch(e.target.value)}
                                        placeholder="Search dispositions..."
                                        style={{
                                            border: "none", background: "transparent", outline: "none",
                                            fontSize: "12px", width: "100%", color: "#1e293b"
                                        }}
                                    />
                                    {dispSearch && (
                                        <button
                                            type="button"
                                            onClick={() => setDispSearch("")}
                                            style={{ border: "none", background: "none", cursor: "pointer", color: "#94a3b8" }}
                                        >
                                            <Ic.Close />
                                        </button>
                                    )}
                                </div>

                                {/* Dispositions Checklist */}
                                <div style={{
                                    maxHeight: 200, overflowY: "auto", borderRadius: "12px",
                                    border: "1.5px solid #e2e8f0", background: "#fff",
                                    padding: 6, display: "flex", flexDirection: "column", gap: 4
                                }}>
                                    {filteredDispositions.length === 0 ? (
                                        <div style={{ padding: "20px 0", textAlign: "center", color: "#94a3b8", fontSize: "12px" }}>
                                            No dispositions found
                                        </div>
                                    ) : (
                                        filteredDispositions.map((disp: any) => {
                                            const isChecked = selectedDispositions.includes(disp.value);
                                            const cleanLabel = (disp.label || "").replace(/\s*\(admin\)\s*$/i, "").trim();
                                            const stageExists = stages.some(st => st.title.toLowerCase() === cleanLabel.toLowerCase());

                                            return (
                                                <div
                                                    key={disp.value}
                                                    onClick={() => handleToggleDisposition(disp.value)}
                                                    style={{
                                                        display: "flex", alignItems: "center", justifyContent: "space-between",
                                                        padding: "8px 12px", borderRadius: "8px",
                                                        cursor: "pointer", transition: "all .15s",
                                                        background: isChecked ? "rgba(52,45,242,0.06)" : "transparent",
                                                        border: isChecked ? "1px solid rgba(52,45,242,0.2)" : "1px solid transparent"
                                                    }}
                                                    onMouseEnter={e => {
                                                        if (!isChecked) e.currentTarget.style.background = "#f8fafc";
                                                    }}
                                                    onMouseLeave={e => {
                                                        if (!isChecked) e.currentTarget.style.background = "transparent";
                                                    }}
                                                >
                                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                        <div style={{
                                                            width: 18, height: 18, borderRadius: "5px",
                                                            border: isChecked ? "1.5px solid #342df2" : "1.5px solid #cbd5e1",
                                                            background: isChecked ? "#342df2" : "#fff",
                                                            display: "flex", alignItems: "center", justifyContent: "center",
                                                            color: "#fff", transition: "all .15s"
                                                        }}>
                                                            {isChecked && <Ic.Check />}
                                                        </div>
                                                        <span style={{
                                                            fontSize: "12px", fontWeight: isChecked ? 700 : 500,
                                                            color: isChecked ? "#1e1b4b" : "#334155"
                                                        }}>
                                                            {disp.label}
                                                        </span>
                                                    </div>

                                                    {stageExists ? (
                                                        <span style={{
                                                            fontSize: "10px", fontWeight: 700,
                                                            background: "rgba(16,185,129,0.1)", color: "#059669",
                                                            padding: "2px 8px", borderRadius: "10px"
                                                        }}>
                                                            Existing Stage
                                                        </span>
                                                    ) : (
                                                        <span style={{
                                                            fontSize: "10px", fontWeight: 700,
                                                            background: "rgba(124,58,237,0.08)", color: "#7c3aed",
                                                            padding: "2px 8px", borderRadius: "10px"
                                                        }}>
                                                            + New Stage
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>

                            {/* Step 3: Auto Lead Import Toggle Card */}
                            <div style={{
                                background: autoImportEnabled
                                    ? "linear-gradient(135deg, rgba(52,45,242,0.07), rgba(124,58,237,0.06))"
                                    : "#f8fafc",
                                border: autoImportEnabled
                                    ? "1.5px solid rgba(52,45,242,0.35)"
                                    : "1.5px solid #e2e8f0",
                                borderRadius: "14px",
                                padding: "14px 16px",
                                transition: "all .2s ease",
                            }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <div style={{
                                            width: 38, height: 38, borderRadius: "10px",
                                            background: autoImportEnabled
                                                ? "linear-gradient(135deg,#342df2,#7c3aed)"
                                                : "#e2e8f0",
                                            color: autoImportEnabled ? "#fff" : "#64748b",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: "16px", transition: "all .2s", flexShrink: 0
                                        }}>
                                            ⚡
                                        </div>
                                        <div>
                                            <div style={{ fontSize: "13px", fontWeight: 700, color: "#1e293b", display: "flex", alignItems: "center", gap: 8 }}>
                                                Auto Lead Import
                                                {autoImportEnabled ? (
                                                    <span style={{
                                                        fontSize: "10px", fontWeight: 800, background: "#10b981", color: "#fff",
                                                        padding: "1px 7px", borderRadius: "10px", letterSpacing: "0.5px"
                                                    }}>
                                                        ENABLED
                                                    </span>
                                                ) : (
                                                    <span style={{
                                                        fontSize: "10px", fontWeight: 700, background: "#94a3b8", color: "#fff",
                                                        padding: "1px 7px", borderRadius: "10px"
                                                    }}>
                                                        OFF
                                                    </span>
                                                )}
                                            </div>
                                            <div style={{ fontSize: "11px", color: "#64748b", marginTop: 2, lineHeight: 1.4 }}>
                                                Automatically import new incoming leads from Lead Management if their disposition matches the selected stages.
                                            </div>
                                        </div>
                                    </div>
                                    {/* Toggle Switch */}
                                    <div
                                        onClick={() => setAutoImportEnabled(prev => !prev)}
                                        style={{
                                            width: 46, height: 26, borderRadius: 26,
                                            background: autoImportEnabled ? "#342df2" : "#cbd5e1",
                                            cursor: "pointer", position: "relative",
                                            transition: "background 0.2s ease", flexShrink: 0
                                        }}
                                        title={autoImportEnabled ? "Click to disable Auto-Import" : "Click to enable Auto-Import"}
                                    >
                                        <div style={{
                                            width: 20, height: 20, borderRadius: "50%",
                                            background: "#fff", position: "absolute", top: 3,
                                            left: autoImportEnabled ? 23 : 3,
                                            transition: "left 0.2s ease",
                                            boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                                        }} />
                                    </div>
                                </div>
                            </div>

                            {/* Informational Hint */}
                            <div style={{
                                background: "linear-gradient(135deg, rgba(52,45,242,0.05), rgba(124,58,237,0.05))",
                                border: "1px solid rgba(52,45,242,0.15)",
                                borderRadius: "12px", padding: "10px 14px",
                                display: "flex", gap: 10, alignItems: "flex-start"
                            }}>
                                <span style={{ color: "#342df2", fontSize: "14px", marginTop: 1 }}>💡</span>
                                <p style={{ fontSize: "11px", color: "#475569", margin: 0, lineHeight: 1.5 }}>
                                    Each selected disposition becomes a stage column. All matching leads {selectedLeadGroup ? "from the selected lead group" : "across entire lead management"} will automatically be imported with their contact details.
                                </p>
                            </div>
                        </div>

                        {/* Modal Actions */}
                        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                            <button
                                type="button"
                                onClick={() => !importLoading && !autoImportSaving && setShowImportModal(false)}
                                disabled={importLoading || autoImportSaving}
                                style={{
                                    flex: 1, padding: "11px 0", borderRadius: "12px",
                                    border: "1.5px solid #e2e8f0", background: "#fff",
                                    color: "#64748b", fontSize: "13px", fontWeight: 600,
                                    cursor: (importLoading || autoImportSaving) ? "not-allowed" : "pointer"
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveAutoImportOnly}
                                disabled={importLoading || autoImportSaving || (autoImportEnabled && selectedDispositions.length === 0)}
                                title="Save auto-import setting without re-importing existing leads"
                                style={{
                                    flex: 1.2, padding: "11px 0", borderRadius: "12px",
                                    border: "1.5px solid rgba(52,45,242,0.3)",
                                    background: "rgba(52,45,242,0.06)",
                                    color: "#342df2", fontSize: "12px", fontWeight: 700,
                                    cursor: (importLoading || autoImportSaving || (autoImportEnabled && selectedDispositions.length === 0)) ? "not-allowed" : "pointer",
                                    transition: "all .2s"
                                }}
                            >
                                {autoImportSaving ? "Saving..." : "Save Settings Only"}
                            </button>
                            <button
                                type="button"
                                onClick={handleImportLeads}
                                disabled={importLoading || autoImportSaving || selectedDispositions.length === 0}
                                style={{
                                    flex: 1.8, padding: "11px 0", borderRadius: "12px",
                                    background: (selectedDispositions.length === 0)
                                        ? "#cbd5e1"
                                        : "linear-gradient(135deg,#342df2,#7c3aed)",
                                    color: "#fff", fontSize: "13px", fontWeight: 700,
                                    border: "none", cursor: (importLoading || autoImportSaving || selectedDispositions.length === 0) ? "not-allowed" : "pointer",
                                    boxShadow: (selectedDispositions.length === 0) ? "none" : "0 6px 20px rgba(52,45,242,0.35)",
                                    transition: "all .2s",
                                    opacity: importLoading ? 0.7 : 1,
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8
                                }}
                            >
                                {importLoading ? (
                                    <span>Importing Leads...</span>
                                ) : (
                                    <>
                                        <Ic.Upload />
                                        <span>Import Leads ({selectedDispositions.length})</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════
               AUTO-ASSIGN DRAWER
            ═══════════════════════════════════════ */}
            {showAssignDrawer && (
                <>
                    {/* Backdrop */}
                    <div
                        onClick={() => !assignSaving && setShowAssignDrawer(false)}
                        style={{
                            position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
                            zIndex: 9000, backdropFilter: "blur(3px)",
                            animation: "fadeIn .2s ease"
                        }}
                    />

                    {/* Drawer panel */}
                    <div style={{
                        position: "fixed", top: 0, right: 0, bottom: 0, width: "440px",
                        background: "#fff", boxShadow: "-8px 0 40px rgba(0,0,0,0.18)",
                        zIndex: 9001, display: "flex", flexDirection: "column",
                        animation: "slideInRight .25s ease",
                        fontFamily: "'Inter','Segoe UI',sans-serif"
                    }}>

                        {/* Drawer header */}
                        <div style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "20px 24px",
                            background: "linear-gradient(135deg,#342df2,#7c3aed)",
                            color: "#fff"
                        }}>
                            <div>
                                <div style={{ fontSize: "17px", fontWeight: 800, letterSpacing: "-0.3px" }}>
                                    ⚙ Auto-Assign Users
                                </div>
                                <div style={{ fontSize: "12px", opacity: 0.8, marginTop: 2 }}>
                                    Round-robin assignment for new leads
                                </div>
                            </div>
                            <button
                                id="close-auto-assign-drawer"
                                onClick={() => !assignSaving && setShowAssignDrawer(false)}
                                style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", borderRadius: "8px", width: 36, height: 36, cursor: "pointer", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}
                            >✕</button>
                        </div>

                        {/* Scrollable body */}
                        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>

                            {/* Enable toggle */}
                            <div style={{
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                padding: "16px 20px", borderRadius: "14px",
                                background: assignEnabled ? "linear-gradient(135deg,rgba(16,185,129,0.08),rgba(5,150,105,0.05))" : "#f8fafc",
                                border: `2px solid ${assignEnabled ? "rgba(16,185,129,0.3)" : "#e2e8f0"}`,
                                marginBottom: "24px",
                                transition: "all .2s"
                            }}>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: "14px", color: "#1e293b" }}>Enable Auto-Assign</div>
                                    <div style={{ fontSize: "12px", color: "#64748b", marginTop: 2 }}>Automatically assign agents to new leads</div>
                                </div>
                                <button
                                    id="auto-assign-enable-toggle"
                                    onClick={() => setAssignEnabled(p => !p)}
                                    style={{
                                        width: 52, height: 28, borderRadius: "14px", border: "none",
                                        background: assignEnabled ? "#10b981" : "#cbd5e1",
                                        cursor: "pointer", position: "relative", transition: "background .2s", flexShrink: 0
                                    }}
                                >
                                    <span style={{
                                        position: "absolute", top: 3,
                                        left: assignEnabled ? 26 : 3,
                                        width: 22, height: 22, borderRadius: "50%",
                                        background: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                                        transition: "left .2s", display: "block"
                                    }} />
                                </button>
                            </div>

                            {/* Users list */}
                            <div style={{ fontWeight: 700, fontSize: "13px", color: "#64748b", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.8px" }}>
                                Select Users (Active Only)
                            </div>

                            {assignUsers.length === 0 && (
                                <div style={{ textAlign: "center", color: "#94a3b8", padding: "40px 0", fontSize: "14px" }}>
                                    No active users found
                                </div>
                            )}

                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                {assignUsers.map((u, idx) => (
                                    <div
                                        key={u.user_uuid}
                                        style={{
                                            display: "flex", alignItems: "center", gap: 14,
                                            padding: "14px 16px", borderRadius: "12px",
                                            background: u.checked ? "linear-gradient(135deg,rgba(52,45,242,0.05),rgba(124,58,237,0.03))" : "#f8fafc",
                                            border: `2px solid ${u.checked ? "rgba(52,45,242,0.2)" : "#e2e8f0"}`,
                                            transition: "all .15s"
                                        }}
                                    >
                                        {/* Checkbox */}
                                        <input
                                            id={`assign-user-chk-${u.user_uuid}`}
                                            type="checkbox"
                                            checked={u.checked}
                                            onChange={e => {
                                                const val = e.target.checked;
                                                setAssignUsers(prev => prev.map((x, i) => i === idx ? { ...x, checked: val } : x));
                                            }}
                                            style={{ width: 18, height: 18, accentColor: "#342df2", cursor: "pointer", flexShrink: 0 }}
                                        />

                                        {/* Avatar */}
                                        <div style={{
                                            width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                                            background: u.checked ? "linear-gradient(135deg,#342df2,#7c3aed)" : "#e2e8f0",
                                            color: u.checked ? "#fff" : "#94a3b8",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontWeight: 800, fontSize: "13px", transition: "all .2s"
                                        }}>
                                            {(u.user_name || "?")[0].toUpperCase()}
                                        </div>

                                        {/* Name */}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontWeight: 600, fontSize: "14px", color: "#1e293b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                {u.user_name}
                                            </div>
                                            <div style={{ fontSize: "11px", color: "#94a3b8" }}>Active agent</div>
                                        </div>

                                        {/* Frequency */}
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                                            <label style={{ fontSize: "10px", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase" }}>Freq</label>
                                            <select
                                                id={`assign-user-freq-${u.user_uuid}`}
                                                value={u.frequency}
                                                disabled={!u.checked}
                                                onChange={e => {
                                                    const val = Number(e.target.value);
                                                    setAssignUsers(prev => prev.map((x, i) => i === idx ? { ...x, frequency: val } : x));
                                                }}
                                                style={{
                                                    padding: "5px 8px", borderRadius: "8px",
                                                    border: "2px solid #e2e8f0",
                                                    fontSize: "14px", fontWeight: 700,
                                                    color: u.checked ? "#342df2" : "#94a3b8",
                                                    background: "#fff", cursor: u.checked ? "pointer" : "not-allowed",
                                                    width: 58
                                                }}
                                            >
                                                {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                                                    <option key={n} value={n}>{n}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Info box */}
                            {assignUsers.some(u => u.checked) && (
                                <div style={{
                                    marginTop: 20, padding: "12px 16px", borderRadius: "10px",
                                    background: "linear-gradient(135deg,rgba(52,45,242,0.06),rgba(124,58,237,0.04))",
                                    border: "1px solid rgba(52,45,242,0.15)",
                                    fontSize: "12px", color: "#475569", lineHeight: 1.6
                                }}>
                                    <strong style={{ color: "#342df2" }}>How it works:</strong> Leads will be assigned in order —
                                    {" "}{assignUsers.filter(u => u.checked).map(u => `${u.user_name} (×${u.frequency})`).join(" → ")} → repeat
                                </div>
                            )}
                        </div>

                        {/* Footer actions */}
                        <div style={{
                            padding: "16px 24px", borderTop: "1px solid #e2e8f0",
                            display: "flex", flexDirection: "column", gap: 10, background: "#fff"
                        }}>
                            {/* Distribute existing leads button */}
                            <button
                                id="distribute-existing-leads-btn"
                                type="button"
                                disabled={assignDistributing || assignSaving || assignUsers.filter(u => u.checked).length === 0}
                                onClick={async () => {
                                    setAssignDistributing(true);
                                    try {
                                        // 1. Save config first so distribution uses any fresh tweaks
                                        const selectedUsers_ = assignUsers
                                            .filter(u => u.checked)
                                            .map(u => ({ user_uuid: u.user_uuid, user_name: u.user_name, frequency: u.frequency }));
                                        await dispatch(pipelineAssignmentConfigSave({
                                            tenant_uuid: tenantUuid,
                                            enabled: assignEnabled,
                                            users: selectedUsers_,
                                        }));

                                        // 2. Trigger distribution of existing Kanban leads
                                        const res: any = await dispatch(pipelineDistributeExistingLeads(tenantUuid));
                                        if (res?.payload?.statusCode >= 400 || res?.error) {
                                            Danger(res?.payload?.message || "Failed to distribute leads");
                                        } else {
                                            Success(res?.payload?.message || "Leads successfully distributed!");
                                            refreshBoard();
                                            setShowAssignDrawer(false);
                                        }
                                    } catch {
                                        Danger("Failed to distribute leads");
                                    } finally {
                                        setAssignDistributing(false);
                                    }
                                }}
                                style={{
                                    width: "100%", padding: "12px 16px", borderRadius: "10px",
                                    border: "2px solid #342df2",
                                    background: (assignDistributing || assignSaving || assignUsers.filter(u => u.checked).length === 0)
                                        ? "#f8fafc"
                                        : "linear-gradient(135deg,rgba(52,45,242,0.08),rgba(124,58,237,0.06))",
                                    color: (assignDistributing || assignSaving || assignUsers.filter(u => u.checked).length === 0)
                                        ? "#94a3b8"
                                        : "#342df2",
                                    fontWeight: 700,
                                    cursor: (assignDistributing || assignSaving || assignUsers.filter(u => u.checked).length === 0) ? "not-allowed" : "pointer",
                                    fontSize: "13px",
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                                    transition: "all .2s"
                                }}
                            >
                                <span style={{ fontSize: "15px" }}>⚡</span>
                                <span>{assignDistributing ? "Distributing existing leads..." : `Distribute Existing Leads Now (${totalLeads})`}</span>
                            </button>

                            <div style={{ display: "flex", gap: 12 }}>
                                <button
                                    id="cancel-auto-assign-btn"
                                    onClick={() => setShowAssignDrawer(false)}
                                    disabled={assignSaving || assignDistributing}
                                    style={{
                                        flex: 1, padding: "12px", borderRadius: "10px",
                                        border: "2px solid #e2e8f0", background: "#fff",
                                        color: "#64748b", fontWeight: 600, cursor: "pointer", fontSize: "14px"
                                    }}
                                >Cancel</button>
                                <button
                                    id="save-auto-assign-btn"
                                    disabled={assignSaving || assignDistributing}
                                    onClick={async () => {
                                        setAssignSaving(true);
                                        const selectedUsers_ = assignUsers
                                            .filter(u => u.checked)
                                            .map(u => ({ user_uuid: u.user_uuid, user_name: u.user_name, frequency: u.frequency }));
                                        try {
                                            const res: any = await dispatch(pipelineAssignmentConfigSave({
                                                tenant_uuid: tenantUuid,
                                                enabled: assignEnabled,
                                                users: selectedUsers_,
                                            }));
                                            if (res?.payload?.statusCode >= 400 || res?.error) {
                                                Danger(res?.payload?.message || "Failed to save config");
                                            } else {
                                                Success("Auto-assign config saved!");
                                                setShowAssignDrawer(false);
                                            }
                                        } catch {
                                            Danger("Failed to save config");
                                        } finally {
                                            setAssignSaving(false);
                                        }
                                    }}
                                    style={{
                                        flex: 2, padding: "12px", borderRadius: "10px",
                                        border: "none",
                                        background: (assignSaving || assignDistributing)
                                            ? "#94a3b8"
                                            : "linear-gradient(135deg,#342df2,#7c3aed)",
                                        color: "#fff", fontWeight: 700, cursor: (assignSaving || assignDistributing) ? "wait" : "pointer", fontSize: "14px",
                                        boxShadow: (assignSaving || assignDistributing) ? "none" : "0 4px 14px rgba(52,45,242,0.35)",
                                        transition: "all .2s"
                                    }}
                                >
                                    {assignSaving ? "Saving..." : "Save Config"}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* ═══════════════════════════════════════
               FLOATING BULK ACTION BAR
            ═══════════════════════════════════════ */}
            {selectedLeadIds.length > 0 && (
                <div style={{
                    position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
                    background: "rgba(15, 23, 42, 0.94)",
                    backdropFilter: "blur(14px)",
                    borderRadius: "18px",
                    padding: "10px 20px",
                    boxShadow: "0 20px 50px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.12)",
                    display: "flex", alignItems: "center", gap: 16,
                    zIndex: 9990,
                    animation: "fadeIn .2s ease-out",
                    color: "#fff"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{
                            background: "linear-gradient(135deg,#342df2,#7c3aed)",
                            color: "#fff", fontSize: "12px", fontWeight: 800,
                            padding: "3px 11px", borderRadius: "12px",
                            boxShadow: "0 2px 8px rgba(52,45,242,0.4)"
                        }}>
                            {selectedLeadIds.length}
                        </span>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "#f8fafc" }}>
                            {selectedLeadIds.length === 1 ? "lead selected" : "leads selected"}
                        </span>
                    </div>

                    <div style={{ height: 20, width: 1, background: "rgba(255,255,255,0.2)" }} />

                    {/* Select All Across All Stages button */}
                    {!isAllLeadsSelected && (
                        <button
                            type="button"
                            onClick={toggleSelectAllLeads}
                            style={{
                                background: "rgba(255,255,255,0.12)", border: "none",
                                color: "#fff", padding: "6px 14px", borderRadius: "8px",
                                fontSize: "12px", fontWeight: 600, cursor: "pointer",
                                transition: "all .15s"
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.22)")}
                            onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
                        >
                            Select All ({totalLeads})
                        </button>
                    )}

                    {/* Clear selection */}
                    <button
                        type="button"
                        onClick={() => setSelectedLeadIds([])}
                        style={{
                            background: "transparent", border: "none",
                            color: "#94a3b8", padding: "6px 10px", borderRadius: "8px",
                            fontSize: "12px", fontWeight: 600, cursor: "pointer",
                            transition: "all .15s"
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                        onMouseLeave={e => (e.currentTarget.style.color = "#94a3b8")}
                    >
                        Deselect All
                    </button>

                    {/* Batch Update Selected Button */}
                    <button
                        type="button"
                        id="bulk-update-selected-btn"
                        onClick={() => {
                            setBulkUpdateCampaignUuid("");
                            setBulkUpdateLeadGroupUuid("");
                            setBulkUpdateUserUuid("");
                            setBulkUpdateStageUuid("");
                            setShowBulkUpdateModal(true);
                        }}
                        style={{
                            background: "linear-gradient(135deg, #342df2, #7c3aed)",
                            border: "none", color: "#fff",
                            padding: "8px 18px", borderRadius: "10px",
                            fontSize: "13px", fontWeight: 700, cursor: "pointer",
                            display: "flex", alignItems: "center", gap: 7,
                            boxShadow: "0 4px 16px rgba(52,45,242,0.45)",
                            transition: "all .15s"
                        }}
                        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.03)")}
                        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                    >
                        <Ic.Edit />
                        <span>Batch Update ({selectedLeadIds.length})</span>
                    </button>

                    {/* Delete Selected Button */}
                    <button
                        type="button"
                        id="bulk-delete-selected-btn"
                        onClick={() => setShowBulkDeleteModal(true)}
                        style={{
                            background: "linear-gradient(135deg, #ef4444, #dc2626)",
                            border: "none", color: "#fff",
                            padding: "8px 18px", borderRadius: "10px",
                            fontSize: "13px", fontWeight: 700, cursor: "pointer",
                            display: "flex", alignItems: "center", gap: 7,
                            boxShadow: "0 4px 16px rgba(239,68,68,0.45)",
                            transition: "all .15s"
                        }}
                        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.03)")}
                        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                    >
                        <Ic.Trash />
                        <span>Delete Selected ({selectedLeadIds.length})</span>
                    </button>
                </div>
            )}

            {/* ═══════════════════════════════════════
               BATCH UPDATE MODAL
            ═══════════════════════════════════════ */}
            {showBulkUpdateModal && (
                <div style={{
                    position: "fixed", inset: 0, zIndex: 10000,
                    background: "rgba(15, 23, 42, 0.48)", backdropFilter: "blur(5px)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: 16
                }}
                    onClick={() => !bulkUpdating && setShowBulkUpdateModal(false)}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            background: "#fff", borderRadius: "24px", padding: "28px",
                            boxShadow: "0 25px 65px rgba(0,0,0,0.25)",
                            width: "100%", maxWidth: 460,
                            animation: "fadeUp .2s ease-out",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                            <div style={{
                                width: 46, height: 46, borderRadius: "14px",
                                background: "linear-gradient(135deg, rgba(52,45,242,0.12), rgba(124,58,237,0.15))",
                                color: "#342df2",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "20px", flexShrink: 0
                            }}>
                                <Ic.Edit />
                            </div>
                            <div>
                                <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#1e1b4b", margin: "0 0 4px" }}>
                                    Batch Update ({selectedLeadIds.length} Selected)
                                </h3>
                                <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
                                    Choose fields to batch update across all selected leads. Unchanged fields remain untouched.
                                </p>
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
                            {/* Campaign */}
                            <div>
                                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "12px", fontWeight: 700, color: "#374151", marginBottom: 6 }}>
                                    <span style={{ color: "#7c3aed", display: "flex" }}><Ic.Megaphone /></span>
                                    <span>Campaign</span>
                                </label>
                                <select
                                    value={bulkUpdateCampaignUuid}
                                    onChange={e => setBulkUpdateCampaignUuid(e.target.value)}
                                    style={{
                                        width: "100%", padding: "10px 14px", borderRadius: "10px",
                                        border: "1.5px solid #e2e8f0", fontSize: "13px", color: "#1e1b4b",
                                        background: "#f8fafc", outline: "none", cursor: "pointer"
                                    }}
                                >
                                    <option value="">-- Keep Current Campaign --</option>
                                    {(campaignOptions || []).map((c: any) => (
                                        <option key={c.value} value={c.value}>
                                            {c.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Lead Group */}
                            <div>
                                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "12px", fontWeight: 700, color: "#374151", marginBottom: 6 }}>
                                    <span style={{ color: "#0284c7", display: "flex" }}><Ic.Folder /></span>
                                    <span>Lead Group</span>
                                </label>
                                <select
                                    value={bulkUpdateLeadGroupUuid}
                                    onChange={e => setBulkUpdateLeadGroupUuid(e.target.value)}
                                    style={{
                                        width: "100%", padding: "10px 14px", borderRadius: "10px",
                                        border: "1.5px solid #e2e8f0", fontSize: "13px", color: "#1e1b4b",
                                        background: "#f8fafc", outline: "none", cursor: "pointer"
                                    }}
                                >
                                    <option value="">-- Keep Current Group --</option>
                                    {(leadGroupOptions || []).map((g: any) => (
                                        <option key={g.value} value={g.value}>
                                            {g.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Assigned User / Agent */}
                            <div>
                                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "12px", fontWeight: 700, color: "#374151", marginBottom: 6 }}>
                                    <span style={{ color: "#4f46e5", display: "flex" }}><Ic.User /></span>
                                    <span>Assigned User</span>
                                </label>
                                <select
                                    value={bulkUpdateUserUuid}
                                    onChange={e => setBulkUpdateUserUuid(e.target.value)}
                                    style={{
                                        width: "100%", padding: "10px 14px", borderRadius: "10px",
                                        border: "1.5px solid #e2e8f0", fontSize: "13px", color: "#1e1b4b",
                                        background: "#f8fafc", outline: "none", cursor: "pointer"
                                    }}
                                >
                                    <option value="">-- Keep Current User --</option>
                                    {(userOptions || []).map((u: any) => (
                                        <option key={u.value} value={u.value}>
                                            {u.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Move to Stage (Optional) */}
                            <div>
                                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "12px", fontWeight: 700, color: "#374151", marginBottom: 6 }}>
                                    <span style={{ color: "#059669", display: "flex" }}><Ic.Layers /></span>
                                    <span>Move to Stage</span>
                                </label>
                                <select
                                    value={bulkUpdateStageUuid}
                                    onChange={e => setBulkUpdateStageUuid(e.target.value)}
                                    style={{
                                        width: "100%", padding: "10px 14px", borderRadius: "10px",
                                        border: "1.5px solid #e2e8f0", fontSize: "13px", color: "#1e1b4b",
                                        background: "#f8fafc", outline: "none", cursor: "pointer"
                                    }}
                                >
                                    <option value="">-- Keep Current Stage --</option>
                                    {(visibleStages || []).map((s: any) => (
                                        <option key={s.id} value={s.id}>
                                            {s.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 12 }}>
                            <button
                                type="button"
                                onClick={() => setShowBulkUpdateModal(false)}
                                disabled={bulkUpdating}
                                style={{
                                    flex: 1, padding: "11px 0", borderRadius: "10px",
                                    border: "1.5px solid #e5e7eb", background: "#fff",
                                    color: "#64748b", fontSize: "13px", fontWeight: 600,
                                    cursor: "pointer"
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmBulkUpdate}
                                disabled={bulkUpdating}
                                style={{
                                    flex: 1.5, padding: "11px 0", borderRadius: "10px",
                                    background: bulkUpdating ? "#94a3b8" : "linear-gradient(135deg, #342df2, #7c3aed)",
                                    color: "#fff", fontSize: "13px", fontWeight: 700, border: "none",
                                    cursor: bulkUpdating ? "not-allowed" : "pointer",
                                    boxShadow: bulkUpdating ? "none" : "0 6px 20px rgba(52,45,242,0.35)",
                                    opacity: bulkUpdating ? 0.7 : 1,
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8
                                }}
                            >
                                <Ic.Check />
                                <span>{bulkUpdating ? "Updating..." : `Update ${selectedLeadIds.length} Leads`}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════
               BULK DELETE CONFIRMATION MODAL
            ═══════════════════════════════════════ */}
            {showBulkDeleteModal && (
                <div style={{
                    position: "fixed", inset: 0, zIndex: 10000,
                    background: "rgba(15, 23, 42, 0.48)", backdropFilter: "blur(5px)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: 16
                }}
                    onClick={() => !bulkDeleting && setShowBulkDeleteModal(false)}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            background: "#fff", borderRadius: "24px", padding: "28px",
                            boxShadow: "0 25px 65px rgba(0,0,0,0.25)",
                            width: "100%", maxWidth: 390,
                            animation: "fadeUp .2s ease-out",
                            textAlign: "center"
                        }}
                    >
                        <div style={{
                            width: 52, height: 52, borderRadius: "50%",
                            background: "rgba(239, 68, 68, 0.12)",
                            color: "#ef4444", margin: "0 auto 16px",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "22px"
                        }}>
                            <Ic.Trash />
                        </div>
                        <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#1e1b4b", margin: "0 0 8px" }}>
                            Delete {selectedLeadIds.length} Selected Lead{selectedLeadIds.length > 1 ? "s" : ""}?
                        </h3>
                        <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 22px", lineHeight: 1.5 }}>
                            Are you sure you want to remove <strong style={{ color: "#ef4444" }}>{selectedLeadIds.length} selected lead{selectedLeadIds.length > 1 ? "s" : ""}</strong> from your Kanban board?
                        </p>
                        <div style={{ display: "flex", gap: 12 }}>
                            <button
                                type="button"
                                onClick={() => setShowBulkDeleteModal(false)}
                                disabled={bulkDeleting}
                                style={{
                                    flex: 1, padding: "10px 0", borderRadius: "10px",
                                    border: "1.5px solid #e5e7eb", background: "#fff",
                                    color: "#64748b", fontSize: "13px", fontWeight: 600,
                                    cursor: "pointer"
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmBulkDelete}
                                disabled={bulkDeleting}
                                style={{
                                    flex: 1.4, padding: "10px 0", borderRadius: "10px",
                                    background: bulkDeleting ? "#94a3b8" : "linear-gradient(135deg,#ef4444,#dc2626)",
                                    color: "#fff", fontSize: "13px", fontWeight: 700, border: "none",
                                    cursor: bulkDeleting ? "not-allowed" : "pointer",
                                    boxShadow: bulkDeleting ? "none" : "0 6px 20px rgba(239,68,68,0.35)",
                                    opacity: bulkDeleting ? 0.7 : 1
                                }}
                            >
                                {bulkDeleting ? "Deleting..." : `Delete ${selectedLeadIds.length} Leads`}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TenantPipelines;
