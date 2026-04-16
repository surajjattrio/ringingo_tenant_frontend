"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";

// PROJECT IMPORT
import {
    useAreaCode,
    areaCodeGet,
    areaCodeSearch,
    updateSingleAreaCodeData,
    areaCodeStatusUpdate,
    areaCodeDelete,
    areaCodeStatus,
} from "@/redux/slice/tenant-admin/manageAreaCodeSlice";
import { advanceSearchOptions, areacodeTypeOptions } from "@/config/options";
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { InputSelect, Select, Switch, Toggle } from "@/components/forms";
import { Head, Table } from "@/components/ui-components";
import { DeleteModal, Modal } from "@/components/modals";

// THIRD-PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";

// TYPES IMPORT
import { AreaCodeFilterTypes } from "@/types/advancedFilterTypes";
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";
import { ManagerPageTypes } from "@/types/formTypes";
import { stateOptionsGet, useStateOptions } from "@/redux/slice/tenant-admin/manageStateSlice";
import { timezoneOptionsGet, useTimezoneOptions } from "@/redux/slice/master-admin/timezoneSlice";

// NAME STATE
const initialValues: AreaCodeFilterTypes = {
    code: { key: "code|1", val: "", dropdown: "1" },
    comment: { key: "comment|1", val: "", dropdown: "1" },
    type: { key: "type|1", val: "", dropdown: "1" },
    state_id: { key: "state_id|1", val: "", dropdown: "1" },
    timezone_uuid: { key: "timezone_uuid|1", val: "", dropdown: "1" }
};

const AreaCode = (props: ManagerPageTypes) => {
    const { managerName = null, name = null } = props;
    const dispatch = useAppDispatch();
    const router = useRouter();
    const areacode = useAreaCode();

    const [csvLoading, setCsvLoading] = useState<boolean>(false);
    const [isCsvDownload, setIsCsvDownload] = useState<boolean>(false);

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
    const [areaCodeId, setAreaCodeId] = useState<any>("");

    const stateOptions = useStateOptions();
    const timezoneOptions = useTimezoneOptions();

    const columns: ColumnsType[] = [
        {
            name: "code",
            title: "Area Code",
            sortable: true,
        },
        {
            name: "comment",
            title: "Area Name",
            sortable: true,
        },
        {
            name: "state",
            title: "State Code",
            sortable: true,
            action: (row: any) => (
                <>
                    <span>{row?.state?.[0]?.state_code || ""}</span>
                </>
            ),
        },
        {
            name: "start_time",
            title: "Start Time",
            sortable: true,
        },
        {
            name: "end_time",
            title: "End Time",
            sortable: true,
        },
        {
            name: "timezone_uuid",
            title: "Time Zone",
            sortable: true,
            action: (row: any) => (
                <>
                    {row?.timezone?.length > 0 && <span>{row?.timezone?.[0]?.timezone_name || ""} : {row?.timezone?.[0]?.gmttime || ""}</span>}
                </>
            ),
        },
        {
            name: "type",
            title: "Type",
            action: (row: any) => {
                return (
                    <>
                        <Toggle
                            loading={loading}
                            checked={row.type === "0"}
                            onChange={() => {
                                onUpdateAreaCodeStatus(row);
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

    // Fetching AreaCode Data
    const onGetData = useDebouncedCallback(async () => {
        setLoading(true);
        try {
            const params = { ...filter };
            delete params["isAdvance"];
            await dispatch(areaCodeGet(params)).unwrap();
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.error("Get AreaCode Err =-=>", err);
        }
    }, 500);

    // Fetching All Telecom Circle Data
    const onGetAllAreaCode = async () => {
        setCsvLoading(true);
        try {
            if (filter?.isAdvance) {
                const payload = {
                    [data["code"]["key"]]: data["code"]["val"],
                    page: filter?.page,
                    limit: areacode?.count || 0,
                };
                Object.entries(payload)?.forEach(([key, val]: any) => {
                    if (!val) {
                        delete payload[key];
                    }
                });
                await dispatch(areaCodeSearch(payload)).unwrap();
                setCsvLoading(false);
                setIsCsvDownload(true);
            } else {
                const params = { ...filter };
                params["limit"] = areacode?.count || 0;
                delete params["isAdvance"];
                await dispatch(areaCodeGet(params)).unwrap();
                setCsvLoading(false);
                setIsCsvDownload(true);
            }
        } catch (err: any) {
            console.error("Get All AREACODE Err =-=>", err);
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
                [data["code"]["key"]]: data["code"]["val"],
                [data["comment"]["key"]]: data["comment"]["val"],
                [data["type"]["key"]]: data["type"]["val"],
                [data["state_id"]["key"]]: data["state_id"]["val"],
                [data["timezone_uuid"]["key"]]: data["timezone_uuid"]["val"],
            };
            Object.entries(payload)?.forEach(([key, val]: any) => {
                if (!val) {
                    delete payload[key];
                }
            });
            await dispatch(areaCodeSearch(payload)).unwrap();
        } catch (e: any) {
            console.error("Search data Err --->", e.message);
        }
    };

    // Advance Search Fields Empty & Fetching AreaCode Data
    const onEmptySearch = () => {
        setData(initialValues);
        setFilter({
            ...filter,
            page: 1,
            limit: 10,
            isAdvance: false,
        });
    };

    // Navigate to Create AreaCode Page
    const onCreateAreaCode = () =>
        router.push(managerName ? "/manager-areacode/create" : "/manage-area-code/create");

    // Store Single AreaCode Data in Redux & Navigate to Update AreaCode Page
    const onEditClick = (data: any) => {
        try {
            dispatch(updateSingleAreaCodeData(data));
            router.push(
                managerName ? "/manager-areacode/" + data?.uuid : "/manage-area-code/" + data?.uuid
            );
        } catch (err) {
            console.error("Store Single AreaCode Err =-=>", err);
        }
    };

    // Update AreaCode Status & Fetching AreaCode Data
    const onUpdateAreaCodeStatus = async (val: any) => {
        setLoading(true);
        try {
            const payload = {
                status: val.type === "1" ? "0" : "1",
                id: val.uuid,
            };
            const res: any = await dispatch(areaCodeStatusUpdate(payload)).unwrap();
            if (res.statusCode === 200) {
                setFilter({ ...filter });
                Success(res.data);
            } else {
                Danger(res?.data);
            }
        } catch (e: any) {
            setLoading(false);
            console.error("Update AreaCode Status Err --->", e?.message);
        }
    };

    // Deleting Selected AreaCode & Fetching AreaCode Data
    const onDeleteAreaCode = async (id: string) => {
        setLoading(true);
        try {
            await dispatch(areaCodeDelete(id)).unwrap();
            const ids = deleteId.split(",");
            setDeleteId("");
            setFilter({
                ...filter,
                page:
                    ids?.length === areacode?.data?.length && filter?.page > 1
                        ? filter?.page - 1
                        : filter?.page,
            });
            setSelectedRow([]);
            Success("Successfully Deleted");
        } catch (e: any) {
            setLoading(false);
            console.error("Delete AreaCode Err --->", e?.message);
        }
    };

    // Status Selected Area Code & Fetching Area Code Data
    const onStatusAreaCode = async (id: string, values: any) => {
        setLoading(true);
        try {
            const payload = {
                status: values.type,
                id: id,
            };
            const res: any = await dispatch(areaCodeStatus(payload)).unwrap();
            if (res.statusCode === 200) {
                const ids = deleteId.split(",");
                setAreaCodeId("");
                setFilter({
                    ...filter,
                    page:
                        ids?.length === areacode?.data?.length && filter?.page > 1
                            ? filter?.page - 1
                            : filter?.page,
                });
                setSelectedRow([]);
                Success("Successfully Status Updated");
            } else {
                Danger(res?.data);
            }
        } catch (e: any) {
            setLoading(false);
            console.error("Update Area Code Status Err --->", e?.message);
        }
    };

    // Mass Delete Click - Open Delete Modal
    const onMassDeleteAreaCode = () => {
        const selectedRows = [...selectedRow];
        setDeleteId(selectedRows.join(","));
    };
    // Mass Status Click - Open Status Modal
    const onMassStatusAreaCode = () => {
        const selectedRows = [...selectedRow];
        setAreaCodeId(selectedRows.join(","));
    };
    // Fetching State Options
    const onGetStateOptions = async () => {
        try {
            await dispatch(stateOptionsGet()).unwrap();
        } catch (err) {
            console.error("Get State Options Err =-=>", err);
        }
    };
    useEffect(() => {
        onGetStateOptions();
        onGetTimeZonesOptions();
    }, []);

    // Fetching Time Zones Options
    const onGetTimeZonesOptions = async () => {
        try {
            await dispatch(timezoneOptionsGet()).unwrap();
        } catch (e: any) {
            console.error("Get TimeZones Data Err --->", e?.message);
        }
    };
    return (
        <div className="bg-white p-5 rounded-[25px]">
            <Head
                name="areacode"
                length={areacode?.count || 0}
                csvloader={csvLoading}
                isCsvDownload={isCsvDownload}
                setIsCsvDownload={setIsCsvDownload}
                onCsvClick={() => onGetAllAreaCode()}
                onImportClick={() =>
                    router.push(managerName ? "manager-areacode/import" : "manage-area-code/import")
                }
                createText="Create Area Code"
                onCreateClick={onCreateAreaCode}
                onDeleteClick={onMassDeleteAreaCode}
                onStatusClick={onMassStatusAreaCode}
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
                    name="code"
                    label="Area Code"
                    placeholder="Enter Area Code"
                    value={data.code.val}
                    dropdownValue={data.code.dropdown}
                    options={advanceSearchOptions}
                    onChange={(e: any) => handleChnage("code", e.target.value)}
                    onDropdownChange={(e: any) =>
                        handleSelect("code", e.target.value)
                    }
                    isInfo
                />
                <InputSelect
                    name="comment"
                    label="Comment"
                    placeholder="Enter Comment"
                    value={data.comment.val}
                    dropdownValue={data.comment.dropdown}
                    options={advanceSearchOptions}
                    onChange={(e: any) => handleChnage("comment", e.target.value)}
                    onDropdownChange={(e: any) =>
                        handleSelect("comment", e.target.value)
                    }
                    isInfo
                />
                <Select
                    name="type"
                    label="Type"
                    placeholder="Select Type"
                    removable
                    options={areacodeTypeOptions}
                    value={data.type.val}
                    onChange={(e: any) => handleChnage("type", e.target.value)}
                    isInfo
                />

                <Select
                    name="state"
                    label="State Code"
                    placeholder="Select State Code"
                    removable
                    options={stateOptions}
                    value={data.state_id.val}
                    onChange={(e: any) => handleChnage("state_id", e.target.value)}
                    isInfo
                />

                <Select
                    name="timezone_uuid"
                    label="Time Zone"
                    placeholder="Select Time Zone"
                    options={timezoneOptions}
                    icon="Clock"
                    value={data.timezone_uuid.val}
                    removable
                    onChange={(e: any) => {
                        handleChnage("timezone_uuid", e.target.value);
                    }}
                    isInfo
                />
            </Head>

            <div className="mt-5">
                <Table
                    name={name}
                    managerName={managerName}
                    isLoading={loading}
                    title="Area Code"
                    navigate={managerName ? "/manager-areacode/create" : "/manage-area-code/create"}
                    columns={columns}
                    data={areacode?.data?.length ? areacode.data : []}
                    page={filter.page}
                    totalCount={areacode?.count || 0}
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
                    //  onUpdateAreaCodeStatus={onUpdateAreaCodeStatus}
                    onRefresh={() => setFilter({ ...filter })}
                />
            </div>
            <DeleteModal
                loading={loading}
                visible={!!deleteId}
                onCancelClick={() => setDeleteId("")}
                onDoneClick={() => onDeleteAreaCode(deleteId)}
            />
            <Modal
                loading={loading}
                visible={!!areaCodeId}
                title="Status Update Entries"
                content="Are you sure you want to status selected entries?"
                doneText="Enable Status"
                cancelText="Disable Status"
                onCancelClick={() => onStatusAreaCode(areaCodeId, { type: "1" })}
                onDoneClick={() => onStatusAreaCode(areaCodeId, { type: "0" })}
            />
        </div>
    );
};

export default AreaCode;
