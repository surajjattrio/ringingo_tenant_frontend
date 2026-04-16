"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";

// PROJECT IMPORT
import {
    timeConditionGet,
    timeConditionSearch,
    timeConditionUpdateStatus,
    updateSingleTimeConditionData,
    useTimeCondition,
    timeConditionDelete,
    useTimeConditionOptions,
    timeConditionOptionsGet,
} from "@/redux/slice/tenant-admin/timeConditionSlice";
import {
    externalUserOptionsGet,
    useExternalUserOptions,
} from "@/redux/slice/tenant-admin/userSlice";
import {
    ringOptionsGet,
    useRingOptions,
} from "@/redux/slice/tenant-admin/ringSlice";
import { useAppDispatch } from "@/redux/hooks";
import {
    sipOptionsGet,
    useSipOptions,
} from "@/redux/slice/tenant-admin/sipDevicesSlice";
import {
    ivrOptionsGet,
    useIvrOptions,
} from "@/redux/slice/tenant-admin/ivrSlice";
import {
    callQueueOptionsGet,
    useCallQueueOptions,
} from "@/redux/slice/tenant-admin/callQueueSlice";
import {
    conferenceOptionsGet,
    useConferenceOptions,
} from "@/redux/slice/tenant-admin/conferenceSlice";
import {
    promptsOptionsGet,
    usePromptsOptions,
} from "@/redux/slice/tenant-admin/promptsSlice";
import { Danger, Success } from "@/redux/services/toasterServices";
import { InputSelect, Select, Switch } from "@/components/forms";
import { Head, Table } from "@/components/ui-components";
import { DeleteModal } from "@/components/modals";

// THIRD-PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";

// TYPES IMPORT
import { TimeConditionFilterTypes } from "@/types/advancedFilterTypes";
import { ManagerPageTypes } from "@/types/formTypes";
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";

// OPTIONS IMPORT
import { advanceSearchOptions, routingTypeOptions3 } from "@/config/options";

// NAME STATE
const initialValues: TimeConditionFilterTypes = {
    name: { key: "name|1", val: "", dropdown: "1" },
    failover_routing_type: {
        key: "failover_routing_type|4",
        val: "",
        dropdown: "4",
    },
    failover_routing_options: {
        key: "failover_routing_options|4",
        val: "",
        dropdown: "4",
    },
};

const TimeConditions = (props: ManagerPageTypes) => {
    const { managerName = null, name = null } = props;
    const dispatch = useAppDispatch();
    const router = useRouter();

    const timeConditionData = useTimeCondition();
    const sipOptions: any = useSipOptions();
    const ivrOptions: any = useIvrOptions();
    const timeConditionOptions: any = useTimeConditionOptions();
    const callQueueOptions: any = useCallQueueOptions();
    const ringOptions: any = useRingOptions();
    const conferenceOptions: any = useConferenceOptions();
    const externalUserOptions: any = useExternalUserOptions();
    const promptsOptions: any = usePromptsOptions();

    const [loading, setLoading] = useState<boolean>(true);
    const [filter, setFilter] = useState<FilterTypes>({
        page: 1,
        limit: 10,
        search: "",
        isAdvance: false,
    });
    const [status, setStatus] = useState<string>("0");
    const [selectedRow, setSelectedRow] = useState<string[]>([]);
    const [deleteId, setDeleteId] = useState<any>("");
    const [data, setData] = useState<any>(initialValues);

    const columns: ColumnsType[] = [
        {
            name: "name",
            title: "Name",
            sortable: true,
        },
        {
            name: "failover_routing_type",
            title: "Fail-over Routing Type",
            sortable: true,
            action: (row: any) => {
                const type = row?.failover_routing_type;
                const data = routingTypeOptions3?.find(
                    (val: any) => val?.value === type
                );
                return (
                    <>
                        <span>{data?.label || ""}</span>
                    </>
                );
            },
        },
        {
            name: "fail_over_routing_name",
            title: "Fail-over Routing Option",
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

    useEffect(() => {
        onGetIvrOptions();
        onGetSipOptions();
        onGetTimeConditionOptions();
        onGetCallQueueOptions();
        onGetRingGroupOptions();
        onGetConferenceOptions();
        onGetExternalUserOptions();
        onGetPromptsOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useLayoutEffect(() => {
        if (filter?.isAdvance) {
            onSearchData();
        } else {
            onGetData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    // Fetching SIP Options
    const onGetSipOptions = async () => {
        try {
            await dispatch(sipOptionsGet()).unwrap();
        } catch (err) {
            console.error("Get SIP Options Err =-=>", err);
        }
    };

    // Fetching IVR Options
    const onGetIvrOptions = async () => {
        try {
            await dispatch(ivrOptionsGet()).unwrap();
        } catch (err) {
            console.error("Get IVR Options Err =-=>", err);
        }
    };

    // Fetching Time Condition Options
    const onGetTimeConditionOptions = async () => {
        try {
            await dispatch(timeConditionOptionsGet()).unwrap();
        } catch (err) {
            console.error("Get Time Condition Options Err =-=>", err);
        }
    };

    // Fetching Call Queue Options
    const onGetCallQueueOptions = async () => {
        try {
            await dispatch(callQueueOptionsGet()).unwrap();
        } catch (err) {
            console.error("Get Call Queue Options Err =-=>", err);
        }
    };

    // Fetching Ring Group Options
    const onGetRingGroupOptions = async () => {
        try {
            await dispatch(ringOptionsGet()).unwrap();
        } catch (err) {
            console.error("Get Ring Group Options Err =-=>", err);
        }
    };

    // Fetching Conference Options
    const onGetConferenceOptions = async () => {
        try {
            await dispatch(conferenceOptionsGet()).unwrap();
        } catch (err) {
            console.error("Get Conference Options Err =-=>", err);
        }
    };

    // Fetching External User Options
    const onGetExternalUserOptions = async () => {
        try {
            await dispatch(externalUserOptionsGet()).unwrap();
        } catch (err) {
            console.error("Get External User Options Err =-=>", err);
        }
    };

    // Fetching Audio Prompts Options
    const onGetPromptsOptions = async () => {
        try {
            await dispatch(promptsOptionsGet()).unwrap();
        } catch (err) {
            console.error("Get Audio Prompts Options Err =-=>", err);
        }
    };

    // Set Options in Fail-Over Routing Options
    const getOptions = () => {
        switch (data.failover_routing_type.val) {
            case "1":
                return sipOptions;
            case "2":
                return ivrOptions;
            case "3":
                return timeConditionOptions;
            case "4":
                return conferenceOptions;
            case "5":
                return callQueueOptions;
            case "6":
                return ringOptions;
            case "7":
                return sipOptions;
            case "9":
                return externalUserOptions;
            case "10":
                return promptsOptions;
        }
    };

    // Fetching Time Conditions Data
    const onGetData = useDebouncedCallback(async () => {
        setLoading(true);
        try {
            const params = { ...filter };
            delete params["isAdvance"];
            await dispatch(timeConditionGet(params)).unwrap();
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.error("Get Time Conditions Err =-=>", err);
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

    // Advance Search - Fetching Time Condition Data
    const onSearchData = async () => {
        setLoading(true);
        try {
            const payload = {
                [data["name"]["key"]]: data["name"]["val"],
                [data["failover_routing_type"]["key"]]:
                    data["failover_routing_type"]["val"],
                [data["failover_routing_options"]["key"]]:
                    data["failover_routing_options"]["val"],
                status,
            };
            Object.entries(payload)?.forEach(([key, val]: any) => {
                if (!val) {
                    delete payload[key];
                }
            });
            await dispatch(timeConditionSearch(payload)).unwrap();
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Search data Err --->", e.message);
        }
    };

    // Advance Search Fields Empty & Fetching Time Conditions Data
    const onEmptySearch = () => {
        setData(initialValues);
        setFilter({
            ...filter,
            page: 1,
            limit: 10,
            isAdvance: false,
        });
    };

    // Navigate to Create Time Conditions Page
    const onCreateTimeCondition = () =>
        router.push(
            managerName
                ? "/manager-time-condition/create"
                : "/tenant-time-condition/create"
        );

    //Navigate to Update Time Conditions Page
    const onEditClick = async (data: any) => {
        try {
            await dispatch(updateSingleTimeConditionData(data));
            router.push(
                managerName
                    ? "/manager-time-condition/" + data?.uuid
                    : "/tenant-time-condition/" + data?.uuid
            );
        } catch (err) {
            console.error("Store Single Time Condition Err =-=>", err);
        }
    };

    // Update Time Conditions Status & Fetching Time Conditions Data
    const onUpdateStatus = async (val: any) => {
        setLoading(true);
        try {
            const payload = {
                status: val.status === "1" ? "0" : "1",
                id: val.uuid,
            };
            const res: any = await dispatch(
                timeConditionUpdateStatus(payload)
            ).unwrap();
            if (res.statusCode === 200) {
                setFilter({ ...filter });
                Success(res.data);
            } else {
                Danger(res?.data);
            }
        } catch (e: any) {
            setLoading(false);
            console.error("Update Time Conditions Status Err --->", e?.message);
        }
    };

    // Deleting Selected Time Conditions & Fetching Time Conditions Data
    const onDeleteTimeConditions = async (id: string) => {
        setLoading(true);
        try {
            await dispatch(timeConditionDelete(id)).unwrap();
            const ids = deleteId.split(",");
            setDeleteId("");
            setFilter({
                ...filter,
                page:
                    ids?.length === timeConditionData?.data?.length && filter?.page > 1
                        ? filter?.page - 1
                        : filter?.page,
            });
            setSelectedRow([]);
            Success("Successfully Deleted");
        } catch (e: any) {
            setLoading(false);
            setDeleteId("");
            Danger("");
            console.error("Delete Time Conditions Err --->", e?.message);
        }
    };

    // Mass Delete Click - Open Delete Modal
    const onMassDeleteTimeCondition = () => {
        const selectedRows = [...selectedRow];
        setDeleteId(selectedRows.join(","));
    };

    return (
        <div className="bg-white p-5 rounded-[25px]">
            <Head
                name={name}
                managerName={managerName}
                length={timeConditionData?.count || 0}
                search={filter?.search}
                createText="Create Time Condition"
                onCreateClick={onCreateTimeCondition}
                onDeleteClick={onMassDeleteTimeCondition}
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
                    name="failover_routing_type"
                    label="Fail-over Routing Type"
                    placeholder="Select Fail-over Routing Type"
                    value={data.failover_routing_type.val}
                    options={routingTypeOptions3}
                    removable
                    onChange={(e: any) => {
                        setData({
                            ...data,
                            failover_routing_options: {
                                ...data["failover_routing_options"],
                                val: "",
                            },
                            failover_routing_type: {
                                ...data["failover_routing_type"],
                                val: e.target.value,
                            },
                        });
                    }}
                    isInfo
                />
                {data.failover_routing_type.val === "8" ? (
                    <InputSelect
                        type="number"
                        name="failover_routing_options"
                        label="Fail-over Routing Option"
                        placeholder="Enter Fail-over Routing Option"
                        value={data.failover_routing_options.val}
                        dropdownValue={data.failover_routing_options.dropdown}
                        options={advanceSearchOptions}
                        onChange={(e: any) =>
                            handleChnage("failover_routing_options", e.target.value)
                        }
                        onDropdownChange={(e: any) =>
                            handleSelect("failover_routing_options", e.target.value)
                        }
                        isInfo
                    />
                ) : (
                    <Select
                        name="failover_routing_options"
                        label="Fail-over Routing Option"
                        placeholder="Select Fail-over Routing Option"
                        value={data.failover_routing_options.val}
                        removable
                        options={getOptions() || []}
                        onChange={(e: any) =>
                            handleChnage("failover_routing_options", e.target.value)
                        }
                        isInfo
                    />
                )}
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
                    title="Time condition"
                    name={name}
                    managerName={managerName}
                    navigate={
                        managerName
                            ? "/manager-time-condition/create"
                            : "/tenant-time-condition/create"
                    }
                    columns={columns}
                    data={timeConditionData?.data?.length ? timeConditionData.data : []}
                    page={filter.page}
                    totalCount={timeConditionData?.count || 0}
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
                onDoneClick={() => onDeleteTimeConditions(deleteId)}
            />
        </div>
    );
};

export default TimeConditions;
