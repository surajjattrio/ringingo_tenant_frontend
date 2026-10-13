"use client";
import { useLayoutEffect, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

// PROJECT IMPORTS
import { useAppDispatch } from "@/redux/hooks";
import {
    emailConfigCreate,
    emailConfigUpdate,
    emailConfigTest,
    useSingleConfigData,
    emailTemplatesGet,
    useEmailTemplates,
} from "@/redux/slice/tenant-admin/emailSlice";
import { Danger, Success } from "@/redux/services/toasterServices";
import { Input, Password, MultiSelect, Button } from "@/components/forms";
import { CardForm, Icon } from "@/components/ui-components";

// THIRD - PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

const CreateEditEmailConfigForm = () => {
    const { id }: any = useParams();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const getSingleConfig = useSingleConfigData();
    const templates = useEmailTemplates();

    const [loading, setLoading] = useState<boolean>(false);
    const [testLoading, setTestLoading] = useState<boolean>(false);

    useEffect(() => {
        dispatch(emailTemplatesGet({ limit: 1000 }));
    }, []);

    const templateOptions = templates?.data?.map((t: any) => ({
        value: t.uuid,
        label: t.name
    })) || [];

    // Auto-select first template for testing if it's a new config


    const initialValues = {
        name: "",
        host: "",
        port: "",
        username: "",
        password: "",
        from_email: "",
        template_ids: [],
        to: "",
        cc: "",
        bcc: "",
    };

    const validationSchema = Yup.object({
        name: Yup.string().required("Name is required"),
        host: Yup.string().required("SMTP Host is required"),
        port: Yup.number().required("SMTP Port is required").typeError("Must be a number"),
        username: Yup.string().email("Invalid email").required("Email Address is required"),
        password: Yup.string().required("Password is required"),
        template_ids: Yup.array().min(1, "Select at least one template").required("Templates are required"),
        to: Yup.string().optional(),
        cc: Yup.string().optional(),
        bcc: Yup.string().optional(),
    });

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                // Map template_ids and use username as from_email
                const payload = {
                    ...values,
                    from: values.username,
                    template_ids: values.template_ids.map((t: any) => t.value || t),
                    //to: values.to ? values.to.split(',').map((email: string) => email.trim()).filter(Boolean) : []
                    to: values.to ? values.to.split(',').map((email: string) => email.trim()).filter(Boolean) : [],
                    cc: values.cc ? values.cc.split(',').map((email: string) => email.trim()).filter(Boolean) : [],
                    bcc: values.bcc ? values.bcc.split(',').map((email: string) => email.trim()).filter(Boolean) : [],   
                };
                delete (payload as any).from_email;

                if (id) {
                    await dispatch(emailConfigUpdate({ id, ...payload })).unwrap();
                    Success("Configuration Updated Successfully");
                } else {
                    await dispatch(emailConfigCreate(payload)).unwrap();
                    Success("Configuration Created Successfully");
                }
                router.push("/tenant-email-configs");
            } catch (err: any) {
                Danger(err?.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        },
    });

    const onTestConnection = async () => {
        // Only validate the fields needed for SMTP test
        const fieldsToValidate = ['host', 'port', 'username', 'password'];
        let hasError = false;
        
        for (const field of fieldsToValidate) {
            await formik.setFieldTouched(field, true);
            const error = await formik.validateField(field);
            if (error) hasError = true;
        }

        if (hasError) {
            Danger("Please fill in all SMTP fields correctly before testing.");
            return;
        }

        setTestLoading(true);
        try {
            const payload = {
                host: formik.values.host,
                port: formik.values.port,
                username: formik.values.username,
                password: formik.values.password,
            };
            const response:any = await dispatch(emailConfigTest(payload)).unwrap();
            Success(response?.message || "SMTP Connection Successful");
        } catch (err: any) {
            Danger(err?.message || "SMTP Connection Failed");
        } finally {
            setTestLoading(false);
        }
    };

    useLayoutEffect(() => {
        if (id && getSingleConfig) {
            // Map template_ids to the format expected by MultiSelect {value, label}
            // Prioritize populated templates if available, otherwise find them in templateOptions
            let selectedTemplates = [];
            if (getSingleConfig.templates && getSingleConfig.templates.length > 0) {
                selectedTemplates = getSingleConfig.templates.map((t: any) => ({
                    value: t.uuid,
                    label: t.name
                }));
            } else if (getSingleConfig.template_ids && getSingleConfig.template_ids.length > 0) {
                selectedTemplates = templateOptions.filter((opt: any) => 
                    getSingleConfig.template_ids.includes(opt.value)
                );
            }

            formik.setValues({
                name: getSingleConfig.name || "",
                host: getSingleConfig.host || "",
                port: getSingleConfig.port || "",
                username: getSingleConfig.username || "",
                password: getSingleConfig.password || "",
                from_email: getSingleConfig.from_email || "",
                template_ids: selectedTemplates,
                //to: getSingleConfig.to ? getSingleConfig.to.join(', ') : "",
                to: getSingleConfig.to ? (Array.isArray(getSingleConfig.to) ? getSingleConfig.to.join(', ') : getSingleConfig.to) : "",
                cc: getSingleConfig.cc ? (Array.isArray(getSingleConfig.cc) ? getSingleConfig.cc.join(', ') : getSingleConfig.cc) : "",
                bcc: getSingleConfig.bcc ? (Array.isArray(getSingleConfig.bcc) ? getSingleConfig.bcc.join(', ') : getSingleConfig.bcc) : "",
            });
        }
    }, [id, getSingleConfig, templateOptions.length]);

    return (
        <CardForm
            title={id ? "Edit Email Configuration" : "Create Email Configuration"}
            onCancelClick={() => router.push("/tenant-email-configs")}
            handleSubmit={formik.handleSubmit}
            onDoneClick={formik.handleSubmit}
            loading={loading}
            extraButtons={
                <Button
                    type="button"
                    style="secondary"
                    text="Test Connection"
                    onClick={onTestConnection}
                    loading={testLoading}
                    className="text-indigo-600 hover:text-indigo-800 font-medium px-4"
                />
            }
        >
            <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                    label="Configuration Name"
                    name="name"
                    required
                    autoComplete="none"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    touched={formik.touched}
                    errors={formik.errors}
                    className="md:col-span-2"
                />
                <Input
                    label="SMTP Host"
                    name="host"
                    required
                    autoComplete="none"
                    placeholder=""
                    value={formik.values.host}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    touched={formik.touched}
                    errors={formik.errors}
                />
                <Input
                    label="SMTP Port"
                    name="port"
                    required
                    autoComplete="none"
                    placeholder=""
                    value={formik.values.port}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    touched={formik.touched}
                    errors={formik.errors}
                />
                <Input
                    label="Email Address"
                    name="username"
                    required
                    autoComplete="none"
                    placeholder=""
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    touched={formik.touched}
                    errors={formik.errors}
                />
                <Password
                    label="Password"
                    name="password"
                    required
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    touched={formik.touched}
                    errors={formik.errors}
                />
                <div className="md:col-span-2">
                    <MultiSelect
                        label="Allowed Templates"
                        name="template_ids"
                        required
                        isMulti={true}
                        isSelectAll={true}
                        options={templateOptions}
                        value={formik.values.template_ids}
                        onChange={(value: any) => formik.setFieldValue("template_ids", value)}
                        onBlur={() => formik.setFieldTouched("template_ids", true)}
                        touched={formik.touched}
                        errors={formik.errors}
                    />
                </div>
                <div className="md:col-span-2">
                    <Input
                        label="Recipient Emails (To)"
                        name="to"
                        autoComplete="none"
                        placeholder="e.g. mohu@example.com, teja@example.com"
                        value={formik.values.to}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        touched={formik.touched}
                        errors={formik.errors}
                    />
                    <p className="text-xs text-gray-500 mt-1 ml-1">
                        Please enter multiple email addresses separated by commas (e.g. rajeev@example.com, aditya@example.com).
                    </p>
                </div>
               <div className="md:col-span-2">
                    <Input
                        label="CC Emails"
                        name="cc"
                        autoComplete="none"
                        placeholder="e.g. manager@example.com, supervisor@example.com"
                        value={formik.values.cc}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        touched={formik.touched}
                        errors={formik.errors}
                    />
                    <p className="text-xs text-gray-500 mt-1 ml-1">
                        Please enter multiple CC email addresses separated by commas.
                    </p>
                </div>
                <div className="md:col-span-2">
                    <Input
                        label="BCC Emails"
                        name="bcc"
                        autoComplete="none"
                        placeholder="e.g. audit@example.com, admin@example.com"
                        value={formik.values.bcc}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        touched={formik.touched}
                        errors={formik.errors}
                    />
                    <p className="text-xs text-gray-500 mt-1 ml-1">
                        Please enter multiple BCC email addresses separated by commas.
                    </p>
                </div>
            </div>
        </CardForm>
    );
};

export default CreateEditEmailConfigForm;
