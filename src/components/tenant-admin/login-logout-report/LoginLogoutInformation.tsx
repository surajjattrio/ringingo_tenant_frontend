import { useEffect, useState } from "react";

// PROJECT IMPORTS
import { useAppDispatch } from "@/redux/hooks";
import { Icon, Loader } from "@/components/ui-components";
import { getSingleLoginLogoutInfo } from "@/redux/slice/tenant-admin/loginLogoutSlice";
import { format, intervalToDuration } from "date-fns";

// TYPES
interface LoginLogoutInformationProps {
  isLoginLogoutInfo: any;
  setIsLoginLogoutInfo: any;
}

const LoginLogoutInformation = (props: LoginLogoutInformationProps) => {
  const { isLoginLogoutInfo = null, setIsLoginLogoutInfo } = props;

  const [infoData, setInfoData] = useState<any>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isLoginLogoutInfo) {
      onGetSingleLoginLogoutInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoginLogoutInfo]);

  const dispatch = useAppDispatch();

  // GET Login Logout INFORMATION
  const onGetSingleLoginLogoutInfo = async () => {
    setIsLoading(true);
    try {
      const res: any = await dispatch(
        getSingleLoginLogoutInfo({
          date: isLoginLogoutInfo.date,
          agent_uuid: isLoginLogoutInfo?.agent_uuid,
        })
      ).unwrap();

      if (res && res?.statusCode === 200) {
        setInfoData(res?.data || []);
        setIsLoading(false);
      }
    } catch (error: any) {
      setIsLoading(false);
      setInfoData([]);
      console.log(
        "get single login logout information err--->",
        error?.message
      );
    }
  };

  const getEventStatus = (rowData: any) => {
    if (rowData.login_status === "0" && rowData.breakcode?.length) {
      return `Break End - ${rowData.breakcode[0].name}`;
    } else if (rowData.login_status === "0") {
      return "Login";
    } else if (rowData.login_status === "1" && rowData.breakcode?.length) {
      return `Break Start - ${rowData.breakcode[0].name}`;
    } else if (rowData.login_status === "2") {
      return "Logout";
    }
  };

  const getSubEventStatus = (rowData: any) => {
    if (rowData.login_status === "3") {
      return "Pause End";
    } else if (rowData.login_status === "4") {
      return "Pause Start";
    } else if (rowData.login_status === "5") {
      return "ACW Start";
    } else if (rowData.login_status === "6") {
      return "ACW End";
    }
  };

  const getDuration = (startDate: any, endDate: any) => {
    let newTime: any = intervalToDuration({
      start: new Date(startDate),
      end: new Date(endDate),
    });
    return `${
      (newTime?.hours > 9 ? newTime.hours : "0" + newTime.hours) +
      ":" +
      (newTime?.minutes > 9 ? newTime.minutes : "0" + newTime.minutes)
    }`;
  };

  const isDurationOver = (duration: string,breakCode: any) => {
    return duration > breakCode.duration ? 'error' : 'success';
  };

  const getEventDuration = (rowData: any, index: number) => {
    if (
      infoData[index - 1] &&
      rowData.login_status === "0" &&
      rowData.breakcode?.length
    ) {
      const duration = getDuration(infoData[index - 1]?.date_time, rowData?.date_time);
      return <span className={`text-${isDurationOver(duration,rowData.breakcode[0])}`} >{duration}</span>;
    } else if (rowData.login_status === "2") {
      // const duration = getDuration(infoData[0]?.date_time, rowData?.date_time);
      const firstLogin = infoData.find((d: any) => d.login_status === "0" && !d.breakcode?.length);
      const startTime = firstLogin ? firstLogin.date_time : infoData[0]?.date_time;
      const duration = getDuration(startTime, rowData?.date_time);
      return <span className="text-heading">{duration}</span>;
    } else if (rowData.login_status === "3") {
      for (let i = index - 1; i >= 0; i--) {
        if (infoData[i].login_status === "4") {
          const duration = getDuration(infoData[i].date_time, rowData.date_time);
          return <span className="text-heading">{duration}</span>;
        }
      }
    } else if (rowData.login_status === "6") {
      for (let i = index - 1; i >= 0; i--) {
        if (infoData[i].login_status === "5") {
          const duration = getDuration(infoData[i].date_time, rowData.date_time);
          return <span className="text-heading">{duration}</span>;
        }
      }
    }
  };

  /* ============================== Login Logout INFORMATION ============================== */

  if (!isLoginLogoutInfo) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={() => {
        setIsLoginLogoutInfo(null);
        setInfoData(infoData);
      }}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="py-2 bg-secondary 3xl:px-4 px-3 rounded-t-lg sticky top-0 z-[5] flex-shrink-0">
          <div className="flex items-center flex-row-reverse justify-between">
            <Icon
              className="cursor-pointer"
              name="CloseWhite"
              height={16}
              width={16}
              onClick={() => {
                setIsLoginLogoutInfo(null);
                setInfoData(infoData);
              }}
            />
            <span className="3xl:text-sm text-xs text-white font-bold">
              Detailed Activity
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {isLoading ? (
            <div className="h-[200px] flex items-center justify-center">
              <Loader />
            </div>
          ) : (
            <>
              {infoData && infoData.length ? (
                <div>
                  <div className="grid grid-cols-4 gap-x-1 sticky top-0 bg-white pt-4 pb-2 mb-2 z-10 border-b">
                    <div className="p-[5px] text-sm font-bold text-heading">
                      Time Stamp
                    </div>
                    <div className="p-[5px] text-sm font-bold text-heading">
                      Event
                    </div>
                    <div className="p-[5px] text-sm font-bold text-heading">
                      Sub Event
                    </div>
                    <div className="p-[5px] text-sm font-bold text-heading">
                      Duration(HH:MM)
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-x-1">
                    {infoData.map((data: any, index: number) => {
                      return (
                        <>
                          <div className="p-[10px]">
                            <span className="3xl:text-xs text-[11px] text-heading">
                              {data.date_time
                                ? format(new Date(data.date_time), "HH:mm")
                                : ""}
                            </span>
                          </div>
                          <div className="p-[10px]">
                            <span className="3xl:text-xs text-[11px] text-heading">
                              {getEventStatus(data)}
                            </span>
                          </div>
                          <div className="p-[10px]">
                            <span className="3xl:text-xs text-[11px] text-heading">
                              {getSubEventStatus(data)}
                            </span>
                          </div>
                          <div className="p-[10px]">
                            <span className="3xl:text-xs text-[11px]">
                              {getEventDuration(data, index)}
                            </span>
                          </div>
                        </>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginLogoutInformation;
