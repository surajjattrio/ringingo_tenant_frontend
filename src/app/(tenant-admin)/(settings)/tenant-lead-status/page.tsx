"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";

// PROJECT IMPORT
import {
    updateSingleTenantDispositionData,
    useIsLoading,
    tenantDispositionDelete,
    tenantDispositionGet,
    tenantDispositionSearch,
    tenantDispositionStatusUpdate,
    useTenantDispositionData,
} from "@/redux/slice/tenant-admin/leadStatusSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { InputSelect, Switch, Toggle } from "@/components/forms";
import { Head, Table } from "@/components/ui-components";
import { DeleteModal } from "@/components/modals";

// THIRD-PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";

// TYPES IMPORT
import { TenantDispositionFilterTypes } from "@/types/advancedFilterTypes";
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";

// OPTIONS IMPORT
import { advanceSearchOptions } from "@/config/options";
//import { ManagerPageTypes } from "@/types/formTypes";

// NAME STATE
const initialValues: TenantDispositionFilterTypes = {
    name: { key: "name|1", val: "", dropdown: "1" },
    code: { key: "code|1", val: "", dropdown: "1" },
};

const TenantLeadStatus = () => {
    // props: ManagerPageTypes
    //const { managerName = null, name = null } = props;
    const managerName = null;
    const name = null;
    const dispatch = useAppDispatch();
    const router = useRouter();
    const isLoading = useIsLoading();
    const dispositionData = useTenantDispositionData();
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
            title: "Status Name",
            sortable: true,
        },
        {
            name: "code",
            title: "Code",
            sortable: true,
        },
        {
            name: "status",
            title: "Status",
            action: (row: any) => {
                return (
                    <>
                        <Toggle
                            disabled={!!row?.disabled}
                            loading={loading}
                            checked={row.status === "0"}
                            onChange={() => {
                                onUpdateDispositionStatus(row);
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
            console.log("else");
            onGetDispositionData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    // Fetching Disposition Data
    const onGetDispositionData = useDebouncedCallback(async () => {
        setLoading(true);
        try {
            const params = { ...filter };
            delete params["isAdvance"];
            await dispatch(tenantDispositionGet(params)).unwrap();
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.error("Get Disposition Err =-=>", err);
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

    // Advance Search - Fetching Disposition Data
    const onSearchData = async () => {
        setLoading(true);
        try {
            const payload = {
                [data["name"]["key"]]: data["name"]["val"],
                [data["code"]["key"]]: data["code"]["val"],
                status,
            };
            Object.entries(payload)?.forEach(([key, val]: any) => {
                if (!val) {
                    delete payload[key];
                }
            });
            await dispatch(tenantDispositionSearch(payload)).unwrap();
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Search data Err --->", e.message);
        }
    };

    // Advance Search Fields Empty & Fetching Disposition Data
    const onEmptySearch = () => {
        setData(initialValues);
        setFilter({
            ...filter,
            page: 1,
            limit: 10,
            isAdvance: false,
        });
        onGetDispositionData();
    };

    // Navigate to Create Disposition Page
    const onCreateDisposition = () =>
        router.push(
            managerName ? "/manager-disposition/create" : "/tenant-lead-status/create"
        );

    // Navigate to Edit Disposition Page
    //   const onEditClick = (data: any) => router.push("/manager-disposition/" + data?.uuid);

    // Store Single Outgoing Rules Data in Redux & Navigate to Update Outgoing Rules Page
    const onEditClick = (data: any) => {
        try {
            dispatch(updateSingleTenantDispositionData(data));
            router.push(
                managerName
                    ? "/manager-disposition/" + data?.pbx_lead_status_uuid
                    : "/tenant-lead-status/" + data?.pbx_lead_status_uuid
            );
        } catch (err) {
            console.error("Store Single Disposition Err =-=>", err);
        }
    };

    // Update Disposition Status & Fetching Disposition Data
    const onUpdateDispositionStatus = async (data: any) => {
        setLoading(true);
        try {
            const payload = {
                status: data.status === "1" ? "0" : "1",
                id: data.pbx_lead_status_uuid,
            };
            const res: any = await dispatch(
                tenantDispositionStatusUpdate(payload)
            ).unwrap();
            if (res.statusCode === 200) {
                setFilter({ ...filter });
                // onGetDispositionData();
                Success(res.data);
            } else {
                Danger(res?.data);
            }
        } catch (err) {
            setLoading(false);
            console.error("Update Disposition Status Err =-=>", err);
        }
    };

    // Deleting Selected Disposition & Fetching Disposition Data
    const onDeleteDisposition = async (id: string) => {
        setLoading(true);
        try {
            await dispatch(tenantDispositionDelete(id)).unwrap();
            const ids = deleteId.split(",");
            setDeleteId("");
            setFilter({
                ...filter,
                page:
                    ids?.length === dispositionData?.data?.length && filter?.page > 0
                        ? filter?.page - 1
                        : filter?.page,
            });
            setSelectedRow([]);
            Success("Successfully Deleted");
        } catch (e: any) {
            setLoading(false);
            setDeleteId("");
            Danger("");
            console.error("Delete Disposition Err --->", e?.message);
        }
    };

    // Mass Delete Click - Open Delete Modal
    const onMassDeleteDisposition = () => {
        const selectedRows = [...selectedRow];
        setDeleteId(selectedRows.join(","));
    };

    return (
        <div className="bg-white p-5 rounded-[25px]">
            <Head
                name={name}
                managerName={managerName}
                length={dispositionData?.count || ""}
                createText="Create Lead Status"
                onCreateClick={onCreateDisposition}
                onDeleteClick={onMassDeleteDisposition}
                onChange={(e: any) =>
                    setFilter({
                        ...filter,
                        search: e.target.value,
                        isAdvance: false,
                        page: 1,
                        limit: 10,
                    })
                }
                //onFilterClick={() => setFilterOpen(!filterOpen)}
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
                    label="Status Name"
                    placeholder="Enter Status Name"
                    value={data.name.val}
                    dropdownValue={data.name.dropdown}
                    options={advanceSearchOptions}
                    onChange={(e: any) => handleChnage("name", e.target.value)}
                    onDropdownChange={(e: any) => handleSelect("name", e.target.value)}
                    isInfo
                />

                <InputSelect
                    name="code"
                    label="Code"
                    placeholder="Enter Code"
                    value={data.code.val}
                    dropdownValue={data.code.dropdown}
                    options={advanceSearchOptions}
                    onChange={(e: any) => handleChnage("code", e.target.value)}
                    onDropdownChange={(e: any) => handleSelect("code", e.target.value)}
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
                    isLoading={isLoading}
                    title="Lead Status"
                    navigate={
                        managerName
                            ? "/manager-disposition/create"
                            : "/tenant-lead-status/create"
                    }
                    columns={columns}
                    data={dispositionData?.data?.length ? dispositionData.data : []}
                    page={filter.page}
                    totalCount={dispositionData?.count || 0}
                    limit={filter.limit}
                    selectedRows={selectedRow}
                    onPageClick={(page: number) => {
                        setFilter({
                            ...filter,
                            page,
                        });
                    }}
                    onEditClick={onEditClick}
                    onDeleteClick={(data: any) => setDeleteId(data.pbx_lead_status_uuid)}
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
                onDoneClick={() => onDeleteDisposition(deleteId)}
            />
        </div>
    );
};

export default TenantLeadStatus;

