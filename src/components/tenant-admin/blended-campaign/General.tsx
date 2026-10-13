"use client";
import { useEffect, useLayoutEffect, useState, useRef } from "react";

// PROJECT IMPORT
import { useBlended } from "@/contexts/hooks/useBlended";
import { CheckBox, Input, InputNumber, Select, Switch, Textarea } from "@/components/forms";
import { Icon, Loader } from "@/components/ui-components";
import {
  outgoingOptionsGet,
  useOutgoingOptions,
} from "@/redux/slice/master-admin/outgoingSlice";
import {
  callIdOptions,
  callerTimeoutOptions,
  dialMethodOptions,
  percentageOptions,
  priorityOptions,
  timeoutOptions,
  callerIdOptions,
  cpsOptions,
} from "@/config/options";
import {
  leadGroupOptionsGet,
  useLeadGroupOptions,
} from "@/redux/slice/tenant-admin/leadGroupSlice";
import {
  callerIdGroupOptionsGet,
  useCallerIdGroupOptions,
} from "@/redux/slice/tenant-admin/callerIdGroupSlice";
import {
  emailConfigsGet,
  useEmailConfigs,
} from "@/redux/slice/tenant-admin/emailSlice";
import {
  apiConfigsGet,
  useApiConfigs,
} from "@/redux/slice/tenant-admin/apiConfigurationSlice";
import {
  messageConfigsGet,
  useMessageConfigs,
} from "@/redux/slice/tenant-admin/messageConfigurationSlice";


import { useParams, usePathname } from "next/navigation";
import { blendedSingleGet } from "@/redux/slice/tenant-admin/blendedSlice";
import { useAppDispatch } from "@/redux/hooks";
import {
  promptsOptionsGet,
  usePromptsOptions,
} from "@/redux/slice/tenant-admin/promptsSlice";
import {
  allowedIvrOptionsGet,
  useAllowedIvrOptions,
} from "@/redux/slice/tenant-admin/ivrSlice";
import {
  allowedCallQueueOptionsGet,
  callCenterCallQueueOptionsGet,
  useAllowedCallQueueOptions,
  useCallQueueOptions,
} from "@/redux/slice/tenant-admin/callQueueSlice";
import {
  allowedRingOptionsGet,
  callCenterRingOptionsGet,
  useAllowedRingOptions,
  useCallCenterRingOptions,
} from "@/redux/slice/tenant-admin/ringSlice";
import {
  webFormOptionsGet,
  useWebFormOptions
} from "@/redux/slice/tenant-admin/webFormSlice";
import {
  msgQueueOptionsGet,
  useMsgQueueOptions
} from "@/redux/slice/tenant-admin/messagingQueueSlice";
import {
  didOptionsGet,
  useDidOptions,
  useCidDidOptions,
} from "@/redux/slice/tenant-admin/didSlice";
import {
  tenantDispositionOptionsGet,
  useTenantDispositionOptions,
} from "@/redux/slice/tenant-admin/tenantDispositionSlice";
import DispositionTree from "../outbound-campaign/DispositionTree";
const defaultAgentScriptText = `Hello <Customer Name>! 
Good day! My name is <Agent Name>, and I am calling you on behalf of our support team. 
Looking at your file, I just want to quickly verify some of your basic information we have on record:
- Full Name: <first_name> <last_name>
- Primary Phone Number: <phone_number>
- Email Address: <email>
- Location: <city>, <state>, <zip_code>

Could you confirm if these details are still accurate? 
Thank you, <first_name>. Feel free to reach back out to us at any time.

Have a wonderful day!`;

const General = () => {
  const outgoingOptions = useOutgoingOptions();
  const leadGroupOptions = useLeadGroupOptions();
  const callerIdGroupOptions = useCallerIdGroupOptions();
  const promptsOptions = usePromptsOptions();
  const allowedRingGroupOptions = useAllowedRingOptions();
  const allowedCallQueueOptions = useAllowedCallQueueOptions();
  const allowedIvrOptions = useAllowedIvrOptions();
  const didOptions = useDidOptions();
  const cidDidOptions = useCidDidOptions();
  const dispositionOptions = useTenantDispositionOptions();
  const callQueueOptions = useCallQueueOptions();
  const ringGroupCallCenterOptions = useCallCenterRingOptions();
  const webFormOptions = useWebFormOptions();
  const msgQueueOptions = useMsgQueueOptions();
   const emailConfigs = useEmailConfigs();
  const apiConfigs = useApiConfigs();
  const messageConfigs = useMessageConfigs();

  const emailTypeOptions = [
    { label: "Select Type", value: "none" },
    { label: "Email Config", value: "email" },
    { label: "API Config", value: "api" },
  ];

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOptionalInfo, setIsOptionalInfo] = useState<boolean>(true);

  const {
    values,
    touched,
    errors,
    setValues,
    setFieldValue,
    handleBlur,
    handleChange,
  } = useBlended();
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const pathname = usePathname();
  let isPathname = pathname?.split("-")?.[0] === "/manager";


  const [showWrapUpModal, setShowWrapUpModal] = useState<boolean>(false);
  const [dispoName, setDispoName] = useState<string>();
  const modalRef: any = useRef(null);



  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target))
        setShowWrapUpModal(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);




  const findDispositionLabel = (uuid: string, options: any[]): string | null => {
    for (const opt of options) {
      if (opt.value === uuid || opt.disposition_uuid === uuid) return opt.label || opt.name;
      if (opt.children) {
        const found = findDispositionLabel(uuid, opt.children);
        if (found) return found;
      }
    }
    return null;
  };

  useLayoutEffect(() => {
    if (values.wrap_up_disposition && dispositionOptions.length) {
      const label = findDispositionLabel(values.wrap_up_disposition, dispositionOptions);
      if (label) setDispoName(label);
    }
  }, [values.wrap_up_disposition, dispositionOptions]);




  useLayoutEffect(() => {
    if (!id) return;
    onGetSingleBlended();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    onGetIvrOptions();
    onGetCallQueueOptions();
    onGetAllowedCallQueueOptions();
    onGetRingGroupOptions();
    onGetCallCenterRingOptions();
    onGetDidOptions();
    onGetTennatDispositionOptions();
    onGetCallerIdGroupOptions();
    onGetPromptsOptions();
    onGetOutgoingOptions();
    onGetLeadGroupOptions();
    onGetWebFormOptions();
    onGetMessagingQueueOptions();
    onGetEmailConfigs();
    onGetApiConfigs();
    onGetMessageConfigs();


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
   // Fetching Message Config Options
  const onGetMessageConfigs = async () => {
    try {
      await dispatch(messageConfigsGet({ limit: 1000 }));
    } catch (err) {
      console.error("Get Message Configs Err =-=>", err);
    }
  };
    const onGetEmailConfigs = async () => {
    try {
      await dispatch(emailConfigsGet({ limit: 1000 }));
    } catch (err) {
      console.error("Get Email Configs Err =-=>", err);
    }
  };

  // Fetching API Config Options
  const onGetApiConfigs = async () => {
    try {
      await dispatch(apiConfigsGet({ limit: 1000 }));
    } catch (err) {
      console.error("Get API Configs Err =-=>", err);
    }
  };

  // Fetching Call Queue Options
  const onGetCallQueueOptions = async () => {
    try {
      await dispatch(callCenterCallQueueOptionsGet()).unwrap();
    } catch (err) {
      console.error("Get Call Queue Options Err =-=>", err);
    }
  };

  // Fetching Ring Group Options
  const onGetCallCenterRingOptions = async () => {
    try {
      await dispatch(callCenterRingOptionsGet()).unwrap();
    } catch (err) {
      console.error("Get Ring Group Options Err =-=>", err);
    }
  };

  // Fetching IVR Options
  const onGetIvrOptions = async () => {
    try {
      await dispatch(allowedIvrOptionsGet()).unwrap();
    } catch (err) {
      console.error("Get IVR Options Err =-=>", err);
    }
  };

  // Fetching WebForm Options
  const onGetWebFormOptions = async () => {
    try {
      await dispatch(webFormOptionsGet()).unwrap();
    } catch (err) {
      console.error("Get WebForm Options Err =-=>", err);
    }
  };

  // Fetching Messaging Queue Options
  const onGetMessagingQueueOptions = async () => {
    try {
      await dispatch(msgQueueOptionsGet()).unwrap();
    } catch (err) {
      console.error("Get Messaging Queue Options Err =-=>", err);
    }
  };


  // Fetching outgoing-Options Options
  const onGetOutgoingOptions = async () => {
    try {
      await dispatch(outgoingOptionsGet());
    } catch (err) {
      console.error("Get DID Options Err =-=>", err);
    }
  };

  // Fetching lead-group-Options Options
  const onGetLeadGroupOptions = async () => {
    try {
      await dispatch(leadGroupOptionsGet(undefined));
    } catch (err) {
      console.error("Get DID Options Err =-=>", err);
    }
  };

  // Fetching Call Queue Options
  const onGetAllowedCallQueueOptions = async () => {
    try {
      await dispatch(allowedCallQueueOptionsGet()).unwrap();
    } catch (err) {
      console.error("Get Call Queue Options Err =-=>", err);
    }
  };

  // Fetching Ring Group Options
  const onGetRingGroupOptions = async () => {
    try {
      await dispatch(allowedRingOptionsGet()).unwrap();
    } catch (err) {
      console.error("Get Ring Group Options Err =-=>", err);
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

  // Get Caller Id Value Label
  const getLabel = () => {
    const data = callIdOptions?.find(
      (val: any) => val?.value === values?.call_id_type
    );
    return data?.title || "";
  };

  // Fetching DID Options
  const onGetDidOptions = async () => {
    try {
      await dispatch(didOptionsGet());
    } catch (err) {
      console.error("Get DID Options Err =-=>", err);
    }
  };

  // Fetching Caller Id Group Options
  const onGetCallerIdGroupOptions = async () => {
    try {
      await dispatch(callerIdGroupOptionsGet());
    } catch (err) {
      console.error("Get Caller Id Options Err =-=>", err);
    }
  };

  // Fetching prompt Options
  const onGetPromptsOptions = async () => {
    try {
      await dispatch(promptsOptionsGet());
    } catch (err) {
      console.error("Get prompt Options Err =-=>", err);
    }
  };

  // Fetching Single Blended Data
  const onGetSingleBlended = async () => {
    setIsLoading(true);
    try {
      const res: any = await dispatch(blendedSingleGet(id as string)).unwrap();
      if (res?.statusCode === 200) {
        setValues({
          ...values,
          name: res?.data?.name,
          dial_method: res?.data?.dial_method,
          lead_group_uuid: res?.data?.lead_group_uuid,
          outgoing_rule_uuid: res?.data?.outgoing_rule_uuid,
          description: res?.data?.description,
          status: res?.data?.status,
          lead_type: res?.data?.lead_type,
          manual_outgoing_rule_uuid: res?.data?.manual_outgoing_rule_uuid,
          threeway_outgoing_rule_uuid: res?.data?.threeway_outgoing_rule_uuid,
          auto_answer: res?.data?.auto_answer || "1", // new field
          agent_script: res?.data?.agent_script || "1",
          agent_script_text: res?.data?.agent_script_text || "",
          call_id_type: res?.data?.call_id_type || "0",
          call_id_value: res?.data?.call_id_value,
          concurrent_call: res?.data?.concurrent_call || "",
          timeout: res?.data?.timeout,
          agent_timeout: res?.data?.timeout,
          max_dial_level: res?.data?.max_dial_level || "1",
          greeting_uuid: res?.data?.greeting_uuid,
          recording: res?.data?.recording || "0",
          number_masking: res?.data?.number_masking || "1",
          max_retries: res?.data?.max_retries || "3",
          retries_time: res?.data?.retries_time || "10",
          caller_id_time: res?.data?.caller_id_time || "",
          three_way_caller_id: res?.data?.three_way_caller_id || "0",
          custom_caller_id: res?.data?.custom_caller_id || "",
          call_queue_uuid: res?.data?.call_queue_uuid || [],
          ring_group_uuid: res?.data?.ring_group_uuid || [],
          allow_ring_group_transfer: res?.data?.allow_ring_group_transfer || [],
          allow_call_queue_transfer: res?.data?.allow_call_queue_transfer || [],
          allowed_messaging_queue: res?.data?.allowed_messaging_queue || [],
          allow_ivr_transfer: res?.data?.allow_ivr_transfer || [],
          max_retries_disposition: res?.data?.max_retries_disposition || [],
          wrap_up_disposition: res?.data?.wrap_up_disposition,
          wrap_up_time: res?.data?.wrap_up_time,
          webform_uuid: res?.data?.webform_uuid || [],
          target_drop_percentage: res?.data?.target_drop_percentage || "1",
          amd_promptuuid: res?.data?.amd_promptuuid || "1",
          cps: res?.data?.cps?.toString() || "1",
          max_predictive_call_count:
            res?.data?.max_predictive_call_count || "1",
          answering_machine_detection:
            res?.data?.answering_machine_detection || "1",
           email_config_uuid: res?.data?.email_config_uuid || "",
          api_config_uuid: res?.data?.api_config_uuid || "",
          email_type: res?.data?.email_type || "none",
          message_config_uuid: res?.data?.message_config_uuid || "",
          manual_multi_caller_id: res?.data?.manual_multi_caller_id || "1",
          manual_caller_ids: res?.data?.manual_caller_ids || [],
          is_limechat: res?.data?.is_limechat ?? res?.data?.isLimeChat ?? "1",
        });
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      console.error("Get Single Blended Err =-=>", err);
    }
  };
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="pt-5 pb-10 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4 px-4">
            <Input
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
              name="dial_method"
              label=
              {
                <>
                  Dial Method <span className="text-red-500">*</span>
                </>
              }
              icon="DialMethod"
              placeholder="Select Dial Method"
              removable
              options={dialMethodOptions}
              value={values.dial_method}
              touched={touched}
              errors={errors}
              onChange={(e: any) => {
                setValues({
                  ...values,
                  dial_method: e.target.value,
                  concurrent_call:
                    e.target.value === "1" || e.target.value === "3" ? "1" : "",
                  agent_timeout:
                    e.target.value === "1" || e.target.value === "3"
                      ? "30"
                      : "",
                  max_dial_level: e.target.value === "3" ? "1" : "",
                  greeting_uuid: "",
                  target_drop_percentage: e.target.value === "3" ? "1" : "1",
                  max_predictive_call_count: e.target.value === "3" ? "1" : "",
                  answering_machine_detection:
                    e.target.value === "1" || e.target.value === "3"
                      ? "1"
                      : "1",
                  /*amd_promptuuid:
                    e.target.value === "1" || e.target.value === "3"
                      ? "1"
                      : "1",*/
                });
              }}
              onBlur={handleBlur}
              isInfo
            />

            <Select
              name="lead_group_uuid"
              label=
              {
                <>
                  Manual Dialed Lead Group <span className="text-red-500">*</span>
                </>
              }
              icon="GroupLead"
              placeholder="Select Manual Dialed Lead Group"
              isAdd
              createName="Create Lead Group"
              createPath={
                isPathname
                  ? "/manager-blended-campaign/lead-group/create"
                  : "/tenant-blended-campaign/lead-group/create"
              }
              options={leadGroupOptions}
              value={values.lead_group_uuid}
              touched={touched}
              errors={errors}
              onChange={(e: any) => {
                setFieldValue("lead_group_uuid", e.target.value);
              }}
              onBlur={handleBlur}
              isInfo
            />
            <Select
              name="outgoing_rule_uuid"
              label=
              {
                <>
                  Campaign Outgoing Rules <span className="text-red-500">*</span>
                </>
              }
              icon="OutgoingRules"
              placeholder="Select Campaign Outgoing Rules"
              removable
              options={outgoingOptions}
              value={values.outgoing_rule_uuid}
              touched={touched}
              errors={errors}
              onChange={(e: any) => {
                setFieldValue("outgoing_rule_uuid", e.target.value);
              }}
              onBlur={handleBlur}
              isInfo
            />
            <Select
              name="manual_outgoing_rule_uuid"
              label="Manual Outgoing Rules"
              icon="OutgoingRules"
              placeholder="Select Manual Outgoing Rules"
              removable
              options={outgoingOptions}
              value={values.manual_outgoing_rule_uuid}
              touched={touched}
              errors={errors}
              onChange={(e: any) => {
                setFieldValue("manual_outgoing_rule_uuid", e.target.value);
              }}
              onBlur={handleBlur}
              isInfo
            />
            <Select
              name="threeway_outgoing_rule_uuid"
              label="3 Way Outgoing Rules"
              icon="WayCallerID"
              placeholder="Select 3 Way Outgoing Rules"
              removable
              options={outgoingOptions}
              value={values.threeway_outgoing_rule_uuid}
              touched={touched}
              errors={errors}
              onChange={(e: any) => {
                setFieldValue("threeway_outgoing_rule_uuid", e.target.value);
              }}
              onBlur={handleBlur}
              isInfo
            />
            <Input
              name="description"
              label="Description"
              icon="Description"
              placeholder="Enter Description"
              value={values.description}
              touched={touched}
              errors={errors}
              onChange={handleChange}
              onBlur={handleBlur}
              isInfo
            />
            <Switch
              className="pt-[2px]"
              switchButtonClass="py-1.5"
              trueName="Top Down"
              falseName="Random"
              label="Lead Type"
              value={values.lead_type}
              onClick={(value: string) => setFieldValue("lead_type", value)}
            />
            <Switch
              className="pt-[2px]"
              label="Status"
              value={values.status}
              onClick={(value: string) => setFieldValue("status", value)}
            />
              <Select
              name="email_type"
              label="Email Type"
              icon="Settings"
              placeholder="Select Email Type"
              options={emailTypeOptions}
              value={values.email_type}
              touched={touched}
              errors={errors}
              onChange={(e: any) => {
                setValues({
                  ...values,
                  email_type: e.target.value,
                  email_config_uuid: "",
                  api_config_uuid: "",
                });
              }}
              onBlur={handleBlur}
              isInfo
            />
            {values.email_type === "email" && (
              <Select
                name="email_config_uuid"
                label="Email Configuration"
                icon="EmailGray"
                placeholder="Select Email Configuration"
                removable
                options={emailConfigs?.data?.map((val: any) => ({
                  label: val?.name,
                  value: val?.uuid,
                })) || []}
                value={values.email_config_uuid}
                touched={touched}
                errors={errors}
                onChange={(e: any) => {
                  setFieldValue("email_config_uuid", e.target.value);
                }}
                onBlur={handleBlur}
                isInfo
              />
            )}
            {values.email_type === "api" && (
              <Select
                name="api_config_uuid"
                label="API Configuration"
                icon="Settings"
                placeholder="Select API Configuration"
                removable
                options={apiConfigs?.data?.map((val: any) => ({
                  label: val?.name,
                  value: val?.uuid,
                })) || []}
                value={values.api_config_uuid}
                touched={touched}
                errors={errors}
                onChange={(e: any) => {
                  setFieldValue("api_config_uuid", e.target.value);
                }}
                onBlur={handleBlur}
                isInfo
              />
            )}
            <Select
              name="message_config_uuid"
              label="Message Configuration"
              icon="Settings"
              placeholder="Select Message Configuration"
              removable
              options={messageConfigs?.data?.map((val: any) => ({
                label: val?.name,
                value: val?.uuid,
              })) || []}
              value={values.message_config_uuid}
              touched={touched}
              errors={errors}
              onChange={(e: any) => {
                setFieldValue("message_config_uuid", e.target.value);
              }}
              onBlur={handleBlur}
              isInfo
            />
          </div>
          <div className="shadow-box mb-10">
            <div
              className={`${isOptionalInfo ? "text-primary bg-primary-v10" : ""
                } py-4 px-6 rounded-t-md flex justify-between items-center`}
            >
              <span className="text-sm font-bold">Advance Fields</span>
              <Icon
                name={isOptionalInfo ? "MinusCircleGreen" : "PlusCircle"}
                className="cursor-pointer"
                width={20}
                height={20}
                alt={isOptionalInfo ? "IconMinusCircle" : "IconPlusCircle"}
                onClick={() => setIsOptionalInfo(!isOptionalInfo)}
              />
            </div>
            <div
              className={`py-6 px-4 bd-white gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4 ${!isOptionalInfo ? "hidden" : ""
                }`}
            >
              <Select
                name="call_id_type"
                label="Caller ID Type"
                icon="CallerID"
                placeholder="Select Caller ID Type"
                options={callIdOptions}
                value={values.call_id_type}
                touched={touched}
                errors={errors}
                onChange={(e: any) => {
                  setValues({
                    ...values,
                    call_id_type: e.target.value,
                    call_id_value: "",
                  });
                }}
                onBlur={handleBlur}
                isInfo
              />
              {values?.call_id_type === "0" ? (
                <Select
                  name="call_id_value"
                  isAdd
                  createPath={
                    isPathname
                      ? "/manager-blended-campaign/did/create"
                      : "/tenant-blended-campaign/did/create"
                  }
                  icon="CallerID"
                  createName="Create DID"
                  label={getLabel()}
                  placeholder={`Select ${getLabel()}`}
                  removable
                  options={didOptions}
                  value={values.call_id_value}
                  touched={touched}
                  errors={errors}
                  onChange={(e: any) => {
                    setFieldValue("call_id_value", e.target.value);
                  }}
                  onBlur={handleBlur}
                  isInfo
                />
              ) : null}
              {values?.call_id_type === "0" || values?.call_id_type === '4' ? null : (
                <Select
                  name="call_id_value"
                  label={getLabel()}
                  icon="CallerID"
                  placeholder={`Select ${getLabel()}`}
                  removable
                  options={callerIdGroupOptions}
                  value={values.call_id_value}
                  touched={touched}
                  errors={errors}
                  onChange={(e: any) => {
                    setFieldValue("call_id_value", e.target.value);
                  }}
                  onBlur={handleBlur}
                  isInfo
                />
              )}
              {values?.call_id_type === '4' ? null : (
                <Select
                  name="caller_id_time"
                  label="Caller ID Time (mins)"
                  icon="CallerIDTime"
                  placeholder="Select Caller ID Time"
                  options={callerTimeoutOptions}
                  value={values.caller_id_time}
                  touched={touched}
                  errors={errors}
                  onChange={(e: any) => {
                    setFieldValue("caller_id_time", e.target.value);
                  }}
                  onBlur={handleBlur}
                  isInfo
                />
              )}
              <div className="flex flex-col gap-3">
                <CheckBox
                  className="!justify-start"
                  label="Multi Caller IDs for Manual Calls"
                  checked={values.manual_multi_caller_id === "0"}
                  onChange={(checked: boolean) => {
                    setValues({
                      ...values,
                      manual_multi_caller_id: checked ? "0" : "1",
                      manual_caller_ids: checked ? values.manual_caller_ids || [] : [],
                    });
                  }}
                />
                {values.manual_multi_caller_id === "0" && (
                  <Select
                    name="manual_caller_ids"
                    isMulti
                    label="Manual Call Caller IDs"
                    icon="CallerID"
                    placeholder="Select Caller IDs"
                    options={cidDidOptions}
                    value={values.manual_caller_ids}
                    touched={touched}
                    errors={errors}
                    onChange={(e: any) => {
                      setFieldValue("manual_caller_ids", e);
                    }}
                    onBlur={handleBlur}
                    isInfo
                  />
                )}
              </div>
              <Select
                name="call_queue_uuid"
                isMulti
                isAdd
                createPath={
                  isPathname
                    ? "/manager-blended-campaign/call-queue/create"
                    : "/tenant-blended-campaign/call-queue/create"
                }
                icon="AllowedCallQueue"
                createName="Create Call Queue"
                label="Allowed Call Queue"
                placeholder="Select Allowed Call Queue"
                options={callQueueOptions}
                value={values.call_queue_uuid}
                touched={touched}
                errors={errors}
                onChange={(e: any) => {
                  setFieldValue("call_queue_uuid", e);
                }}
                onBlur={handleBlur}
                isInfo
              />
              <Select
                name="ring_group_uuid"
                isMulti
                isAdd
                createPath={
                  isPathname
                    ? "/manager-blended-campaign/ring-group/create"
                    : "/tenant-blended-campaign/ring-group/create"
                }
                icon="CallTransferRingGroup"
                createName="Create Ring Group"
                label="Allowed Ring Group"
                placeholder="Select Allowed Ring Group"
                options={ringGroupCallCenterOptions}
                value={values.ring_group_uuid}
                touched={touched}
                errors={errors}
                onChange={(e: any) => {
                  setFieldValue("ring_group_uuid", e);
                }}
                onBlur={handleBlur}
                isInfo
              />


              <Select
                name="allowed_messaging_queue"
                isMulti
                isObjVal
                isAdd
                createPath={
                  isPathname
                    ? "/manager-messaging-queue/create"
                    : "/tenant-messaging-queue/create"
                }
                icon="AllowedMessaging"
                createName="Create Messaging Queue"
                label="Allowed Messaging Queue"
                placeholder="Select Allowed Messaging Queue"
                options={msgQueueOptions}
                value={values.allowed_messaging_queue}
                touched={touched}
                errors={errors}
                onChange={(e: any) => {
                  setFieldValue("allowed_messaging_queue", e);
                }}
                onBlur={handleBlur}
                isInfo
              />

              <Select
                name="allow_ring_group_transfer"
                isMulti
                isObjVal
                isAdd
                createPath={
                  isPathname
                    ? "/manager-blended-campaign/ring-group/create"
                    : "/tenant-blended-campaign/ring-group/create"
                }
                icon="CallTransferRingGroup"
                createName="Create Ring Group"
                label="Allowed Transfer Ring Group"
                placeholder="Select Allowed Transfer Ring Group"
                options={allowedRingGroupOptions}
                value={values.allow_ring_group_transfer}
                touched={touched}
                errors={errors}
                onChange={(e: any) => {
                  setFieldValue("allow_ring_group_transfer", e);
                }}
                onBlur={handleBlur}
                isInfo
              />
              <Select
                name="allow_call_queue_transfer"
                isMulti
                isObjVal
                isAdd
                createPath={
                  isPathname
                    ? "/manager-blended-campaign/call-queue/create"
                    : "/tenant-blended-campaign/call-queue/create"
                }
                icon="AllowedTranferCallQueue"
                createName="Create Call Queue"
                label="Allowed Transfer Call Queue"
                placeholder="Select Allowed Transfer Call Queue"
                options={allowedCallQueueOptions}
                value={values.allow_call_queue_transfer}
                touched={touched}
                errors={errors}
                onChange={(e: any) => {
                  setFieldValue("allow_call_queue_transfer", e);
                }}
                onBlur={handleBlur}
                isInfo
              />
              <Select
                name="allow_ivr_transfer"
                isMulti
                isObjVal
                isAdd
                createPath={
                  isPathname
                    ? "/manager-blended-campaign/ivr/create"
                    : "/tenant-blended-campaign/ivr/create"
                }
                icon="AllowedTransferIVR"
                createName="Create IVR"
                label="Allowed Transfer IVR"
                placeholder="Select Allowed Transfer IVR"
                options={allowedIvrOptions}
                value={values.allow_ivr_transfer}
                touched={touched}
                errors={errors}
                onChange={(e: any) => {
                  setFieldValue("allow_ivr_transfer", e);
                }}
                onBlur={handleBlur}
                isInfo
              />
              {values?.dial_method === "1" || values?.dial_method === "3" ? (
                <Select
                  name="concurrent_call"
                  label="Dial level"

                  placeholder="Enter Dial level"
                  value={values.concurrent_call}
                  options={priorityOptions}
                  touched={touched}
                  errors={errors}
                  // onChange={handleChange}
                  onChange={(e: any) => {
                    setFieldValue("concurrent_call", e.target.value);
                  }}
                  onBlur={handleBlur}
                  isInfo
                />
              ) : null}
              <Select
                name="timeout"
                label="Customer Timeout"
                icon="CustomerTimeout"
                placeholder="Select Customer Timeout"
                removable
                options={timeoutOptions}
                value={values.timeout}
                touched={touched}
                errors={errors}
                onChange={(e: any) => {
                  setFieldValue("timeout", e.target.value);
                }}
                onBlur={handleBlur}
                isInfo
              />
              {values?.dial_method === "1" || values?.dial_method === "3" ? (
                <Select
                  name="agent_timeout"
                  label="Agent Timeout"
                  icon="AgentTimeout"
                  placeholder="Select Agent Timeout"
                  options={timeoutOptions}
                  value={values.agent_timeout}
                  touched={touched}
                  errors={errors}
                  onChange={(e: any) => {
                    setFieldValue("agent_timeout", e.target.value);
                  }}
                  onBlur={handleBlur}
                  isInfo
                />
              ) : null}

              {values?.dial_method === "3" ? (
                <Select
                  name="max_dial_level"
                  label="Max Predictive Dial level"
                  placeholder="Select Max Predictive Dial level"
                  options={priorityOptions}
                  value={values.max_dial_level}
                  touched={touched}
                  errors={errors}
                  onChange={(e: any) => {
                    setFieldValue("max_dial_level", e.target.value);
                  }}
                  onBlur={handleBlur}
                  isInfo
                />
              ) : null}
              {values?.dial_method === "0" ||
                values?.dial_method === "2" ? null : (
                <Select
                  name="greeting_uuid"
                  label="MOH"
                  icon="MOH"
                  placeholder="Select MOH"
                  removable
                  options={promptsOptions}
                  value={values.greeting_uuid}
                  touched={touched}
                  errors={errors}
                  onChange={(e: any) => {
                    setFieldValue("greeting_uuid", e.target.value);
                  }}
                  onBlur={handleBlur}
                  isInfo
                />
              )}
              {values?.dial_method === "3" ? (
                <>
                  <Select
                    name="target_drop_percentage"
                    label="Target Drop (%)"
                    placeholder="Select Target Drop"
                    removable
                    options={percentageOptions}
                    value={values.target_drop_percentage}
                    touched={touched}
                    errors={errors}
                    onChange={(e: any) => {
                      setFieldValue("target_drop_percentage", e.target.value);
                    }}
                    onBlur={handleBlur}
                    isInfo
                  />
                  <InputNumber
                    min={1}
                    name="max_predictive_call_count"
                    label="Max Predictive Call"
                    placeholder="Enter Max Predictive Call"
                    value={values.max_predictive_call_count}
                    touched={touched}
                    errors={errors}
                    onChange={(value: string) =>
                      setFieldValue("max_predictive_call_count", value)
                    }
                    onBlur={handleBlur}
                    isInfo
                  />
                </>
              ) : null}
              <Input
                name="max_retries"
                label="Max Retries"
                icon="MaxRetries"
                placeholder="Enter Max Retries"
                value={values.max_retries}
                touched={touched}
                errors={errors}
                onChange={handleChange}
                onBlur={handleBlur}
                noSpace
                isInfo
              />
              <Select
                name="max_retries_disposition"
                isMulti
                label="Call Retries Disposition"
                icon="Retries"
                placeholder="Select Call Retries Disposition"
                options={dispositionOptions}
                value={values.max_retries_disposition}
                touched={touched}
                errors={errors}
                onChange={(e: any) => {
                  setFieldValue("max_retries_disposition", e);
                }}
                onBlur={handleBlur}
                isInfo
              />
              <Input
                name="retries_time"
                label="Retries time (Min)"
                icon="Retries"
                placeholder="Enter Retries Time"
                value={values.retries_time}
                touched={touched}
                errors={errors}
                onChange={handleChange}
                onBlur={handleBlur}
                noSpace
                isInfo
              />
              <Switch
                className="pt-[2px]"
                switchButtonClass="py-1.5"
                trueName="Yes"
                falseName="No"
                label="Recording"
                value={values.recording}
                onClick={(value: string) => setFieldValue("recording", value)}
              />
              <Switch
                className="pt-[2px]"
                switchButtonClass="py-1.5"
                trueName="Yes"
                falseName="No"
                label="Number Masking"
                value={values.number_masking}
                onClick={(value: string) =>
                  setFieldValue("number_masking", value)
                }
              />
              <Select
                name="three_way_caller_id"
                label="3 Way Caller ID"
                icon="WayCallerID"
                placeholder="Select 3 Way Caller ID"
                removable
                options={callerIdOptions}
                value={values.three_way_caller_id}
                touched={touched}
                errors={errors}
                onChange={(e: any) => {
                  setFieldValue("three_way_caller_id", e.target.value);
                }}
                onBlur={handleBlur}
                isInfo
              />
              <Select
                name="cps"
                label="CPS"
                //placeholder="Select CPS"
                // removable
                icon="CPS"
                options={cpsOptions}
                value={values.cps}
                touched={touched}
                errors={errors}
                onChange={(e: any) => {
                  setFieldValue("cps", e.target.value);
                }}
                onBlur={handleBlur}
                isInfo
              />
              <Select
                name="webform_uuid"
                isMulti
                isObjVal
                isAdd
                createPath={
                  isPathname
                    ? "/manager-webform/create"
                    : "/tenant-webform/create"
                }
                createName="Create Webform"
                icon="Webform"
                label="Web Form"
                placeholder="Select webform"
                options={webFormOptions}
                value={values.webform_uuid}
                touched={touched}
                errors={errors}
                onChange={(e: any) => {
                  setFieldValue("webform_uuid", e);
                }}
                onBlur={handleBlur}
                isInfo
              />

              {values?.three_way_caller_id === "2" ? (
                <>
                  <Input
                    name="custom_caller_id"
                    label="Custom Caller Id"
                    placeholder="Enter Custom Caller Id"
                    value={values.custom_caller_id}
                    touched={touched}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInfo
                  />
                </>
              ) : null}
              {values?.dial_method === "3" || values?.dial_method === "1" ? (
                <>
                  <Switch
                    className="pt-[2px]"
                    switchButtonClass="py-1.5"
                    label="Answering Machine Detection"
                    value={values.answering_machine_detection}
                    onClick={(value: string) =>
                      setFieldValue("answering_machine_detection", value)
                    }
                  />
                  {values?.answering_machine_detection === "0" ? (
                    <Select
                      name="amd_promptuuid"
                      label="AMD Prompt"
                      placeholder="Select Welcome Prompt"
                      isAdd
                      createName="Create AMD Prompts"
                      createPath={
                        isPathname
                          ? "/manager-ivr/audio-prompts/create"
                          : "/tenant-ivr/audio-prompts/create"
                      }
                      options={promptsOptions}
                      value={values.amd_promptuuid}
                      touched={touched}
                      errors={errors}
                      onChange={(e: any) => {
                        setFieldValue("amd_promptuuid", e.target.value);
                      }}
                      onBlur={handleBlur}
                      isInfo
                    />
                  ) : null}
                </>
              ) : null}
              <Input
                type="number"
                name="wrap_up_time"
                label="Wrap Up Time"
                icon="WrapUpTime"
                placeholder="Enter Wrap Up Time"
                value={values.wrap_up_time}
                touched={touched}
                errors={errors}
                onChange={handleChange}
                onBlur={handleBlur}
                isInfo
              />
              {/* <Select
                name="wrap_up_disposition"
                label="Wrap Up Disposition"
                icon="WrapUpTime"
                placeholder="Select Wrap Up Disposition"
                options={dispositionOptions}
                value={values.wrap_up_disposition}
                touched={touched}
                errors={errors}
                onChange={(e: any) => {
                  setFieldValue("wrap_up_disposition", e.target.value);
                }}
                onBlur={handleBlur}
                isInfo
              /> */}

              <Input
                type="text"
                name="wrap_up_disposition"
                label="Wrap Up Disposition"
                icon="WrapUpTime"
                placeholder="Select Wrap Up Disposition"
                value={dispoName}
                touched={touched}
                errors={errors}
                onClick={() => setShowWrapUpModal(true)}
                onBlur={handleBlur}
                isInfo
              />

              {showWrapUpModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                  <div ref={modalRef} className="bg-white rounded-lg shadow-lg p-6 w-[400px] max-h-[90vh] overflow-y-auto">
                    <h2 className="text-lg font-semibold mb-4">Select Wrap Up Disposition</h2>
                    <DispositionTree
                      items={dispositionOptions}
                      selectedValue={values.wrap_up_disposition}
                      onSelect={(item: any) => {
                        setDispoName(item?.label || item?.name);
                        setFieldValue("wrap_up_disposition", item.value || item.disposition_uuid);
                        setShowWrapUpModal(false);
                      }}
                    />
                  </div>
                </div>
              )}

              {/* new field */}
              <Switch
                className="pt-[2px]"
                switchButtonClass="py-1.5"
                trueName="Yes"
                falseName="No"
                label="Auto Answer"
                value={values.auto_answer}
                onClick={(value: string) =>
                  setFieldValue("auto_answer", value)
                }
              />
              <Switch
                className="pt-[2px]"
                switchButtonClass="py-1.5"
                trueName="Yes"
                falseName="No"
                label="LimeChat"
                value={values.is_limechat ?? "1"}
                onClick={(value: string) => {
                  setFieldValue("is_limechat", value);
                }}
              />
              <Switch
                className="pt-[2px]"
                switchButtonClass="py-1.5"
                trueName="Yes"
                falseName="No"
                label="Agent Script"
                value={values.agent_script}
                onClick={(value: string) => {
                  setFieldValue("agent_script", value);
                  if (value === "0" && (!values.agent_script_text || values.agent_script_text.trim() === "")) {
                     setFieldValue("agent_script_text", defaultAgentScriptText);
                  }
                }}
              />
              {values.agent_script === "0" && (
                <Textarea
                  label="Agent Script Text"
                  name="agent_script_text"
                  value={values.agent_script_text}
                  onChange={handleChange}
                  rows={4}
                  className="col-span-2"
                />
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default General;
