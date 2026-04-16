"use client";
import { useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";

// PROJECT IMPORTS
import { useAppDispatch } from "@/redux/hooks";
import {
    callerIdGroupAllGet,
    callerIdGroupAllSearch,
    callerIdGroupDelete,
    callerIdGroupGet,
    callerIdGroupSearch,
    callerIdGroupStatusUpdate,
    useAllCallerIdGroup,
    useCallerIdGroup,
} from "@/redux/slice/tenant-admin/callerIdGroupSlice";
import { Danger, Success } from "@/redux/services/toasterServices";
import { setActiveTab } from "@/redux/slice/commonSlice";
import { DeleteModal } from "@/components/modals";
import { Head, Table } from "@/components/ui-components";
import { useDebouncedCallback } from "use-debounce";
import { InputSelect, Switch } from "@/components/forms";
import { advanceSearchOptions } from "@/config/options";

// TYPES
import { ColumnsType } from "@/types/tableTypes";
import { FilterTypes } from "@/types/filterTypes";
import { CallIdGroupFilterTypes } from "@/types/advancedFilterTypes";
import { ManagerPageTypes } from "@/types/formTypes";

// DATA
const headers: any = [
    { label: "Caller ID", key: "caller_id_group" },
    { label: "Status", key: "status" },
];

// NAME STATE
const initialValues: CallIdGroupFilterTypes = {
    caller_id_group: { key: "caller_id_group|1", val: "", dropdown: "1" },
};

const CallIdGroup = (props: ManagerPageTypes) => {
    const { managerName = null, name = null } = props;
    const router = useRouter();

    const dispatch = useAppDispatch();
    const callerIdGroup = useCallerIdGroup();
    const allCallerIdGroup = useAllCallerIdGroup();
    const [data, setData] = useState<any>(initialValues);
    const [status, setStatus] = useState<string>("0");
    const [loading, setLoading] = useState<boolean>(true);
    const [csvLoading, setCsvLoading] = useState<boolean>(false);
    const [isCsvDownload, setIsCsvDownload] = useState<boolean>(false);
    const [filter, setFilter] = useState<FilterTypes>({
        page: 1,
        limit: 10,
        search: "",
        isAdvance: false,
    });
    const [selectedRow, setSelectedRow] = useState<string[]>([]);
    const [deleteId, setDeleteId] = useState<any>("");

    const columns: ColumnsType[] = [
        {
            name: "caller_id_group",
            title: "Caller Id Group",
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

    // Fetching All CDRS Data
    const onGetCallerId = async () => {
        setCsvLoading(true);
        try {
            if (filter?.isAdvance) {
                const payload = {
                    [data["caller_id_group"]["key"]]: data["caller_id_group"]["val"],
                    status,
                    page: filter?.page,
                    limit: callerIdGroup?.count || 0,
                };
                Object.entries(payload)?.forEach(([key, val]: any) => {
                    if (!val) {
                        delete payload[key];
                    }
                });
                await dispatch(callerIdGroupAllSearch(payload)).unwrap();
                setCsvLoading(false);
                setIsCsvDownload(true);
            } else {
                const params = { ...filter };
                params["limit"] = callerIdGroup?.count || 0;
                delete params["isAdvance"];
                await dispatch(callerIdGroupAllGet(params)).unwrap();
                setCsvLoading(false);
                setIsCsvDownload(true);
            }
        } catch (err) {
            console.error("Get Caller id group Err =-=>", err);
            setCsvLoading(false);
        }
    };

    // Preapring Data for Export File
    const prepareExportProps = () => {
        const data = allCallerIdGroup || [];

        const newData = data?.data?.length
            ? data?.data?.map((val: any) => ({
                caller_id_group: val?.caller_id_group,
                status: val?.status === "0" ? "Enabled" : "Disabled",
            }))
            : [];
        return { headers, data: newData, filename: "Call ID Group.csv" };
    };

    // Fetching Caller Id Data
    const onGetData = useDebouncedCallback(async () => {
        setLoading(true);
        try {
            const params = { ...filter };
            delete params["isAdvance"];
            await dispatch(callerIdGroupGet(params)).unwrap();
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.error("Get Caller id group Err =-=>", err);
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

    // Advance Search - Fetching Caller ID Group Data
    const onSearchData = async () => {
        setLoading(true);
        try {
            const payload = {
                [data["caller_id_group"]["key"]]: data["caller_id_group"]["val"],
                status,
            };
            Object.entries(payload)?.forEach(([key, val]: any) => {
                if (!val) {
                    delete payload[key];
                }
            });
            await dispatch(callerIdGroupSearch(payload)).unwrap();
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Search data Err --->", e.message);
        }
    };

    // Advance Search Fields Empty & Fetching Caller ID Group Data
    const onEmptySearch = () => {
        setData(initialValues);
        setFilter({
            ...filter,
            page: 1,
            limit: 10,
            isAdvance: false,
        });
    };

    // Navigate to Create Caller Id Group Page
    const onCreate = () =>
        router.push(
            managerName
                ? "/manager-call-id-group/create"
                : "/tenant-call-id-group/create"
        );

    // Store Single Caller Id Group Data in Redux & Navigate to Update Caller Id Group Page
    const onEditClick = (data: any) => {
        dispatch(setActiveTab(0));
        router.push(
            managerName
                ? "/manager-call-id-group/" + data?.uuid
                : "/tenant-call-id-group/" + data?.uuid
        );
    };

    // Update Caller Id Group Status & Fetching Caller Id Group Data
    const onUpdateStatus = async (val: any) => {
        setLoading(true);
        try {
            const payload = {
                status: val.status === "1" ? "0" : "1",
                id: val.uuid,
            };
            const res: any = await dispatch(
                callerIdGroupStatusUpdate(payload)
            ).unwrap();
            if (res.statusCode === 200) {
                setFilter({ ...filter });
                Success(res.data);
            } else {
                Danger(res?.data);
            }
        } catch (e: any) {
            setLoading(false);
            console.error("Update Caller id group Status Err --->", e?.message);
        }
    };

    // Deleting Selected Caller Id Group & Fetching Caller Id Group Data
    const onDelete = async (id: string) => {
        setLoading(true);
        try {
            await dispatch(callerIdGroupDelete(id)).unwrap();
            const ids = deleteId.split(",");
            setDeleteId("");
            setFilter({
                ...filter,
                page:
                    ids?.length === callerIdGroup?.data?.length && filter?.page > 1
                        ? filter?.page - 1
                        : filter?.page,
            });
            setSelectedRow([]);
            Success("Successfully Deleted");
        } catch (e: any) {
            setLoading(false);
            setDeleteId("");
            Danger("");
            console.error("Delete Caller Id Group Err --->", e?.message);
        }
    };

    // Mass Delete Click - Open Delete Modal
    const onMassDelete = () => {
        const selectedRows = [...selectedRow];
        setDeleteId(selectedRows.join(","));
    };

    return (
        <div className="bg-white p-5 rounded-[25px]">
            <Head
                name={name}
                managerName={managerName}
                length={callerIdGroup?.count}
                csvProps={prepareExportProps()}
                csvloader={csvLoading}
                isCsvDownload={isCsvDownload}
                setIsCsvDownload={setIsCsvDownload}
                onCsvClick={() => onGetCallerId()}
                createText="Create Caller ID Group"
                search={filter?.search}
                onCreateClick={onCreate}
                onDeleteClick={onMassDelete}
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
                    name="caller_id_group"
                    label="Caller ID Group name"
                    placeholder="Enter Caller ID Group name"
                    value={data?.caller_id_group?.val}
                    dropdownValue={data?.caller_id_group?.dropdown}
                    options={advanceSearchOptions}
                    onChange={(e: any) => handleChnage("caller_id_group", e.target.value)}
                    onDropdownChange={(e: any) =>
                        handleSelect("caller_id_group", e.target.value)
                    }
                    isInfo
                />
                {/* <Select
                    name="timeout"
                    label="Timeout"
                    placeholder="Select Timeout"
                    removable
                    value={data.timeout.val}
                    options={timeoutOptions2}
                    onChange={(e: any) => handleChnage("timeout", e.target.value)}
                    isInfo
                /> */}
                <Switch
                    className="pt-[2px]"
                    switchButtonClass="py-1.5"
                    label="Status"
                    value={status}
                    onClick={(value: string) => setStatus(value)}
                />
            </Head>
            <div className="mt-5">
                <Table
                    name={name}
                    managerName={managerName}
                    isLoading={loading}
                    title="Caller Id Group"
                    navigate={
                        managerName
                            ? "/manager-call-id-group/create"
                            : "/tenant-call-id-group/create"
                    }
                    columns={columns}
                    data={callerIdGroup?.data?.length ? callerIdGroup.data : []}
                    page={filter.page}
                    totalCount={callerIdGroup?.count || 0}
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
                onDoneClick={() => onDelete(deleteId)}
            />
        </div>
    );
};

export default CallIdGroup;
