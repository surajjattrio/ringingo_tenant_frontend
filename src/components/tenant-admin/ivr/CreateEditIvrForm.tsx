"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// PROJECT IMPORT
import {
    ivrCreate,
    ivrUpdate,
    updateSingleIvrData,
    useIvr,
    useSingleIvr,
} from "@/redux/slice/tenant-admin/ivrSlice";
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
import { ManagerNameTypes } from "@/types/formTypes";

// DATA
const initialAdvanceValues = {
    digits: "0",
    routing_type: "1",
    routing_options: "",
};

const CreateEditIvrForm = (props: ManagerNameTypes) => {
    const { managerName = "" } = props;
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { user } = useAuth();
    const promptsOptions = usePromptsOptions();
    const ivrData = useSingleIvr();
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
        name: Yup.string().required("Please Enter Ivr Name"),
        timeout: Yup.string().required("Please Select Timeout"),
        welcome_greetings_uuid: Yup.string().required(
            "Please Select Welcome Prompt"
        ),
        invalid_retries: Yup.string().required("Please Enter Invalid Retries"),
    });

    // Create or Update IVR
    const onSubmit = (values: any) => {
        const payload = { ...values };
        payload["tenant_uuid"] = user?.tenant_detail?.uuid;
        payload["digits"] = advanceData;
        if (id) {
            onUpdateIvr(payload);
        } else {
            onCreateIvr(payload);
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
    } = useFormik<any>({
        initialValues,
        validationSchema,
        onSubmit,
    });

    useLayoutEffect(() => {
        if (!id) return;
        setValues({
            ...values,
            name: ivrData?.name,
            timeout: ivrData?.timeout,
            welcome_greetings_uuid: ivrData?.welcome_greetings_uuid,
            invalid_greetings_uuid: ivrData?.invalid_greetings_uuid,
            invalid_retries: ivrData?.invalid_retries,
            exit_greetings_uuid: ivrData?.exit_greetings_uuid,
            status: ivrData?.status || "0",
        });
        setAdvanceData(ivrData?.digits);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ivrData, id]);

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

    // Update IVR & Navigate to IVR Page
    const onUpdateIvr = async (values: any) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                id,
            };
            const res: any = await dispatch(ivrUpdate(payload)).unwrap();
            if (res?.statusCode === 200) {
                router.back();
                Success(res.data);
                resetForm();
                dispatch(updateSingleIvrData({}));
                setAdvanceData([initialAdvanceValues]);
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Update IVR Err --->", e?.message);
        }
    };

    return (
        <CardForm
            id={id}
            name="ivr"
            managerName={managerName}
            length={id ? 0 : ivr?.count}
            title={id ? "Edit IVR" : "Create IVR"}
            loading={loading}
            handleSubmit={handleSubmit}
            onDoneClick={handleSubmit}
            onCancelClick={() => {
                resetForm();
                router.back();
                id && dispatch(updateSingleIvrData({}));
                id && setAdvanceData([initialAdvanceValues]);
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
                    name="timeout"
                    label={
                        <>
                            Timeout <span className="text-red-500">*</span>
                        </>
                    }
                    placeholder="Select Timeout"
                    icon="TimeOut"
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
                    label={
                        <>
                            Welcome Prompt <span className="text-red-500">*</span>
                        </>
                    }
                    icon="WelcomePrompt"
                    placeholder="Select Welcome Prompt"
                    isAdd
                    createName="Create Audio Prompts"
                    createPath={
                        managerName
                            ? "/manager-ivr/audio-prompts/create"
                            : "/tenant-ivr/audio-prompts/create"
                    }
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
                    icon="InvalidPrompt"
                    placeholder="Select Invalid Prompt"
                    isAdd
                    createName="Create Audio Prompts"
                    createPath={
                        managerName
                            ? "/manager-ivr/audio-prompts/create"
                            : "/tenant-ivr/audio-prompts/create"
                    }
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
                    icon="Invalidretries"
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
                    icon="ExitPrompt"
                    placeholder="Select Exit Prompt"
                    isAdd
                    createName="Create Audio Prompts"
                    createPath={
                        managerName
                            ? "/manager-ivr/audio-prompts/create"
                            : "/tenant-ivr/audio-prompts/create"
                    }
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
                advanceData={advanceData}
                setAdvanceData={setAdvanceData}
            />
        </CardForm>
    );
};

export default CreateEditIvrForm;
