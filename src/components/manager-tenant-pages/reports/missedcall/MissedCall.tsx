"use client";
import { useEffect, useLayoutEffect, useState } from "react";

// PROJECT IMPORT
import {
  useUserOptions,
  userOptionsGet,
} from "@/redux/slice/tenant-admin/userSlice";
import {
  useAllMissedCall,
  useMissedCall,
  missedCallAllGet,
  missedCallAllSearch,
  missedCallGet,
  missedCallSearch,
} from "@/redux/slice/tenant-admin/missedCallSlice";
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
import { MissedCallFilterTypes } from "@/types/advancedFilterTypes";
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
const initialValues: MissedCallFilterTypes = {
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
  user_uuid: { key: "user_uuid|4", val: "", dropdown: "4" },
  caller_id_number: { key: "caller_id_number|4", val: "", dropdown: "4" },
  destination_number: { key: "destination_number|1", val: "", dropdown: "1" },
};

// DATA
const headers: any = [
  { label: "Date", key: "date" },
  { label: "User", key: "user_uuid" },
  { label: "Caller ID", key: "caller_id_number" },
  { label: "Phone Number", key: "phone_number" }
];

const MissedCall = (props: ManagerPageTypes) => {
  const { managerName = null, name = null } = props;
  const dispatch = useAppDispatch();
  const userOptions = useUserOptions();

  const missedCall = useMissedCall();
  const allMissedCall = useAllMissedCall();
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
      //   action: ( row: any ) => {
      //     return row.converted_date == undefined ? row.startdate : row.converted_date;
      // },
    },
    {
      name: "user_name",
      title: "User",
      sortable: true,
      action: (row: any) => {
        const user_name = row?.user_name;
        if (user_name) return user_name;
        return "-";
      },
    },
    {
      name: "fullname",
      title: "Full Name",
      sortable: true,
      action: (row: any) => {
        const fullname = row?.fullname;
        if (fullname) return fullname;
        return "-";
      },
    },
    {
      name: "campaign_details",
      title: "Campaign Name",
      sortable: true,
      action: (row: any) => {
        return row?.campaign_details?.outbound_campaign[0]?.name || row?.campaign_details?.inbound_campaign[0]?.name || row?.campaign_details?.blended_campaign[0]?.name || "-";
      },
    },
    {
      name: "caller_id_number",
      title: "Source No. / Caller ID",
      sortable: true,
    },
    {
      name: "destination_number",
      title: "DID / Phone Number",
      sortable: true,
    },
    {
      name: "pbx_feature",
      title: "Path / Route",
      sortable: true,
      action: (row: any) => {
        const feature = row?.pbx_feature?.trim()?.toUpperCase();
        const ivrName = row?.ivr?.[0]?.name?.trim();

        if (feature && ivrName) return `${feature} - ${ivrName}`;
        if (feature) return feature;
        if (ivrName) return ivrName;
        return "-";
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
  //       callstart: {
  //         key: "callstart",
  //         val: payload?.callstart["val"]
  //           ? new Date(payload?.callstart)
  //           : new Date().setHours(0, 0, 1),
  //       },
  //       callend: {
  //         key: "callend",
  //         val: payload?.callend["val"]
  //           ? new Date(payload?.callend)
  //           : new Date().setHours(23, 59, 59),
  //       },
  //       user_uuid: {
  //         key: "user_uuid",
  //         //val: payload?.user_uuid?.length ? payload?.user_uuid?.split(",") : [],
  //         val: payload["user_uuid"]["val"]? payload["user_uuid"]["val"]: [],

  //       },
  //     });
  //     setFilter({ ...filter, isAdvance: true });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // useLayoutEffect(() => {
  //   onGetData();
  // }, [filter]);
  useLayoutEffect(() => {
    if (filter?.isAdvance) {
      onSearchData();
    } else {
      onGetData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  // Preapring Data for Export File
  const headers = [
    { label: "Date", key: "converted_date" },
    { label: "User", key: "user_name" },
    { label: "Caller ID", key: "caller_id_number" },
    { label: "Phone Number", key: "destination_number" },
    { label: "Route", key: "pbx_feature" },
  ];

  const prepareExportProps = () => {
    const rows = (allMissedCall?.data || []).map((r: any) => ({
      ...r,
      caller_id_number: r?.caller_id_number ? `\t${r.caller_id_number}` : "",
      destination_number: r?.destination_number ? `\t${r.destination_number}` : "",
    }));

    return { headers, data: rows, filename: "MissedCall.csv" };
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

  // Fetching Voice Broadcast  Data
  const onGetData = useDebouncedCallback(async () => {
    setCsvLoading(true);
    setLoading(true);
    try {
      const params = { ...filter };
      delete params["isAdvance"];
      await dispatch(missedCallGet(params)).unwrap();
      setCsvLoading(false);
      setLoading(false);
    } catch (err) {
      setCsvLoading(false);
      setLoading(false);
      console.error("Get Missed Call Err =-=>", err);
    }
  }, 500);

  // Fetching User Performance Data
  // const onGetData = useDebouncedCallback(async () => {

  //    setLoading(true);
  //       try {
  //       // if (filter?.isAdvance) {
  //        const payload: any = {
  //          [data["callstart"]["key"]]: formatDate(data["callstart"]["val"], true),
  //          [data["callend"]["key"]]: formatDate(data["callend"]["val"], true),
  //          [data["user_uuid"]["key"]]:data["user_uuid"]["val"],
  //            [data["caller_id_number"]["key"]]: data["caller_id_number"]["val"],
  //            [data["destination_number"]["key"]]: data["destination_number"]["val"],
  //            // page: filter?.page,
  //            // limit: missedCall?.count || 0,
  //            ...filter,
  //        };
  //        Object.entries(payload)?.forEach(([key, val]: any) => {
  //          if (!val) {
  //            delete payload[key];
  //          }
  //        });
  //        delete payload["isAdvance"];
  //        await dispatch(missedCallGet(payload)).unwrap();
  //        setLoading(false);
  //    //  }  else {
  //        // const params = { ...filter };
  //        // params["limit"] = missedCall?.count || 0;
  //        // delete params["isAdvance"];
  //        // await dispatch(missedCallAllGet(params)).unwrap();
  //     // }
  //    }
  //      catch (err) {
  //        setLoading(false);
  //        console.error("Get Missed Call Err =-=>", err);
  //      }
  //      // }
  //    }, 500);


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
      // Cookies.set("searched_filter", JSON.stringify(payload));
      await dispatch(missedCallSearch(payload)).unwrap();
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

  // Advance Search Fields Empty & Fetching User Performance Data
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
        // name="up"
        // length={missedCall?.count || ""}
        csvProps={prepareExportProps()}
        csvloader={csvLoading}
        isCsvDownload={isCsvDownload}
        setIsCsvDownload={setIsCsvDownload}
        // onCsvClick={() => onSearchData()}
        onCsvClick={() => {
          //console.log('CSV Download Clicked');
          onGetData();
          setIsCsvDownload(true);
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
          // onSearchData();
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
          label="User ID"
          placeholder="Select User ID"
          removable
          // isMulti
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
              data={missedCall?.data?.length ? missedCall?.data : []}
              page={filter.page}
              totalCount={missedCall?.count || 0}
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
    </div>
  );
};

export default MissedCall;
