"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// PROJECT IMPORT
import { useAppDispatch } from "@/redux/hooks";
import {
    tenantDelete,
    tenantGet,
    tenantSearch,
    tenantStatusUpdate,
    useTenantData,
} from "@/redux/slice/master-admin/tenantSlice";
import {
    countryOptionsGet,
    useCountryOptions,
} from "@/redux/slice/master-admin/countrySlice";
import { Danger, Success } from "@/redux/services/toasterServices";
import { InputSelect, Select, Switch } from "@/components/forms";
import { Head, Icon, Table } from "@/components/ui-components";
import { DeleteModal } from "@/components/modals";

// THIRD - PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";

// TYPES
import { ColumnsType } from "@/types/tableTypes";
import { TenantAdvancedFilterTypes } from "@/types/advancedFilterTypes";
import { FilterTypes } from "@/types/filterTypes";

// OPTIONS IMPORT
import { advanceSearchOptions } from "@/config/options";

// NAME STATE
const initialValues: TenantAdvancedFilterTypes = {
    tenant_name: { key: "tenant_name|1", val: "", dropdown: "1" },
    username: { key: "username|1", val: "", dropdown: "1" },
    email: { key: "email|1", val: "", dropdown: "1" },
    country_uuid: { key: "country_uuid|4", val: "", dropdown: "4" },
    domain: { key: "domain|1", val: "", dropdown: "1" },
};

/* ============================== TENANT PAGE ============================== */

const Tenant = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const tenantData = useTenantData();
    const countryOptions = useCountryOptions();

    const [loading, setLoading] = useState<boolean>(true);
    const [status, setStatus] = useState<string>("0");
    const [deleteId, setDeleteId] = useState<any>("");
    const [selectedRow, setSelectedRow] = useState<string[]>([]);
    const [data, setData] = useState<any>(initialValues);
    const [filter, setFilter] = useState<FilterTypes>({
        page: 1,
        limit: 10,
        search: "",
        isAdvance: false,
    });

    const columns: ColumnsType[] = [
        {
            name: "tenant_name",
            title: "Name",
            sortable: true,
        },
        {
            name: "username",
            title: "Username",
            sortable: true,
        },
        {
            name: "outgoing_rule",
            title: "Outgoing Rule",
            sortable: true,
        },
        {
            name: "tenant_role_name",
            title: "Role",
            sortable: true,
            action: (row: any) => {
                return (
                    <div>
                        <span
                            className="cursor-pointer"
                            onClick={() => {
                                if (!!row?.disabled) return;
                                router.push(`/tenant-roles/${row?.role_uuid}`);
                            }}
                        >
                            {row.tenant_role_name}
                        </span>
                    </div>
                );
            },
        },
        {
            name: "country_name",
            title: "Country",
            sortable: true,
        },
        { name: "domain", title: "Domain", sortable: true },
        {
            name: "assign_did",
            title: "Assign DID",
            action: (row: any) => {
                return (
                    <>
                        <div className="flex items-center justify-center">
                            <Icon
                                name="Arrange"
                                className={`${!!row?.disabled ? "opacity-50" : "cursor-pointer"
                                    }`}
                                height={24}
                                width={24}
                                alt="iconArrangeSquare"
                                onClick={() => {
                                    if (!!row?.disabled) return;
                                    router.push(`/tenants/assign-did/${row?.uuid}`);
                                }}
                            />
                        </div>
                    </>
                );
            },
        },
        {
            name: "personalization",
            title: "Personalization",
            action: (row: any) => {
                return (
                    <>
                        <div className="flex items-center justify-center">
                            <Icon
                                name="Edit"
                                className={`${!!row?.disabled ? "opacity-50" : "cursor-pointer"
                                    }`}
                                height={24}
                                width={24}
                                alt="iconEditSquare"
                                onClick={() => {
                                    if (!!row?.disabled) return;
                                    router.push(`/tenants/personalization/${row?.uuid}`);
                                }}
                            />
                        </div>
                    </>
                );
            },
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
        onGetCountryOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {
        if (filter?.isAdvance) {
            onSearchData();
        } else {
            onGetData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    // Fetching Country Options
    const onGetCountryOptions = () => {
        try {
            dispatch(countryOptionsGet()).unwrap();
        } catch (e: any) {
            console.error("Get Country Options Err --->", e?.message);
        }
    };

    // Fetching Tenant Data
    const onGetData = useDebouncedCallback(async () => {
        setLoading(true);
        try {
            const params = { ...filter };
            delete params["isAdvance"];
            await dispatch(tenantGet(params)).unwrap();
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Get Tenant Error --->", e.message);
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

    // Advance Search - Fetching Tenant Data
    const onSearchData = async () => {
        setLoading(true);
        try {
            const payload = {
                [data["tenant_name"]["key"]]: data["tenant_name"]["val"],
                [data["username"]["key"]]: data["username"]["val"],
                [data["email"]["key"]]: data["email"]["val"],
                [data["country_uuid"]["key"]]: data["country_uuid"]["val"],
                [data["domain"]["key"]]: data["domain"]["val"],
                status: status,
            };
            Object.entries(payload)?.forEach(([key, val]: any) => {
                if (!val) {
                    delete payload[key];
                }
            });
            await dispatch(tenantSearch(payload)).unwrap();
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Search data Err --->", e.message);
        }
    };

    // Advance Search Fields Empty & Fetching Tenant Data
    const onEmptySearch = () => {
        setData(initialValues);
        setFilter({
            ...filter,
            page: 1,
            limit: 10,
            isAdvance: false,
        });
    };

    // Navigate to Create Tenant Page
    const onCreateTenant = () => router.push("/tenants/create");

    // Navigate to Edit Tenant Page
    const onEditClick = (data: any) => router.push("/tenants/" + data?.uuid);

    // Update Tenant Status & Fetching Tenant Data
    const onUpdateStatus = async (val: any) => {
        setLoading(true);
        try {
            const payload = {
                status: val.status === "1" ? "0" : "1",
                id: val.uuid,
            };
            const res: any = await dispatch(tenantStatusUpdate(payload)).unwrap();
            if (res.statusCode === 200) {
                setFilter({ ...filter });
                Success(res.data);
            } else {
                Danger(res?.data);
            }
        } catch (e: any) {
            setLoading(false);
            console.error("Update Tenant Status Err --->", e?.message);
        }
    };

    // Deleting Selected Tenant & Fetching Tenant Data
    const onDeleteTenant = async (id: string) => {
        setLoading(true);
        try {
            await dispatch(tenantDelete(id)).unwrap();
            const ids = deleteId.split(",");
            setDeleteId("");
            setFilter({
                ...filter,
                page:
                    ids?.length === tenantData?.data?.length && filter?.page > 1
                        ? filter?.page - 1
                        : filter?.page,
            });
            setSelectedRow([]);
            Success("Successfully Deleted");
        } catch (e: any) {
            setLoading(false);
            setDeleteId("");
            Danger("");
            console.error("Delete Tenant Status Err --->", e?.message);
        }
    };

    // Mass Delete Click - Open Delete Modal
    const onMassDeleteTenant = () => {
        const selectedRows = [...selectedRow];
        setDeleteId(selectedRows.join(","));
    };

    return (
        <div className="bg-white p-5 rounded-[25px]">
            <Head
                createText="Create Tenant"
                search={filter?.search}
                onCreateClick={onCreateTenant}
                onDeleteClick={onMassDeleteTenant}
                onChange={(e: any) =>
                    setFilter({
                        ...filter,
                        page: 1,
                        limit: 10,
                        search: e.target.value,
                        isAdvance: false,
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
                    name="tenant_name"
                    label="Name"
                    placeholder="Enter First name"
                    value={data.tenant_name.val}
                    dropdownValue={data.tenant_name.dropdown}
                    options={advanceSearchOptions}
                    onChange={(e: any) => handleChnage("tenant_name", e.target.value)}
                    onDropdownChange={(e: any) =>
                        handleSelect("tenant_name", e.target.value)
                    }
                    isInfo
                />
                <InputSelect
                    name="username"
                    label="Username"
                    placeholder="Enter Username"
                    value={data.username.val}
                    dropdownValue={data.username.dropdown}
                    options={advanceSearchOptions}
                    onChange={(e: any) => handleChnage("username", e.target.value)}
                    onDropdownChange={(e: any) =>
                        handleSelect("username", e.target.value)
                    }
                    isInfo
                    noSpace
                />
                <InputSelect
                    name="email"
                    label="Email"
                    placeholder="Enter email"
                    value={data.email.val}
                    dropdownValue={data.email.dropdown}
                    options={advanceSearchOptions}
                    onChange={(e: any) => handleChnage("email", e.target.value)}
                    onDropdownChange={(e: any) => handleSelect("email", e.target.value)}
                    isInfo
                />
                <Select
                    name="country_uuid"
                    label="Country"
                    placeholder="Select Country"
                    value={data.country_uuid.val}
                    options={countryOptions}
                    removable
                    onChange={(e: any) => handleChnage("country_uuid", e.target.value)}
                    isInfo
                />
                <InputSelect
                    name="domain"
                    label="Domain"
                    placeholder="https://"
                    value={data.domain.val}
                    dropdownValue={data.domain.dropdown}
                    options={advanceSearchOptions}
                    onChange={(e: any) => handleChnage("domain", e.target.value)}
                    onDropdownChange={(e: any) => handleSelect("domain", e.target.value)}
                    isInfo
                />
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
                    isLoading={loading}
                    title="Tenant"
                    navigate="/tenants/create"
                    columns={columns}
                    data={tenantData?.data?.length ? tenantData.data : []}
                    page={filter.page}
                    totalCount={tenantData?.count || 0}
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
                onDoneClick={() => onDeleteTenant(deleteId)}
            />
        </div>
    );
};

export default Tenant;
