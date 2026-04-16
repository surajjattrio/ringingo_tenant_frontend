"use client";
import { useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";

// PROJECT IMPORT
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { InputSelect, Select, Switch, Input } from "@/components/forms";
import { Head, Table, Icon } from "@/components/ui-components";
import { DeleteModal } from "@/components/modals";
import { SEARCH_ERROR_MESSAGE } from "@/config/constant";
import {
    msgQueuesGet,
    msgQueueSearch,
    useMsgQueue,
    updateSingleQueueData,
    msgQueueStatusUpdate,
    msgQueueDelete
} from "@/redux/slice/tenant-admin/messagingQueueSlice";

// TYPES IMPORT
import { MessagingQueueFilterTypes } from "@/types/advancedFilterTypes";
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";

// THIRD-PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";

// OPTIONS IMPORT
import {
    msgQueueTypeOptions
} from "@/config/options";
import { ManagerPageTypes } from "@/types/formTypes";

// NAME STATE
const initialValues: MessagingQueueFilterTypes = {
    name: { key: "name|1", val: "", dropdown: "1" },
    type: { key: "type|WhatsApp", val: "", dropdown: "WhatsApp" },
};

const MessagingQueue = (props: ManagerPageTypes) => {

    const { managerName = null, name = null } = props;

    const dispatch = useAppDispatch();
    const router = useRouter();
    const queues = useMsgQueue();

    const [loading, setLoading] = useState<boolean>(true);
    const [filter, setFilter] = useState<FilterTypes>({
        page: 1,
        limit: 10,
        search: "",
        isAdvance: false,
    });
    const [selectedRow, setSelectedRow] = useState<string[]>([]);
    const [deleteId, setDeleteId] = useState<any>("");
    const [data, setData] = useState<any>(initialValues);
    const [status, setStatus] = useState<string>("0");

    const columns: ColumnsType[] = [
        {
            name: "name",
            title: "Queue Name",
            sortable: true,
        },
        {
            name: "type_value",
            title: "Type",
            sortable: true,
        },
        {
            name: "status",
            title: "Status",
        },
        {
            name: "actions",
            title: "Actions",
        },
    ];

    useLayoutEffect(() => {
        if (filter?.isAdvance) {
            onSearchData();
        } else {
            onGetData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    // Fetching Messaging Queue Data
    const onGetData = useDebouncedCallback(async () => {
        setLoading(true);
        try {
            const params = { ...filter };
            delete params["isAdvance"];
            await dispatch(msgQueuesGet(params)).unwrap();
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.error("Get Messaging Queue Err =-=>", err);
        }
    }, 500);

    // Navigate to Create Queue Page
    const onCreateQueue = () =>
        router.push(managerName ? "/manager-messaging-queue/create" : "/tenant-messaging-queue/create");


    // Store Single Queue Data in Redux & Navigate to Update Queue Page
    const onEditClick = async (data: any) => {
        try {
            await dispatch(updateSingleQueueData(data));
            router.push(
                managerName ? "/manager-messaging-queue/" + data?.uuid : "/tenant-messaging-queue/" + data?.uuid
            );
        } catch (err) {
            console.error("Store Single Queue Err =-=>", err);
        }
    };

    // Advance Search Fields Empty & Fetching DID Data
    const onEmptySearch = () => {
        setData(initialValues);
        setFilter({
            ...filter,
            page: 1,
            limit: 10,
            isAdvance: false,
        });
    };

    // Deleting Selected Queue Group & Fetching Queue Group Data
    const onDeleteQueues = async (id: string) => {
        setLoading(true);
        try {
            await dispatch(msgQueueDelete(id)).unwrap();
            const ids = deleteId.split(",");
            setDeleteId("");
            setFilter({
                ...filter,
                page:
                    ids?.length === queues?.data?.length && filter?.page > 1
                        ? filter?.page - 1
                        : filter?.page,
            });
            setSelectedRow([]);
            Success("Successfully Deleted");
        } catch (e: any) {
            setLoading(false);
            setDeleteId("");
            Danger("");
            console.error("Delete Queue Err --->", e?.message);
        }
    };

    const onMassDeleteQueues = () => {
        const selectedRows = [...selectedRow];
        setDeleteId(selectedRows.join(","));
    };

    // Advance Search - Trigger when left side Input or Select value change
    const handleChnage = (key: string, val: string) => {
        setData({
            ...data,
            [key]: { ...data[key], val: val },
        });
    };

    const onSearchData = async () => {
        if (
            !(data["name"]["val"] || data["type"]["val"])
        ) {
            Danger(SEARCH_ERROR_MESSAGE);
            return false;
        }
        setLoading(true);
        try {
            console.log(data);
            const payload = {
                [data["name"]["key"]]: data["name"]["val"],
                [data["type"]["key"]]: data["type"]["val"],
            };

            console.log(payload);
            Object.entries(payload)?.forEach(([key, val]: any) => {
                if (!val) {
                    delete payload[key];
                }
            });
            await dispatch(msgQueueSearch(payload)).unwrap();
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Search data Err --->", e.message);
        }
    };

    // Update IVR Status & Fetching IVR Data
    const onUpdateStatus = async (val: any) => {
        setLoading(true);
        try {
            const payload = {
                status: val.status === "1" ? "0" : "1",
                id: val.uuid,
            };
            const res: any = await dispatch(msgQueueStatusUpdate(payload)).unwrap();
            if (res.statusCode === 200) {
                setFilter({ ...filter });
                Success(res.data);
            } else {
                Danger(res?.data);
            }
        } catch (e: any) {
            setLoading(false);
            console.error("Update Messaging Queue Status Err --->", e?.message);
        }
    };

    return (
        <div className="bg-white p-5 rounded-[25px]">
            <Head
                name={name}
                managerName={managerName}
                length={queues?.count || 0}
                createText="Create Messaging Queue"
                search={filter?.search}
                onCreateClick={onCreateQueue}
                onDeleteClick={onMassDeleteQueues}
                onChange={(e: any) =>
                    setFilter({
                        ...filter,
                        search: e.target.value,
                        isAdvance: false,
                        page: 1,
                        limit: 10,
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
                <Input
                    name="name"
                    label="Queue Name"
                    placeholder="Enter Queue Name"
                    value={data.name.val}
                    onChange={(e: any) => handleChnage("name", e.target.value)}
                    isInfo
                />
                <Select
                    name="type"
                    label="Type"
                    placeholder="Select Type"
                    removable
                    value={data.type.val}
                    options={msgQueueTypeOptions}
                    onChange={(e: any) => handleChnage("type", e.target.value)}
                    isInfo
                />
            </Head>

            <div className="mt-5">
                <Table
                    name={name}
                    managerName={managerName}
                    isLoading={loading}
                    title="Messaging Queue"
                    navigate={
                        managerName
                            ? "/manager-messaging-queue/create"
                            : "/tenant-messaging-queue/create"
                    }
                    columns={columns}
                    data={queues?.data?.length ? queues.data : []}
                    page={filter.page}
                    totalCount={queues?.count || 0}
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
                    onUpdateStatus={onUpdateStatus}
                    onRefresh={() => setFilter({ ...filter })}
                />
            </div>
            <DeleteModal
                loading={loading}
                visible={!!deleteId}
                onCancelClick={() => setDeleteId("")}
                onDoneClick={() => onDeleteQueues(deleteId)}
            />
        </div>
    )

}

export default MessagingQueue;