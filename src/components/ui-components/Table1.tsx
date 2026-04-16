"use client";
import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/hooks/useAuth";
import CheckBox from "../forms/CheckBox";
import Pagination from "./Pagination";
import Loader from "./Loader";
import Icon from "./Icon";
import { Button, Toggle } from "../forms";
import { ColumnsType } from "@/types/tableTypes";

interface TableProps {
  className?: string;
  mainClassName?: string;
  title?: string;
  name?: string | null;
  navigate?: string;
  isLoading?: boolean;
  columns: ColumnsType[];
  data: any;
  selectable?: boolean;
  pagination?: boolean;
  sortIconColor?: string;
  page?: number;
  totalCount?: number;
  limit?: number;
  selectedRows?: any;
  headerClassName?: string;
  bodyClassName?: string;
  tdStyle?: string;
  onLimitChange?: any;
  onPageClick?: any;
  onDeleteClick?: any;
  onEditClick?: any;
  onRefresh?: () => void;
  onUpdateStatus?: (val: any) => void;
  onSelectRow?: any;
  isShadow?: boolean;
  isMessage?: string;
  showIcon?: boolean;
  isExtra?: boolean;
  managerName?: string | null;
}

const Table = (props: TableProps) => {
  const {
    className,
    mainClassName,
    title,
    name,
    navigate,
    isLoading,
    columns,
    data,
    selectable = true,
    pagination = true,
    sortIconColor = "white",
    page,
    totalCount,
    limit = 10,
    selectedRows,
    headerClassName = "",
    bodyClassName = "",
    tdStyle = "",
    onLimitChange,
    onPageClick,
    onDeleteClick,
    onEditClick,
    onRefresh,
    onUpdateStatus,
    onSelectRow,
    isShadow = true,
    isMessage = null,
    showIcon = true,
    isExtra = true,
    managerName,
  } = props;

  const router = useRouter();
  const { user } = useAuth();
  const [tableData, setTableData] = useState(data);
  const [columnData, setColumnData] = useState(columns);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const allChecked = () => {
    const allRows = tableData?.filter((val: any) => !val?.disabled);
    return selectedRows?.length && tableData?.length && selectedRows?.length === allRows?.length;
  };

  const sortingByVal = (name: string, index: number) => {
    const newTableData = [...tableData];
    const newColumnData = [...columnData];
    if (!newTableData?.length) return;
    const currentSort = newColumnData[index]?.sort === "asc" ? "desc" : "asc";
    newColumnData[index] = { ...newColumnData[index], sort: currentSort };
    newTableData.sort((a, b) =>
      currentSort === "asc"
        ? a[name]?.toString().localeCompare(b[name]?.toString())
        : b[name]?.toString().localeCompare(a[name]?.toString())
    );
    setColumnData(newColumnData);
    setTableData(newTableData);
  };

  const onLocalRowSelect = (checked: boolean, data: any) => {
    const id = data?.uuid;
    let array = [...selectedRows];
    if (checked) {
      array.push(id);
    } else {
      array = array.filter((item) => item !== id);
    }
    onSelectRow?.(checked, data, array);
  };

  const onLocalRowSelectAll = (checked: boolean) => {
    const allIds = checked ? tableData?.filter((val: any) => !val?.disabled)?.map((val: any) => val?.uuid) : [];
    onSelectRow?.(checked, "all", allIds);
  };

  const isDisabled = (uuid: string) => {
    const disabledIds = tableData?.filter((val: any) => val?.disabled)?.map((val: any) => val?.uuid);
    return disabledIds?.includes(uuid);
  };

  return (
    <div
      className={`relative ${mainClassName} ${isShadow ? "shadow-2xl" : ""} bg-gradient-to-br from-white to-slate-100 border border-slate-200 rounded-2xl overflow-hidden`}
    >
      <div className={`overflow-x-auto ${className}`}>
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-100 sticky top-0 z-10">
            <tr>
              {columnData?.map((col, index) => (
                <Fragment key={index}>
                  <th
                    className={`px-6 py-4 text-sm font-semibold text-slate-700 tracking-wide ${tdStyle} ${headerClassName}`}
                  >
                    <div className="flex items-center gap-2">
                      {selectable && index === 0 && (
                        <CheckBox checked={allChecked()} onChange={(checked: boolean) => onLocalRowSelectAll(checked)} />
                      )}
                      <span>{col.title}</span>
                      {col.sortable && (
                        <button onClick={() => sortingByVal(col.name, index)}>
                          <svg
                            className="w-4 h-4 text-slate-500 hover:text-blue-600 transition-transform"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M6 8l4-4 4 4M6 12l4 4 4-4" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </th>
                  {index === columnData.length - 1 && isExtra && <th className="px-6 py-4" />}
                </Fragment>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {tableData?.map((row: any, rowIndex: number) => (
              <tr key={rowIndex} className="hover:bg-blue-50 transition">
                {columnData.map((col, colIndex) => {
                  const value = row[col.name];
                  return (
                    <td key={colIndex} className={`px-6 py-3 ${bodyClassName}`}>
                      <div className="flex items-center gap-2">
                        {selectable && colIndex === 0 && (
                          <CheckBox
                            disabled={isDisabled(row.uuid)}
                            checked={selectedRows?.includes(row.uuid)}
                            onChange={(checked: boolean) => onLocalRowSelect(checked, row)}
                          />
                        )}
                        {col.action ? <col.action {...row} index={rowIndex} /> : value}
                      </div>
                    </td>
                  );
                })}
                {isExtra && <td />}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pagination && (
        <div className="w-full border-t bg-slate-50 p-4">
          <Pagination
            managerName={managerName}
            title={title}
            navigate={navigate}
            isDisabledCreate={false}
            isShowButton={true}
            page={page}
            length={tableData?.length}
            limit={limit}
            totalCount={totalCount}
            onPageClick={onPageClick}
            onLimitChange={onLimitChange}
            onRefresh={onRefresh}
            isAdvance={limit < tableData?.length}
          />
        </div>
      )}
    </div>
  );
};

export default Table;