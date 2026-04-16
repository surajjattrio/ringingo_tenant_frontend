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
    msgChannelsGet,
    msgChannelSearch,
    useMsgChannel,
    updateSingleChannelData,
    msgChannelDelete
} from "@/redux/slice/tenant-admin/messagingChannelSlice";

// TYPES IMPORT
import { MessagingChannelFilterTypes } from "@/types/advancedFilterTypes";
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";

// THIRD-PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";

// OPTIONS IMPORT
import {
    msgChannelTypeOptions, msgChannelProviderOptions
} from "@/config/options";
import { ManagerPageTypes } from "@/types/formTypes";
import { OptionTypes } from "@/types/formTypes";

// NAME STATE
const initialValues: MessagingChannelFilterTypes = {
    name: { key: "name|1", val: "", dropdown: "1" },
    type: { key: "type|WhatsApp", val: "", dropdown: "WhatsApp" },
    provider: { key: "provider|Meta", val: "", dropdown: "Meta" },
};


const MessagingChannel = (props: ManagerPageTypes) => {

    const { managerName = null, name = null } = props;

    const dispatch = useAppDispatch();
    const router = useRouter();
    const channels = useMsgChannel();

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
            title: "Channel Name",
            sortable: true,
        },
         {
            name: "provider",
            title: "Provider",
            sortable: true,
        },
        {
            name: "type",
            title: "Type",
            sortable: true,
        },
        {
            name: "channel_id",
            title: "Channel ID",
            sortable: true,
            action: (row: any) => {
              const type = row?.type?.toLowerCase();
              const channelIdMap: Record<string, string | undefined> = {
                instagram: row?.customFields?.instagram_business_account_id,
                facebook: row?.customFields?.facebook_page_id,
                whatsapp: row?.customFields?.from_number,
              };
              const channelId = channelIdMap[type] || "";
             
                return (
                    <div>
                        <span
                            className="cursor-pointer"
                        >
                            {channelId}
                        </span>
                    </div>
                );
            
        }
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

    // Fetching Messaging Channel Data
    const onGetData = useDebouncedCallback(async () => {
        setLoading(true);
        try {
            const params = { ...filter };
            delete params["isAdvance"];
            await dispatch(msgChannelsGet(params)).unwrap();
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.error("Get Messaging Channel Err =-=>", err);
        }
    }, 500);

    // Navigate to Create Channel Page
    const onCreateChannel = () =>
        router.push(managerName ? "/manager-messaging-channel/create" : "/tenant-messaging-channel/create");

    // Store Single Channel Data in Redux & Navigate to Update Channel Page
    const onEditClick = async (data: any) => {
        try {
            await dispatch(updateSingleChannelData(data));
            router.push(
                managerName ? "/manager-messaging-channel/" + data?.uuid : "/tenant-messaging-channel/" + data?.uuid
            );
        } catch (err) {
            console.error("Store Single Channel Err =-=>", err);
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

    // Deleting Selected Channel Group & Fetching Channel Group Data
    const onDeleteChannels = async (id: string) => {
        setLoading(true);
        try {
            await dispatch(msgChannelDelete(id)).unwrap();
            const ids = deleteId.split(",");
            setDeleteId("");
            setFilter({
                ...filter,
                page:
                    ids?.length === channels?.data?.length && filter?.page > 1
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

    const onMassDeleteChannels = () => {
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
            !(data["name"]["val"] || data["type"]["val"] || data["provider"]["val"])
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
                [data["provider"]["key"]]: data["provider"]["val"],
            };

            console.log(payload);
            Object.entries(payload)?.forEach(([key, val]: any) => {
                if (!val) {
                    delete payload[key];
                }
            });
            await dispatch(msgChannelSearch(payload)).unwrap();
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Search data Err --->", e.message);
        }
    };

    return (
        <div className="bg-white p-5 rounded-[25px]">
            <Head
                name={name}
                managerName={managerName}
                length={channels?.count || 0}
                createText="Create Messaging Channel"
                search={filter?.search}
                onCreateClick={onCreateChannel}
                onDeleteClick={onMassDeleteChannels}
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
                    label="Channel Name"
                    placeholder="Enter Channel Name"
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
                    options={msgChannelTypeOptions}
                    onChange={(e: any) => handleChnage("type", e.target.value)}
                    isInfo
                />
                <Select
                    name="provider"
                    label="Provider"
                    placeholder="Select Provider"
                    removable
                    value={data.provider.val}
                    options={msgChannelProviderOptions}
                    onChange={(e: any) => handleChnage("provider", e.target.value)}
                    isInfo
                />
            </Head>

            <div className="mt-5">
                <Table
                    name={name}
                    managerName={managerName}
                    isLoading={loading}
                    title="Messaging Channel"
                    navigate={
                        managerName
                            ? "/manager-messaging-channel/create"
                            : "/tenant-messaging-channel/create"
                    }
                    columns={columns}
                    data={channels?.data?.length ? channels?.data : []}
                    page={filter.page}
                    totalCount={channels?.count || 0}
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
                onDoneClick={() => onDeleteChannels(deleteId)}
            />
        </div>
    )
}

export default MessagingChannel;