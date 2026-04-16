"use client";
import { useEffect, useLayoutEffect, useState } from "react";

// PROJECT IMPORT
import {
    useTenantReport,
    tenantReportGet,
    tenantReportSearch,
    tenantReportFlagGet,
    useTenantProcess,
    setIsInProcess,
} from "@/redux/slice/master-admin/tenantReportSlice";
import { useTenantOptions } from "@/redux/slice/master-admin/tenantSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Select } from "@/components/forms";
import { Head, Table } from "@/components/ui-components";
import { formatDate } from "@/helperFunctions";
import DatePicker from "@/components/pickers/DatePicker";
import { Danger } from "@/redux/services/toasterServices";
import { SEARCH_ERROR_MESSAGE } from "@/config/constant";

// THIRD-PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";

// TYPES IMPORT
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";

const initialValues: any = {
    callstart: "",
    callend: "",
    customer_tenant_uuid: "",
};

const TenantReport = () => {
    const dispatch = useAppDispatch();
    const TenantReportOptions = useTenantOptions();
    const tenantReport = useTenantReport();
    const isInProcess = useTenantProcess();

    const [loading, setLoading] = useState<boolean>(true);
    const [filter, setFilter] = useState<FilterTypes>({
        page: 1,
        limit: 10,
        search: "",
        isAdvance: false,
    });
    const [data, setData] = useState<any>(initialValues);

    const columns: ColumnsType[] = [
        {
            name: "tenantName",
            title: "Name",
            sortable: true,
        },
        {
            name: "inbound_call_count",
            title: "Inbound Call",
            sortable: true,
        },
        {
            name: "outbound_call_count",
            title: "Outbound Call",
            sortable: true,
        },
        {
            name: "less_six_second_count",
            title: "Call < 6 sec",
            sortable: true,
        },
        {
            name: "asr",
            title: "ASR",
            sortable: true,
        },
        {
            name: "acd",
            title: "ACD",
            sortable: true,
        },
    ];

    useLayoutEffect(() => {
        onGetData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    // Advance Search - Trigger when left side Input or Select value change
    const handleChnage = (key: string, val: string) => {
        setData({
            ...data,
            [key]: val,
        });
    };

    // Tenant flag
    const onGetTenantReportFlag = async () => {
        try {
            const res: any = await dispatch(tenantReportFlagGet()).unwrap();
            if (res && res.statusCode === 200) {
                if (res.data?.[0]?.flag === 2) {
                    onGetData();
                } else {
                    setLoading(false);
                    dispatch(setIsInProcess(true));
                    setTimeout(() => {
                        onGetTenantReportFlag();
                    }, 1 * 60 * 1000);
                }
            }
        } catch (error: any) {
            setLoading(false);
            console.log("get error -->", error?.message);
        }
    };

    // Advance Search - Searching Data API call
    const onSearchData = async () => {
        if (!(data?.callstart || data?.callend || data?.customer_tenant_uuid)) {
            Danger(SEARCH_ERROR_MESSAGE);
            return false;
        }
        setLoading(true);
        try {
            const payload = { ...data };
            Object.entries(payload)?.forEach(([key, val]: any) => {
                if (!val) {
                    delete payload[key];
                }
            });
            const res: any = await dispatch(tenantReportSearch(payload)).unwrap();
            if (res && res.statusCode === 201) {
                onGetTenantReportFlag();
            }
        } catch (e: any) {
            setLoading(false);
            console.error("Search data Err --->", e.message);
        }
    };

    // Fetching Tenant Report Data
    const onGetData = useDebouncedCallback(async (param?: any) => {
        setLoading(true);
        try {
            const params = { ...filter };
            delete params["isAdvance"];
            const res: any = await dispatch(tenantReportGet(params)).unwrap();
            if (res && res.statusCode === 200) {
                setData({
                    ...data,
                    callstart: res?.search_data?.[0]?.callstart
                        ? new Date(res?.search_data?.[0]?.callstart)
                        : "",
                    callend: res?.search_data?.[0]?.callend
                        ? new Date(res?.search_data?.[0]?.callend)
                        : "",
                    customer_tenant_uuid: res?.search_data?.[0]?.tenant_uuid || "",
                });
            }
            dispatch(setIsInProcess(false));
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.error("Get Tenant Report Err =-=>", err);
        }
    }, 500);

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

    return (
        <div className="bg-white p-5 rounded-[25px]">
            <Head
                search={filter?.search}
                onChange={(e: any) => {
                    setFilter({
                        ...filter,
                        page: 1,
                        limit: 10,
                        isAdvance: false,
                        search: e.target.value,
                    });
                }}
                onSearchClick={() => onSearchData()}
                filterOpen={true}
            // onHide={onEmptySearch}
            >
                <DatePicker
                    name="callstart"
                    label="Start Date"
                    placeholder="Enter Start Date"
                    dateFormat="yyyy-MM-dd HH:mm:ss"
                    value={data.callstart}
                    startDate={data.callstart}
                    endDate={data.callend}
                    maxDate={data.callend || new Date()}
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
                    value={data.callend}
                    startDate={data.callstart}
                    endDate={data.callend}
                    minDate={data.callstart}
                    maxDate={new Date()}
                    onChange={(e: any) => handleChnage("callend", e)}
                    showTimeSelect
                    selectsEnd
                    isInfo
                />
                <Select
                    name="customer_tenant_uuid"
                    label="Tenant"
                    placeholder="Select Tenant"
                    removable
                    value={data.customer_tenant_uuid}
                    options={TenantReportOptions}
                    onChange={(e: any) =>
                        handleChnage("customer_tenant_uuid", e.target.value)
                    }
                    isInfo
                />
            </Head>
            <div className="mt-5">
                <Table
                    isMessage={isInProcess ? "Please wait for report in process" : ""}
                    isLoading={loading}
                    columns={columns}
                    data={tenantReport?.data?.length ? tenantReport.data : []}
                    page={filter.page}
                    totalCount={tenantReport?.count || 0}
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

export default TenantReport;
