"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

// PROJECT IMPORT
import {

    useBreakCode,
    breakCodeGet,
    breakCodeSearch,
    updateSingleBreakCodeData,
    breakCodeStatusUpdate,
    breakCodeDelete,
} from "@/redux/slice/tenant-admin/breakCodeSlice";
import {
    useOutboundOptions,
    outboundOptionsGet,
} from "@/redux/slice/tenant-admin/outboundSlice";
import { advanceSearchOptions } from "@/config/options";
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { InputSelect, Select, Switch, Toggle } from "@/components/forms";
import { Head, Table } from "@/components/ui-components";
import { DeleteModal } from "@/components/modals";

// THIRD-PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";

// TYPES IMPORT
import { BreakCodeFilterTypes } from "@/types/advancedFilterTypes";
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";
import { ManagerPageTypes } from "@/types/formTypes";

// NAME STATE
const initialValues: BreakCodeFilterTypes = {
    name: { key: "name|1", val: "", dropdown: "1" },
    description: { key: "description|1", val: "", dropdown: "1" },
    duration: { key: "duration|1", val: "", dropdown: "1" },
    break_code: { key: "break_code|4", val: "", dropdown: "4" },
    status: { key: "status|1", val: "", dropdown: "1" },
    billable: { key: "billable|1", val: "", dropdown: "1" },
};

const BreakCode = (props: ManagerPageTypes) => {
    const { managerName = null, name = null } = props;
    const dispatch = useAppDispatch();
    const router = useRouter();
    const breakcode = useBreakCode();
    const outboundOptions = useOutboundOptions();
    const pathname = usePathname();
    let isPathname = pathname?.split("-")?.[0] === "/manager";

    const [billable, setBillable] = useState<string>("1");
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
            name: "break_code",
            title: "Break Code",
            sortable: true,
        },
        {
            name: "name",
            title: "Break Name",
            sortable: true,
        },

        {
            name: "description",
            title: "Description",
            sortable: true,
        },
        {
            name: "duration",
            title: "Duration(HH:MM)",
            sortable: true,
        },
        {
            name: "status",
            title: "Status",
            action: (row: any) => {
                return (
                    <>
                        <Toggle
                            loading={loading}
                            checked={row.status === "0"}
                            onChange={() => {
                                onUpdateBreakCodeStatus(row);
                            }}
                        />
                    </>
                );
            },
        },
        {
            name: "billable",
            title: "Billable",
            action: (row: any) => {
                const billableValue = row.billable || "1";
                return (
                    <span className={`px-2 py-1 rounded text-xs font-medium ${billableValue === "0"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                        }`}>
                        {billableValue === "0" ? "Yes" : "No"}
                    </span>
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

    useEffect(() => {
        //onGetOutboundOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    // Fetching Dnc Data
    const onGetData = useDebouncedCallback(async () => {
        setLoading(true);
        try {
            const params = { ...filter };
            delete params["isAdvance"];
            await dispatch(breakCodeGet(params)).unwrap();
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.error("Get Break Code Err =-=>", err);
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
        try {
            const payload = {
                [data["name"]["key"]]: data["name"]["val"],
                [data["description"]["key"]]: data["description"]["val"],
                [data["break_code"]["key"]]: data["break_code"]["val"],
                [data["duration"]["key"]]: data["duration"]["val"],
                status,
                billable
            };
            Object.entries(payload)?.forEach(([key, val]: any) => {
                if (!val) {
                    delete payload[key];
                }
            });
            await dispatch(breakCodeSearch(payload)).unwrap();
        } catch (e: any) {
            console.error("Search data Err --->", e.message);
        }
    };

    // Advance Search Fields Empty & Fetching Dnc Data
    const onEmptySearch = () => {
        setData(initialValues);
        setFilter({
            ...filter,
            page: 1,
            limit: 10,
            isAdvance: false,
        });
    };

    // Navigate to Create Dnc Page
    const onCreateBreakCode = () =>
        router.push(isPathname ? "/manager-breakcode/create" : "/tenant-breakcode/create");

    // Store Single Dnc Data in Redux & Navigate to Update Dnc Page
    const onEditClick = (data: any) => {
        try {
            dispatch(updateSingleBreakCodeData(data));
            router.push(
                isPathname ? "/manager-breakcode/" + data?.uuid : "/tenant-breakcode/" + data?.uuid
            );
        } catch (err) {
            console.error("Store Single Break Code Err =-=>", err);
        }
    };

    // Update Dnc Status & Fetching Dnc Data
    const onUpdateBreakCodeStatus = async (val: any) => {
        setLoading(true);
        try {
            const payload = {
                status: val.status === "1" ? "0" : "1",
                id: val.uuid,
            };
            const res: any = await dispatch(breakCodeStatusUpdate(payload)).unwrap();
            if (res.statusCode === 200) {
                setFilter({ ...filter });
                Success(res.data);
            } else {
                Danger(res?.data);
            }
        } catch (e: any) {
            setLoading(false);
            console.error("Update Break Code Status Err --->", e?.message);
        }
    };

    // Deleting Selected Dnc & Fetching Dnc Data
    const onDeleteBreakCode = async (id: string) => {
        setLoading(true);
        try {
            await dispatch(breakCodeDelete(id)).unwrap();
            const ids = deleteId.split(",");
            setDeleteId("");
            setFilter({
                ...filter,
                page:
                    ids?.length === breakcode?.data?.length && filter?.page > 1
                        ? filter?.page - 1
                        : filter?.page,
            });
            setSelectedRow([]);
            Success("Successfully Deleted");
        } catch (e: any) {
            setLoading(false);
            console.error("Delete Break Code Err --->", e?.message);
        }
    };

    // Mass Delete Click - Open Delete Modal
    const onMassDeleteBreakCode = () => {
        const selectedRows = [...selectedRow];
        setDeleteId(selectedRows.join(","));
    };

    return (
        <div className="bg-white p-5 rounded-[25px]">
            <Head
                name="breakcode"
                length={breakcode?.count || 0}
                createText="Create Break Code"
                onCreateClick={onCreateBreakCode}
                onDeleteClick={onMassDeleteBreakCode}
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
                    name="break_code"
                    label="Break Code"
                    placeholder="Enter Break Code"
                    value={data.break_code.val}
                    dropdownValue={data.break_code.dropdown}
                    options={advanceSearchOptions}
                    onChange={(e: any) => handleChnage("break_code", e.target.value)}
                    onDropdownChange={(e: any) =>
                        handleSelect("break_code", e.target.value)
                    }
                    isInfo
                />
                <InputSelect
                    name="name"
                    label="Break Name"
                    placeholder="Enter Name"
                    value={data.name.val}
                    dropdownValue={data.name.dropdown}
                    options={advanceSearchOptions}
                    onChange={(e: any) => handleChnage("name", e.target.value)}
                    onDropdownChange={(e: any) =>
                        handleSelect("name", e.target.value)
                    }
                    isInfo
                />
                <InputSelect
                    name="description"
                    label="Description"
                    placeholder="Enter Name"
                    value={data.description.val}
                    dropdownValue={data.description.dropdown}
                    options={advanceSearchOptions}
                    onChange={(e: any) => handleChnage("description", e.target.value)}
                    onDropdownChange={(e: any) =>
                        handleSelect("description", e.target.value)
                    }
                    isInfo
                />

                <InputSelect
                    name="duration"
                    label="Duration(HH:MM)"
                    placeholder="Enter Duration"
                    value={data.duration.val}
                    dropdownValue={data.duration.dropdown}
                    options={advanceSearchOptions}
                    onChange={(e: any) => handleChnage("duration", e.target.value)}
                    onDropdownChange={(e: any) =>
                        handleSelect("duration", e.target.value)
                    }
                    isInfo
                />

                <Switch
                    className="pt-[2px]"
                    label="Status"
                    value={status}
                    onClick={(value: string) => setStatus(value)}
                />

                <Switch
                    className="pt-[2px]"
                    label="Billable"
                    value={billable}
                    onClick={(value: string) => setBillable(value)}
                />
            </Head>

            <div className="mt-5">
                <Table
                    name={name}
                    managerName={managerName}
                    isLoading={loading}
                    title="Break Code"
                    navigate={managerName ? "/manager-breakcode/create" : "/tenant-breakcode/create"}
                    columns={columns}
                    data={breakcode?.data?.length ? breakcode.data : []}
                    page={filter.page}
                    totalCount={breakcode?.count || 0}
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
                    //  onUpdateDncStatus={onUpdateDncStatus}
                    onRefresh={() => setFilter({ ...filter })}
                />
            </div>
            <DeleteModal
                loading={loading}
                visible={!!deleteId}
                onCancelClick={() => setDeleteId("")}
                onDoneClick={() => onDeleteBreakCode(deleteId)}
            />
        </div>
    );
};

export default BreakCode;
