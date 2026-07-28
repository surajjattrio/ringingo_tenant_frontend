"use client";
import { useEffect, useLayoutEffect, useState } from "react";

// PROJECT IMPORT
import {
    voiceBroadcastReportAllGet,
    voiceBroadcastReportAllSearch,
    voiceBroadcastReportGet,
    voiceBroadcastReportSearch,
    useAllVoiceBroadcastReport,
    useVoiceBroadcastReport,
} from "@/redux/slice/tenant-admin/voiceBroadcastReportSlice";
import {
    tenantDispositionOptionsGet,
    useTenantDispositionOptions,
} from "@/redux/slice/tenant-admin/tenantDispositionSlice";
import {
    voiceBroadcastOptionsGet,
    useVoiceBroadcastOptions,
} from "@/redux/slice/tenant-admin/voiceBroadcastSlice";

import { Danger } from "@/redux/services/toasterServices";
import { useAppDispatch } from "@/redux/hooks";
import { Select } from "@/components/forms";
import { DatePicker } from "@/components/pickers";
import { Head, Icon, Table } from "@/components/ui-components";
import { formatDate, formatDuration, convertUtcToIst } from "@/helperFunctions";
import { SEARCH_ERROR_MESSAGE } from "@/config/constant";
import SurveyInformation from "@/components/tenant-admin/voice-broadcast-report/SurveyInformation";
import VoiceBroadcastPopup from "@/components/tenant-admin/voice-broadcast-report/VoiceBroadcastPopup";

// THIRD-PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";

// TYPES IMPORT
import { VoiceBroadcastReportFilterTypes } from "@/types/advancedFilterTypes";
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";

// OPTIONS IMPORT
import { broadcastTypeOption } from "@/config/options";
import {
    useUserOptions,
    userOptionsGet,
} from "@/redux/slice/tenant-admin/userSlice";
import { ManagerPageTypes } from "@/types/formTypes";
// NAME STATE
const now = new Date();
const startOfToday = new Date(now);
startOfToday.setHours(0, 0, 0, 0);
const endOfToday = new Date(now);
endOfToday.setHours(23, 59, 59, 999);

// NAME STATE
const initialValues: VoiceBroadcastReportFilterTypes = {
    start_date: {
        key: "start_date",
        val: startOfToday,
        dropdown: "4",
    },
    end_date: {
        key: "end_date",
        val: endOfToday,
        dropdown: "4",
    },

    voicebroadcast_uuid: { key: "voicebroadcast_uuid|4", val: "", dropdown: "4" },
    type: { key: "type|4", val: "", dropdown: "4" },
    disposition: { key: "disposition|4", val: "", dropdown: "4" },
};

// DATA
const headers: any = [
    { label: "Date", key: "callstart" },
    { label: "Caller's Number", key: "caller_id_number" },
    { label: "Receiver's Number", key: "destination_number" },
    { label: "Voice Broadcast", key: "name" },
    { label: "Duration", key: "total_duration" },
    { label: "Ringing Time", key: "ringing_time" },
    { label: "Answer Time", key: "billsecond" },
    { label: "DTMF", key: "DTMF" },
    { label: "Disposition", key: "disposition_name" },
    { label: "Lead", key: "first_name" },
    { label: "Type", key: "type" },
    { label: "Survey Info", key: "survey_info" },
];

const VoiceBroadcastReport = (props: ManagerPageTypes) => {
    const { managerName = null, name = null } = props;
    const dispatch = useAppDispatch();
    const voiceBroadcastReport = useVoiceBroadcastReport();
    const allVoiceBroadcastReport = useAllVoiceBroadcastReport();
    const dispositionOptions = useTenantDispositionOptions();
    const voiceBroadcastOptions = useVoiceBroadcastOptions();
    const [csvLoading, setCsvLoading] = useState<boolean>(false);
    const [isCsvDownload, setIsCsvDownload] = useState<boolean>(false);
    const [filter, setFilter] = useState<FilterTypes>({
        page: 1,
        limit: 10,
        search: "",
        isAdvance: false,
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<any>(initialValues);
    const [infoData, setInfoData] = useState<any>(null);
    const [voiceMailData, setVoiceMailData] = useState<any>(null);
    const [columnsVisible, setColumnsVisible] = useState<boolean>(false);

    const columns: ColumnsType[] = [
        {
            name: "callstart",
            title: "Date",
            sortable: true,
            action: (row: any) => { return convertUtcToIst(row.callstart); },
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
            name: "name",
            title: "Voice Broadcast",
            sortable: true,
        },
        {
            name: "total_duration",
            title: "Duration",
            sortable: true,
            action: (row: any) => {
                return formatDuration(row?.total_duration);
            },
        },
        {
            name: "ringing_time",
            title: "Ringing Time",
            sortable: true,
            action: (row: any) => {
                return formatDuration(row?.ringing_time);
            },
        },
        {
            name: "billsecond",
            title: "Answer Time",
            sortable: true,
            action: (row: any) => {
                return formatDuration(row?.billsecond);
            },
        },
        {
            name: "DTMF",
            title: "DTMF",
            sortable: true,
        },
        {
            name: "disposition_name",
            title: "Disposition",
            sortable: true,
        },
        {
            name: "first_name",
            title: "Lead",
            sortable: true,
            action: (row: any) => {
                return row?.lead_details[0]?.first_name
            },
        },
        {
            name: "type",
            title: "Type",
            sortable: true,
        },
        {
            name: "survey_info",
            title: "Survey Info",
            action: (row: any) => {
                if (row.type == "Survey") {
                    return (
                        <>
                            <div className="flex gap-2">
                                <Icon
                                    className="cursor-pointer"
                                    tooltip="Info"
                                    name="InfoCircle"
                                    width={20}
                                    height={20}
                                    alt="info"
                                    onClick={() => {
                                        setInfoData(row?.voicebroadcast_uuid);
                                        // setVoiceMailData(row);
                                    }}
                                />
                            </div>
                        </>
                    );
                } else {
                    return "-";
                }
            },
        },
    ];

    // Fetching User Options
    const onGetUserOptions = async () => {
        try {
            await dispatch(userOptionsGet());
        } catch (err) {
            console.error("Get User Options Err =-=>", err);
        }
    };

    useEffect(() => {
        // onGetIvrGroupOptions();
        onGetUserOptions();
        onGetTennatDispositionOptions();
        onGetVoiceBroadcastOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
        const data = allVoiceBroadcastReport?.data?.map((row: any) => {
            const total_duration = formatDuration(row?.total_duration);
            const ringing_time = formatDuration(row?.ringing_time);
            const billsecond = formatDuration(row?.billsecond);
            return { ...row, total_duration, ringing_time, billsecond };
        });
        return { headers, data, filename: "VoiceBroadcastReport.csv" };
    };

    //  Fetching Disposition Options
    const onGetTennatDispositionOptions = () => {
        try {
            dispatch(tenantDispositionOptionsGet());
        } catch (err) {
            console.error("Get Disposition Options Err =-=>", err);
        }
    };

    //  Fetching VoiceBroadcast Options
    const onGetVoiceBroadcastOptions = async () => {
        try {
            await dispatch(voiceBroadcastOptionsGet());
        } catch (err) {
            console.error("Get Voice Broadcast Options Err =-=>", err);
        }
    };

    // Fetching Voice Broadcast  Data
    const onGetData = useDebouncedCallback(async () => {
        setLoading(true);
        try {
            const params = { ...filter };
            delete params["isAdvance"];
            await dispatch(voiceBroadcastReportGet(params)).unwrap();
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.error("Get Voice Broadcast Report Err =-=>", err);
        }
    }, 500);

    // Fetching All Voice Broadcast  Data
    const onGetAllVoiceBroadcastReport = async () => {
        setCsvLoading(true);
        try {
            if (filter?.isAdvance) {
                const payload = {
                    [data["start_date"]["key"]]: formatDate(
                        data["start_date"]["val"],
                        true
                    ),
                    [data["end_date"]["key"]]: formatDate(data["end_date"]["val"], true),
                    [data["voicebroadcast_uuid"]["key"]]:
                        data["voicebroadcast_uuid"]["val"],
                    [data["disposition"]["key"]]: data["disposition"]["val"],
                    [data["type"]["key"]]: data["type"]["val"],

                    page: filter?.page,
                    limit: voiceBroadcastReport?.count || 0,
                };
                Object.entries(payload)?.forEach(([key, val]: any) => {
                    if (!val) {
                        delete payload[key];
                    }
                });
                await dispatch(voiceBroadcastReportAllSearch(payload)).unwrap();
                setCsvLoading(false);
                setIsCsvDownload(true);
            } else {
                const params = { ...filter };
                params["limit"] = voiceBroadcastReport?.count || 0;
                delete params["isAdvance"];
                await dispatch(voiceBroadcastReportAllGet(params)).unwrap();
                setCsvLoading(false);
                setIsCsvDownload(true);
            }
        } catch (err) {
            console.error("Get All Voice Broadcast Report Err =-=>", err);
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

    // Advance Search - Searching Data API call
    const onSearchData = async () => {
        if (
            !(
                data["start_date"]["val"] ||
                data["end_date"]["val"] ||
                data["voicebroadcast_uuid"]["val"] ||
                data["disposition"]["val"] ||
                data["type"]["val"]
            )
        ) {
            Danger(SEARCH_ERROR_MESSAGE);
            return false;
        }
        setLoading(true);
        try {
            const payload = {
                [data["start_date"]["key"]]: formatDate(
                    data["start_date"]["val"],
                    true
                ),
                [data["end_date"]["key"]]: formatDate(data["end_date"]["val"], true),
                [data["voicebroadcast_uuid"]["key"]]:
                    data["voicebroadcast_uuid"]["val"],
                [data["disposition"]["key"]]: data["disposition"]["val"],
                [data["type"]["key"]]: data["type"]["val"],

                page: filter?.page,
                limit: filter?.limit,
            };
            Object.entries(payload)?.forEach(([key, val]: any) => {
                if (!val) {
                    delete payload[key];
                }
            });
            await dispatch(voiceBroadcastReportSearch(payload)).unwrap();
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Search data Err --->", e.message);
        }
    };

    // Advance Search Fields Empty & Fetching Voice Broadcast Report Data
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
                // onColumnClick={() => setColumnsVisible(true)}
                csvProps={prepareExportProps()}
                csvloader={csvLoading}
                isCsvDownload={isCsvDownload}
                setIsCsvDownload={setIsCsvDownload}
                onCsvClick={() => onGetAllVoiceBroadcastReport()}
                onChange={(e: any) => {
                    setFilter({
                        ...filter,
                        page: 1,
                        limit: 10,
                        search: e.target.value,
                        isAdvance: false,
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
                    value={data.start_date.val}
                    startDate={data.start_date.val}
                    endDate={data.end_date.val}
                    maxDate={data.end_date.val || new Date()}
                    onChange={(e: any) => handleChnage("start_date", e)}
                    showTimeSelect
                    selectsStart
                    isInfo
                />
                <DatePicker
                    name="end_date"
                    label="End Date"
                    placeholder="Enter End Date"
                    dateFormat="yyyy-MM-dd HH:mm:ss"
                    value={data.end_date.val}
                    startDate={data.start_date.val}
                    endDate={data.end_date.val}
                    minDate={data.start_date.val}
                    maxDate={new Date()}
                    onChange={(e: any) => handleChnage("end_date", e)}
                    showTimeSelect
                    selectsEnd
                    isInfo
                />

                <Select
                    name="voicebroadcast_uuid"
                    label="Voice Broadcast"
                    placeholder="Select Voice Broadcast"
                    removable
                    value={data.voicebroadcast_uuid.val}
                    options={voiceBroadcastOptions}
                    onChange={(e: any) =>
                        handleChnage("voicebroadcast_uuid", e.target.value)
                    }
                    isInfo
                />

                <Select
                    name="type"
                    label="Type"
                    placeholder="Select Call Type"
                    removable
                    value={data.type.val}
                    options={broadcastTypeOption}
                    onChange={(e: any) => handleChnage("type", e.target.value)}
                    isInfo
                />

                <Select
                    name="disposition"
                    label="Disposition"
                    placeholder="Select Disposition"
                    removable
                    value={data.disposition.val}
                    options={dispositionOptions}
                    onChange={(e: any) => handleChnage("disposition", e.target.value)}
                    isInfo
                />
            </Head>

            <div className="mt-5">
                <div
                    className={`${infoData
                        ? "grid grid-cols-3 gap-4 tsm:grid-cols-1 tsm:gap-y-4 tsm:gap-x-0"
                        : ""
                        }`}
                >
                    <div className="col-span-2">
                        <Table
                            managerName={managerName}
                            isLoading={loading}
                            columns={columns}
                            data={
                                voiceBroadcastReport?.data?.length
                                    ? voiceBroadcastReport.data
                                    : []
                            }
                            page={filter.page}
                            totalCount={voiceBroadcastReport?.count || 0}
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

                    <div className="col-span-1">
                        <SurveyInformation
                            isVoiceInfoID={infoData}
                            newData={voiceMailData}
                            setIsVoiceInfoID={setInfoData}
                        />
                    </div>
                </div>

                <VoiceBroadcastPopup
                    visible={columnsVisible}
                    onToggle={() => {
                        setColumnsVisible(!columnsVisible);
                    }}
                />
            </div>
        </div>
    );
};

export default VoiceBroadcastReport;
