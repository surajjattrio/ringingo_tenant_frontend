"use client";
import { useState, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDebouncedCallback } from "use-debounce";

// PROJECT IMPORT
import { useAppDispatch } from "@/redux/hooks";
import { Button, Input, Toggle } from "../../forms";
import { Table, Head } from "../../ui-components";
import { Success, Danger } from "@/redux/services/toasterServices";
import {
    apiConfigsGet,
    apiConfigUpdate,
    apiConfigDelete,
    useApiConfigs,
    useApiConfigIsLoading,
    updateSingleApiConfigData
} from "@/redux/slice/tenant-admin/apiConfigurationSlice";

interface ApiConfigType {
    uuid?: string;
    name: string;
    url: string;
    method: string;
    headers: { key: string; value: string }[];
    body: string;
    status: string;
}

const ApiConfiguration = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const configs = useApiConfigs();
    console.log(configs,'configjob');
    
    const isLoading = useApiConfigIsLoading();

    const [search, setSearch] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);

    useLayoutEffect(() => {
        onGetData();
    }, [search, page, limit]);

    const onGetData = useDebouncedCallback(async () => {
        try {
            await dispatch(apiConfigsGet({ search, page, limit })).unwrap();
        } catch (err) {
            console.error("Get API Configs Err ==>", err);
        }
    }, 500);

    const onCreateClick = () => {
        router.push("/tenant-api-configs/create");
    };

    const onEditClick = async (data: any) => {
        try {
            await dispatch(updateSingleApiConfigData(data));
            router.push(`/tenant-api-configs/${data.uuid}`);
        } catch (err) {
            console.error("Store Single API Config Err ==>", err);
        }
    };

    const onDeleteClick = async (id: string) => {
        try {
            await dispatch(apiConfigDelete(id)).unwrap();
            Success("API Configuration Deleted Successfully");
            onGetData();
        } catch (err: any) {
            Danger(err?.message || "Failed to delete API configuration");
        }
    };

    const columns = [
        { name: "name", title: "API Name", sortable: true },
        { name: "templateId", title: "Template ID", sortable: true },
        { name: "fromEmail", title: "From Email", sortable: true },
        {
            name: "status",
            title: "Status",
            action: (row: any) => (
                <Toggle
                    checked={String(row.status) === "1"}
                    onChange={async () => {
                        try {
                            const newStatus = String(row.status) === "1" ? "0" : "1";
                            await dispatch(apiConfigUpdate({ id: row.uuid, status: newStatus })).unwrap();
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
                name="API Config"
                length={configs?.count || 0}
                createText="Create API Config"
                search={search}
                onCreateClick={onCreateClick}
                onChange={(e: any) => setSearch(e.target.value)}
            />
            <div className="mt-5">
                <Table
                    columns={columns}
                    data={configs?.data?.length ? configs?.data : []}
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

export default ApiConfiguration;
