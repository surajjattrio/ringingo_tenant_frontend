"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// PROJECT IMPORT
import {
    updateSingleDispositionData,
    useIsLoading,
    // useDisposition,
    dispositionDelete,
    dispositionGet,
    dispositionSearch,
    dispositionStatusUpdate,
    useDispositionData,
} from "@/redux/slice/master-admin/dispositionSlice";
import {
    dispositionOptionsGet,
} from "@/redux/slice/master-admin/dispositionSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { InputSelect, Switch, Toggle } from "@/components/forms";
import { Head, Table } from "@/components/ui-components";
import { DeleteModal } from "@/components/modals";

// THIRD-PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";

// TYPES IMPORT
import { DispositionFilterTypes } from "@/types/advancedFilterTypes";
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";

// OPTIONS IMPORT
import { advanceSearchOptions } from "@/config/options";

// NAME STATE
const initialValues: DispositionFilterTypes = {
    name: { key: "name|1", val: "", dropdown: "1" },
    code: { key: "code|1", val: "", dropdown: "1" },
};

/* ============================== DISPOSITION PAGE ============================== */

const Disposition = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const isLoading = useIsLoading();
    const dispositionData = useDispositionData();

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
            title: "Name",
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

    useEffect(() => {
        onGetDispositionOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (filter?.isAdvance) {
            onSearchData();
        } else {
            onGetDispositionData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    // Fetching disposition Options
    const onGetDispositionOptions = async () => {
        try {
            await dispatch(dispositionOptionsGet()).unwrap();
        } catch (err) {
            console.error("Get Disposition Options Err =-=>", err);
        }
    };

    // Fetching Disposition Data
    const onGetDispositionData = useDebouncedCallback(async () => {
        setLoading(true);
        try {
            const params = { ...filter };
            delete params["isAdvance"];
            await dispatch(dispositionGet(params)).unwrap();
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
            const val = {
                [data["name"]["key"]]: data["name"]["val"],
                [data["code"]["key"]]: data["code"]["val"],
                status: status,
            };
            Object.entries(val)?.forEach(([key, val]: any) => {
                if (!val) {
                    delete val[key];
                }
            });
            await dispatch(dispositionSearch(val)).unwrap();
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
    const onCreateDisposition = () => router.push("/system-disposition/create");

    // Navigate to Edit Disposition Page
    //  const onEditClick = (data: any) => router.push("/system-disposition/" + data?.uuid);

    // Store Single Disposition Data in Redux & Navigate to Update Disposition Page
    const onEditClick = (data: any) => {
        try {
            dispatch(updateSingleDispositionData(data));
            router.push("/system-disposition/" + data?.disposition_uuid);
        } catch (err) {
            console.error("Store Single Disposition Err =-=>", err);
        }
    };

    // Update Disposition Status & Fetching Disposition Data
    const onUpdateDispositionStatus = async (data: any) => {
        try {
            const payload = {
                id: data?.uuid,
                status: data?.status === "0" ? "1" : "0",
            };
            const res: any = await dispatch(
                dispositionStatusUpdate(payload)
            ).unwrap();
            if (res?.statusCode === 200) {
                setFilter({ ...filter });
                Success(res?.data);
                //onGetDispositionData();
            } else {
                Danger(res?.data);
            }
        } catch (err) {
            console.error("Update Disposition Status Err =-=>", err);
        }
    };

    // Deleting Selected Disposition & Fetching Disposition Data
    const onDeleteDisposition = async (id: string) => {
        setLoading(true);
        try {
            await dispatch(dispositionDelete(id)).unwrap();
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
                name="disposition"
                length={dispositionData?.count}
                createText="Create System Dispositions"
                onCreateClick={onCreateDisposition}
                onDeleteClick={onMassDeleteDisposition}
                onChange={(e: any) =>
                    setFilter({
                        page: 1,
                        limit: 10,
                        search: e.target.value,
                        isAdvance: false,
                    })
                }
                // onFilterClick={() => setFilterOpen(!filterOpen)}
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
                    isLoading={isLoading}
                    title="System Dispositions"
                    name="disposition"
                    navigate="/system-disposition/create"
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

export default Disposition;
