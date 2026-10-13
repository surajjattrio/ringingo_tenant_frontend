"use client";
import { useEffect, useLayoutEffect, useState } from "react";

// PROJECT IMPORT
import {
    ivrGroupListGet,
    cdrsArchiveListGet,
    tenantCdrsAllGet,
    tenantCdrsAllSearch,
    tenantCdrsGet,
    tenantCdrsSearch,
    useTenantAllCdrs,
    useTenantCdrs,
    useTenantIvrGroupOptions,
    useTenantCdrsArchiveOptions,
} from "@/redux/slice/tenant-admin/tenantCdrsSlice";
import { Danger } from "@/redux/services/toasterServices";
import { useAppDispatch } from "@/redux/hooks";
import { InputSelect, Select } from "@/components/forms";
import { DatePicker } from "@/components/pickers";
import { Head, Table, Icon } from "@/components/ui-components";
import { convertUtcToIst, formatDate, formatTime } from "@/helperFunctions";
import { AudioPlayer } from "@/components/players";
import { SEARCH_ERROR_MESSAGE } from "@/config/constant";

// THIRD-PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";

// TYPES IMPORT
import { TenantCdrsFilterTypes } from "@/types/advancedFilterTypes";
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";
import { ManagerPageTypes } from "@/types/formTypes";

// OPTIONS IMPORT
import {
    advanceSearchOptions,
    callModeOptions,
    callTypeOptions,
    directionOptions,
    dispositionOptions,
} from "@/config/options";
import {
    useUserOptions,
    userOptionsGet,
} from "@/redux/slice/tenant-admin/userSlice";
import { dispositionOptionsGet, dispositionSingleGet, useDispositionOptions } from "@/redux/slice/master-admin/dispositionSlice";
import moment from "moment";
import { campaignOptionsGet, useCampaignOptions } from "@/redux/slice/tenant-admin/campaignReportSlice";

// Dial Method Options
const dialMethodOptions = [
    { label: "Manual Dial", value: "0" },
    { label: "Auto Dial", value: "1" },
    { label: "Preview Dial", value: "2" },
    { label: "Predictive Dial", value: "3" },
];

// Disconnected By Options
const disconnectedByOptions = [
    { label: "Agent", value: "0" },
    { label: "Customer", value: "1" }
];

// Add By Rahul RIG-13 call status
const callStatusOptions = [
    { label: "Connected", value: "Connected" },
    { label: "Not Connected", value: "Not Connected" },
    { label: "Abandoned", value: "Abandoned" },

];

// NAME STATE
const now = new Date();
const startOfToday = new Date(now);
startOfToday.setHours(0, 0, 0, 0);
const endOfToday = new Date(now);
endOfToday.setHours(23, 59, 59, 999);
const initialValues: any = {
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
    collection_name_for_display: { key: "collection_name_for_display|4", val: "", dropdown: "4" },
    caller_id_name: { key: "caller_id_name|1", val: "", dropdown: "1" },
    caller_id_number: { key: "caller_id_number|1", val: "", dropdown: "1" },
    destination_number: { key: "destination_number|1", val: "", dropdown: "1" },
    billsecond: { key: "billsecond|1", val: "", dropdown: "1" },
    disposition: { key: "disposition|4", val: "", dropdown: "4" },
    call_mode: { key: "call_mode|4", val: "", dropdown: "4" },
    direction: { key: "direction|4", val: "", dropdown: "4" },
    call_status: { key: "call_status|4", val: "", dropdown: "4" },
    call_type: { key: "call_type|4", val: "", dropdown: "4" },
    user_uuid: { key: "user_uuid|4", val: "", dropdown: "4" },
    pbx_feature_uuid: { key: "pbx_feature_uuid|4", val: "", dropdown: "4" },
    campaign_uuid: { key: "campaign_uuid|4", val: [], dropdown: "" },
    // lead_group_name: { key: "lead_group_name|4", val: "", dropdown: "4" },
    // disconnected_by: { key: "disconnected_by|4", val: "", dropdown: "4" },
    // dial_method: { key: "dial_method|4", val: "", dropdown: "4" },
};

// DATA
// const headers: any = [
//     { label: "Date", key: "converted_date" },
//     { label: "Caller Id Name", key: "caller_id_name" },
//     { label: "Caller Id Number", key: "caller_id_number" },
//     { label: "Phone Number", key: "destination_number" },
//     { label: "User", key: "username" },
//     { label: "Duration", key: "billsecond" },
//     { label: "Hangup Cause", key: "hangup_cause" },
//     // { label: "Hangup Cause", key: "disposition" },
//     { label: "Call Mode", key: "call_mode" },
//     { label: "Direction", key: "direction" },
//     { label: "Call Type", key: "call_type" },
// ];
const headers = [
    { label: "Start Date", key: "callstart" },
    { label: "End Date", key: "callend" },
    { label: "Caller's Number", key: "caller_id_number" },
    { label: "Receiver's Number", key: "destination_number" },
    { label: "User ID", key: "username" },
    { label: "User Group Name", key: "user_group_name" },
    { label: "IVR Name", key: "ivr_cq_group_name" },
    { label: "Agent", key: "agent" },
    { label: "Duration", key: "total_duration" },
    { label: "Answer Time", key: "billsecond" },
    { label: "Actual Talk Time", key: "actual_talktime" },
    { label: "Call Status", key: "call_status" },
    { label: "Hold Time", key: "hold_time" },
    { label: "Waiting Time", key: "waiting_time" },
    { label: "Ringing Time", key: "ringing_time" },
    { label: "Campaign", key: "campaign_name" },
    { label: "Lead Group Name", key: "lead_group_name" },
    { label: "Dial Method", key: "dial_method_label" },
    { label: "Disconnected By", key: "disconnected_by_label" },
    { label: "Disposition", key: "hangup_cause" },
    { label: "Sub Disposition 1", key: "hangup_cause_1" },
    { label: "Sub Disposition 2", key: "hangup_cause_2" },
    { label: "Direction", key: "direction" },
    { label: "CSAT Score", key: "is_csat" },
    { label: "Comment", key: "comment" },
    { label: "Knowledge Base", key: "knowledge_base" },
    // { label: "Recording", key: "recording_path" },
    { label: "Feedback Rating", key: "feedback_rating" },
    { label: "Feedback Comment", key: "feedback_comment" },
];


const CdrsReport = (props: ManagerPageTypes) => {
    const { managerName = null, name = null } = props;
    const dispatch = useAppDispatch();
    const cdrs = useTenantCdrs();
    const allCdrs = useTenantAllCdrs();
    // console.log("DEBUGDEBUGDEBUG", cdrs);

    const userOptions = useUserOptions();
    const allDispositions = useDispositionOptions()
    let campaignOptions = useCampaignOptions();
    // console.log("aads", allDispositions);

    const ivrGroupOptions = useTenantIvrGroupOptions();

    const cdrsArchiveOptions = useTenantCdrsArchiveOptions();
    const [cdrsValues, setCdrsValues] = useState<any>({
        quarter_collection_name: "",
        quarter_selected: "no",
    })


    const [filter, setFilter] = useState<FilterTypes>({
        page: 1,
        limit: 10,
        search: "",
        isAdvance: false,
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [csvLoading, setCsvLoading] = useState<boolean>(false);
    const [isCsvDownload, setIsCsvDownload] = useState<boolean>(false);
    const [data, setData] = useState<any>(initialValues);
    const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
    const [feedbackFormData, setFeedbackFormData] = useState<any>(null);

    const openFeedbackModal = (row: any) => {
        setFeedbackFormData(row?.feedback?.formData || null);
        setShowFeedbackModal(true);
    };

    const getDialMethodLabel = (method: string | number) => {
        switch (method) {
            case "0":
                return "Manual Dial";
            case "1":
                return "Auto Dial";
            case "2":
                return "Preview Dial";
            case "3":
                return "Predictive Dial";
            default:
                return "";
        }
    };

    const getDisconnectedByLabel = (method: string | number) => {
        switch (method) {
            case "0":
                return "Agent";
            case "1":
                return "Customer";
            case "2":
                return "Automatic";
            default:
                return "";
        }
    };

    const columns: ColumnsType[] = [
        // {
        //     name: "callstart",
        //     title: "Start Date",
        //     sortable: true,
        //     action: (row: any) => {
        //         // if (row.total_duration === "0") {
        //         //     return moment
        //         //         .utc(row.callstart)
        //         //         .utcOffset(330)
        //         //         .format("YYYY-MM-DD HH:mm:ss");
        //         //     //    return convertUtcToIst(row.callstart);
        //         // } else {
        //         //     return moment
        //         //         .utc(row.callstart)
        //         //         .subtract(330, "minutes")
        //         //         .format("YYYY-MM-DD HH:mm:ss");
        //         // }
        //         if (filter.isAdvance) {
        //             return convertUtcToIst(row.callstart);
        //         }
        //         return row.callstart;
        //     },
        // },
        {
            name: "callstart",
            title: "Start Date",
            sortable: true,
            action: (row: any) => {
                // if (filter.isAdvance) {
                //     return convertUtcToIst(row.callstart);
                // }
                return row.callstart;
            },
        },
        {
            name: "callend",
            title: "End Date",
            sortable: true,
            // action: (row: any) => {
            //     if (row?.dial_method == "1") {
            //         return convertUtcToIst(row?.callend)
            //     }
            //     else {
            //         return row?.callend;
            //     }
            // }
        },
        // {
        //     name: "callend",
        //     title: "End Date",
        //     sortable: true,
        //     action: (row: any) => {
        //         if (row?.dial_method == "1") {
        //             return convertUtcToIst(row?.callend)
        //         }
        //         else {
        //             return row?.callend;
        //         }
        //     }
        // },
        {
            name: "caller_id_number",
            title: "Caller's Number",
            sortable: true,
            action: (row: any) => {
                const isI = row.direction?.toString().toLowerCase().includes("inbound");
                return isI ? (row.destination_number || "-") : (row.caller_id_number || "-")
            }
        },
        {
            name: "destination_number",
            title: "Receiver's Number",
            sortable: true,
            action: (row: any) => {
                const isI = row.direction?.toString().toLowerCase().includes("inbound");
                return isI ? (row.caller_id_number || "-") : (row.destination_number || "-")
            }
        },
        {
            name: "username",
            title: "User ID",
            sortable: true,
            action: (row: any) => {
                return row?.username || "-"
            }
        },
        {
            name: "fullname",
            title: "Full Name",
            sortable: true,
            action: (row: any) => {
                return row?.fullname || "-"
            }
        },
        {
            name: "user_group_name",
            title: "User Group Name",
            sortable: true,
            action: (row: any) => {
                return row?.user[0]?.user_group[0]?.name ?? "-"
            }
        },
        {
            name: "ivr_cq_group_name",
            title: "IVR/CQ Name",
            sortable: true,
            action: (row: any) => {
                return row?.ivr_cq_group_name || "-"
            }
        },
        {
            name: "total_duration",
            title: "Duration",
            sortable: true,
            // action: (row: any) => formatTime(parseInt(row.total_duration), true)
        },
        {
            name: "billsecond",
            title: "Answer Time",
            sortable: true,
            //action: (row: any) => formatTime(parseInt(row.billsecond), true)
        },
        {
            name: "actual_talktime",
            title: "Actual Talk Time",
            sortable: true,
        },
        {
            name: "call_status",
            title: "Call Status",
            sortable: true,
        },
        {
            name: "hold_time",
            title: "Hold Time",
            sortable: true,
            // action: (row: any) => formatTime(parseInt(row.hold_time), true)
        },
        {
            name: "waiting_time",
            title: "Waiting Time",
            sortable: true,
            // action: (row: any) => formatTime(parseInt(row.wait_time), true)
        },
        {
            name: "ringing_time",
            title: "Ringing Time",
            sortable: true,
            // action: (row: any) => formatTime(parseInt(row.ringing_time), true)
        },
        {
            name: "acw_time",
            title: "ACW Time",
            sortable: true,
        },
        {
            name: "campaign_uuid",
            title: "Campaign",
            sortable: true,
            action: (row: any) => {
                // Helper to safely get the first campaign name
                const getFirstName = (campaigns?: any) =>
                    campaigns?.length > 0 ? campaigns[0]?.name || "" : "";

                if (row?.outbound_campaign?.length > 0) {
                    return getFirstName(row.outbound_campaign);
                }

                if (row?.inbound_campaign?.length > 0) {
                    return getFirstName(row.inbound_campaign);
                }

                if (row?.blended_campaign?.length > 0) {
                    return getFirstName(row.blended_campaign);
                }

                if (row?.campaign_uuid === "CTC") {
                    return "CTC";
                }

                return ""; // Fallback if none exist
            }

        },
        {
            name: "lead_group_name",
            title: "Lead Group Name",
            sortable: true,
            action: (row: any) => {
                return row?.lead_details[0]?.lead_group[0]?.name;
            }
        },
        {
            name: "dial_method",
            title: "Dial Method",
            sortable: true,
            action: (row: any) => {
                return getDialMethodLabel(row.dial_method) || "-";
            }

        },
        {
            name: "disconnected_by",
            title: "Disconnected By",
            sortable: true,
            action: (row: any) => {
                return getDisconnectedByLabel(row.disconnected_by) || "-";
            }
        },
        // {
        //     name: "call_mode_name",
        //     title: "Call Mode",
        //     sortable: true,
        // },
        // Table column now PURE
        {
            name: "hangup_cause",
            title: "Disposition",
            sortable: true,
            // action: (row: any) => {
            //     const hierarchyNames = row?.hangup_cause
            //         ? getDispositionHierarchyNames(
            //             row?.hangup_cause,
            //             allDispositions,
            //             ""
            //         )
            //         : [];
            //     return hierarchyNames.length == 1
            //         ? hierarchyNames[0]
            //         : hierarchyNames.length == 2
            //             ? hierarchyNames[1]
            //             : hierarchyNames[2];
            // },
        },
        {
            name: "hangup_cause_1",
            title: "Sub Disposition 1",
            sortable: true,
            // action: (row: any) => {
            //     const hierarchyNames = row?.hangup_cause
            //         ? getDispositionHierarchyNames(
            //             row?.hangup_cause,
            //             allDispositions,
            //             ""
            //         )
            //         : [];
            //     return hierarchyNames.length == 1
            //         ? ""
            //         : hierarchyNames.length == 2
            //             ? hierarchyNames[0]
            //             : hierarchyNames[1];
            // },
        },
        {
            name: "hangup_cause_2",
            title: "Sub Disposition 2",
            sortable: true,
            // action: (row: any) => {
            //     const hierarchyNames = row?.hangup_cause
            //         ? getDispositionHierarchyNames(
            //             row?.hangup_cause,
            //             allDispositions,
            //             ""
            //         )
            //         : [];
            //     return hierarchyNames.length == 1
            //         ? ""
            //         : hierarchyNames.length == 2
            //             ? ""
            //             : hierarchyNames[0];
            // },

        },
        {
            name: "direction",
            title: "Direction",
            sortable: true,
        },
        {
            name: "is_csat",
            title: "CSAT Score",
            sortable: true,
            action: (row: any) => row?.ivr_feedback_score || "-"
        },
        {
            name: "custom_callid",
            title: "Comment",
            sortable: true,
            action: (row: any) => {
                return row?.custom_callid != "" ? row?.notes?.[0]?.comment : "-";
                // return row?.notes?.[0]?.comment || "-";
            }
        },
         {
            name: "knowledge_base",
            title: "Knowledge Base",
            sortable: true,
            action: (row: any) => {
                const kb = row?.knowledge_base || (row?.custom_callid != "" ? row?.notes?.[0]?.knowledge_base : "") || "";
                if (!kb) return "-";
                const isUrl = /^https?:\/\//i.test(kb);
                return isUrl ? (
                    <a
                        href={kb}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline max-w-[200px] truncate block"
                        title={kb}
                    >
                        {kb}
                    </a>
                ) : (
                    <span title={kb} className="max-w-[200px] truncate block">
                        {kb}
                    </span>
                );
            }
        },
        {
            name: "recording_path",
            title: "Recording",
            sortable: true,
            action: (row: any) => {
                // Extract filename from recording_path
                const fileName = row?.recording_path
                    ? row.recording_path.split("/").pop() || ""
                    : "";
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
                            name={fileName}
                            index={row?.index}
                        />
                    </>
                );
            },
        },
        {
            name: "call_feedback",
            title: "Feedback",
            sortable: false,
            action: (row: any) => {
                if (!row?.feedback) return "-";
                return (
                    <Icon
                        tooltip="View feedback"
                        name="Csat"
                        width={20}
                        height={20}
                        alt="Feedback"
                        onClick={() => openFeedbackModal(row)}
                    />
                );
            },
        },
        // {
        //     name: "call_type",
        //     title: "Call Type",
        //     sortable: true,
        // },
        //{
        //    name: "name",
        //    title: "Telecom Circle",
        //    sortable: true,
        //},
    ];

    const [frontendHangupFilters, setFrontendHangupFilters] = useState<any>({
        hangup_cause: "",
        hangup_cause_1: "",
        hangup_cause_2: "",
    });

    // Fetching User Options
    const onGetUserOptions = async () => {
        try {
            await dispatch(userOptionsGet());
        } catch (err) {
            console.error("Get User Options Err =-=>", err);
        }
    };

    const onGetCampaignOptions = async () => {
        try {
            await dispatch(campaignOptionsGet()).unwrap();
        } catch (err) {
            console.error("Get campaign Options Err =-=>", err);
        }
    };

    useEffect(() => {
        onGetIvrGroupOptions();
        onGetUserOptions();
        onGetCdrsArchiveOptions();
        onGetCampaignOptions()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [fetched, setFetched] = useState(false);

    useEffect(() => {
        if (fetched) return; // prevent duplicate API hit in dev strict mode

        const allDispositionList = async () => {
            await dispatch(dispositionOptionsGet());
        };
        allDispositionList();
        setFetched(true);
    }, [fetched]);


    // Memoize dispositions to prevent re-fetch
    const findDispositionByUUID: any = (uuid: any, dispositions: any) => {
        for (const dispo of dispositions) {
            if ((dispo.disposition_uuid === uuid) || (dispo.value === uuid)) return dispo;
            if (dispo.children?.length) {
                const found = findDispositionByUUID(uuid, dispo.children);
                if (found) return found;
            }
        }
        return null;
    };

    const getDispositionHierarchyNames = (uuid: any, dispositions: any, type: any) => {
        const names = [];
        let current = findDispositionByUUID(uuid, dispositions);

        while (current) {
            names.push(type == "uuid" ? current.value || current.disposition_uuid : current.name || current.label);
            if (!current.parent_disposition) break;
            current = findDispositionByUUID(current.parent_disposition, dispositions);
        }

        return names;
    };

    const [selectedDispositions, setSelectedDispositions] = useState<any[]>([]);
    const [filteredRows, setFilteredRows] = useState<any[]>([]);

    const handleDispositionChange = (level: number, value: string) => {
        const updatedSelections = [...selectedDispositions];
        updatedSelections[level] = value;
        updatedSelections.splice(level + 1);
        setSelectedDispositions(updatedSelections);

        // // frontend filters
        // if (level === 0) setFrontendHangupFilters((prev: any) => ({ ...prev, hangup_cause: value }));
        // if (level === 1) setFrontendHangupFilters((prev: any) => ({ ...prev, hangup_cause_1: value }));
        // if (level === 2) setFrontendHangupFilters((prev: any) => ({ ...prev, hangup_cause_2: value }));

        // Update the filter for the changed level and clear all child levels
        const newFilters = { ...frontendHangupFilters };
        if (level === 0) {
            newFilters.hangup_cause = value;
            newFilters.hangup_cause_1 = "";
            newFilters.hangup_cause_2 = "";
        }
        if (level === 1) {
            newFilters.hangup_cause_1 = value;
            newFilters.hangup_cause_2 = "";
        }
        if (level === 2) {
            newFilters.hangup_cause_2 = value;
        }
        setFrontendHangupFilters(newFilters);

        // still keep updating your data if needed
        handleChnage(level == 0 ? `hangup_cause` : `hangup_cause_${level}`, value);
    };

    const renderDispositionDropdowns = () => {
        const dropdowns = [];
        let currentOptions = allDispositions;

        for (let level = 0; level <= selectedDispositions.length; level++) {
            if (!currentOptions || currentOptions.length === 0) break;

            dropdowns.push(
                <Select
                    key={`hangup-cause-${level}`}
                    name={level == 0 ? `hangup_cause` : `hangup_cause_${level}`}
                    label={`Level ${level} Hangup Cause`}
                    placeholder={`Select Level ${level} Hangup Cause`}
                    removable
                    value={selectedDispositions[level] || ""}
                    options={currentOptions.map((d: any) => ({
                        label: d.name || d.label,
                        value: d.disposition_uuid || d.value,
                    }))}
                    onChange={(e: any) => handleDispositionChange(level, e.target.value)}
                    isInfo
                />
            );

            const selectedVal = selectedDispositions[level];
            if (!selectedVal) break;

            const selectedItem: any = currentOptions.find(
                (d: any) => (d.disposition_uuid || d.value) === selectedVal
            );
            currentOptions = selectedItem?.children || [];
        }

        return dropdowns;
    };

    // Fetching IVR group Options
    const onGetIvrGroupOptions = async () => {
        try {
            await dispatch(ivrGroupListGet());
        } catch (err) {
            console.error("Get User Options Err =-=>", err);
        }
    };


    // Fetching CDRS Archive Options
    const onGetCdrsArchiveOptions = async () => {
        try {
            await dispatch(cdrsArchiveListGet());
        } catch (err) {
            console.error("Get Cdrs Archive Options Err =-=>", err);
        }
    };

    useLayoutEffect(() => {
        if (filter?.isAdvance) {
            onSearchData();
        } else {
            onGetData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    const cdrsCsvData = allCdrs?.data?.map((row: any) => {
        const campaign_name =
            row.outbound_campaign?.[0]?.name ||
            row.inbound_campaign?.[0]?.name ||
            row.blended_campaign?.[0]?.name ||
            "";

        const dial_method_label = getDialMethodLabel(row.dial_method);
        const lead_group_name = row?.lead_details[0]?.lead_group[0]?.name;
        const user_group_name = row?.user[0]?.user_group[0]?.name;
        const disconnected_by_label = getDisconnectedByLabel(row.disconnected_by);
        const direction = String(row.direction || "").toLowerCase();
        const raw_actual_talk_time = direction === "inbound" ? row.actual_talk_time : row.billsecond;
        const actual_talk_time = (typeof raw_actual_talk_time === "string" && raw_actual_talk_time.includes(":"))
            ? raw_actual_talk_time
            : formatTime(parseInt(raw_actual_talk_time) || 0, true);

        // const hierarchyNames = getDispositionHierarchyNames(row.hangup_cause, allDispositions, "");
        const hangup_cause_0 = row?.hangup_cause;
        // const hangup_cause_1 = hierarchyNames.length >= 2 ? hierarchyNames[hierarchyNames.length - 2] : "";
        // const hangup_cause_2 = hierarchyNames.length >= 3 ? hierarchyNames[0] : "";
        const isI = direction.includes("inbound");
        const caller_id_number = isI ? (row.destination_number || "-") : (row.caller_id_number || "-");
        const destination_number = isI ? (row.caller_id_number || "-") : (row.destination_number || "-");
        return {
            ...row,
            campaign_name,
            dial_method_label,
            lead_group_name,
            user_group_name,
            disconnected_by_label,
            caller_id_number,
            destination_number,
            actual_talk_time,
            hangup_cause_0,
            //hangup_cause_1,
            //hangup_cause_2,
            is_csat: row?.ivr_feedback_score || "-",
            comment: row?.notes?.[0]?.comment || "",
            feedback_rating: row?.feedback?.formData?.rating ?? "",
            feedback_comment: row?.feedback?.formData?.comment || "",
        };
    });



    // Preapring Data for Export File
    const prepareExportProps = () => {
        return {
            headers,
            data: cdrsCsvData,   // not "cdrsCsvData"
            filename: "CDRs.csv",
        };
    };


    // Fetching CDRS Data
    const onGetData = useDebouncedCallback(async () => {
        setLoading(true);
        try {
            const params = { ...filter };
            delete params["isAdvance"];
            await dispatch(tenantCdrsGet(params)).unwrap();
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.error("Get CDRS Err =-=>", err);
        }
    }, 500);

    const onGetAllCdrs = async () => {
        setCsvLoading(true);
        try {
            // Build the same payload as onSearchData
            const payload: any = {};

            if (filter?.isAdvance) {
                const fields = [
                    "callstart", "callend", "caller_id_name", "caller_id_number",
                    "destination_number", "billsecond", "call_mode", "disposition",
                    "direction","call_status", "call_type", "user_uuid", "pbx_feature_uuid",
                    "collection_name_for_display", "campaign_uuid",
                ];
                fields.forEach((field) => {
                    let val = field === "callstart" || field === "callend"
                        ? formatDate(data[field]?.["val"], true)
                        : data[field]?.["val"];
                    if (val != null && val !== "" && !(Array.isArray(val) && val.length === 0)) {
                        payload[data[field]?.["key"]] = val;
                    }
                });
                // Add hangup/disposition frontend filters if set
                if (frontendHangupFilters.hangup_cause) payload["hangup_cause"] = frontendHangupFilters.hangup_cause;
                if (frontendHangupFilters.hangup_cause_1) payload["hangup_cause_1"] = frontendHangupFilters.hangup_cause_1;
                if (frontendHangupFilters.hangup_cause_2) payload["hangup_cause_2"] = frontendHangupFilters.hangup_cause_2;
            } else {
                // Simple search: just pass date filter if set
                if (data["callstart"]?.["val"]) payload["callstart"] = formatDate(data["callstart"]["val"], true);
                if (data["callend"]?.["val"]) payload["callend"] = formatDate(data["callend"]["val"], true);
                if (filter?.search) payload["search"] = filter.search;
            }

            // Read auth token from cookies (same as apiInstance interceptor)
            const getCookie = (name: string) => {
                const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
                return match ? decodeURIComponent(match[2]) : null;
            };
            const user = JSON.parse(getCookie("user") || "{}");
            const token = user?.access_token ?? "";

            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";
            const payloadData = { ...payload, baseUrl };

            const response = await fetch(`${baseUrl}/cdrs/export-csv`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token ? `Bearer ${token}` : "",
                },
                body: JSON.stringify(payloadData),
            });

            if (!response.ok) {
                throw new Error(`Export failed: ${response.statusText}`);
            }

            // Stream response into a blob then trigger file download
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "CDRs.csv";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Get All CDRS Err =-=>", err);
        } finally {
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
        const hasBackendFields =
            data["collection_name_for_display"]["val"] ||
            data["callstart"]["val"] ||
            data["callend"]["val"] ||
            data["caller_id_name"]["val"] ||
            data["caller_id_number"]["val"] ||
            data["destination_number"]["val"] ||
            data["billsecond"]["val"] ||
            data["call_mode"]["val"] ||
            data["direction"]["val"] ||
            data["call_type"]["val"] ||
            data["user_uuid"]["val"] ||
            data["pbx_feature_uuid"]["val"] ||
            data["campaign_uuid"]["val"]?.length > 0 ||
            data["call_status"]["val"] ||
            // data["lead_group_name"]["val"] ||
            // data["disconnected_by"]["val"] ||
            // data["dial_method"]["val"] ||
            frontendHangupFilters.hangup_cause ||
            frontendHangupFilters.hangup_cause_1 ||
            frontendHangupFilters.hangup_cause_2;

        const hasFrontendHangupFields = false; // Disposition filters are now sent to backend

        // ❌ If no filters at all
        if (!hasBackendFields && !hasFrontendHangupFields) {
            Danger(SEARCH_ERROR_MESSAGE);
            return false;
        }

        setLoading(true);
        try {
            let result: any = null, payload: any = {};

            // 🔥 Call backend only if backend filters exist
            if (hasBackendFields) {
                payload = {
                    [data["callstart"]["key"]]: formatDate(data["callstart"]["val"], true),
                    [data["callend"]["key"]]: formatDate(data["callend"]["val"], true),
                    [data["caller_id_name"]["key"]]: data["caller_id_name"]["val"],
                    [data["caller_id_number"]["key"]]: data["caller_id_number"]["val"],
                    [data["destination_number"]["key"]]: data["destination_number"]["val"],
                    [data["billsecond"]["key"]]: data["billsecond"]["val"],
                    [data["call_mode"]["key"]]: data["call_mode"]["val"],
                    [data["direction"]["key"]]: data["direction"]["val"],
                    [data["call_status"]["key"]]: data["call_status"]["val"],
                    [data["call_type"]["key"]]: data["call_type"]["val"],
                    [data["user_uuid"]["key"]]: data["user_uuid"]["val"],
                    [data["pbx_feature_uuid"]["key"]]: data["pbx_feature_uuid"]["val"],
                    [data["collection_name_for_display"]["key"]]: data["collection_name_for_display"]["val"],
                    [data["campaign_uuid"]["key"]]: data["campaign_uuid"]["val"],
                    // [data["lead_group_name"]["key"]]: data["lead_group_name"]["val"],
                    // [data["disconnected_by"]["key"]]: data["disconnected_by"]["val"],
                    // [data["dial_method"]["key"]]: data["dial_method"]["val"],
                    // Send only the most specific (deepest) disposition value as hangup_cause
                    hangup_cause: frontendHangupFilters.hangup_cause_2 || frontendHangupFilters.hangup_cause_1 || frontendHangupFilters.hangup_cause || undefined,
                    page: filter?.page,
                    limit: filter?.limit,
                    quarter_collection_name: cdrsValues?.quarter_collection_name || "",
                    quarter_selected: cdrsValues?.quarter_selected || "",
                };

                Object.entries(payload).forEach(([key, val]: any) => {
                    if (
                        val == null ||
                        val === "" ||
                        (Array.isArray(val) && val.length === 0)
                    ) {
                        delete payload[key];
                    }
                });
            }
            result = await dispatch(tenantCdrsSearch(payload)).unwrap();

            // ✅ Frontend filtering for hangup cause
            // let rows = result?.data || [];
            // console.log("aldshhasdbad", hasFrontendHangupFields);
            // console.log("aldnnnnnnnnnnnnnnnnnnn", rows);
            // if (hasFrontendHangupFields) {
            //     rows = rows.filter((row: any) => {
            //         const hierarchyNames = getDispositionHierarchyNames(
            //             row?.hangup_cause,
            //             allDispositions, "uuid"
            //         );

            //         const level0 = hierarchyNames[hierarchyNames.length - 1] || "";
            //         const level1 = hierarchyNames[hierarchyNames.length - 2] || "";
            //         const level2 = hierarchyNames[hierarchyNames.length - 3] || "";

            //         if (frontendHangupFilters.hangup_cause &&
            //             frontendHangupFilters.hangup_cause !== level0 &&
            //             frontendHangupFilters.hangup_cause !== row.hangup_cause) {
            //             return false;
            //         }
            //         if (frontendHangupFilters.hangup_cause_1 &&
            //             frontendHangupFilters.hangup_cause_1 !== level1) {
            //             return false;
            //         }
            //         if (frontendHangupFilters.hangup_cause_2 &&
            //             frontendHangupFilters.hangup_cause_2 !== level2) {
            //             return false;
            //         }
            //         return true;
            //     });
            // }
            // console.log("rowsrows", rows);

            // 👇 Store filtered rows in local state (instead of Table using cdrs.data directly)
            // setFilteredRows(rows);

            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Search data Err --->", e.message);
        }
    };
    // console.log("aldshhasdbad", cdrs.data);


    // Advance Search Fields Empty & Fetching CDRS Data
    const onEmptySearch = () => {
        setData(initialValues);
        setSelectedDispositions([]);
        setFrontendHangupFilters({ hangup_cause: "", hangup_cause_1: "", hangup_cause_2: "" });
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
                isLoading={loading}
            >
                {/* <Select
                    name="collection_name_for_display"
                    label="CDRS Archive"
                    placeholder="Select CDRS Archive"
                    removable
                    value={data.collection_name_for_display.val}
                    options={cdrsArchiveOptions}
                    onChange={(e: any) => {
                        console.log(e, '22');
                        handleChnage("collection_name_for_display", e.value)
                        if (e && e.name) {
                            setCdrsValues({
                                ...cdrsValues,
                                quarter_collection_name: e.name,
                                quarter_selected: "yes"
                            })
                        }
                        else {
                            setCdrsValues({
                                ...cdrsValues,
                                quarter_collection_name: "",
                                quarter_selected: "no"
                            })
                        }
                    }
                    }
                    isInfo
                    isManual
                /> */}

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
                {/* <InputSelect
                    name="caller_id_name"
                    label="Caller Id Name"
                    placeholder="Select Caller Id Name"
                    value={data.caller_id_name.val}
                    dropdownValue={data.caller_id_name.dropdown}
                    options={advanceSearchOptions}
                    onChange={(e: any) => handleChnage("caller_id_name", e.target.value)}
                    onDropdownChange={(e: any) =>
                        handleSelect("caller_id_name", e.target.value)
                    }
                    isInfo
                /> */}
                <InputSelect
                    name="caller_id_number"
                    label="Caller's Number"
                    placeholder="Select Caller's Number"
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
                    placeholder="Select Receiver's Number"
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
                <Select
                    name="user_uuid"
                    label="User ID"
                    placeholder="Select User ID"
                    removable
                    value={data.user_uuid.val || []}
                    options={userOptions}
                    onChange={(val: any) => handleChnage("user_uuid", val)}
                    isInfo
                    isMulti
                />
                <Select
                    name="pbx_feature_uuid"
                    label="IVR/CQ Name"
                    placeholder="Select IVR Name"
                    removable
                    value={data.pbx_feature_uuid.val}
                    options={ivrGroupOptions}
                    onChange={(e: any) => handleChnage("pbx_feature_uuid", e.target.value)}
                    isInfo
                    isGroup
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
                {/* <Select
                    name="call_mode"
                    label="Call Mode"
                    placeholder="Select call mode"
                    value={data.call_mode.val}
                    options={callModeOptions}
                    onChange={(e: any) => handleChnage("call_mode", e.target.value)}
                    isInfo
                /> */}
                {/* <Select
                    name="disposition"
                    label="Hangup Cause"
                    placeholder="Select Hangup Cause"
                    removable
                    value={data.disposition.val}
                    options={dispositionOptions}
                    onChange={(e: any) => handleChnage("disposition", e.target.value)}
                    isInfo
                /> */}
                {renderDispositionDropdowns()}
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
                    name="call_status"
                    label="Call Status"
                    placeholder="Select Call Status"
                    removable
                    value={data.call_status.val}
                    options={callStatusOptions}
                    onChange={(e: any) =>
                    handleChnage("call_status", e.target.value) }
                    isInfo
                />
                <Select
                    name="campaign_uuid"
                    label="Campaign Options"
                    icon="Group"
                    placeholder="Select Campaign"
                    options={campaignOptions}
                    value={data.campaign_uuid.val || []}
                    onChange={(e: any) => {
                        handleChnage("campaign_uuid", e);
                    }}
                    isInfo
                    isGroup
                    isMulti
                />
                {/* <Select
                    name="lead_group_name"
                    label="Lead Group Name"
                    placeholder="Select Lead Group"
                    removable
                    value={data.lead_group_name.val}
                    options={[]} // Note: Populate with actual lead group options from API if available
                    onChange={(e: any) => handleChnage("lead_group_name", e.target.value)}
                    isInfo
                />
                <Select
                    name="disconnected_by"
                    label="Disconnected By"
                    placeholder="Select Disconnected By"
                    removable
                    value={data.disconnected_by.val}
                    options={disconnectedByOptions}
                    onChange={(e: any) => handleChnage("disconnected_by", e.target.value)}
                    isInfo
                />
                <Select
                    name="dial_method"
                    label="Dial Method"
                    placeholder="Select Dial Method"
                    removable
                    value={data.dial_method.val}
                    options={dialMethodOptions}
                    onChange={(e: any) => handleChnage("dial_method", e.target.value)}
                    isInfo
                /> */}

                {/* <Select
                    name="call_type"
                    label="Call Type"
                    placeholder="Select Call Type"
                    removable
                    value={data.call_type.val}
                    options={callTypeOptions}
                    onChange={(e: any) => handleChnage("call_type", e.target.value)}
                    isInfo
                /> */}
            </Head>
            <div className="mt-5">
                <Table
                    managerName={managerName}
                    isLoading={loading}
                    columns={columns}
                    // data={filter.isAdvance ? filteredRows : cdrs.data || []}
                    data={cdrs?.data?.length ? cdrs.data : []}
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

            {showFeedbackModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-h-[80vh] overflow-y-auto relative">
                        <button
                            className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl"
                            onClick={() => setShowFeedbackModal(false)}
                        >
                            &times;
                        </button>
                        <h2 className="text-lg font-semibold mb-4">Call Feedback</h2>

                        {feedbackFormData ? (
                            <ul className="space-y-2 text-sm">
                                <li><span className="font-medium">Rating: </span>{feedbackFormData.rating ?? "-"}</li>
                                <li><span className="font-medium">Comment: </span>{feedbackFormData.comment || "-"}</li>
                            </ul>
                        ) : (
                            <p className="text-gray-500 text-sm">No feedback record found.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CdrsReport;

