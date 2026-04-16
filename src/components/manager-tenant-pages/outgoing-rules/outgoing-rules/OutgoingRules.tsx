"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";

// PROJECT IMPORT
import {
    managerOutgoingGet,
    managerOutgoingSearch,
    tenantOutgoingDelete,
    tenantOutgoingGet,
    tenantOutgoingSearch,
    tenantOutgoingStatusUpdate,
    updateSingleTenantOutgoingData,
    useTenantOutgoing,
} from "@/redux/slice/tenant-admin/tenantOutgoingSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { InputSelect, Switch } from "@/components/forms";
import { Head, Table } from "@/components/ui-components";
import { DeleteModal } from "@/components/modals";

// THIRD-PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";

// TYPES IMPORT
import { TenantOutgoingFilterTypes } from "@/types/advancedFilterTypes";
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";
import { ManagerPageTypes } from "@/types/formTypes";

// OPTIONS IMPORT
import { advanceSearchOptions } from "@/config/options";

// NAME STATE
const initialValues: TenantOutgoingFilterTypes = {
    name: { key: "name|1", val: "", dropdown: "1" },
};

const OutgoingRules = (props: ManagerPageTypes) => {
    const { managerName = null, name = null } = props;
    const dispatch = useAppDispatch();
    const router = useRouter();
    const outgoingData = useTenantOutgoing();

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

    // Fetching Outgoing Rules Data
    const onGetData = useDebouncedCallback(async () => {
        if (managerName) {
            setLoading(true);
            try {
                const params = { ...filter };
                delete params["isAdvance"];
                await dispatch(managerOutgoingGet(params)).unwrap();
                setLoading(false);
            } catch (err) {
                setLoading(false);
                console.error("Get Outgoing Rules Err =-=>", err);
            }
        } else {
            setLoading(true);
            try {
                const params = { ...filter };
                delete params["isAdvance"];
                await dispatch(tenantOutgoingGet(params)).unwrap();
                setLoading(false);
            } catch (err) {
                setLoading(false);
                console.error("Get Outgoing Rules Err =-=>", err);
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
            setLoading(true);
            try {
                const payload = {
                    [data["name"]["key"]]: data["name"]["val"],
                    status,
                };
                Object.entries(payload)?.forEach(([key, val]: any) => {
                    if (!val) {
                        delete payload[key];
                    }
                });
                await dispatch(managerOutgoingSearch(payload)).unwrap();
                setLoading(false);
            } catch (e: any) {
                setLoading(false);
                console.error("Search data Err --->", e.message);
            }
        } else {
            setLoading(true);
            try {
                const payload = {
                    [data["name"]["key"]]: data["name"]["val"],
                    status,
                };
                Object.entries(payload)?.forEach(([key, val]: any) => {
                    if (!val) {
                        delete payload[key];
                    }
                });
                await dispatch(tenantOutgoingSearch(payload)).unwrap();
                setLoading(false);
            } catch (e: any) {
                setLoading(false);
                console.error("Search data Err --->", e.message);
            }
        }
    };

    // Advance Search Fields Empty & Fetching Outgoing Rules Data
    const onEmptySearch = () => {
        setData(initialValues);
        setFilter({
            ...filter,
            page: 1,
            limit: 10,
            isAdvance: false,
        });
    };

    // Navigate to Create Outgoing Rules Page
    const onCreateOutgoing = () =>
        router.push(
            managerName
                ? "/manager-outgoing-rules/create"
                : "/tenant-outgoing-rules/create"
        );

    // Store Single Outgoing Rules Data in Redux & Navigate to Update Outgoing Rules Page
    const onEditClick = (data: any) => {
        try {
            dispatch(updateSingleTenantOutgoingData(data));
            router.push(
                managerName
                    ? "/manager-outgoing-rules/" + data?.uuid
                    : "/tenant-outgoing-rules/" + data?.uuid
            );
        } catch (err) {
            console.error("Store Single OutgoingRules Err =-=>", err);
        }
    };

    // Update Outgoing Rules Status & Fetching Outgoing Rules Data
    const onUpdateStatus = async (val: any) => {
        setLoading(true);
        try {
            const payload = {
                status: val.status === "1" ? "0" : "1",
                id: val.uuid,
            };
            const res: any = await dispatch(
                tenantOutgoingStatusUpdate(payload)
            ).unwrap();
            if (res.statusCode === 200) {
                setFilter({ ...filter });
                Success(res.data);
            } else {
                Danger(res?.data);
            }
        } catch (e: any) {
            setLoading(false);
            console.error("Update Outgoing Rules Status Err --->", e?.message);
        }
    };

    // Deleting Selected Outgoing Rules & Fetching Outgoing Rules Data
    const onDeleteOutgoing = async (id: string) => {
        setLoading(true);
        try {
            await dispatch(tenantOutgoingDelete(id)).unwrap();
            const ids = deleteId.split(",");
            setDeleteId("");
            setFilter({
                ...filter,
                page:
                    ids?.length === outgoingData?.data?.length && filter?.page > 1
                        ? filter?.page - 1
                        : filter?.page,
            });
            setSelectedRow([]);
            Success("Successfully Deleted");
        } catch (e: any) {
            setLoading(false);
            setDeleteId("");
            Danger("");
            console.error("Delete Outgoing Rules Err --->", e?.message);
        }
    };

    // Mass Delete Click - Open Delete Modal
    const onMassDeleteOutgoing = () => {
        const selectedRows = [...selectedRow];
        setDeleteId(selectedRows.join(","));
    };

    return (
        <div className="bg-white p-5 rounded-[25px]">
            <Head
                name={name}
                managerName={managerName}
                length={outgoingData?.count}
                createText="Create Outgoing Rule"
                search={filter?.search}
                onCreateClick={onCreateOutgoing}
                onDeleteClick={onMassDeleteOutgoing}
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
                    title="Outgoing Rule"
                    name={name}
                    managerName={managerName}
                    navigate={
                        managerName
                            ? "/manager-outgoing-rules/create"
                            : "/tenant-outgoing-rules/create"
                    }
                    columns={columns}
                    data={outgoingData?.data?.length ? outgoingData.data : []}
                    page={filter.page}
                    totalCount={outgoingData?.count || 0}
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
                onDoneClick={() => onDeleteOutgoing(deleteId)}
            />
        </div>
    );
};

export default OutgoingRules;
