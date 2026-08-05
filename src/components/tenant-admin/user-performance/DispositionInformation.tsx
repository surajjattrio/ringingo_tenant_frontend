import { useEffect, useState } from "react";

// PROJECT IMPORTS
import { getSingleUserInfo } from "@/redux/slice/tenant-admin/userPerformanceSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Chip, Icon, Loader } from "@/components/ui-components";
import Cookies from "js-cookie";
import { format } from "date-fns";

// TYPES
interface UserInformationProps {
  isUserInfoID: string;
  setIsUserInfoID: any;
}

const DispositionInformation = (props: UserInformationProps) => {
  const { isUserInfoID = null, setIsUserInfoID } = props;

  const [infoData, setInfoData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isUserInfoID) {
      onGetSingleUserInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUserInfoID]);

  const dispatch = useAppDispatch();

  // GET USER DISPOSITION INFORMATION
  const onGetSingleUserInfo = async () => {
    setIsLoading(true);
    try {
      let values:any = null
      let storageData:any = Cookies.get("searched_filter_UPR");
      if (storageData != null && storageData != undefined) {
        values = JSON.parse(storageData);
      }
      let payload = {
        id: isUserInfoID,
        callstart: values?.startdate ? values?.startdate : format(new Date().setHours(0,0,1), "yyyy-MM-dd HH:mm:ss"),
        callend: values?.enddate ? values?.enddate : format(new Date().setHours(23,59,59), "yyyy-MM-dd HH:mm:ss")
      }
      const res: any = await dispatch(getSingleUserInfo(payload)).unwrap();
      if (res && res?.statusCode === 200) {
        setInfoData(res?.data || []);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (error: any) {
      setIsLoading(false);
      console.log(
        "get single user disposition information err--->",
        error?.message
      );
    }
  };
  /* ============================== DISPOSITION INFORMATION ============================== */

  if (!isUserInfoID) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={() => {
        setIsUserInfoID(null);
        setInfoData(null);
      }}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden relative"
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
                setIsUserInfoID(null);
                setInfoData(null);
              }}
            />
            <span className="3xl:text-sm text-xs text-white font-bold">
              Disposition Information
            </span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="h-[150px] flex items-center justify-center">
              <Loader />
            </div>
          ) : (
            <div>
              {infoData && infoData.length
                ? infoData.map((val: any, index: number) => {
                  return (
                    <div className="pb-4" key={index}>
                      <div className="grid grid-cols-5 gap-x-1">
                        <div className="col-span-2">
                          <span className="3xl:text-xs text-[11px] text-heading font-semibold">
                            Name:
                          </span>
                        </div>
                        <div className="col-span-3">
                          <span className="3xl:text-xs text-[11px] text-txt-primary">
                            {val?.disposition_name || "-"}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="3xl:text-xs text-[11px] text-heading font-semibold">
                            Count:
                          </span>
                        </div>
                        <div className="col-span-3">
                          <span className="3xl:text-xs text-[11px] text-txt-primary">
                            {val?.count}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
                : <div className="flex h-[150px] justify-center items-center"><Chip title="No Record Found"/></div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DispositionInformation;
