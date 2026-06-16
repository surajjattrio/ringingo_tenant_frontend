"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useParams, usePathname } from "next/navigation";

// PROJECT IMPORT
import { useInbound } from "@/contexts/hooks/useInbound";
import { Input, Select, Switch, Textarea } from "@/components/forms";
import { Icon, Loader } from "@/components/ui-components";
import {
  webFormOptionsGet,
  useWebFormOptions
} from "@/redux/slice/tenant-admin/webFormSlice";
import {
  outgoingOptionsGet,
  useOutgoingOptions,
} from "@/redux/slice/master-admin/outgoingSlice";
import { inboundSingleGet } from "@/redux/slice/tenant-admin/inboundSlice";
import { useAppDispatch } from "@/redux/hooks";
import {
  allowedCallQueueOptionsGet,
  callCenterCallQueueOptionsGet,
  callQueueOptionsGet,
  useAllowedCallQueueOptions,
  useCallQueueOptions,
} from "@/redux/slice/tenant-admin/callQueueSlice";
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
import {
  allowedIvrOptionsGet,
  useAllowedIvrOptions,
} from "@/redux/slice/tenant-admin/ivrSlice";
import {
  allowedRingOptionsGet,
  useAllowedRingOptions,
} from "@/redux/slice/tenant-admin/ringSlice";

import { callerIdOptions } from "@/config/options";
import { tenantDispositionOptionsGet, useTenantDispositionOptions } from "@/redux/slice/tenant-admin/tenantDispositionSlice";
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
  const {
    values,
    touched,
    errors,
    setValues,
    setFieldValue,
    handleBlur,
    handleChange,
  } = useInbound();

  const dispatch = useAppDispatch();
  const { id } = useParams();
  const pathname = usePathname();
  let isPathname = pathname?.split("-")?.[0] === "/manager";

  const [showWrapUpModal, setShowWrapUpModal] = useState<boolean>(false);
  const [dispoName, setDispoName] = useState<string>();
  const modalRef: any = useRef(null);

  const outgoingOptions = useOutgoingOptions();
  const callQueueOptions = useCallQueueOptions();
  const allowedRingGroupOptions = useAllowedRingOptions();
  const allowedCallQueueOptions = useAllowedCallQueueOptions();
  const allowedIvrOptions = useAllowedIvrOptions();
  const webFormOptions = useWebFormOptions();
  const dispositionOptions = useTenantDispositionOptions();
  const emailConfigs = useEmailConfigs();
  const apiConfigs = useApiConfigs();
  const messageConfigs = useMessageConfigs();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOptionalInfo, setIsOptionalInfo] = useState<boolean>(true);

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
    onGetSingleInbound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    onGetOutgoingOptions();
    onGetIvrOptions();
    onGetAllowedCallQueueOptions();
    onGetCallQueueOptions();
    onGetRingGroupOptions();
    onGetWebFormOptions();
    onGetTennatDispositionOptions();
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
   // Fetching Email Config Options
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
  // Fetching outgoing-Options Options
  const onGetOutgoingOptions = async () => {
    try {
      await dispatch(outgoingOptionsGet());
    } catch (err) {
      console.error("Get DID Options Err =-=>", err);
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

  // Fetching transfer Call Queue Options
  const onGetAllowedCallQueueOptions = async () => {
    try {
      await dispatch(allowedCallQueueOptionsGet()).unwrap();
    } catch (err) {
      console.error("Get Call Queue Options Err =-=>", err);
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

  // Fetching WebForm Options
  const onGetWebFormOptions = async () => {
    try {
      await dispatch(webFormOptionsGet()).unwrap();
    } catch (err) {
      console.error("Get WebForm Options Err =-=>", err);
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

  // Fetching Ring Group Options
  const onGetRingGroupOptions = async () => {
    try {
      await dispatch(allowedRingOptionsGet()).unwrap();
    } catch (err) {
      console.error("Get Ring Group Options Err =-=>", err);
    }
  };

  // Fetching Single Inbound Data
  const onGetSingleInbound = async () => {
    setIsLoading(true);
    try {
      const res: any = await dispatch(inboundSingleGet(id as string)).unwrap();
      if (res?.statusCode === 200) {
        setValues({
          ...values,
          name: res?.data?.name,
          outgoing_rule_uuid: res?.data?.outgoing_rule_uuid,
          description: res?.data?.description,
          status: res?.data?.status,

          call_queue_uuid: res?.data?.call_queue_uuid || [],
          recording: res?.data?.recording || "0",
          number_masking: res?.data?.number_masking || "1",
          allow_ring_group_transfer: res?.data?.allow_ring_group_transfer || [],
          allow_call_queue_transfer: res?.data?.allow_call_queue_transfer || [],
          allow_ivr_transfer: res?.data?.allow_ivr_transfer || [],
          three_way_caller_id: res?.data?.three_way_caller_id || "0",
          custom_caller_id: res?.data?.custom_caller_id || "",
          webform_uuid: res?.data?.webform_uuid || [],
          wrap_up_disposition: res?.data?.wrap_up_disposition,
          wrap_up_time: res?.data?.wrap_up_time,
          auto_answer: res?.data?.auto_answer || "0",
          agent_script: res?.data?.agent_script || "1",
          agent_script_text: res?.data?.agent_script_text || "",
          email_config_uuid: res?.data?.email_config_uuid || "",
          api_config_uuid: res?.data?.api_config_uuid || "",
          email_type: res?.data?.email_type || "none",
          message_config_uuid: res?.data?.message_config_uuid || "",
        });
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      console.error("Get Single Inbound Err =-=>", err);
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
              name="outgoing_rule_uuid"
              label={
                <>
                  Outgoing Rules <span className="text-red-500">*</span>
                </>
              }
              icon="OutgoingRules"
              placeholder="Select Outgoing Rules"
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
                name="call_queue_uuid"
                isMulti
                isAdd
                createPath={
                  isPathname
                    ? "/manager-inbound-campaign/call-queue/create"
                    : "/tenant-inbound-campaign/call-queue/create"
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
                name="allow_ring_group_transfer"
                isMulti
                isObjVal
                isAdd
                createPath={
                  isPathname
                    ? "/manager-inbound-campaign/ring-group/create"
                    : "/tenant-inbound-campaign/ring-group/create"
                }
                createName="Create Ring Group"
                icon="CallTransferRingGroup"
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
                    ? "/manager-inbound-campaign/call-queue/create"
                    : "/tenant-inbound-campaign/call-queue/create"
                }
                createName="Create Call Queue"
                icon="AllowedTranferCallQueue"
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
                    ? "/manager-inbound-campaign/ivr/create"
                    : "/tenant-inbound-campaign/ivr/create"
                }
                createName="Create IVR"
                icon="AllowedTransferIVR"
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
              <Switch
                className="pt-[2px]"
                switchButtonClass="py-1.5"
                label="Recording"
                value={values.recording}
                onClick={(value: string) => setFieldValue("recording", value)}
              />

              <Switch
                className="pt-[2px]"
                switchButtonClass="py-1.5"
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
                name="webform_uuid"
                isMulti
                isObjVal
                isAdd
                createPath={
                  isPathname
                    ? "/manager-webform/create"
                    : "/tenant-webform/create"
                }
                icon="Webform"
                createName="Create Webform"
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

              <Input
                type="number"
                name="wrap_up_time"
                icon="WrapUpTime"
                label="Wrap Up Time"
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
                placeholder="Select Wrap Up Disposition"
                icon="CallGray"
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
                icon="CallGray"
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
                  <div
                    ref={modalRef}
                    className="bg-white rounded-lg shadow-lg p-6 w-[400px] max-h-[90vh] overflow-y-auto"
                  >
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
