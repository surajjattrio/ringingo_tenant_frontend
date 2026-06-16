"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// PROJECT IMPORT
import { Head, Table } from "@/components/ui-components";
import { DeleteModal } from "@/components/modals";

// TYPES IMPORT
import { ColumnsType } from "@/types/tableTypes";
import { ManagerPageTypes } from "@/types/formTypes";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { mailScheduleSearch, mailScheduleDelete, mailScheduleDeleteMultiple, mailScheduleUpdateStatus, selectMailSchedules, selectIsLoading } from "@/redux/slice/tenant-admin/mailScheduleSlice";
import { Success } from "@/redux/services/toasterServices";
import { formatDate } from "@/helperFunctions";

const MailSchedule = (props: ManagerPageTypes) => {
    const { managerName = null, name = null } = props;
    const router = useRouter();
    const dispatch = useAppDispatch();

    const loading = useAppSelector(selectIsLoading);
    const mailScheduleData = useAppSelector(selectMailSchedules);

    const [filter, setFilter] = useState<any>({
        page: 1,
        limit: 10,
        search: "",
        isAdvance: false,
    });
    const [selectedRow, setSelectedRow] = useState<string[]>([]);
    const [deleteId, setDeleteId] = useState<any>("");

    useEffect(() => {
        dispatch(mailScheduleSearch(filter));
    }, [filter]);

    const columns: ColumnsType[] = [
        {
            name: "name",
            title: "Name",
            sortable: true,
        },
        {
            name: "report_type",
            title: "Report Type",
            sortable: true,
            action: (row: any) => {
                if (!row.report_type) return "-";
                const typeMap: Record<string, string> = {
                    cdr: "CDR Report",
                    user_performance: "User Performance",
                    login_logout: "Login Logout Report"
                };
                return row.report_type.split(',').map((val: string) => typeMap[val.trim()] || val).join(', ');
            }
        },
        {
            name: "dateRange",
            title: "Date Range",
            action: (row: any) => `${formatDate(row.startDate)} to ${formatDate(row.endDate)}`,
        },
        {
            name: "timing",
            title: "Timing",
            sortable: true,
        },
        {
            name: "status",
            title: "Status",
            sortable: true,
        },
        {
            name: "actions",
            title: "Actions",
        },
    ];

    const onEmptySearch = () => {
        setFilter({
            ...filter,
            page: 1,
            limit: 10,
            isAdvance: false,
        });
    };

    const onCreateSchedule = () =>
        router.push(
            managerName
                ? "/manager-mail-schedule/create"
                : "/tenant-mail-schedule/create"
        );

    const onEditClick = (data: any) => {
        router.push(managerName ? `/manager-mail-schedule/${data?.uuid}` : `/tenant-mail-schedule/${data?.uuid}`);
    };

    const onUpdateStatus = async (val: any) => {
        try {
            const payload = {
                uuid: val.uuid,
                status: val.status === "0" ? "1" : "0"
            };
            await dispatch(mailScheduleUpdateStatus(payload)).unwrap();
            Success("Status updated successfully");
            dispatch(mailScheduleSearch(filter));
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const onDeleteSchedule = async (id: string) => {
        try {
            if (id.includes(",")) {
                await dispatch(mailScheduleDeleteMultiple({ uuid: id })).unwrap();
            } else {
                await dispatch(mailScheduleDelete(id)).unwrap();
            }
            Success("Deleted successfully");
            setDeleteId("");
            setSelectedRow([]);
            dispatch(mailScheduleSearch(filter));
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    const onMassDeleteSchedule = () => {
        const selectedRows = [...selectedRow];
        setDeleteId(selectedRows.join(","));
    };

    return (
        <div className="bg-white p-5 rounded-[25px]">
            <Head
                name={name}
                managerName={managerName}
                length={mailScheduleData?.count || 0}
                createText="Create Mail Schedule"
                onCreateClick={onCreateSchedule}
                onDeleteClick={onMassDeleteSchedule}
                onChange={(e: any) =>
                    setFilter({
                        ...filter,
                        page: 1,
                        limit: 10,
                        isAdvance: false,
                        search: e.target.value,
                    })
                }
                onSearchClick={() =>
                    setFilter({
                        ...filter,
                        page: 1,
                        limit: 10,
                        isAdvance: true,
                    })
                }
                onHide={onEmptySearch}
            >
                {/* Advanced search fields can go here */}
            </Head>

            <div className="mt-5">
                <Table
                    isLoading={loading}
                    title="Mail Schedule"
                    name={name}
                    managerName={managerName}
                    navigate={
                        managerName
                            ? "/manager-mail-schedule/create"
                            : "/tenant-mail-schedule/create"
                    }
                    columns={columns}
                    data={mailScheduleData?.data || []}
                    page={filter.page}
                    totalCount={mailScheduleData?.count || 0}
                    limit={filter.limit}
                    selectedRows={selectedRow}
                    onPageClick={(page: number) => {
                        setFilter({
                            ...filter,
                            page,
                        });
                    }}
                    onEditClick={onEditClick}
                    onDeleteClick={(data: any) => setDeleteId(data.uuid)}
                    onSelectRow={(e: any, data: any, array: string[]) =>
                        setSelectedRow(array)
                    }
                    onLimitChange={(limit: number) => {
                        setFilter({
                            ...filter,
                            limit,
                        });
                    }}
                    onUpdateStatus={onUpdateStatus}
                    onRefresh={() => setFilter({ ...filter })}
                />
            </div>
            <DeleteModal
                loading={loading}
                visible={!!deleteId}
                onCancelClick={() => setDeleteId("")}
                onDoneClick={() => onDeleteSchedule(deleteId)}
            />
        </div>
    );
};

export default MailSchedule;
