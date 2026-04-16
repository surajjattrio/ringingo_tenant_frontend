"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// PROJECT IMPORT
import {
    conferenceCreate,
    conferenceUpdate,
    updateSingleConferenceData,
    useConference,
    useSingleConference,
} from "@/redux/slice/tenant-admin/conferenceSlice";
import {
    promptsOptionsGet,
    usePromptsOptions,
} from "@/redux/slice/tenant-admin/promptsSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { useAuth } from "@/contexts/hooks/useAuth";
import { Input, Select, Switch } from "@/components/forms";
import { CardForm } from "@/components/ui-components";

// TYPES IMPORT
import { InitialValueType } from "@/types/tenant-admin/conferenceTypes";
import { ManagerNameTypes } from "@/types/formTypes";

const CreateEditConferenceForm = (props: ManagerNameTypes) => {
    const { managerName = "" } = props;

    const { id } = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { user } = useAuth();
    const promptsOptions = usePromptsOptions();
    const conferenceData = useSingleConference();
    const conference = useConference();

    const [loading, setLoading] = useState<boolean>(false);

    const initialValues: InitialValueType = {
        name: "",
        description: "",
        pin: "",
        greeting_uuid: "",
        status: "0",
        user_uuid: "",
    };

    const validationSchema = Yup.object<InitialValueType>({
        name: Yup.string().required("Please Enter Conference Name"),
        greeting_uuid: Yup.string().required("Please Select Welcome Prompts"),
    });

    // Create or Update Conference
    const onSubmit = (values: any) => {
        const payload = { ...values };
        payload["tenant_uuid"] = user?.tenant_detail?.uuid;
        if (id) {
            onUpdateConference(payload);
        } else {
            onCreateConference(payload);
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
            name: conferenceData?.name,
            description: conferenceData?.description,
            greeting_uuid: conferenceData?.greeting_uuid,
            pin: conferenceData?.pin,
            status: conferenceData?.status || "0",
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conferenceData, id]);

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

    // Create Conference & Navigate to Conference Page
    const onCreateConference = async (values: any) => {
        setLoading(true);
        try {
            const payload = { ...values };
            const res: any = await dispatch(conferenceCreate(payload)).unwrap();
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
            console.error("Create Conference Err --->", e?.message);
        }
    };

    // Update Conference & Navigate to Conference Page
    const onUpdateConference = async (values: any) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                id,
            };
            const res: any = await dispatch(conferenceUpdate(payload)).unwrap();
            if (res?.statusCode === 200) {
                router.back();
                Success(res.data);
                resetForm();
                dispatch(updateSingleConferenceData({}));
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Update Conference Err --->", e?.message);
        }
    };

    return (
        <CardForm
            id={id}
            name="cf"
            managerName={managerName}
            length={id ? 0 : conference?.count}
            title={id ? "Edit Conference" : "Create Conference"}
            loading={loading}
            handleSubmit={handleSubmit}
            onDoneClick={handleSubmit}
            onCancelClick={() => {
                resetForm();
                router.back();
                id && dispatch(updateSingleConferenceData({}));
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
                <Input
                    type="number"
                    name="pin"
                    label="Pin"
                    icon="Pin"
                    placeholder="Enter Pin"
                    value={values.pin}
                    touched={touched}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInfo
                />
                <Select
                    name="greeting_uuid"
                    label={
                        <>
                            Welcome Prompt <span className="text-red-500">*</span>
                        </>
                    }
                    icon="WelcomePrompt"
                    placeholder="Select Welcome Prompt"
                    removable
                    isAdd
                    createName="Create Audio Prompts"
                    createPath={
                        managerName
                            ? "/manager-conference/audio-prompts/create"
                            : "/tenant-conference/audio-prompts/create"
                    }
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
                <Switch
                    className="pt-[2px]"
                    switchButtonClass="py-1.5"
                    label="Status"
                    value={values.status}
                    onClick={(value: string) => setFieldValue("status", value)}
                />
            </div>
        </CardForm>
    );
};

export default CreateEditConferenceForm;
