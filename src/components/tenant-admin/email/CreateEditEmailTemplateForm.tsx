"use client";
import { useLayoutEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

// PROJECT IMPORTS
import { useAppDispatch } from "@/redux/hooks";
import {
    emailTemplateCreate,
    emailTemplateUpdate,
    useSingleTemplateData,
} from "@/redux/slice/tenant-admin/emailSlice";
import { Danger, Success } from "@/redux/services/toasterServices";
import { Input, Textarea } from "@/components/forms";
import { CardForm } from "@/components/ui-components";

// THIRD - PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

const tags = [
    { tag: "[FIRSTNAME]", description: "First Name" },
    { tag: "[LASTNAME]", description: "Last Name" },
    { tag: "[ADDRESS]", description: "Address" },
    { tag: "[CITY]", description: "City" },
    { tag: "[PROVINCE]", description: "Province" },
    { tag: "[DOB]", description: "Date Of Birth" },
    { tag: "[PHONECODE]", description: "Phone Code" },
    { tag: "[ALTPHONE]", description: "Alternate Phone Number" },
    { tag: "[EMAIL]", description: "Email" },
    { tag: "[GENDER]", description: "Gender" },
    { tag: "[COMMENT]", description: "Comment" },
    { tag: "[POSTALCODE]", description: "Postal Code" },
    { tag: "[TABLE]", description: "Exhaustion Summary Table" },
    { tag: "[CURRENT_DATE]", description: "Current Date (YYYY-MM-DD)" },
    { tag: "[DATE]", description: "Today's Date (YYYY-MM-DD)" },
    { tag: "[REPORT_NAME]", description: "Scheduled Report Name" },
    { tag: "[START_DATE]", description: "Report Start Date" },
    { tag: "[END_DATE]", description: "Report End Date" },
    { tag: "[TOTAL_CALLS]", description: "Total Calls (Count)" },
    { tag: "[CONNECTED_CALLS]", description: "Connected Calls (Count)" },
    { tag: "[NOT_CONNECTED_CALLS]", description: "Not Connected Calls (Outbound Unanswered)" },
    { tag: "[MISSED_CALLS]", description: "Missed Calls (Inbound Unanswered)" },
    { tag: "[ABANDONED_CALLS]", description: "Abandoned Calls (Inbound Dropped)" },
    { tag: "[AGENT_WISE_TABLE]", description: "Agent Wise Summary Table" },
    { tag: "[QUEUE_WISE_TABLE]", description: "Queue Wise Summary Table" },
];

const CreateEditEmailTemplateForm = () => {
    const { id }: any = useParams();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const getSingleTemplate = useSingleTemplateData();

    const [loading, setLoading] = useState<boolean>(false);

    const initialValues = {
        name: "",
        subject: "",
        body: "",
        status: "1",
    };

    const validationSchema = Yup.object({
        name: Yup.string().required("Name is required"),
        subject: Yup.string().required("Subject is required"),
        body: Yup.string().required("Body is required"),
    });

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                if (id) {
                    await dispatch(emailTemplateUpdate({ id, ...values })).unwrap();
                    Success("Template Updated Successfully");
                } else {
                    await dispatch(emailTemplateCreate(values)).unwrap();
                    Success("Template Created Successfully");
                }
                router.push("/tenant-email-templates");
            } catch (err: any) {
                Danger(err?.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        },
    });

    useLayoutEffect(() => {
        if (id && getSingleTemplate) {
            formik.setValues({
                name: getSingleTemplate.name || "",
                subject: getSingleTemplate.subject || "",
                body: getSingleTemplate.body || "",
                status: getSingleTemplate.status || "1",
            });
        }
    }, [id, getSingleTemplate]);

    return (
        <CardForm
            title={id ? "Edit Email Template" : "Create Email Template"}
            onCancelClick={() => router.push("/tenant-email-templates")}
            handleSubmit={formik.handleSubmit}
            onDoneClick={formik.handleSubmit}
            loading={loading}
        >
            <div className="max-w-3xl mx-auto">
                <div className="grid grid-cols-1 gap-5">
                    <Input
                        label="Name"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        touched={formik.touched}
                        errors={formik.errors}
                    />
                    <Input
                        label="Subject"
                        name="subject"
                        value={formik.values.subject}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        touched={formik.touched}
                        errors={formik.errors}
                    />
                    <Textarea
                        label="Body"
                        name="body"
                        rows={10}
                        value={formik.values.body}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        touched={formik.touched}
                        errors={formik.errors}
                    />
                </div>
            </div>

            <div className="max-w-3xl mx-auto mt-8 border-t pt-5">
                <h3 className="text-sm font-semibold mb-4 text-slate-700">Available Tags</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2">
                    <div className="overflow-hidden border rounded-lg">
                        <table className="w-full text-xs text-left">
                            <thead className="bg-slate-50 border-b">
                                <tr>
                                    <th className="px-4 py-2 font-semibold">Tag</th>
                                    <th className="px-4 py-2 font-semibold">Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tags.slice(0, Math.ceil(tags.length / 2)).map((item, index) => (
                                    <tr key={index} className="border-b last:border-0 hover:bg-slate-50">
                                        <td className="px-4 py-2 font-mono text-primary">{item.tag}</td>
                                        <td className="px-4 py-2 text-slate-600">{item.description}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="overflow-hidden border rounded-lg">
                        <table className="w-full text-xs text-left">
                            <thead className="bg-slate-50 border-b">
                                <tr>
                                    <th className="px-4 py-2 font-semibold">Tag</th>
                                    <th className="px-4 py-2 font-semibold">Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tags.slice(Math.ceil(tags.length / 2)).map((item, index) => (
                                    <tr key={index} className="border-b last:border-0 hover:bg-slate-50">
                                        <td className="px-4 py-2 font-mono text-primary">{item.tag}</td>
                                        <td className="px-4 py-2 text-slate-600">{item.description}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </CardForm>
    );
};

export default CreateEditEmailTemplateForm;
