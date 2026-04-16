"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";

// PROJECT IMPORT
import {
    useOutboundData,
    outboundGet,
    outboundSearch,
    outboundStatusUpdate,
    outboundDelete,
    managerOutboundGet,
    managerOutboundSearch,
} from "@/redux/slice/tenant-admin/outboundSlice";
import {
    outgoingOptionsGet,
    useOutgoingOptions,
} from "@/redux/slice/master-admin/outgoingSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { setActiveTab } from "@/redux/slice/commonSlice";
import { InputSelect, Select, Switch } from "@/components/forms";
import { Head, Table } from "@/components/ui-components";
import { DeleteModal } from "@/components/modals";

// THIRD-PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";

// TYPES IMPORT
import { OutboundFilterTypes } from "@/types/advancedFilterTypes";
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";

// OPTIONS IMPORT
import { advanceSearchOptions, dialMethodOptions } from "@/config/options";
import { ManagerPageTypes } from "@/types/formTypes";

// NAME STATE
const initialValues: OutboundFilterTypes = {
    name: { key: "name|1", val: "", dropdown: "1" },
    dial_method: { key: "dial_method|4", val: "", dropdown: "4" },
    outgoing_rule_uuid: { key: "outgoing_rule_uuid|4", val: "", dropdown: "4" },
};

const Outbound = (props: ManagerPageTypes) => {
    const { managerName = null, name = null } = props;
    const dispatch = useAppDispatch();
    const router = useRouter();
    const outbound = useOutboundData();
    const outgoingOptions = useOutgoingOptions();

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
            name: "dial_method_name",
            title: "Dial Method",
            sortable: true,
        },
        {
            name: "outgoing_rule_name",
            title: "Outgoing Rules",
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

    // Fetching Outbound Data
    const onGetData = useDebouncedCallback(async () => {
        if (managerName) {
            setLoading(true);
            try {
                const params = { ...filter };
                delete params["isAdvance"];
                await dispatch(managerOutboundGet(params)).unwrap();
                setLoading(false);
            } catch (err) {
                setLoading(false);
                console.error("Get Outbound Err =-=>", err);
            }
        } else {
            setLoading(true);
            try {
                const params = { ...filter };
                delete params["isAdvance"];
                await dispatch(outboundGet(params)).unwrap();
                setLoading(false);
            } catch (err) {
                setLoading(false);
                console.error("Get Outbound Err =-=>", err);
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
                    [data["dial_method"]["key"]]: data["dial_method"]["val"],
                    [data["outgoing_rule_uuid"]["key"]]:
                        data["outgoing_rule_uuid"]["val"],
                    status,
                };
                Object.entries(payload)?.forEach(([key, val]: any) => {
                    if (!val) {
                        delete payload[key];
                    }
                });
                await dispatch(managerOutboundSearch(payload)).unwrap();
            } catch (e: any) {
                console.error("Search data Err --->", e.message);
            }
        } else {
            try {
                const payload = {
                    [data["name"]["key"]]: data["name"]["val"],
                    [data["dial_method"]["key"]]: data["dial_method"]["val"],
                    [data["outgoing_rule_uuid"]["key"]]:
                        data["outgoing_rule_uuid"]["val"],
                    status,
                };
                Object.entries(payload)?.forEach(([key, val]: any) => {
                    if (!val) {
                        delete payload[key];
                    }
                });
                await dispatch(outboundSearch(payload)).unwrap();
            } catch (e: any) {
                console.error("Search data Err --->", e.message);
            }
        }
    };

    // Advance Search Fields Empty & Fetching Outbound Data
    const onEmptySearch = () => {
        setData(initialValues);
        setFilter({
            ...filter,
            page: 1,
            limit: 10,
            isAdvance: false,
        });
    };

    // Navigate to Create Outbound Page
    const onCreateOutbound = () =>
        router.push(
            managerName
                ? "/manager-outbound-campaign/create"
                : "/tenant-outbound-campaign/create"
        );

    // Store Single Outbound Data in Redux & Navigate to Update Outbound Page
    const onEditClick = (data: any) => {
        try {
            dispatch(setActiveTab(0));
            router.push(
                managerName
                    ? "/manager-outbound-campaign/" + data?.uuid
                    : "/tenant-outbound-campaign/" + data?.uuid
            );
        } catch (err) {
            console.error("Store Single Outbound Err =-=>", err);
        }
    };

    // Update Outbound Status & Fetching Outbound Data
    const onUpdateStatus = async (val: any) => {
        setLoading(true);
        try {
            const payload = {
                status: val.status === "1" ? "0" : "1",
                id: val.uuid,
            };
            const res: any = await dispatch(outboundStatusUpdate(payload)).unwrap();
            if (res.statusCode === 200) {
                setFilter({ ...filter });
                Success(res.data);
            } else {
                Danger(res?.data);
            }
        } catch (e: any) {
            setLoading(false);
            console.error("Update Outbound Status Err --->", e?.message);
        }
    };

    // Deleting Selected Outbound & Fetching Outbound Data
    const onDeleteOutbound = async (id: string) => {
        setLoading(true);
        try {
            await dispatch(outboundDelete(id)).unwrap();
            const ids = deleteId.split(",");
            setDeleteId("");
            setFilter({
                ...filter,
                page:
                    ids?.length === outbound?.data?.length && filter?.page > 1
                        ? filter?.page - 1
                        : filter?.page,
            });
            setSelectedRow([]);
            Success("Successfully Deleted");
        } catch (e: any) {
            setLoading(false);
            console.error("Delete Outbound Err --->", e?.message);
        }
    };

    // Mass Delete Click - Open Delete Modal
    const onMassDeleteOutbound = () => {
        const selectedRows = [...selectedRow];
        setDeleteId(selectedRows.join(","));
    };

    return (
        <div className="bg-white p-5 rounded-[25px]">
            <Head
                name={name}
                managerName={managerName}
                length={outbound?.count || 0}
                createText="Create Outbound Campaign"
                onCreateClick={onCreateOutbound}
                onDeleteClick={onMassDeleteOutbound}
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
                    name="dial_method"
                    label="Dial Method"
                    placeholder="Select Dial Method"
                    removable
                    value={data.dial_method.val}
                    options={dialMethodOptions}
                    onChange={(e: any) => handleChnage("dial_method", e.target.value)}
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
                    title="Outbound Campaign"
                    name={name}
                    managerName={managerName}
                    navigate={
                        managerName
                            ? "/manager-outbound-campaign/create"
                            : "/tenant-outbound-campaign/create"
                    }
                    columns={columns}
                    data={outbound?.data?.length ? outbound.data : []}
                    page={filter.page}
                    totalCount={outbound?.count || 0}
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
                onDoneClick={() => onDeleteOutbound(deleteId)}
            />
        </div>
    );
};

export default Outbound;
