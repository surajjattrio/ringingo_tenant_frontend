"use client";
import MultiSelect, { Option } from "../../../forms/MultiSelect";
import { useEffect, useLayoutEffect, useState } from "react";

// PROJECT IMPORT
import {
  useUserOptions,
  userOptionsGet,
} from "@/redux/slice/tenant-admin/userSlice";
import {
  useAllUserPerformance,
  useUserPerformance,
  userPerformanceAllGet,
  userPerformanceAllSearch,
  userPerformanceGet,
  userPerformanceSearch,
} from "@/redux/slice/tenant-admin/userPerformanceSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Danger } from "@/redux/services/toasterServices";
import UserPerformancePopup from "@/components/tenant-admin/user-performance/UserPerformancePopup";
import { Select } from "@/components/forms";
import { DatePicker } from "@/components/pickers";
import { Head, Icon, Table } from "@/components/ui-components";
import { formatDate } from "@/helperFunctions";
import { SEARCH_ERROR_MESSAGE } from "@/config/constant";
import DispositionInformation from "@/components/tenant-admin/user-performance/DispositionInformation";
import BreakInformation from "@/components/tenant-admin/user-performance/BreakInformation";

// THIRD-PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";
import Cookies from "js-cookie";

// TYPES IMPORT
import { UserPerformanceFilterTypes } from "@/types/advancedFilterTypes";
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";
import { ManagerPageTypes } from "@/types/formTypes";
import { directionOptions } from "@/config/options";
import { campaignOptionsGet, useCampaignOptions } from "@/redux/slice/tenant-admin/campaignReportSlice";

// NAME STATE
const now = new Date();
const startOfToday = new Date(now);
startOfToday.setHours(0, 0, 0, 0);
const endOfToday = new Date(now);
endOfToday.setHours(23, 59, 59, 999);

// NAME STATE
const initialValues: UserPerformanceFilterTypes = {
  startdate: {
    key: "startdate",
    val: startOfToday,
    dropdown: "4",
  },
  enddate: {
    key: "enddate",
    val: endOfToday,
    dropdown: "4",
  },
  user_uuid: { key: "user_uuid", val: [], dropdown: "4" },
  direction: { key: "direction", val: "", dropdown: "4" },
  campaign_uuid: { key: "campaign_uuid", val: [], dropdown: "" },
};

// DATA
const baseHeaders: any = [
  { label: "Date", key: "report_date" },
  { label: "User", key: "username" },
  { label: "Inbound Call Count", key: "inbound_call_count" },
  { label: "Outbound Call Count", key: "outbound_call_count" },
  { label: "Agent Disconnection Count", key: "disconnected_by_agent" },
  { label: "Average Call Duration", key: "acd" },
  { label: "Login Hours", key: "login_hours" },
  { label: "Net Login Hours", key: "net_login_hours" },
  { label: "Idle Hours", key: "total_idle_time" },
  { label: "Talktime", key: "talk_time" },
  { label: "BreakTime", key: "break_time" },
  { label: "ACW", key: "total_acw_time" },
  { label: "Pause Duration", key: "total_pause_time" },
  { label: "Total Calls", key: "totalCalls" },
  { label: "Successful Calls", key: "successfulCalls" },
  // { label: "Billable Seconds", key: "billableSeconds" },
  // { label: "Answered Calls", key: "answeredCalls" },
  { label: "Total Ringing Time", key: "totalRingingTime" },
  // { label: "Total Duration", key: "totalDuration" },
  { label: "Total Hold Time", key: "totalHoldTime" },
  { label: "Average Hold Time", key: "avgHoldTime" },
  { label: "Avg Ringing Time", key: "avgRingingTime" },
  { label: "Avg CSAT Score", key: "csat_avg_score" },
  // { label: "Total Wait Time", key: "totalWaitingTime" },
  // { label: "Avg Wait Time", key: "avgWaitingTime" },
];

const UserPerformance = (props: ManagerPageTypes) => {
  const { managerName = null, name = null } = props;
  const dispatch = useAppDispatch();
  const userOptions = useUserOptions();
  let campaignOptions = useCampaignOptions();

  const userPerformance = useUserPerformance();
  const allUserPerformance = useAllUserPerformance();
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
  const [columnsVisible, setColumnsVisible] = useState<boolean>(false);
  const [infoData, setInfoData] = useState<any>(null);
  const [breakDetails, setBreakDetails] = useState<any>(null);

  const [optionSelected, setSelected] = useState<Option[] | null>();
  const handleChange = (selected: Option[]) => {
    setSelected(selected);
  };

  const columns: ColumnsType[] = [
    {
      name: "report_date",
      title: "Date",
      sortable: true,
    },
    {
      name: "username",
      title: "User",
      sortable: true,
    },
    {
      name: "fullname",
      title: "Full Name",
      sortable: true,
    },
    {
      name: "totalCalls",
      title: "Total Calls",
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
      name: "disconnected_by_agent",
      title: "Agent Disconnection Count",
      sortable: true,
    },
    {
      name: "successfulCalls",
      title: "Answered Calls",
      sortable: true,
    },
    // {
    //   name: "totalDuration",
    //   title: "Total Duration(HH:MM:SS)",
    //   sortable: true,
    // },
    {
      name: "acd",
      title: "ACD",
      sortable: true,
    },
    {
      name: "login_hours",
      title: "Login Time(HH:MM:SS)",
      sortable: true,
    },
    {
      name: "net_login_hours",
      title: "Net Login Time(HH:MM:SS)",
      sortable: true,
    },
    {
      name: "total_idle_time",
      title: "Idle Time(HH:MM:SS)",
      sortable: true,
    },
    {
      name: "talk_time",
      title: "Talk time(HH:MM:SS)",
      sortable: true,
    },
    {
      name: "actual_talktime",
      title: "Actual Talktime(HH:MM:SS)",
      sortable: true,
    },
    {
      name: "break_time",
      title: "Break Time(HH:MM:SS)",
      sortable: true,
    },
    {
      name: "break_info",
      title: "Break Info",
      action: (row: any) => {
        return (
          <>
            <div className="flex gap-2">
              <Icon
                className="cursor-pointer"
                tooltip="Break Details"
                name="InfoCircle"
                width={20}
                height={20}
                alt="break info"
                onClick={() => {
                  setBreakDetails(row?.break_details);
                  setInfoData(null);
                }}
              />
            </div>
          </>
        );
      },
    },
    {
      name: "total_acw_time",
      title: "ACW(HH:MM:SS)",
      sortable: true,
    },
    {
      name: "total_pause_time",
      title: "Pause Duration(HH:MM:SS)",
      sortable: true,
    },
    // {
    //   name: "successfulCalls",
    //   title: "Successful Calls",
    //   sortable: true,
    // },
    // {
    //   name: "billableSeconds",
    //   title: "Billable Seconds",
    //   sortable: true,
    // },
    {
      name: "totalRingingTime",
      title: "Total Ringing Time(HH:MM:SS)",
      sortable: true,
    },
    {
      name: "avgRingingTime",
      title: "Avg Ringing Time(HH:MM:SS)",
      sortable: true,
    },
    {
      name: "totalHoldTime",
      title: "Total Hold Time(HH:MM:SS)",
      sortable: true,
    },
    {
      name: "avgHoldTime",
      title: "Avg Hold Time(HH:MM:SS)",
      sortable: true,
    },
    {
      name: "csat_avg_score",
      title: "Avg CSAT Score",
      sortable: true,
    },
    // {
    //   name: "totalWaitingTime",
    //   title: "Total Wait Time(HH:MM:SS)",
    //   sortable: true,
    // },
    // {
    //   name: "avgWaitingTime",
    //   title: "Avg Wait Time(HH:MM:SS)",
    //   sortable: true,
    // },
    {
      name: "disposition",
      title: "Disposition",
      action: (row: any) => {
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
                  setInfoData(row?.user_uuid);
                  setBreakDetails(null);
                }}
              />
            </div>
          </>
        );
      },
    },
  ];

  //On component mount check filter data
  useEffect(() => {
    let storageData = Cookies.get("searched_filter_UPR");
    if (storageData != null && storageData != undefined) {
      try {
        let payload = JSON.parse(storageData);
        // payload["user_uuid"] is a comma-separated string like "uuid1,uuid2"
        const storedUserUuidsStr = payload["user_uuid"] || "";
        const userUuidVals = storedUserUuidsStr ? storedUserUuidsStr.split(",") : [];

        // For MultiSelect, the state is expected to be an array of objects e.g. [{label: "...", value: "uuid"}]
        // Since we only have values, we'll restore it as an array of values, or map them if userOptions match.
        // Usually, just mapping back to { value: id, label: id } is enough if full data isn't easily synchronous, 
        // or we just rely on MultiSelect's ability to match values.
        const userIdsToSet = userUuidVals.map((id: string) => ({ value: id, label: "Loading..." }));

        setData({
          ...data,
          startdate: {
            key: "startdate",
            val: payload?.startdate
              ? new Date(payload?.startdate)
              : new Date().setHours(0, 0, 1),
            dropdown: "4",
          },
          enddate: {
            key: "enddate",
            val: payload?.enddate
              ? new Date(payload?.enddate)
              : new Date().setHours(23, 59, 59),
            dropdown: "4",
          },
          user_uuid: {
            key: "user_uuid",
            val: userIdsToSet,
            dropdown: "4"
          },
          direction: {
            key: "direction",
            val: payload?.direction || "",
            dropdown: "4",
          },
          campaign_uuid: {
            key: "campaign_uuid",
            val: payload?.campaign_uuid || [],
            dropdown: "",
          },
        });
        setFilter({ ...filter, isAdvance: true });
      } catch (err) {
        console.error("Error parsing stored filter data", err);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update labels for user_uuid when userOptions are available
  useEffect(() => {
    if (userOptions && userOptions.length > 0 && data.user_uuid.val.length > 0) {
      const isAnyLoading = data.user_uuid.val.some((u: any) => u.label === "Loading...");
      if (isAnyLoading) {
        const updatedUserUuids = data.user_uuid.val.map((u: any) => {
          if (u.label === "Loading...") {
            const found = userOptions.find((opt: any) => opt.value === u.value);
            return found ?? u;
          }
          return u;
        });

        setData((prev: any) => ({
          ...prev,
          user_uuid: { ...prev.user_uuid, val: updatedUserUuids }
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userOptions]);

  useLayoutEffect(() => {
    /*if (filter?.isAdvance) {
                onSearchData();
            } else {
                onGetData();
            }*/
    if (filter?.isAdvance) {
      // if (filter?.isAdvance && data["user_uuid"]["val"].length != 0) {
      // onGetData();
      onSearchData()
    } else if (!filter?.isAdvance) {
      onGetData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useEffect(() => {
    onGetUserOptions();
    onGetCampaignOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Preapring Data for Export File
  const prepareExportProps = () => {
    const rawData = allUserPerformance?.data || [];

    // 1. Collect all unique break type names across every row
    const allBreakKeys = new Set<string>();
    rawData.forEach((item: any) => {
      if (item?.break_details) {
        try {
          const details = typeof item?.break_details === 'string'
            ? JSON.parse(item?.break_details)
            : item?.break_details;
          Object.keys(details).forEach((k) => allBreakKeys.add(k));
        } catch {
          // ignore malformed
        }
      }
    });

    // 2. Build dynamic headers: one column per break type
    const breakHeaders = Array.from(allBreakKeys).map((breakName) => ({
      label: breakName,
      key: `break__${breakName}`,
    }));

    // 3. Map rows: flatten each break type into its own key
    const formattedData = rawData.map((item: any) => {
      const breakCols: Record<string, string> = {};
      // Initialise all break keys to "-"
      allBreakKeys.forEach((k) => {
        breakCols[`break__${k}`] = "00:00:00";
      });

      if (item?.break_details) {
        try {
          const details =
            typeof item.break_details === "string"
              ? JSON.parse(item.break_details)
              : item.break_details;
          Object.entries(details).forEach(([k, v]) => {
            breakCols[`break__${k}`] = v as string;
          });
        } catch (e) {
          console.error("Error parsing break_details for CSV", e);
        }
      }

      return { ...item, ...breakCols };
    });

    const headers = [...baseHeaders, ...breakHeaders];
    return { headers, data: formattedData, filename: "User Performance.csv" };
  };

  // Fetching User Options
  const onGetUserOptions = async () => {
    try {
      await dispatch(userOptionsGet());
    } catch (err) {
      console.error("Get User Options Err =-=>", err);
    }
  };

  // Fetching Campaign Options
  const onGetCampaignOptions = async () => {
    try {
      await dispatch(campaignOptionsGet()).unwrap();
    } catch (err) {
      console.error("Get Campaign Options Err =-=>", err);
    }
  };

  // Fetching User Performance Data
  const onGetData = useDebouncedCallback(async () => {
    // if (filter?.isAdvance && !data["user_uuid"]["val"]?.length) {
    //     Danger("Please select any user");
    //     return false;
    // }else{
    setLoading(true);
    try {
      const userIds: any = [];
      for (let index = 0; index < data?.["user_uuid"]?.["val"]?.length; index++) {
        const user = data["user_uuid"]["val"][index];
        userIds.push(user['value']);
      }
      //Search Data
      const payload: any = {
        [data["startdate"]["key"]]: formatDate(data["startdate"]["val"], true),
        [data["enddate"]["key"]]: formatDate(data["enddate"]["val"], true),
        [data["user_uuid"]["key"]]: userIds?.length
          ? userIds?.join(",")
          : "",
        ...(data["direction"]?.["val"] ? { direction: data["direction"]["val"] } : {}),
        ...(data["campaign_uuid"]?.["val"]?.length ? { campaign_uuid: data["campaign_uuid"]["val"] } : {}),
        ...filter,
      };
      Object.entries(payload)?.forEach(([key, val]: any) => {
        if (!val) {
          delete payload[key];
        }
      });

      // const params = { ...filter };
      delete payload["isAdvance"];
      await dispatch(userPerformanceGet(payload)).unwrap();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("Get User Performance Err =-=>", err);
    }
    // }
  }, 500);

  // Fetching All User Performance Data
  const onGetAllUserPerformance = async () => {
    setCsvLoading(true);
    try {
      if (filter?.isAdvance) {
        const userIds = [];
        for (let index = 0; index < data?.["user_uuid"]?.["val"]?.length; index++) {
          const user = data["user_uuid"]["val"][index];
          userIds.push(user['value']);
        }
        const payload: Record<string, any> = {
          [data["startdate"]["key"]]: formatDate(data["startdate"]["val"], true),
          [data["enddate"]["key"]]: formatDate(data["enddate"]["val"], true),
          [data["user_uuid"]["key"]]: userIds?.length ? userIds?.join(',') : "",
          ...(data["direction"]?.["val"] ? { direction: data["direction"]["val"] } : {}),
          ...(data["campaign_uuid"]?.["val"]?.length ? { campaign_uuid: data["campaign_uuid"]["val"] } : {}),
          page: filter?.page,
          limit: userPerformance?.count || 0,
        };
        Object.entries(payload).forEach(([key, val]) => {
          if (val === undefined || val === null || val === "") {
            delete payload[key];
          }
        });
        await dispatch(userPerformanceAllSearch(payload)).unwrap();
        setCsvLoading(false);
        setIsCsvDownload(true);
      } else {
        const params = { ...filter };
        params["limit"] = userPerformance?.count || 0;
        delete params["isAdvance"];
        await dispatch(userPerformanceAllGet(params)).unwrap();
        setCsvLoading(false);
        setIsCsvDownload(true);
      }
    } catch (err) {
      console.error("Get All User Performance Err =-=>", err);
      setCsvLoading(false);
    }
  };

  // Advance Search - Trigger when left side Input or Select value change
  const handleChnage = (key: string, val: string | Option[]) => {
    setData({
      ...data,
      [key]: { ...data[key], val: val },
    });
  };

  // Advance Search - Searching Data API call
  const onSearchData = async () => {
    if (
      data["user_uuid"]["val"].length == 0 ||
      data["startdate"]["val"] == "" ||
      data["enddate"]["val"] == ""
    ) {
      //  Danger("Please select all fileds to perform search");
      return false;
    } else {
      setLoading(true);
      try {
        const userIds = [];
        for (let index = 0; index < data["user_uuid"]["val"]?.length; index++) {
          const user = data["user_uuid"]["val"][index];
          userIds.push(user['value']);
        }
        const payload: Record<string, any> = {
          [data["startdate"]["key"]]: formatDate(data["startdate"]["val"], true),
          [data["enddate"]["key"]]: formatDate(data["enddate"]["val"], true),
          [data["user_uuid"]["key"]]: userIds?.length
            ? userIds?.join(",")
            : "",
          ...(data["direction"]?.["val"] ? { direction: data["direction"]["val"] } : {}),
          ...(data["campaign_uuid"]?.["val"]?.length ? { campaign_uuid: data["campaign_uuid"]["val"] } : {}),
        };
        Object.entries(payload).forEach(([key, val]) => {
          if (val === undefined || val === null || val === "") {
            delete payload[key];
          }
        });
        Cookies.set("searched_filter_UPR", JSON.stringify(payload));
        await dispatch(userPerformanceSearch(payload)).unwrap();
        setLoading(false);
      } catch (e: any) {
        setLoading(false);
        console.error("Search data Err --->", e.message);
      }
    }
  };

  // Advance Search Fields Empty & Fetching User Performance Data
  const onEmptySearch = () => {
    Cookies.remove("searched_filter_UPR");
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
        name="up"
        length={userPerformance?.count || ""}
        search={filter?.search}
        csvProps={prepareExportProps()}
        csvloader={csvLoading}
        isCsvDownload={isCsvDownload}
        setIsCsvDownload={setIsCsvDownload}
        onCsvClick={() => onGetAllUserPerformance()}
        onColumnClick={() => setColumnsVisible(true)}
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
          // onSearchData();
          setFilter({
            ...filter,
            page: 1,
            limit: 10,
            isAdvance: true,
          });
        }}
        isLoading={loading}
        onHide={onEmptySearch}
        filterOpen={filter.isAdvance}
      >
        <DatePicker
          name="startdate"
          label="Start Date"
          placeholder="Select Start Date"
          dateFormat="yyyy-MM-dd HH:mm:ss"
          value={data.startdate.val}
          startDate={data.startdate.val}
          endDate={data.enddate.val}
          maxDate={data.enddate.val || new Date()}
          onChange={(e: any) => handleChnage("startdate", e)}
          showTimeSelect
          selectsStart
          isInfo
        />
        <DatePicker
          name="enddate"
          label="End Date"
          placeholder="Select End Date"
          dateFormat="yyyy-MM-dd HH:mm:ss"
          value={data.enddate.val}
          startDate={data.startdate.val}
          endDate={data.enddate.val}
          minDate={data.startdate.val}
          maxDate={new Date()}
          onChange={(e: any) => handleChnage("enddate", e)}
          showTimeSelect
          selectsEnd
          isInfo
        />
        {/* <Select
          name="user_uuid"
          label="User"
          placeholder="Select User"
          removable
          isMulti
          value={data.user_uuid.val}
          options={userOptions}
          onChange={(e: any) => handleChnage("user_uuid", e)}
          isInfo
        /> */}
        <MultiSelect
          name="user_uuid"
          label="User"
          isInfo
          options={userOptions}
          onChange={(e: Option[]) => handleChnage("user_uuid", e)}
          value={data.user_uuid.val}
          isSelectAll={true}
          menuPlacement={"bottom"}
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
              data={userPerformance?.data?.length ? userPerformance?.data : []}
              page={filter.page}
              totalCount={userPerformance?.count || 0}
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
            <DispositionInformation
              isUserInfoID={infoData}
              setIsUserInfoID={setInfoData}
            />
            <BreakInformation
              breakDetails={breakDetails}
              setBreakDetails={setBreakDetails}
            />
          </div>
        </div>

        <UserPerformancePopup
          visible={columnsVisible}
          onToggle={() => {
            setColumnsVisible(!columnsVisible);
          }}
        />
      </div>
    </div>
  );
};

export default UserPerformance;
