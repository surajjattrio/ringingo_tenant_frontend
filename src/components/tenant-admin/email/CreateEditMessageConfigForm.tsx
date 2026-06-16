"use client";
import { useLayoutEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";

// PROJECT IMPORTS
import { useAppDispatch } from "@/redux/hooks";
import {
    messageConfigCreate,
    messageConfigUpdate,
    useSingleMessageConfigData
} from "@/redux/slice/tenant-admin/messageConfigurationSlice";
import { Danger, Success } from "@/redux/services/toasterServices";
import { Input, Button, Select, Textarea } from "@/components/forms";
import { CardForm, Icon } from "@/components/ui-components";

// THIRD - PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

const CreateEditMessageConfigFormContent = () => {
    const { id }: any = useParams();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const getSingleConfig = useSingleMessageConfigData();

    const [loading, setLoading] = useState<boolean>(false);

    const initialValues = {
        name: "",
        baseUrl: "",
        method: "POST",
        headers: [] as { key: string; value: string }[],
        body: "",
    };

    const validationSchema = Yup.object({
        name: Yup.string().required("Message Name is required"),
        method: Yup.string().required("HTTP Method is required"),
        baseUrl: Yup.string().url("Must be a valid URL").required("Message Base URL is required"),
        body: Yup.string().test("is-json", "Must be a valid JSON string", (value) => {
            if (!value) return true;
            try {
                JSON.parse(value);
                return true;
            } catch (e) {
                return false;
            }
        }).nullable(),
    });

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const formattedValues = {
                    ...values,
                };

                if (id) {
                    await dispatch(messageConfigUpdate({ id, ...formattedValues })).unwrap();
                    Success("Message Configuration Updated Successfully");
                } else {
                    await dispatch(messageConfigCreate(formattedValues)).unwrap();
                    Success("Message Configuration Created Successfully");
                }
                router.push("/tenant-email-configs?tab=message_config");
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
                baseUrl: getSingleConfig.baseUrl || "",
                method: getSingleConfig.method || "POST",
                headers: getSingleConfig.headers && getSingleConfig.headers.length > 0 
                    ? getSingleConfig.headers 
                    : [],
                body: getSingleConfig.body || "",
            });
        }
    }, [id, getSingleConfig]);

    const addHeader = () => {
        formik.setFieldValue("headers", [...formik.values.headers, { key: "", value: "" }]);
    };

    const removeHeader = (index: number) => {
        const newHeaders = [...formik.values.headers];
        newHeaders.splice(index, 1);
        formik.setFieldValue("headers", newHeaders);
    };

    const handleHeaderChange = (index: number, field: "key" | "value", val: string) => {
        const newHeaders = [...formik.values.headers];
        newHeaders[index][field] = val;
        formik.setFieldValue("headers", newHeaders);
    };

    return (
        <CardForm
            title={id ? "Edit Message Configuration" : "Create Message Configuration"}
            onCancelClick={() => router.push("/tenant-email-configs?tab=message_config")}
            handleSubmit={formik.handleSubmit}
            onDoneClick={formik.handleSubmit}
            loading={loading}
        >
            <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1 md:col-span-2">
                    <Input
                        label="Message Name"
                        name="name"
                        autoComplete="none"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        touched={formik.touched}
                        errors={formik.errors}
                    />
                    <p className="text-[10px] text-gray-400 pl-1">
                      Example: <span className="font-semibold text-gray-500">Test Message Configuration</span>
                    </p>
                </div>
                <div className="flex flex-col gap-1">
                    <Select
                        label="HTTP Method"
                        name="method"
                        options={[
                            { label: "GET", value: "GET" },
                            { label: "POST", value: "POST" },
                            { label: "PUT", value: "PUT" },
                            { label: "PATCH", value: "PATCH" },
                            { label: "DELETE", value: "DELETE" }
                        ]}
                        value={formik.values.method}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        touched={formik.touched}
                        errors={formik.errors}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <Input
                        label="Message Base URL"
                        name="baseUrl"
                        autoComplete="none"
                        placeholder="https://test/sms.."
                        value={formik.values.baseUrl}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        touched={formik.touched}
                        errors={formik.errors}
                    />
                    <p className="text-[10px] text-gray-400 pl-1">
                      Fallback: <span className="font-semibold text-gray-500">https://test/sms...</span>
                    </p>
                </div>
                <div className="flex flex-col gap-3 md:col-span-2 mt-2 border-t pt-4">
                    <div className="flex justify-between items-center">
                        <label className="text-xs font-semibold text-dark-400">Request Headers</label>
                        <button
                            type="button"
                            onClick={addHeader}
                            className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
                        >
                            <Icon name="Plus" width={14} height={14} /> Add Header
                        </button>
                    </div>
                    {formik.values.headers.map((header: any, index: number) => (
                        <div key={index} className="flex gap-4 items-center">
                            <Input
                                placeholder="Header Key (e.g. Authorization)"
                                name={`headers.${index}.key`}
                                value={header.key}
                                onChange={(e: any) => handleHeaderChange(index, "key", e.target.value)}
                                isShowLabel={false}
                                touched={{ [`headers.${index}.key`]: (formik.touched.headers?.[index] as any)?.key }}
                                errors={{ [`headers.${index}.key`]: (formik.errors.headers?.[index] as any)?.key }}
                            />
                            <Input
                                placeholder="Header Value (e.g. Basic cG10...)"
                                name={`headers.${index}.value`}
                                value={header.value}
                                onChange={(e: any) => handleHeaderChange(index, "value", e.target.value)}
                                isShowLabel={false}
                                touched={{ [`headers.${index}.value`]: (formik.touched.headers?.[index] as any)?.value }}
                                errors={{ [`headers.${index}.value`]: (formik.errors.headers?.[index] as any)?.value }}
                            />
                            {formik.values.headers.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeHeader(index)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                                >
                                    <Icon name="Delete" width={16} height={16} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                {formik.values.method !== "GET" && formik.values.method !== "DELETE" && (
                    <div className="flex flex-col gap-1 md:col-span-2 mt-2">
                        <Textarea
                            label="Request Body (JSON)"
                            name="body"
                            rows={6}
                            placeholder={
                                '{\n  "phoneNumber": "$phone_number",\n  "templateName": "incometaxfilingonboardingupdate",\n  "bodyValues": ["$first_name"]\n}'
                            }
                            value={formik.values.body}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            touched={formik.touched}
                            errors={formik.errors}
                        />
                        <p className="text-[10px] text-gray-400 pl-1">
                          Provide a valid JSON payload. You can use lead variables like <span className="font-semibold text-gray-500">$phone_number</span> or <span className="font-semibold text-gray-500">$first_name</span>.
                        </p>
                    </div>
                )}
            </div>
        </CardForm>
    );
};

const CreateEditMessageConfigForm = () => {
    return (
        <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
            <CreateEditMessageConfigFormContent />
        </Suspense>
    );
};

export default CreateEditMessageConfigForm;
