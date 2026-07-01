"use client";
import { useState } from "react";
import { Search, ListFilter, X } from "lucide-react";
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    type PaginationState,
} from "@tanstack/react-table";
import { type DispositionRow, type DispositionTableMeta } from "./types";
import {
    DISP_PAGE_SIZE,
    DISP_CENTERED_COLS,
    dispositionColumns,
    dispositionGlobalFilter,
} from "./columns";

interface Props {
    dispositions: DispositionRow[];
    selected: Set<string>;
    onToggle: (uuid: string) => void;
}

export const DispositionTable = ({ dispositions, selected, onToggle }: Props) => {
    const [dispSearch, setDispSearch] = useState("");
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: DISP_PAGE_SIZE });

    const table = useReactTable({
        data: dispositions,
        columns: dispositionColumns,
        state: { globalFilter: dispSearch, pagination },
        globalFilterFn: dispositionGlobalFilter,
        onGlobalFilterChange: setDispSearch,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        autoResetPageIndex: true,
        meta: { selected, onToggle } as DispositionTableMeta,
    });

    if (!dispositions.length) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <ListFilter className="w-8 h-8 mb-2 opacity-40" />
                <p className="text-sm font-medium">No dispositions in this lead group</p>
            </div>
        );
    }

    const filteredCount = table.getFilteredRowModel().rows.length;
    const { pageIndex } = table.getState().pagination;
    const startRow = filteredCount === 0 ? 0 : pageIndex * DISP_PAGE_SIZE + 1;
    const endRow = Math.min((pageIndex + 1) * DISP_PAGE_SIZE, filteredCount);

    return (
        <div>
            {/* Search bar */}
            <div className="px-4 py-2.5 border-b border-gray-100">
                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                    <input
                        type="text"
                        value={dispSearch}
                        onChange={(e) => setDispSearch(e.target.value)}
                        placeholder={`Search ${dispositions.length} disposition${dispositions.length !== 1 ? "s" : ""}…`}
                        className="w-full pl-8 pr-7 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 placeholder:text-gray-400"
                    />
                    {dispSearch && (
                        <button
                            onClick={() => setDispSearch("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    )}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="px-4 py-2.5 w-10" />
                            <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Disposition</th>
                            <th className="px-4 py-2.5 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">In Queue</th>
                            <th className="px-4 py-2.5 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Leads</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {table.getRowModel().rows.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-4 py-8 text-center text-xs text-gray-400">
                                    No dispositions match &ldquo;{dispSearch}&rdquo;
                                </td>
                            </tr>
                        ) : (
                            table.getRowModel().rows.map((row) => {
                                const isUnknown = !row.original.disposition_uuid;
                                const isSelected = !isUnknown && selected.has(row.original.disposition_uuid);
                                return (
                                    <tr
                                        key={row.id}
                                        onClick={() => !isUnknown && onToggle(row.original.disposition_uuid)}
                                        title={isUnknown ? "No disposition set — cannot re-churn" : undefined}
                                        className={`transition-colors ${isUnknown ? "opacity-50 cursor-not-allowed bg-gray-50/60" : `cursor-pointer ${isSelected ? "bg-indigo-50/60" : "hover:bg-gray-50"}`}`}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <td
                                                key={cell.id}
                                                className={`px-4 py-3${cell.column.id === "checkbox" ? " w-10" : ""}${DISP_CENTERED_COLS.has(cell.column.id) ? " text-center" : ""}`}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer: count + pagination */}
            <div className="px-4 py-2.5 border-t border-gray-100 flex items-center justify-between gap-2">
                <span className="text-xs text-gray-400">
                    {dispSearch
                        ? `${filteredCount} match${filteredCount !== 1 ? "es" : ""} · showing ${startRow}–${endRow}`
                        : `Showing ${startRow}–${endRow} of ${filteredCount}`
                    }
                </span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="text-xs text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        Prev
                    </button>
                    <span className="text-xs text-gray-400 tabular-nums">
                        {table.getPageCount() > 0 ? `${pageIndex + 1} / ${table.getPageCount()}` : "0 / 0"}
                    </span>
                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="text-xs text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};
