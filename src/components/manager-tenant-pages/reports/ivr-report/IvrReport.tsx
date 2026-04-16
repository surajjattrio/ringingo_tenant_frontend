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

// ===================== TABLE HEADERS =====================
const headers: any = [
  { label: "Date", key: "ivr_date" },
  { label: "IVR Name", key: "ivr_name" },
  { label: "DID", key: "did" },
  { label: "Customer Number", key: "customer_number" },
  { label: "DTMF", key: "dtmf" },
  { label: "Duration", key: "duration" },
  { label: "Destination Route", key: "destination" },
];

interface IvrReportCardType {
  icon: IconKey;
  title: string;
  count: number;
}

const IvrReport = () => {
  const dispatch = useAppDispatch();

  const userOptions = useUserOptions();
  const ivrReport = useOmniReport();

  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>({});
  console.log(ivrReport,'ivrReport');
  
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
      name: "ivr_date",
      title: "Date",
      sortable: true,
      action: (row: any) => (
        <span>{format(new Date(row.createdAt), "yyyy-MM-dd HH:mm:ss")}</span>
      ),
    },
    { name: "ivr_name", title: "IVR Name", sortable: true },
    { name: "did", title: "DID", sortable: true },
     { name: "customer_number", title: "Customer Number", sortable: true },
    { name: "dtmf", title: "DTMF", sortable: true },
    { name: "duration", title: "Duration", sortable: true },
     { name: "destination", title: "Destination Route", sortable: true },
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
        user_name: data?.agent_uuid?.val,
        channel_type: data?.channel_type?.val,
      };

      Object.keys(payload).forEach(
        (key) => payload[key] === undefined && delete payload[key]
      );

      Cookies.set("searched_filter", JSON.stringify(payload));
      await dispatch(omniReportSearch(payload)).unwrap();
      setLoading(false);
    } catch (e: any) {
      setLoading(false);
      console.error("Search IVR Report Error:", e.message);
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
    const data = ivrReport?.data || [];
    return { headers, data, filename: "Ivr_Report.csv" };
  };

  // ===================== CARDS =====================
  const omniChannelCardData: IvrReportCardType[] = [
    { icon: "ActiveCall", title: "Active Chat", count: ivrReport?.activeChats },
    { icon: "ActiveCall", title: "Inactive Chat", count: ivrReport?.inActiveChats },
  ];

  const channelOptions = [
    { value: "WhatsApp", label: "WhatsApp" },
    { value: "instagram", label: "Instagram" },
    { value: "facebook", label: "Facebook" },
  ];

  return (
    <div className="bg-white p-5 rounded-[25px] flex flex-col gap-4">
      <Head
        search={filter.search}
        csvProps={prepareExportProps()}
        csvloader={csvLoading}
        isCsvDownload={isCsvDownload}
        setIsCsvDownload={setIsCsvDownload}
        onCsvClick={() => setIsCsvDownload(true)}
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
        onHide={() =>
          setFilter({ ...filter, page: 1, isAdvance: false })
        }
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
      {/* <div className="grid grid-cols-4 gap-4 py-4">
        {omniChannelCardData.map((val, idx) => (
          <Fragment key={idx}>
            <RealtimeCard {...val} />
          </Fragment>
        ))}
      </div> */}

      {/* TABLE */}
      <Table
        isLoading={loading}
        columns={columns}
        data={ivrReport?.data || []}
        page={filter.page}
        totalCount={ivrReport?.total || 0}
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
    </div>
  );
};

export default IvrReport;
