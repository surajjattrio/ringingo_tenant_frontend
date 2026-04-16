// Table.tsx

"use client";
import { useEffect, useState } from "react";
import CheckBox from "../forms/CheckBox";
import Pagination from "./Pagination";
import { ColumnsType } from "@/types/tableTypes";

interface TableProps {
  title?: string;
  columns: ColumnsType[];
  data: any;
  page?: number;
  totalCount?: number;
  limit?: number;
  selectable?: boolean;
  pagination?: boolean;
  selectedRows?: any;
  isLoading?: boolean;
  onLimitChange?: any;
  onPageClick?: any;
  onSelectRow?: any;
  onRefresh?: () => void;
}

const Table = ({
  title,
  columns,
  data,
  page,
  totalCount,
  limit = 10,
  selectable = true,
  pagination = true,
  selectedRows = [],
  onLimitChange,
  onPageClick,
  onSelectRow,
  onRefresh
}: TableProps) => {
  const [tableData, setTableData] = useState(data);
  const [columnData, setColumnData] = useState(columns);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const allChecked = () =>
    selectedRows.length &&
    tableData.length &&
    selectedRows.length === tableData.filter((d: any) => !d.disabled).length;

  const sortingByVal = (name: string, index: number) => {
    const currentSort = columnData[index]?.sort === "asc" ? "desc" : "asc";
    const sortedData = [...tableData].sort((a, b) =>
      currentSort === "asc"
        ? a[name]?.toString().localeCompare(b[name]?.toString())
        : b[name]?.toString().localeCompare(a[name]?.toString())
    );

    const updatedColumns = [...columnData];
    updatedColumns[index].sort = currentSort;

    setColumnData(updatedColumns);
    setTableData(sortedData);
  };

  const onLocalRowSelect = (checked: boolean, row: any) => {
    let updated = [...selectedRows];
    if (checked) {
      updated.push(row.uuid);
    } else {
      updated = updated.filter((id) => id !== row.uuid);
    }
    onSelectRow?.(checked, row, updated);
  };

  const onLocalRowSelectAll = (checked: boolean) => {
    const ids = checked
      ? tableData.filter((r: any) => !r.disabled).map((r: any) => r.uuid)
      : [];
    onSelectRow?.(checked, "all", ids);
  };

  return (
    <div className="bg-white border border-gray-200 shadow-xl rounded-2xl overflow-hidden">
      {title && (
        <div className="px-6 py-4 border-b font-semibold text-lg text-gray-800 bg-gradient-to-r from-white to-gray-50">
          {title}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-white/80 backdrop-blur sticky top-0 z-10 border-b border-gray-200 text-left text-xs uppercase text-gray-500">
            <tr>
              {columnData.map((col, idx) => (
                <th key={idx} className="px-6 py-4 whitespace-nowrap font-medium">
                  <div className="flex items-center gap-2">
                    {selectable && idx === 0 && (
                      <CheckBox
                        checked={allChecked()}
                        onChange={(val: boolean) => onLocalRowSelectAll(val)}
                      />
                    )}
                    <span className="text-sm font-semibold text-gray-700">
                      {col.title}
                    </span>
                    {col.sortable && (
                      <button
                        onClick={() => sortingByVal(col.name, idx)}
                        className="hover:text-blue-600 transition"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="currentColor"
                          viewBox="0 0 10 10"
                        >
                          <path d="M0 4h10L5 0 0 4zm0 2l5 4 5-4H0z" />
                        </svg>
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row: any, idx: number) => (
              <tr
                key={idx}
                className={`transition duration-150 hover:bg-blue-50/50 border-b border-gray-100`}
              >
                {columnData.map((col, i) => {
                  const value = row[col.name];
                  const isStatus = col.name === "status";
                  const isNameCol = col.name === "employee_name";

                  return (
                    <td key={i} className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {selectable && i === 0 && (
                          <CheckBox
                            checked={selectedRows.includes(row.uuid)}
                            onChange={(val: boolean) => onLocalRowSelect(val, row)}
                            disabled={row.disabled}
                          />
                        )}

                        {isNameCol ? (
                          <>
                            <div className="w-7 h-7 bg-indigo-600 text-white flex items-center justify-center rounded-full text-xs font-bold shadow">
                              {value?.[0]}
                            </div>
                            <span className="text-sm font-medium text-gray-800">
                              {value}
                            </span>
                          </>
                        ) : isStatus ? (
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${
                              value === "Active"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-rose-100 text-rose-700"
                            }`}
                          >
                            {value}
                          </span>
                        ) : col.action ? (
                          <col.action {...row} index={idx} />
                        ) : (
                          <span className="text-sm">{value}</span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="border-t px-6 py-4 bg-gray-50">
          <Pagination
            page={page}
            limit={limit}
            totalCount={totalCount}
            onPageClick={onPageClick}
            onLimitChange={onLimitChange}
            onRefresh={onRefresh}
          />
        </div>
      )}
    </div>
  );
};

export default Table;
