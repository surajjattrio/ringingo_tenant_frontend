import { useEffect, useLayoutEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";

// PROJECT IMPORT
import { Input, InputNumber, Select, Switch } from "@/components/forms";
import AdditionalSettings from "./AdditionalSettings";
import WelcomePrompt from "./WelcomePrompt";
import { useVoiceBroadcast } from "@/contexts/hooks/useVoiceBroadcast";
import { callIdOptions, priorityOptions2, timeOutOptions } from "@/config/options";
import {
  didOptionsGet,
  useDidOptions,
} from "@/redux/slice/tenant-admin/didSlice";
import { useAppDispatch } from "@/redux/hooks";
import { ivrOptionsGet } from "@/redux/slice/tenant-admin/ivrSlice";
import {
  tenantDispositionOptionsGet,
  useTenantDispositionOptions,
} from "@/redux/slice/tenant-admin/tenantDispositionSlice";
import {
  callerIdGroupOptionsGet,
  useCallerIdGroupOptions,
} from "@/redux/slice/tenant-admin/callerIdGroupSlice";
import { DatePicker } from "@/components/pickers";
import { promptsOptionsGet } from "@/redux/slice/tenant-admin/promptsSlice";
import { voiceBroadcastSingleGet } from "@/redux/slice/tenant-admin/voiceBroadcastSlice";
import { Loader } from "@/components/ui-components";
import {
  outgoingOptionsGet,
  useOutgoingOptions,
} from "@/redux/slice/master-admin/outgoingSlice";
import {
  leadGroupOptionsGet,
  useLeadGroupOptions,
} from "@/redux/slice/tenant-admin/leadGroupSlice";

const General = () => {
  const {
    values,
    touched,
    errors,
    handleBlur,
    handleChange,
    setValues,
    setFieldValue,
  } = useVoiceBroadcast();

  const dispatch = useAppDispatch();
  const { id } = useParams();
  const pathname = usePathname();
  let isPathname = pathname?.split("-")?.[0] === "/manager";
  const didOptions = useDidOptions();
  const callerIdGroupOptions = useCallerIdGroupOptions();
  const dispositionOptions = useTenantDispositionOptions();
  const outgoingOptions = useOutgoingOptions();
  const leadGroupOptions = useLeadGroupOptions();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [settingData, setSettingData] = useState(values?.survey_value || []);
  const [welcomePromptData, setWelcomePromptData] = useState(
    values?.welcome_prompt_selected_value || []
  );

  useEffect(() => {
    onGetIvrOptions();
    onGetDidOptions();
    onGetTennatDispositionOptions();
    onGetCallerIdGroupOptions();
    onGetPromptsOptions();
    onGetOutgoingOptions();
    onGetLeadGroupOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetching Lead Group Options
  const onGetLeadGroupOptions = async () => {
    try {
      await dispatch(leadGroupOptionsGet(undefined));
    } catch (err) {
      console.error("Get Lead Group Options Err =-=>", err);
    }
  };

  // Fetching Caller Id Group Options
  const onGetCallerIdGroupOptions = async () => {
    try {
      await dispatch(callerIdGroupOptionsGet());
    } catch (err) {
      console.error("Get DID Options Err =-=>", err);
    }
  };

  // Fetching Outgoing Rules Master Admin Options
  const onGetOutgoingOptions = async () => {
    try {
      await dispatch(outgoingOptionsGet()).unwrap();
    } catch (e: any) {
      console.error("Get Outgoing Rules Data Err --->", e?.message);
    }
  };

  //  Fetching Disposition Options
  const onGetTennatDispositionOptions = () => {
    try {
      dispatch(tenantDispositionOptionsGet());
    } catch (err) {
      console.error("Get Disposition Options Err =-=>", err);
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

  // Fetching DID Options
  const onGetDidOptions = async () => {
    try {
      await dispatch(didOptionsGet());
    } catch (err) {
      console.error("Get DID Options Err =-=>", err);
    }
  };

  // Get Caller Id Value Label
  const getLabel = () => {
    const data = callIdOptions?.find(
      (val: any) => val?.value === values?.caller_id_type
    );
    return data?.title || "";
  };

  // Fetching prompt Options
  const onGetPromptsOptions = async () => {
    try {
      await dispatch(promptsOptionsGet());
    } catch (err) {
      console.error("Get prompt Options Err =-=>", err);
    }
  };

  const onGetSingleVoiceBroadcast = async () => {
    setIsLoading(true);
    try {
      const res: any = await dispatch(voiceBroadcastSingleGet(id as string)).unwrap();
      if (res?.statusCode === 200) {
        setValues({
          ...values,
          name: res?.data?.name || "",
          caller_id_type: res?.data?.caller_id_type || "0",
          caller_id: res?.data?.caller_id || "",
          channel: res?.data?.channel.toString() || "",
          max_retries: res?.data?.max_retries || "3",
          max_retries_disposition_uuid:
            res?.data?.max_retries_disposition_uuid || [],
          lead_group_uuid: Array.isArray(res?.data?.lead_group_uuid)
            ? res?.data?.lead_group_uuid
            : res?.data?.lead_group_uuid
            ? [res?.data?.lead_group_uuid]
            : [],
          outgoing_rule_uuid: res?.data?.outgoing_rule_uuid || "",
          timeout: res?.data?.timeout || "",
          status: res?.data?.status || "0",
          amd: res?.data?.amd || "1",
          recording: res?.data?.recording || "1",
          start_date: res?.data?.start_date
            ? new Date(res?.data?.start_date)
            : "",
          end_date: res?.data?.end_date ? new Date(res?.data?.end_date) : "",
          skip: res?.data?.skip || "true",
          welcome_prompt_uuid: res?.data?.welcome_prompt_uuid || "",
          welcome_prompt_selected_value: res?.data
            ?.welcome_prompt_selected_value?.length
            ? res?.data?.welcome_prompt_selected_value
            : [
              {
                digit: "0",
                value: "",
              },
              {
                digit: "1",
                value: "",
              },
              {
                digit: "2",
                value: "",
              },
            ],
          playfile_time: res?.data?.playfile_time || "",
          exit_prompt_uuid: res?.data?.exit_prompt_uuid || "",
          broadcast_type: res?.data?.broadcast_type || "0",
          ivr_uuid: res?.data?.ivr_uuid || "",
          survey_value: res?.data?.survey_value?.length
            ? res?.data?.survey_value
            : [
              {
                prompt_uuid: "",
                from: "",
                to: "",
              },
            ],
        });
        setSettingData(
          res?.data?.survey_value?.length
            ? res?.data?.survey_value
            : [
              {
                prompt_uuid: "",
                from: "",
                to: "",
              },
            ]
        );
        setWelcomePromptData(
          res?.data?.welcome_prompt_selected_value?.length
            ? res?.data?.welcome_prompt_selected_value
            : [
              {
                digit: "0",
                value: "",
              },
              {
                digit: "1",
                value: "",
              },
              {
                digit: "2",
                value: "",
              },
            ]
        );
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      console.error("Get Single Outbound Err =-=>", err);
    }
  };

  useLayoutEffect(() => {
    if (!id) return;
    onGetSingleVoiceBroadcast();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="pt-5 pb-10 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4 px-4 border-b-2">
            <Input
              type="text"
              name="name"
              label={
                <>
                  Name <span className="text-red-500">*</span>
                </>
              }
              icon="UserOutline"
              placeholder="Enter Name"
              value={values.name}
              touched={touched}
              errors={errors}
              onChange={handleChange}
              onBlur={handleBlur}
              isInfo
            />
            <Select
              name="caller_id_type"
              label="Caller ID Type"
              icon="CallerID"
              placeholder="Select Caller ID Type"
              options={callIdOptions.filter(option => option.value !== "2")}
              value={values.caller_id_type}
              touched={touched}
              errors={errors}
              onChange={(e: any) => {
                setValues({
                  ...values,
                  caller_id_type: e.target.value,
                  caller_id: "",
                });
              }}
              onBlur={handleBlur}
              isInfo
            />
            {values?.caller_id_type === "0" ? (
              <Select
                name="caller_id"
                label={getLabel()}
                icon="CallerID"
                placeholder={`Select ${getLabel()}`}
                removable
                options={didOptions}
                value={values.caller_id}
                touched={touched}
                errors={errors}
                onChange={(e: any) => {
                  setFieldValue("caller_id", e.target.value);
                }}
                onBlur={handleBlur}
                isInfo
              />
            ) : (
              <Select
                name="caller_id"
                label={getLabel()}
                placeholder={`Select ${getLabel()}`}
                isAdd
                createPath={
                  isPathname
                    ? "/manager-voice-broadcast/call-id-group/create"
                    : "/tenant-voice-broadcast/call-id-group/create"
                }
                createName="Create Caller Id Group"
                options={callerIdGroupOptions}
                value={values.caller_id}
                touched={touched}
                errors={errors}
                onChange={(e: any) => {
                  setFieldValue("caller_id", e.target.value);
                }}
                onBlur={handleBlur}
                isInfo
              />
            )}
            <Select
              name="channel"
              label={
                <>
                  Channel <span className="text-red-500">*</span>
                </>
              }
              icon="Channel"
              placeholder="Select Channel"
              removable
              options={priorityOptions2}
              value={values.channel}
              touched={touched}
              errors={errors}
              onChange={(e: any) => {
                setFieldValue("channel", e.target.value);
              }}
              onBlur={handleBlur}
              isInfo
            />
            <InputNumber
              name="max_retries"
              label="Max Retries"
              icon="MaxRetries"
              placeholder="Enter Max Retries"
              value={values.max_retries}
              touched={touched}
              errors={errors}
              onChange={(value: string) => setFieldValue("max_retries", value)}
              onBlur={handleBlur}
              isInfo
            />
            <Select
              name="max_retries_disposition_uuid"
              isMulti
              icon="CallRetriesDisposition"
              label="Call Retries Disposition"
              placeholder="Select Call Retries Disposition"
              options={dispositionOptions}
              value={values.max_retries_disposition_uuid}
              touched={touched}
              errors={errors}
              onChange={(e: any) => {
                setFieldValue("max_retries_disposition_uuid", e);
              }}
              onBlur={handleBlur}
              isInfo
            />
            <Select
              name="outgoing_rule_uuid"
              label="Outgoing Rule"
              icon="OutgoingRules"
              placeholder="Select Outgoing Rule"
              options={outgoingOptions}
              value={values.outgoing_rule_uuid}
              touched={touched}
              errors={errors}
              removable
              onChange={(e: any) => {
                setFieldValue("outgoing_rule_uuid", e.target.value);
              }}
              onBlur={handleBlur}
              isInfo
            />
            <Select
              name="lead_group_uuid"
              label="Lead Group"
              isMulti
              icon="GroupLead"
              placeholder="Select Lead Group"
              isAdd
              createName="Create Lead Group"
              createPath={
                isPathname
                  ? "/manager-voice-broadcast/create-lead-group"
                  : "/tenant-voice-broadcast/create-lead-group"
              }
              options={leadGroupOptions}
              value={values.lead_group_uuid || []}
              touched={touched}
              errors={errors}
              onChange={(e: any) => {
                setFieldValue("lead_group_uuid", e);
              }}
              onBlur={handleBlur}
              isInfo
            />
            <Select
              name="timeout"
              label="Timeout"
              icon="TimeOut"
              placeholder="Select Timeout"
              options={timeOutOptions}
              value={values.timeout}
              touched={touched}
              errors={errors}
              removable
              onChange={(e: any) => {
                setFieldValue("timeout", e.target.value);
              }}
              onBlur={handleBlur}
              isInfo
            />
            <Switch
              className="pt-[2px]"
              switchButtonClass="py-1.5"
              label="Status"
              value={values.status}
              onClick={(value: string) => setFieldValue("status", value)}
            />
            <Switch
              className="pt-[2px]"
              switchButtonClass="py-1.5"
              label="AMD"
              value={values.amd}
              onClick={(value: string) => setFieldValue("amd", value)}
            />
            <Switch
              className="pt-[2px]"
              switchButtonClass="py-1.5"
              label="Recording"
              value={values.recording}
              onClick={(value: string) => setFieldValue("recording", value)}
            />
          </div>
          <div className="pb-5">
            <div className="pt-7 pb-4">
              <span className="text-sm font-bold">Scheduling</span>
            </div>
            <div className="rounded-md bg-dark-950 pt-5 pb-10 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4 px-4">
              <DatePicker
                name="start_date"
                label={
                  <>
                    Start Date & Time <span className="text-red-500">*</span>
                  </>
                }
                placeholder="Enter Start Date"
                dateFormat="yyyy-MM-dd HH:mm:ss"
                value={values.start_date}
                startDate={values.start_date}
                endDate={values.end_date}
                minDate={values.end_date || new Date()}
                onChange={(e: any) => {
                  setValues({
                    ...values,
                    start_date: e,
                    end_date: "",
                  });
                }}
                errors={errors}
                touched={touched}
                showTimeSelect
                selectsStart
                isInfo
              />
              <DatePicker
                name="end_date"
                label={
                  <>
                    End Date & Time <span className="text-red-500">*</span>
                  </>
                }
                placeholder="Enter End Date"
                dateFormat="yyyy-MM-dd HH:mm:ss"
                value={values.end_date}
                startDate={values.start_date}
                endDate={values.end_date}
                minDate={values.start_date}
                onChange={(e: any) => setFieldValue("end_date", e)}
                errors={errors}
                touched={touched}
                showTimeSelect
                selectsEnd
                isInfo
              />
            </div>
          </div>
          <WelcomePrompt
            welcomePromptData={welcomePromptData}
            setWelcomePromptData={setWelcomePromptData}
          />
          <AdditionalSettings
            settingData={settingData}
            setSettingData={setSettingData}
          />
        </>
      )}
    </>
  );
};
export default General;
