import React, { useLayoutEffect, useState } from "react";

// PROJECT IMPORTS
import {
  sipOptionsGet,
  useSipOptions,
} from "@/redux/slice/tenant-admin/sipDevicesSlice";
import {
  ivrOptionsGet,
  useIvrOptions,
} from "@/redux/slice/tenant-admin/ivrSlice";
import {
  timeConditionOptionsGet,
  useTimeConditionOptions,
} from "@/redux/slice/tenant-admin/timeConditionSlice";
import {
  conferenceOptionsGet,
  useConferenceOptions,
} from "@/redux/slice/tenant-admin/conferenceSlice";
import {
  ringOptionsGet,
  useRingOptions,
} from "@/redux/slice/tenant-admin/ringSlice";
import {
  callQueueOptionsGet,
  useCallQueueOptions,
} from "@/redux/slice/tenant-admin/callQueueSlice";
import {
  externalUserOptionsGet,
  useExternalUserOptions,
} from "@/redux/slice/tenant-admin/userSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Button, Input, Select } from "@/components/forms";
import { Icon } from "@/components/ui-components";

// OPTIONS IMPORT
import { digitsOptions, routingTypeOptions2 } from "@/config/options";
import { Danger } from "@/redux/services/toasterServices";

// TYPES
interface AddAdvanceListProps {
  advanceData: any;
  setAdvanceData: React.Dispatch<React.SetStateAction<any>>;
  promptPath: string;
}

// DATA
const initialValues = {
  digits: "0",
  routing_type: "1",
  routing_options: "",
};
/* ============================== SET PARAMETERS TABLE ============================== */

const AddAdvanceList = (props: AddAdvanceListProps) => {
  const { advanceData, setAdvanceData, promptPath } = props;
  const dispatch = useAppDispatch();
  const sipOptions: any = useSipOptions();
  const ivrOptions: any = useIvrOptions();
  const timeConditionOptions: any = useTimeConditionOptions();
  const callQueueOptions: any = useCallQueueOptions();
  const ringOptions: any = useRingOptions();
  const conferenceOptions: any = useConferenceOptions();
  const externalUserOptions: any = useExternalUserOptions();

  const [digitOption, setDigitOption] = useState<any[]>(digitsOptions);

  useLayoutEffect(() => {
    onGetIvrOptions();
    onGetSipOptions();
    onGetTimeConditionOptions();
    onGetCallQueueOptions();
    onGetRingGroupOptions();
    onGetConferenceOptions();
    onGetExternalUserOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetching SIP Devices Options
  const onGetSipOptions = async () => {
    try {
      await dispatch(sipOptionsGet()).unwrap();
    } catch (err) {
      console.error("Get SIP Options Err =-=>", err);
    }
  };

  // Fetching IVR Options
  const onGetIvrOptions = async () => {
    try {
      await dispatch(ivrOptionsGet()).unwrap();
    } catch (err) {
      console.error("Get IVR Options Err =-=>", err);
    }
  };

  // Fetching Time Condition Options
  const onGetTimeConditionOptions = async () => {
    try {
      await dispatch(timeConditionOptionsGet()).unwrap();
    } catch (err) {
      console.error("Get Time Condition Options Err =-=>", err);
    }
  };

  // Fetching Call Queue Options
  const onGetCallQueueOptions = async () => {
    try {
      await dispatch(callQueueOptionsGet()).unwrap();
    } catch (err) {
      console.error("Get Call Queue Options Err =-=>", err);
    }
  };

  // Fetching Ring Group Options
  const onGetRingGroupOptions = async () => {
    try {
      await dispatch(ringOptionsGet()).unwrap();
    } catch (err) {
      console.error("Get Ring Group Options Err =-=>", err);
    }
  };

  // Fetching Conference Options
  const onGetConferenceOptions = async () => {
    try {
      await dispatch(conferenceOptionsGet()).unwrap();
    } catch (err) {
      console.error("Get Conference Options Err =-=>", err);
    }
  };

  // Fetching External User Options
  const onGetExternalUserOptions = async () => {
    try {
      await dispatch(externalUserOptionsGet()).unwrap();
    } catch (err) {
      console.error("Get External User Options Err =-=>", err);
    }
  };

  // Set Options in Fail-Over Routing Options
  const getOptions = (val: any) => {
    switch (val?.routing_type) {
      case "1":
        return sipOptions;
      case "2":
        return ivrOptions;
      case "3":
        return timeConditionOptions;
      case "4":
        return conferenceOptions;
      case "5":
        return callQueueOptions;
      case "6":
        return ringOptions;
      case "7":
        return sipOptions;
      case "9":
        return externalUserOptions;
    }
  };

  // Trigger When - Input or Select Value Change
  const handelChange = (key: string, val: any, idx: number) => {
    if (key === "digits") {
      let option = digitOption.map((x: any) => {
        return {
          ...x,
          isdisabled: x.value === val ? true : false,
        };
      });
      setDigitOption(option);
    }
    const newData = [...advanceData];
    newData[idx] = {
      ...newData[idx],
      [key]: val,
      routing_options: key === "routing_type" ? "" : val,
    };
    setAdvanceData(newData);
  };

  // Add New Row to Advance List
  const onAddMore = () => {
    let addData: boolean = true;
    advanceData?.length &&
      advanceData.map((val: any) => {
        if (val.routing_options === "" || val.digits === "") {
          addData = false;
          Danger("Please fill all data");
        }
      });

    if (addData) {
      setAdvanceData([...advanceData, initialValues]);
    }
  };

  // Delete Advance List Row
  const onDelete = (idx: number) => {
    const newData = [...advanceData];
    newData.splice(idx, 1);
    setAdvanceData(newData);
  };

  // get create name
  const getCreateName = (type: string) => {
    const data = routingTypeOptions2?.find((val: any) => val?.value === type);
    return data?.label || "";
  };

  // get create name
  const getCreateUrl = (type: string) => {
    const data = routingTypeOptions2?.find((val: any) => val?.value === type);
    return data?.url
      ? data?.url !== "ivr"
        ? `/${promptPath}/${data?.url}/create`
        : ""
      : "";
  };

  return (
    <>
      <div className="border-t border-dark-700">
        <div className="pt-7 pb-4">
          <span className="text-lg font-bold">Advance</span>
        </div>
        <div className="relative rounded-md overflow-x-auto mb-20">
          <table className="w-full text-left rounded-md">
            <thead className="text-xs text-white font-bold bg-secondary border border-secondary">
              <tr>
                <th className="px-6 py-2.5"></th>
                <th className="px-6 py-2.5">Digit</th>
                <th className="px-6 py-2.5">Routing type</th>
                <th className="px-6 py-2.5">Routing options</th>
                <th className="px-6 py-2.5">Action</th>
              </tr>
            </thead>
            <tbody>
              {advanceData?.map((val: any, index: number) => (
                <React.Fragment key={index}>
                  <tr className="bg-dark-950 border">
                    <td className="px-6 py-2.5 font-normal text-heading text-xs whitespace-nowrap">
                      <span>When Caller Presses</span>
                    </td>
                    <td className="px-6 py-2.5 font-normal text-txt-primary whitespace-nowrap">
                      <Select
                        isOptionDisabled={(option: any) => option.isdisabled}
                        name="digits"
                        isShowLabel={false}
                        placeholder="Select digit"
                        removable
                        options={digitOption}
                        value={val.digits}
                        onChange={(e: any) => {
                          handelChange("digits", e.target.value, index);
                        }}
                      />
                    </td>
                    <td className="px-6 py-2.5 font-normal text-txt-primary whitespace-nowrap">
                      <Select
                        name="routing_type"
                        isShowLabel={false}
                        options={routingTypeOptions2}
                        value={val.routing_type}
                        onChange={(e: any) => {
                          handelChange("routing_type", e.target.value, index);
                        }}
                      />
                    </td>
                    <td className="px-6 py-2.5 font-normal text-txt-primary whitespace-nowrap">
                      {val.routing_type === "8" ? (
                        <Input
                          name="routing_options"
                          // type="number"
                          isShowLabel={false}
                          placeholder="Enter Routing Options"
                          value={val.routing_options}
                          onChange={(e: any) => {
                            handelChange(
                              "routing_options",
                              e.target.value,
                              index
                            );
                          }}
                        />
                      ) : (
                        <Select
                          name="routing_options"
                          isShowLabel={false}
                          options={getOptions(val) || []}
                          removable
                          isAdd
                          createName={
                            "Create " + getCreateName(val.routing_type)
                          }
                          createPath={getCreateUrl(val.routing_type)}
                          value={val.routing_options}
                          onChange={(e: any) => {
                            handelChange(
                              "routing_options",
                              e.target.value,
                              index
                            );
                          }}
                        />
                      )}
                    </td>
                    <td className="px-6 py-2.5">
                      <Icon
                        tooltip="Delete"
                        name="DeleteRed"
                        width={20}
                        height={20}
                        alt="Delete"
                        onClick={() => {
                          onDelete(index);
                        }}
                      />
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
          <Button
            className="px-2 py-2 mt-5"
            text="Add More"
            icon="Plus"
            style="primary-outline"
            onClick={onAddMore}
          />
        </div>
      </div>
    </>
  );
};

export default AddAdvanceList;
