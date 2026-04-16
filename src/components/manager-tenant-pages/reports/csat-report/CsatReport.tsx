"use client";
import { Fragment, useEffect, useLayoutEffect, useState } from "react";
import { DatePicker } from "@/components/pickers";

// PROJECT IMPORTS
import { useUserOptions, userOptionsGet } from "@/redux/slice/tenant-admin/userSlice";

import { useAppDispatch } from "@/redux/hooks";
import { InputSelect, Select } from "@/components/forms";
import { Head, Table } from "@/components/ui-components";
import RealtimeCard from "@/components/tenant-admin/realtime-reports/RealtimeCard";

// THIRD-PARTY
import { useDebouncedCallback } from "use-debounce";
import Cookies from "js-cookie";

// TYPES
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";
import { IconKey } from "@/components/ui-components/Icon";

import { useCampaignOptions } from "@/redux/slice/tenant-admin/realtimeReportSlice";
import { TenantCsatFilterTypes } from "@/types/advancedFilterTypes";
import { SEARCH_ERROR_MESSAGE } from "@/config/constant";
import { Danger } from "@/redux/services/toasterServices";
import { formatDate } from "@/helperFunctions";
import { tenantCdrsSearch } from "@/redux/slice/tenant-admin/tenantCdrsSlice";
import { advanceSearchOptions } from "@/config/options";

// ===================== TABLE HEADERS =====================
interface CsatReportCardType {
  icon: IconKey;
  title: string;
  count: number;
}

const headers = [
  { label: "Start Date", key: "callstart" },
  { label: "End Date", key: "callend" },
  { label: "Caller Id Number", key: "caller_id_number" },
  { label: "Phone Number", key: "destination_number" },
  { label: "User", key: "username" },
  { label: "Duration", key: "total_duration" },
  { label: "Campaign", key: "campaign_name" },
  { label: "Direction", key: "direction" },
  { label: "CSAT Score", key: "ivr_feedback_score" },
];

const now = new Date();
const startOfToday = new Date(now);
startOfToday.setHours(0, 0, 0, 0);

const endOfToday = new Date(now);
endOfToday.setHours(23, 59, 59, 999);

const initialValues: TenantCsatFilterTypes = {
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
  caller_id_number: { key: "caller_id_number|1", val: "", dropdown: "1" },
  destination_number: { key: "destination_number|1", val: "", dropdown: "1" },
  // disposition: { key: "disposition|4", val: "", dropdown: "4" },
  direction: { key: "direction|4", val: "", dropdown: "4" },
  user_uuid: { key: "user_uuid|4", val: "", dropdown: "4" },
  campaign_uuid: { key: "campaign_uuid|4", val: [], dropdown: "" },
};

const CsatReport = () => {
  const dispatch = useAppDispatch();

  const userOptions = useUserOptions();
  let campaignOptions = useCampaignOptions();

  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>(initialValues);

  // ✅ Normal listing rows
  const [csatRows, setCsatRows] = useState<any[]>([]);
  // ✅ Advance search rows
  const [filteredRows, setFilteredRows] = useState<any[]>([]);
  // ✅ Pagination count (IMPORTANT)
  const [csatCount, setCsatCount] = useState<number>(0);

  const [csvLoading, setCsvLoading] = useState<boolean>(false);
  const [isCsvDownload, setIsCsvDownload] = useState<boolean>(false);

  const [filter, setFilter] = useState<FilterTypes>({
    page: 1,
    limit: 10,
    search: "",
    isAdvance: false,
  });

  const formatSecondsToTime = (value: any) => {
    if (value === null || value === undefined || value === "") return "00:00:00";
    if (typeof value === "string" && value.includes(":")) return value;

    const seconds = Number(value);
    if (isNaN(seconds) || seconds < 0) return "00:00:00";

    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // ===================== TABLE COLUMNS =====================
  const columns: ColumnsType[] = [
    {
      name: "callstart",
      title: "Start Date",
      sortable: true,
      action: (row: any) => row.callstart,
    },
    {
      name: "callend",
      title: "End Date",
      sortable: true,
      action: (row: any) => row?.callend,
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
      name: "total_duration",
      title: "Duration",
      sortable: true,
      action: (row: any) => formatSecondsToTime(row.total_duration),
    },
    {
      name: "ivr_feedback_score",
      title: "CSAT Score",
      sortable: true,
    },
    {
      name: "campaign_uuid",
      title: "Campaign",
      sortable: true,
      action: (row: any) => {
        const getFirstName = (campaigns?: any) =>
          campaigns?.length > 0 ? campaigns[0]?.name || "" : "";

        if (row?.outbound_campaign?.length > 0) return getFirstName(row.outbound_campaign);
        if (row?.inbound_campaign?.length > 0) return getFirstName(row.inbound_campaign);
        if (row?.blended_campaign?.length > 0) return getFirstName(row.blended_campaign);

        return "";
      },
    },
    {
      name: "direction",
      title: "Direction",
      sortable: true,
    },
    // {
    //   name: "disposition",
    //   title: "Disposition",
    //   sortable: true,
    // },
  ];

  // ===================== INITIAL LOAD =====================
  useEffect(() => {
    dispatch(userOptionsGet());
  }, [dispatch]);

  // ✅ Same pattern: onGetData for normal / onSearchData for advance
  useLayoutEffect(() => {
    if (filter?.isAdvance) {
      onSearchData();
    } else {
      onGetData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  // ===================== GET DATA (NORMAL LOAD) =====================
  const onGetData = useDebouncedCallback(async () => {
    setLoading(true);

    try {
      const payload: any = {
        only_csat: "yes",
        role: "tenant",
        timezone: "Asia/Kolkata",

        tenant_uuid: Cookies.get("tenant_uuid"),
        page: filter.page,
        limit: filter.limit,

        // ✅ Always send date range (default already there)
        [data["callstart"]["key"]]: formatDate(data["callstart"]["val"], true),
        [data["callend"]["key"]]: formatDate(data["callend"]["val"], true),
      };

      Object.entries(payload).forEach(([key, val]: any) => {
        if (val == null || val === "" || (Array.isArray(val) && val.length === 0)) {
          delete payload[key];
        }
      });

      const result: any = await dispatch(tenantCdrsSearch(payload)).unwrap();

      setCsatRows(result?.data || []);
      setCsatCount(result?.count || 0);

      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("CSAT Normal Load Error:", err);
    }
  }, 500);

  // ===================== SEARCH DATA (ADVANCE SEARCH) =====================
  const onSearchData = async () => {
    // ✅ you can keep this validation or remove
    const hasBackendFields =
      data["callstart"]["val"] ||
      data["callend"]["val"] ||
      data["destination_number"]["val"] ||
      data["direction"]["val"] ||
      data["user_uuid"]["val"] ||
      data["campaign_uuid"]["val"]?.length > 0 ||
      data["caller_id_number"]["val"] ||
      data["collection_name_for_display"]["val"];

    if (!hasBackendFields) {
      Danger(SEARCH_ERROR_MESSAGE);
      return false;
    }

    setLoading(true);
    try {
      const payload: any = {
        only_csat: "yes",
        role: "tenant",
        timezone: "Asia/Kolkata",

        tenant_uuid: Cookies.get("tenant_uuid"),
        page: filter?.page,
        limit: filter?.limit,

        [data["callstart"]["key"]]: formatDate(data["callstart"]["val"], true),
        [data["callend"]["key"]]: formatDate(data["callend"]["val"], true),

        [data["caller_id_number"]["key"]]: data["caller_id_number"]["val"],
        [data["destination_number"]["key"]]: data["destination_number"]["val"],
        [data["direction"]["key"]]: data["direction"]["val"],
        [data["user_uuid"]["key"]]: data["user_uuid"]["val"],
        [data["collection_name_for_display"]["key"]]: data["collection_name_for_display"]["val"],
        [data["campaign_uuid"]["key"]]: data["campaign_uuid"]["val"],
      };

      Object.entries(payload).forEach(([key, val]: any) => {
        if (val == null || val === "" || (Array.isArray(val) && val.length === 0)) {
          delete payload[key];
        }
      });

      const result: any = await dispatch(tenantCdrsSearch(payload)).unwrap();

      setFilteredRows(result?.data || []);
      setCsatCount(result?.count || 0);

      setLoading(false);
    } catch (e: any) {
      setLoading(false);
      console.error("CSAT Search Err --->", e.message);
    }
  };

  // ===================== FILTER HANDLER =====================
  const handleChange = (key: string, val: any) => {
    setData({
      ...data,
      [key]: { ...data[key], val: val },
    });
  };

  const handleSelect = (key: string, val: string) => {
    setData({
      ...data,
      [key]: { ...data[key], key: `${key}|${val}`, dropdown: val },
    });
  };

  // ✅ Cancel / Hide Search
  const onEmptySearch = () => {
    setData(initialValues);
    setFilter({
      ...filter,
      page: 1,
      limit: 10,
      isAdvance: false,
    });
  };

  // ===================== CSV EXPORT =====================
  const prepareExportProps = () => {
    const exportRows = filter?.isAdvance ? filteredRows : csatRows;
    return { headers, data: exportRows, filename: "CSAT.csv" };
  };

  const onGetAllCsat = async () => {
    setCsvLoading(true);
    try {
      // Build the same payload as onSearchData
      const payload: any = {};

      if (filter?.isAdvance) {
        const fields = [
          "callstart", "callend", "caller_id_name", "caller_id_number",
          "destination_number", "billsecond", "call_mode", "disposition",
          "direction", "call_type", "user_uuid", "ivr_group",
          "collection_name_for_display", "campaign_uuid",
        ];
        fields.forEach((field) => {
          const val = field === "callstart" || field === "callend"
            ? formatDate(data[field]?.["val"], true)
            : data[field]?.["val"];
          if (val != null && val !== "" && !(Array.isArray(val) && val.length === 0)) {
            payload[data[field]?.["key"]] = val;
          }
        });
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
      const payloadData = { ...payload, baseUrl , only_csat:"yes"};

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
      link.download = "CSAT.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Get All Csat Err =-=>", err);
    } finally {
      setCsvLoading(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-[25px] flex flex-col gap-4">
      <Head
        search={filter?.search}
        csvProps={prepareExportProps()}
        csvloader={csvLoading}
        isCsvDownload={isCsvDownload}
        setIsCsvDownload={setIsCsvDownload}
        onCsvClick={() => onGetAllCsat()}
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
        <DatePicker
          name="callstart"
          label="Start Date"
          placeholder="Enter Start Date"
          dateFormat="yyyy-MM-dd HH:mm:ss"
          value={data.callstart.val}
          startDate={data.callstart.val}
          endDate={data.callend.val}
          maxDate={data.callend.val || new Date()}
          onChange={(e: any) => handleChange("callstart", e)}
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
          onChange={(e: any) => handleChange("callend", e)}
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
          onChange={(e: any) => handleChange("user_uuid", e.target.value)}
          isInfo
        />
        <InputSelect
          name="caller_id_number"
          label="Caller Id Number"
          placeholder="Select Caller Id Number"
          value={data.caller_id_number.val}
          dropdownValue={data.caller_id_number.dropdown}
          options={advanceSearchOptions}
          onChange={(e: any) =>
            handleChange("caller_id_number", e.target.value)
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
          placeholder="Select Phone Number"
          value={data.destination_number.val}
          dropdownValue={data.destination_number.dropdown}
          options={advanceSearchOptions}
          onChange={(e: any) =>
            handleChange("destination_number", e.target.value)
          }
          onDropdownChange={(e: any) =>
            handleSelect("destination_number", e.target.value)
          }
          isInfo
        />
      </Head>

      {/* ✅ TABLE */}
      <Table
        isLoading={loading}
        columns={columns}
        data={filter.isAdvance ? filteredRows : csatRows}
        page={filter.page}
        totalCount={csatCount}   // ✅ IMPORTANT: NOW PAGINATION WILL SHOW
        limit={filter.limit}
        selectable={false}
        onPageClick={(page: number) => setFilter({ ...filter, page })}
        onLimitChange={(limit: number) => setFilter({ ...filter, page: 1, limit })}
        onRefresh={() => setFilter({ ...filter })}
      />
    </div>
  );
};

export default CsatReport;

