"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { useAppDispatch } from "@/redux/hooks";
import {
    useServerSync,
    fetchServers,
    validatePipeline,
    previewSync,
    executeSync,
    fetchSyncHistory,
    fetchSyncHistoryById,
    fetchModuleRecords,
    clearModuleRecordsCache,
} from "@/redux/slice/master-admin/serverSyncSlice";
import { Danger, Success } from "@/redux/services/toasterServices";

// MODULE DEFINITIONS WITH METADATA & CATEGORIES
const MODULE_CONFIGS = [
    {
        key: "TENANT_ROLE",
        label: "Tenant Role",
        desc: "Role permissions and authorization levels",
        category: "Tenants",
        categoryColor: "bg-indigo-100 text-indigo-800 border-indigo-300",
        icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    },
    {
        key: "TENANT",
        label: "Tenants",
        desc: "Tenant profile, domain, timezone & company settings",
        category: "Tenants",
        categoryColor: "bg-indigo-100 text-indigo-800 border-indigo-300",
        icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    },
    {
        key: "USER_ROLE",
        label: "User Role",
        desc: "Agent, supervisor & operator permissions (PBX / CC modes)",
        category: "Users",
        categoryColor: "bg-sky-100 text-sky-800 border-sky-300",
        icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    },
    {
        key: "USER_GROUP",
        label: "User Group",
        desc: "Agent distribution teams and outbound dial routing groups",
        category: "Users",
        categoryColor: "bg-sky-100 text-sky-800 border-sky-300",
        icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
    },
    {
        key: "USERS",
        label: "Users",
        desc: "Agent credentials, login accounts, permissions & user profiles",
        category: "Users",
        categoryColor: "bg-sky-100 text-sky-800 border-sky-300",
        icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    },
    {
        key: "SIP_DEVICES",
        label: "SIP Devices",
        desc: "SIP extensions, softphones, endpoints, caller IDs & device profiles",
        category: "Users",
        categoryColor: "bg-sky-100 text-sky-800 border-sky-300",
        icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z",
    },
    {
        key: "TRUNK",
        label: "SIP Trunk",
        desc: "SIP gateways, authentication profiles & PSTN carriers",
        category: "Outgoing Rules",
        categoryColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
        icon: "M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    },
    {
        key: "OUTGOING_RULES",
        label: "Outgoing Rules",
        desc: "Prefix matching, gateway selection & failover dial plans",
        category: "Outgoing Rules",
        categoryColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
        icon: "M13 7l5 5m0 0l-5 5m5-5H6",
    },
    {
        key: "DID",
        label: "DID Numbers",
        desc: "Virtual numbers, IVR mappings & direct inbound routing",
        category: "Incoming Rules",
        categoryColor: "bg-orange-100 text-orange-800 border-orange-300",
        icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
    },
    {
        key: "IP_MAPPING",
        label: "IP Mapping",
        desc: "Network IP mappings, SIP gateways & domain bindings",
        category: "Incoming Rules",
        categoryColor: "bg-orange-100 text-orange-800 border-orange-300",
        icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9",
    },
    {
        key: "BREAK_CODE",
        label: "Break Codes",
        desc: "Pause reasons, agent aux states & billing classifications",
        category: "Lead Management",
        categoryColor: "bg-amber-100 text-amber-900 border-amber-300",
        icon: "M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
        key: "DISPOSITION",
        label: "Call Dispositions",
        desc: "Wrap-up outcomes, sale triggers & callback statuses",
        category: "Lead Management",
        categoryColor: "bg-amber-100 text-amber-900 border-amber-300",
        icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
    },
    {
        key: "CAMPAIGN_LEAD_GROUP",
        label: "Lead Groups",
        desc: "Contact lists, phone registries, lead partitions & batches",
        category: "Lead Management",
        categoryColor: "bg-amber-100 text-amber-900 border-amber-300",
        icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
    },
    {
        key: "CAMPAIGN",
        label: "Campaigns",
        desc: "Auto-dialers, predictive pacing, lead routing & queue logic",
        category: "Contact Center",
        categoryColor: "bg-rose-100 text-rose-800 border-rose-300",
        icon: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z",
    },
    {
        key: "VOICE_BROADCAST",
        label: "Voice Broadcast",
        desc: "Audio broadcast campaigns, IVR surveys and automated dialers",
        category: "Broadcasting",
        categoryColor: "bg-purple-100 text-purple-800 border-purple-300",
        icon: "M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z",
    },
];

const CATEGORIES = ["ALL", "Tenants", "Users", "Outgoing Rules", "Incoming Rules", "Lead Management", "Contact Center", "Broadcasting"];

const CATEGORY_STYLES: Record<string, { label: string; active: string; inactive: string }> = {
    ALL: {
        label: "All Categories",
        active: "bg-slate-900 text-white border-slate-900 shadow-sm shadow-slate-900/25",
        inactive: "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200",
    },
    Tenants: {
        label: "Tenants",
        active: "bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/25",
        inactive: "bg-indigo-100/70 text-indigo-800 border-indigo-200 hover:bg-indigo-100",
    },
    Users: {
        label: "Users",
        active: "bg-sky-600 text-white border-sky-600 shadow-sm shadow-sky-500/25",
        inactive: "bg-sky-100/70 text-sky-800 border-sky-200 hover:bg-sky-100",
    },
    "Outgoing Rules": {
        label: "Outgoing Rules",
        active: "bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-500/25",
        inactive: "bg-emerald-100/70 text-emerald-800 border-emerald-200 hover:bg-emerald-100",
    },
    "Incoming Rules": {
        label: "Incoming Rules",
        active: "bg-orange-600 text-white border-orange-600 shadow-sm shadow-orange-500/25",
        inactive: "bg-orange-100/70 text-orange-800 border-orange-200 hover:bg-orange-100",
    },
    "Lead Management": {
        label: "Lead Management",
        active: "bg-amber-500 text-white border-amber-500 shadow-sm shadow-amber-500/25",
        inactive: "bg-amber-100/70 text-amber-900 border-amber-200 hover:bg-amber-100",
    },
    "Contact Center": {
        label: "Contact Center",
        active: "bg-rose-600 text-white border-rose-600 shadow-sm shadow-rose-500/25",
        inactive: "bg-rose-100/70 text-rose-800 border-rose-200 hover:bg-rose-100",
    },
    Broadcasting: {
        label: "Broadcasting",
        active: "bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-500/25",
        inactive: "bg-purple-100/70 text-purple-800 border-purple-200 hover:bg-purple-100",
    },
};

const MODULE_CATEGORY_THEMES: Record<
    string,
    {
        selectedBorder: string;
        headerHover: string;
        checkboxChecked: string;
        sequenceBadge: string;
        iconBg: string;
        reviewBtnExpanded: string;
    }
> = {
    Tenants: {
        selectedBorder: "border-indigo-400/90 bg-white ring-2 ring-indigo-500/20 shadow-md shadow-indigo-500/5",
        headerHover: "hover:bg-indigo-50/40",
        checkboxChecked: "bg-indigo-600 border-indigo-600 shadow-2xs shadow-indigo-600/30",
        sequenceBadge: "bg-indigo-100 text-indigo-800 border border-indigo-200",
        iconBg: "bg-indigo-50 text-indigo-600 border border-indigo-200/60",
        reviewBtnExpanded: "bg-indigo-600 text-white shadow-md shadow-indigo-600/20",
    },
    Users: {
        selectedBorder: "border-sky-400/90 bg-white ring-2 ring-sky-500/20 shadow-md shadow-sky-500/5",
        headerHover: "hover:bg-sky-50/40",
        checkboxChecked: "bg-sky-600 border-sky-600 shadow-2xs shadow-sky-600/30",
        sequenceBadge: "bg-sky-100 text-sky-800 border border-sky-200",
        iconBg: "bg-sky-50 text-sky-600 border border-sky-200/60",
        reviewBtnExpanded: "bg-sky-600 text-white shadow-md shadow-sky-600/20",
    },
    "Outgoing Rules": {
        selectedBorder: "border-emerald-400/90 bg-white ring-2 ring-emerald-500/20 shadow-md shadow-emerald-500/5",
        headerHover: "hover:bg-emerald-50/40",
        checkboxChecked: "bg-emerald-600 border-emerald-600 shadow-2xs shadow-emerald-600/30",
        sequenceBadge: "bg-emerald-100 text-emerald-800 border border-emerald-200",
        iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-200/60",
        reviewBtnExpanded: "bg-emerald-600 text-white shadow-md shadow-emerald-600/20",
    },
    "Incoming Rules": {
        selectedBorder: "border-orange-400/90 bg-white ring-2 ring-orange-500/20 shadow-md shadow-orange-500/5",
        headerHover: "hover:bg-orange-50/40",
        checkboxChecked: "bg-orange-600 border-orange-600 shadow-2xs shadow-orange-600/30",
        sequenceBadge: "bg-orange-100 text-orange-800 border border-orange-200",
        iconBg: "bg-orange-50 text-orange-600 border border-orange-200/60",
        reviewBtnExpanded: "bg-orange-600 text-white shadow-md shadow-orange-600/20",
    },
    "Lead Management": {
        selectedBorder: "border-amber-400/90 bg-white ring-2 ring-amber-500/20 shadow-md shadow-amber-500/5",
        headerHover: "hover:bg-amber-50/40",
        checkboxChecked: "bg-amber-500 border-amber-500 shadow-2xs shadow-amber-500/30",
        sequenceBadge: "bg-amber-100 text-amber-800 border border-amber-200",
        iconBg: "bg-amber-50 text-amber-700 border border-amber-200/60",
        reviewBtnExpanded: "bg-amber-500 text-white shadow-md shadow-amber-500/20",
    },
    "Contact Center": {
        selectedBorder: "border-rose-400/90 bg-white ring-2 ring-rose-500/20 shadow-md shadow-rose-500/5",
        headerHover: "hover:bg-rose-50/40",
        checkboxChecked: "bg-rose-600 border-rose-600 shadow-2xs shadow-rose-600/30",
        sequenceBadge: "bg-rose-100 text-rose-800 border border-rose-200",
        iconBg: "bg-rose-50 text-rose-600 border border-rose-200/60",
        reviewBtnExpanded: "bg-rose-600 text-white shadow-md shadow-rose-600/20",
    },
    Broadcasting: {
        selectedBorder: "border-purple-400/90 bg-white ring-2 ring-purple-500/20 shadow-md shadow-purple-500/5",
        headerHover: "hover:bg-purple-50/40",
        checkboxChecked: "bg-purple-600 border-purple-600 shadow-2xs shadow-purple-600/30",
        sequenceBadge: "bg-purple-100 text-purple-800 border border-purple-200",
        iconBg: "bg-purple-50 text-purple-600 border border-purple-200/60",
        reviewBtnExpanded: "bg-purple-600 text-white shadow-md shadow-purple-600/20",
    },
};

// KNOWN FALLBACK SERVER IP LOOKUP
const KNOWN_SERVER_IPS: Record<string, string> = {
    system: "127.0.0.1:27017",
    development: "10.180.67.151:27017",
    local: "10.180.10.133:27017",
    server_224: "40.81.228.224:27017",
    ovh: "148.113.37.25:3870",
    ishan: "103.36.121.196:27017",
    handicraft: "10.180.67.152:27017",
};

export const getServerDisplayIp = (server?: { ip?: string; server_key?: string; id?: string; name?: string; server_name?: string } | null): string => {
    if (!server) return "";
    if (server.ip && server.ip.trim() && server.ip !== "MongoDB Instance") {
        return server.ip.split("/")[0];
    }
    const key = (server.server_key || server.id || "").toLowerCase();
    if (KNOWN_SERVER_IPS[key]) {
        return KNOWN_SERVER_IPS[key];
    }
    for (const [k, v] of Object.entries(KNOWN_SERVER_IPS)) {
        if (key.includes(k) || ((server.server_name || server.name) && (server.server_name || server.name)!.toLowerCase().includes(k))) {
            return v;
        }
    }
    return "";
};

// CUSTOM MODERN SERVER SELECT DROPDOWN
interface CustomServerSelectProps {
    label: string;
    badgeText: string;
    subLabel: string;
    theme: "emerald" | "blue";
    value: string;
    onChange: (val: string) => void;
    servers: Array<{
        server_key?: string;
        server_name?: string;
        id: string;
        name: string;
        ip?: string;
        isLocal?: boolean;
        isCurrent?: boolean;
        is_current?: boolean;
        prefix?: string;
        status?: string;
        description?: string;
    }>;
    excludeServerVal?: string;
    placeholder?: string;
    isLocked?: boolean;
    lockReason?: string;
    connectionStatus?: string;
    latencyMs?: number;
    isLoading?: boolean;
    isValidating?: boolean;
    showReconnect?: boolean;
    isReconnecting?: boolean;
    onReconnect?: () => void;
}

const CustomServerSelect: React.FC<CustomServerSelectProps> = ({
    label,
    badgeText,
    subLabel,
    theme,
    value,
    onChange,
    servers,
    excludeServerVal,
    placeholder = "Select Server...",
    isLocked = false,
    lockReason,
    connectionStatus,
    latencyMs,
    isLoading = false,
    isValidating = false,
    showReconnect = false,
    isReconnecting = false,
    onReconnect,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Filter available options
    const availableServers = useMemo(() => {
        return servers.filter((s) => {
            // Strictly exclude inactive servers
            if ((s as any).is_active === false || (s as any).is_active === "false" || s.status === "Inactive") {
                return false;
            }
            const serverVal = s.server_key || s.id || s.ip;
            if (
                excludeServerVal &&
                (serverVal === excludeServerVal ||
                    s.server_key === excludeServerVal ||
                    s.id === excludeServerVal ||
                    s.ip === excludeServerVal)
            ) {
                return false;
            }
            if (!searchQuery.trim()) return true;
            const query = searchQuery.toLowerCase();
            const serverIp = getServerDisplayIp(s).toLowerCase();
            return (
                (s.server_name && s.server_name.toLowerCase().includes(query)) ||
                (s.name && s.name.toLowerCase().includes(query)) ||
                (s.server_key && s.server_key.toLowerCase().includes(query)) ||
                (s.ip && s.ip.toLowerCase().includes(query)) ||
                serverIp.includes(query) ||
                (s.prefix && s.prefix.toLowerCase().includes(query))
            );
        });
    }, [servers, excludeServerVal, searchQuery]);

    const selectedServer = useMemo(() => {
        if (!value) return null;
        return (
            servers.find(
                (s) =>
                    (s.server_key && s.server_key === value) ||
                    (s.id && s.id === value) ||
                    (s.ip && s.ip === value) ||
                    (s.server_name && s.server_name === value) ||
                    (s.name && s.name === value)
            ) || null
        );
    }, [servers, value]);

    const isEmerald = theme === "emerald";
    const selectedIp = getServerDisplayIp(selectedServer);

    return (
        <div className={`p-4 rounded-xl border transition shadow-xs relative ${isLocked ? "bg-emerald-50/20 border-emerald-300/80" : "bg-white border-slate-200/80 hover:border-slate-300"}`} ref={dropdownRef}>
            {/* Header / Badge */}
            <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2 flex-wrap">
                    <span
                        className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${
                            isEmerald
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200/80"
                                : "bg-blue-50 text-blue-800 border-blue-200/80"
                        }`}
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isEmerald ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            )}
                        </svg>
                        {label}
                    </span>

                    {/* RECONNECT ACTION BUTTON NEXT TO TARGET SERVER LABEL */}
                    {showReconnect && onReconnect && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!isReconnecting && !isValidating) {
                                    onReconnect();
                                }
                            }}
                            disabled={isReconnecting || isValidating}
                            title="Reconnect and test target server connection"
                            className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-md transition shadow-2xs border ${
                                isReconnecting || isValidating
                                    ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                                    : "bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300 hover:border-amber-400 active:scale-95 cursor-pointer"
                            }`}
                        >
                            <svg
                                className={`w-3 h-3 ${isReconnecting || isValidating ? "animate-spin text-blue-600" : "text-amber-700"}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2.5"
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                            <span>{isReconnecting || isValidating ? "Reconnecting..." : "Reconnect"}</span>
                        </button>
                    )}
                </div>

                {isLocked ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <svg className="w-3 h-3 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Current Logged-in Server
                    </span>
                ) : (
                    <span className="text-[11px] font-semibold text-slate-400">{badgeText}</span>
                )}
            </div>

            {/* Custom Interactive Trigger or Locked Card */}
            {isLocked ? (
                <div className="w-full text-left bg-white/95 border border-emerald-200/90 rounded-xl px-3 py-2.5 flex items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border bg-emerald-100/70 text-emerald-800 border-emerald-200">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                            </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                            {selectedServer ? (
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-xs sm:text-sm font-black text-slate-900 truncate">
                                            {selectedServer.server_name || selectedServer.name}
                                        </span>
                                        {/* <span className="inline-flex items-center text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-emerald-600 text-white shadow-2xs">
                                            Active Source
                                        </span> */}
                                    </div>
                                    <div className="flex items-center gap-1.5 flex-wrap font-mono text-[11px] text-emerald-900 font-semibold truncate mt-1">
                                        {selectedIp && (
                                            <span className="inline-flex items-center gap-1 bg-emerald-100/90 text-emerald-900 px-1.5 py-0.5 rounded text-[10.5px] font-bold border border-emerald-300/90">
                                                <svg className="w-2.5 h-2.5 text-emerald-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                                </svg>
                                                IP: {selectedIp}
                                            </span>
                                        )}
                                        <span className="text-emerald-700/80 text-[10px]">({selectedServer.server_key || selectedServer.id})</span>
                                    </div>
                                </div>
                            ) : (
                                <span className="text-xs sm:text-sm font-semibold text-slate-400">
                                    {isLoading ? "Loading servers..." : "Detecting current server..."}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            MongoDB Connected {latencyMs ? `(${latencyMs}ms)` : ""}
                        </span>
                    </div>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => setIsOpen((prev) => !prev)}
                    className={`w-full text-left bg-slate-50/80 hover:bg-slate-50 border rounded-xl px-3 py-2.5 transition flex items-center justify-between gap-3 shadow-2xs group cursor-pointer ${
                        isOpen
                            ? isEmerald
                                ? "ring-2 ring-emerald-500/40 border-emerald-500 bg-white"
                                : "ring-2 ring-blue-500/40 border-blue-500 bg-white"
                            : "border-slate-200 hover:border-slate-300"
                    }`}
                >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        {/* Server Icon */}
                        <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border transition ${
                                isEmerald
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200/80 group-hover:bg-emerald-100/80"
                                    : "bg-blue-50 text-blue-700 border-blue-200/80 group-hover:bg-blue-100/80"
                            }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                            </svg>
                        </div>

                        {/* Server Info Details */}
                        <div className="min-w-0 flex-1">
                            {selectedServer ? (
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                                            {selectedServer.server_name || selectedServer.name}
                                        </span>
                                        {(selectedServer.isCurrent || selectedServer.is_current) && (
                                            <span className="inline-flex items-center text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                                                Current
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1.5 flex-wrap font-mono text-[11px] text-slate-700 font-medium truncate mt-1">
                                        {selectedIp && (
                                            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-900 px-1.5 py-0.5 rounded text-[10.5px] font-bold border border-blue-200">
                                                <svg className="w-2.5 h-2.5 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                                </svg>
                                                IP: {selectedIp}
                                            </span>
                                        )}
                                        <span className="text-slate-400 text-[10px]">({selectedServer.server_key || selectedServer.id})</span>
                                    </div>
                                </div>
                            ) : (
                                <span className="text-xs sm:text-sm font-semibold text-slate-400">
                                    {isLoading ? "Loading servers..." : placeholder}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Right Status Badge & Animated Arrow */}
                    <div className="flex items-center gap-2 shrink-0">
                        {selectedServer && (
                            <>
                                {isValidating || isReconnecting ? (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 bg-blue-100/90 px-2 py-0.5 rounded-full border border-blue-200">
                                        <svg className="animate-spin h-2.5 w-2.5 text-blue-600" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                        </svg>
                                        {isReconnecting ? "Reconnecting..." : "Connecting..."}
                                    </span>
                                ) : connectionStatus === "Connected" || (latencyMs !== undefined && latencyMs !== null) ? (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-200">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                        MongoDB Connected {latencyMs !== undefined && latencyMs !== null ? `(${latencyMs}ms)` : ""}
                                    </span>
                                ) : connectionStatus === "Failed" || connectionStatus === "Disconnected" ? (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-100/90 px-2 py-0.5 rounded-full border border-rose-200">
                                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                        Disconnected
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-200">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                        MongoDB Connected {latencyMs ? `(${latencyMs}ms)` : ""}
                                    </span>
                                )}
                            </>
                        )}
                        <div
                            className={`w-6 h-6 rounded-md flex items-center justify-center text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${
                                isOpen ? "rotate-180 text-slate-700" : ""
                            }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </button>
            )}

            {/* Sub-label Footer */}
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                <span>{isLocked && lockReason ? lockReason : subLabel}</span>
                <span className="font-mono font-semibold text-slate-500 truncate max-w-[240px]">
                    {selectedServer ? (selectedIp ? `IP: ${selectedIp}` : (selectedServer.server_key || selectedServer.id)) : "None Selected"}
                </span>
            </div>

            {/* Floating Custom Dropdown Menu */}
            {isOpen && (
                <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-150">
                    {/* Search inside menu */}
                    {servers.length > 3 && (
                        <div className="p-2.5 border-b border-slate-100 bg-slate-50/80 flex items-center gap-2">
                            <svg className="w-3.5 h-3.5 text-slate-400 ml-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                autoFocus
                                placeholder="Search server by name, IP or key..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 outline-none font-medium py-0.5"
                                onClick={(e) => e.stopPropagation()}
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSearchQuery("");
                                    }}
                                    className="p-1 text-slate-400 hover:text-slate-600 rounded"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    )}

                    {/* Options List */}
                    <div className="max-h-60 overflow-y-auto p-1.5 space-y-1">
                        {availableServers.length === 0 ? (
                            <div className="p-4 text-center text-xs text-slate-400 font-medium">
                                No available servers found
                            </div>
                        ) : (
                            availableServers.map((s) => {
                                const serverVal = s.server_key || s.id || s.ip || "";
                                const isSelected = value === serverVal || value === s.server_key || value === s.id;
                                const optionIp = getServerDisplayIp(s);

                                return (
                                    <button
                                        key={s.id || s.server_key}
                                        type="button"
                                        onClick={() => {
                                            onChange(serverVal);
                                            setIsOpen(false);
                                            setSearchQuery("");
                                        }}
                                        className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between gap-3 transition cursor-pointer ${
                                            isSelected
                                                ? isEmerald
                                                    ? "bg-emerald-50/90 text-emerald-950 font-bold border border-emerald-200/90 shadow-2xs"
                                                    : "bg-blue-50/90 text-blue-950 font-bold border border-blue-200/90 shadow-2xs"
                                                : "hover:bg-slate-50/90 text-slate-700 hover:text-slate-900 border border-transparent"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                            <div
                                                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                                                    isSelected
                                                        ? isEmerald
                                                            ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                                            : "bg-blue-100 text-blue-800 border-blue-300"
                                                        : "bg-slate-100 text-slate-600 border-slate-200"
                                                }`}
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                                                </svg>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-xs font-bold text-slate-900 truncate">
                                                        {s.server_name || s.name}
                                                    </span>
                                                    {(s.isLocal || s.isCurrent || s.is_current) && (
                                                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                                                            {s.isCurrent || s.is_current ? "Current" : "Local"}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1.5 flex-wrap font-mono text-[10.5px] text-slate-500 mt-1">
                                                    {optionIp && (
                                                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10.5px] font-bold border ${
                                                            isSelected
                                                                ? isEmerald
                                                                    ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                                                                    : "bg-blue-100 text-blue-900 border-blue-300"
                                                                : "bg-slate-100 text-slate-700 border-slate-200"
                                                        }`}>
                                                            <svg className="w-2.5 h-2.5 text-slate-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                                            </svg>
                                                            IP: {optionIp}
                                                        </span>
                                                    )}
                                                    <span className="text-slate-400 text-[10px]">({s.server_key || s.id})</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            {isSelected && (
                                                <div
                                                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                                        isEmerald ? "bg-emerald-600 text-white" : "bg-blue-600 text-white"
                                                    }`}
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const ServerDataSyncPage = () => {
    const dispatch = useAppDispatch();
    const {
        servers,
        currentServer,
        pipelineValidation,
        validatingPipeline,
        previewData,
        executionResult,
        historyData,
        moduleRecordsCache,
        moduleLoading,
        syncing,
    } = useServerSync();

    // ACTIVE TAB
    const [activeTab, setActiveTab] = useState<"sync" | "history">("sync");

    // RECONNECT STATE
    const [isReconnecting, setIsReconnecting] = useState(false);

    // FORM STATE
    const [sourceServer, setSourceServer] = useState<string>("");
    const [targetServer, setTargetServer] = useState<string>("");
    const [selectedModules, setSelectedModules] = useState<string[]>(MODULE_CONFIGS.map((m) => m.key));
    const [duplicateStrategy, setDuplicateStrategy] = useState<"SKIP" | "UPDATE" | "OVERWRITE">("SKIP");

    // FILTER & SEARCH
    const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
    const [globalModuleSearch, setGlobalModuleSearch] = useState<string>("");

    // EXPANDED MODULES STATE
    const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
        TENANT_ROLE: false,
        TENANT: false,
        USER_ROLE: false,
        USER_GROUP: false,
        USERS: false,
        SIP_DEVICES: false,
        DID: false,
        IP_MAPPING: false,
        TRUNK: false,
        OUTGOING_RULES: false,
        BREAK_CODE: false,
        DISPOSITION: false,
        CAMPAIGN: false,
        CAMPAIGN_LEAD_GROUP: false,
        VOICE_BROADCAST: false,
    });

    // SEARCH FILTERS PER MODULE RECORD
    const [moduleSearchQueries, setModuleSearchQueries] = useState<Record<string, string>>({});

    // MODAL STATES
    const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
    const [showExecutionModal, setShowExecutionModal] = useState<boolean>(false);
    const [selectedHistoryItem, setSelectedHistoryItem] = useState<any>(null);
    const [showHistoryDetailModal, setShowHistoryDetailModal] = useState<boolean>(false);
    const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
    const [activeErrorModule, setActiveErrorModule] = useState<any>(null);
    const [selectedRawRecord, setSelectedRawRecord] = useState<any>(null);
    const [showRecordDetailModal, setShowRecordDetailModal] = useState<boolean>(false);
    const [copiedJson, setCopiedJson] = useState<boolean>(false);
    const [historyPage, setHistoryPage] = useState<number>(1);

    // Initial Data Fetch
    useEffect(() => {
        dispatch(fetchServers());
        dispatch(fetchSyncHistory({ page: 1, limit: 10 }));
    }, [dispatch]);

    // Automatically bind source server to the detected current logged-in server & restore target from localStorage
    useEffect(() => {
        if (servers && servers.length > 0) {
            const detected =
                currentServer ||
                servers.find((s) => s.is_current || s.isCurrent) ||
                servers.find((s) => s.isLocal) ||
                servers[0];
            const detectedKey = detected.server_key || detected.id || detected.ip || "";

            // Enforce current server as source server
            setSourceServer(detectedKey);

            // Restore target server from localStorage if valid and active
            const savedTarget = typeof window !== "undefined" ? localStorage.getItem("ringingo_sync_target_server") : null;

            if (
                savedTarget &&
                savedTarget !== detectedKey &&
                servers.some((s) => (s.server_key === savedTarget || s.id === savedTarget || s.ip === savedTarget) && (s as any).status !== "Inactive")
            ) {
                const matchedTarget = servers.find((s) => s.server_key === savedTarget || s.id === savedTarget || s.ip === savedTarget);
                const targetKey = matchedTarget?.server_key || matchedTarget?.id || savedTarget;
                setTargetServer(targetKey);
            } else if (!targetServer || targetServer === detectedKey || targetServer === detected.id || targetServer === detected.ip) {
                const firstRemote = servers.find(
                    (s) =>
                        s.server_key !== detectedKey &&
                        s.id !== detectedKey &&
                        s.ip !== detectedKey &&
                        (s as any).status !== "Inactive"
                );
                if (firstRemote) {
                    const firstRemoteKey = firstRemote.server_key || firstRemote.id || firstRemote.ip || "";
                    setTargetServer(firstRemoteKey);
                    if (typeof window !== "undefined") {
                        localStorage.setItem("ringingo_sync_target_server", firstRemoteKey);
                    }
                }
            }
        }
    }, [servers, currentServer]);

    // Validate pipeline connectivity whenever source or target server changes
    useEffect(() => {
        if (sourceServer && targetServer && sourceServer !== targetServer) {
            dispatch(validatePipeline({ source_server: sourceServer, target_server: targetServer }));
        }
    }, [sourceServer, targetServer, dispatch]);

    // Auto-fetch data for all modules from the active Origin (Source Server) whenever source or target server changes
    useEffect(() => {
        if (sourceServer) {
            dispatch(clearModuleRecordsCache());
            MODULE_CONFIGS.forEach((m) => {
                dispatch(
                    fetchModuleRecords({
                        module: m.key,
                        source_server: sourceServer,
                        target_server: targetServer || undefined,
                    })
                );
            });
        }
    }, [sourceServer, targetServer, dispatch]);

    // RECONNECT / RECHECK TARGET SERVER
    const handleReconnectTarget = async () => {
        if (isReconnecting || validatingPipeline || !sourceServer || !targetServer || sourceServer === targetServer) {
            return;
        }

        setIsReconnecting(true);
        try {
            const res = await dispatch(
                validatePipeline({
                    source_server: sourceServer,
                    target_server: targetServer,
                })
            ).unwrap();

            const validatedData = res?.data || res;
            if (validatedData?.isReady && validatedData?.targetServer?.status === "Connected") {
                Success(
                    `Target Server "${validatedData.targetServer.server_name || validatedData.targetServer.name || targetServer}" reconnected successfully (${validatedData.targetServer.latencyMs || 0}ms)`
                );
                // Refresh data preview/records with newly reconnected target
                MODULE_CONFIGS.forEach((m) => {
                    dispatch(
                        fetchModuleRecords({
                            module: m.key,
                            source_server: sourceServer,
                            target_server: targetServer,
                        })
                    );
                });
            } else if (validatedData?.errors?.length > 0) {
                Danger(validatedData.errors[0]);
            } else {
                Danger("Reconnection check completed, but target server is not ready.");
            }
        } catch (err: any) {
            console.error("Reconnect target server failed:", err);
            Danger(err?.message || "Failed to reconnect target server.");
        } finally {
            setIsReconnecting(false);
        }
    };

    const showTargetReconnect = Boolean(
        targetServer &&
        sourceServer &&
        sourceServer !== targetServer &&
        (!pipelineValidation?.isReady || pipelineValidation?.targetServer?.status !== "Connected")
    );

    // MODULE SELECTION HELPERS
    const handleSelectAll = () => {
        setSelectedModules(MODULE_CONFIGS.map((m) => m.key));
    };

    const handleDeselectAll = () => {
        setSelectedModules([]);
    };

    const handleToggleModule = (key: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (selectedModules.includes(key)) {
            setSelectedModules(selectedModules.filter((m) => m !== key));
        } else {
            setSelectedModules([...selectedModules, key]);
            if (!expandedModules[key]) {
                toggleExpandModule(key);
            }
        }
    };

    const toggleExpandModule = (key: string) => {
        const nextState = !expandedModules[key];
        setExpandedModules((prev) => ({ ...prev, [key]: nextState }));

        if (nextState) {
            dispatch(
                fetchModuleRecords({
                    module: key,
                    source_server: sourceServer,
                    target_server: targetServer,
                })
            );
        }
    };

    const handleExpandAll = () => {
        const allExpanded: Record<string, boolean> = {};
        MODULE_CONFIGS.forEach((m) => {
            allExpanded[m.key] = true;
            dispatch(
                fetchModuleRecords({
                    module: m.key,
                    source_server: sourceServer,
                    target_server: targetServer,
                })
            );
        });
        setExpandedModules(allExpanded);
    };

    const handleCollapseAll = () => {
        const allCollapsed: Record<string, boolean> = {};
        MODULE_CONFIGS.forEach((m) => {
            allCollapsed[m.key] = false;
        });
        setExpandedModules(allCollapsed);
    };

    const handleSearchChange = (moduleKey: string, query: string) => {
        setModuleSearchQueries((prev) => ({ ...prev, [moduleKey]: query }));
    };

    // Filter modules by Category and Global Search
    const visibleModules = useMemo(() => {
        return MODULE_CONFIGS.filter((m) => {
            const matchesCategory = selectedCategory === "ALL" || m.category === selectedCategory;
            const matchesSearch =
                !globalModuleSearch ||
                m.label.toLowerCase().includes(globalModuleSearch.toLowerCase()) ||
                m.desc.toLowerCase().includes(globalModuleSearch.toLowerCase()) ||
                m.category.toLowerCase().includes(globalModuleSearch.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, globalModuleSearch]);

    // Selection & Expansion states for smart toggles
    const allSelected = selectedModules.length === MODULE_CONFIGS.length && MODULE_CONFIGS.length > 0;
    const anyExpanded = Object.values(expandedModules).some(Boolean);

    // Total staged records calculation
    const totalStagedRecords = useMemo(() => {
        let count = 0;
        selectedModules.forEach((modKey) => {
            const cache = moduleRecordsCache[modKey];
            if (cache?.total) count += cache.total;
        });
        return count;
    }, [selectedModules, moduleRecordsCache]);

    // PREVIEW DRY RUN
    const handlePreview = async () => {
        if (!sourceServer) {
            Danger("Current Source Server could not be identified");
            return;
        }
        if (!targetServer) {
            Danger("Please select a Destination Target Server");
            return;
        }
        if (sourceServer === targetServer) {
            Danger("Source Server and Target Destination cannot be the same server");
            return;
        }
        if (pipelineValidation && pipelineValidation.isReady === false && pipelineValidation.errors?.length > 0) {
            Danger(pipelineValidation.errors[0]);
            return;
        }
        if (selectedModules.length === 0) {
            Danger("Please select at least one module to preview");
            return;
        }

        try {
            await dispatch(
                previewSync({
                    source_server: sourceServer,
                    target_server: targetServer,
                    modules: selectedModules,
                })
            ).unwrap();
            setShowPreviewModal(true);
        } catch (err: any) {
            Danger(err?.message || "Failed to generate sync preview");
        }
    };

    // EXECUTE SYNC
    const handleExecuteSync = async () => {
        if (!sourceServer) {
            Danger("Current Source Server could not be identified");
            return;
        }
        if (!targetServer) {
            Danger("Please select a Destination Target Server");
            return;
        }
        if (sourceServer === targetServer) {
            Danger("Source Server and Target Destination cannot be the same server");
            return;
        }
        if (pipelineValidation && pipelineValidation.isReady === false && pipelineValidation.errors?.length > 0) {
            Danger(pipelineValidation.errors[0]);
            return;
        }
        if (selectedModules.length === 0) {
            Danger("Please select at least one module to synchronize");
            return;
        }

        setShowPreviewModal(false);

        try {
            await dispatch(
                executeSync({
                    source_server: sourceServer,
                    target_server: targetServer,
                    modules: selectedModules,
                    duplicate_strategy: duplicateStrategy,
                })
            ).unwrap();

            Success("Server data synchronization completed successfully!");
            setShowExecutionModal(true);
            dispatch(fetchSyncHistory({ page: 1, limit: 10 }));
        } catch (err: any) {
            Danger(err?.message || "Server data synchronization encountered an error");
        }
    };

    // VIEW HISTORY DETAIL
    const handleViewHistory = async (syncId: string) => {
        try {
            const res: any = await dispatch(fetchSyncHistoryById(syncId)).unwrap();
            setSelectedHistoryItem(res?.data || res);
            setShowHistoryDetailModal(true);
        } catch (err) {
            Danger("Failed to fetch sync history details");
        }
    };

    const handleCopyJson = (data: any) => {
        navigator.clipboard.writeText(JSON.stringify(data, null, 2));
        setCopiedJson(true);
        setTimeout(() => setCopiedJson(false), 2000);
        Success("JSON copied to clipboard");
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-slate-50/50 min-h-screen">
            {/* TOP BAR / BREADCRUMB */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        <span>Master Admin</span>
                        <span>/</span>
                        <span>Configuration Sync</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-tr from-emerald-600 to-teal-500 text-white rounded-xl shadow-md shadow-emerald-500/20">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                Server Data Synchronization
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
                                Review, validate, and clone tenant configuration and telephony data across environments seamlessly.
                            </p>
                        </div>
                    </div>
                </div>

                {/* SEGMENTED TAB SELECTOR */}
                <div className="flex items-center bg-white p-1 rounded-2xl shadow-sm border border-slate-200/80 self-start md:self-auto">
                    <button
                        onClick={() => setActiveTab("sync")}
                        className={`flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
                            activeTab === "sync"
                                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/25"
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                        }`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>Sync Console</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === "sync" ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-800"}`}>
                            {selectedModules.length}
                        </span>
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab("history");
                            dispatch(fetchSyncHistory({ page: historyPage, limit: 10 }));
                        }}
                        className={`flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
                            activeTab === "history"
                                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/25"
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                        }`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Audit History</span>
                        {(historyData?.total || 0) > 0 && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === "history" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"}`}>
                                {historyData.total}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* TAB 1: SYNC CONSOLE */}
            {activeTab === "sync" && (
                <div className="space-y-6">
                    {/* TOPOLOGY & PIPELINE CONFIGURATION */}
                    <div className="bg-white rounded-3xl p-6 lg:p-7 shadow-sm border border-slate-200/80">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-slate-100">
                            <div>
                                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Step 1: Configure Sync Pipeline & Strategy
                                </h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Choose where to pull source configurations from and specify destination routing.
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    {servers.length} Servers Available
                                </span>
                            </div>
                        </div>

                        {/* 2-COLUMN EQUAL SPLIT GRID: LEFT (PIPELINE) & RIGHT (STRATEGY) */}
                        <div className="grid grid-cols-2 gap-4 sm:gap-6 items-stretch">
                            {/* LEFT SIDE: CONFIGURE SYNC PIPELINE */}
                            <div className="flex flex-col justify-between bg-slate-50/50 p-4 sm:p-5 rounded-2xl border border-slate-200/70">
                                <div className="flex items-start justify-between gap-3 mb-3.5">
                                    <div>
                                        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                                            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                            </svg>
                                            Configure Sync Pipeline
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            Origin is locked to your current logged-in server; select target destination below.
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                            Pipeline Readiness
                                        </div>
                                        {pipelineValidation?.isReady ? (
                                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/90 px-2.5 py-1 rounded-full border border-emerald-300 shadow-2xs">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                Ready to Synchronize
                                            </span>
                                        ) : validatingPipeline || isReconnecting ? (
                                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-800 bg-blue-100/90 px-2.5 py-1 rounded-full border border-blue-300 shadow-2xs">
                                                <svg className="animate-spin h-3 w-3 text-blue-600" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                                </svg>
                                                {isReconnecting ? "Reconnecting Pipeline..." : "Validating Pipeline..."}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100/90 px-2.5 py-1 rounded-full border border-amber-300 shadow-2xs">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                                {targetServer ? "Pipeline Not Ready" : "Select Target Server"}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-3 flex-1 flex flex-col justify-between">
                                    {/* SOURCE NODE */}
                                    <CustomServerSelect
                                        label="Origin (Source Server)"
                                        badgeText="Read-Only"
                                        subLabel="Records exported from here"
                                        theme="emerald"
                                        value={sourceServer}
                                        onChange={() => {}}
                                        servers={servers}
                                        isLocked={true}
                                        lockReason="Active logged-in session server (Data Source)"
                                        connectionStatus={pipelineValidation?.sourceServer?.status || "Connected"}
                                        latencyMs={pipelineValidation?.sourceServer?.latencyMs}
                                        isValidating={validatingPipeline}
                                        placeholder="Detecting Origin Server..."
                                        isLoading={servers.length === 0}
                                    />

                                    {/* FLOW CONNECTOR (DOWNWARD ARROW) */}
                                    <div className="flex items-center justify-center -my-1 z-10">
                                        <div className="p-2 bg-gradient-to-b from-emerald-500 to-teal-500 text-white rounded-full shadow-md shadow-emerald-500/25 flex items-center justify-center">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* TARGET NODE */}
                                    <CustomServerSelect
                                        label="Destination (Target Server)"
                                        badgeText="Write Target"
                                        subLabel="Records imported here"
                                        theme="blue"
                                        value={targetServer}
                                        onChange={(val) => {
                                            setTargetServer(val);
                                            if (typeof window !== "undefined") {
                                                localStorage.setItem("ringingo_sync_target_server", val);
                                            }
                                        }}
                                        servers={servers}
                                        excludeServerVal={sourceServer}
                                        connectionStatus={pipelineValidation?.targetServer?.status}
                                        latencyMs={pipelineValidation?.targetServer?.latencyMs}
                                        isValidating={validatingPipeline || isReconnecting}
                                        showReconnect={showTargetReconnect}
                                        isReconnecting={isReconnecting}
                                        onReconnect={handleReconnectTarget}
                                        placeholder="Select Destination Target Server..."
                                        isLoading={servers.length === 0}
                                    />

                                    {/* Inline Pipeline Errors if any */}
                                    {pipelineValidation?.errors && pipelineValidation.errors.length > 0 && (
                                        <div className="mt-2 p-2.5 bg-rose-50 border border-rose-200/80 rounded-xl space-y-1">
                                            {pipelineValidation.errors.map((err: string, eIdx: number) => (
                                                <div key={eIdx} className="text-xs text-rose-700 font-medium flex items-center gap-1.5">
                                                    <svg className="w-3.5 h-3.5 shrink-0 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                    </svg>
                                                    <span>{err}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* RIGHT SIDE: CONFLICT RESOLUTION STRATEGY */}
                            <div className="flex flex-col justify-between bg-slate-50/50 p-5 rounded-2xl border border-slate-200/70">
                                <div className="mb-3.5">
                                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                                        <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                        Conflict Resolution Strategy
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        When records already exist on the target server.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-2.5 flex-1">
                                    {[
                                        {
                                            id: "SKIP",
                                            tag: "Recommended",
                                            tagColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
                                            selectedBorder: "border-emerald-600 bg-gradient-to-r from-emerald-50/90 to-teal-50/60 shadow-sm shadow-emerald-600/10 ring-1 ring-emerald-600/20",
                                            selectedIcon: "bg-emerald-600 text-white shadow-sm shadow-emerald-600/20",
                                            selectedRadio: "border-emerald-600 bg-emerald-600",
                                            title: "Skip Existing Records",
                                            desc: "Safely leaves existing target entities intact while creating new missing records and auto-mapping foreign keys.",
                                            icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
                                        },
                                        {
                                            id: "UPDATE",
                                            tag: "In-Place Merge",
                                            tagColor: "bg-blue-100 text-blue-800 border-blue-200",
                                            selectedBorder: "border-blue-600 bg-gradient-to-r from-blue-50/90 to-indigo-50/60 shadow-sm shadow-blue-600/10 ring-1 ring-blue-600/20",
                                            selectedIcon: "bg-blue-600 text-white shadow-sm shadow-blue-600/20",
                                            selectedRadio: "border-blue-600 bg-blue-600",
                                            title: "Update & Merge",
                                            desc: "Updates existing target records with incoming field definitions from the source server while preserving IDs.",
                                            icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
                                        },
                                        {
                                            id: "OVERWRITE",
                                            tag: "Full Override",
                                            tagColor: "bg-amber-100 text-amber-800 border-amber-200",
                                            selectedBorder: "border-amber-500 bg-gradient-to-r from-amber-50/90 to-orange-50/60 shadow-sm shadow-amber-500/10 ring-1 ring-amber-500/20",
                                            selectedIcon: "bg-amber-500 text-white shadow-sm shadow-amber-500/20",
                                            selectedRadio: "border-amber-500 bg-amber-500",
                                            title: "Overwrite Target",
                                            desc: "Fully replaces target record payloads and configurations with source instances without confirmation prompts.",
                                            icon: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
                                        },
                                    ].map((strat) => {
                                        const isSelected = duplicateStrategy === strat.id;
                                        return (
                                            <div
                                                key={strat.id}
                                                onClick={() => setDuplicateStrategy(strat.id as any)}
                                                className={`relative cursor-pointer p-3 sm:p-3.5 rounded-xl border-2 transition-all select-none flex flex-col justify-between ${
                                                    isSelected
                                                        ? strat.selectedBorder
                                                        : "border-slate-200/80 hover:border-slate-300 bg-white hover:bg-slate-50/50 shadow-xs"
                                                }`}
                                            >
                                                <div>
                                                    <div className="flex items-center justify-between mb-1.5">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`p-1.5 rounded-lg shrink-0 ${isSelected ? strat.selectedIcon : "bg-slate-100 text-slate-600"}`}>
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={strat.icon} />
                                                                </svg>
                                                            </div>
                                                            <h4 className="text-xs sm:text-sm font-bold text-slate-900">{strat.title}</h4>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${strat.tagColor}`}>
                                                                {strat.tag}
                                                            </span>
                                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition ${isSelected ? strat.selectedRadio : "border-slate-300"}`}>
                                                                {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed pl-8">{strat.desc}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* MODULE SELECTION & DATA REVIEW SECTION */}
                    <div className="bg-white rounded-3xl p-6 lg:p-7 shadow-sm border border-slate-200/80">
                        {/* HEADER TOOLBAR */}
                        <div className="flex items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-100">
                            <div>
                                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                                    Step 2: Select & Review Modules ({selectedModules.length}/{MODULE_CONFIGS.length})
                                </h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Expand any card below to review records, inspect key details, and verify target conflict status.
                                </p>
                            </div>

                            {/* SINGLE SMART TOGGLE BUTTONS (ALIGNED PARALLEL) */}
                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    type="button"
                                    onClick={allSelected ? handleDeselectAll : handleSelectAll}
                                    className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition flex items-center gap-1.5 ${
                                        allSelected
                                            ? "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200"
                                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200 shadow-xs"
                                    }`}
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        {allSelected ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        )}
                                    </svg>
                                    <span>{allSelected ? "Deselect All" : "Select All"}</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={anyExpanded ? handleCollapseAll : handleExpandAll}
                                    className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition flex items-center gap-1.5"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        {anyExpanded ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        )}
                                    </svg>
                                    <span>{anyExpanded ? "Collapse All" : "Expand All"}</span>
                                </button>
                            </div>
                        </div>

                        {/* CATEGORY FILTER PILLS & SEARCH */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
                            <div className="flex flex-wrap items-center gap-1.5">
                                {CATEGORIES.map((cat) => {
                                    const style = CATEGORY_STYLES[cat] || {
                                        label: cat === "ALL" ? "All Categories" : cat,
                                        active: "bg-slate-900 text-white border-slate-900 shadow-sm",
                                        inactive: "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200",
                                    };
                                    const isActive = selectedCategory === cat;

                                    return (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`px-3 py-1 text-xs font-bold rounded-xl border transition-all cursor-pointer select-none ${
                                                isActive ? style.active : style.inactive
                                            }`}
                                        >
                                            {style.label}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* GLOBAL SEARCH INPUT */}
                            <div className="relative w-full md:w-64">
                                <input
                                    type="text"
                                    placeholder="Filter modules..."
                                    value={globalModuleSearch}
                                    onChange={(e) => setGlobalModuleSearch(e.target.value)}
                                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                                />
                                <svg className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        {/* EXPANDABLE MODULE CARDS LIST */}
                        <div className="space-y-4">
                            {visibleModules.map((mod, idx) => {
                                const isSelected = selectedModules.includes(mod.key);
                                const isExpanded = !!(expandedModules && expandedModules[mod.key]);
                                const cacheData = (moduleRecordsCache || {})[mod.key];
                                const records: any[] = cacheData?.records || [];
                                const searchQuery = ((moduleSearchQueries && moduleSearchQueries[mod.key]) || "").toLowerCase();

                                const filteredRecords = records.filter((r) => {
                                    if (!searchQuery) return true;
                                    return (
                                        (r.name && r.name.toLowerCase().includes(searchQuery)) ||
                                        (r.identifier && r.identifier.toLowerCase().includes(searchQuery)) ||
                                        (r.type && r.type.toLowerCase().includes(searchQuery)) ||
                                        (r.status && r.status.toLowerCase().includes(searchQuery))
                                    );
                                });

                                const categoryTheme = MODULE_CATEGORY_THEMES[mod.category] || {
                                    selectedBorder: "border-emerald-300/80 bg-white shadow-sm ring-1 ring-emerald-500/10",
                                    headerHover: "hover:bg-emerald-50/30",
                                    checkboxAccent: "text-emerald-600 focus:ring-emerald-500 accent-emerald-600",
                                    sequenceBadge: "bg-slate-100 text-slate-700",
                                    iconBg: "bg-slate-100 text-slate-600",
                                    reviewBtnExpanded: "bg-emerald-600 text-white shadow-md shadow-emerald-600/20",
                                };

                                return (
                                    <div
                                        key={mod.key}
                                        className={`rounded-2xl border-2 transition-all overflow-hidden ${
                                            isSelected
                                                ? categoryTheme.selectedBorder
                                                : "border-slate-200/70 bg-slate-50/40 opacity-80"
                                        }`}
                                    >
                                        {/* MODULE HEADER BAR */}
                                        <div
                                            onClick={() => toggleExpandModule(mod.key)}
                                            className={`p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer transition select-none ${
                                                isSelected ? categoryTheme.headerHover : "hover:bg-slate-100/50"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3.5 min-w-0">
                                                {/* CHECKBOX */}
                                                <div
                                                    role="checkbox"
                                                    aria-checked={isSelected}
                                                    onClick={(e) => handleToggleModule(mod.key, e)}
                                                    className={`w-5 h-5 rounded-md flex items-center justify-center transition-all cursor-pointer shrink-0 border ${
                                                        isSelected
                                                            ? categoryTheme.checkboxChecked
                                                            : "border-slate-300 bg-white hover:border-slate-400"
                                                    }`}
                                                >
                                                    {isSelected && (
                                                        <svg
                                                            className="w-3.5 h-3.5 text-white stroke-[3.5]"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </div>

                                                {/* SEQUENCE BADGE */}
                                                <span
                                                    className={`inline-flex items-center justify-center w-7 h-7 rounded-xl text-xs font-black shrink-0 transition ${
                                                        isSelected ? categoryTheme.sequenceBadge : "bg-slate-100 text-slate-700"
                                                    }`}
                                                >
                                                    {idx + 1}
                                                </span>

                                                {/* ICON */}
                                                <div
                                                    className={`p-2 rounded-xl hidden sm:block shrink-0 transition ${
                                                        isSelected ? categoryTheme.iconBg : "bg-slate-100 text-slate-600"
                                                    }`}
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mod.icon} />
                                                    </svg>
                                                </div>

                                                {/* TITLE & CATEGORY */}
                                                <div className="min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h3 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
                                                            {mod.label}
                                                        </h3>
                                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${mod.categoryColor}`}>
                                                            {mod.category}
                                                        </span>
                                                        {cacheData && (
                                                            <span className="text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                                                {cacheData.total} {cacheData.total === 1 ? "record" : "records"} found
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-slate-500 mt-0.5 font-medium truncate sm:whitespace-normal">{mod.desc}</p>
                                                </div>
                                            </div>

                                            {/* EXPAND BUTTON */}
                                            <div className="flex items-center gap-3 shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleExpandModule(mod.key);
                                                    }}
                                                    className={`px-3.5 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition ${
                                                        isExpanded
                                                            ? categoryTheme.reviewBtnExpanded
                                                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                                    }`}
                                                >
                                                    <span>{isExpanded ? "Hide Data" : "Review Data"}</span>
                                                    <svg
                                                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                                            isExpanded ? "rotate-180" : "rotate-0"
                                                        }`}
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        {/* EXPANDED DATA DETAILS PANEL */}
                                        {isExpanded && (
                                            <div className="border-t border-slate-100 bg-white p-5 lg:p-6">
                                                {/* STATS CHIPS & SEARCH */}
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="relative w-full sm:w-64">
                                                            <input
                                                                type="text"
                                                                placeholder={`Search ${mod.label} records...`}
                                                                value={moduleSearchQueries[mod.key] || ""}
                                                                onChange={(e) => handleSearchChange(mod.key, e.target.value)}
                                                                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                                                            />
                                                            <svg className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                            </svg>
                                                        </div>

                                                        <button
                                                            onClick={() =>
                                                                dispatch(
                                                                    fetchModuleRecords({
                                                                        module: mod.key,
                                                                        source_server: sourceServer,
                                                                        target_server: targetServer,
                                                                    })
                                                                )
                                                            }
                                                            className="p-2 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                                                            title="Refresh records from source server"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                            </svg>
                                                        </button>
                                                    </div>

                                                    {/* TARGET STATUS SUMMARY CHIPS */}
                                                    {cacheData && (
                                                        <div className="flex items-center gap-2 text-xs">
                                                            <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 font-bold">
                                                                Total: {cacheData.total}
                                                            </span>
                                                            <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                                                                New to Create: {cacheData.newToCreate}
                                                            </span>
                                                            <span className="px-3 py-1 rounded-xl bg-amber-50 text-amber-800 font-bold border border-amber-200">
                                                                Exists on Target: {cacheData.existingOnTarget}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* RECORDS TABLE */}
                                                {moduleLoading && !cacheData ? (
                                                    <div className="py-10 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-3">
                                                        <svg className="animate-spin h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                                        </svg>
                                                        <span>Fetching structured {mod.label} records from source...</span>
                                                    </div>
                                                ) : filteredRecords.length === 0 ? (
                                                    <div className="py-8 text-center text-slate-400 text-xs bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                                        No records found for {mod.label} on the source server.
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <div className="overflow-x-auto overflow-y-auto max-h-[300px] rounded-2xl border border-slate-200/90 shadow-sm relative">
                                                            <table className="w-full text-left text-xs text-slate-600">
                                                                <thead className="sticky top-0 z-10 bg-slate-50 text-[11px] font-black text-slate-500 uppercase tracking-wider border-b border-slate-200 shadow-2xs">
                                                                    <tr>
                                                                        <th className="px-4 py-3 bg-slate-50">#</th>
                                                                        <th className="px-4 py-3 bg-slate-50 font-black text-slate-700">Name / Label</th>
                                                                        <th className="px-4 py-3 bg-slate-50 font-black text-slate-700">Identifiers & Key Details</th>
                                                                        <th className="px-4 py-3 bg-slate-50 font-black text-slate-700">Type / Category</th>
                                                                        <th className="px-4 py-3 bg-slate-50 text-center font-black text-slate-700">Status</th>
                                                                        <th className="px-4 py-3 bg-slate-50 text-center font-black text-slate-700">Target Server State</th>
                                                                        <th className="px-4 py-3 bg-slate-50 text-right font-black text-slate-700">Actions</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="divide-y divide-slate-100">
                                                                    {filteredRecords.map((item, rIdx) => (
                                                                        <tr key={item.id || rIdx} className="hover:bg-slate-50/80 transition">
                                                                            <td className="px-4 py-3 text-slate-400 font-mono font-semibold">{rIdx + 1}</td>
                                                                            <td className="px-4 py-3 font-bold text-slate-900 text-sm">
                                                                                {item.name}
                                                                            </td>
                                                                            <td className="px-4 py-3 text-slate-600 font-mono text-[11px] leading-relaxed">
                                                                                {item.identifier || "—"}
                                                                            </td>
                                                                            <td className="px-4 py-3">
                                                                                {item.type ? (
                                                                                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                                                                                        {item.type}
                                                                                    </span>
                                                                                ) : (
                                                                                    "—"
                                                                                )}
                                                                            </td>
                                                                            <td className="px-4 py-3 text-center">
                                                                                <span
                                                                                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                                                                        item.status === "Active"
                                                                                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                                                                            : "bg-slate-100 text-slate-600 border border-slate-200"
                                                                                    }`}
                                                                                >
                                                                                    <span className={`w-1.5 h-1.5 rounded-full ${item.status === "Active" ? "bg-emerald-600" : "bg-slate-400"}`}></span>
                                                                                    {item.status}
                                                                                </span>
                                                                            </td>
                                                                            <td className="px-4 py-3 text-center">
                                                                                {item.existsOnTarget ? (
                                                                                    <span
                                                                                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200"
                                                                                        title="Record exists on destination server"
                                                                                    >
                                                                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                                                                                        Exists on Target ({duplicateStrategy === "SKIP" ? "Skip" : duplicateStrategy === "OVERWRITE" ? "Overwrite" : "Update"})
                                                                                    </span>
                                                                                ) : (
                                                                                    <span
                                                                                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200"
                                                                                        title="Record is new and will be created on destination server"
                                                                                    >
                                                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                                                                                        + Will Create
                                                                                    </span>
                                                                                )}
                                                                            </td>
                                                                            <td className="px-4 py-3 text-right">
                                                                                <button
                                                                                    onClick={() => {
                                                                                        setSelectedRawRecord({
                                                                                            title: `${mod.label}: ${item.name}`,
                                                                                            data: item.details || item,
                                                                                        });
                                                                                        setShowRecordDetailModal(true);
                                                                                    }}
                                                                                    className="px-2.5 py-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition"
                                                                                >
                                                                                    Inspect
                                                                                </button>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                        {filteredRecords.length > 10 && (
                                                            <div className="mt-2.5 px-3 py-1.5 bg-slate-50/80 rounded-xl border border-slate-200/70 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                                                                <span>
                                                                    Showing <strong className="text-slate-800 font-bold">{filteredRecords.length}</strong> records (Scrollable table)
                                                                </span>
                                                                <span className="text-slate-400 text-[10px]">
                                                                    ↑↓ Scroll inside table to view all records
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* BOTTOM ACTION BAR */}
                        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-slate-100 text-slate-700 rounded-xl shrink-0">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-800">
                                        {selectedModules.length} Modules Selected ({totalStagedRecords} Staged Records)
                                    </div>
                                    <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 flex-wrap">
                                        Pipeline: <strong className="text-emerald-700 font-bold">{currentServer?.server_name || currentServer?.name || sourceServer} {getServerDisplayIp(currentServer) ? `(${getServerDisplayIp(currentServer)})` : ""}</strong> &rarr; <strong className="text-blue-700 font-bold">{pipelineValidation?.targetServer?.server_name || pipelineValidation?.targetServer?.name || (targetServer ? (servers.find(s => s.server_key === targetServer || s.id === targetServer)?.server_name || targetServer) : "Select Target")} {targetServer ? `(${getServerDisplayIp(servers.find(s => s.server_key === targetServer || s.id === targetServer))})` : ""}</strong> (Strategy: {duplicateStrategy})
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                                <button
                                    onClick={handlePreview}
                                    disabled={syncing || selectedModules.length === 0 || !targetServer || (pipelineValidation && pipelineValidation.isReady === false)}
                                    className="px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-2xl shadow-sm transition disabled:opacity-50 cursor-pointer"
                                >
                                    Dry-Run Preview
                                </button>

                                <button
                                    onClick={handleExecuteSync}
                                    disabled={syncing || selectedModules.length === 0 || !targetServer || (pipelineValidation && pipelineValidation.isReady === false)}
                                    className="px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-2xl shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                                >
                                    {syncing ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                            </svg>
                                            Synchronizing Data...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            Start Server Sync ({selectedModules.length} Modules)
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: SYNC HISTORY & AUDIT LOGS */}
            {activeTab === "history" && (
                <div className="bg-white rounded-3xl p-6 lg:p-7 shadow-sm border border-slate-200/80">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                        <div>
                            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                                Synchronization Audit Trail & Run Logs
                            </h2>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Comprehensive history of all server clones, imports, and synchronized data entities.
                            </p>
                        </div>
                        <button
                            onClick={() => dispatch(fetchSyncHistory({ page: historyPage, limit: 10 }))}
                            className="px-4 py-2 text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl transition flex items-center gap-1.5 self-start sm:self-auto"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Refresh Audit History
                        </button>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-slate-200/80 shadow-sm">
                        <table className="w-full text-left text-xs text-slate-600">
                            <thead className="bg-slate-50 text-[11px] font-black text-slate-500 uppercase tracking-wider border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-3.5 font-black text-slate-700">Sync Run ID</th>
                                    <th className="px-4 py-3.5 font-black text-slate-700">Timestamp</th>
                                    <th className="px-4 py-3.5 font-black text-slate-700">Pipeline (Source &rarr; Target)</th>
                                    <th className="px-4 py-3.5 text-center font-black text-slate-700">Total</th>
                                    <th className="px-4 py-3.5 text-center text-emerald-700 font-black">Created</th>
                                    <th className="px-4 py-3.5 text-center text-blue-700 font-black">Updated</th>
                                    <th className="px-4 py-3.5 text-center text-amber-700 font-black">Skip Count</th>
                                    <th className="px-4 py-3.5 text-center text-red-700 font-black">Failed</th>
                                    <th className="px-4 py-3.5 text-center font-black text-slate-700">Status</th>
                                    <th className="px-4 py-3.5 text-right font-black text-slate-700">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {(historyData?.history || []).length === 0 ? (
                                    <tr>
                                        <td colSpan={10} className="px-4 py-10 text-center text-slate-400 font-medium">
                                            No server synchronization records logged yet.
                                        </td>
                                    </tr>
                                ) : (
                                    (historyData?.history || []).map((item: any) => (
                                        <tr key={item._id || item.sync_id} className="hover:bg-slate-50 transition">
                                            <td className="px-4 py-3.5 font-mono font-bold text-slate-900 text-xs">
                                                {item.sync_id}
                                            </td>
                                            <td className="px-4 py-3.5 text-slate-500">
                                                {new Date(item.createdAt || item.started_at).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3.5 font-medium text-slate-800">
                                                <span className="font-bold text-slate-900">{item.source_server}</span>
                                                <span className="text-slate-400 mx-1.5">&rarr;</span>
                                                <span className="font-bold text-slate-900">{item.target_server}</span>
                                            </td>
                                            <td className="px-4 py-3.5 text-center font-black text-slate-800">{item.summary?.total || 0}</td>
                                            <td className="px-4 py-3.5 text-center font-bold text-emerald-700">{item.summary?.created || 0}</td>
                                            <td className="px-4 py-3.5 text-center font-bold text-blue-700">{item.summary?.updated || 0}</td>
                                            <td className="px-4 py-3.5 text-center font-bold text-amber-700">{item.summary?.skipped || 0}</td>
                                            <td className="px-4 py-3.5 text-center font-bold text-red-700">{item.summary?.failed || 0}</td>
                                            <td className="px-4 py-3.5 text-center">
                                                <span
                                                    className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                                                        item.status === "COMPLETED"
                                                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                                            : item.status === "PARTIAL_SUCCESS"
                                                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                                                            : "bg-red-100 text-red-800 border border-red-200"
                                                    }`}
                                                >
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5 text-right">
                                                <button
                                                    onClick={() => handleViewHistory(item.sync_id || item.uuid)}
                                                    className="px-3 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition"
                                                >
                                                    View Logs
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* PREVIEW DRY-RUN MODAL */}
            {showPreviewModal && previewData && (
                <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-2xl w-full p-6 lg:p-7 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <div>
                                <h3 className="text-lg font-black text-slate-900">Dry-Run Preview Summary</h3>
                                <p className="text-xs text-slate-500 font-medium">
                                    Source: {previewData.source_server} &rarr; Target: {previewData.target_server}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowPreviewModal(false)}
                                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-base transition cursor-pointer"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="my-5 space-y-3">
                            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between">
                                <span>Total Source Records to Synchronize:</span>
                                <span className="text-base font-black">{previewData.totalSourceRecords}</span>
                            </div>

                            <div className="space-y-2">
                                {Object.entries(previewData.modules || {}).map(([k, mod]: [string, any]) => (
                                    <div key={k} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                                        <div>
                                            <div className="font-bold text-xs sm:text-sm text-slate-900">{mod.moduleName}</div>
                                            <div className="text-[11px] text-slate-500 mt-0.5">
                                                Total: {mod.totalSource} | Exists on Target: {mod.existingOnTarget} | New to Create: {mod.newToCreate}
                                            </div>
                                        </div>
                                        <span className="text-xs font-black px-2.5 py-1 bg-white border border-slate-200 rounded-xl text-slate-800 shadow-sm">
                                            {mod.totalSource} items
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                            <button
                                onClick={() => setShowPreviewModal(false)}
                                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleExecuteSync}
                                className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-md transition cursor-pointer"
                            >
                                Confirm & Start Synchronization
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* EXECUTION REPORT MODAL */}
            {showExecutionModal && executionResult && (
                <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-[76vw] 2xl:max-w-[1600px] p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto flex flex-col justify-between">
                        {/* MODAL HEADER */}
                        <div>
                            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2.5">
                                        <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-base sm:text-xl font-black text-slate-900 tracking-tight">
                                                Server Synchronization Execution Report
                                            </h3>
                                            <span className="font-mono text-xs font-bold text-slate-500">
                                                Run ID: {executionResult.sync_id}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`px-3 py-1 text-xs font-black rounded-full uppercase tracking-wider ${
                                            executionResult.status === "COMPLETED"
                                                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                                : executionResult.status === "PARTIAL_SUCCESS"
                                                ? "bg-amber-100 text-amber-800 border border-amber-200"
                                                : "bg-red-100 text-red-800 border border-red-200"
                                        }`}
                                    >
                                        {executionResult.status}
                                    </span>
                                    <button
                                        onClick={() => setShowExecutionModal(false)}
                                        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-base transition cursor-pointer"
                                    >
                                        &times;
                                    </button>
                                </div>
                            </div>

                            {/* PIPELINE DETAILS CARD */}
                            <div className="my-4 p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                                <div className="flex items-center gap-2 font-medium text-slate-700 flex-wrap">
                                    <span className="font-bold text-slate-900">Pipeline:</span>
                                    <span className="font-bold text-emerald-700">{currentServer?.server_name || currentServer?.name || sourceServer} {getServerDisplayIp(currentServer) ? `(${getServerDisplayIp(currentServer)})` : ""}</span>
                                    <span className="text-slate-400">&rarr;</span>
                                    <span className="font-bold text-blue-700">{pipelineValidation?.targetServer?.server_name || pipelineValidation?.targetServer?.name || (targetServer ? (servers.find(s => s.server_key === targetServer || s.id === targetServer)?.server_name || targetServer) : "")} {targetServer ? `(${getServerDisplayIp(servers.find(s => s.server_key === targetServer || s.id === targetServer))})` : ""}</span>
                                </div>
                                <div className="flex items-center gap-4 text-slate-600">
                                    <span><strong className="text-slate-900">Conflict Strategy:</strong> {duplicateStrategy}</span>
                                    <span><strong className="text-slate-900">Executed At:</strong> {new Date().toLocaleTimeString()}</span>
                                </div>
                            </div>

                            {/* KPI COUNTERS */}
                            <div className="grid grid-cols-5 sm:grid-cols-5 gap-3 mb-6">
                                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-center">
                                    <div className="text-2xl font-black text-slate-900">{executionResult.summary?.total || 0}</div>
                                    <div className="text-[10px] font-bold text-slate-500 mt-0.5 uppercase tracking-wider">Total Processed</div>
                                </div>
                                <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200 text-center">
                                    <div className="text-2xl font-black text-emerald-700">{executionResult.summary?.created || 0}</div>
                                    <div className="text-[10px] font-bold text-emerald-600 mt-0.5 uppercase tracking-wider">Created</div>
                                </div>
                                <div className="bg-blue-50/80 p-3.5 rounded-2xl border border-blue-200 text-center">
                                    <div className="text-2xl font-black text-blue-700">{executionResult.summary?.updated || 0}</div>
                                    <div className="text-[10px] font-bold text-blue-600 mt-0.5 uppercase tracking-wider">Updated</div>
                                </div>
                                <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 text-center">
                                    <div className="text-2xl font-black text-amber-700">{executionResult.summary?.skipped || 0}</div>
                                    <div className="text-[10px] font-bold text-amber-600 mt-0.5 uppercase tracking-wider">Skipped</div>
                                </div>
                                <div className="bg-red-50/80 p-3.5 rounded-2xl border border-red-200 text-center">
                                    <div className="text-2xl font-black text-red-700">{executionResult.summary?.failed || 0}</div>
                                    <div className="text-[10px] font-bold text-red-600 mt-0.5 uppercase tracking-wider">Failed</div>
                                </div>
                            </div>

                            {/* MODULE BREAKDOWN TABLE */}
                            <div className="overflow-x-auto rounded-2xl border border-slate-200/80 shadow-sm mb-6">
                                <table className="w-full text-left text-xs text-slate-600">
                                    <thead className="bg-slate-50 text-[11px] font-black text-slate-500 uppercase tracking-wider border-b border-slate-200">
                                        <tr>
                                            <th className="px-4 py-3 font-black text-slate-700">Module</th>
                                            <th className="px-4 py-3 text-center font-black text-slate-700">Total</th>
                                            <th className="px-4 py-3 text-center text-emerald-700 font-black">Created</th>
                                            <th className="px-4 py-3 text-center text-blue-700 font-black">Updated</th>
                                            <th className="px-4 py-3 text-center text-amber-700 font-black">Skipped</th>
                                            <th className="px-4 py-3 text-center text-red-700 font-black">Failed</th>
                                            <th className="px-4 py-3 text-right font-black text-slate-700">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {Object.entries(executionResult.module_stats || {}).map(([key, stat]: [string, any]) => (
                                            <tr key={key} className="hover:bg-slate-50/80 transition">
                                                <td className="px-4 py-2.5 font-bold text-slate-900">{stat.moduleName || key}</td>
                                                <td className="px-4 py-2.5 text-center font-bold text-slate-800">{stat.total}</td>
                                                <td className="px-4 py-2.5 text-center font-bold text-emerald-700">{stat.created}</td>
                                                <td className="px-4 py-2.5 text-center font-bold text-blue-700">{stat.updated}</td>
                                                <td className="px-4 py-2.5 text-center font-bold text-amber-700">{stat.skipped}</td>
                                                <td className="px-4 py-2.5 text-center font-bold text-red-700">
                                                    {stat.failed > 0 ? (
                                                        <button
                                                            onClick={() => {
                                                                setActiveErrorModule(stat);
                                                                setShowErrorModal(true);
                                                            }}
                                                            className="underline font-bold text-red-600 hover:text-red-800 cursor-pointer"
                                                        >
                                                            {stat.failed} (View Errors)
                                                        </button>
                                                    ) : (
                                                        "0"
                                                    )}
                                                </td>
                                                <td className="px-4 py-2.5 text-right">
                                                    <span
                                                        className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                                                            stat.status === "COMPLETED"
                                                                ? "bg-emerald-100 text-emerald-800"
                                                                : stat.status === "PARTIAL_SUCCESS"
                                                                ? "bg-amber-100 text-amber-800"
                                                                : "bg-red-100 text-red-800"
                                                        }`}
                                                    >
                                                        {stat.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* AUDIT LOGS CONSOLE */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Live Execution Event Stream</h4>
                                    <span className="text-[11px] text-slate-400 font-mono">{(executionResult.logs || []).length} events recorded</span>
                                </div>
                                <div className="bg-slate-950 text-slate-100 rounded-2xl p-4 font-mono text-xs max-h-48 overflow-y-auto space-y-1.5 border border-slate-800 shadow-inner">
                                    {(executionResult.logs || []).map((log: any, idx: number) => (
                                        <div key={idx} className="flex items-start gap-2.5">
                                            <span className="text-slate-500 select-none shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                                            {log.level === "SUCCESS" && <span className="text-emerald-400 font-bold shrink-0">[SUCCESS]</span>}
                                            {log.level === "INFO" && <span className="text-sky-400 font-bold shrink-0">[INFO]</span>}
                                            {log.level === "WARN" && <span className="text-amber-400 font-bold shrink-0">[WARN]</span>}
                                            {log.level === "ERROR" && <span className="text-rose-400 font-bold shrink-0">[ERROR]</span>}
                                            <span className="text-slate-300">{log.message}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* MODAL FOOTER */}
                        <div className="flex items-center justify-between pt-5 mt-5 border-t border-slate-100">
                            <button
                                onClick={() => handleCopyJson(executionResult)}
                                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                {copiedJson ? "Copied JSON!" : "Copy Summary JSON"}
                            </button>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => {
                                        setShowExecutionModal(false);
                                        setActiveTab("history");
                                    }}
                                    className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                                >
                                    Go to Audit History
                                </button>
                                <button
                                    onClick={() => setShowExecutionModal(false)}
                                    className="px-6 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition cursor-pointer"
                                >
                                    Done / Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* RECORD INSPECTION MODAL */}
            {showRecordDetailModal && selectedRawRecord && (
                <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 max-h-[85vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                            <div>
                                <h3 className="text-sm font-black text-slate-900">{selectedRawRecord.title}</h3>
                                <p className="text-[11px] text-slate-400">Structured raw entity properties</p>
                            </div>
                            <button
                                onClick={() => setShowRecordDetailModal(false)}
                                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-base transition"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="my-4">
                            <div className="flex justify-end mb-2">
                                <button
                                    onClick={() => handleCopyJson(selectedRawRecord.data)}
                                    className="px-2.5 py-1 text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition flex items-center gap-1"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    {copiedJson ? "Copied!" : "Copy JSON"}
                                </button>
                            </div>
                            <pre className="bg-slate-950 text-emerald-400 p-4 rounded-2xl text-xs overflow-x-auto max-h-96 font-mono leading-relaxed border border-slate-800 shadow-inner">
                                {JSON.stringify(selectedRawRecord.data, null, 2)}
                            </pre>
                        </div>

                        <div className="flex justify-end pt-3 border-t border-slate-100">
                            <button
                                onClick={() => setShowRecordDetailModal(false)}
                                className="px-4 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
                            >
                                Close Inspector
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ERROR DETAILS MODAL */}
            {showErrorModal && activeErrorModule && (
                <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <h3 className="text-base font-black text-rose-700">
                                Failed Records in {activeErrorModule.moduleName}
                            </h3>
                            <button
                                onClick={() => setShowErrorModal(false)}
                                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-base transition"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="my-4 space-y-2.5">
                            {(activeErrorModule.errors || []).map((err: any, idx: number) => (
                                <div key={idx} className="p-3.5 bg-rose-50 rounded-2xl border border-rose-100 text-xs">
                                    <div className="font-bold text-rose-900">{err.recordName || "Record"}</div>
                                    <div className="text-rose-700 mt-1 font-mono">{err.reason}</div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end pt-4 border-t border-slate-100">
                            <button
                                onClick={() => setShowErrorModal(false)}
                                className="px-4 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* AUDIT HISTORY DETAIL MODAL */}
            {showHistoryDetailModal && selectedHistoryItem && (
                <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-[70vw] 2xl:max-w-[1600px] p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <div>
                                <h3 className="text-base sm:text-lg font-black text-slate-900">
                                    Sync Audit Run: {selectedHistoryItem.sync_id}
                                </h3>
                                <p className="text-xs text-slate-500 font-medium mt-0.5">
                                    {selectedHistoryItem.source_server} &rarr; {selectedHistoryItem.target_server} (Strategy: {selectedHistoryItem.duplicate_strategy})
                                </p>
                            </div>
                            <button
                                onClick={() => setShowHistoryDetailModal(false)}
                                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-base transition cursor-pointer"
                            >
                                &times;
                            </button>
                        </div>

                        {/* SUMMARY METRICS */}
                        <div className="grid grid-cols-5 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 my-5">
                            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-center">
                                <div className="text-xl sm:text-2xl font-black text-slate-900">{selectedHistoryItem.summary?.total || 0}</div>
                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Total</div>
                            </div>
                            <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200 text-center">
                                <div className="text-xl sm:text-2xl font-black text-emerald-700">{selectedHistoryItem.summary?.created || 0}</div>
                                <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mt-0.5">Created</div>
                            </div>
                            <div className="bg-blue-50/80 p-3.5 rounded-2xl border border-blue-200 text-center">
                                <div className="text-xl sm:text-2xl font-black text-blue-700">{selectedHistoryItem.summary?.updated || 0}</div>
                                <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mt-0.5">Updated</div>
                            </div>
                            <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 text-center">
                                <div className="text-xl sm:text-2xl font-black text-amber-700">{selectedHistoryItem.summary?.skipped || 0}</div>
                                <div className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mt-0.5">Skip Count</div>
                            </div>
                            <div className="bg-rose-50/80 p-3.5 rounded-2xl border border-rose-200 text-center">
                                <div className="text-xl sm:text-2xl font-black text-rose-700">{selectedHistoryItem.summary?.failed || 0}</div>
                                <div className="text-[10px] font-bold text-rose-600 uppercase tracking-wider mt-0.5">Failed</div>
                            </div>
                        </div>

                        {/* LOGS */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Audit Event Logs</h4>
                                <span className="text-[11px] text-slate-400 font-mono">{(selectedHistoryItem.logs || []).length} events recorded</span>
                            </div>
                            <div className="bg-slate-950 text-slate-100 rounded-2xl p-4 sm:p-5 font-mono text-xs max-h-[55vh] overflow-y-auto overflow-x-auto space-y-1.5 border border-slate-800 shadow-inner">
                                {(selectedHistoryItem.logs || []).map((l: any, idx: number) => (
                                    <div key={idx} className="flex items-start gap-3 leading-relaxed hover:bg-slate-900/60 px-2 py-1 rounded transition">
                                        <span className="text-slate-500 select-none shrink-0 font-mono">[{new Date(l.timestamp).toLocaleTimeString()}]</span>
                                        {l.level === "SUCCESS" && <span className="text-emerald-400 font-bold shrink-0">[SUCCESS]</span>}
                                        {l.level === "INFO" && <span className="text-sky-400 font-bold shrink-0">[INFO]</span>}
                                        {l.level === "WARN" && <span className="text-amber-400 font-bold shrink-0">[WARN]</span>}
                                        {l.level === "ERROR" && <span className="text-rose-400 font-bold shrink-0">[ERROR]</span>}
                                        <span className="text-slate-300 break-all md:break-normal flex-1">{l.message}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-slate-100 mt-5">
                            <button
                                onClick={() => setShowHistoryDetailModal(false)}
                                className="px-5 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
                            >
                                Close Audit View
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServerDataSyncPage;
