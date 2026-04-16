"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// PROJECT IMPORT
import { ivrCreate, useIvr } from "@/redux/slice/tenant-admin/ivrSlice";
import {
    promptsOptionsGet,
    usePromptsOptions,
} from "@/redux/slice/tenant-admin/promptsSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { useAuth } from "@/contexts/hooks/useAuth";
import { Input, InputNumber, Select, Switch } from "@/components/forms";
import { CardForm } from "@/components/ui-components";
import AddAdvanceList from "./AddAdvanceList";

// TYPES IMPORT
import { InitialValueType } from "@/types/tenant-admin/ivrTypes";

// OPTIONS IMPORT
import { timeoutOptions2 } from "@/config/options";

// DATA
const initialAdvanceValues = {
    digits: "0",
    routing_type: "1",
    routing_options: "",
};
interface CreateIvrFormProps {
    promptPath: string;
    managerName?: string;
}

const CreateIvrForm = (props: CreateIvrFormProps) => {
    const { promptPath, managerName } = props;
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { user } = useAuth();
    const promptsOptions = usePromptsOptions();
    const ivr = useIvr();

    const [loading, setLoading] = useState<boolean>(false);
    const [advanceData, setAdvanceData] = useState([initialAdvanceValues]);

    const initialValues: InitialValueType = {
        name: "",
        timeout: "",
        welcome_greetings_uuid: "",
        invalid_greetings_uuid: "",
        invalid_retries: "0",
        exit_greetings_uuid: "",
        status: "0",
        user_uuid: "",
    };

    const validationSchema = Yup.object<InitialValueType>({
        name: Yup.string().required("Please enter your name"),
        timeout: Yup.string().required("Please select timeout"),
        welcome_greetings_uuid: Yup.string().required(
            "Please select welcome prompt"
        ),
        invalid_retries: Yup.string().required("Please enter invalid retries"),
    });

    // Create or Update IVR
    const onSubmit = (values: any) => {
        const payload = { ...values };
        payload["tenant_uuid"] = user?.tenant_detail?.uuid;
        payload["digits"] = advanceData;
        onCreateIvr(payload);
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
    } = useFormik<any>({
        initialValues,
        validationSchema,
        onSubmit,
    });

    useEffect(() => {
        onGetPromptsOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetching Audio Prompts Options
    const onGetPromptsOptions = async () => {
        try {
            await dispatch(promptsOptionsGet());
        } catch (err) {
            console.error("Get Prompt Options Err =-=>", err);
        }
    };

    // Create IVR & Navigate to IVR Page
    const onCreateIvr = async (values: any) => {
        setLoading(true);
        try {
            const payload = { ...values };
            const res: any = await dispatch(ivrCreate(payload)).unwrap();
            if (res?.statusCode === 201) {
                router.back();
                resetForm();
                Success(res.data);
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Create IVR Err --->", e?.message);
        }
    };

    return (
        <CardForm
            name="ivr"
            managerName={managerName}
            length={ivr?.count}
            title="Create IVR"
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
                    name="timeout"
                    label="Time Out"
                    placeholder="Select Timeout"
                    icon="ClockGray"
                    removable
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
                    name="welcome_greetings_uuid"
                    label="Welcome Prompt"
                    placeholder="Select Welcome Prompt"
                    isAdd
                    createName="Create Audio Prompts"
                    createPath={`/${promptPath}/audio-prompts/create`}
                    options={promptsOptions}
                    value={values.welcome_greetings_uuid}
                    touched={touched}
                    errors={errors}
                    onChange={(e: any) => {
                        setFieldValue("welcome_greetings_uuid", e.target.value);
                    }}
                    onBlur={handleBlur}
                    isInfo
                />
                <Select
                    name="invalid_greetings_uuid"
                    label="Invalid Prompt"
                    placeholder="Select Invalid Prompt"
                    isAdd
                    createName="Create Audio Prompts"
                    createPath={`/${promptPath}/audio-prompts/create`}
                    options={promptsOptions}
                    value={values.invalid_greetings_uuid}
                    touched={touched}
                    errors={errors}
                    onChange={(e: any) => {
                        setFieldValue("invalid_greetings_uuid", e.target.value);
                    }}
                    onBlur={handleBlur}
                    isInfo
                />
                <InputNumber
                    name="invalid_retries"
                    label="Invalid Retries"
                    placeholder="Enter Invalid Retries"
                    value={values.invalid_retries}
                    touched={touched}
                    errors={errors}
                    onChange={(value: string) => setFieldValue("invalid_retries", value)}
                    onBlur={handleBlur}
                    isInfo
                />
                <Select
                    name="exit_greetings_uuid"
                    label="Exit Prompt"
                    placeholder="Select Exit Prompt"
                    isAdd
                    createName="Create Audio Prompts"
                    createPath={`/${promptPath}/audio-prompts/create`}
                    options={promptsOptions}
                    value={values.exit_greetings_uuid}
                    touched={touched}
                    errors={errors}
                    onChange={(e: any) => {
                        setFieldValue("exit_greetings_uuid", e.target.value);
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
            </div>
            <AddAdvanceList
                promptPath={promptPath}
                advanceData={advanceData}
                setAdvanceData={setAdvanceData}
            />
        </CardForm>
    );
};

export default CreateIvrForm;
