"use client";
import { useLayoutEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

// PROJECT IMPORTS
import { useAppDispatch } from "@/redux/hooks";
import {
    apiConfigCreate,
    apiConfigUpdate,
    useSingleApiConfigData
} from "@/redux/slice/tenant-admin/apiConfigurationSlice";
import { Danger, Success } from "@/redux/services/toasterServices";
import { Input, Button } from "@/components/forms";
import { CardForm } from "@/components/ui-components";

// THIRD - PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

const CreateEditApiConfigForm = () => {
    const { id }: any = useParams();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const getSingleConfig = useSingleApiConfigData();

    const [loading, setLoading] = useState<boolean>(false);

    const initialValues = {
        name: "",
        templateId: "",
        fromEmail: "",
        baseUrl: "",
        attachmentFileName: "",
        attachmentFileUrl: "",
        variables: "",
    };

    const validationSchema = Yup.object({
        name: Yup.string().required("API Name is required"),
        templateId: Yup.string().required("Template ID is required"),
        fromEmail: Yup.string().email("Invalid email").required("From Email is required"),
        baseUrl: Yup.string().url("Must be a valid URL").required("API Base URL is required"),
        attachmentFileUrl: Yup.string().url("Must be a valid URL"),
    });

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const formattedValues = {
                    ...values,
                    variables: values.variables
                        ? values.variables.split(',').map((v) => v.trim()).filter(v => v)
                        : []
                };

                if (id) {
                    await dispatch(apiConfigUpdate({ id, ...formattedValues })).unwrap();
                    Success("API Configuration Updated Successfully");
                } else {
                    await dispatch(apiConfigCreate(formattedValues)).unwrap();
                    Success("API Configuration Created Successfully");
                }
                router.push("/tenant-email-configs"); // Go back to the list (API Config tab)
            } catch (err: any) {
                Danger(err?.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        },
    });

    useLayoutEffect(() => {
        if (id && getSingleConfig && getSingleConfig.uuid === id) {
            formik.setValues({
                name: getSingleConfig.name || "",
                templateId: getSingleConfig.templateId || "",
                fromEmail: getSingleConfig.fromEmail || "",
                baseUrl: getSingleConfig.baseUrl || "https://netcore.onefin.app/api/netcore/email",
                attachmentFileName: getSingleConfig.attachmentFileName || "",
                attachmentFileUrl: getSingleConfig.attachmentFileUrl || "",
                variables: Array.isArray(getSingleConfig.variables) 
                    ? getSingleConfig.variables.join(", ") 
                    : "",
            });
        }
    }, [id, getSingleConfig]);

    return (
        <CardForm
            title={id ? "Edit API Configuration" : "Create API Configuration"}
            onCancelClick={() => router.push("/tenant-email-configs")}
            handleSubmit={formik.handleSubmit}
            onDoneClick={formik.handleSubmit}
            loading={loading}
        >
            <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1 md:col-span-2">
                    <Input
                        label="API Name"
                        name="name"
                        required
                        autoComplete="none"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        touched={formik.touched}
                        errors={formik.errors}
                    />
                    <p className="text-[10px] text-gray-400 pl-1">
                      Example: <span className="font-semibold text-gray-500">Test Api Configuration</span>
                    </p>
                </div>
                <div className="flex flex-col gap-1 md:col-span-2">
                    <Input
                        label="API Base URL"
                        name="baseUrl"
                        required
                        autoComplete="none"
                        placeholder="https://test/email.."
                        value={formik.values.baseUrl}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        touched={formik.touched}
                        errors={formik.errors}
                    />
                    <p className="text-[10px] text-gray-400 pl-1">
                      Fallback: <span className="font-semibold text-gray-500">https://test/email...</span>
                    </p>
                </div>
                <div className="flex flex-col gap-1">
                    <Input
                        label="Template ID"
                        name="templateId"
                        required
                        autoComplete="none"
                        placeholder="e.g. 225:Send ITR Mail, 222:Send Documents"
                        value={formik.values.templateId}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        touched={formik.touched}
                        errors={formik.errors}
                    />
                    <p className="text-[10px] text-gray-400 pl-1">
                      Format: <span className="font-semibold text-gray-500">225:Test Template1 Mail, 222:Tes Template2 Documents</span>
                    </p>
                </div>
                <div className="flex flex-col gap-1">
                    <Input
                        label="From Email"
                        name="fromEmail"
                        required
                        autoComplete="none"
                        placeholder="care@1finance.co.in"
                        value={formik.values.fromEmail}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        touched={formik.touched}
                        errors={formik.errors}
                    />
                    <p className="text-[10px] text-gray-400 pl-1">
                      Example: <span className="font-semibold text-gray-500">test@gmail.com</span>
                    </p>
                </div>
                <div className="flex flex-col gap-1">
                    <Input
                        label="Attachment File Name"
                        name="attachmentFileName"
                        autoComplete="none"
                        placeholder="Documents.pdf"
                        value={formik.values.attachmentFileName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        touched={formik.touched}
                        errors={formik.errors}
                    />
                    <p className="text-[10px] text-gray-400 pl-1">
                      Example: <span className="font-semibold text-gray-500">Documents.pdf</span> (Optional)
                    </p>
                </div>
                <div className="flex flex-col gap-1">
                    <Input
                        label="Attachment File URL"
                        name="attachmentFileUrl"
                        autoComplete="none"
                        placeholder="https://example.com/file.pdf"
                        value={formik.values.attachmentFileUrl}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        touched={formik.touched}
                        errors={formik.errors}
                    />
                    <p className="text-[10px] text-gray-400 pl-1">
                      Example: <span className="font-semibold text-gray-500">https://example.com/file.pdf</span> (Optional)
                    </p>
                </div>
                <div className="flex flex-col gap-1 md:col-span-2">
                    <Input
                        label="Variables (comma-separated)"
                        name="variables"
                        autoComplete="none"
                        placeholder="e.g. $username, $email"
                        value={formik.values.variables}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        touched={formik.touched}
                        errors={formik.errors}
                    />
                    <p className="text-[10px] text-gray-400 pl-1">
                      Use: <span className="font-semibold text-gray-500">$username</span> for first name, <span className="font-semibold text-gray-500">$email</span> for email.
                    </p>
                </div>
            </div>
        </CardForm>
    );
};

export default CreateEditApiConfigForm;
