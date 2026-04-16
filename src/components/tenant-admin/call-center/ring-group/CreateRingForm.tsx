"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// PROJECT IMPORT
import { ringCreate, useRings } from "@/redux/slice/tenant-admin/ringSlice";
import {
    promptsOptionsGet,
    usePromptsOptions,
} from "@/redux/slice/tenant-admin/promptsSlice";
import { useAuth } from "@/contexts/hooks/useAuth";
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { CardForm } from "@/components/ui-components";
import { Input, Select, Switch } from "@/components/forms";

// TYPES IMPORT
import { InitialValueType } from "@/types/tenant-admin/ringTypes";

// OPTIONS IMPORT
import { timeoutOptions2, typeOptions } from "@/config/options";
import AddExtensionTable from "./AddExtensionTable";

interface CreateRingFormProps {
    promptPath: string;
    managerName?: string;
}

const CreateRingForm = (props: CreateRingFormProps) => {
    const { promptPath, managerName } = props;

    const { user } = useAuth();

    const router = useRouter();
    const dispatch = useAppDispatch();
    const promptOptions = usePromptsOptions();
    const rings = useRings();

    const [loading, setLoading] = useState<boolean>(false);
    const [extensionData, setExtensionData] = useState([]);

    const initialValues: InitialValueType = {
        name: "",
        user_uuid: "",
        type: "",
        greeting_uuid: "",
        timeout: "",
        status: "0",
        for_pbx: "",
        // sticky_agent: "0",
    };

    const validationSchema = Yup.object<InitialValueType>({
        name: Yup.string().required("Please enter your name"),
        type: Yup.string().required("Please select type"),
        timeout: Yup.string().required("Please select timeout"),
        greeting_uuid: Yup.string().required("Please select prompt"),
    });

    // Create or Update Ring Group
    const onSubmit = (values: any) => {
        const payload = { ...values };
        payload["tenant_uuid"] = user?.tenant_detail?.uuid;
        payload["extension_list"] = extensionData;
        onCreateRing(payload);
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetching Prompts Options
    const onGetPromptsOptions = async () => {
        try {
            await dispatch(promptsOptionsGet());
        } catch (err) {
            console.error("Get Prompt Options Err =-=>", err);
        }
    };

    // Create Ring Group & Navigate to Ring Group
    const onCreateRing = async (values: any) => {
        setLoading(true);
        try {
            const payload = { ...values };
            const res: any = await dispatch(ringCreate(payload)).unwrap();
            if (res?.statusCode === 201) {
                router.back();
                Success(res.data);
                resetForm();
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Create Ring Err --->", e?.message);
        }
    };
    return (
        <CardForm
            name="rg"
            managerName={managerName}
            length={rings?.count}
            title="Create Ring Group"
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
                    name="type"
                    label="Type"
                    placeholder="Select Type"
                    removable
                    options={typeOptions}
                    value={values.type}
                    touched={touched}
                    errors={errors}
                    onChange={(e: any) => {
                        setFieldValue("type", e.target.value);
                    }}
                    onBlur={handleBlur}
                    isInfo
                />
                <Select
                    name="greeting_uuid"
                    label="Information Prompt"
                    placeholder="Select Prompt"
                    isAdd
                    createName="Create Audio Prompts"
                    createPath={`/${promptPath}/audio-prompts/create`}
                    options={promptOptions}
                    value={values.greeting_uuid}
                    touched={touched}
                    errors={errors}
                    onChange={(e: any) => {
                        setFieldValue("greeting_uuid", e.target.value);
                    }}
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
                <Switch
                    className="pt-[2px]"
                    switchButtonClass="py-1.5"
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
            <AddExtensionTable
                extensionData={extensionData}
                setExtensionData={setExtensionData}
            />
        </CardForm>
    );
};

export default CreateRingForm;
