"use client";
import { useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";

// PROJECT IMPORT
import {
    blockInboundCampaignGet,
    blockInboundCampaignDelete,
    blockInboundCampaignSearch,
    blockInboundCampaignStatusUpdate,
    useBlockInboundCampaignData,
} from "@/redux/slice/tenant-admin/blockInboundCampaignSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { InputSelect, Select, Switch } from "@/components/forms";
import { Head, Table } from "@/components/ui-components";
import { DeleteModal } from "@/components/modals";

// THIRD-PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";

// TYPES IMPORT
import { ManagerPageTypes } from "@/types/formTypes";
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";

// OPTIONS IMPORT
import { advanceSearchOptions, blockTypeOption } from "@/config/options";

// NAME STATE
const initialValues: any = {
    name: { key: "name|1", val: "", dropdown: "1" },
    type: { key: "type|4", val: "", dropdown: "4" },
    type_value: { key: "type_value|1", val: "", dropdown: "1" },
};

const BlockInboundCall = (props: ManagerPageTypes) => {
    const { managerName = null, name = null } = props;

    const dispatch = useAppDispatch();
    const router = useRouter();
    const blockInboundCampaign = useBlockInboundCampaignData();

    const [csvLoading, setCsvLoading] = useState<boolean>(false);
    const [isCsvDownload, setIsCsvDownload] = useState<boolean>(false);

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
            title: "Name",
            sortable: true,
        },
        {
            name: "typeName",
            title: "Type",
            sortable: true,
        },
        {
            name: "type_value",
            title: "Value",
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

    // Fetching block-inbound-campaign Data
    const onGetData = useDebouncedCallback(async () => {
        setLoading(true);
        try {
            const params = { ...filter };
            delete params["isAdvance"];
            await dispatch(blockInboundCampaignGet(params)).unwrap();
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.error("Get block-inbound-campaign Err =-=>", err);
        }
    }, 500);

    // Fetching All Telecom Circle Data
    const onGetAllBlockInboundCampaign = async () => {
        setCsvLoading(true);
        try {
            if (filter?.isAdvance) {
                const payload = {
                    [data["name"]["key"]]: data["name"]["val"],
                    [data["type_value"]["key"]]: data["type_value"]["val"],
                    page: filter?.page,
                    limit: blockInboundCampaign?.count || 0,
                };
                Object.entries(payload)?.forEach(([key, val]: any) => {
                    if (!val) {
                        delete payload[key];
                    }
                });
                await dispatch(blockInboundCampaignSearch(payload)).unwrap();
                setCsvLoading(false);
                setIsCsvDownload(true);
            } else {
                const params = { ...filter };
                params["limit"] = blockInboundCampaign?.count || 0;
                delete params["isAdvance"];
                await dispatch(blockInboundCampaignGet(params)).unwrap();
                setCsvLoading(false);
                setIsCsvDownload(true);
            }
        } catch (err: any) {
            console.error("Get All Block Inbound Campaign Err =-=>", err);
        }
    };


    // Advance Search - Trigger when left side Input or Select value change
    const handleChnage = (key: string, val: string) => {
        setData({
            ...data,
            [key]: { ...data[key], val: val },
        });
    };

    // Advance Search - Trigger when right side Select value change
    const handleSelect = (key: string, val: string) => {
        setData({
            ...data,
            [key]: { ...data[key], key: `${key}|${val}`, dropdown: val },
        });
    };

    // Advance Search - Searching Data API call
    const onSearchData = async () => {
        try {
            const payload = {
                [data["name"]["key"]]: data["name"]["val"],
                [data["type"]["key"]]: data["type"]["val"],
                [data["type_value"]["key"]]: data["type_value"]["val"],
                status,
            };
            Object.entries(payload)?.forEach(([key, val]: any) => {
                if (!val) {
                    delete payload[key];
                }
            });
            await dispatch(blockInboundCampaignSearch(payload)).unwrap();
        } catch (e: any) {
            console.error("Search data Err --->", e.message);
        }
    };

    // Advance Search Fields Empty & Fetching block-inbound-campaign Data
    const onEmptySearch = () => {
        setData(initialValues);
        setFilter({
            ...filter,
            page: 1,
            limit: 10,
            isAdvance: false,
        });
    };

    // Navigate to Create block-inbound-campaign Page
    const onCreateBlockInboundCampaig = () =>
        router.push(
            managerName
                ? "/manager-block-inbound-call/create"
                : "/tenant-block-inbound-call/create"
        );

    // Store Single block-inbound-campaign Data in Redux & Navigate to Update block-inbound-campaign Page
    const onEditClick = (data: any) => {
        try {
            router.push(
                managerName
                    ? "/manager-block-inbound-call/" + data?.uuid
                    : "/tenant-block-inbound-call/" + data?.uuid
            );
        } catch (err) {
            console.error("Store Single block-inbound-campaign Err =-=>", err);
        }
    };

    // Update block-inbound-campaign Status & Fetching block-inbound-campaign Data
    const onUpdateStatus = async (val: any) => {
        setLoading(true);
        try {
            const payload = {
                status: val.status === "1" ? "0" : "1",
                id: val.uuid,
            };
            const res: any = await dispatch(
                blockInboundCampaignStatusUpdate(payload)
            ).unwrap();
            if (res.statusCode === 200) {
                setFilter({ ...filter });
                Success(res.data);
            } else {
                Danger(res?.data);
            }
        } catch (e: any) {
            setLoading(false);
            console.error(
                "Update block-inbound-campaign Status Err --->",
                e?.message
            );
        }
    };

    // Deleting Selected block-inbound-campaign & Fetching block-inbound-campaign Data
    const onDeleteBlockInboundCampaig = async (id: string) => {
        setLoading(true);
        try {
            await dispatch(blockInboundCampaignDelete(id)).unwrap();
            const ids = deleteId.split(",");
            setDeleteId("");
            setFilter({
                ...filter,
                page:
                    ids?.length === blockInboundCampaign?.data?.length && filter?.page > 1
                        ? filter?.page - 1
                        : filter?.page,
            });
            setSelectedRow([]);
            Success("Successfully Deleted");
        } catch (e: any) {
            setLoading(false);
            console.error("Delete block-inbound-campaign Err --->", e?.message);
        }
    };

    // Mass Delete Click - Open Delete Modal
    const onMassDeleteBlockInboundCampaig = () => {
        const selectedRows = [...selectedRow];
        setDeleteId(selectedRows.join(","));
    };

    return (
        <div className="bg-white p-5 rounded-[25px]">
            <Head
                name={name}
                managerName={managerName}
                length={blockInboundCampaign?.count || 0}
                csvloader={csvLoading}
                isCsvDownload={isCsvDownload}
                setIsCsvDownload={setIsCsvDownload}
                onCsvClick={() => onGetAllBlockInboundCampaign()}
                onImportClick={() =>
                    router.push(managerName ? "manager-block-inbound-call/import" : "tenant-block-inbound-call/import")
                }
                createText="Create Block Inbound Call"
                onCreateClick={onCreateBlockInboundCampaig}
                onDeleteClick={onMassDeleteBlockInboundCampaig}
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
                <InputSelect
                    name="name"
                    label="Name"
                    placeholder="Enter Name"
                    value={data.name.val}
                    dropdownValue={data.name.dropdown}
                    options={advanceSearchOptions}
                    onChange={(e: any) => handleChnage("name", e.target.value)}
                    onDropdownChange={(e: any) => handleSelect("name", e.target.value)}
                    isInfo
                />
                <Select
                    name="type"
                    label="Type"
                    placeholder="Select Type"
                    removable
                    value={data.type.val}
                    options={blockTypeOption}
                    onChange={(e: any) => handleChnage("type", e.target.value)}
                    isInfo
                />
                <InputSelect
                    name="type_value"
                    label="Type Value"
                    placeholder="Enter Type Value"
                    value={data.type_value.val}
                    dropdownValue={data.type_value.dropdown}
                    options={advanceSearchOptions}
                    onChange={(e: any) => handleChnage("type_value", e.target.value)}
                    onDropdownChange={(e: any) =>
                        handleSelect("type_value", e.target.value)
                    }
                    isInfo
                />
                <Switch
                    className="pt-[2px]"
                    label="Status"
                    value={status}
                    onClick={(value: string) => setStatus(value)}
                />
            </Head>

            <div className="mt-5">
                <Table
                    isLoading={loading}
                    title="Block Inbound Call"
                    name={name}
                    managerName={managerName}
                    navigate={
                        managerName
                            ? "/manager-block-inbound-call/create"
                            : "/tenant-block-inbound-call/create"
                    }
                    columns={columns}
                    data={
                        blockInboundCampaign?.data?.length ? blockInboundCampaign.data : []
                    }
                    page={filter.page}
                    totalCount={blockInboundCampaign?.count || 0}
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
                onDoneClick={() => onDeleteBlockInboundCampaig(deleteId)}
            />
        </div>
    );
};

export default BlockInboundCall;
