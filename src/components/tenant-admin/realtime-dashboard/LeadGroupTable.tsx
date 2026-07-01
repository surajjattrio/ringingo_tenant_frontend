"use client";
import React from "react";
import { Table } from "@/components/ui-components";
import { ColumnsType } from "@/types/tableTypes";

interface LeadGroupTableProps {
    data: any[];
    isLoading: boolean;
}

const LeadGroupTable = ({ data, isLoading }: LeadGroupTableProps) => {

    const columns: ColumnsType[] = [
        {
            name: "lead_group_name",
            title: "Lead Group",
            sortable: true,
            action: (row: any) => (
                <span className="font-semibold text-heading text-sm">
                    {row?.lead_group_name || "—"}
                </span>
            ),
        },
        {
            name: "campaign_name",
            title: "Campaign",
            sortable: true,
            action: (row: any) => (
                <span className="text-sm text-txt-primary">
                    {row?.campaign_name || "N/A"}
                </span>
            ),
        },
        {
            name: "totalUploaded",
            title: "Total Uploaded",
            sortable: true,
            action: (row: any) => (
                <span className="text-sm font-semibold text-heading">
                    {row?.totalUploaded ?? 0}
                </span>
            ),
        },
        {
            name: "totalDialled",
            title: "Total Dialled",
            sortable: true,
            action: (row: any) => (
                <span className="text-sm font-semibold text-indigo-600">
                    {row?.totalDialled ?? 0}
                </span>
            ),
        },
        {
            name: "connected",
            title: "connected",
            sortable: true,
            action: (row: any) => (
                <span className="text-sm font-semibold text-emerald-600">
                    {row?.connected ?? 0}
                </span>
            ),
        },
        {
            name: "notConnected",
            title: "not connected",
            sortable: true,
            action: (row: any) => (
                <span className="text-sm font-semibold text-rose-500">
                    {row?.notConnected ?? 0}
                </span>
            ),
        },
        {
            name: "dialing",
            title: "Dialing",
            sortable: true,
            action: (row: any) => {
                const val = row?.dialing ?? 0;
                return (
                    <div className="flex items-center gap-1.5">
                        {val > 0 && (
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                        )}
                        <span className={`text-sm font-bold ${val > 0 ? "text-blue-600" : "text-gray-400"}`}>
                            {val}
                        </span>
                    </div>
                );
            },
        },
        {
            name: "activeCalls",
            title: "Active Call",
            sortable: true,
            action: (row: any) => {
                const val = row?.activeCalls ?? 0;
                return (
                    <div className="flex items-center gap-1.5">
                        {val > 0 && (
                            <span className="relative flex h-2 w-2">
                                <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                        )}
                        <span className={`text-sm font-bold ${val > 0 ? "text-emerald-600" : "text-gray-400"}`}>
                            {val}
                        </span>
                    </div>
                );
            },
        },
        {
            name: "readyToDial",
            title: "Ready to Dial",
            sortable: true,
            action: (row: any) => {
                const val = row?.readyToDial ?? 0;
                return (
                    <div className="flex items-center gap-1.5">
                        {val > 0 && (
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                            </span>
                        )}
                        <span className={`text-sm font-bold ${val > 0 ? "text-amber-600" : "text-gray-400"}`}>
                            {val}
                        </span>
                    </div>
                );
            },
        },
        {
            name: "queueRemaining",
            title: "Queue Remaining",
            sortable: true,
            action: (row: any) => (
                <span className="text-sm font-semibold text-slate-700">
                    {row?.queueRemaining ?? 0}
                </span>
            ),
        },
    ];

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden drop-shadow-sm">
            <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                <h3 className="text-sm font-semibold text-heading">Lead Group–wise Statistics</h3>
                <p className="text-xs text-txt-primary mt-0.5">
                    Showing {data.length} lead group{data.length !== 1 ? "s" : ""}
                </p>
            </div>
            <Table
                columns={columns}
                data={data}
                selectable={false}
                pagination={false}
                isExtra={true}
                isLoading={isLoading}
            />
        </div>
    );
};

export default LeadGroupTable;
