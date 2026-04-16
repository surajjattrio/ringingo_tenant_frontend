"use client";
import { useEffect, useLayoutEffect, useState } from "react";

// PROJECT IMPORT
import {
  useUserOptions,
  userOptionsGet,
} from "@/redux/slice/tenant-admin/userSlice";
import {
  useAllDroppedCalls,
  useDroppedCalls,
  droppedCallsAllGet,
  droppedCallsAllSearch,
  droppedCallsGet,
  droppedCallsSearch,
} from "@/redux/slice/tenant-admin/droppedCallsSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Danger } from "@/redux/services/toasterServices";
import { InputSelect, Select } from "@/components/forms";
import { DatePicker } from "@/components/pickers";
import { Head, Icon, Table } from "@/components/ui-components";
import { formatDate } from "@/helperFunctions";
import { SEARCH_ERROR_MESSAGE } from "@/config/constant";

// THIRD-PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";
import Cookies from "js-cookie";

// TYPES IMPORT
import { DroppedCallsFilterTypes } from "@/types/advancedFilterTypes";
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";
import { ManagerPageTypes } from "@/types/formTypes";
import { advanceSearchOptions } from "@/config/options";
// NAME STATE
const now = new Date();
const startOfToday = new Date(now);
startOfToday.setHours(0, 0, 0, 0);
const endOfToday = new Date(now);
endOfToday.setHours(23, 59, 59, 999);
// NAME STATE
const initialValues: DroppedCallsFilterTypes = {
  callstart: {
    key: "callstart",
    val: startOfToday,
    dropdown: "4",
  },
  callend: {
    key: "callend",
    val:endOfToday,
    dropdown: "4",
  },
  user_uuid: { key: "user_uuid|4", val: "", dropdown: "4" },
  caller_id_number: { key: "caller_id_number|4", val: "", dropdown: "4" },
  destination_number: { key: "destination_number|1", val: "", dropdown: "1" },
};

// DATA
const headers: any = [
  { label: "Date", key: "converted_date" },
  { label: "User", key: "user" },
  { label: "Caller ID", key: "caller_id_number" },
  { label: "Destination Number", key: "destination_number" },
  { label: "Call Start", key: "callstart" },
  { label: "Duration (sec)", key: "billsecond" },
  { label: "Disposition", key: "disposition" },
  { label: "Direction", key: "direction" },
  { label: "Call Type", key: "call_type" },
//   { label: "PBX Feature", key: "pbx_feature" }
];

const DroppedCalls = (props: ManagerPageTypes) => {
  const { managerName = null, name = null } = props;
  const dispatch = useAppDispatch();
  const userOptions = useUserOptions();

  const droppedCalls = useDroppedCalls();
  const allDroppedCalls = useAllDroppedCalls();
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<FilterTypes>({
    page: 1,
    limit: 10,
    search: "",
    isAdvance: false,
    callstart: formatDate(startOfToday, true),
    callend: formatDate(endOfToday, true),
  });
  const [data, setData] = useState<any>(initialValues);
  const [infoData, setInfoData] = useState<any>(null);

  const [csvLoading, setCsvLoading] = useState<boolean>(false);
  const [isCsvDownload, setIsCsvDownload] = useState<boolean>(false);

  const columns: ColumnsType[] = [
    {
      name: "converted_date",
      title: "Date",
      sortable: true,
    },
    {
      name: "user",
      title: "User",
      sortable: true,
      action: (row: any) => {
        const user = row?.user?.[0];
        return user?.username || "N/A";
      },
    },
    {
      name: "fullname",
      title: "Full Name",
      sortable: true,
      action: (row: any) => {
        const user = row?.user?.[0];
        return user?.fullname || "N/A";
      },
    },
    {
      name: "caller_id_number",
      title: "Caller ID",
      sortable: true,
    },
    {
      name: "destination_number",
      title: "Destination Number",
      sortable: true,
    },
    {
      name: "callstart",
      title: "Call Start",
      sortable: true,
    },
    {
      name: "billsecond",
      title: "Duration (sec)",
      sortable: true,
    },
    {
      name: "disposition",
      title: "Disposition",
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
    // {
    //   name: "pbx_feature",
    //   title: "PBX Feature",
    //   sortable: true,
    // },
  ];

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
    const data = droppedCalls?.data || [];
    
    // Transform data to match CSV headers
    const transformedData = data.map((item: any) => ({
      converted_date: item.converted_date || "",
      user: item.user?.[0]?.username || "N/A",
      caller_id_number: item.caller_id_number || "",
      destination_number: item.destination_number || "",
      callstart: item.callstart || "",
      billsecond: item.billsecond || "",
      disposition: item.disposition || "",
      direction: item.direction || "",
      call_type: item.call_type || "",
    //   pbx_feature: item.pbx_feature || "",
    }));
    
    return { headers, data: transformedData, filename: "DroppedCalls.csv" };
  };

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

  // Fetching Dropped Calls Data for Export
  const onGetDataForExport = async () => {
    setCsvLoading(true);
    setLoading(true);
    try {
      const params = { ...filter };
      delete params["isAdvance"];
      await dispatch(droppedCallsGet(params)).unwrap();
      setCsvLoading(false);
      setLoading(false);
    } catch (err) {
      setCsvLoading(false);
      setLoading(false);
      console.error("Get Dropped Calls for Export Err =-=>", err);
    }
  };

  // Fetching Dropped Calls Data
  const onGetData = useDebouncedCallback(async () => {
    setCsvLoading(true);
    setLoading(true);
    try {
      const params = { ...filter };
      delete params["isAdvance"];
      await dispatch(droppedCallsGet(params)).unwrap();
      setCsvLoading(false);
      setLoading(false);
    } catch (err) {
      setCsvLoading(false);
      setLoading(false);
      console.error("Get Dropped Calls Err =-=>", err);
    }
  }, 500);

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
        data["callstart"]["val"] ||
        data["callend"]["val"] ||
        data["user_uuid"]["val"] ||
        data["caller_id_number"]["val"] ||
        data["destination_number"]["val"]
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

        page: filter?.page,
        limit: filter?.limit,
      };
      Object.entries(payload)?.forEach(([key, val]: any) => {
        if (!val) {
          delete payload[key];
        }
      });
      await dispatch(droppedCallsSearch(payload)).unwrap();
      setLoading(false);
    } catch (e: any) {
      setLoading(false);
      console.error("Search data Err --->", e.message);
    }
  };

  // Advance Search - Trigger when right side Select value change
  const handleSelect = (key: string, val: string) => {
    setData({
      ...data,
      [key]: { ...data[key], key: `${key}|${val}`, dropdown: val },
    });
  };

  // Advance Search Fields Empty & Fetching Dropped Calls Data
  const onEmptySearch = () => {
    Cookies.remove("searched_filter");
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
        csvProps={droppedCalls?.data?.length ? prepareExportProps() : { headers, data: [], filename: "DroppedCalls.csv" }}
        csvloader={csvLoading}
        isCsvDownload={isCsvDownload}
        setIsCsvDownload={setIsCsvDownload}
        onCsvClick={async () => {
          setCsvLoading(true);
          try {
            // If we don't have data, fetch it first
            if (!droppedCalls?.data?.length) {
              await onGetDataForExport();
            }
            // Wait a bit for the state to update
            setTimeout(() => {
              setIsCsvDownload(true);
            }, 100);
          } catch (error) {
            console.error("Export error:", error);
          } finally {
            setCsvLoading(false);
          }
        }}
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
        onSearchClick={() => {
          setFilter({
            ...filter,
            page: 1,
            limit: 10,
            isAdvance: true,
          });
          Cookies.set("searched_filter", JSON.stringify(data));
        }}
        onHide={onEmptySearch}
        filterOpen={filter.isAdvance}
      >
        <DatePicker
          name="callstart"
          label="Call Start"
          placeholder="Select Call Start"
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
          label="Call End"
          placeholder="Select Call End"
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
      </Head>
      <div
        className={`${infoData
            ? "grid grid-cols-3 gap-4 tsm:grid-cols-1 tsm:gap-y-4 tsm:gap-x-0"
            : ""
          }`}
      >
        <div className="mt-5 col-span-2">
          <Table
            managerName={managerName}
            isLoading={loading}
            columns={columns}
            data={droppedCalls?.data?.length ? droppedCalls?.data : []}
            page={filter.page}
            totalCount={droppedCalls?.count || 0}
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
    </div>
  );
};

export default DroppedCalls;