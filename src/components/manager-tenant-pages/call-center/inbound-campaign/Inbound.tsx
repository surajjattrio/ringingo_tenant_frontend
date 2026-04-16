"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";

// PROJECT IMPORT
import {
    useIsLoading,
    useInboundData,
    inboundGet,
    inboundSearch,
    inboundStatusUpdate,
    inboundDelete,
    managerInboundSearch,
    managerInboundGet,
} from "@/redux/slice/tenant-admin/inboundSlice";
import {
    outgoingOptionsGet,
    useOutgoingOptions,
} from "@/redux/slice/master-admin/outgoingSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { InputSelect, Select, Switch, Toggle } from "@/components/forms";
import { Head, Table } from "@/components/ui-components";
import { DeleteModal } from "@/components/modals";

// THIRD-PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";

// TYPES IMPORT
import { InboundFilterTypes } from "@/types/advancedFilterTypes";
import { ManagerPageTypes } from "@/types/formTypes";
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";

// OPTIONS IMPORT
import { advanceSearchOptions } from "@/config/options";

// NAME STATE
const initialValues: InboundFilterTypes = {
    name: { key: "name|1", val: "", dropdown: "1" },
    outgoing_rule_uuid: { key: "outgoing_rule_uuid|4", val: "", dropdown: "4" },
};

const Inbound = (props: ManagerPageTypes) => {
    const { managerName = null, name = null } = props;
    const dispatch = useAppDispatch();
    const router = useRouter();
    const isLoading = useIsLoading();
    const inbound = useInboundData();
    const outgoingOptions = useOutgoingOptions();

    const [loading, setLoading] = useState<boolean>(false);
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
            name: "outgoing_rule_uuid",
            title: "Outgoing Rules",
            sortable: true,
            action: (row: any) => (
                <>
                    <span>{row?.outgoing_rule?.[0]?.name || ""}</span>
                </>
            ),
        },
        // {
        //   name: "status",
        //   title: "Status",
        // },

        {
            name: "status",
            title: "Status",
            sortable: true,
            action: (row: any) => {
                return (
                    <>
                        <Toggle
                            loading={loading}
                            checked={row.status === "0"}
                            onChange={() => {
                                onUpdateInboundStatus(row);
                            }}
                        />
                    </>
                );
            },
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

    useEffect(() => {
        onGetExternalUserOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetching Outgoing Rules Options
    const onGetExternalUserOptions = async () => {
        try {
            await dispatch(outgoingOptionsGet()).unwrap();
        } catch (err) {
            console.error("Get Outgoing Rules Options Err =-=>", err);
        }
    };

    // Fetching Inbound Data
    const onGetData = useDebouncedCallback(async () => {
        if (managerName) {
            setLoading(true);
            try {
                const params = { ...filter };
                delete params["isAdvance"];
                await dispatch(managerInboundGet(params)).unwrap();
                setLoading(false);
            } catch (err) {
                setLoading(false);
                console.error("Get Inbound Err =-=>", err);
            }
        } else {
            setLoading(true);
            try {
                const params = { ...filter };
                delete params["isAdvance"];
                await dispatch(inboundGet(params)).unwrap();
                setLoading(false);
            } catch (err) {
                setLoading(false);
                console.error("Get Inbound Err =-=>", err);
            }
        }
    }, 500);

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
        if (managerName) {
            try {
                const payload = {
                    [data["name"]["key"]]: data["name"]["val"],
                    [data["outgoing_rule_uuid"]["key"]]:
                        data["outgoing_rule_uuid"]["val"],
                    status,
                };
                Object.entries(payload)?.forEach(([key, val]: any) => {
                    if (!val) {
                        delete payload[key];
                    }
                });
                await dispatch(managerInboundSearch(payload)).unwrap();
            } catch (e: any) {
                console.error("Search data Err --->", e.message);
            }
        } else {
            try {
                const payload = {
                    [data["name"]["key"]]: data["name"]["val"],
                    [data["outgoing_rule_uuid"]["key"]]:
                        data["outgoing_rule_uuid"]["val"],
                    status,
                };
                Object.entries(payload)?.forEach(([key, val]: any) => {
                    if (!val) {
                        delete payload[key];
                    }
                });
                await dispatch(inboundSearch(payload)).unwrap();
            } catch (e: any) {
                console.error("Search data Err --->", e.message);
            }
        }
    };

    // Advance Search Fields Empty & Fetching Inbound Data
    const onEmptySearch = () => {
        setData(initialValues);
        setFilter({
            ...filter,
            page: 1,
            limit: 10,
            isAdvance: false,
        });
    };

    // Navigate to Create Inbound Page
    const onCreateInbound = () =>
        router.push(
            managerName
                ? "/manager-inbound-campaign/create"
                : "/tenant-inbound-campaign/create"
        );

    // Store Single Inbound Data in Redux & Navigate to Update Inbound Page
    const onEditClick = (data: any) => {
        try {
            // dispatch(setActiveTab(0));
            router.push(
                managerName
                    ? "/manager-inbound-campaign/" + data?.uuid
                    : "/tenant-inbound-campaign/" + data?.uuid
            );
        } catch (err) {
            console.error("Store Single Inbound Err =-=>", err);
        }
    };

    // Update Inbound Status & Fetching Inbound Data
    const onUpdateInboundStatus = async (val: any) => {
        setLoading(true);
        try {
            const payload = {
                status: val.status === "1" ? "0" : "1",
                id: val.uuid,
            };
            const res: any = await dispatch(inboundStatusUpdate(payload)).unwrap();
            if (res.statusCode === 200) {
                setFilter({ ...filter });
                Success(res.data);
            } else {
                Danger(res?.data);
            }
        } catch (e: any) {
            setLoading(false);
            console.error("Update Inbound Status Err --->", e?.message);
        }
    };

    // Deleting Selected Inbound & Fetching Inbound Data
    const onDeleteInbound = async (id: string) => {
        setLoading(true);
        try {
            await dispatch(inboundDelete(id)).unwrap();
            const ids = deleteId.split(",");
            setDeleteId("");
            setFilter({
                ...filter,
                page:
                    ids?.length === inbound?.data?.length && filter?.page > 1
                        ? filter?.page - 1
                        : filter?.page,
            });
            setSelectedRow([]);
            Success("Successfully Deleted");
        } catch (e: any) {
            setLoading(false);
            console.error("Delete Inbound Err --->", e?.message);
        }
    };

    // Mass Delete Click - Open Delete Modal
    const onMassDeleteInbound = () => {
        const selectedRows = [...selectedRow];
        setDeleteId(selectedRows.join(","));
    };

    return (
        <div className="bg-white p-5 rounded-[25px]">
            <Head
                name={name}
                managerName={managerName}
                length={inbound?.count || 0}
                createText="Create Inbound Campaign"
                onCreateClick={onCreateInbound}
                onDeleteClick={onMassDeleteInbound}
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
                    name="outgoing_rule_uuid"
                    label="Outgoing Rules"
                    placeholder="Select Outgoing Rules"
                    removable
                    value={data.outgoing_rule_uuid.val}
                    options={outgoingOptions}
                    onChange={(e: any) =>
                        handleChnage("outgoing_rule_uuid", e.target.value)
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
                    title="Inbound Campaign"
                    name={name}
                    managerName={managerName}
                    navigate={
                        managerName
                            ? "/manager-inbound-campaign/create"
                            : "/tenant-inbound-campaign/create"
                    }
                    columns={columns}
                    data={inbound?.data?.length ? inbound.data : []}
                    page={filter.page}
                    totalCount={inbound?.count || 0}
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
                    //onUpdateInboundStatus={onUpdateInboundStatus}
                    onRefresh={() => setFilter({ ...filter })}
                />
            </div>
            <DeleteModal
                loading={loading}
                visible={!!deleteId}
                onCancelClick={() => setDeleteId("")}
                onDoneClick={() => onDeleteInbound(deleteId)}
            />
        </div>
    );
};

export default Inbound;
