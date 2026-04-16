"use client";
import React, { Fragment, useEffect, useLayoutEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

// PROJECT IMPORTS
import { useAppDispatch } from "@/redux/hooks";
import {
  agentCallPause,
  campaignGet,
  realTimeReportGet,
  realTimeReportSearch,
  useCampaignOptions,
  useRealtimeAgentsList,
  useRealtimeCampaignDetails,
  useRealtimeLiveData,
  realTimeReportUpdate,
  agentPutOnBreak,
  useRealtimeQueueDetails,
  useRealtimeliveAgentsOnCallsData,
  useRealtimeCallsCountData,
  adminLogout,
} from "@/redux/slice/tenant-admin/realtimeReportSlice";
import { Button, Select } from "@/components/forms";
import { Danger, Success } from "@/redux/services/toasterServices";

import {
  useUserOptions,
  userOptionsGet,
} from "@/redux/slice/tenant-admin/userSlice";
import { SEARCH_ERROR_MESSAGE } from "@/config/constant";
import { SearchBar } from "@/components/pickers";
import RealtimeAccordion from "@/components/tenant-admin/realtime-reports/RealtimeAccordion";
import RealtimeCard from "@/components/tenant-admin/realtime-reports/RealtimeCard";
import { Filter, Icon, Table } from "@/components/ui-components";
import { timeoutOptions3 } from "@/config/options";
import { IconKey } from "@/components/ui-components/Icon";
import { dialLevelOptions } from "@/config/options";

// THIRD-PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";

// TYPES IMPORT
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";
import { setTimes, toggleDrawer, useTime } from "@/redux/slice/commonSlice";
import AgentCallActionModal from "@/components/tenant-admin/realtime-reports/AgentCallActionModal";
import { sipNameOptionsGet } from "@/redux/slice/tenant-admin/sipDevicesSlice";
import BreakTimerModal from "@/components/manager-tenant-pages/reports/realtime-report/BreakTimerModal";
import { formatTime } from "@/helperFunctions";
import { Modal } from "@/components/modals";

interface RealtimeStaticCardType {
  icon: IconKey;
  title: string;
  count: number | object;
}

// NAME STATE
const initialValues: any = {
  agent_uuid: { key: "agent_uuid|4", val: "", dropdown: "4" },
  campaign_uuid: { key: "campaign_uuid|4", val: "", dropdown: "4" },
};

const RealTimeReportTimer = ({
  setResetTimer,
  resetTimer,
  setFilter,
  filter,
  time,
}: any) => {
  const [second, setSecond] = useState<number>(0);
  const [minute, setMunite] = useState<number>(0);

  // TIMER SETUP
  useEffect(() => {
    setFilter({
      ...filter,
    });
    let count: number = time;
    let interval: any;
    if (time > 0) {
      interval = setInterval(() => {
        // count--;
        if (count > 179) {
          setMunite(3);
          setSecond(count - 180);
        } else if (count > 119) {
          setMunite(2);
          setSecond(count - 120);
        } else if (count > 59) {
          setMunite(1);
          setSecond(count - 60);
        } else {
          setMunite(0);
          setSecond(count);
        }
        count--;
        if (count < 0) {
          clearInterval(interval);
          setResetTimer(!resetTimer);
          // setSecond(0);
          // setMunite(0);
        }
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time, resetTimer]);

  return (
    <span className="text-sm font-semibold text-heading">
      {"0" + minute + ":" + (second > 9 ? second : "0" + second)}
    </span>
  );
};

const RealTimeDB = () => {
  const dispatch = useAppDispatch();

  const agentsList = useRealtimeAgentsList();
  const queueDetails = useRealtimeQueueDetails();
  const campaignDetails = useRealtimeCampaignDetails();
  const agentsLiveData = useRealtimeLiveData();
  const userOptions = useUserOptions();
  const campaignOptions = useCampaignOptions();
  const times = useTime();
  const agentOnCallData = useRealtimeliveAgentsOnCallsData();
  const liveCallsCountData = useRealtimeCallsCountData();

  console.log("agentsList", queueDetails);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [modaldata, setModalData] = useState<string>("");
  const [data, setData] = useState<any>(initialValues);
  const [resetTimer, setResetTimer] = useState<any>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [time, setTime] = useState<number>(times);
  const [infoData, setInfoData] = useState<any>(null);
  const [dialLevel, setDialLevel] = useState<any>(null);

  const [openBreakModal, setOpenBreakModal] = useState(false);
  const [selectedBreakcodes, setSelectedBreakcodes] = useState([]);
  const [selectedRow, setSelectedRow] = useState<any>();
  const [logoutId, setLogoutId] = useState<any>("");

  // console.log("selectedRow", selectedRow);

  const onBreakSelection = async (agent_uuid: any, breakcode: any) => {
    // console.log("on break selection funciton", breakcode)
    const result: any = await dispatch(agentPutOnBreak({ status: "on", breakcode, agent_uuid }));
    // console.log("rwuhqfsfdafsda",result.payload);

    if (result?.payload?.success) {
      Success(result?.payload?.message)
    }
    setOpenBreakModal(false);
  }

  const handleBackToWork = async (agent_uuid: any, remainingTime: any) => {
    console.log("on break selection funciton", remainingTime)
    const result: any = await dispatch(agentPutOnBreak({ status: "off", breakcode: "", agent_uuid: agent_uuid }));
    if (result?.payload?.success) {
      //   localStorage.setItem("break_timer", "")
      Success(result?.payload?.message)
    }
    setOpenBreakModal(false);
  }

  const [filter, setFilter] = useState<FilterTypes>({
    page: 1,
    limit: 10,
    search: "",
    isAdvance: false,
  });

  const [isFullScreen, setIsFullScreen] = useState(false);
  const toggleFullScreen = () => {
    if (isFullScreen) {
      // Exit fullscreen mode
      dispatch(toggleDrawer(true));
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    } else {
      // Enter fullscreen mode
      dispatch(toggleDrawer(false));
      const element = document.documentElement;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      }
    }

    setIsFullScreen(!isFullScreen);
  };

  const realtimeStaticCardData: RealtimeStaticCardType[] = [
    {
      icon: "ActiveCall",
      title: "Active Calls",
      count: agentsLiveData?.activeCalls || 0,
    },
    {
      icon: "CallRinging",
      title: "Call Ringing",
      count: agentsLiveData?.callAgentRinging || {},
    },
    {
      icon: "AwaitingAgent",
      title: "Calls Waiting for Agent",
      count: agentsLiveData?.callAgentWaiting || {},
    },
    {
      icon: "AgentLogin",
      title: "Agents Login",
      count: agentsLiveData?.activeLogin || 0,
    },
    {
      icon: "AgentWaiting",
      title: "Agents Waiting",
      count: agentsLiveData?.agentWaiting || 0,
    },

    {
      icon: "AgentOnCall",
      title: "Agents on Calls",
      count: agentsLiveData?.agentOnCall || 0,
    },
    {
      icon: "AgentOnBreak",
      title: "Agents on Break",
      count: agentsLiveData?.agentBreak || 0,
    },
  ];

  // AGENT TABLE COLUMNS
  const Agentcolumns: ColumnsType[] = [
    {
      name: "agent_status",
      title: "Status",
      sortable: true,
      action: (row: any) => {
        return (
          <div
            className={`${row?.status === "0"
              ? "bg-[#66A286]"
              : row?.status === "1"
                ? "bg-[#9290E4]"
                : row?.status === "2"
                  ? "bg-[#E49090]"
                  : row?.status === "3"
                    ? "bg-[#E490E1]"
                    : row?.status === "4"
                      ? "bg-[#90C6E4]"
                      : row?.status === "5"
                        ? "bg-[#90DAE4]"
                        : row?.status === "6"
                        ? "bg-amber-500"
                        : row?.status === "7"
                          ? "bg-[#000000]"
                          : ""
              } px-3 py-1 rounded-md`}
          >
            <label className="text-white">{row?.agent_status}</label>
          </div>
        );
      },
    },
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
      name: "campaign_name",
      title: "Campaign",
      sortable: true,
    },
    {
      name: "extension_name",
      title: "Extension",
      sortable: true,
    },
    {
      name: "phone_number",
      title: "Phone Number",
      sortable: true,
      action: (row: any) => {
        return (
          <div>
            {row?.agent_status !== "Idle" && row?.agent_status !== "Pause" && row?.agent_status !== "Break"
              ? row?.phone_number
              : ""}
          </div>
        );
      },
    },
    {
      name: "loginTime",
      title: "Duration",
      sortable: true,
    },
    // {
    //   name: "total_calls",
    //   title: "Total Calls",
    //   sortable: true,
    // },
    {
      name: "break_name",
      title: "Break Name",
      sortable: true,
    },
    {
      name: "monitor",
      title: "Monitor",
      action: (row: any) => {
        return (
          <>
            <div className="flex gap-2">
              {row?.agent_status === "On Outgoing call" ||
                row?.agent_status === "On Incoming call" ? (
                <>
                  <Icon
                    tooltip="Monitor"
                    name="UserCalling"
                    width={20}
                    height={20}
                    alt="User"
                    onClick={() => onCallPause(row, "Monitor")}
                  />
                  <Icon
                    tooltip="Watch"
                    name="Eye"
                    width={20}
                    height={20}
                    alt="Eye"
                    onClick={() => onCallPause(row, "Barge")}
                  />
                  <Icon
                    tooltip="Whisper"
                    name="Ear"
                    width={20}
                    height={20}
                    alt="Ear"
                    onClick={() => onCallPause(row, "Whisper")}
                  />
                  <Icon
                    tooltip="Break"
                    name="Breakcode"
                    width={20}
                    height={20}
                    alt="Breakcode"
                    onClick={() => {
                      setSelectedBreakcodes(row.breakcode_data || []);
                      setSelectedRow(row);
                      setOpenBreakModal(true);
                    }}
                  />
                </>
              ) : (
                <>
                  <Icon tooltip="Monitor" name="UserCalling" width={20} height={20} alt="User" />
                  <Icon tooltip="Watch" name="Eye" width={20} height={20} alt="Eye" />
                  <Icon tooltip="Whisper" name="Ear" width={20} height={20} alt="Ear" />
                  <Icon
                    tooltip="Break"
                    name="Breakcode"
                    width={20}
                    height={20}
                    alt="Breakcode"
                    onClick={() => {
                      setSelectedBreakcodes(row.breakcode_data || []);
                      setSelectedRow(row);
                      setOpenBreakModal(true);
                    }}
                  />
                  <Icon
                    tooltip="Logout"
                    name="Exit"
                    width={20}
                    height={20}
                    alt="Exit"
                    onClick={() => setLogoutId(row?.agent_uuid)}
                  />
                  {row?.agent_status === "Break" && (
                    <button
                      className={`bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs font-semibold transition-colors`}
                      onClick={() => handleBackToWork(row.agent_uuid, 0)}
                    >
                      Make Ready
                    </button>
                  )}
                </>
              )}
            </div>
          </>
        );
      },
    },

  ];

  // CALLS IN QUEUE TABLE COLUMNS
  const CallInQueue: ColumnsType[] = [
    {
      name: "queue_status",
      title: "Status",
      sortable: true,
      action: (row: any) => {
        return (
          <div
            className={`${row?.status === "0"
              ? "bg-[#66A286]"
              : row?.status === "1"
                ? "bg-[#9290E4]"
                : row?.status === "2"
                  ? "bg-[#E49090]"
                  : row?.status === "3"
                    ? "bg-[#E490E1]"
                    : row?.status === "4"
                      ? "bg-[#90C6E4]"
                      : row?.status === "5"
                        ? "bg-[#90DAE4]"
                        : row?.status === "7"
                          ? "bg-[#000000]"
                          : ""
              } px-3 py-1 rounded-md`}
          >
            <label className="text-white">{row?.queue_status}</label>
          </div>
        );
      },
    },
    {
      name: "queue_name",
      title: "Queue Name",
      sortable: true,
    },
    {
      name: "phone_number",
      title: "Phone Number",
      sortable: true,
    },
    {
      name: "did_number",
      title: "DID",
      sortable: true,
    },
    {
      name: "wait_time",
      title: "Wait Time",
      sortable: true,
      // action: (row: any) => {
      //   return (
      //     <div>
      //       {row?.agent_status !== "Idle" && row?.agent_status !== "Pause"
      //         ? row?.phone_number
      //         : ""}
      //     </div>
      //   );
      // },
    },
    {
      name: "call_type",
      title: "Call Type",
      sortable: true,
    },
  ];

  // QUEUE WISE AGENT TABLE COLUMNS
  const QueueWiseAgents: ColumnsType[] = [
    {
      name: "queue_name",
      title: "Campaign",
      sortable: true,
    },
    {
      name: "agents",
      title: "Logged In Agents",
      sortable: true,
    },
    {
      name: "ready_status",
      title: "Ready Status",
      sortable: true,
    },
    {
      name: "waiting_calls",
      title: "Waiting Calls",
      sortable: true,
    },
    {
      name: "active_calls",
      title: "Active Calls",
      sortable: true,
    },
    {
      name: "abandoned_calls",
      title: "AbandonedCalls",
      sortable: true,
    },
  ];

  // Initial data for CALLS IN QUEUE TABLE
  const initialCallsInQueue = [
    {
      queue_status: "Ringing",
      status: "0", // will show greenish (#66A286)
      queue_name: "Support Queue",
      phone_number: "+91 9876543210",
      did_number: "1800-123-456",
      wait_time: "00:01:23",
      call_type: "Inbound",
    },
    {
      queue_status: "In Progress",
      status: "1", // bluish (#9290E4)
      queue_name: "Sales Queue",
      phone_number: "+91 9123456789",
      did_number: "1800-555-111",
      wait_time: "00:02:45",
      call_type: "Outbound",
    },
    {
      queue_status: "Abandoned",
      status: "2", // reddish (#E49090)
      queue_name: "Billing Queue",
      phone_number: "+91 9988776655",
      did_number: "1800-777-888",
      wait_time: "00:00:59",
      call_type: "Inbound",
    },
  ];

  // Initial data for QUEUE WISE AGENTS TABLE
  const initialQueueWiseAgents = [
    {
      campaign_name: "Support Campaign",
      agents: 12,
      ready_status: 8,
      waiting_calls: 3,
      active_calls: 5,
      abandoned_calls: 1,
    },
    {
      campaign_name: "Sales Campaign",
      agents: 10,
      ready_status: 6,
      waiting_calls: 4,
      active_calls: 2,
      abandoned_calls: 0,
    },
    {
      campaign_name: "Billing Campaign",
      agents: 8,
      ready_status: 5,
      waiting_calls: 2,
      active_calls: 1,
      abandoned_calls: 2,
    },
  ];

  // ---------------- LIVE CALLS ----------------
  const liveCallsSeries = liveCallsCountData?.activeCalls > 0 ||
    liveCallsCountData?.waitingCalls > 0 ||
    liveCallsCountData?.ringingCalls > 0 ||
    liveCallsCountData?.ivrCalls > 0
    ? [liveCallsCountData.activeCalls,
    liveCallsCountData.waitingCalls,
    liveCallsCountData.ringingCalls,
    liveCallsCountData.ivrCalls]
    : [5, 4, 4, 55];

  const liveCallsOptions: ApexOptions = {
    chart: { type: "pie" as const },   // ✅ fixed typing
    labels: ["Active calls", "Waiting calls", "Ringing calls", "Calls In IVR"],
    colors: ["#66BB6A", "#FFEB3B", "#9575CD", "#F48FB1"],
    legend: {
      position: "right",
      formatter: function (seriesName: string, opts: any) {
        return `${seriesName} (${opts.w.globals.series[opts.seriesIndex]})`;
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return val.toFixed(1) + "%";
      },
    },
  };

  // ---------------- AGENTS ----------------
  const agentsSeries = agentOnCallData?.pausedCount > 0 || agentOnCallData?.inCallsCount > 0
    ? [agentOnCallData.inCallsCount, agentOnCallData.pausedCount]
    : [10, 12];


  const agentsOptions: ApexOptions = {
    chart: { type: "pie" as const },   // ✅ fixed typing
    labels: ["In Calls", "Paused"],
    colors: ["#81C784", "#9575CD"],
    legend: {
      position: "right",
      formatter: function (seriesName: string, opts: any) {
        return `${seriesName} (${opts.w.globals.series[opts.seriesIndex]})`;
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return val.toFixed(1) + "%";
      },
    },
  };

  // CAMPAIGN TABLE COLUMNS
  const CampaignColumns: ColumnsType[] = [
    {
      name: "campaign_name",
      title: "Name",
      sortable: true,
    },
    {
      name: "campaignType",
      title: "Campaign Type",
      sortable: true,
    },
    {
      name: "dial_level",
      title: "Dial Level",
      sortable: true,
      action: (row: any) => {
        return (
          <Select
            name=""
            className="!w-[80px]"
            options={dialLevelOptions}
            value={row.dial_level}
            onChange={(e: any) => {
              const data = e.target.value;
              const camp_uuid = row.uuid; // Get dial_level from the row object
              newDialLevel(data, camp_uuid, e);
            }}
          />
        );
      },
    },
    {
      name: "totalCalls",
      title: "Total Calls",
      sortable: true,
    },
    {
      name: "success_calls",
      title: "Success",
      sortable: true,
    },
    {
      name: "failed_calls",
      title: "Failed",
      sortable: true,
    },
    {
      name: "drop_calls",
      title: "Drop",
      sortable: true,
      action: (row: any) => {
        return row?.drop_calls?.toString().concat("(" + row.drop + "%)");
      },
    },
    {
      name: "short_calls",
      title: "Short Calls",
      sortable: true,
      action: (row: any) => {
        return row?.short_calls?.toString().concat("(" + row.shortCalls + "%)");
      },
    },
    {
      name: "acd",
      title: "ACD",
      sortable: true,
    },
    {
      name: "totalLeads",
      title: "Total Leads",
      sortable: true,
    },
    // {
    //   name: "lead_count",
    //   title: "Leads in Queue",
    //   sortable: true,
    // },
    {
      name: "lead_count",
      title: "Leads in Queue",
      sortable: true,
      action: (row: any) => {
        return (
          <div
            className={`${row?.lead_count === 0
              ? "text-error" // Display red color when lead_count is 0
              : ""
              } `}
          >
            <label>{row?.lead_count}</label>
          </div>
        );
      },
    },
    {
      name: "leadUsed",
      title: "Leads Used",
      sortable: true,
      action: (row: any) => {
        if (row.leadUsed == undefined) {
          return "-";
        } else {
          return row.leadUsed;
        }
      },
    },
  ];

  const onCallPause = async (data: any, title: string) => {
    try {
      let payload = {
        caller_id_number: data?.caller_id_number,
        destination: data?.phone_number,
        direction:
          data?.campaign_type === "0"
            ? "outbound"
            : data?.campaign_type === "2"
              ? "blended"
              : data?.campaign_type === "1"
                ? "inbound"
                : "inbound",
      };
      const res: any = await dispatch(agentCallPause(payload)).unwrap();
      if (res && res.statusCode === 200) {
        setShowModal(true);
        setTitle(title);
        setModalData(res.data);
      }
    } catch (error: any) {
      console.log("call pause err:->", error?.message);
    }
  };

  // useEffect( () => {
  //   const handleEscapeKey = (event:any) => {
  //     if (event.key === 'Escape') {
  //       // Your code to handle the "Escape" key press goes here
  //       alert('Escape key pressed');
  //     }
  //   };

  //   // Add the event listener when the component mounts
  //   document.addEventListener('keydown', handleEscapeKey);

  //   // Remove the event listener when the component unmounts
  //   return () => {
  //     document.removeEventListener('keydown', handleEscapeKey);
  //   };
  // },[isFullScreen]);

  useEffect(() => {
    onGetUserOptions();
    onGetCampaign();
    onGetSipNameOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetching SIP Devices Options
  const onGetSipNameOptions = async () => {
    try {
      await dispatch(sipNameOptionsGet());
    } catch (err) {
      console.error("Get SIP Options Err =-=>", err);
    }
  };

  // Fetching User Options
  const onGetUserOptions = async () => {
    try {
      await dispatch(userOptionsGet());
    } catch (err) {
      console.error("Get User Options Err =-=>", err);
    }
  };

  // Fetching campaign Options
  const onGetCampaign = async () => {
    try {
      await dispatch(campaignGet()).unwrap();
    } catch (error: any) {
      console.log("Get campaign list Err ---->", error?.message);
    }
  };

  // Fetching Lead Management Data
  const onGetData = useDebouncedCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filter };
      delete params["isAdvance"];
      await dispatch(realTimeReportGet(params)).unwrap();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("Get Lead Management Err =-=>", err);
    }
  }, 500);

  useLayoutEffect(() => {
    if (filter?.isAdvance) {
      onSearchData();
    } else {
      onGetData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  // Fetching Dial Level Data
  const newDialLevel = async (data: any, camp_uuid: any, e: any) => {
    setLoading(true);
    try {
      const payload = {
        id: camp_uuid,
        dial_level: data,
      };
      console.log("Payload:", payload);
      const res: any = await dispatch(realTimeReportUpdate(payload)).unwrap();
      if (res?.statusCode === 200) {
        Success(res?.data);
        setFilter({ ...filter });
      } else {
        Danger(res?.data);
      }
    } catch (err) {
      setLoading(false);
      console.error("Update New Dial Level Err =-=>", err);
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
    if (!(data["agent_uuid"]["val"] || data["campaign_uuid"]["val"])) {
      Danger(SEARCH_ERROR_MESSAGE);
      return false;
    }

    setLoading(true);
    try {
      const payload = {
        [data["agent_uuid"]["key"]]: data["agent_uuid"]["val"],
        [data["campaign_uuid"]["key"]]: data["campaign_uuid"]["val"],
      };
      Object.entries(payload)?.forEach(([key, val]: any) => {
        if (!val) {
          delete payload[key];
        }
      });
      await dispatch(realTimeReportSearch(payload)).unwrap();
      setLoading(false);
    } catch (e: any) {
      setLoading(false);
      console.error("Search data Err --->", e.message);
    }
  };

  // Advance Search Fields Empty & Fetching Lead Management Data
  const onEmptySearch = () => {
    setIsOpen(false);
    setData(initialValues);
    setFilter({
      ...filter,
      page: 1,
      limit: 10,
      isAdvance: false,
    });
  };

  const onLogoutUser = async (id: string) => {
    try {
      const data: any = { entity: "tenant", id: id }
      const res: any = await dispatch(adminLogout(data));
      console.log("asdasasdddaaaaaaa", res);
      if (res?.payload?.statusCode == 200) {
        Success(res?.payload?.data);
      } else {
        Danger(res?.payload?.data)
      }
      // const newdata: any = await apiInstance.get(`user` + `/${id}`);
      // if (newdata && newdata?.statusCode === 200) {
      //   const socket = io(baseUrl, {
      //     query: {
      //       token: newdata.data.browserToken,
      //       uuid: id,
      //       new_token: "force",
      //     },
      //   });
      //   console.log(socket);
      //   //Success(res?.data);
      // }
      // } else {
      //     //Danger(res?.data);
      // }

      setLogoutId("");
    } catch (err) {
      setLogoutId("");
      console.error("Logout User Err =-=>", err);
    }
  };

  return (
    <>
      <div className="flex justify-end w-full items-center mt-5 px-5">
        <div className="flex h-full gap-4">
          <Button
            style="header"
            className="p-2"
            text={isFullScreen ? "Exit Fullscreen" : "Full screen"}
            onClick={() => {
              toggleFullScreen();
            }}
          />

          {/* <SearchBar
            className="h-10 w-56 bg-white"
            placeholder="Search by Keyword"
            value={filter?.search}
            onChange={(e: any) =>
              setFilter({ ...filter, search: e.target.value })
            }
          /> */}
          <div className="flex items-center justify-center">
            <div className="h-6 w-[1px] bg-gray-300"></div>
          </div>
          <Filter onClick={() => setIsOpen(!isOpen)} />
          <Button
            // tooltip="Refresh"
            style="header"
            className="p-2"
            icon="Refresh3"
            onClick={() => {
              setResetTimer(!resetTimer);
              setFilter({
                ...filter,
              });
            }}
          />
          <div className="w-[50px] flex items-center justify-end">
            <RealTimeReportTimer
              setResetTimer={setResetTimer}
              resetTimer={resetTimer}
              setFilter={setFilter}
              filter={filter}
              time={time}
            />
          </div>
          <Select
            className="w-[150px]"
            name="timeout"
            isShowLabel={false}
            placeholder="Select Timeout"
            value={time}
            options={timeoutOptions3}
            onChange={(e: any) => {
              setTime(e?.target?.value);
              dispatch(setTimes(e?.target?.value));
            }}
            isInfo
            isNum
          />
        </div>
      </div>
      <div
        className={`relative z-[1] flex flex-col mt-5 bg-white rounded-md drop-shadow-lg ${isOpen ? "" : "hidden"
          }`}
      >
        <div className="flex items-center justify-between border-b border-dark-700 pl-10 pr-4 py-4">
          <span className="text-sm font-bold">Search</span>
          <Icon
            className="cursor-pointer"
            tooltip="Close"
            name="Close"
            width={20}
            height={20}
            alt="Close"
            onClick={onEmptySearch}
          />
        </div>
        <div className="px-5 pt-4 pb-8 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4">
          <Select
            name="agent_uuid"
            label="User"
            placeholder="Select User"
            removable
            value={data.agent_uuid.val}
            options={userOptions}
            onChange={(e: any) => handleChnage("agent_uuid", e.target.value)}
            isInfo
          />
          <Select
            name="campaign_uuid"
            label="Campaign"
            placeholder="Select campaign"
            removable
            value={data.campaign_uuid.val}
            options={campaignOptions}
            onChange={(e: any) => handleChnage("campaign_uuid", e.target.value)}
            isInfo
          />
        </div>
        <div className="flex py-4 justify-end items-center border-t shadow-box rounded-sm">
          <div className="flex gap-3 px-10">
            <Button
              className="px-3 py-2"
              text="Cancel"
              style="dark-outline"
              onClick={onEmptySearch}
            />
            <Button
              className="px-3 py-2"
              text="Search"
              style="primary"
              onClick={() => {
                setFilter({
                  ...filter,
                  page: 1,
                  limit: 10,
                  isAdvance: true,
                });
              }}
            />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-[30px] p-5">
        <div className="grid grid-cols-4 2lg:grid-cols-3 lg:grid-cols-3 2md:grid-cols-3 sm:grid-cols-2 sm:gap-2 gap-4 pb-4">
          {realtimeStaticCardData?.map((val: any, index: number) => {
            return (
              <Fragment key={index}>
                <RealtimeCard {...val} />
              </Fragment>
            );
          })}
        </div>
        <div className="py-2">
          <Table
            // tdStyle="!3xl:px-2 !px-1"
            mainClassName="!min-h-[calc(200px)]"
            className="!min-h-[calc(200px)] bg-white border bg-gray-5"
            headerClassName="bg-blue-50 !text-heading"
            sortIconColor="#13151F"
            columns={CampaignColumns}
            data={campaignDetails.length ? campaignDetails : []}
            selectable={false}
            pagination={false}
            showIcon={false}
            isExtra={false}
          />
        </div>

        <div className="py-2 grid grid-cols-2 2lg:grid-cols-2 lg:grid-cols-2 2md:grid-cols-3 sm:grid-cols-2 sm:gap-2 gap-4">
          {/* Live Calls Pie */}
          <div className="bg-white border rounded-lg p-4 shadow">
            <h2 className="text-lg font-semibold mb-2">Live Calls</h2>
            <Chart
              options={liveCallsOptions}
              series={liveCallsSeries}
              type="pie"
              height={320}
            />
          </div>

          {/* Agents Pie */}
          <div className="bg-white border rounded-lg p-4 shadow">
            <h2 className="text-lg font-semibold mb-2">Agents</h2>
            <Chart
              options={agentsOptions}
              series={agentsSeries}
              type="pie"
              height={320}
            />
          </div>
        </div>

        {/* <RealtimeAccordion title="Campaign List">
      </RealtimeAccordion> */}
        <div className="pt-2">
          <span className="border-2 border-[#322996] rounded-xl px-2 bg-[#EFF6FF]">Calls in Queue</span>
          <Table
            // tdStyle="!3xl:px-2 !px-1"
            mainClassName="!min-h-[calc(200px)] mt-3"
            className="!min-h-[calc(200px)] bg-white border bg-gray-5"
            headerClassName="bg-blue-50 !text-heading"
            sortIconColor="#13151F"
            // isLoading={loading}
            columns={CallInQueue}
            data={queueDetails && queueDetails?.flatMap((q: any) => q.calls.map((c: any) => ({
              ...c,
              queue_name: q.queue_name, // keep queue info with each call
              agents: q.agents,
              wait_time: formatTime(c.wait_time, true),
              // active_calls: q.active_calls,
              // abandoned_calls: q.abandoned_calls
            }))) || []}
            selectable={false}
            pagination={false}
            showIcon={false}
            isExtra={false}
          />
        </div>
        <div className="pt-2">
          <span className="border-2 border-[#322996] rounded-xl px-2 bg-[#EFF6FF]">Queue Wise Agent</span>
          <Table
            // tdStyle="!3xl:px-2 !px-1"
            mainClassName="!min-h-[calc(200px)] mt-3"
            className="!min-h-[calc(200px)] bg-white border bg-gray-5"
            headerClassName="bg-blue-50 !text-heading"
            sortIconColor="#13151F"
            // isLoading={loading}
            columns={QueueWiseAgents}
            data={queueDetails?.length ? queueDetails : []}
            selectable={false}
            pagination={false}
            showIcon={false}
            isExtra={false}
          />
        </div>
        <div className="pt-2">
          <Table
            // tdStyle="!3xl:px-2 !px-1"
            mainClassName="!min-h-[calc(200px)]"
            className="!min-h-[calc(200px)] bg-white border bg-gray-5"
            headerClassName="bg-blue-50 !text-heading"
            sortIconColor="#13151F"
            // isLoading={loading}
            columns={Agentcolumns}
            data={agentsList?.length ? agentsList : []}
            selectable={false}
            pagination={false}
            showIcon={false}
            isExtra={false}
          />
        </div>
      </div>

      {openBreakModal && (
        selectedRow.agent_status != "Break" && selectedRow.status != "3" ?
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-h-[80vh] overflow-y-auto relative">
              <button
                className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl"
                onClick={() => setOpenBreakModal(false)}
              >
                &times;
              </button>
              <h2 className="text-lg font-semibold mb-4">Breakcodes</h2>

              {selectedBreakcodes.length > 0 ? (
                <ul className="space-y-2">
                  {selectedBreakcodes.map((bc: any, idx) => (
                    <li key={idx} className="border p-2 rounded text-sm" onClick={() => onBreakSelection(selectedRow.agent_uuid, bc)}>
                      <div>{bc.name}{" - "}{`(${bc.break_code})`}</div>
                      <div>{`(${bc.duration})`}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">No breakcodes found.</p>
              )}
            </div>
          </div> :
          <BreakTimerModal setOpenBreakModal={setOpenBreakModal} agent={selectedRow} onBackToWork={(agent_uuid, remainingTime) => handleBackToWork(agent_uuid, remainingTime)} />
      )}


      {/* {openBreakModal && <BreakSelection options={agentsList?.breakcode_data} onBreakSelection={onBreakSelection} breakValue={breakValue}/>} */}


      {/* <RealtimeAccordion title="Agent List">
      </RealtimeAccordion> */}

      <AgentCallActionModal
        visible={showModal}
        title={title}
        data={modaldata}
        onCancelClick={() => {
          setShowModal(false);
          setTitle("");
          setModalData("");
        }}
      />

      <Modal
        visible={!!logoutId}
        doneStyle="error"
        title="Logout User"
        content="Are you sure you want to Logout User?"
        doneText="Logout"
        onDoneClick={() => onLogoutUser(logoutId)}
        onCancelClick={() => setLogoutId("")}
      />

    </>
  );
};

export default RealTimeDB;
