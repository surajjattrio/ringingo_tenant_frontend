"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// PROJECT IMPORT
import {
  timeConditionCreate,
  timeConditionOptionsGet,
  timeConditionUpdate,
  updateSingleTimeConditionData,
  useSingletimeCondition,
  useTimeCondition,
  useTimeConditionOptions,
} from "@/redux/slice/tenant-admin/timeConditionSlice";
import {
  ivrOptionsGet,
  useIvrOptions,
} from "@/redux/slice/tenant-admin/ivrSlice";
import {
  callQueueOptionsGet,
  useCallQueueOptions,
} from "@/redux/slice/tenant-admin/callQueueSlice";
import {
  ringOptionsGet,
  useRingOptions,
} from "@/redux/slice/tenant-admin/ringSlice";
import {
  externalUserOptionsGet,
  useExternalUserOptions,
} from "@/redux/slice/tenant-admin/userSlice";
import {
  sipOptionsGet,
  useSipOptions,
} from "@/redux/slice/tenant-admin/sipDevicesSlice";
import {
  conferenceOptionsGet,
  useConferenceOptions,
} from "@/redux/slice/tenant-admin/conferenceSlice";
import {
  promptsOptionsGet,
  usePromptsOptions,
} from "@/redux/slice/tenant-admin/promptsSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useAuth } from "@/contexts/hooks/useAuth";
import { Danger, Success } from "@/redux/services/toasterServices";
import { CardForm } from "@/components/ui-components";
import { Input, Select, Switch } from "@/components/forms";
import AddTimeCondition from "./AddTimeCondition";

// TYPES IMPORT
import { InitialValueType } from "@/types/tenant-admin/timeConditionTypes";

// OPTIONS IMPORT
import { routingTypeOptions3 } from "@/config/options";
import { ManagerNameTypes } from "@/types/formTypes";

// DATA
const initialConditionValues = {
  start_hour: "",
  start_minute: "",
  end_hour: "",
  end_minute: "",
  weekday_start: "",
  weekday_end: "",
  monthday_start: "",
  monthday_end: "",
  start_month: "",
  end_month: "",
  start_year: "",
  end_year: "",
  extension_calltype: "1",
  extension_destination: "",
  priority: "",
};

const CreateEditTimeConditionForm = (props: ManagerNameTypes) => {
  const { managerName = "" } = props;

  const { id } = useParams();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAuth();

  const timeCondition = useTimeCondition();
  const timeConditionData = useSingletimeCondition();
  const sipOptions: any = useSipOptions();
  const ivrOptions: any = useIvrOptions();
  const timeConditionOptions: any = useTimeConditionOptions();
  const callQueueOptions: any = useCallQueueOptions();
  const ringOptions: any = useRingOptions();
  const conferenceOptions: any = useConferenceOptions();
  const externalUserOptions: any = useExternalUserOptions();
  const promptsOptions: any = usePromptsOptions();

  const [loading, setLoading] = useState<boolean>(false);
  const [conditionData, setConditionData] = useState([initialConditionValues]);

  const initialValues: InitialValueType = {
    name: "",
    status: "0",
    user_uuid: "",
    failover_routing_type: "",
    failover_routing_options: "",
    fail_over_routing_name: "",
  };

  const validationSchema = Yup.object<InitialValueType>({
    name: Yup.string().required("Please Enter Time Condition Name"),
    failover_routing_type: Yup.string().required(
      "Please Select Fail-Over Routing Type"
    ),
    failover_routing_options: Yup.string().required(
      "Please Select Fail-Over Routing Option"
    ),
  });

  // Create or Update Time Condition
  const onSubmit = (values: any) => {
    const payload = { ...values };
    payload["tenant_uuid"] = user?.tenant_detail?.uuid;
    payload["condition"] = conditionData;
    if (id) {
      onUpdateTimeCondition(payload);
    } else {
      onCreateTimeCondition(payload);
    }
  };

  const {
    values,
    touched,
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    setValues,
    setFieldValue,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  useLayoutEffect(() => {
    if (!id) return;
    setValues({
      ...values,
      name: timeConditionData?.name,
      status: timeConditionData?.status || "0",
      failover_routing_type: timeConditionData?.failover_routing_type,
      failover_routing_options: timeConditionData?.failover_routing_options,
      fail_over_routing_name: timeConditionData?.fail_over_routing_name,
    });
    setConditionData(timeConditionData?.condition || [initialConditionValues]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeConditionData, id]);

  useEffect(() => {
    onGetIvrOptions();
    onGetSipOptions();
    onGetTimeConditionOptions();
    onGetCallQueueOptions();
    onGetRingGroupOptions();
    onGetConferenceOptions();
    onGetExternalUserOptions();
    onGetPromptsOptions();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetching SIP Options
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

  // Fetching Audio Prompts Options
  const onGetPromptsOptions = async () => {
    try {
      await dispatch(promptsOptionsGet()).unwrap();
    } catch (err) {
      console.error("Get Audio Prompts Options Err =-=>", err);
    }
  };

  // Get Name for Routing Options
  const getName = (type: string) => {
    const data = routingTypeOptions3?.find((val: any) => val?.value === type);
    return data?.label || "";
  };

  // get create name
  const getCreateName = (type: string) => {
    const data = routingTypeOptions3?.find((val: any) => val?.value === type);
    return data?.label || "";
  };

  // get create name
  const getCreateUrl = (type: string) => {
    const data = routingTypeOptions3?.find((val: any) => val?.value === type);
    return data?.url
      ? data?.url !== "time-condition"
        ? managerName
          ? `/manager-time-condition/${data?.url}/create`
          : `/tenant-time-condition/${data?.url}/create`
        : ""
      : "";
  };

  // Set Options in Fail-Over Routing Options
  const getOptions = (type: string) => {
    // return []
    switch (type) {
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
      case "10":
        return promptsOptions;
    }
  };

  // Create Time Condition & Navigate to Time Condition Page
  const onCreateTimeCondition = async (values: any) => {
    setLoading(true);
    try {
      const payload = { ...values };
      const res: any = await dispatch(timeConditionCreate(payload)).unwrap();
      if (res?.statusCode === 201) {
        Success(res.data);
        resetForm();
        router.back();
      } else {
        Danger(res?.data);
      }
      setLoading(false);
    } catch (e: any) {
      setLoading(false);
      console.error("Create Time Condition Err --->", e?.message);
    }
  };

  // Update Time Condition & Navigate to Time Condition Page
  const onUpdateTimeCondition = async (values: any) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        id,
      };
      const res: any = await dispatch(timeConditionUpdate(payload)).unwrap();
      if (res?.statusCode === 200) {
        Success(res.data);
        router.back();
        resetForm();
        dispatch(updateSingleTimeConditionData({}));
        setConditionData([initialConditionValues]);
      } else {
        Danger(res?.data);
      }
      setLoading(false);
    } catch (e: any) {
      setLoading(false);
      console.error("Update Time Condition Err --->", e?.message);
    }
  };

  return (
    <CardForm
      id={id}
      name="tc"
      managerName={managerName}
      length={id ? 0 : timeCondition?.count}
      title={id ? "Edit Time Condition" : "Create Time Condition"}
      loading={loading}
      handleSubmit={handleSubmit}
      onDoneClick={handleSubmit}
      onCancelClick={() => {
        resetForm();
        router.back();
        id && dispatch(updateSingleTimeConditionData({}));
        id && setConditionData([initialConditionValues]);
      }}
    >
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
          name="failover_routing_type"
          label={
            <>
              Fail Over Routing Type <span className="text-red-500">*</span>
            </>
          }
          icon="FailType"
          placeholder="Select Fail-over Routing Type"
          options={routingTypeOptions3}
          value={values.failover_routing_type}
          touched={touched}
          errors={errors}
          onChange={(e: any) => {
            setValues({
              ...values,
              failover_routing_type: e.target.value,
              failover_routing_options: "",
            });
          }}
          onBlur={handleBlur}
          isInfo
        />
        {values.failover_routing_type === "8" ? (
          <Input
            type="number"
            name="failover_routing_options"
            label={
              <>
                Fail Over Routing Options{" "}
                <span className="text-red-500">*</span>
              </>
            }
            icon="FailOption"
            placeholder="Enter Fail-over Routing Option"
            value={values.failover_routing_options}
            touched={touched}
            errors={errors}
            onChange={(e: any) => {
              setValues({
                ...values,
                failover_routing_options: e.target.value,
                fail_over_routing_name: e.target.value,
              });
            }}
            onBlur={handleBlur}
            isInfo
          />
        ) : (
          <Select
            name="failover_routing_options"
            label="Fail-over Routing Option"
            icon="FailOption"
            placeholder="Select Fail-over Routing Option"
            isAdd
            createName={"Create " + getCreateName(values.failover_routing_type)}
            createPath={getCreateUrl(values.failover_routing_type)}
            options={getOptions(values.failover_routing_type) || []}
            value={values.failover_routing_options}
            touched={touched}
            errors={errors}
            onChange={(e: any, title: string) => {
              setValues({
                ...values,
                failover_routing_options: e.target.value,
                fail_over_routing_name: title,
              });
            }}
            onBlur={handleBlur}
            isInfo
          />
        )}
        <Switch
          className="pt-[2px]"
          label="Status"
          value={values.status}
          onClick={(value: string) => setFieldValue("status", value)}
        />
      </div>

      <AddTimeCondition
        conditionData={conditionData}
        setConditionData={setConditionData}
        getName={getName}
        getOptions={getOptions}
      />
    </CardForm>
  );
};

export default CreateEditTimeConditionForm;
