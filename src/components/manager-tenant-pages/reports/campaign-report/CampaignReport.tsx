"use client";
import { useEffect, useLayoutEffect, useState } from "react";

// PROJECT IMPORT
import {
    useCampaignReport,
    campaignReportGet,
    useCampaignOptions,
    campaignOptionsGet,
    campaignReportSearch,
} from "@/redux/slice/tenant-admin/campaignReportSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Select } from "@/components/forms";
import { Head, Table } from "@/components/ui-components";
import { formatDate } from "@/helperFunctions";

// THIRD-PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";

// TYPES IMPORT
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";
import DatePicker from "@/components/pickers/DatePicker";
import { CampaignReportFilterTypes } from "@/types/advancedFilterTypes";
import Cookies from "js-cookie";
import { Danger } from "@/redux/services/toasterServices";
import { ManagerPageTypes } from "@/types/formTypes";
// NAME STATE
const now = new Date();
const startOfToday = new Date(now);
startOfToday.setHours(0, 0, 0, 0);
const endOfToday = new Date(now);
endOfToday.setHours(23, 59, 59, 999);

const initialValues: CampaignReportFilterTypes = {
    callstart: {
        key: "callstart",
        val: startOfToday,
        dropdown: "4",
    },
    callend: {
        key: "callend",
        val: endOfToday,
        dropdown: "4",
    },
    campaign_uuid: { key: "campaign_uuid", val: [], dropdown: "4" },
};

const CampaignReportPage = (props: ManagerPageTypes) => {
    const { managerName = null, name = null } = props;
    const dispatch = useAppDispatch();
    const campaignReportOptions = useCampaignOptions();
    const campaignReport = useCampaignReport();

    const [loading, setLoading] = useState<boolean>(true);
    const [filter, setFilter] = useState<FilterTypes>({
        page: 1,
        limit: 10,
        search: "",
        isAdvance: false,
        doQuery: false,
    });

    const [data, setData] = useState<any>(initialValues);

    const columns: ColumnsType[] = [
        {
            name: "campaign_name",
            title: "Campaign / Date",
            sortable: true,
            action: (row: any) => {
                // For child rows (agents), show fullname; for parent rows (campaigns), show campaign_name
                return row?.report_date || row?.campaign_name;
            },
        },
        {
            name: "logged_in_agent",
            title: "Agent Logged",
            sortable: true,
            action: (row: any) => {
                // Only show for parent rows (campaigns)
                return row?.fullname || row?.logged_in_agent;
            },
        },
        {
            name: "lead_dialed",
            title: "Lead Dialed",
            sortable: true,
        },
        {
            name: "answered_call",
            title: "Answered Calls",
            sortable: true,
        },
        {
            name: "acd",
            title: "ACD",
            sortable: true,
            action: (row: any) => {
                return row.acd == null ? "00:00:00" : row.acd;
            },
        },
        {
            name: "drop_calls",
            title: "Drop Calls",
            sortable: true,
        },
        {
            name: "sale_count",
            title: "Sale Count",
            sortable: true,
        },
        {
            name: "incoming_calls",
            title: "Incoming Calls",
            sortable: true,
        },
    ];

    // Transform API data to accordion structure
    const transformDataForAccordion = (data: any[]) => {
        if (!data || !Array.isArray(data)) return [];

        return data.map((campaign: any) => {
            const { agents, ...campaignData } = campaign;

            // Transform agents array to children array
            const children = agents?.map((agent: any) => ({
                ...agent,
                uuid: agent.agent_uuid || `${campaign.uuid}-${agent.fullname}`,
                campaign_name: agent.fullname,
                has_children: false,
            })) || [];

            return {
                ...campaignData,
                has_children: children.length > 0,
                children: children,
            };
        });
    };
    useEffect(() => {
        let storageData = Cookies.get("searched_filter");
        if (storageData != null && storageData != undefined) {
            let payload = JSON.parse(storageData);
            setData({
                ...data,
                callstart: {
                    key: "callstart",
                    val: payload["callstart"]?.val      // adjusted to handle null/undefined
                        ? new Date(payload["callstart"]?.val)    // adjusted to handle null/undefined
                        : new Date().setHours(0, 0, 1),
                },
                callend: {
                    key: "callend",
                    val: payload["callend"]?.val    // adjusted to handle null/undefined
                        ? new Date(payload["callend"]?.val)    // adjusted to handle null/undefined
                        : new Date().setHours(23, 59, 59),
                },
                campaign_uuid: {
                    key: "campaign_uuid",
                    val: payload["campaign_uuid"]?.val  // adjusted to handle null/undefined
                        ? payload["campaign_uuid"]?.val     // adjusted to handle null/undefined
                        : [],
                },
            });
            setFilter({ ...filter, isAdvance: true, doQuery: false });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useLayoutEffect(() => {
        onGetData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    useEffect(() => {
        onGetCampaignOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onGetCampaignOptions = async () => {
        try {
            await dispatch(campaignOptionsGet()).unwrap();
        } catch (err) {
            console.error("Get campaign Options Err =-=>", err);
        }
    };

    // Advance Search - Trigger when left side Input or Select value change
    const handleChnage = (key: string, val: string) => {
        setData({
            ...data,
            [key]: { ...data[key], val: val },
        });
    };

    const onSearchData = async () => {
        try {
            const payload = {
                [data["callstart"]["key"]]: formatDate(data["callstart"]?.val, true),
                [data["callend"]["key"]]: formatDate(data["callend"]?.val, true),
                [data["campaign_uuid"]["key"]]: data["campaign_uuid"]?.val,
            };
            Object.entries(payload)?.forEach(([key, val]: any) => {
                if (!val) {
                    delete payload[key];
                }
            });
            Cookies.set("searched_filter", JSON.stringify(payload));
            await dispatch(campaignReportSearch(payload)).unwrap();
        } catch (e: any) {
            console.error("Search data Err --->", e.message);
        }
    };

    // Fetching campaign Report Data
    const onGetData = useDebouncedCallback(async () => {
        if (filter?.isAdvance && !data["campaign_uuid"]?.val?.length) {
            Danger("Please select any campaign");
            return false;
        }
        setLoading(true);
        try {
            //Search Data
            const payload: any = {
                [data["callstart"]["key"]]: formatDate(data["callstart"]?.val, true),
                [data["callend"]["key"]]: formatDate(data["callend"]?.val, true),
                [data["campaign_uuid"]["key"]]: data["campaign_uuid"]?.val?.length
                    ? data["campaign_uuid"]?.val?.join(",")
                    : data["campaign_uuid"]?.val,
                ...filter,
            };
            Object.entries(payload)?.forEach(([key, val]: any) => {
                if (!val) {
                    delete payload[key];
                }
            });
            delete payload["isAdvance"];
            await dispatch(campaignReportGet(payload)).unwrap();
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.error("Get campaign Report Err =-=>", err);
        }
    }, 500);

    // Advance Search Fields Empty & Fetching campaign report Data
    const onEmptySearch = () => {
        Cookies.remove("searched_filter");
        setData(initialValues);
        setFilter({
            ...filter,
            page: 1,
            limit: 10,
            isAdvance: false,
            doQuery: false,
        });
    };

    return (
        <div className="bg-white p-5 rounded-[25px]">
            <Head
                search={filter?.search}
                onChange={(e: any) => {
                    setFilter({
                        ...filter,
                        search: e.target.value,
                    });
                }}
                onSearchClick={() => {
                    setFilter({
                        ...filter,
                        page: 1,
                        limit: 10,
                        isAdvance: true,
                        doQuery: true,
                    });
                    Cookies.set("searched_filter", JSON.stringify(data));
                }}
                onHide={onEmptySearch}
                isLoading={loading}
                filterOpen={filter.isAdvance}
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
                    name="campaign_uuid"
                    label="Campaign"
                    placeholder="Select Campaign"
                    isGroup
                    isMulti
                    value={data?.campaign_uuid.val}
                    options={campaignReportOptions}
                    onChange={(e: any) => handleChnage("campaign_uuid", e)}
                    isInfo
                />
            </Head>
            <div className="mt-5">
                <Table
                    managerName={managerName}
                    isLoading={loading}
                    columns={columns}
                    data={campaignReport?.data?.length ? transformDataForAccordion(campaignReport.data) : []}
                    page={filter.page}
                    totalCount={campaignReport?.count || 0}
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

export default CampaignReportPage;
