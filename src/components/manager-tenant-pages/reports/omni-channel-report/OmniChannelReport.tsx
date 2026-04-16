"use client";
import { Fragment, useEffect, useLayoutEffect, useState } from "react";

// PROJECT IMPORTS
import {
  useUserOptions,
  userOptionsGet,
} from "@/redux/slice/tenant-admin/userSlice";


import { useAppDispatch } from "@/redux/hooks";
import { Select } from "@/components/forms";
import { Head, Table } from "@/components/ui-components";
import RealtimeCard from "@/components/tenant-admin/realtime-reports/RealtimeCard";

// THIRD-PARTY
import { useDebouncedCallback } from "use-debounce";
import Cookies from "js-cookie";
import { format } from "date-fns";

// TYPES
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";
import { IconKey } from "@/components/ui-components/Icon";
import { omniReportGet, omniReportSearch, useOmniReport } from "@/redux/slice/tenant-admin/omniChannelReportSlice";
import { formatDate } from "@/helperFunctions";

// ===================== TABLE HEADERS =====================
const headers: any = [
  { label: "User", key: "user_name" },
  { label: "Customer", key: "lead_name" },
  { label: "Customer Number", key: "phone_number" },
  { label: "Date", key: "createdAt" },
  { label: "Channel Type", key: "channel_type" },
  { label: "Campaign", key: "campaign_name" },
];

interface OmniChannelCardType {
  icon: IconKey;
  title: string;
  count: number;
}

const OmniChannelReport = () => {
  const dispatch = useAppDispatch();

  const userOptions = useUserOptions();
  const omniReport = useOmniReport();

  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>({});
  console.log(omniReport,'omniReport');
  
  const [csvLoading, setCsvLoading] = useState<boolean>(false);
  const [isCsvDownload, setIsCsvDownload] = useState<boolean>(false);

  const [filter, setFilter] = useState<FilterTypes>({
    page: 1,
    limit: 10,
    search: "",
    isAdvance: false,
  });

  // ===================== TABLE COLUMNS =====================
  const columns: ColumnsType[] = [
    {
      name: "createdAt",
      title: "Date",
      sortable: true,
      action: (row: any) => (
        <span>{format(new Date(row.createdAt), "yyyy-MM-dd HH:mm:ss")}</span>
      ),
    },
    { name: "channel_type", title: "Channel Type", sortable: true },
    { name: "user_name", title: "User", sortable: true },
    { name: "lead_name", title: "Customer", sortable: true },
    { name: "phone_number", title: "Customer Number", sortable: true },
    { name: "campaign_name", title: "Campaign", sortable: true },
  ];

  // ===================== INITIAL LOAD =====================
  useEffect(() => {
    dispatch(userOptionsGet());
  }, [dispatch]);

  useLayoutEffect(() => {
    filter.isAdvance ? onSearchData() : onGetData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  // ===================== GET DATA =====================
  const onGetData = useDebouncedCallback(async () => {
    setLoading(true);
    try {
      const payload = {
        tenant_uuid: Cookies.get("tenant_uuid"),
        page: filter.page,
        limit: filter.limit,
      };

      await dispatch(omniReportGet(payload)).unwrap();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("Get Omni Report Error:", err);
    }
  }, 500);

  // ===================== SEARCH DATA =====================
  const onSearchData = async () => {
    setLoading(true);
    try {
      const payload: any = {
        tenant_uuid: Cookies.get("tenant_uuid"),
        user_uuid: data?.agent_uuid?.val,
        channel_type: data?.channel_type?.val,
        page: filter.page,
        limit: filter.limit,
      };

      Object.keys(payload).forEach(
        (key) => payload[key] === undefined && delete payload[key]
      );

      Cookies.set("searched_filter", JSON.stringify(payload));
      await dispatch(omniReportSearch(payload)).unwrap();
      setLoading(false);
    } catch (e: any) {
      setLoading(false);
      console.error("Search Omni Report Error:", e.message);
    }
  };

  // ===================== FILTER HANDLER =====================
  const handleChange = (key: string, val: any) => {
    setData((prev: any) => ({
      ...prev,
      [key]: { key, val },
    }));
  };

  // ===================== CSV EXPORT =====================
  const prepareExportProps = () => {
    const data = (omniReport?.data || []).map((row: any) => ({
      ...row,
      createdAt: format(new Date(row.createdAt), "yyyy-MM-dd HH:mm:ss"),
      phone_number: `\t${row.phone_number}`,
    }));
    return { headers, data, filename: "Omni_Channel_Report.csv" };
  };

  // ===================== CARDS =====================
  const omniChannelCardData: OmniChannelCardType[] = [
    { icon: "ActiveCall", title: "Active Chat", count: omniReport?.activeChats },
    { icon: "ActiveCall", title: "Inactive Chat", count: omniReport?.inActiveChats },
  ];

  const channelOptions = [
    { value: "WhatsApp", label: "WhatsApp" },
    { value: "instagram", label: "Instagram" },
    { value: "facebook", label: "Facebook" },
  ];
  // Fetching All Login Logout Data
  const onGetAllOmniData = async () => {
    setCsvLoading(true);
    try {
      if (filter?.isAdvance) {
        const payload: any = {
          tenant_uuid: Cookies.get("tenant_uuid"),
          agent_uuid: data?.agent_uuid?.val,
          channel_type: data?.channel_type?.val,
          page: 1,
          limit: omniReport?.total || omniReport?.count || 999999,
        };

        Object.entries(payload).forEach(([key, val]) => {
          if (!val) delete payload[key];
        });

        await dispatch(omniReportSearch(payload)).unwrap();
      } else {
        const payload: any = {
          tenant_uuid: Cookies.get("tenant_uuid"),
          page: 1,
          limit: omniReport?.total || omniReport?.count || 999999,
        };

        await dispatch(omniReportGet(payload)).unwrap();
      }

      setCsvLoading(false);
      setIsCsvDownload(true);
    } catch (err) {
      console.error("Get All Omni Report Err =-=>", err);
      setCsvLoading(false);
    }
  };
  const onEmptySearch = () => {
    setData({});
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
        search={filter.search}
        csvProps={prepareExportProps()}
        csvloader={csvLoading}
        isCsvDownload={isCsvDownload}
        setIsCsvDownload={setIsCsvDownload}
        onCsvClick={() => onGetAllOmniData()}
        onChange={(e: any) =>
          setFilter({
            ...filter,
            page: 1,
            search: e.target.value,
            isAdvance: false,
          })
        }
        onSearchClick={() =>
          setFilter({ ...filter, page: 1, isAdvance: true })
        }
        onHide={onEmptySearch}
        filterOpen={filter.isAdvance}
      >
        <Select
          name="agent_uuid"
          label="User"
          placeholder="Select User"
          removable
          value={data?.agent_uuid?.val}
          options={userOptions}
          onChange={(e: any) =>
            handleChange("agent_uuid", e.target.value)
          }
          isInfo
        />

        <Select
          name="channel_type"
          label="Channel Type"
          placeholder="Select Channel"
          removable
          value={data?.channel_type?.val}
          options={channelOptions}
          onChange={(e: any) =>
            handleChange("channel_type", e.target.value)
          }
          isInfo
        />
      </Head>

      {/* CARDS */}
      <div className="grid grid-cols-4 gap-4 py-4">
        {omniChannelCardData.map((val, idx) => (
          <Fragment key={idx}>
            <RealtimeCard {...val} />
          </Fragment>
        ))}
      </div>

      {/* TABLE */}
      <Table
        isLoading={loading}
        columns={columns}
        data={omniReport?.data || []}
        page={filter.page}
        totalCount={omniReport?.total || 0}
        limit={filter.limit}
        selectable={false}
        onPageClick={(page: number) =>
          setFilter({ ...filter, page })
        }
        onLimitChange={(limit: number) =>
          setFilter({ ...filter, page: 1, limit })
        }
        onRefresh={() => setFilter({ ...filter })}
      />
    </div >
  );
};

export default OmniChannelReport;
