"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// PROJECT IMPORT
import {
    callQueueCreate,
    callQueueUpdate,
    callQueueSingleGet,
    useCallQueue,
} from "@/redux/slice/tenant-admin/callQueueSlice";
import {
    usePromptsOptions,
    promptsOptionsGet,
} from "@/redux/slice/tenant-admin/promptsSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useAuth } from "@/contexts/hooks/useAuth";
import { Danger, Success } from "@/redux/services/toasterServices";
import { CardForm } from "@/components/ui-components";
import { Input, Select, Switch } from "@/components/forms";
import AddCallQueueExtension from "./AddCallQueueExtension";

// TYPES IMPORT
import { InitialValueType } from "@/types/tenant-admin/callQueueTypes";

// OPTIONS IMPORT
import {
    callModeOptions,
    strategyOptions,
    timeoutOptions2,
} from "@/config/options";
import { ManagerNameTypes } from "@/types/formTypes";

// DATA
const initialExtensionValues = {
    name: "",
    status: "0",
    extension_uuid: "",
    level: "",
    position: "",
    user_uuid: "",
};

const CreateEditCallQueueForm = (props: ManagerNameTypes) => {
    const { managerName = "" } = props;

    const { id } = useParams();
    const { user } = useAuth();

    const dispatch = useAppDispatch();
    const router = useRouter();
    const promptsOptions = usePromptsOptions();
    const callQueue = useCallQueue();

    const [extensionData, setExtensionData] = useState([initialExtensionValues]);
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
        for_pbx: "0",
    };

    const validationSchema = Yup.object<InitialValueType>({
        name: Yup.string().required("Please Enter Your Name"),
        strategy: Yup.string().required("Please Select Strategy"),
        call_waiting_greeting_uuid: Yup.string().required(
            "Please Select Call Waiting Prompt"
        ),
    });

    // Create Call Queue or Update Call Queue
    const onSubmit = (values: any) => {
        const payload = { ...values };
        payload["tenant_uuid"] = user?.tenant_detail?.uuid;
        if (values.for_pbx === "0") {
            payload["agent_info"] = extensionData;
        }
        if (id) {
            onUpdateCallQueue(payload);
        } else {
            onCreateCallQueue(payload);
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
        onGetSingleCallQueue();
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    useEffect(() => {
        onGetPromptsOptions();
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetching Audio Prompts Options
    const onGetPromptsOptions = async () => {
        try {
            await dispatch(promptsOptionsGet());
        } catch (err) {
            console.error("Get Prompt Options Err =-=>", err);
        }
    };

    // Fetching Single Call Queue Data
    const onGetSingleCallQueue = async () => {
        try {
            const res: any = await dispatch(callQueueSingleGet(id)).unwrap();
            if (res?.statusCode === 200) {
                const callQueueData = res?.data;
                setValues({
                    ...values,
                    name: callQueueData?.name,
                    status: callQueueData?.status || "0",
                    // sticky_agent: callQueueData?.sticky_agent || "0",
                    strategy: callQueueData?.strategy,
                    call_waiting_greeting_uuid: callQueueData?.call_waiting_greeting_uuid,
                    call_welcome_greeting_uuid: callQueueData?.call_welcome_greeting_uuid,
                    timeout: callQueueData?.timeout,
                    agent_timeout: callQueueData?.agent_timeout,
                    for_pbx: callQueueData?.for_pbx || "0",
                });
                setExtensionData(res?.agent_info || [initialExtensionValues]);
            }
        } catch (err) {
            console.error("Get Single Call Queue Err =-=>", err);
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

    // Update Call Queue & Navigate to Call Queue Page
    const onUpdateCallQueue = async (values: any) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                id,
            };
            const res: any = await dispatch(callQueueUpdate(payload)).unwrap();
            if (res?.statusCode === 200) {
                Success(res.data);
                router.back();
                resetForm();
                setExtensionData([initialExtensionValues]);
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Update Call Queue Err --->", e?.message);
        }
    };

    return (
        <CardForm
            id={id}
            name="cq"
            managerName={managerName}
            length={id ? 0 : callQueue?.count}
            title={id ? "Edit Call Queue" : "Create Call Queue"}
            loading={loading}
            handleSubmit={handleSubmit}
            onDoneClick={handleSubmit}
            onCancelClick={() => {
                resetForm();
                router.back();
                id && setExtensionData([initialExtensionValues]);
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
                    name="strategy"
                    label={
                        <>
                            Strategy <span className="text-red-500">*</span>
                        </>
                    }
                    icon="Strategy"
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
                    icon="WelcomePrompt"
                    placeholder="Select Welcome Prompt"
                    isAdd
                    createName="Create Audio Prompts"
                    createPath={
                        managerName
                            ? "/manager-call-queue/audio-prompts/create"
                            : "/tenant-call-queue/audio-prompts/create"
                    }
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
                    label={
                        <>
                            Call Waiting Prompt <span className="text-red-500">*</span>
                        </>
                    }
                    placeholder="Select Call Waiting Prompt"
                    isAdd
                    createName="Create Audio Prompts"
                    createPath={
                        managerName
                            ? "/manager-call-queue/audio-prompts/create"
                            : "/tenant-call-queue/audio-prompts/create"
                    }
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
                    }}
                    onBlur={handleBlur}
                    isInfo
                />
                <Select
                    name="agent_timeout"
                    label="Agent Timeout"
                    placeholder="Select Agent Timeout"
                    removable
                    icon="AgentTimeout"
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
                <Select
                    name="for_pbx"
                    label="Call Mode"
                    icon="CallMode"
                    placeholder="Select Call Mode"
                    options={callModeOptions}
                    value={values.for_pbx}
                    touched={touched}
                    errors={errors}
                    onChange={(e: any) => {
                        setFieldValue("for_pbx", e.target.value);
                        e.target.value === "0" &&
                            setExtensionData([initialExtensionValues]);
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
                {/* <Switch
                    className="pt-[2px]"
                    switchButtonClass="py-1.5"
                    trueName="Yes"
                    falseName="No"
                    label="Sticky Agent"
                    value={values.sticky_agent}
                    onClick={(value: string) => setFieldValue("sticky_agent", value)}
                /> */}
            </div>
            {values.for_pbx === "0" && (
                <AddCallQueueExtension
                    extensionData={extensionData}
                    setExtensionData={setExtensionData}
                />
            )}
        </CardForm>
    );
};

export default CreateEditCallQueueForm;
