import { useEffect, useState } from "react";

// PROJECT IMPORTS
import { getSingleLeadInfo } from "@/redux/slice/tenant-admin/leadManagementSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Icon, Loader } from "@/components/ui-components";
import { formatDate } from "@/helperFunctions";

// THIRD - PARTY IMPORT
import { format, formatDistanceStrict, intervalToDuration } from "date-fns";

// TYPES
interface LeadInformationProps {
  isLeadInfoID: string;
  setIsLeadInfoID: any;
  setNoteData: any;
}

const LeadInformation = (props: LeadInformationProps) => {
  const { isLeadInfoID = null, setIsLeadInfoID, setNoteData } = props;

  const [infoData, setInfoData] = useState<any>("");
  const [cdrsNotesData, setCdrsNotesData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isLeadInfoID) {
      onGetSingleLeadInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLeadInfoID]);

  const onGetSingleLeadInfo = async () => {
    setIsLoading(true);
    try {
      const res: any = await dispatch(getSingleLeadInfo(isLeadInfoID)).unwrap();
      if (res && res?.statusCode === 200) {
        setInfoData(res?.data?.[0]?.lead_information?.[0] || {});
        setCdrsNotesData(res?.data?.[1]?.cdrs_and_notes || []);
      }
    } catch (error: any) {
      console.log("Error fetching single lead info:", error?.message);
    }
    setIsLoading(false);
  };

  const getDay = (date: string) => {
    let day: any = formatDistanceStrict(new Date(), new Date(date), {
      unit: "day",
    });
    return day === "0 days"
      ? "Today"
      : day === "1 days"
      ? "Yesterday"
      : day + " ago";
  };

  const getInfoDay = (date: string) => {
    let day: any = formatDistanceStrict(new Date(), new Date(date), {
      unit: "day",
    });
    return day === "0 days" ? "Today" : format(new Date(date), "dd/MM/yyyy");
  };

  const getDuration = (time: number) => {
    const dur = intervalToDuration({ start: 0, end: time * 1000 });
    return `${String(dur.hours).padStart(2, "0")}:${String(
      dur.minutes
    ).padStart(2, "0")}:${String(dur.seconds).padStart(2, "0")}`;
  };

  return (
    <div
      className={`w-full h-[calc(100vh-178px)] overflow-y-auto scrollbar-hide bg-white rounded-lg shadow-md transition-all duration-300 ${
        !isLeadInfoID && "hidden"
      }`}
    >
      {/* Header */}
      {/* <div className="py-3 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-t-lg flex justify-between items-center sticky top-0 z-10 shadow-md"> */}
      <div className="py-3 px-4 from-blue-600 via-indigo-600 to-purple-600 rounded-t-lg flex justify-between items-center sticky top-0 z-10 ">
      <div className="w-full text-center ">
        <h2 className="text-blue-900 font-semibold text-sm text-xl  tracking-wide ">

          Lead Information
        </h2>
        </div>
        <Icon
          name="CloseBlack"
          height={22}
          width={22}
          className="cursor-pointer hover:scale-110 transition-transform duration-200"
          onClick={() => {
            setIsLeadInfoID(null);
            setInfoData("");
            setCdrsNotesData([]);
          }}
        />
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="h-[calc(100vh-233px)]   ">
          <Loader />
        </div>
      ) : (
        <>
          {/* Lead Info */}
          {infoData && Object.keys(infoData).length > 0 && (
            <div className="px-4 py-4 space-y-4">
            {/* <div className="px-4  p-4"> */}
              {/* <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {infoData?.first_name + " " + infoData?.last_name}
                  {infoData?.user?.length ? (
                    <span className="ml-2 text-sm text-indigo-600 font-medium">
                      (Assigned To {infoData?.user[0].username})
                    </span>
                  ) : null}
                </h3>
              </div> */}

              {/* Table Grid */}
              {/* <div className="overflow-x-auto border rounded-md border"> */}
      {/* <div className="overflow-x-auto py-3 px-4 from-blue-600 via-indigo-600 to-purple-600 border rounded-md border rounded-t-lg flex justify-between items-center sticky top-0 z-10 shadow-md"> */}

                <table className=" min-w-full bg-white text-sm text-gray-700 ">

                  <tbody>
                    {[
                      
                      ["Name", infoData?.first_name],

                      ["Email", infoData?.email],
                      ["Phone No", infoData?.phone_number],
                      ["Alternate Phone No", infoData?.alternate_phone_number],
                      [
                        "DOB",
                        infoData?.dob
                          ? formatDate(new Date(infoData?.dob))
                          : "",
                      ],
                      ["Description", infoData?.description],
                      ["Address", infoData?.address],
                      ["City", infoData?.city],
                      ["State", infoData?.state],
                      ["Province", infoData?.province],
                      ["Postal Code", infoData?.postal_code],
                      ["Country", infoData?.country?.[0]?.country || ""],
                    ].map(([label, value], index) => (
                      <tr
                        key={index}
                        className={`border-b border-gray-200 rounded-lg py-1 px-1  bg-white py-1 px-1 flex justify-between items-center sticky top-0 z-10 shadow-[0_2px_2px_-2px_rgba(0,0,0,0.2)]  ${
                          index % 2 === 0 ? "bg-white" : "bg-white"   //form background color
                        }`}
                      >
                        <td className="px-4 py-2 font-medium text-gray-500 w-1/3">   
                          {label}
                        </td>
                        <td className="px-4 py-2 text-black">          
                          {value || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  </table>
                {/* </div> */}
                 </div>
            // </div>
          )}

          {/* Call Notes */}
          <div className="px-4 pb-4">
            {cdrsNotesData?.length > 0 &&
              cdrsNotesData.map((value: any, index: number) => (
                <div
                  key={index}
                  className="border rounded-md p-4 mb-3 bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <Icon
                        name={
                          value?.cdrs_info?.direction === "missed"
                            ? "call_missed"
                            : value?.cdrs_info?.direction === "outbound"
                            ? "call_outbound"
                            : "call_inbond"
                        }
                        width={18}
                        height={18}
                      />
                      <span>{getInfoDay(value?.cdrs_info?.callstart)}</span>
                      <span>
                        {format(
                          new Date(value?.cdrs_info?.callstart),
                          "h:mm a"
                        )}
                      </span>
                      <span className="text-indigo-600 font-semibold">
                        {value?.cdrs_info?.billsecond
                          ? getDuration(value?.cdrs_info?.billsecond)
                          : ""}
                      </span>
                    </div>
                    <div
                      className="cursor-pointer hover:text-indigo-500 transition-colors"
                      onClick={() =>
                        setNoteData(value?.cdrs_info?.custom_callid)
                      }
                    >
                      <Icon name="AddNote" width={18} height={18} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    {value?.notes_info?.length > 0 &&
                      value?.notes_info.map((val: any, i: number) => (
                        <div key={i} className="bg-white p-3 rounded border">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2 max-w-[45%] w-full text-sm font-medium">
                              <Icon
                                name="DocumentIcon"
                                width={18}
                                height={18}
                              />
                              {val?.user?.length
                                ? val?.user[0]?.username
                                : infoData?.tenant?.[0]?.tenant_name || ""}
                            </div>
                            <div className="flex gap-2 text-xs text-gray-500">
                              <span>{getDay(val?.createdAt)}</span>
                              <span>
                                {format(new Date(val?.createdAt), "dd/MM/yyyy")}
                              </span>
                              <span>
                                {format(new Date(val?.createdAt), "h:mm a")}
                              </span>
                            </div>
                          </div>
                          <div className="text-sm text-gray-700 break-words pl-6">
                            {val.comment}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LeadInformation;
