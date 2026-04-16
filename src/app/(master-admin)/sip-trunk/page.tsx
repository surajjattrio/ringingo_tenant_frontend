"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";

// PROJECT IMPORTS
import {
    trunkDelete,
    trunkGet,
    trunkSearch,
    trunkStatusUpdate,
    useTrunkData,
} from "@/redux/slice/master-admin/trunkSlice";
import { useAppDispatch } from "@/redux/hooks";
import {
    sipProfileOptionsGet,
    useSipProfileOptions,
} from "@/redux/slice/master-admin/sipProfileSlice";
import { Danger, Success } from "@/redux/services/toasterServices";
import { InputSelect, Select, Switch } from "@/components/forms";
import { Head, Table } from "@/components/ui-components";
import { DeleteModal } from "@/components/modals";

// TYPES IMPORT
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";
import { TrunkAdvancedFilterTypes } from "@/types/advancedFilterTypes";

// THIRD - PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";

// OPTIONS IMPORT
import { advanceSearchOptions } from "@/config/options";

// NAME STATE
const initialValues: TrunkAdvancedFilterTypes = {
    name: { key: "name|1", val: "", dropdown: "1" },
    sip_profile_uuid: { key: "sip_profile_uuid|4", val: "", dropdown: "4" },
    domain: { key: "domain|1", val: "", dropdown: "1" },
};

/* ============================== TRUNK PAGE ============================== */

const Trunk = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const trunkData = useTrunkData();
    const sipProfileOptions = useSipProfileOptions();

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
            name: "sip_profile_name",
            title: "SIP Profile",
            sortable: true,
        },
        {
            name: "domain",
            title: "Domain",
            sortable: true,
        },
        // {
        //     name: "assign_trunk",
        //     title: "Assign Trunk",
        //     action: (row: any) => {
        //         return (
        //             <>
        //                 <div className="flex items-center justify-center">
        //                     <Icon
        //                         className={`${!!row?.disabled ? "opacity-50" : "cursor-pointer"
        //                             }`}
        //                         height={24}
        //                         width={24}
        //                         alt="iconArrangeSquare"
        //                         onClick={() => {
        //                             if (!!row?.disabled) return;
        //                             router.push(`/sip-trunk/assign/${row?.uuid}`);
        //                         }}
        //                     />
        //                 </div>
        //             </>
        //         );
        //     },
        // },
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
        onGetSipProfileOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetching SIP Profile Options
    const onGetSipProfileOptions = async () => {
        try {
            dispatch(sipProfileOptionsGet()).unwrap();
        } catch (e: any) {
            console.error("Get sip-profile Data Err --->", e?.message);
        }
    };

    // Fetching Trunk Data
    const onGetData = useDebouncedCallback(async () => {
        setLoading(true);
        try {
            const params = { ...filter };
            delete params["isAdvance"];
            await dispatch(trunkGet(params)).unwrap();
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
                [data["sip_profile_uuid"]["key"]]: data["sip_profile_uuid"]["val"],
                [data["domain"]["key"]]: data["domain"]["val"],
                status: status,
            };
            Object.entries(payload)?.forEach(([key, val]: any) => {
                if (!val) {
                    delete payload[key];
                }
            });
            await dispatch(trunkSearch(payload)).unwrap();
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
    const onCreateTrunk = () => router.push("/sip-trunk/create");

    // Navigate to Edit Trunk Page
    const onEditClick = async (data: any) => router.push("/sip-trunk/" + data?.uuid);

    // Update Trunk Status & Fetching Trunk Data
    const onUpdateStatus = async (val: any) => {
        setLoading(true);
        try {
            const payload = {
                status: val.status === "1" ? "0" : "1",
                id: val.uuid,
            };
            const res: any = await dispatch(trunkStatusUpdate(payload)).unwrap();
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
    const onDeleteTrunk = async (id: any) => {
        setLoading(true);
        try {
            await dispatch(trunkDelete(id)).unwrap();
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
    const onMassDeleteTrunk = () => {
        const selectedRows = [...selectedRow];
        setDeleteId(selectedRows.join(","));
    };

    return (
        <div className="bg-white p-5 rounded-[25px]">
            <Head
                createText="Create SIP Trunk"
                onCreateClick={onCreateTrunk}
                onDeleteClick={onMassDeleteTrunk}
                onChange={(e: any) =>
                    setFilter({
                        ...filter,
                        search: e.target.value,
                        page: 1,
                        limit: 10,
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
                <Select
                    name="sip_profile_uuid"
                    label="SIP Profile"
                    placeholder="Select SIP Profile"
                    value={data.sip_profile_uuid.val}
                    options={sipProfileOptions}
                    removable
                    onChange={(e: any) =>
                        handleChnage("sip_profile_uuid", e.target.value)
                    }
                    isInfo
                />
                <InputSelect
                    name="domain"
                    label="Domain"
                    placeholder="Enter domain"
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
                    title="SIP Trunks"
                    navigate="/sip-trunk/create"
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
                onDoneClick={() => onDeleteTrunk(deleteId)}
            />
        </div>
    );
};

export default Trunk;
