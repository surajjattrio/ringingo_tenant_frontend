"use client";
import { useLayoutEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

// PROJECT IMPORT
import {
    telecomCircleDelete,
    telecomCircleSearch,
    telecomCircleAllGet,
    telecomCircleGet,
    updateSingleTelecomCircleData,
    //useAllTelecomCircle,
    telecomCircleStatusUpdate,
    useTelecomCircle,
    telecomCircleAllSearch,
} from "@/redux/slice/tenant-admin/telecomCircleSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { InputSelect, Select, Switch, Toggle } from "@/components/forms";
import { Head, Table, Icon } from "@/components/ui-components";
import { DeleteModal } from "@/components/modals";

// THIRD-PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";

// TYPES IMPORT
import { TelecomCircleFilterTypes } from "@/types/advancedFilterTypes";
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";

// OPTIONS IMPORT
import { advanceSearchOptions, timeoutOptions2 } from "@/config/options";
import { ManagerPageTypes } from "@/types/formTypes";

// DATA
const headers: any = [
    { label: "Name", key: "name" },
    { label: "Prefix", key: "prefix" },
    { label: "Status", key: "status" },
];

// NAME STATE
const initialValues: TelecomCircleFilterTypes = {
    name: { key: "name|1", val: "", dropdown: "1" },
    prefix: { key: "prefix|4", val: "", dropdown: "4" },
    status: { key: "status|1", val: "", dropdown: "1" },
};

const TelecomCircle = (props: ManagerPageTypes) => {
    const { managerName = null, name = null } = props;
    const dispatch = useAppDispatch();
    const router = useRouter();
    const telecomCircle = useTelecomCircle();
    //  const allTelecomCircle = useAllTelecomCircle();

    const [csvLoading, setCsvLoading] = useState<boolean>(false);
    const [isCsvDownload, setIsCsvDownload] = useState<boolean>(false);
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
    const pathname = usePathname();
    let isPathname = pathname?.split("-")?.[0] === "/manager";

    const columns: ColumnsType[] = [
        {
            name: "name",
            title: "Circle Name",
            sortable: true,
        },
        {
            name: "prefix",
            title: "Prefix",
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
                                onUpdateTelecomCircleStatus(row);
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

    // Preapring Data for Export File
    const prepareExportProps = () => {
        const data = telecomCircle?.data || [];
        return { headers, data, filename: "TelecomCircle.csv" };
    };

    // Fetching Telecom Circle Data
    const onGetData = useDebouncedCallback(async () => {
        setLoading(true);
        try {
            const params = { ...filter };
            delete params["isAdvance"];
            await dispatch(telecomCircleGet(params)).unwrap();
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.error("Get Telecom Circle Err =-=>", err);
        }
    }, 500);

    // Fetching All Telecom Circle Data
    const onGetAllTelecomCircle = async () => {
        setCsvLoading(true);
        try {
            if (filter?.isAdvance) {
                const payload = {
                    [data["name"]["key"]]: data["name"]["val"],
                    [data["prefix"]["key"]]: data["prefix"]["val"],
                    status,
                    page: filter?.page,
                    limit: telecomCircle?.count || 0,
                };
                Object.entries(payload)?.forEach(([key, val]: any) => {
                    if (!val) {
                        delete payload[key];
                    }
                });
                await dispatch(telecomCircleAllSearch(payload)).unwrap();
                setCsvLoading(false);
                setIsCsvDownload(true);
            } else {
                const params = { ...filter };
                params["limit"] = telecomCircle?.count || 0;
                delete params["isAdvance"];
                await dispatch(telecomCircleAllGet(params)).unwrap();
                setCsvLoading(false);
                setIsCsvDownload(true);
            }
        } catch (err: any) {
            console.error("Get All Telecom Circle Err =-=>", err);
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

    // Advance Search - Fetching Telecom Circle Data
    const onSearchData = async () => {
        setLoading(true);
        try {
            const payload = {
                [data["name"]["key"]]: data["name"]["val"],
                [data["prefix"]["key"]]: data["prefix"]["val"],
                status,
            };
            Object.entries(payload)?.forEach(([key, val]: any) => {
                if (!val) {
                    delete payload[key];
                }
            });
            await dispatch(telecomCircleSearch(payload)).unwrap();
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Search data Err --->", e.message);
        }
    };

    // Advance Search Fields Empty & Fetching Telecom Circle Data
    const onEmptySearch = () => {
        setData(initialValues);
        setFilter({
            ...filter,
            page: 1,
            limit: 10,
            isAdvance: false,
        });
    };

    // Navigate to Create Telecom Circle Page
    const onCreateTelecomCircle = () =>
        router.push(isPathname ? "/manager-telecomcircle/create" : "/tenant-telecomcircle/create");

    // Store Single Telecom Circle Data in Redux & Navigate to Update Telecom Circle Page
    const onEditClick = (data: any) => {
        try {
            dispatch(updateSingleTelecomCircleData(data));
            router.push(
                isPathname ? "/manager-telecomcircle/" + data?.uuid : "/tenant-telecomcircle/" + data?.uuid
            );
        } catch (err) {
            console.error("Store Single Telecom Circle Err =-=>", err);
        }
    };


    // Update Dnc Status & Fetching Dnc Data
    const onUpdateTelecomCircleStatus = async (data: any) => {
        setLoading(true);
        try {
            const payload = {
                id: data?.uuid,
                status: data?.status === "0" ? "1" : "0",
            };
            const res: any = await dispatch(telecomCircleStatusUpdate(payload)).unwrap();
            if (res?.statusCode === 200) {
                Success(res?.data);
                setFilter({ ...filter });
            } else {
                Danger(res?.data);
            }
        }
        catch (err) {
            setLoading(false);
            console.error("Update Break Code Status Err =-=>", err);
        }

    };


    // Deleting Selected Telecom Circle & Fetching Telecom Circle Data
    const onDeleteTelecomCircle = async (id: string) => {
        setLoading(true);
        try {
            await dispatch(telecomCircleDelete(id)).unwrap();
            const ids = deleteId.split(",");
            setDeleteId("");
            setFilter({
                ...filter,
                page:
                    ids?.length === telecomCircle?.data?.length && filter?.page > 1
                        ? filter?.page - 1
                        : filter?.page,
            });
            setSelectedRow([]);
            Success("Successfully Deleted");
        } catch (e: any) {
            setLoading(false);
            setDeleteId("");
            Danger("");
            console.error("Delete Telecom Circle Err --->", e?.message);
        }
    };

    // Mass Delete Click - Open Delete Modal
    const onMassDeleteTelecomCircle = () => {
        const selectedRows = [...selectedRow];
        setDeleteId(selectedRows.join(","));
    };

    return (
        <div className="bg-white p-5 rounded-[25px]">
            <Head
                name={name}
                managerName={managerName}
                length={telecomCircle?.count || 0}
                // csvProps={prepareExportProps()}
                csvloader={csvLoading}
                isCsvDownload={isCsvDownload}
                setIsCsvDownload={setIsCsvDownload}
                onCsvClick={() => onGetAllTelecomCircle()}
                createText="Create Telecom Circle"
                search={filter?.search}
                onCreateClick={onCreateTelecomCircle}
                onDeleteClick={onMassDeleteTelecomCircle}
                onImportClick={() =>
                    router.push(managerName ? "manager-telecomcircle/import" : "tenant-telecomcircle/import")
                }
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
                    label="Circle Name"
                    placeholder="Enter Circle Name"
                    value={data.name.val}
                    dropdownValue={data.name.dropdown}
                    options={advanceSearchOptions}
                    onChange={(e: any) => handleChnage("name", e.target.value)}
                    onDropdownChange={(e: any) => handleSelect("name", e.target.value)}
                    isInfo
                />
                <InputSelect
                    name="prefix"
                    label="Prefix"
                    placeholder="Enter Prefix"
                    value={data.prefix.val}
                    dropdownValue={data.prefix.dropdown}
                    options={advanceSearchOptions}
                    onChange={(e: any) => handleChnage("prefix", e.target.value)}
                    onDropdownChange={(e: any) => handleSelect("prefix", e.target.value)}
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
                    title="Telecom Circle"
                    name={name}
                    managerName={managerName}
                    navigate={managerName ? "/manager-telecomcircle/create" : "/tenant-telecomcircle/create"}
                    columns={columns}
                    data={telecomCircle?.data?.length ? telecomCircle.data : []}
                    page={filter.page}
                    totalCount={telecomCircle?.count || 0}
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
                    // onUpdateTelecomCircleStatus={onUpdateTelecomCircleStatus}
                    onRefresh={() => setFilter({ ...filter })}
                />
            </div>
            <DeleteModal
                loading={loading}
                visible={!!deleteId}
                onCancelClick={() => setDeleteId("")}
                onDoneClick={() => onDeleteTelecomCircle(deleteId)}
            />
        </div>
    );
};

export default TelecomCircle;
