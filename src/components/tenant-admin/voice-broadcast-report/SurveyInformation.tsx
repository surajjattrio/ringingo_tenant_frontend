import { useEffect, useState } from "react";

// PROJECT IMPORTS
import { getSingleVoiceInfo } from "@/redux/slice/tenant-admin/voiceBroadcastReportSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Icon, Loader } from "@/components/ui-components";

// TYPES
interface SurveyInformationProps {
  isVoiceInfoID: string;
  setIsVoiceInfoID: any;
  newData: any;
}

const SurveyInformation = (props: SurveyInformationProps) => {
  const { isVoiceInfoID = null, setIsVoiceInfoID, newData } = props;

  const [infoData, setInfoData] = useState<any>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isVoiceInfoID) {
      onGetSingleVoiceInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVoiceInfoID]);

  const dispatch = useAppDispatch();

  // GET VOICE SURVEY INFORMATION
  const onGetSingleVoiceInfo = async () => {
    setIsLoading(true);
    try {
      const res: any = await dispatch(
        getSingleVoiceInfo(isVoiceInfoID)
      ).unwrap();

      if (res && res?.statusCode === 200) {
        setInfoData(JSON.parse(res?.data.survey_details) || []);
        console.log("Data", infoData);
        /// setInfoData(res?.data?.[0]?.survey_information?.[0] || []);
        setIsLoading(false);
      }
    } catch (error: any) {
      setIsLoading(false);
      setInfoData([]);
      console.log(
        "get single voice survey information err--->",
        error?.message
      );
    }
  };
  /* ============================== SURVEY INFORMATION ============================== */

  return (
    <>
      <div
        className={`w-full scrollbar-hide h-[calc(100vh-178px)] overflow-y-auto drop-shadow-xl bg-white rounded-lg ${!isVoiceInfoID && "hidden"
          }`}
      >
        <div className="py-2 bg-secondary 3xl:px-4 px-3 rounded-t-lg sticky top-0 z-[5]">
          <div className="flex items-center flex-row-reverse justify-between">
            <Icon
              name="CloseWhite"
              height={16}
              width={16}
              onClick={() => {
                setIsVoiceInfoID(null);
                setInfoData(infoData);
              }}
            />
            <span className="3xl:text-sm text-xs text-white font-bold">
              Survey Information
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className=" h-[calc(100vh-233px)]">
            <Loader />
          </div>
        ) : (
          <>
            <div>
              {infoData && infoData.length ? (
                <div className="px-4 pb-4">
                  <div className="3xl:py-2 py-1 flex items-center justify-between">
                    <div>
                      <label
                        className="text-sm font-bold text-heading"
                        style={{ marginTop: "30px", padding: "51px" }}
                      >
                        Name
                      </label>
                      <label
                        className="text-sm font-bold text-heading"
                        style={{ marginTop: "30px", padding: "51px" }}
                      >
                        Survey Digit
                      </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-x-1">
                    {infoData.map((data: any) => {
                      return (
                        <>
                          <div className="col-span-2">
                            <span
                              className="3xl:text-xs text-[11px] text-heading"
                              style={{ marginTop: "30px", padding: "51px" }}
                            >
                              {data.greeting_name}
                            </span>
                          </div>
                          <div className="col-span-2">
                            <span
                              className="3xl:text-xs text-[11px] text-heading"
                              style={{ marginTop: "30px", padding: "70px" }}
                            >
                              {data.pressed_survey_digit}
                            </span>
                          </div>
                        </>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SurveyInformation;
