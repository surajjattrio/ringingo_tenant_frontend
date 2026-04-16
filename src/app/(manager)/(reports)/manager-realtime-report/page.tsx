"use client";
import React, { Fragment, useEffect, useLayoutEffect, useState } from "react";

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
} from "@/redux/slice/tenant-admin/realtimeReportSlice";
import { Button, Select } from "@/components/forms";
import {
  useUserOptions,
  userOptionsGet,
} from "@/redux/slice/tenant-admin/userSlice";
import { Danger, Success } from "@/redux/services/toasterServices";
import { SEARCH_ERROR_MESSAGE } from "@/config/constant";
import { SearchBar } from "@/components/pickers";
import RealtimeCard from "@/components/tenant-admin/realtime-reports/RealtimeCard";
import { Filter, Icon, Table } from "@/components/ui-components";
import { timeoutOptions3 } from "@/config/options";
import {
  onDial,
  onSetCallType,
  onSetStartRegistration,
  setAgentName,
  setCallScreen,
  setShowCallingIcon,
  setTimes,
  toggleDrawer,
  useAgentName,
  useTime,
} from "@/redux/slice/commonSlice";
import { sipNameOptionsGet } from "@/redux/slice/tenant-admin/sipDevicesSlice";
import { useAuth } from "@/contexts/hooks/useAuth";
import {
  tenantCallBarge,
  tenantCallMonitoring,
  tenantCallWhisper,
} from "@/redux/slice/tenant-admin/tenantLiveCallSlice";

// THIRD-PARTY IMPORT
import { useDebouncedCallback } from "use-debounce";

// TYPES IMPORT
import { IconKey } from "@/components/ui-components/Icon";
import { FilterTypes } from "@/types/filterTypes";
import { ColumnsType } from "@/types/tableTypes";

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

const RealtimeReport = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();

  const agentsList = useRealtimeAgentsList();
  const campaignDetails = useRealtimeCampaignDetails();
  const agentsLiveData = useRealtimeLiveData();
  const userOptions = useUserOptions();
  const campaignOptions = useCampaignOptions();
  const times = useTime();

  const [data, setData] = useState<any>(initialValues);
  const [resetTimer, setResetTimer] = useState<any>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [time, setTime] = useState<number>(times);
  const [isButtonsDisabled, setButtonsDisabled] = useState<boolean>(false);

  const [filter, setFilter] = useState<FilterTypes>({
    page: 1,
    limit: 10,
    search: "",
    isAdvance: false,
  });
  const [second, setSecond] = useState<number>(0);
  const [minute, setMunite] = useState<number>(0);
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
      icon: "CallDashboard",
      title: "Active Calls",
      count: agentsLiveData?.activeCalls || 0,
    },
    {
      icon: "CallingDashborad",
      title: "Call Ringing",
      count: agentsLiveData?.callAgentRinging || {},
    },
    {
      icon: "CallNotesDashboard",
      title: "Calls Waiting for Agent",
      count: agentsLiveData?.callAgentWaiting || {},
    },
    {
      icon: "AudioDashboard",
      title: "Agents Login",
      count: agentsLiveData?.activeLogin || 0,
    },
    {
      icon: "UserAudioDashboard",
      title: "Agents Waiting",
      count: agentsLiveData?.agentWaiting || 0,
    },

    {
      icon: "CallUsersDashboard",
      title: "Agents on Calls",
      count: agentsLiveData?.agentOnCall || 0,
    },
    {
      icon: "UserRemoveDashboard",
      title: "Agents on Break",
      count: agentsLiveData?.agentBreak || 0,
    },
  ];

  const getLocalStream = () => {
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then((stream) => {
        // window.localAudio.autoplay = true;
      })
      .catch((err) => {
        console.error(`you got an error: ${err}`);
      });
  };

  useEffect(() => {
    dispatch(onSetStartRegistration(true));
      getLocalStream();
 }, []);

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
    },
    {
      name: "loginTime",
      title: "Duration",
      sortable: true,
    },
    {
      name: "total_calls",
      title: "Total Calls",
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
                    onClick={() => onCallPauseClick(row, "Monitor")}
                    disabled={isButtonsDisabled}
                  />
                  <Icon
                    tooltip="Barge"
                    name="Eye"
                    width={20}
                    height={20}
                    alt="Eye"
                    onClick={() => onCallPauseClick(row, "Barge")}
                    disabled={isButtonsDisabled}

                  />
                  <Icon
                    tooltip="Whisper"
                    name="Ear"
                    width={20}
                    height={20}
                    alt="Ear"
                    onClick={() => onCallPauseClick(row, "Whisper")}
                    disabled={isButtonsDisabled}

                  />
                </>
              ) : (
                <>
                  <Icon name="UserCalling" width={20} height={20} alt="User" />
                  <Icon name="Eye" width={20} height={20} alt="Eye" />
                  <Icon name="Ear" width={20} height={20} alt="Ear" />
                </>
              )}
            </div>
          </>
        );
      },
    },
  ];

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
    },
    {
      name: "totalCalls",
      title: "Total Calls",
      sortable: true,
    },
    {
      name: "success",
      title: "Success(%)",
      sortable: true,
    },
    {
      name: "fail",
      title: "Failed(%)",
      sortable: true,
    },

    {
      name: "drop",
      title: "Drop(%)",
      sortable: true,
    },
    {
      name: "shortCalls",
      title: "Short Calls(%)",
      sortable: true,
    },
    {
      name: "totalLeads",
      title: "Total Leads",
      sortable: true,
    },
    {
      name: "lead_count",
      title: "Leads in Queue",
      sortable: true,
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

  // const onCallPauseClick = (data: any, title: string) => {
  //   dispatch(onSetStartRegistration(true));
  //   dispatch(onSetCallType(title));
  //   dispatch(setAgentName(data?.agent_name));
  //   setTimeout(() => {
  //     onCallPause(data, title);
  //   }, 3000);
  // };

  const onCallPauseClick = async (data: any, title: string) => {
    try {
      // Disable all buttons
      dispatch(setShowCallingIcon(true));
      dispatch(setCallScreen(""));
      dispatch(onSetCallType(title));
      dispatch(setAgentName(data?.agent_name));
  
      // Perform the call action
      await onCallPause(data, title);
  
      // Enable all buttons after the call is completed
      dispatch(setShowCallingIcon(false));
    } catch (error: any) {
      console.log("call pause err:->", error?.message);
  
      // Handle errors if needed
  
      // Enable all buttons in case of an error
      dispatch(setShowCallingIcon(false));
    }
  };


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
        const payload = {
          extension: user?.manager_detail?.extension_details[0]?.username,
          call_uuid: res?.data || "",
          domain: user?.manager_detail?.domain,
        };
        if (title === "Monitor") {
          const res: any = await dispatch(
            tenantCallMonitoring(payload)
          ).unwrap();
          if (res && res.statusCode === 200) {
            // Success(res?.data);
            // dispatch(onSetStartRegistration(true));
          }
        } else if (title === "Barge") {
          const res: any = await dispatch(tenantCallBarge(payload)).unwrap();
          if (res && res.statusCode === 200) {
            // Success(res?.data);
            // dispatch(onSetStartRegistration(true));
          }
        } else if (title === "Whisper") {
          const res: any = await dispatch(tenantCallWhisper(payload)).unwrap();
          if (res && res.statusCode === 200) {
            // Success(res?.data);
            // dispatch(onSetStartRegistration(true));
          }
        }
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

  return (
    <>
      <div className="relative z-[1] h-9 flex justify-end w-full items-center">
        <div className="flex h-full gap-4">
          <Button
            style="dark-outline"
            className="p-2"
            text={isFullScreen ? "Exit Fullscreen" : "Full screen"}
            onClick={() => {
              toggleFullScreen();
            }}
          />
          <SearchBar
            className="h-full w-56"
            placeholder="Search by Keyword"
            value={filter?.search}
            onChange={(e: any) =>
              setFilter({ ...filter, search: e.target.value })
            }
          />
          <Filter onClick={() => setIsOpen(!isOpen)} />
          <Button
            style="dark-outline"
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
            <span className="text-sm font-semibold text-heading">
              {"0" + minute + ":" + (second > 9 ? second : "0" + second)}
            </span>
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
      <div className="grid grid-cols-4 2lg:grid-cols-3 lg:grid-cols-3 2md:grid-cols-3 sm:grid-cols-2 sm:gap-2 gap-4 pt-3 pb-4">
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
          tdStyle="!3xl:px-2 !px-1"
          mainClassName="!min-h-[calc(200px)]"
          className="!min-h-[calc(200px)]"
          headerClassName="!bg-dark-800 !text-heading"
          sortIconColor="#13151F"
          columns={CampaignColumns}
          data={campaignDetails.length ? campaignDetails : []}
          selectable={false}
          pagination={false}
          showIcon={false}
          isExtra={false}
        />
      </div>
      {/* <RealtimeAccordion title="Campaign List">
      </RealtimeAccordion> */}
      <div className="pt-2">
        <Table
          tdStyle="!3xl:px-2 !px-1"
          mainClassName="!min-h-[calc(200px)]"
          className="!min-h-[calc(200px)]"
          headerClassName="!bg-dark-800 !text-heading"
          sortIconColor="#13151F"
          columns={Agentcolumns}
          data={agentsList?.length ? agentsList : []}
          selectable={false}
          pagination={false}
          showIcon={false}
          isExtra={false}
        />
      </div>
      {/* <RealtimeAccordion title="Agent List">
      </RealtimeAccordion> */}
    </>
  );
};
export default RealtimeReport;
