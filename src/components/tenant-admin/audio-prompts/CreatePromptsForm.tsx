"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

// PROJECT IMPORT
import {
    promptsCreate,
    usePropmts,
    useSinglePrompt,
    promptsGetById,
    promptsUpdate

} from "@/redux/slice/tenant-admin/promptsSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useAuth } from "@/contexts/hooks/useAuth";
import { Danger, Success } from "@/redux/services/toasterServices";
import { CardForm, Loader } from "@/components/ui-components";
import { Input, Select } from "@/components/forms";
import { FilePicker } from "@/components/pickers";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// TYPES IMPORT
import { InitialValueType } from "@/types/tenant-admin/promptsTypes";
import { ManagerNameTypes } from "@/types/formTypes";

const CreatePromptsForm = (props: ManagerNameTypes) => {
    const { managerName = "" } = props;
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { user } = useAuth();
    const prompts = usePropmts();

    const [loading, setLoading] = useState<boolean>(false);
    const [existingFile, setExistingFile] = useState<string | null>(null);

    const { id } = useParams();
    console.log("idd", id)
    const isEdit = !!id;
    console.log("isedit", isEdit)
    const single = useSinglePrompt();
    console.log("Single", single)



    useEffect(() => {
        if (isEdit) dispatch(promptsGetById(id));
    }, [id]);



    useEffect(() => {
        if (isEdit && single?.data) {
            setFieldValue("name", single.data.name);
            setExistingFile(single.data.file);
        }
    }, [single]);


    // useEffect(() => {
    //     if (isEdit && single) setFieldValue("name", single?.data?.name);
    // }, [single]);


    const initialValues: InitialValueType = {
        // name: "",
        name: isEdit ? single?.data?.name : "",
        user_uuid: "",
        file: ""
    };

    const validationSchema = Yup.object<InitialValueType>({
        name: Yup.string().required("Please Enter Your Name"),
        file: isEdit
            ? Yup.mixed().notRequired()
            : Yup.mixed().required("Please Choose Your File"),
    });

    // Create Audio Prompts
    const onSubmit = (values: any) => {
        const payload = new FormData();
        payload.append("name", values?.name);
        payload.append("user_uuid", "");
        payload.append("status", "0");
        // payload.append("file", values.file);
        payload.append("role", user?.role);
        payload.append("tenant_uuid", user?.tenant_detail?.uuid);

        if (values.file instanceof File) {
            payload.append("file", values.file);
        } else {
            payload.append("file", values.file);
        }
        // onCreatePrompt(payload);
        if (isEdit) {
            onEditPrompt(payload)
        } else {
            onCreatePrompt(payload);
        }
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
        enableReinitialize: true
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



    const onEditPrompt = async (payload: FormData) => {
        setLoading(true);
        try {
            const res: any = await dispatch(
                promptsUpdate({ id, data: payload })
            ).unwrap();

            if (res?.statusCode === 200) {
                Success(res.data);
                router.back();
            } else {
                Danger(res?.data);
            }
        } catch (e: any) {
            console.error("Edit Prompt Err --->", e?.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <CardForm
            name="prompts"
            managerName={managerName}
            length={prompts?.count}
            // title="Create Audio Prompt"
            title={isEdit ? "Edit Audio Prompt" : "Create Audio Prompt"}
            loading={loading}
            handleSubmit={handleSubmit}
            onDoneClick={handleSubmit}
            onCancelClick={() => {
                router.back();
            }}
        >
            {loading ? <Loader /> : <div className="pt-5 pb-10 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4 ">
                <Input
                    name="name"
                    label={
                        <>
                            Name
                            {!isEdit && <span className="text-red-500">*</span>}
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
                <FilePicker
                    name="file"
                    label={
                        <>
                            Select File
                            {!isEdit && <span className="text-red-500">*</span>}
                        </>
                    }
                    placeholder="Choose file to import"
                    // value={values.file}
                    value={
                        values.file
                            ? values.file
                            : isEdit && existingFile
                                ? existingFile   
                                : ""
                    }
                    touched={touched}
                    errors={errors}
                    onChange={(value: any) => {
                        setFieldValue("file", value);
                    }}
                    onBlur={handleBlur}
                    isInfo
                />
            </div>}
        </CardForm>
    );
};

export default CreatePromptsForm;
