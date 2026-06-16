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
    emailTemplatesGet, 
    useEmailTemplates, 
    useEmailIsLoading,
    updateSingleTemplateData,
    emailTemplateUpdate,
    emailTemplateDelete
} from "@/redux/slice/tenant-admin/emailSlice";

// TYPES IMPORT
import { ColumnsType } from "@/types/tableTypes";
import { ManagerPageTypes } from "@/types/formTypes";
import { FilterTypes } from "@/types/filterTypes";

// THIRD-PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";

const EmailTemplates = (props: ManagerPageTypes) => {
    const { managerName = null, name = "Email Templates" } = props;

    const dispatch = useAppDispatch();
    const router = useRouter();
    const templates = useEmailTemplates();
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
            await dispatch(emailTemplateUpdate({ id: row.uuid, status: newStatus })).unwrap();
            Success("Status updated successfully");
            setFilter({ ...filter });
        } catch (err: any) {
            Danger(err?.message || "Failed to update status");
        }
    };

    const columns: ColumnsType[] = [
        {
            name: "name",
            title: "Template Name",
            sortable: true,
        },
        {
            name: "subject",
            title: "Subject",
            sortable: true,
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
            await dispatch(emailTemplatesGet(params)).unwrap();
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.error("Get Email Templates Err =-=>", err);
        }
    }, 500);

    const onCreateTemplate = () =>
        router.push(managerName ? "/manager-email-templates/create" : "/tenant-email-templates/create");

    const onEditClick = async (data: any) => {
        try {
            await dispatch(updateSingleTemplateData(data));
            router.push(
                managerName ? "/manager-email-templates/" + data?.uuid : "/tenant-email-templates/" + data?.uuid
            );
        } catch (err) {
            console.error("Store Single Template Err =-=>", err);
        }
    };

    const onDeleteTemplates = async (id: string) => {
        try {
            await dispatch(emailTemplateDelete(id)).unwrap();
            Success("Template deleted successfully");
            setDeleteId("");
            setFilter({ ...filter });
        } catch (err: any) {
            Danger(err?.message || "Failed to delete template");
            setDeleteId("");
        }
    };

    return (
        <div className="bg-white p-5 rounded-[25px]">
            <Head
                name={name}
                managerName={managerName}
                length={templates?.count || 0}
                createText="Create Email Template"
                search={filter?.search}
                onCreateClick={onCreateTemplate}
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
                    title="Email Templates"
                    columns={columns}
                    data={templates?.data?.length ? templates?.data : []}
                    page={filter.page}
                    totalCount={templates?.count || 0}
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
                onDoneClick={() => onDeleteTemplates(deleteId)}
            />
        </div>
    );
};

export default EmailTemplates;
