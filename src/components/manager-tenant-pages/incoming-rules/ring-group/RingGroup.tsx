"use client";
import { useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";

// PROJECT IMPORT
import {
    ringDelete,
    ringSearch,
    ringsGet,
    updateSingleRingData,
    useRings,
} from "@/redux/slice/tenant-admin/ringSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { InputSelect, Select } from "@/components/forms";
import { Head, Table } from "@/components/ui-components";
import { DeleteModal } from "@/components/modals";
import { SEARCH_ERROR_MESSAGE } from "@/config/constant";

// THIRD-PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";

// TYPES IMPORT
import { RingFilterTypes } from "@/types/advancedFilterTypes";
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";

// OPTIONS IMPORT
import {
    advanceSearchOptions,
    timeoutOptions2,
    typeOptions,
} from "@/config/options";
import { ManagerPageTypes } from "@/types/formTypes";

// NAME STATE
const initialValues: RingFilterTypes = {
    name: { key: "name|1", val: "", dropdown: "1" },
    type: { key: "type|4", val: "", dropdown: "4" },
    timeout: { key: "timeout|4", val: "", dropdown: "4" },
};

const RingGroup = (props: ManagerPageTypes) => {
    const { managerName = null, name = null } = props;
    const dispatch = useAppDispatch();
    const router = useRouter();
    const rings = useRings();

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

    const columns: ColumnsType[] = [
        {
            name: "name",
            title: "Name",
            sortable: true,
        },
        {
            name: "type",
            title: "Type",
            sortable: true,
        },
        {
            name: "timeout_value",
            title: "Timeout",
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

    // Fetching Ring Group Data
    const onGetData = useDebouncedCallback(async () => {
        setLoading(true);
        try {
            const params = { ...filter };
            delete params["isAdvance"];
            await dispatch(ringsGet(params)).unwrap();
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.error("Get Rings Err =-=>", err);
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
        if (
            !(data["name"]["val"] || data["type"]["val"] || data["timeout"]["val"])
        ) {
            Danger(SEARCH_ERROR_MESSAGE);
            return false;
        }
        setLoading(true);
        try {
            const payload = {
                [data["name"]["key"]]: data["name"]["val"],
                [data["type"]["key"]]: data["type"]["val"],
                [data["timeout"]["key"]]: data["timeout"]["val"],
            };
            Object.entries(payload)?.forEach(([key, val]: any) => {
                if (!val) {
                    delete payload[key];
                }
            });
            await dispatch(ringSearch(payload)).unwrap();
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Search data Err --->", e.message);
        }
    };

    // Search Fields Empty & Fetching Ring Group Data
    const onEmptySearch = () => {
        setData(initialValues);
        setFilter({
            ...filter,
            page: 1,
            limit: 10,
            isAdvance: false,
        });
    };

    // Navigate to Create Ring Group Page
    const onCreateRing = () =>
        router.push(
            managerName ? "/manager-ring-group/create" : "/tenant-ring-group/create"
        );

    // Store Single Ring Group Data in Redux & Navigate to Update Ring Group Page
    const onEditClick = async (data: any) => {
        try {
            await dispatch(updateSingleRingData(data));
            router.push(
                managerName
                    ? "/manager-ring-group/" + data?.uuid
                    : "/tenant-ring-group/" + data?.uuid
            );
        } catch (err) {
            console.error("Store Single Ring Err =-=>", err);
        }
    };

    // Deleting Selected Ring Group & Fetching Ring Group Data
    const onDeleteRings = async (id: string) => {
        setLoading(true);
        try {
            await dispatch(ringDelete(id)).unwrap();
            const ids = deleteId.split(",");
            setDeleteId("");
            setFilter({
                ...filter,
                page:
                    ids?.length === rings?.data?.length && filter?.page > 1
                        ? filter?.page - 1
                        : filter?.page,
            });
            setSelectedRow([]);
            Success("Successfully Deleted");
        } catch (e: any) {
            setLoading(false);
            setDeleteId("");
            Danger("");
            console.error("Delete Ring Err --->", e?.message);
        }
    };

    // Mass Delete Click - Open Delete Modal
    const onMassDeleteRings = () => {
        const selectedRows = [...selectedRow];
        setDeleteId(selectedRows.join(","));
    };

    return (
        <div className="bg-white p-5 rounded-[25px]">
            <Head
                name={name}
                managerName={managerName}
                length={rings?.count || 0}
                createText="Create Ring Group"
                onCreateClick={onCreateRing}
                onDeleteClick={onMassDeleteRings}
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
                <Select
                    name="type"
                    label="Type"
                    placeholder="Select Type"
                    removable
                    value={data.type.val}
                    options={typeOptions}
                    onChange={(e: any) => handleChnage("type", e.target.value)}
                    isInfo
                />
                <Select
                    name="timeout"
                    label="Timeout"
                    placeholder="Select Timeout"
                    removable
                    value={data.timeout.val}
                    options={timeoutOptions2}
                    onChange={(e: any) => handleChnage("timeout", e.target.value)}
                    isInfo
                />
            </Head>

            <div className="mt-5">
                <Table
                    name={name}
                    managerName={managerName}
                    isLoading={loading}
                    title="Ring group"
                    navigate={
                        managerName
                            ? "/manager-ring-group/create"
                            : "/tenant-ring-group/create"
                    }
                    columns={columns}
                    data={rings?.data?.length ? rings.data : []}
                    page={filter.page}
                    totalCount={rings?.count || 0}
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
                onDoneClick={() => onDeleteRings(deleteId)}
            />
        </div>
    );
};

export default RingGroup;
