"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

// PROJECT IMPORT
import { CardForm } from "@/components/ui-components";
import { Input, Select } from "@/components/forms";
import { TimePicker, DatePicker } from "@/components/pickers";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import { Danger, Success } from "@/redux/services/toasterServices";
import { ManagerNameTypes } from "@/types/formTypes";
import { useAppDispatch } from "@/redux/hooks";
import { mailScheduleCreate, mailScheduleUpdate } from "@/redux/slice/tenant-admin/mailScheduleSlice";
import { getMailSchedule } from "@/redux/services/tenant-admin/mailScheduleServices";
import { emailConfigsGet, useEmailConfigs } from "@/redux/slice/tenant-admin/emailSlice";

const reportNameOptions = [
    { label: "CDR Report", value: "cdr" },
    { label: "User Performance", value: "user_performance" },
    { label: "Login Logout Report", value: "login_logout" },
];

const CreateEditMailScheduleForm = (props: ManagerNameTypes) => {
    const { managerName = "" } = props;
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState<boolean>(false);

    const emailConfigs = useEmailConfigs();

    useEffect(() => {
        dispatch(emailConfigsGet({ limit: 1000 }));
    }, [dispatch]);

    const smtpOptions = emailConfigs?.data?.map((val: any) => ({
        label: val?.name,
        value: val?.uuid,
    })) || [];

    const initialValues = {
        name: "",
        report_type: [] as string[],
        startDate: null,
        endDate: null,
        timing: "",
        email_config_uuid: "",
    };

    const validationSchema = Yup.object({
        name: Yup.string().required("Please Enter Name"),
        report_type: Yup.array().min(1, "Please Select Report Name").required("Please Select Report Name"),
        startDate: Yup.date().nullable().required("Please Select Start Date"),
        endDate: Yup.date().nullable().required("Please Select End Date"),
        timing: Yup.string().required("Please Select Timing"),
        email_config_uuid: Yup.string().optional(),
    });

    const onSubmit = async (values: any) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                report_type: Array.isArray(values.report_type) ? values.report_type.join(",") : values.report_type,
            };
            if (id) {
                await dispatch(mailScheduleUpdate({ uuid: id as string, payload: payload })).unwrap();
                Success("Mail Schedule Updated");
            } else {
                await dispatch(mailScheduleCreate(payload)).unwrap();
                Success("Mail Schedule Created");
            }
            router.back();
        } catch (e: any) {
            Danger(e?.message || "Something went wrong");
            console.error("Create Mail Schedule Err --->", e?.message);
        } finally {
            setLoading(false);
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
    });

    useEffect(() => {
        if (id) {
            setLoading(true);
            getMailSchedule(id as string)
                .then((res: any) => {
                    const data = res?.data;
                    if (data) {
                        setFieldValue("name", data.name);
                        setFieldValue("report_type", data.report_type ? data.report_type.split(",") : []);
                        setFieldValue("startDate", data.startDate ? new Date(data.startDate) : null);
                        setFieldValue("endDate", data.endDate ? new Date(data.endDate) : null);
                        setFieldValue("timing", data.timing);
                        setFieldValue("email_config_uuid", data.email_config_uuid || "");
                    }
                })
                .catch((err) => {
                    Danger("Failed to fetch mail schedule details");
                    console.error(err);
                })
                .finally(() => setLoading(false));
        }
    }, [id]);

    return (
        <CardForm
            id={id as string}
            name="mail_schedule"
            managerName={managerName}
            length={id ? 0 : 1}
            title={id ? "Edit Mail Schedule" : "Create Mail Schedule"}
            loading={loading}
            handleSubmit={handleSubmit}
            onDoneClick={handleSubmit}
            onCancelClick={() => {
                router.back();
            }}
        >
            <div className="pt-5 pb-10 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4 px-4">
                <Input
                    name="name"
                    label={<> Name <span className="text-red-500">*</span> </>}
                    placeholder="Enter Name"
                    value={values.name}
                    touched={touched}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInfo
                />
                <Select
                    name="report_type"
                    label={<> Report Name <span className="text-red-500">*</span> </>}
                    placeholder="Select Report Name"
                    options={reportNameOptions}
                    value={values.report_type}
                    touched={touched}
                    errors={errors}
                    onChange={(selectedValues: any) => {
                        setFieldValue("report_type", selectedValues);
                    }}
                    onBlur={handleBlur}
                    isMulti={true}
                    isInfo
                />
                <Select
                    name="email_config_uuid"
                    label="SMTP Configuration"
                    placeholder="Select SMTP Configuration"
                    options={smtpOptions}
                    value={values.email_config_uuid}
                    touched={touched}
                    errors={errors}
                    onChange={(e: any) => {
                        setFieldValue("email_config_uuid", e.target.value);
                    }}
                    onBlur={handleBlur}
                    isInfo
                />
                <TimePicker
                    name="timing"
                    isShowLabel={false}
                    placeholder="Timing *"
                    value={values.timing ? moment(values.timing, "HH:mm") : undefined}
                    onChange={(hour: string, minute: string) => {
                        setFieldValue("timing", `${hour}:${minute}`);
                    }}
                />
                <DatePicker
                    name="startDate"
                    label="Start Date"
                    value={values.startDate}
                    onChange={(date: any) => setFieldValue("startDate", date)}
                    touched={touched}
                    errors={errors}
                    dateFormat="yyyy-MM-dd"
                    isInfo
                />
                <DatePicker
                    name="endDate"
                    label="End Date"
                    value={values.endDate}
                    onChange={(date: any) => setFieldValue("endDate", date)}
                    touched={touched}
                    errors={errors}
                    dateFormat="yyyy-MM-dd"
                    isInfo
                />
            </div>
        </CardForm>
    );
};

export default CreateEditMailScheduleForm;
