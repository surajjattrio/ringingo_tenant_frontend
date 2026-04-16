"use client";
import { useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";

// PROJECT IMPORTS
import {
    useTenantTrunkData,
    tenantTrunkGet,
    tenantTrunkSearch,
    tenantTrunkStatusUpdate,
    tenantTrunkDelete,
} from "@/redux/slice/tenant-admin/tenantTrunkSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { InputSelect, Switch } from "@/components/forms";
import { Head, Table } from "@/components/ui-components";
import { DeleteModal } from "@/components/modals";

// TYPES
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";
import { TenantTrunkAdvancedFilterTypes } from "@/types/advancedFilterTypes";

// THIRD - PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";

// OPTIONS IMPORT
import { advanceSearchOptions } from "@/config/options";
import { ManagerPageTypes } from "@/types/formTypes";

// NAME STATE
const initialValues: TenantTrunkAdvancedFilterTypes = {
    name: { key: "name|1", val: "", dropdown: "1" },
    domain: { key: "domain|1", val: "", dropdown: "1" },
};

/* ============================== TRUNK PAGE ============================== */

const SipTrunk = (props: ManagerPageTypes) => {
    const { managerName = null, name = null } = props;
    const dispatch = useAppDispatch();
    const router = useRouter();
    const trunkData = useTenantTrunkData();

    const [loading, setLoading] = useState<boolean>(true);
    const [status, setStatus] = useState<string>("0");
    const [register, setRegister] = useState<string>("0");
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
        // {
        //     name: "name",
        //     title: "Name",
        //     sortable: true,
        // },
        {
            name: "name",
            title: "Name",
            sortable: true,
            action: (row: any) => {
                const active = row?.register_flag === "0";
                const title = row?.name;
                return (
                    <>
                        <div className="flex gap-2 items-center">
                            <span
                                className={`rounded-full h-[10px] w-[10px] ${active ? "bg-primary-success" : "bg-error"
                                    }`}
                            ></span>
                            <span>{title}</span>
                        </div>
                    </>
                );
            },
        },
        {
            name: "domain",
            title: "Domain",
            sortable: true,
        },
        {
            name: "register",
            title: "Register",
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

    // Fetching enantT Data
    const onGetData = useDebouncedCallback(async () => {
        setLoading(true);
        try {
            const params = { ...filter };
            delete params["isAdvance"];
            await dispatch(tenantTrunkGet(params)).unwrap();
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Get Trunk Error --->", e.message);
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

    // Advance Search - Fetching Trunk Data
    const onSearchData = async () => {
        setLoading(true);
        try {
            const payload = {
                [data["name"]["key"]]: data["name"]["val"],
                [data["domain"]["key"]]: data["domain"]["val"],
                status: status,
                register: register,
            };
            Object.entries(payload)?.forEach(([key, val]: any) => {
                if (!val) {
                    delete payload[key];
                }
            });
            await dispatch(tenantTrunkSearch(payload)).unwrap();
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Search data Err --->", e.message);
        }
    };

    // Advance Search Fields Empty & Fetching Trunk Data
    const onEmptySearch = () => {
        setData(initialValues);
        setFilter({
            ...filter,
            page: 1,
            limit: 10,
            isAdvance: false,
        });
    };

    // Navigate to Create Trunk Page
    const onCreateTenantTrunk = () => router.push(managerName ? "/manager-sip-trunk/create" : "/tenant-sip-trunk/create");

    // Navigate to Edit Trunk Page
    const onEditClick = async (data: any) =>
        router.push(managerName ? "/manager-sip-trunk/" + data?.uuid : "/tenant-sip-trunk/" + data?.uuid);

    // Update Trunk Status & Fetching Trunk Data
    const onUpdateStatus = async (val: any) => {
        setLoading(true);
        try {
            const payload = {
                status: val.status === "1" ? "0" : "1",
                id: val.uuid,
            };
            const res: any = await dispatch(
                tenantTrunkStatusUpdate(payload)
            ).unwrap();
            if (res.statusCode === 200) {
                setFilter({ ...filter });
                Success(res.data);
            } else {
                Danger(res?.data);
            }
        } catch (e: any) {
            setLoading(false);
            console.error("Update Trunk Status Err --->", e?.message);
        }
    };

    // Deleting Selected Trunk & Fetching Trunk Data
    const onDeleteTenantTrunk = async (id: any) => {
        setLoading(true);
        try {
            await dispatch(tenantTrunkDelete(id)).unwrap();
            const ids = deleteId.split(",");
            setDeleteId("");
            setFilter({
                ...filter,
                page:
                    ids?.length === trunkData?.data?.length && filter?.page > 1
                        ? filter?.page - 1
                        : filter?.page,
            });
            setSelectedRow([]);
            Success("Successfully Deleted");
        } catch (e: any) {
            setLoading(false);
            setDeleteId("");
            Danger("");
            console.error("Delete Trunk Status Err --->", e?.message);
        }
    };

    // Mass Delete Click - Open Delete Modal
    const onMassDeleteTenantTrunk = () => {
        const selectedRows = [...selectedRow];
        setDeleteId(selectedRows.join(","));
    };

    return (
        <div className="bg-white p-5 rounded-[25px]">
            <Head
                name={name}
                managerName={managerName}
                length={trunkData?.count}
                createText="Create SIP Trunk"
                search={filter?.search}
                onCreateClick={onCreateTenantTrunk}
                onDeleteClick={onMassDeleteTenantTrunk}
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
                    noSpace
                    isInfo
                />
                <InputSelect
                    name="domain"
                    label="Domain"
                    placeholder="Enter Domain"
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
                    label="Register"
                    trueName="Yes"
                    falseName="No"
                    value={register}
                    onClick={(value: string) => setRegister(value)}
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
                    title="Trunk"
                    name={name}
                    managerName={managerName}
                    navigate={managerName ? "/manager-sip-trunk/create" : "/tenant-sip-trunk/create"}
                    columns={columns}
                    data={trunkData?.data?.length ? trunkData.data : []}
                    page={filter.page}
                    totalCount={trunkData?.count || 0}
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
                onDoneClick={() => onDeleteTenantTrunk(deleteId)}
            />
        </div>
    );
};

export default SipTrunk;
