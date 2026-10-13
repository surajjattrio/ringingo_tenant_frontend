"use client";
import { useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";

// PROJECT IMPORT
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { Head, Table } from "@/components/ui-components";
import { DeleteModal } from "@/components/modals";
import { Toggle } from "@/components/forms";
import { 
    emailConfigsGet, 
    useEmailConfigs, 
    useEmailIsLoading,
    updateSingleConfigData,
    emailConfigUpdate
} from "@/redux/slice/tenant-admin/emailSlice";

// TYPES IMPORT
import { ColumnsType } from "@/types/tableTypes";
import { ManagerPageTypes } from "@/types/formTypes";
import { FilterTypes } from "@/types/filterTypes";

// THIRD-PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";

const EmailConfigsList = (props: ManagerPageTypes) => {
    const { managerName = null, name = "Email Configs" } = props;

    const dispatch = useAppDispatch();
    const router = useRouter();
    const configs = useEmailConfigs();
    const isLoadingSlice = useEmailIsLoading();

    const [loading, setLoading] = useState<boolean>(true);
    const [filter, setFilter] = useState<FilterTypes>({
        page: 1,
        limit: 10,
        search: "",
        isAdvance: false,
    });
    const [selectedRow, setSelectedRow] = useState<string[]>([]);
    const [deleteId, setDeleteId] = useState<any>("");

    const onStatusToggle = async (row: any) => {
        try {
            const newStatus = String(row.status) === "0" ? "1" : "0";
            await dispatch(emailConfigUpdate({ id: row.uuid, status: newStatus })).unwrap();
            Success("Status updated successfully");
            setFilter({ ...filter });
        } catch (err: any) {
            Danger(err?.message || "Failed to update status");
        }
    };

    const columns: ColumnsType[] = [
        {
            name: "name",
            title: "Name",
            sortable: true,
        },
        {
            name: "host",
            title: "Host",
            sortable: true,
        },
        {
            name: "port",
            title: "Port",
            sortable: true,
        },
        {
            name: "recipients",
            title: "Recipient Emails",
            action: (row: any) => {
                const toList = Array.isArray(row.to) ? row.to : (row.to ? [row.to] : []);
                const ccList = Array.isArray(row.cc) ? row.cc : (row.cc ? [row.cc] : []);
                const bccList = Array.isArray(row.bcc) ? row.bcc : (row.bcc ? [row.bcc] : []);

                if (!toList.length && !ccList.length && !bccList.length) {
                    return <span className="text-gray-400 text-xs italic">-</span>;
                }

                return (
                    <div className="flex flex-col gap-1 max-w-[280px]">
                        {toList.length > 0 && (
                            <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                                    To
                                </span>
                                <span className="text-xs text-gray-700 truncate" title={toList.join(", ")}>
                                    {toList.join(", ")}
                                </span>
                            </div>
                        )}
                        {ccList.length > 0 && (
                            <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 shrink-0">
                                    CC
                                </span>
                                <span className="text-xs text-gray-700 truncate" title={ccList.join(", ")}>
                                    {ccList.join(", ")}
                                </span>
                            </div>
                        )}
                        {bccList.length > 0 && (
                            <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200 shrink-0">
                                    BCC
                                </span>
                                <span className="text-xs text-gray-700 truncate" title={bccList.join(", ")}>
                                    {bccList.join(", ")}
                                </span>
                            </div>
                        )}
                    </div>
                );
            }
        },
        {
            name: "status",
            title: "Status",
            sortable: true,
            action: (row: any) => (
                <Toggle
                    checked={String(row.status) === "0"}
                    onChange={() => onStatusToggle(row)}
                />
            )
        },
        {
            name: "actions",
            title: "Actions",
        },
    ];

    useLayoutEffect(() => {
        onGetData();
    }, [filter]);

    const onGetData = useDebouncedCallback(async () => {
        setLoading(true);
        try {
            const params = { ...filter };
            delete params["isAdvance"];
            await dispatch(emailConfigsGet(params)).unwrap();
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.error("Get Email Configs Err ==>", err);
        }
    }, 500);

    const onCreateConfig = () =>
        router.push(managerName ? "/manager-email-configs/create" : "/tenant-email-configs/create");

    const onEditClick = async (data: any) => {
        try {
            await dispatch(updateSingleConfigData(data));
            router.push(
                managerName ? "/manager-email-configs/" + data?.uuid : "/tenant-email-configs/" + data?.uuid
            );
        } catch (err) {
            console.error("Store Single Config Err ==>", err);
        }
    };

    const onDeleteConfigs = async (id: string) => {
        Success("Successfully Deleted (Placeholder)");
        setDeleteId("");
    };

    return (
        <>
            <Head
                name={name}
                managerName={managerName}
                length={configs?.count || 0}
                createText="Create Email Config"
                search={filter?.search}
                onCreateClick={onCreateConfig}
                onDeleteClick={() => {}}
                onChange={(e: any) =>
                    setFilter({
                        ...filter,
                        search: e.target.value,
                        page: 1,
                        limit: 10,
                    })
                }
            />

            <div className="mt-5">
                <Table
                    name={name}
                    managerName={managerName}
                    isLoading={loading || isLoadingSlice}
                    title="Email Configs"
                    columns={columns}
                    data={configs?.data?.length ? configs?.data : []}
                    page={filter.page}
                    totalCount={configs?.count || 0}
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
                            page: 1,
                            limit,
                        });
                    }}
                    onRefresh={() => setFilter({ ...filter })}
                />
            </div>
            <DeleteModal
                loading={loading}
                visible={!!deleteId}
                onCancelClick={() => setDeleteId("")}
                onDoneClick={() => onDeleteConfigs(deleteId)}
            />
        </>
    );
};

export default EmailConfigsList;
