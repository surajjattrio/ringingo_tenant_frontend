"use client";
import { useState, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

// PROJECT IMPORT
import { useAppDispatch } from "@/redux/hooks";
import { Toggle } from "../../forms";
import { Table, Head } from "../../ui-components";
import { Success, Danger } from "@/redux/services/toasterServices";
import {
    messageConfigsGet,
    messageConfigUpdate,
    messageConfigDelete,
    useMessageConfigs,
    useMessageConfigIsLoading,
    updateSingleMessageConfigData
} from "@/redux/slice/tenant-admin/messageConfigurationSlice";

const MessageConfigurationList = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const configs = useMessageConfigs();
    const isLoading = useMessageConfigIsLoading();

    const [search, setSearch] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);

    useLayoutEffect(() => {
        onGetData();
    }, [search, page, limit]);

    const onGetData = useDebouncedCallback(async () => {
        try {
            await dispatch(messageConfigsGet({ search, page, limit })).unwrap();
        } catch (err) {
            console.error("Get Message Configs Err ==>", err);
        }
    }, 500);

    const onCreateClick = () => {
        router.push(`/tenant-message-configs/create`);
    };

    const onEditClick = async (data: any) => {
        try {
            await dispatch(updateSingleMessageConfigData(data));
            router.push(`/tenant-message-configs/${data.uuid}`);
        } catch (err) {
            console.error("Store Single Message Config Err ==>", err);
        }
    };

    const onDeleteClick = async (id: string) => {
        try {
            await dispatch(messageConfigDelete(id)).unwrap();
            Success(`Message Configuration Deleted Successfully`);
            onGetData();
        } catch (err: any) {
            Danger(err?.message || `Failed to delete message configuration`);
        }
    };

    const columns = [
        { name: "name", title: "Message Name", sortable: true },
        { name: "method", title: "Method", sortable: true },
        { name: "baseUrl", title: "Base URL", sortable: true },
        {
            name: "status",
            title: "Status",
            action: (row: any) => (
                <Toggle
                    checked={String(row.status) === "1"}
                    onChange={async () => {
                        try {
                            const newStatus = String(row.status) === "1" ? "0" : "1";
                            await dispatch(messageConfigUpdate({ id: row.uuid, status: newStatus })).unwrap();
                            Success("Status updated successfully");
                            onGetData();
                        } catch (err: any) {
                            Danger(err?.message || "Failed to update status");
                        }
                    }}
                />
            )
        },
        {
            name: "actions",
            title: "Actions",
        }
    ];

    return (
        <>
            <Head
                name={"Message Config"}
                length={configs?.data?.length || 0}
                createText={"Create Message Config"}
                search={search}
                onCreateClick={onCreateClick}
                onChange={(e: any) => setSearch(e.target.value)}
            />
            <div className="mt-5">
                <Table
                    columns={columns}
                    data={configs?.data || []}
                    isLoading={isLoading}
                    totalCount={configs?.count || 0}
                    page={page}
                    limit={limit}
                    onPageClick={(p: number) => setPage(p)}
                    onLimitChange={(l: number) => {
                        setLimit(l);
                        setPage(1);
                    }}
                    onEditClick={onEditClick}
                    onDeleteClick={(row: any) => onDeleteClick(row.uuid)}
                    onRefresh={() => onGetData()}
                />
            </div>
        </>
    );
};

export default MessageConfigurationList;
