"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

// PROJECT IMPORT
import {
    promptsCreate,
    usePropmts,
} from "@/redux/slice/tenant-admin/promptsSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useAuth } from "@/contexts/hooks/useAuth";
import { Danger, Success } from "@/redux/services/toasterServices";
import { CardForm, Loader } from "@/components/ui-components";
import { Input } from "@/components/forms";
import { FilePicker } from "@/components/pickers";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// TYPES IMPORT
import { InitialValueType } from "@/types/tenant-admin/promptsTypes";
import { ManagerNameTypes } from "@/types/formTypes";

const PromptsCreateForm = (props: ManagerNameTypes) => {
    const { managerName = "" } = props;
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { user } = useAuth();
    const prompts = usePropmts();

    const [loading, setLoading] = useState<boolean>(false);

    const initialValues: InitialValueType = {
        name: "",
        user_uuid: "",
        file: "",
    };

    const validationSchema = Yup.object<InitialValueType>({
        name: Yup.string().required("Please enter your name"),
        file: Yup.string().required("Please choose your file"),
    });

    // Create Audio Prompts
    const onSubmit = (values: any) => {
        const payload = new FormData();
        payload.append("name", values?.name);
        payload.append("user_uuid", "");
        payload.append("status", "0");
        payload.append("file", values.file);
        payload.append("tenant_uuid", user?.tenant_detail?.uuid);
        onCreatePrompt(payload);
    };

    const {
        values,
        touched,
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
    } = useFormik({
        initialValues,
        validationSchema,
        onSubmit,
    });

    // Create Audio Promts & Navigate to Audio Promts Page
    const onCreatePrompt = async (values: any) => {
        setLoading(true);
        try {
            const res: any = await dispatch(promptsCreate(values)).unwrap();
            if (res?.statusCode === 201) {
                Success(res.data);
                router.back();
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Create Prompt Err --->", e?.message);
        }
    };

    return (
        <CardForm
            name="prompts"
            managerName={managerName}
            length={prompts?.count}
            title="Create Audio Prompt"
            loading={loading}
            handleSubmit={handleSubmit}
            onDoneClick={handleSubmit}
            onCancelClick={() => {
                router.back();
            }}
        >
            {loading ? (
                <Loader />
            ) : (
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
                    <FilePicker
                        name="file"
                        label="Select File"
                        placeholder="Choose file to import"
                        value={values.file}
                        touched={touched}
                        errors={errors}
                        onChange={(value: any) => {
                            setFieldValue("file", value);
                        }}
                        onBlur={handleBlur}
                        isInfo
                    />
                </div>
            )}
        </CardForm>
    );
};

export default PromptsCreateForm;
