"use client";

import React, { useState, useRef, useEffect } from "react";
import moment from "moment";

// PROJECT IMPORT
import { Head, Table, Icon } from "@/components/ui-components";
import ScheduleReportForm from "@/components/manager-tenant-pages/scheduling/ScheduleReportForm";
import { ColumnsType } from "@/types/tableTypes";
import { Button, Toggle } from "@/components/forms";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { DeleteModal } from "@/components/modals";
import {
    scheduleReportSearch,
    scheduleReportCreate,
    scheduleReportUpdate,
    scheduleReportDelete,
    selectScheduleReports,
    selectIsLoading
} from "@/redux/slice/tenant-admin/scheduleReportSlice";
import { set } from "date-fns";
import { downloadCsv, downloadZip } from "@/utils/downloadCsvZipFile";

const Page = () => {
    const dispatch = useAppDispatch();
    const isFormOpenRef = useRef(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editData, setEditData] = useState<any>(null);
    const [deleteUuid, setDeleteUuid] = useState<string>("");
    const formikRef = useRef<any>(null);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [viewData, setViewData] = useState<any>(null);
    const handleView = (row: any) => {
        setViewData(row);          // ✅ store clicked row data
        setOpenViewModal(true);    // ✅ open popup
    };
    const { data: scheduledReports, count } = useAppSelector(selectScheduleReports);
    const isLoading = useAppSelector(selectIsLoading);

    useEffect(() => {
        dispatch(scheduleReportSearch({}));
    }, [dispatch]);

    const handleEdit = (row: any) => {
        setEditData(row);
        setIsFormOpen(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (uuid: string) => {
        setDeleteUuid(uuid);
    };

    const onConfirmDelete = () => {
        if (deleteUuid) {
            dispatch(scheduleReportDelete(deleteUuid)).then(() => {
                dispatch(scheduleReportSearch({}));
                setDeleteUuid("");
            });
        }
    };

    const columns: ColumnsType[] = [
        {
            name: "name",
            title: "Report Name",
        },
        {
            name: "createdAt",
            title: "Request Date",
            action: (row: any) => moment(row.createdAt).format("DD-MM-YYYY HH:mm")
        },
        {
            name: "callstart",
            title: "Start Date",
        },
        {
            name: "callend",
            title: "End Date",
        },
        {
            name: "total_rows",
            title: "Total Rows",
        },
        {
            name: "total_recordings",
            title: "Total Recordings",
        },
        // {
        //     name: "bulk_download",
        //     title: "Bulk Recording Download",
        //     action: (row: any) => {
        //         let badge;
        //         if (row?.bulk_download === "yes") {
        //             badge = "bg-green-100 text-green-800";
        //         } else {
        //             badge = "bg-gray-100 text-gray-800";
        //         }

        //         return (<span className={`px-2 py-1 rounded-full text-xs font-semibold ${badge}`}> {row?.bulk_download?.toUpperCase()} </span>);
        //     }
        // },
        {
            name: "request_status",
            title: "CSV Status",
            sortable: true,
            action: (row: any) => {
                let statusClass = "";
                switch (row?.request_status) {
                    case "pending":
                        statusClass = "bg-yellow-100 text-yellow-800";
                        break;
                    case "completed":
                        statusClass = "bg-green-100 text-green-800";
                        break;
                    case "inprogress":
                        statusClass = "bg-blue-100 text-blue-800";
                        break;
                    default:
                        statusClass = "bg-red-100 text-red-800";
                }

                return (<span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClass}`}> {row?.request_status?.toUpperCase()} </span>);
            }

        },
        {
            name: "bulk_status",
            title: "Bulk Recording Status",
            sortable: true,
            action: (row: any) => {
                let statusClass = "";
                switch (row?.bulk_status) {
                    case "not requested":
                        statusClass = "bg-gray-100 text-gray-800";
                        break;
                    case "pending":
                        statusClass = "bg-yellow-100 text-yellow-800";
                        break;
                    case "completed":
                        statusClass = "bg-green-100 text-green-800";
                        break;
                    case "inprogress":
                        statusClass = "bg-blue-100 text-blue-800";
                        break;
                    default:
                        statusClass = "bg-red-100 text-red-800";
                }

                return (<span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClass}`}> {row?.bulk_status?.toUpperCase()} </span>);
            }
        },
        // {
        //     name: "csv_url",
        //     title: "Download",
        //     action: (row: any) => row.csv_url ? (
        //         <a
        //             href={`${process.env.NEXT_PUBLIC_BASE_URL}${row.csv_url}`}
        //             target="_blank"
        //             rel="noreferrer"
        //             className="text-blue-600 hover:text-blue-800 flex justify-center"
        //         >
        //             <Icon name="Download" width={20} height={20} tooltip="Download CSV" />
        //         </a>
        //     ) : "-"
        // },
        {
            name: "actions",
            title: "Actions",
            action: (row: any) => (
                <div className="flex gap-2 ">
                    <Icon
                        name="Eye"
                        width={20}
                        height={20}
                        className="cursor-pointer text-blue-600"
                        onClick={() => handleView(row)}
                        tooltip="View"
                    />

                    {row.csv_url ? (
                        <Icon
                            name="Download"
                            width={20}
                            height={20}
                            className="cursor-pointer text-blue-600"
                            tooltip="Download CSV"
                            onClick={() => {
                                const a = document.createElement("a");
                                document.body.appendChild(a);
                                downloadCsv(`${process.env.NEXT_PUBLIC_BASE_URL}${row.csv_url}`, row.mapping || {}, row.tenant_uuid, a);
                            }}
                        />
                    ) : ""}

                    {row.bulk_path ? (
                        <Icon
                            name="Zip"
                            width={20}
                            height={20}
                            className="cursor-pointer text-blue-600"
                            tooltip="Download ZIP"
                            onClick={() => {
                                const a = document.createElement("a");
                                document.body.appendChild(a);
                                downloadZip(`${process.env.NEXT_PUBLIC_BASE_URL}${row.bulk_path}`, row.tenant_uuid, a);
                            }}
                        />
                    ) : ""}

                    {/* <Icon
                        name="Edit"
                        width={20}
                        height={20}
                        className="cursor-pointer text-blue-600"
                        onClick={() => handleEdit(row)}
                        tooltip="Edit"
                    /> */}

                    <Icon
                        name="Delete"
                        width={20}
                        height={20}
                        className="cursor-pointer text-red-600"
                        onClick={() => handleDelete(row.uuid)}
                        tooltip="Delete"
                    />
                </div>
            )
        }
    ];

    const handleScheduleSubmit = (values: any) => {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";
        if (editData) {
            dispatch(scheduleReportUpdate({ uuid: editData.uuid, payload: values })).then(() => {
                dispatch(scheduleReportSearch({}));
                setIsFormOpen(false);
                setEditData(null);
            });
        } else {
            dispatch(scheduleReportCreate({ ...values, baseUrl })).then(() => {
                dispatch(scheduleReportSearch({}));
                setIsFormOpen(false);
                setEditData(null);
            });
        }
    };

    const isEmptyValue = (val: any) => {
        if (val === null || val === undefined) return true;
        if (typeof val === "string" && val.trim() === "") return true;
        if (Array.isArray(val) && val.length === 0) return true;
        if (typeof val === "object" && !Array.isArray(val) && Object.keys(val).length === 0) return true;
        return false;
    };

    const formatLabel = (key: string) => {
        return key
            .replaceAll("_", " ")
            .replaceAll("|4", "")
            .replace(/\b\w/g, (c) => c.toUpperCase());
    };

    const renderValue = (val: any) => {
        if (Array.isArray(val)) {
            return (
                <div className="flex flex-wrap gap-2">
                    {val.map((item, idx) => (
                        <span
                            key={idx}
                            className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-100"
                        >
                            {String(item)}
                        </span>
                    ))}
                </div>
            );
        }

        if (typeof val === "object" && val !== null) {
            return (
                <pre className="text-xs bg-gray-900 text-white rounded-lg p-3 overflow-auto whitespace-pre-wrap break-words">
                    {JSON.stringify(val, null, 2)}
                </pre>
            );
        }

        return <span className="text-sm font-semibold text-gray-900">{String(val)}</span>;
    };


    return (
        <>
            <div className="flex flex-col gap-5">
                <Head
                    createText="Request Report"
                    title="Schedule Report"
                    filterText="Schedule Report"
                    submitText={editData ? "Update Schedule" : "Request Report"}
                    isAdvance={isFormOpen}
                    onToggleAdvance={() => {
                        setIsFormOpen(!isFormOpen);
                        if (isFormOpen) setEditData(null);
                    }}
                    onSearchClick={() => formikRef.current?.handleSubmit()}
                >
                    <ScheduleReportForm
                        formikRef={formikRef}
                        onSubmit={handleScheduleSubmit}
                        initialData={editData}
                    />
                </Head>

                <div className="mx-3">
                    <Table
                        title="Scheduled Report"
                        columns={columns}
                        data={scheduledReports}
                        isLoading={isLoading}
                        selectable={false}
                        pagination={true}
                        limit={10}
                        totalCount={count}
                        onPageClick={(page: any) => dispatch(scheduleReportSearch({ page }))}
                    />
                </div>

                <DeleteModal
                    visible={!!deleteUuid}
                    loading={isLoading}
                    onCancelClick={() => setDeleteUuid("")}
                    onDoneClick={onConfirmDelete}
                />
            </div>
            {openViewModal && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-3"
                    onClick={() => setOpenViewModal(false)} // ✅ click outside close
                >
                    <div
                        className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-gray-200 animate-[fadeIn_0.2s_ease-in-out]"
                        onClick={(e) => e.stopPropagation()} // ✅ stop closing when clicking inside
                    >
                        {/* ✅ Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl  text-white flex items-center justify-center shadow-md bg-gray-100 text-gray-800 hover:bg-gray-200 transition font-semibold">
                                    <Icon name="Eye" width={20} height={20} tooltip="View" />
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Request Details</h2>
                                    <p className="text-xs text-gray-500">
                                        Here you can view report request summary
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {/* ✅ Status Badge in Header */}
                                {viewData?.request_status && (
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${viewData.request_status === "pending"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : viewData.request_status === "completed"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-blue-100 text-blue-800"
                                            }`}
                                    >
                                        {viewData.request_status.toUpperCase()}
                                    </span>
                                )}

                                <Icon
                                    className="cursor-pointer hover:rotate-90 transition-transform duration-200"
                                    name="Close"
                                    width={28}
                                    height={28}
                                    alt="Close"
                                    onClick={() => setOpenViewModal(false)}
                                />
                            </div>
                        </div>

                        {/* ✅ Body */}
                        <div className="p-6 max-h-[70vh] overflow-y-auto">
                            {viewData ? (
                                <div className="flex flex-col gap-6">

                                    {/* ✅ BASIC INFO */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
                                            <p className="text-xs text-gray-500 mb-1">UUID</p>
                                            <p className="text-sm font-semibold text-gray-900 break-all">
                                                {viewData?.uuid || "-"}
                                            </p>
                                        </div>

                                        <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
                                            <p className="text-xs text-gray-500 mb-1">Request Date</p>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {viewData?.createdAt ? moment(viewData.createdAt).format("DD-MM-YYYY HH:mm") : "-"}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
                                            <p className="text-xs text-gray-500 mb-1">Total Rows</p>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {viewData?.total_rows ?? "-"}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
                                            <p className="text-xs text-gray-500 mb-1">Total Recordings</p>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {viewData?.total_recordings ?? "-"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* ✅ APPLIED FILTERS */}
                                    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                                        <div className="px-5 py-3 border-b bg-gray-50 flex items-center justify-between">
                                            <h3 className="text-sm font-bold text-gray-900">Applied Filters</h3>
                                            <span className="text-xs text-gray-500">
                                                Selected filters
                                            </span>
                                        </div>

                                        <div className="p-5">
                                            {(() => {
                                                const appliedFilters: Record<string, any> = { filters: viewData?.filters };
                                                const entries = Object.entries(appliedFilters).filter(([_, value]) => !isEmptyValue(value));

                                                if (entries.length === 0) { return (<div className="text-sm text-gray-500"> No extra filters applied in this request. </div>); }

                                                return (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {entries.map(([key, value]) => (
                                                            <div key={key} className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
                                                                <p className="text-xs text-gray-500 mb-2"> {formatLabel(key)} </p>
                                                                {renderValue(value)}
                                                            </div>
                                                        ))}
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    </div>

                                    {/* ✅ Mapped Headers */}
                                    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                                        <div className="px-5 py-3 border-b bg-gray-50 flex items-center justify-between">
                                            <h3 className="text-sm font-bold text-gray-900">Mapped Headers</h3>
                                            <span className="text-xs text-gray-500">
                                                Selected Headers
                                            </span>
                                        </div>

                                        <div className="p-5">
                                            {(() => {
                                                const appliedFilters: Record<string, any> = { mapping: viewData?.mapping };
                                                const entries = Object.entries(appliedFilters).filter(([_, value]) => !isEmptyValue(value));

                                                if (entries.length === 0) { return (<div className="text-sm text-gray-500"> No extra mapped headers in this request. </div>); }

                                                return (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {entries.map(([key, value]) => (
                                                            <div key={key} className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
                                                                <p className="text-xs text-gray-500 mb-2"> {formatLabel(key)} </p>
                                                                {renderValue(value)}
                                                            </div>
                                                        ))}
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-10">
                                    <p className="text-sm text-gray-500">No data found</p>
                                </div>
                            )}
                        </div>


                        {/* ✅ Footer */}
                        <div className="border-t px-6 py-4 flex justify-end gap-3 bg-white">
                            <button
                                onClick={() => setOpenViewModal(false)}
                                className="px-5 py-2 rounded-xl bg-gray-100 text-gray-800 hover:bg-gray-200 transition font-semibold"
                            >
                                Close
                            </button>

                            {viewData?.csv_url && (
                                <button
                                    onClick={() => {
                                        const a = document.createElement("a");
                                        document.body.appendChild(a);
                                        downloadCsv(`${process.env.NEXT_PUBLIC_BASE_URL}${viewData.csv_url}`, viewData.mapping || {}, viewData.tenant_uuid, a);
                                    }}
                                    className="px-5 py-2 rounded-xl bg-green-200 text-white"
                                >
                                    <Icon name="Download" width={18} height={18} />
                                </button>
                            )}

                            {viewData?.bulk_path && (
                                <button
                                    onClick={() => {
                                        const a = document.createElement("a");
                                        document.body.appendChild(a);
                                        downloadZip(`${process.env.NEXT_PUBLIC_BASE_URL}${viewData.bulk_path}`, viewData.tenant_uuid, a);
                                    }}
                                    className="px-5 py-2 rounded-xl bg-orange-200 text-white"
                                >
                                    <Icon name="Zip" width={18} height={18} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </>


    );
};

export default Page;
