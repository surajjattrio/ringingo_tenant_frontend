"use client";
import { useEffect, useLayoutEffect, useState } from "react";

// PROJECT IMPORT
import {
    cdrsAllGet,
    cdrsAllSearchGet,
    cdrsGet,
    cdrsSearch,
    useAllCdrs,
    useCdrs,
} from "@/redux/slice/master-admin/cdrsSlice";
import {
    tenantOptionsGet,
    useTenantOptions,
} from "@/redux/slice/master-admin/tenantSlice";
import {
    useUserOptions,
    userOptionsGet,
} from "@/redux/slice/tenant-admin/userSlice";
import { useAppDispatch } from "@/redux/hooks";
import { InputSelect, Select } from "@/components/forms";
import { DatePicker } from "@/components/pickers";
import { Head, Table } from "@/components/ui-components";
import { formatDate } from "@/helperFunctions";
import { Danger } from "@/redux/services/toasterServices";
import { SEARCH_ERROR_MESSAGE } from "@/config/constant";

// THIRD-PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";

// TYPES IMPORT
import { CdrsFilterTypes } from "@/types/advancedFilterTypes";
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";

// OPTIONS IMPORT
import {
    advanceSearchOptions,
    advanceSearchGreaterOptions,
    callModeOptions,
    callTypeOptions,
    directionOptions,
    dispositionOptions,
} from "@/config/options";

// NAME STATE
const initialValues: CdrsFilterTypes = {
    callstart: { key: "callstart", val: "", dropdown: "4" },
    callend: { key: "callend", val: "", dropdown: "4" },
    tenant_uuid: { key: "tenant_uuid|4", val: "", dropdown: "4" },
    user_uuid: { key: "user_uuid|4", val: "", dropdown: "4" },
    caller_id_name: { key: "caller_id_name|1", val: "", dropdown: "1" },
    caller_id_number: { key: "caller_id_number|1", val: "", dropdown: "1" },
    destination_number: { key: "destination_number|1", val: "", dropdown: "1" },
    billsecond: { key: "billsecond|4", val: "", dropdown: "4" },
    disposition: { key: "disposition|4", val: "", dropdown: "4" },
    call_mode: { key: "call_mode|4", val: "", dropdown: "4" },
    direction: { key: "direction|4", val: "", dropdown: "4" },
    call_type: { key: "call_type|4", val: "", dropdown: "4" },
};

// DATA
const headers: any = [
    { label: "Date", key: "callstart" },
    { label: "Tenant", key: "tenant_name" },
    { label: "User", key: "user_name" },
    { label: "Caller Id Name", key: "caller_id_name" },
    { label: "Caller Id Number", key: "caller_id_number" },
    { label: "Phone Number", key: "destination_number" },
    { label: "Duration", key: "billsecond" },
    { label: "Call Mode", key: "call_mode" },
    { label: "Hangup Cause", key: "disposition" },
    { label: "Direction", key: "direction" },
    { label: "Call Type", key: "call_type" },
];

const Cdrs = () => {
    const dispatch = useAppDispatch();
    const userOptions = useUserOptions();
    const tenantOptions = useTenantOptions();
    const cdrs = useCdrs();
    const allCdrs = useAllCdrs();
    const [loading, setLoading] = useState<boolean>(true);
    const [csvLoading, setCsvLoading] = useState<boolean>(false);
    const [isCsvDownload, setIsCsvDownload] = useState<boolean>(false);
    const [filter, setFilter] = useState<FilterTypes>({
        page: 1,
        limit: 10,
        search: "",
        isAdvance: false,
    });
    const [data, setData] = useState<any>(initialValues);

    const columns: ColumnsType[] = [
        {
            name: "callstart",
            title: "Date",
            sortable: true,
        },
        {
            name: "tenant_name",
            title: "Tenant",
            sortable: true,
        },
        {
            name: "user_name",
            title: "User",
            sortable: true,
        },
        {
            name: "caller_id_number",
            title: "Caller Id Number",
            sortable: true,
        },
        {
            name: "destination_number",
            title: "Phone Number",
            sortable: true,
        },
        {
            name: "billsecond",
            title: "Duration",
            sortable: true,
        },
        {
            name: "call_mode_name",
            title: "Call Mode",
            sortable: true,
        },
        {
            name: "disposition",
            title: "Hangup Cause",
            sortable: true,
        },
        {
            name: "direction",
            title: "Direction",
            sortable: true,
        },
        {
            name: "call_type",
            title: "Call Type",
            sortable: true,
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
        onGetUserOptions();
        onGetTenantOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Preapring Data for Export File
    const prepareExportProps = () => {
        const data = allCdrs?.data || [];
        return { headers, data, filename: "CDRS.csv" };
    };

    // Fetching User Options
    const onGetUserOptions = async () => {
        try {
            await dispatch(userOptionsGet());
        } catch (err) {
            console.error("Get User Options Err =-=>", err);
        }
    };

    // Fetching Tenant Options
    const onGetTenantOptions = async () => {
        try {
            await dispatch(tenantOptionsGet());
        } catch (err) {
            console.error("Get Tenant Options Err =-=>", err);
        }
    };

    // Fetching CDRS Data
    const onGetData = useDebouncedCallback(async () => {
        setLoading(true);
        try {
            const params = { ...filter };
            delete params["isAdvance"];
            await dispatch(cdrsGet(params)).unwrap();
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.error("Get CDRS Err =-=>", err);
        }
    }, 500);

    // Fetching All CDRS Data
    const onGetAllCdrs = async () => {
        setCsvLoading(true);
        try {
            if (filter?.isAdvance) {
                const payload = {
                    [data["callstart"]["key"]]: formatDate(
                        data["callstart"]["val"],
                        true
                    ),
                    [data["callend"]["key"]]: formatDate(data["callend"]["val"], true),
                    [data["tenant_uuid"]["key"]]: data["tenant_uuid"]["val"],
                    [data["user_uuid"]["key"]]: data["user_uuid"]["val"],
                    [data["caller_id_name"]["key"]]: data["caller_id_name"]["val"],
                    [data["caller_id_number"]["key"]]: data["caller_id_number"]["val"],
                    [data["destination_number"]["key"]]:
                        data["destination_number"]["val"],
                    [data["billsecond"]["key"]]: data["billsecond"]["val"],
                    [data["disposition"]["key"]]: data["disposition"]["val"],
                    [data["call_mode"]["key"]]: data["call_mode"]["val"],
                    [data["direction"]["key"]]: data["direction"]["val"],
                    [data["call_type"]["key"]]: data["call_type"]["val"],
                    page: filter?.page,
                    limit: cdrs?.count || 0,
                };
                Object.entries(payload)?.forEach(([key, val]: any) => {
                    if (!val) {
                        delete payload[key];
                    }
                });
                await dispatch(cdrsAllSearchGet(payload)).unwrap();
                setCsvLoading(false);
                setIsCsvDownload(true);
            } else {
                const params = { ...filter };
                params["limit"] = cdrs?.count || 0;
                delete params["isAdvance"];
                await dispatch(cdrsAllGet(params)).unwrap();
                setCsvLoading(false);
                setIsCsvDownload(true);
            }
        } catch (err) {
            console.error("Get All CDRS Err =-=>", err);
            setCsvLoading(false);
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

    // Advance Search - Searching Data API call
    const onSearchData = async () => {
        if (
            !(
                data["callstart"]["val"] ||
                data["callend"]["val"] ||
                data["tenant_uuid"]["val"] ||
                data["user_uuid"]["val"] ||
                data["caller_id_name"]["val"] ||
                data["caller_id_number"]["val"] ||
                data["destination_number"]["val"] ||
                data["billsecond"]["val"] ||
                data["disposition"]["val"] ||
                data["call_mode"]["val"] ||
                data["direction"]["val"] ||
                data["call_type"]["val"]
            )
        ) {
            Danger(SEARCH_ERROR_MESSAGE);
            return false;
        }
        setLoading(true);
        try {
            const payload = {
                [data["callstart"]["key"]]: formatDate(data["callstart"]["val"], true),
                [data["callend"]["key"]]: formatDate(data["callend"]["val"], true),
                [data["tenant_uuid"]["key"]]: data["tenant_uuid"]["val"],
                [data["user_uuid"]["key"]]: data["user_uuid"]["val"],
                [data["caller_id_name"]["key"]]: data["caller_id_name"]["val"],
                [data["caller_id_number"]["key"]]: data["caller_id_number"]["val"],
                [data["destination_number"]["key"]]: data["destination_number"]["val"],
                [data["billsecond"]["key"]]: data["billsecond"]["val"],
                [data["disposition"]["key"]]: data["disposition"]["val"],
                [data["call_mode"]["key"]]: data["call_mode"]["val"],
                [data["direction"]["key"]]: data["direction"]["val"],
                [data["call_type"]["key"]]: data["call_type"]["val"],
                page: filter?.page,
                limit: filter?.limit,
            };
            Object.entries(payload)?.forEach(([key, val]: any) => {
                if (!val) {
                    delete payload[key];
                }
            });
            await dispatch(cdrsSearch(payload)).unwrap();
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Search data Err --->", e.message);
        }
    };

    // Advance Search Fields Empty & Fetching CDRS Data
    const onEmptySearch = () => {
        setData(initialValues);
        setFilter({
            ...filter,
            page: 1,
            limit: 10,
            isAdvance: false,
        });
    };

    return (
        <div className="bg-white p-5 rounded-[25px]">
            <Head
                search={filter?.search}
                csvProps={prepareExportProps()}
                csvloader={csvLoading}
                isCsvDownload={isCsvDownload}
                setIsCsvDownload={setIsCsvDownload}
                onCsvClick={() => onGetAllCdrs()}
                onChange={(e: any) => {
                    setFilter({
                        ...filter,
                        page: 1,
                        limit: 10,
                        isAdvance: false,
                        search: e.target.value,
                    });
                }}
                onSearchClick={() => {
                    setFilter({
                        ...filter,
                        page: 1,
                        limit: 10,
                        isAdvance: true,
                    });
                }}
                onHide={onEmptySearch}
            >
                <DatePicker
                    name="callstart"
                    label="Start Date"
                    placeholder="Enter Start Date"
                    dateFormat="yyyy-MM-dd HH:mm:ss"
                    value={data.callstart.val}
                    startDate={data.callstart.val}
                    endDate={data.callend.val}
                    maxDate={data.callend.val || new Date()}
                    onChange={(e: any) => handleChnage("callstart", e)}
                    showTimeSelect
                    selectsStart
                    isInfo
                />
                <DatePicker
                    name="callend"
                    label="End Date"
                    placeholder="Enter End Date"
                    dateFormat="yyyy-MM-dd HH:mm:ss"
                    value={data.callend.val}
                    startDate={data.callstart.val}
                    endDate={data.callend.val}
                    minDate={data.callstart.val}
                    maxDate={new Date()}
                    onChange={(e: any) => handleChnage("callend", e)}
                    showTimeSelect
                    selectsEnd
                    isInfo
                />
                <Select
                    name="tenant_uuid"
                    label="Tenant"
                    placeholder="Select Tenant"
                    removable
                    value={data.tenant_uuid.val}
                    options={tenantOptions}
                    onChange={(e: any) => handleChnage("tenant_uuid", e.target.value)}
                    isInfo
                />
                <Select
                    name="user_uuid"
                    label="User"
                    placeholder="Select User"
                    removable
                    value={data.user_uuid.val}
                    options={userOptions}
                    onChange={(e: any) => handleChnage("user_uuid", e.target.value)}
                    isInfo
                />
                <InputSelect
                    name="caller_id_name"
                    label="Caller Id Name"
                    placeholder="Enter Caller Id Name"
                    value={data.caller_id_name.val}
                    dropdownValue={data.caller_id_name.dropdown}
                    options={advanceSearchOptions}
                    onChange={(e: any) => handleChnage("caller_id_name", e.target.value)}
                    onDropdownChange={(e: any) =>
                        handleSelect("caller_id_name", e.target.value)
                    }
                    isInfo
                />
                <InputSelect
                    name="caller_id_number"
                    label="Caller Id Number"
                    placeholder="Enter Caller Id Number"
                    value={data.caller_id_number.val}
                    dropdownValue={data.caller_id_number.dropdown}
                    options={advanceSearchOptions}
                    onChange={(e: any) =>
                        handleChnage("caller_id_number", e.target.value)
                    }
                    onDropdownChange={(e: any) =>
                        handleSelect("caller_id_number", e.target.value)
                    }
                    isInfo
                />
                <InputSelect
                    type="number"
                    name="destination_number"
                    label="Phone Number"
                    placeholder="Enter Phone Number"
                    value={data.destination_number.val}
                    dropdownValue={data.destination_number.dropdown}
                    options={advanceSearchOptions}
                    onChange={(e: any) =>
                        handleChnage("destination_number", e.target.value)
                    }
                    onDropdownChange={(e: any) =>
                        handleSelect("destination_number", e.target.value)
                    }
                    isInfo
                />
                <InputSelect
                    name="billsecond"
                    label="Duration"
                    placeholder="Enter Duration"
                    value={data.billsecond.val}
                    dropdownValue={data.billsecond.dropdown}
                    options={advanceSearchGreaterOptions}
                    onChange={(e: any) => handleChnage("billsecond", e.target.value)}
                    onDropdownChange={(e: any) =>
                        handleSelect("billsecond", e.target.value)
                    }
                    isInfo
                />
                <Select
                    name="call_mode"
                    label="Call Mode"
                    placeholder="Select call mode"
                    value={data.call_mode.val}
                    options={callModeOptions}
                    onChange={(e: any) => handleChnage("call_mode", e.target.value)}
                    isInfo
                />
                <Select
                    name="disposition"
                    label="Hangup Cause"
                    placeholder="Select Hangup Cause"
                    removable
                    value={data.disposition.val}
                    options={dispositionOptions}
                    onChange={(e: any) => handleChnage("disposition", e.target.value)}
                    isInfo
                />
                <Select
                    name="direction"
                    label="Direction"
                    placeholder="Select Direction"
                    removable
                    value={data.direction.val}
                    options={directionOptions}
                    onChange={(e: any) => handleChnage("direction", e.target.value)}
                    isInfo
                />
                <Select
                    name="call_type"
                    label="Call Type"
                    placeholder="Select Call Type"
                    removable
                    value={data.call_type.val}
                    options={callTypeOptions}
                    onChange={(e: any) => handleChnage("call_type", e.target.value)}
                    isInfo
                />
            </Head>
            <div className="mt-5">
                <Table
                    isLoading={loading}
                    columns={columns}
                    data={cdrs?.data?.length ? cdrs?.data : []}
                    page={filter.page}
                    totalCount={cdrs?.count || 0}
                    limit={filter.limit}
                    selectable={false}
                    onPageClick={(page: number) => {
                        setFilter({
                            ...filter,
                            page,
                        });
                    }}
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
        </div>
    );
};

export default Cdrs;
