"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// PROJECT IMPORT
import {
    callQueueCreate,
    useCallQueue,
    callQueueOptionsGet,
    useCallQueueOptions,
} from "@/redux/slice/tenant-admin/callQueueSlice";
import {
    usePromptsOptions,
    promptsOptionsGet,
} from "@/redux/slice/tenant-admin/promptsSlice";
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
    externalUserOptionsGet,
    useExternalUserOptions,
} from "@/redux/slice/tenant-admin/userSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useAuth } from "@/contexts/hooks/useAuth";
import { Danger, Success } from "@/redux/services/toasterServices";
import { CardForm } from "@/components/ui-components";
import { Input, Select, Switch } from "@/components/forms";

// TYPES IMPORT
import { InitialValueType } from "@/types/tenant-admin/callQueueTypes";

// OPTIONS IMPORT
import {
    strategyOptions,
    timeoutOptions2,
    routingTypeOptions2,
} from "@/config/options";

interface CreateCallQueueFormProps {
    promptPath: string;
    managerName?: string;
}

const CreateCallQueueForm = (props: CreateCallQueueFormProps) => {
    const { promptPath, managerName } = props;

    const { user } = useAuth();

    const dispatch = useAppDispatch();
    const router = useRouter();
    const promptsOptions = usePromptsOptions();
    const callQueue = useCallQueue();

    const sipOptions: any = useSipOptions();
    const ivrOptions: any = useIvrOptions();
    const timeConditionOptions: any = useTimeConditionOptions();
    const callQueueOptions: any = useCallQueueOptions();
    const ringOptions: any = useRingOptions();
    const conferenceOptions: any = useConferenceOptions();
    const externalUserOptions: any = useExternalUserOptions();

    const [loading, setLoading] = useState<boolean>(false);

    const initialValues: InitialValueType = {
        name: "",
        status: "0",
        // sticky_agent: "0",
        strategy: "",
        user_uuid: "",
        call_waiting_greeting_uuid: "",
        call_welcome_greeting_uuid: "",
        timeout: "",
        agent_timeout: "",
        for_pbx: "1",
        failover_routing_type: "",
        failover_routing_options: "",
        fail_over_routing_name: "",
    };

    const validationSchema = Yup.object<InitialValueType>({
        name: Yup.string().required("Please Enter Your Name"),
        strategy: Yup.string().required("Please Select Strategy"),
        call_waiting_greeting_uuid: Yup.string().required(
            "Please Select Call Waiting Prompt"
        ),
        failover_routing_type: Yup.string().when("timeout", {
            is: (val: string) => val && val !== "",
            then: (schema) => schema.required("Please Select Fail-over Routing Type"),
            otherwise: (schema) => schema.optional(),
        }),
        failover_routing_options: Yup.string().when("timeout", {
            is: (val: string) => val && val !== "",
            then: (schema) => schema.required("Please Select Fail-over Routing Option"),
            otherwise: (schema) => schema.optional(),
        }),
    });

    // Create Call Queue or Update Call Queue
    const onSubmit = (values: any) => {
        const payload = { ...values };
        payload["tenant_uuid"] = user?.tenant_detail?.uuid;
        onCreateCallQueue(payload);
    };

    const {
        values,
        touched,
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        setValues,
        resetForm,
    } = useFormik({
        initialValues,
        validationSchema,
        onSubmit,
    });

    useEffect(() => {
        onGetPromptsOptions();
        onGetIvrOptions();
        onGetSipOptions();
        onGetTimeConditionOptions();
        onGetCallQueueOptions();
        onGetRingGroupOptions();
        onGetConferenceOptions();
        onGetExternalUserOptions();
        //eslint-disable-next-line react-hooks/exhaustive-deps
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
    const getOptions = (type: string | undefined) => {
        if (!type) return [];
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
            default:
                return [];
        }
    };

    // get create name
    const getCreateName = (type: string | undefined) => {
        if (!type) return "";
        const data = routingTypeOptions2?.find((val: any) => val?.value === type);
        return data?.label || "";
    };

    // get create url
    const getCreateUrl = (type: string | undefined) => {
        if (!type) return "";
        const data = routingTypeOptions2?.find((val: any) => val?.value === type);
        return data?.url
            ? data?.url !== "call-queue" // Prevent recursive navigation
                ? managerName
                    ? `/manager-call-queue/${data?.url}/create`
                    : `/tenant-call-queue/${data?.url}/create`
                : ""
            : "";
    };

    // Fetching Audio Prompts Options
    const onGetPromptsOptions = async () => {
        try {
            await dispatch(promptsOptionsGet());
        } catch (err) {
            console.error("Get Prompt Options Err =-=>", err);
        }
    };

    // Create Call Queue & Navigate to Call Queue Page
    const onCreateCallQueue = async (values: any) => {
        setLoading(true);
        try {
            const payload = { ...values };
            const res: any = await dispatch(callQueueCreate(payload)).unwrap();
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
            console.error("Create Call Queue Err --->", e?.message);
        }
    };

    return (
        <CardForm
            name="cq"
            managerName={managerName}
            length={callQueue?.count}
            title="Create Call Queue"
            loading={loading}
            handleSubmit={handleSubmit}
            onDoneClick={handleSubmit}
            onCancelClick={() => {
                resetForm();
                router.back();
            }}
        >
            <div className="pt-5 pb-10 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4 px-4">
                <Input
                    name="name"
                    label="Name"
                    placeholder="Enter Name"
                    value={values.name}
                    touched={touched}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInfo
                />
                <Select
                    name="strategy"
                    label="Strategy"
                    placeholder="Select Strategy"
                    removable
                    options={strategyOptions}
                    value={values.strategy}
                    touched={touched}
                    errors={errors}
                    onChange={(e: any) => {
                        setFieldValue("strategy", e.target.value);
                    }}
                    onBlur={handleBlur}
                    isInfo
                />
                <Select
                    name="call_welcome_greeting_uuid"
                    label="Welcome Prompt"
                    placeholder="Select Welcome Prompt"
                    isAdd
                    createName="Create Audio Prompts"
                    createPath={`/${promptPath}/audio-prompts/create`}
                    options={promptsOptions}
                    value={values.call_welcome_greeting_uuid}
                    touched={touched}
                    errors={errors}
                    onChange={(e: any) => {
                        setFieldValue("call_welcome_greeting_uuid", e.target.value);
                    }}
                    onBlur={handleBlur}
                    isInfo
                />
                <Select
                    name="call_waiting_greeting_uuid"
                    label="Call Waiting Prompt"
                    placeholder="Select Call Waiting Prompt"
                    isAdd
                    createName="Create Audio Prompts"
                    createPath={`/${promptPath}/audio-prompts/create`}
                    icon="ClockGray"
                    options={promptsOptions}
                    value={values.call_waiting_greeting_uuid}
                    touched={touched}
                    errors={errors}
                    onChange={(e: any) => {
                        setFieldValue("call_waiting_greeting_uuid", e.target.value);
                    }}
                    onBlur={handleBlur}
                    isInfo
                />
                <Select
                    name="timeout"
                    label="Call Queue Timeout"
                    placeholder="Select Call Queue Timeout"
                    removable
                    icon="ClockGray"
                    options={timeoutOptions2}
                    value={values.timeout}
                    touched={touched}
                    errors={errors}
                    onChange={(e: any) => {
                        setFieldValue("timeout", e.target.value);
                        if (!e.target.value) {
                            setFieldValue("failover_routing_type", "");
                            setFieldValue("failover_routing_options", "");
                            setFieldValue("fail_over_routing_name", "");
                        }
                    }}
                    onBlur={handleBlur}
                    isInfo
                />
                {values.timeout && (
                    <Select
                        name="failover_routing_type"
                        label={
                            <>
                                Queue Failover Route <span className="text-red-500">*</span>
                            </>
                        }
                        icon="FailType"
                        placeholder="Select Queue Failover Route"
                        options={routingTypeOptions2}
                        value={values.failover_routing_type}
                        touched={touched}
                        errors={errors}
                        onChange={(e: any) => {
                            setValues({
                                ...values,
                                failover_routing_type: e.target.value,
                                failover_routing_options: "",
                                fail_over_routing_name: "",
                            });
                        }}
                        onBlur={handleBlur}
                    />
                )}
                {values.timeout && values.failover_routing_type && (
                    <>
                        {values.failover_routing_type === "8" ? (
                            <Input
                                type="number"
                                name="failover_routing_options"
                                label={
                                    <>
                                        {"Set " + getCreateName(values.failover_routing_type)} <span className="text-red-500">*</span>
                                    </>
                                }
                                placeholder={"Enter " + getCreateName(values.failover_routing_type)}
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
                            />
                        ) : values.failover_routing_type === "10" || values.failover_routing_type === "11" ? (
                            <Input
                                type="text"
                                name="failover_routing_options"
                                label={
                                    <>
                                        {"Set " + getCreateName(values.failover_routing_type)} <span className="text-red-500">*</span>
                                    </>
                                }
                                placeholder={"Enter " + getCreateName(values.failover_routing_type)}
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
                            />
                        ) : (
                            <Select
                                name="failover_routing_options"
                                label={
                                    <>
                                        {"Set " + getCreateName(values.failover_routing_type)} <span className="text-red-500">*</span>
                                    </>
                                }
                                icon="FailOption"
                                placeholder={"Select " + getCreateName(values.failover_routing_type)}
                                isAdd
                                createName={"Create " + getCreateName(values.failover_routing_type)}
                                createPath={getCreateUrl(values.failover_routing_type)}
                                options={getOptions(values.failover_routing_type) || []}
                                value={values.failover_routing_options}
                                touched={touched}
                                errors={errors}
                                onChange={(e: any) => {
                                    const filterName =
                                        getOptions(values.failover_routing_type)?.find(
                                            (val: any) => val?.value === e.target.value
                                        )?.label || "";
                                    setValues({
                                        ...values,
                                        failover_routing_options: e.target.value,
                                        fail_over_routing_name: filterName,
                                    });
                                }}
                                onBlur={handleBlur}
                            />
                        )}
                    </>
                )}
                <Select
                    name="agent_timeout"
                    label="Agent Timeout"
                    placeholder="Select Agent Timeout"
                    removable
                    icon="ClockGray"
                    options={timeoutOptions2}
                    value={values.agent_timeout}
                    touched={touched}
                    errors={errors}
                    onChange={(e: any) => {
                        setFieldValue("agent_timeout", e.target.value);
                    }}
                    onBlur={handleBlur}
                    isInfo
                />
                <Switch
                    className="pt-[2px]"
                    label="Status"
                    value={values.status}
                    onClick={(value: string) => setFieldValue("status", value)}
                />
            </div>
        </CardForm>
    );
};

export default CreateCallQueueForm;
