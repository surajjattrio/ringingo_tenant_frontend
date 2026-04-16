"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";

// PROJECT IMPORT
import {
    stateGet,
    stateSearch,
    updateSingleStateData,
    stateStatusUpdate,
    stateDelete,
    useStates,
    stateStatus,
    stateUpdate,
} from "@/redux/slice/tenant-admin/manageStateSlice";

import { advanceSearchOptions } from "@/config/options";
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { Button, InputSelect, Select, Switch, Toggle } from "@/components/forms";
import { Head, Table } from "@/components/ui-components";
import { DeleteModal, Modal } from "@/components/modals";

// THIRD-PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";

// TYPES IMPORT
import { StateFilterTypes } from "@/types/advancedFilterTypes";
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";
import { ManagerPageTypes } from "@/types/formTypes";

// NAME STATE
const initialValues: StateFilterTypes = {
    state_code: { key: "state_code|1", val: "", dropdown: "1" },
    state_name: { key: "state_name|4", val: "", dropdown: "4" },
};

const State = (props: ManagerPageTypes) => {
    const { managerName = null, name = null } = props;
    const dispatch = useAppDispatch();
    const router = useRouter();
    const state = useStates();

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
    const [statusId, setStatusId] = useState<any>("");
    const [data, setData] = useState<any>(initialValues);
    const [status, setStatus] = useState<string>("0");

    const columns: ColumnsType[] = [
        {
            name: "state_code",
            title: "State Code",
            sortable: true,
        },
        {
            name: "state_name",
            title: "State Name",
            sortable: true,
        },

        {
            name: "toggle_status",
            title: "Status",
            action: (row: any) => {
                return (
                    <>
                        <Toggle
                            loading={loading}
                            checked={row.toggle_status === "0"}
                            onChange={() => {
                                onUpdateStateStatus(row);
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

    // Fetching State Data
    const onGetData = useDebouncedCallback(async () => {
        setLoading(true);
        try {
            const params = { ...filter };
            delete params["isAdvance"];
            await dispatch(stateGet(params)).unwrap();
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.error("Get State Err =-=>", err);
        }
    }, 500);

    // Fetching All Telecom Circle Data
    const onGetAllState = async () => {
        setCsvLoading(true);
        try {
            if (filter?.isAdvance) {
                const payload = {
                    [data["state_code"]["key"]]: data["state_code"]["val"],
                    page: filter?.page,
                    limit: state?.count || 0,
                };
                Object.entries(payload)?.forEach(([key, val]: any) => {
                    if (!val) {
                        delete payload[key];
                    }
                });
                await dispatch(stateSearch(payload)).unwrap();
                setCsvLoading(false);
                setIsCsvDownload(true);
            } else {
                const params = { ...filter };
                params["limit"] = state?.count || 0;
                delete params["isAdvance"];
                await dispatch(stateGet(params)).unwrap();
                setCsvLoading(false);
                setIsCsvDownload(true);
            }
        } catch (err: any) {
            console.error("Get All STATE Err =-=>", err);
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
                [data["state_code"]["key"]]: data["state_code"]["val"],
                [data["state_name"]["key"]]: data["state_name"]["val"],

                toggle_status: status,
            };
            Object.entries(payload)?.forEach(([key, val]: any) => {
                if (!val) {
                    delete payload[key];
                }
            });
            await dispatch(stateSearch(payload)).unwrap();
        } catch (e: any) {
            console.error("Search data Err --->", e.message);
        }
    };

    // Advance Search Fields Empty & Fetching State Data
    const onEmptySearch = () => {
        setData(initialValues);
        setFilter({
            ...filter,
            page: 1,
            limit: 10,
            isAdvance: false,
        });
    };

    // Navigate to Create State Page
    const onCreateState = () =>
        router.push(managerName ? "/manager-state/create" : "/manage-state/create");

    // Store Single State Data in Redux & Navigate to Update State Page
    const onEditClick = (data: any) => {
        try {
            dispatch(updateSingleStateData(data));
            router.push(
                managerName ? "/manager-state/" + data?.uuid : "/manage-state/" + data?.uuid
            );
        } catch (err) {
            console.error("Store Single State Err =-=>", err);
        }
    };

    // Update State Status & Fetching State Data
    const onUpdateStateStatus = async (val: any) => {
        setLoading(true);
        try {
            const payload = {
                status: val.toggle_status === "1" ? "0" : "1",
                id: val.uuid,
            };
            const res: any = await dispatch(stateStatusUpdate(payload)).unwrap();
            if (res.statusCode === 200) {
                setFilter({ ...filter });
                Success(res.data);
            } else {
                Danger(res?.data);
            }
        } catch (e: any) {
            setLoading(false);
            console.error("Update State Status Err --->", e?.message);
        }
    };

    // Deleting Selected State & Fetching State Data
    const onDeleteState = async (id: string) => {
        setLoading(true);
        try {
            await dispatch(stateDelete(id)).unwrap();
            const ids = deleteId.split(",");
            setDeleteId("");
            setFilter({
                ...filter,
                page:
                    ids?.length === state?.data?.length && filter?.page > 1
                        ? filter?.page - 1
                        : filter?.page,
            });
            setSelectedRow([]);
            Success("Successfully Deleted");
        } catch (e: any) {
            setLoading(false);
            console.error("Delete State Err --->", e?.message);
        }
    };

    // Status Selected State & Fetching State Data
    const onStatusState = async (id: string, values: any) => {
        setLoading(true);
        try {
            const payload = {
                status: values.toggle_status,
                id: id,
            };
            const res: any = await dispatch(stateStatus(payload)).unwrap();
            if (res.statusCode === 200) {
                const ids = deleteId.split(",");
                setStatusId("");
                setFilter({
                    ...filter,
                    page:
                        ids?.length === state?.data?.length && filter?.page > 1
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
            console.error("Update State Status Err --->", e?.message);
        }
    };

    // Mass Delete Click - Open Delete Modal
    const onMassDeleteState = () => {
        const selectedRows = [...selectedRow];
        setDeleteId(selectedRows.join(","));
    };
    // Mass Status Click - Open Status Modal
    const onMassStatusState = () => {
        const selectedRows = [...selectedRow];
        setStatusId(selectedRows.join(","));
    };

    return (
        <div className="bg-white p-5 rounded-[25px]">
            <Head
                name="state"
                length={state?.count || 0}
                csvloader={csvLoading}
                isCsvDownload={isCsvDownload}
                setIsCsvDownload={setIsCsvDownload}
                onCsvClick={() => onGetAllState()}
                onImportClick={() =>
                    router.push(managerName ? "manager-state/import" : "manage-state/import")
                }
                createText="Create State"
                onCreateClick={onCreateState}
                onDeleteClick={onMassDeleteState}
                onStatusClick={onMassStatusState}
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
                    name="state_code"
                    label="State Code"
                    placeholder="Enter State Code"
                    value={data.state_code.val}
                    dropdownValue={data.state_code.dropdown}
                    options={advanceSearchOptions}
                    onChange={(e: any) => handleChnage("state_code", e.target.value)}
                    onDropdownChange={(e: any) =>
                        handleSelect("state_code", e.target.value)
                    }
                    isInfo
                />
                <InputSelect
                    name="state_name"
                    label="State Name"
                    placeholder="Enter State Name"
                    value={data.state_name.val}
                    dropdownValue={data.state_name.dropdown}
                    options={advanceSearchOptions}
                    onChange={(e: any) => handleChnage("state_name", e.target.value)}
                    onDropdownChange={(e: any) =>
                        handleSelect("state_name", e.target.value)
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
                    name={name}
                    managerName={managerName}
                    isLoading={loading}
                    title="State"
                    navigate={managerName ? "/manager-state/create" : "/manage-state/create"}
                    columns={columns}
                    data={state?.data?.length ? state.data : []}
                    page={filter.page}
                    totalCount={state?.count || 0}
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
                    onSelectRow={(e: any, data: any, array: string[]) => {
                        setSelectedRow(array)
                    }
                    }
                    onLimitChange={(limit: number) => {
                        setFilter({
                            ...filter,
                            limit,
                        });
                    }}
                    //  onUpdateStateStatus={onUpdateStateStatus}
                    onRefresh={() => setFilter({ ...filter })}
                />
            </div>
            <DeleteModal
                loading={loading}
                visible={!!deleteId}
                onCancelClick={() => setDeleteId("")}
                onDoneClick={() => onDeleteState(deleteId)}
            />
            <Modal
                loading={loading}
                visible={!!statusId}
                title="Status Update Entries"
                content="Are you sure you want to status selected entries?"
                doneText="Enable Status"
                cancelText="Disable Status"
                onCancelClick={() => onStatusState(statusId, { toggle_status: "1" })}
                onDoneClick={() => onStatusState(statusId, { toggle_status: "0" })}
            />
        </div>
    );
};

export default State;
