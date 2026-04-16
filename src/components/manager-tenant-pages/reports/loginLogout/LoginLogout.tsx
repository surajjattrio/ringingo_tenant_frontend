"use client";
import { useEffect, useLayoutEffect, useState } from "react";

// PROJECT IMPORT
import {
  useUserOptions,
  userOptionsGet,
} from "@/redux/slice/tenant-admin/userSlice";
import {
  useLoginLogout,
  loginLogoutGet,
  loginLogoutSearch,
  loginLogoutAllSearch,
  loginLogoutAllGet,
  exportLoginLogoutWithInfoData,
} from "@/redux/slice/tenant-admin/loginLogoutSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Select } from "@/components/forms";
import { DatePicker } from "@/components/pickers";
import { Head, Icon, Table } from "@/components/ui-components";
import { formatDate } from "@/helperFunctions";

// THIRD-PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";
import Cookies from "js-cookie";

// TYPES IMPORT
import { LoginLogoutFilterTypes } from "@/types/advancedFilterTypes";
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";
import { ManagerPageTypes } from "@/types/formTypes";
import LoginLogoutInformation from "@/components/tenant-admin/login-logout-report/LoginLogoutInformation";
import LoginLogoutPopup from "@/components/tenant-admin/login-logout-report/LoginLogoutPopup";
import { format } from "date-fns";

// NAME STATE
const now = new Date();
const startOfToday = new Date(now);
startOfToday.setHours(0, 0, 0, 0);
const endOfToday = new Date(now);
endOfToday.setHours(23, 59, 59, 999);

// NAME STATE
const initialValues: LoginLogoutFilterTypes = {
  startDate: {
    key: "startDate",
    val: startOfToday,
    dropdown: "4",
  },
  endDate: {
    key: "endDate",
    val: endOfToday,
    dropdown: "4",
  },
  agent_uuid: { key: "agent_uuid|4", val: "", dropdown: "4" },
};

// DATA
const headers: any = [
  { label: "User", key: "agent_name" },
  { label: "Date", key: "date" },
  { label: "Total Login Hours", key: "total_login_hours" },
  { label: "First Login Time", key: "first_login_time" },
  { label: "Last Logout Time", key: "last_login_time" },
  { label: "Total Count Of Logins", key: "login_count" },
  { label: "Total Break Hours", key: "total_break_hours" },
  { label: "Total Count Of Breaks", key: "break_count" },
  { label: "Net Login Hours", key: "net_login" },
  // Information data columns
  { label: "Time Stamp", key: "info_time_stamp" },
  { label: "Event", key: "info_event" },
  { label: "Duration", key: "info_duration" },
];

const LoginLogout = (props: ManagerPageTypes) => {
  const { managerName = null, name = null } = props;
  const dispatch = useAppDispatch();
  const userOptions = useUserOptions();

  const loginLogout = useLoginLogout();
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<FilterTypes>({
    page: 1,
    limit: 10,
    search: "",
    isAdvance: false,
  });
  const [data, setData] = useState<any>(initialValues);
  const [infoData, setInfoData] = useState<any>(null);
  const [csvLoading, setCsvLoading] = useState<boolean>(false);
  const [isCsvDownload, setIsCsvDownload] = useState<boolean>(false);
  const [columnsVisible, setColumnsVisible] = useState<boolean>(false);
  const [exportData, setExportData] = useState<any>({ headers: [], data: [], filename: "" });

  const columns: ColumnsType[] = [
    {
      name: "agent_name",
      title: "User",
      sortable: true,
    },
    {
      name: "fullname",
      title: "Full Name",
      sortable: true,
    },
    {
      name: "date",
      title: "Date",
      sortable: true,
      action: (row: any) => {
        return (
          <div>
            <span>{format(new Date(row["date"]), "yyyy-MM-dd")}</span>
          </div>
        );
      },
    },
    {
      name: "total_login_hours",
      title: "Total Login Time(HH:MM)",
      sortable: true,
    },
    {
      name: "net_login",
      title: "Net Login Time(HH:MM)",
      sortable: true,
    },
    {
      name: "first_login_time",
      title: "First Login Time(HH:MM)",
      sortable: true,
    },
    {
      name: "last_login_time",
      title: "Last Logout Time(HH:MM)",
      sortable: true,
    },
    {
      name: "login_count",
      title: "Total Count of Logins",
      sortable: true,
    },
    {
      name: "total_break_hours",
      title: "Total Break Time(HH:MM)",
      sortable: true,
    },
    {
      name: "break_count",
      title: "Total Count of Breaks",
      sortable: true,
    },
    {
      name: "login_logout_info",
      title: "Info",
      action: (row: any) => {
        return (
          <div className="flex gap-2">
            <Icon
              className="cursor-pointer"
              tooltip="Info"
              name="InfoCircle"
              width={20}
              height={20}
              alt="info"
              onClick={() => {
                setInfoData(row);
              }}
            />
          </div>
        );
      },
    },
  ];

  //On component mount check filter data
  // useEffect(() => {
  //   let storageData = Cookies.get("searched_filter_UPR");
  //   if (storageData != null && storageData != undefined) {
  //     let payload = JSON.parse(storageData);
  //     setData({
  //       ...data,
  //       startDate: {
  //         key: "startDate",
  //         val: payload?.startDate
  //           ? new Date(payload?.startDate)
  //           : new Date().setHours(0, 0, 1),
  //       },
  //       endDate: {
  //         key: "endDate",
  //         val: payload?.endDate
  //           ? new Date(payload?.endDate)
  //           : new Date().setHours(23, 59, 59),
  //       },
  //       agent_uuid: {
  //         key: "agent_uuid",
  //         val: payload["agent_uuid"]["val"] ? payload["agent_uuid"]["val"] : [],
  //       },
  //     });
  //     setFilter({ ...filter, isAdvance: true });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useLayoutEffect(() => {
    if (filter?.isAdvance) {
      onSearchData();
    } else {
      onGetData();
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

  // Fetching Login Logout Data
  const onGetData = useDebouncedCallback(async () => {
    setLoading(true);
    try {
      const payload: any = {
        [data["startDate"]["key"]]: formatDate(data["startDate"]["val"], true),
        [data["endDate"]["key"]]: formatDate(data["endDate"]["val"], true),
        [data["agent_uuid"]["key"]]: data["agent_uuid"]["val"],
        ...filter,
      };
      Object.entries(payload)?.forEach(([key, val]: any) => {
        if (!val) {
          delete payload[key];
        }
      });
      delete payload["isAdvance"];
      await dispatch(loginLogoutGet(payload)).unwrap();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("Get Login Logout Err =-=>", err);
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
    setLoading(true);
    try {
      const payload = {
        [data["startDate"]["key"]]: formatDate(data["startDate"]["val"], true),
        [data["endDate"]["key"]]: formatDate(data["endDate"]["val"], true),
        [data["agent_uuid"]["key"]]: data["agent_uuid"]["val"],
        page: filter.page,
        limit: filter.limit,
      };
      Object.entries(payload)?.forEach(([key, val]: any) => {
        if (!val) {
          delete payload[key];
        }
      });
      Cookies.set("searched_filter", JSON.stringify(payload));
      await dispatch(loginLogoutSearch(payload)).unwrap();
      setLoading(false);
    } catch (e: any) {
      setLoading(false);
      console.error("Search data Err --->", e.message);
    }
  };

  // Advance Search Fields Empty & Fetching Login Logout Data
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

  // Export data using backend API
  const onExportData = async () => {
    setCsvLoading(true);
    try {
      const payload: any = {
        [data["startDate"]["key"]]: formatDate(data["startDate"]["val"], true),
        [data["endDate"]["key"]]: formatDate(data["endDate"]["val"], true),
        [data["agent_uuid"]["key"]]: data["agent_uuid"]["val"],
        tenant_uuid: Cookies.get("tenant_uuid"),
        timezone: Cookies.get("timezone") || "UTC",
      };
      
      Object.entries(payload)?.forEach(([key, val]: any) => {
        if (!val) {
          delete payload[key];
        }
      });
      
      const result = await dispatch(exportLoginLogoutWithInfoData(payload)).unwrap();
      
      if (result && result?.data) {
        setExportData({ headers, data: result.data || [], filename: "Login Logout with Information.csv" });
        setIsCsvDownload(true);
      }
      setCsvLoading(false);
    } catch (err) {
      console.error("Export Login Logout Err =-=>", err);
      setCsvLoading(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-[25px]">
      <Head
        search={filter?.search}
        csvProps={exportData}
        csvloader={csvLoading}
        isCsvDownload={isCsvDownload}
        setIsCsvDownload={setIsCsvDownload}
        onCsvClick={async () => {
          await onExportData();
        }}
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
          setFilter({
            ...filter,
            page: 1,
            limit: 10,
            isAdvance: true,
          });
          Cookies.set("searched_filter", JSON.stringify(data));
        }}
        onHide={onEmptySearch}
        isLoading={loading}
        filterOpen={filter.isAdvance}
      >
        <DatePicker
          name="startDate"
          label="Start Date"
          placeholder="Select Start"
          dateFormat="yyyy-MM-dd HH:mm:ss"
          value={data.startDate.val}
          startDate={data.startDate.val}
          endDate={data.endDate.val}
          maxDate={data.endDate.val || new Date()}
          onChange={(e: any) => handleChnage("startDate", e)}
          showTimeSelect
          selectsStart
          isInfo
        />
        <DatePicker
          name="endDate"
          label="End Date"
          placeholder="Select End"
          dateFormat="yyyy-MM-dd HH:mm:ss"
          value={data.endDate.val}
          startDate={data.startDate.val}
          endDate={data.endDate.val}
          minDate={data.startDate.val}
          maxDate={new Date()}
          onChange={(e: any) => handleChnage("endDate", e)}
          showTimeSelect
          selectsEnd
          isInfo
        />
        <Select
          name="agent_uuid"
          label="User"
          placeholder="Select User"
          removable
          // isMulti
          value={data.agent_uuid.val}
          options={userOptions}
          onChange={(e: any) => handleChnage("agent_uuid", e.target.value)}
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
              data={loginLogout?.data?.length ? loginLogout?.data : []}
              page={filter.page}
              totalCount={loginLogout?.count || 0}
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
            <LoginLogoutInformation
              isLoginLogoutInfo={infoData}
              setIsLoginLogoutInfo={setInfoData}
            />
          </div>
        </div>
        <LoginLogoutPopup
          visible={columnsVisible}
          onToggle={() => {
            setColumnsVisible(!columnsVisible);
          }}
        />
      </div>
    </div>
  );
};

export default LoginLogout;
