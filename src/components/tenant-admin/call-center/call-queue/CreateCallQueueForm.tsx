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

// TYPES IMPORT
import { InitialValueType } from "@/types/tenant-admin/callQueueTypes";

// OPTIONS IMPORT
import { strategyOptions, timeoutOptions2 } from "@/config/options";

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
        resetForm,
    } = useFormik({
        initialValues,
        validationSchema,
        onSubmit,
    });

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
                    }}
                    onBlur={handleBlur}
                    isInfo
                />
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
