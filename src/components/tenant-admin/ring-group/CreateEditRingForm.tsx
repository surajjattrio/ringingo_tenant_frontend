"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// PROJECT IMPORT
import {
    updateSingleRingData,
    ringCreate,
    ringUpdate,
    useSingleRing,
    useRings,
} from "@/redux/slice/tenant-admin/ringSlice";
import {
    promptsOptionsGet,
    usePromptsOptions,
} from "@/redux/slice/tenant-admin/promptsSlice";

// OPTIONS IMPORT
import { callModeOptions } from "@/config/options";

import { useAuth } from "@/contexts/hooks/useAuth";
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { CardForm } from "@/components/ui-components";
import { Input, Select, Switch } from "@/components/forms";
import AddExtensionTable from "./AddExtensionTable";

// TYPES IMPORT
import { InitialValueType } from "@/types/tenant-admin/ringTypes";

// OPTIONS IMPORT
import { timeoutOptions2, typeOptions } from "@/config/options";
import { ManagerNameTypes } from "@/types/formTypes";

const initialExtensionValues = {
    extension_type: "0",
    extension: "",
    user_uuid: "",
};

const CreateEditRingForm = (props: ManagerNameTypes) => {
    const { managerName = "" } = props;
    const { id } = useParams();
    const { user } = useAuth();

    const router = useRouter();
    const dispatch = useAppDispatch();
    const promptOptions = usePromptsOptions();
    const ringData = useSingleRing();
    const rings = useRings();

    const [loading, setLoading] = useState<boolean>(false);
    const [extensionData, setExtensionData] = useState([initialExtensionValues]);

    const initialValues: InitialValueType = {
        name: "",
        user_uuid: "",
        type: "",
        greeting_uuid: "",
        timeout: "",
        status: "0",
        for_pbx: "0",
        // sticky_agent: "0",
    };

    const validationSchema = Yup.object<InitialValueType>({
        name: Yup.string().required("Please Enter Ring Group Name"),
        type: Yup.string().required("Please Select Type"),
        timeout: Yup.string().required("Please Select Timeout"),
        greeting_uuid: Yup.string().required("Please Select Prompt"),
    });

    // Create or Update Ring Group
    const onSubmit = (values: any) => {
        const payload = { ...values };
        payload["tenant_uuid"] = user?.tenant_detail?.uuid;
        payload["extension_list"] = extensionData;
        // if (values.for_pbx === "0") {
        //     payload["extension_list"] = extensionData;
        // }
        if (id) {
            onUpdateRing(payload);
        } else {
            onCreateRing(payload);
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
            name: ringData?.name,
            type: ringData?.ringType,
            greeting_uuid: ringData?.greeting_uuid,
            timeout: ringData?.timeout,
            status: ringData?.status || "0",
            for_pbx: ringData?.for_pbx || "0",
            // sticky_agent: ringData?.sticky_agent || "0",
        });
        setExtensionData(ringData?.extension_list || [initialExtensionValues]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ringData, id]);

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

    // Update Ring Group & Navigate to Ring Group
    const onUpdateRing = async (values: any) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                id,
            };
            const res: any = await dispatch(ringUpdate(payload)).unwrap();
            if (res?.statusCode === 200) {
                router.back();
                Success(res.data);
                resetForm();
                dispatch(updateSingleRingData({}));
                setExtensionData([initialExtensionValues]);
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Update Ring Err --->", e?.message);
        }
    };

    return (
        <CardForm
            id={id}
            name="rg"
            managerName={managerName}
            length={id ? 0 : rings?.count}
            title={id ? "Edit Ring Group" : "Create Ring Group"}
            loading={loading}
            handleSubmit={handleSubmit}
            onDoneClick={handleSubmit}
            onCancelClick={() => {
                resetForm();
                router.back();
                id && dispatch(updateSingleRingData({}));
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
                    name="type"
                    label={
                        <>
                            Type <span className="text-red-500">*</span>
                        </>
                    }
                    icon="Type"
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
                    label={
                        <>
                            Information Prompt <span className="text-red-500">*</span>
                        </>
                    }
                    icon="InformationPrompt"
                    placeholder="Select Prompt"
                    isAdd
                    createName="Create Audio Prompts"
                    createPath={managerName ? "/manager-ring-group/audio-prompts/create" : "/tenant-ring-group/audio-prompts/create"}
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
                        e.target.value === "0" && setExtensionData([initialExtensionValues]);
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
            {values.for_pbx === "0" && (
                <AddExtensionTable
                    extensionData={extensionData}
                    setExtensionData={setExtensionData}
                />
            )}
        </CardForm>
    );
};

export default CreateEditRingForm;
