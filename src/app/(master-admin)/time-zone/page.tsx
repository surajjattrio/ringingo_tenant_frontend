"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

//PROJECT IMPORT
import { useAppDispatch } from "@/redux/hooks";
import {
    timezoneDelete,
    timezoneGet,
    timezoneSingleGet,
    timezoneSearch,
    timezoneStatusUpdate,
    useIsLoading,
    useTimezoneData,
} from "@/redux/slice/master-admin/timezoneSlice";
import {
    countryOptionsGet,
    useCountryOptions,
} from "@/redux/slice/master-admin/countrySlice";
import { Danger, Success } from "@/redux/services/toasterServices";
import { InputSelect, Select } from "@/components/forms";
import { Head, Table } from "@/components/ui-components";
import { DeleteModal } from "@/components/modals";
import { SEARCH_ERROR_MESSAGE } from "@/config/constant";

// THIRD - PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";

// TYPES
import { ColumnsType } from "@/types/tableTypes";
import { TimezoneAdvancedFilterTypes } from "@/types/advancedFilterTypes";
import { FilterTypes } from "@/types/filterTypes";

//OPTIONS IMPORT
import { advanceSearchOptions } from "@/config/options";

// NAME STATE
const initialValues: TimezoneAdvancedFilterTypes = {
    timezone_name: { key: "timezone_name|1", val: "", dropdown: "1" },
    gmtoffset: { key: "gmtoffset|1", val: "", dropdown: "1" },
    gmttime: { key: "gmttime|1", val: "", dropdown: "1" },
    country_uuid: { key: "country_uuid|1", val: "", dropdown: "4" },
};
/* ============================== TIMEZONE PAGE ============================== */

const Timezone = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const timezoneData = useTimezoneData();
    const countryOptions = useCountryOptions();
    const isLoading = useIsLoading();

    // const [status, setStatus] = useState<string>("0");

    const [loading, setLoading] = useState<boolean>(true);
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
            name: "timezone_name",
            title: "Timezone Name",
            sortable: true,
        },
        { name: "gmtoffset", title: "GMT Offset", sortable: true },
        {
            name: "gmttime",
            title: "GMT Time",
            sortable: true,
        },
        {
            name: "country_name",
            title: "Country",
            sortable: true,
            action: (row: any) => {
                const name =
                    row?.country?.length && row?.country[0]?.country
                        ? row?.country[0]?.country
                        : "";
                return (
                    <>
                        <span>{name}</span>
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

    // Fetching Timezone Data
    const onGetData = useDebouncedCallback(async () => {
        setLoading(true);
        try {
            const params = { ...filter };
            delete params["isAdvance"];
            await dispatch(timezoneGet(params)).unwrap();
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Get Timezone Error --->", e.message);
        }
    }, 500);

    // Advance Search - Trigger when left side Input or Select value change
    const handleChnage = (key: string, val: string) => {
        setData({
            ...data,
            [key]: { ...data[key], val },
        });
    };

    // Advance Search - Trigger when right side Select value change
    const handleSelect = (key: string, val: string) => {
        setData({
            ...data,
            [key]: { ...data[key], key: `${key}|${val}`, dropdown: val },
        });
    };

    // Advance Search - Fetching Timezone Data
    const onSearchData = async () => {
        if (
            !(
                data["timezone_name"]["val"] ||
                data["gmtoffset"]["val"] ||
                data["gmttime"]["val"] ||
                data["country_uuid"]["val"]
            )
        ) {
            Danger(SEARCH_ERROR_MESSAGE);
            return false;
        }
        try {
            const payload = {
                [data["timezone_name"]["key"]]: data["timezone_name"]["val"],
                [data["gmtoffset"]["key"]]: data["gmtoffset"]["val"],
                [data["gmttime"]["key"]]: data["gmttime"]["val"],
                [data["country_uuid"]["key"]]: data["country_uuid"]["val"],
            };
            Object.entries(payload)?.forEach(([key, val]: any) => {
                if (!val) {
                    delete payload[key];
                }
            });
            await dispatch(timezoneSearch(payload)).unwrap();
        } catch (e: any) {
            console.error("Search data Err --->", e.message);
        }
    };

    // Cancel Click - Advance Search Fields Empty & Fetching Timezone Data
    const onEmptySearch = () => {
        setData(initialValues);
        setFilter({
            ...filter,
            page: 1,
            limit: 10,
            isAdvance: false,
        });
        onGetData();
    };

    // Navigate to Create Timezone Page
    const onCreateTimezone = () => router.push("/time-zone/create");

    // Navigate to Edit Timezone Page
    const onEditClick = (data: any) => router.push("/time-zone/" + data?.uuid);

    // Update Timezone Status & Fetching Timezone Data
    const onUpdateTimezoneStatus = async (val: any) => {
        try {
            const payload = {
                status: val.status === "1" ? "0" : "1",
                id: val.uuid,
            };
            const res: any = await dispatch(timezoneStatusUpdate(payload)).unwrap();
            if (res.statusCode === 200) {
                onGetData();
                setFilter({ ...filter });
                Success(res.data);
            } else {
                Danger(res?.data);
            }
        } catch (e: any) {
            console.error("Update Timezone Status Err --->", e?.message);
        }
    };

    // Deleting Selected Timezone & Fetching Timezone Data
    const onDeleteTimezone = async (id: string) => {
        setLoading(true);
        try {
            await dispatch(timezoneDelete(id)).unwrap();
            const ids = deleteId.split(",");
            setDeleteId("");
            setFilter({
                ...filter,
                page:
                    ids?.length === timezoneData?.data?.length && filter?.page > 0
                        ? filter?.page - 1
                        : filter?.page,
            });
            setSelectedRow([]);
            Success("Successfully Deleted");
        } catch (e: any) {
            setLoading(false);
            setDeleteId("");
            Danger("");
            console.error("Delete Timezone Status Err --->", e?.message);
        }
    };

    // Mass Delete Click - Open Delete Modal
    const onMassDeleteTimezone = () => {
        const selectedRows = [...selectedRow];
        setDeleteId(selectedRows.join(","));
    };

    return (
        <div className="bg-white p-5 rounded-[25px]">
            <Head
                createText="Create Timezone"
                //search={filter?.search}
                onCreateClick={onCreateTimezone}
                onDeleteClick={onMassDeleteTimezone}
                onChange={(e: any) =>
                    setFilter({
                        page: 1,
                        limit: 10,
                        search: e.target.value,
                        isAdvance: false,
                    })
                }
                //  onFilterClick={() => setFilterOpen(!filterOpen)}
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
                    name="timezone_name"
                    label="Timezone Name"
                    placeholder="Enter Timezone name"
                    value={data.timezone_name.val}
                    dropdownValue={data.timezone_name.dropdown}
                    options={advanceSearchOptions}
                    onChange={(e: any) => handleChnage("timezone_name", e.target.value)}
                    onDropdownChange={(e: any) =>
                        handleSelect("timezone_name", e.target.value)
                    }
                    isInfo
                />
                <InputSelect
                    name="gmtoffset"
                    label="GMT Offset"
                    placeholder="Enter GMToffset"
                    value={data.gmtoffset.val}
                    dropdownValue={data.gmtoffset.dropdown}
                    options={advanceSearchOptions}
                    onChange={(e: any) => handleChnage("gmtoffset", e.target.value)}
                    onDropdownChange={(e: any) =>
                        handleSelect("gmtoffset", e.target.value)
                    }
                    isInfo
                />
                <InputSelect
                    name="gmttime"
                    label="GMT Time"
                    placeholder="Enter GMTtime"
                    value={data.gmttime.val}
                    dropdownValue={data.gmttime.dropdown}
                    options={advanceSearchOptions}
                    onChange={(e: any) => handleChnage("gmttime", e.target.value)}
                    onDropdownChange={(e: any) => handleSelect("gmttime", e.target.value)}
                    isInfo
                />
                <Select
                    name="country_uuid"
                    label="Country"
                    placeholder="Select Country"
                    removable
                    value={data.country_uuid.val}
                    options={countryOptions}
                    onChange={(e: any) => handleChnage("country_uuid", e.target.value)}
                    isInfo
                />
            </Head>

            <div className="mt-5">
                <Table
                    isLoading={isLoading}
                    title="Timezone"
                    name="time-zone"
                    navigate="/time-zone/create"
                    columns={columns}
                    data={timezoneData?.data?.length ? timezoneData.data : []}
                    page={filter.page}
                    totalCount={timezoneData?.count || 0}
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
                visible={!!deleteId}
                onCancelClick={() => setDeleteId("")}
                onDoneClick={() => onDeleteTimezone(deleteId)}
            />
        </div>
    );
};

export default Timezone;
