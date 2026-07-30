"use client";
import { useEffect, useLayoutEffect, useState } from "react";

// PROJECT IMPORT
import {
    recordingGet,
    recordingSearch,
    useRecording,
} from "@/redux/slice/tenant-admin/recordingSlice";
import {
    useUserOptions,
    userOptionsGet,
} from "@/redux/slice/tenant-admin/userSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Danger } from "@/redux/services/toasterServices";
import { InputSelect, Select } from "@/components/forms";
import { DatePicker } from "@/components/pickers";
import { Head, Table } from "@/components/ui-components";
import { formatDate } from "@/helperFunctions";
import { AudioPlayer } from "@/components/players";
import { SEARCH_ERROR_MESSAGE } from "@/config/constant";

// THIRD-PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";

// TYPES IMPORT
import { RecordingFilterTypes } from "@/types/advancedFilterTypes";
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";

// OPTIONS IMPORT
import { advanceSearchOptions } from "@/config/options";
import { ManagerPageTypes } from "@/types/formTypes";
import { campaignOptionsGet, useCampaignOptions } from "@/redux/slice/tenant-admin/campaignReportSlice";
// NAME STATE
const now = new Date();
const startOfToday = new Date(now);
startOfToday.setHours(0, 0, 0, 0);
const endOfToday = new Date(now);
endOfToday.setHours(23, 59, 59, 999);
// NAME STATE
const initialValues: RecordingFilterTypes = {
    callstart: { key: "callstart", val: startOfToday, dropdown: "4" },
    callend: { key: "callend", val:endOfToday, dropdown: "4" },
    user_uuid: { key: "user_uuid|4", val: "", dropdown: "4" },
    caller_id_number: { key: "caller_id_number|4", val: "", dropdown: "4" },
    destination_number: { key: "destination_number|1", val: "", dropdown: "1" },
    billsecond: { key: "billsecond|1", val: "", dropdown: "1" },
    campaign_uuid: { key: "campaign_uuid", val: "", dropdown: "4" }, // ✅ NEW

};

const Recording = (props: ManagerPageTypes) => {
    const { managerName = null, name = null } = props;
    const dispatch = useAppDispatch();
    const userOptions = useUserOptions();
    const recording = useRecording();
    const [campaigns, setCampaigns] = useState<any>();
    useEffect(() => {
        onGetCampaignOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onGetCampaignOptions = async () => {
        try {
            const result = await dispatch(campaignOptionsGet()).unwrap();
            setCampaigns(result?.data)
            //    console.log("cacmpasknsdf",result?.data);
            return result;
        } catch (err) {
            console.error("Get campaign Options Err =-=>", err);
        }
    };
    // console.log("cacmpasknsdf", campaigns);
    const campaignOptions: any = campaigns ? [
        ...(Array.isArray(campaigns.inbound_campaign) ? campaigns.inbound_campaign.map((c: any) => ({
            label: `Inbound - ${c.name}`,
            value: c.uuid
        })) : []),

        ...(Array.isArray(campaigns.outbound_campaign) ? campaigns.outbound_campaign.map((c: any) => ({
            label: `Outbound - ${c.name}`,
            value: c.uuid
        })) : []),

        ...(Array.isArray(campaigns.blended_campaign) ? campaigns.blended_campaign.map((c: any) => ({
            label: `Blended - ${c.name}`,
            value: c.uuid
        })) : []),
    ] : [];

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
            name: "converted_date",
            title: "Date & Time",
            sortable: true,
        },
        {
            name: "user_name",
            title: "User",
            sortable: true,
        },
        {
            name: "fullname",
            title: "Full Name",
            sortable: true,
        },
        {
            name: "caller_id_number",
            title: "Caller's Number",
            sortable: true,
        },
        {
            name: "destination_number",
            title: "Receiver's Number",
            sortable: true,
        },
        {
            name: "billsecond_number",
            title: "Duration",
            sortable: true,
        },
        {
            name: "recording_path",
            title: "Play/Download",
            sortable: true,
            action: (row: any) => {
                // Recordings uploaded to S3/Spaces already carry a full public URL —
                // use it directly instead of routing through the backend download route.
                const isRemoteRecording = /^https?:\/\//i.test(row?.recording_path || "");
                const src = isRemoteRecording
                    ? row.recording_path
                    : `recordings/download/recording?recording=${row?.recording_path}`;
                return (
                    <>
                        <AudioPlayer
                            src={src}
                            name={row?.fileName}
                            index={row?.index}
                        />
                    </>
                );
            },
        },
    ];

    useLayoutEffect(() => {
        if (filter?.isAdvance) {
            onSearchData(filter);
        } else {
            onGetData(filter);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    useEffect(() => {
        onGetUserOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetching User Options
    const onGetUserOptions = async () => {
        try {
            await dispatch(userOptionsGet());
        } catch (err) {
            console.error("Get User Options Err =-=>", err);
        }
    };

    // Fetching Recording Data
    const onGetData = useDebouncedCallback(async (params: any = filter) => {
        setLoading(true);
        try {
            await dispatch(recordingGet(params)).unwrap();
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.error("Get Recording Err =-=>", err);
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
    const onSearchData = useDebouncedCallback(async (params: any = filter) => {
        if (
            !(
                data["callstart"]["val"] ||
                data["callend"]["val"] ||
                data["user_uuid"]["val"] ||
                data["destination_number"]["val"] ||
                data["billsecond"]["val"] ||
                data["caller_id_number"]["val"] ||
                data["campaign_uuid"]["val"] // ✅ added
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
                [data["user_uuid"]["key"]]: data["user_uuid"]["val"],
                [data["caller_id_number"]["key"]]: data["caller_id_number"]["val"],
                [data["destination_number"]["key"]]: data["destination_number"]["val"],
                [data["billsecond"]["key"]]: data["billsecond"]["val"],
                [data["campaign_uuid"]["key"]]: data["campaign_uuid"]["val"], // ✅ added

                page: params?.page,
                limit: params?.limit,
            };
            Object.entries(payload)?.forEach(([key, val]: any) => {
                if (!val) {
                    delete payload[key];
                }
            });
            await dispatch(recordingSearch(payload)).unwrap();
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Search data Err --->", e.message);
        }
    }, 500);

    // Advance Search Fields Empty & Fetching Recording Data
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
                onSearchClick={() =>
                    setFilter({
                        ...filter,
                        page: 1,
                        limit: 10,
                        isAdvance: true,
                    })
                }
                onHide={onEmptySearch}
                bulkRecordingData={data}
                isBulkRecording={true}
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
                    type="number"
                    name="caller_id_number"
                    label="Caller's Number"
                    placeholder="Enter Caller's Number"
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
                    label="Receiver's Number"
                    placeholder="Enter Receiver's Number"
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
                    placeholder="Select Duration"
                    value={data.billsecond.val}
                    dropdownValue={data.billsecond.dropdown}
                    options={advanceSearchOptions}
                    onChange={(e: any) => handleChnage("billsecond", e.target.value)}
                    onDropdownChange={(e: any) =>
                        handleSelect("billsecond", e.target.value)
                    }
                    isInfo
                />
                <Select
                    name="campaign_uuid"
                    label="Campaign"
                    placeholder="Select Campaign"
                    removable
                    value={data.campaign_uuid.val}
                    options={campaignOptions}
                    onChange={(e: any) => handleChnage("campaign_uuid", e.target.value)}
                    isInfo
                />

            </Head>
            <div className="mt-5">
                <Table
                    managerName={managerName}
                    isLoading={loading}
                    columns={columns}
                    data={recording?.data?.length ? recording.data : []}
                    page={filter.page}
                    totalCount={recording?.count || 0}
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

export default Recording;
