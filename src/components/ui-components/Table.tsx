// "use client";
// import { Fragment, useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/contexts/hooks/useAuth";
// import CheckBox from "../forms/CheckBox";
// import Pagination from "./Pagination";
// import Loader from "./Loader";
// import Icon from "./Icon";
// import { Button, Toggle } from "../forms";
// import { ColumnsType } from "@/types/tableTypes";
// import Legacy from "next/legacy/image";


// interface TableProps {
//   className?: string;
//   mainClassName?: string;
//   title?: string;
//   name?: string | null;
//   navigate?: string;
//   isLoading?: boolean;
//   columns: ColumnsType[];
//   data: any;
//   selectable?: boolean;
//   pagination?: boolean;
//   sortIconColor?: string;
//   page?: number;
//   totalCount?: number;
//   limit?: number;
//   selectedRows?: any;
//   headerClassName?: string;
//   bodyClassName?: string;
//   tdStyle?: string;
//   onLimitChange?: any;
//   onPageClick?: any;
//   onDeleteClick?: any;
//   onEditClick?: any;
//   onRefresh?: () => void;
//   onUpdateStatus?: (val: any) => void;
//   onSelectRow?: any;
//   isShadow?: boolean;
//   isMessage?: string;
//   showIcon?: boolean;
//   isExtra?: boolean;
//   managerName?: string | null;
// }

// const Table = (props: TableProps) => {
//   const {
//     className,
//     mainClassName,
//     title,
//     name,
//     navigate,
//     isLoading,
//     columns,
//     data,
//     selectable = true,
//     pagination = true,
//     sortIconColor = "white",
//     page,
//     totalCount,
//     limit = 10,
//     selectedRows,
//     headerClassName = "",
//     bodyClassName = "",
//     tdStyle = "",
//     onLimitChange,
//     onPageClick,
//     onDeleteClick,
//     onEditClick,
//     onRefresh,
//     onUpdateStatus,
//     onSelectRow,
//     isShadow = true,
//     isMessage = null,
//     showIcon = true,
//     isExtra = true,
//     managerName,
//   } = props;

// const noRecord = "/assets/images/no-records-new.svg";


//   const router = useRouter();
//   const { user } = useAuth();
//   const [tableData, setTableData] = useState(data);
//   const [columnData, setColumnData] = useState(columns);

//   useEffect(() => {
//     setTableData(data);
//   }, [data]);

//   const allChecked = () => {
//     const allRows = tableData?.filter((val: any) => !val?.disabled);
//     return (
//       selectedRows?.length &&
//       tableData?.length &&
//       selectedRows?.length === allRows?.length
//     );
//   };

//   const sortingByVal = (name: string, index: number) => {
//     const newTableData = [...tableData];
//     const newColumnData = [...columnData];
//     if (!newTableData?.length) return;
//     const currentSort = newColumnData[index]?.sort === "asc" ? "desc" : "asc";
//     newColumnData[index] = { ...newColumnData[index], sort: currentSort };
//     newTableData.sort((a, b) =>
//       currentSort === "asc"
//         ? a[name]?.toString().localeCompare(b[name]?.toString())
//         : b[name]?.toString().localeCompare(a[name]?.toString())
//     );
//     setColumnData(newColumnData);
//     setTableData(newTableData);
//   };

//   const onLocalRowSelect = (checked: boolean, data: any) => {
//     const id = data?.uuid;
//     let array = [...selectedRows];
//     if (checked) {
//       array.push(id);
//     } else {
//       array = array.filter((item) => item !== id);
//     }
//     onSelectRow?.(checked, data, array);
//   };

//   const onLocalRowSelectAll = (checked: boolean) => {
//     const allIds = checked
//       ? tableData
//         ?.filter((val: any) => !val?.disabled)
//         ?.map((val: any) => val?.uuid)
//       : [];
//     onSelectRow?.(checked, "all", allIds);
//   };

//   const isDisabled = (uuid: string) => {
//     const disabledIds = tableData
//       ?.filter((val: any) => val?.disabled)
//       ?.map((val: any) => val?.uuid);
//     return disabledIds?.includes(uuid);
//   };

//   const isShowButton = (buttontype: string) => {
//     const data = user?.manager_detail?.roles?.length
//       ? user?.manager_detail?.roles[0]
//       : {};

//     if (
//       managerName &&
//       data?.module_permission?.[managerName]?.[buttontype] === "0"
//     ) {
//       return true;
//     }

//     return false;
//   };

//   return (
//     <div
//       className={`relative z-[0]
//  ${mainClassName} ${
//         isShadow ? "" : ""
//       } bg-gradient-to-br from-white to-slate-100   overflow-hidden rounded-xl`}
//     >
//       {/* rounded-2xl */}
//       <div className={`overflow-x-auto ${className}`}>
//        <table className="w-full min-w-full divide-gray-200">
//   <thead className="bg-blue-50 sticky top-0 z-10">
//     <tr>
//       {columnData?.map((col, index) => (
//         <Fragment key={index}>
//           <th
//             className={`px-6 py-4 text-sm font-semibold text-slate-700 tracking-wide ${tdStyle} ${headerClassName}`}
//           >
//             <div className="flex items-center gap-2">
//               {selectable && index === 0 && (
//                 <CheckBox
//                   checked={allChecked()}
//                   onChange={(checked: boolean) =>
//                     onLocalRowSelectAll(checked)
//                   }
//                 />
//               )}
//               <span>{col.title}</span>
//               {col.sortable && (
//                 <button onClick={() => sortingByVal(col.name, index)}>
//                   <svg
//                     className="w-4 h-4 text-slate-500 hover:text-blue-600 transition-transform"
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                   >
//                     <path d="M6 8l4-4 4 4M6 12l4 4 4-4" />
//                   </svg>
//                 </button>
//               )}
//             </div>
//           </th>
//           {index === columnData.length - 1 && isExtra && (
//             <th className="px-6 py-4" />
//           )}
//         </Fragment>
//       ))}
//     </tr>
//   </thead>

//   <tbody className="bg-white divide-y border border-slate-200 divide-gray-200">
//     {tableData && tableData.length > 0 ? (
//       tableData.map((val: any, index: number) => (
//         <tr key={index} className="hover:bg-blue-50 transition">
//           {columnData.map((column: any, idx: number) => {
//             const {
//               action: Action,
//               showDelete = true,
//               showEdit = true,
//             } = column;

//             if (column?.name === "actions") {
//               return (
//                 <td
//                   key={idx}
//                   scope="row"
//                   className="px-6 py-2.5 font-normal text-txt-primary text-xs whitespace-nowrap"
//                 >
//                   {Action ? (
//                     <Action {...val} index={index} />
//                   ) : (
//                     <div className="flex gap-2">
//                       {showEdit && !val?.disabled && (
//                         !managerName || isShowButton("edit") ? (
//                           <Icon
//                             tooltip="Edit"
//                             name="Edit"
//                             width={20}
//                             height={20}
//                             alt="Edit"
//                             onClick={() =>
//                               onEditClick && onEditClick(val)
//                             }
//                           />
//                         ) : null
//                       )}
//                       {showDelete && !val?.disabled && (
//                         !managerName || isShowButton("delete") ? (
//                           <Icon
//                             tooltip="Delete"
//                             name="DeleteRed"
//                             width={20}
//                             height={20}
//                             alt="Delete"
//                             onClick={() =>
//                               onDeleteClick && onDeleteClick(val)
//                             }
//                           />
//                         ) : null
//                       )}
//                     </div>
//                   )}
//                 </td>
//               );
//             }

//             if (column?.name === "status") {
//               return (
//                 <td
//                   key={idx}
//                   scope="row"
//                   className="px-6 py-2.5 font-normal text-txt-primary text-xs whitespace-nowrap"
//                 >
//                   {Action ? (
//                     <Action {...val} index={index} />
//                   ) : (
//                     <Toggle
//                       loading={isLoading}
//                       checked={val.status === "0"}
//                       onChange={() => {
//                         onUpdateStatus?.(val);
//                       }}
//                     />
//                   )}
//                 </td>
//               );
//             }

//             return (
//               <td key={idx} scope="row">
//                 <div
//                   className={`gap-2 flex items-center px-6 py-2.5 ${tdStyle} font-normal text-txt-primary text-xs whitespace-nowrap ${
//                     (val?.isBold || column?.isBold) &&
//                     "!font-bold !text-heading"
//                   }`}
//                 >
//                   {selectable && idx === 0 && (
//                     <CheckBox
//                       disabled={isDisabled(val?.uuid)}
//                       checked={selectedRows?.includes(val?.uuid)}
//                       onChange={(checked: boolean) =>
//                         onLocalRowSelect(checked, val)
//                       }
//                     />
//                   )}
//                   {Action ? (
//                     <div className="text-xs gap-2 flex">
//                       <Action {...val} index={index} />
//                     </div>
//                   ) : (
//                     val[column.name]
//                   )}
//                 </div>
//               </td>

//             );
//           })}
//           {isExtra && <td />}
//         </tr>
//       ))
//     ) : (
//       <tr>
//         <td colSpan={columnData.length + (isExtra ? 1 : 0)}>
//           <div className="flex flex-col items-center justify-center py-32">
//             <div className="relative h-40 w-40 mb-4">
//               <Legacy
//                 src={noRecord}
//                 layout="fill"
//                 alt="No Data Found"
//               />
//             </div>
//             {title && (
//               <>
//                 <p className="text-sm text-gray-500 mb-4">
//                   Try to create a {title}
//                 </p>
//               </>
//             )}
//           </div>
//         </td>
//       </tr>
//     )}
//   </tbody>
// </table>

//       </div>
//       {pagination && (
//         <div className="w-full  border border-slate-200 bg-slate-50 p-4 rounded-b-lg">
//           <Pagination
//             managerName={managerName}
//             title={title}
//             navigate={navigate}
//             isDisabledCreate={false}
//             isShowButton={true}
//             page={page}
//             length={tableData?.length}
//             limit={limit}
//             totalCount={totalCount}
//             onPageClick={onPageClick}
//             onLimitChange={onLimitChange}
//             onRefresh={onRefresh}
//             isAdvance={limit < tableData?.length}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default Table;




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
import Legacy from "next/legacy/image";

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
  const noRecord = "/assets/images/no-records-new.svg";

  const [tableData, setTableData] = useState(data);
  const [columnData, setColumnData] = useState(columns);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  useEffect(() => {
    setTableData(data);
    setExpandedRows([]);
  }, [data]);

  const allChecked = () => {
    const allRows = tableData?.filter((val: any) => !val?.disabled);
    return (
      selectedRows?.length &&
      tableData?.length &&
      selectedRows?.length === allRows?.length
    );
  };

  const toggleRowExpansion = (uuid: string, hasChildren: boolean) => {
    if (!hasChildren) return;
    setExpandedRows(prev =>
      prev.includes(uuid)
        ? prev.filter(id => id !== uuid)
        : [...prev, uuid]
    );
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
    const id = data?.disposition_uuid || data?.uuid;
    let array = [...selectedRows];
    if (checked) {
      array.push(id);
    } else {
      array = array.filter((item) => item !== id);
    }
    onSelectRow?.(checked, data, array);
  };

  const onLocalRowSelectAll = (checked: boolean) => {
    const allIds = checked
      ? tableData
        ?.filter((val: any) => !val?.disabled)
        ?.map((val: any) => val?.disposition_uuid || val?.uuid)
      : [];
    onSelectRow?.(checked, "all", allIds);
  };

  const isDisabled = (uuid: string) => {
    const disabledIds = tableData
      ?.filter((val: any) => val?.disabled)
      ?.map((val: any) => val?.disposition_uuid || val?.uuid);
    return disabledIds?.includes(uuid);
  };

  const isShowButton = (buttontype: string) => {
    const data = user?.manager_detail?.roles?.[0] || {};
    return managerName && data?.module_permission?.[managerName]?.[buttontype] === "0";
  };

  const renderRow = (row: any, level: number = 0) => {
    const uuid = row.disposition_uuid || row?.uuid;
    const isExpanded = expandedRows.includes(uuid);
    const hasChildren = row.has_children;

    return (
      <Fragment key={uuid}>
        {/* <tr className={`hover:bg-blue-50 transition`}>*/}
        <tr className={`${level > 0 ? 'bg-slate-100' : 'bg-white'} hover:bg-blue-50 transition border-b border-slate-200`}>
          {columnData.map((column, idx) => {
            const { action: Action, showDelete = true, showEdit = true } = column;

            if (column.name === "actions") {
              return (
                <td
                  key={idx}
                  scope="row"
                  className="px-6 py-3 font-normal text-txt-primary text-xs whitespace-nowrap"
                  onClick={(e: React.MouseEvent<HTMLTableCellElement>) => e.stopPropagation()}
                >
                  {Action ? (
                  <Action {...row} index={level} />
                  ) : (
                  <div className="flex gap-2">
                    {showEdit && !row?.disabled && (
                      !managerName || isShowButton("edit") ? (
                        <Icon
                          tooltip="Edit"
                          name="Edit"
                          width={20}
                          height={20}
                          alt="Edit"
                          onClick={() =>
                            onEditClick && onEditClick(row)
                          }
                        />
                      ) : null
                    )}
                    {showDelete && !row?.disabled && (
                      !managerName || isShowButton("delete") ? (
                        <Icon
                          tooltip="Delete"
                          name="DeleteRed"
                          width={20}
                          height={20}
                          alt="Delete"
                          onClick={() =>
                            onDeleteClick && onDeleteClick(row)
                          }
                        />
                      ) : null
                    )}
                  </div>
                  )}
                </td>
              );
            }

            if (column.name === "status") {
              return (
                <td 
                  key={idx} 
                  className="px-6 py-3 text-xs text-txt-primary whitespace-nowrap"
                  onClick={(e: React.MouseEvent<HTMLTableCellElement>) => e.stopPropagation()}
                >
                  {Action ? (
                    <Action {...row} index={level} />
                  ) : (
                    <Toggle loading={isLoading} checked={row.status === "0"} onChange={() => onUpdateStatus?.(row)} />
                  )}
                </td>
              );
            }

            // For the first column (name column with checkbox)
            if (idx === 0) {
              return (
                <td 
                  key={idx}
                  className={hasChildren ? 'cursor-pointer' : ''}
                  onClick={(e: React.MouseEvent<HTMLTableCellElement>) => {
                    // Check if click was on checkbox or its container
                    const target = e.target as HTMLElement;
                    const isCheckboxClick = target.closest('input[type="checkbox"]') || 
                                           target.closest('.checkbox-container');

                    if (!isCheckboxClick && hasChildren) {
                      toggleRowExpansion(uuid, hasChildren);
                    }
                  }}
                >
                  <div
                    className={`gap-3 flex items-center py-3 ${tdStyle} text-xs whitespace-nowrap`}
                    style={{ paddingLeft: `${level === 0 ? 24 : level * 32 + 24}px` }}
                  >
                    {selectable && (
                      <div 
                        className="checkbox-container"
                        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
                      >
                        <CheckBox
                          disabled={isDisabled(uuid)}
                          checked={selectedRows?.includes(uuid)}
                          onChange={(checked: boolean) => onLocalRowSelect(checked, row)}
                        />
                      </div>
                    )}

                    {/* {hasChildren && row.children && row.children.length > 0 && (
                      <span className="mr-2 ">
                        {isExpanded ? '▼' : '▶'}
                      </span> */}

                    {/* Expand/Collapse Icon - Only for parent rows */}
                    {level === 0 && hasChildren && row.children && row.children.length > 0 && (
                      <button
                        className="flex items-center justify-center w-5 h-5 text-slate-600 hover:text-blue-600 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRowExpansion(uuid, hasChildren);
                        }}
                      >
                        <svg
                          className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  {Action ? <Action {...row} /> : row[column.name]}
                  </div>
                </td>
              );
            }
            return (
              <td 
                key={idx}
                className={hasChildren ? 'cursor-pointer' : ''}
                onClick={() => hasChildren && toggleRowExpansion(uuid, hasChildren)}
              >
                {/* <div
                  className={`gap-2 flex items-center px-6 py-2.5 ${tdStyle} text-xs whitespace-nowrap`}
                  style={{ paddingLeft: `${level * 24 + 24}px` }}
                > */}
                <div
                  className={`gap-2 flex items-center px-6 py-3 ${tdStyle} text-xs whitespace-nowrap`}
                >
                  {Action ? <Action {...row} index={level} /> : row[column.name]}
                </div>
              </td>
            );
          })}
          {isExtra && <td />}
        </tr>

        {/* Recursively render nested children if expanded */}
        {isExpanded && row.children?.map((child: any) => renderRow(child, level + 1))}
      </Fragment>
    );
  };


  return (
    <div className={`relative z-[0] ${mainClassName} overflow-hidden rounded-xl`}>
      <div className={`overflow-x-auto ${className}`}>
        <table className="w-full min-w-full divide-gray-200">
          <thead className="bg-blue-50 sticky top-0 z-10">
            <tr>
              {columnData?.map((col, index) => (
                <Fragment key={index}>
                  <th className={`px-6 py-4 text-sm font-semibold text-slate-700 ${tdStyle} ${headerClassName}`}>
                    <div className="flex items-center gap-2">
                      {selectable && index === 0 && (
                        <CheckBox checked={allChecked()} onChange={onLocalRowSelectAll} />
                      )}
                      <span>{col.title}</span>
                      {col.sortable && (
                        <button onClick={() => sortingByVal(col.name, index)}>
                          <svg className="w-4 h-4 text-slate-500 hover:text-blue-600" viewBox="0 0 20 20" fill="currentColor">
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

          <tbody className="bg-white divide-y border border-slate-200">
            {tableData?.length > 0 ? (
              tableData.map((row: any) => renderRow(row))
            ) : (
              <tr>
                <td colSpan={columnData.length + (isExtra ? 1 : 0)}>
                  <div className="flex flex-col items-center justify-center py-32">
                    <div className="relative h-40 w-40 mb-4">
                      <Legacy src={noRecord} layout="fill" alt="No Data Found" />
                    </div>
                    {title && (
                      <p className="text-sm text-gray-500 mb-4">Try to create a {title}</p>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      {pagination && (
        <div className="w-full border border-slate-200 bg-slate-50 p-4 rounded-b-lg">
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
