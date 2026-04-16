"use client";
import { useLayoutEffect, useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// PROJECT IMPORT
import {
    areaCodeCreate,
    areaCodeUpdate,
    updateSingleAreaCodeData,
    areaCodeSingleGet,
    useAreaCode,
    useSingleAreaCode,
} from "@/redux/slice/tenant-admin/manageAreaCodeSlice";
import { useAppDispatch } from "@/redux/hooks";
import { CardForm } from "@/components/ui-components";
import { Input, Select, Switch, } from "@/components/forms";

// TYPES IMPORT
import { Danger, Success } from "@/redux/services/toasterServices";
import { InitialValueType } from "@/types/tenant-admin/manageAreaCodeTypes";
import { ManagerNameTypes } from "@/types/formTypes";
import { stateOptionsGet, useStateOptions } from "@/redux/slice/tenant-admin/manageStateSlice";
import { areacodeTypeOptions } from "@/config/options";
import moment from "moment";
import TimePickerWithAMPM from "@/components/pickers/TimePickerWithAMPM";
import { timezoneOptionsGet, useTimezoneOptions } from "@/redux/slice/master-admin/timezoneSlice";

const CreateEditAreaCodeForm = (props: ManagerNameTypes) => {
    const { managerName = "" } = props;
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const router = useRouter();

    const areaCode = useAreaCode();
    const areaCodeData = useSingleAreaCode();
    const stateOptions = useStateOptions();
    const timezoneOptions = useTimezoneOptions();
    const [loading, setLoading] = useState<boolean>(false);

    const initialValues: InitialValueType = {
        code: "",
        comment: "",
        type: "",
        state_id: '',
        start_time: '',
        end_time: '',
        timezone_uuid: '',
        day_light_toggle: "1",
    };

    const validationSchema = Yup.object<InitialValueType>({
        code: Yup.string().required("Please Enter Your Area Code"),
        comment: Yup.string().required("Please Enter Your Comment"),
        type: Yup.string().required("Please Select Your Type"),
        start_time: Yup.string().required("Please Select Your Start Time"),
        end_time: Yup.string().required("Please Select Your End Time"),
        state_id: Yup.string().required("Please Select Your State"),
        timezone_uuid: Yup.string().required("Please Select Your Time Zone"),
        day_light_toggle: Yup.string()
    });

    // Create or Update Area Code number
    const onSubmit = (values: any) => {
        const payload = { ...values };
        // payload["tenant_uuid"] = user?.tenant_detail?.uuid;
        if (id) {
            onUpdateAreaCode(payload);
        } else {
            onCreateAreaCode(payload);
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
            code: areaCodeData?.code || '',
            comment: areaCodeData?.comment || '',
            type: areaCodeData?.type || '',
            state_id: areaCodeData?.state_id || '',
            start_time: areaCodeData?.start_time || '',
            end_time: areaCodeData?.end_time || '',
            day_light_toggle: areaCodeData?.day_light_toggle || "1",
            timezone_uuid: areaCodeData?.timezone_uuid || ''
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [areaCodeData, id]);

    // // Fetching Single Area Code Data
    // const onGetSingleAreaCodeData = async () => {
    //     try {
    //         const res: any = await dispatch(areaCodeSingleGet(id)).unwrap();
    //         if (res?.statusCode === 200) {
    //             const areaCodeData = res?.data;
    //             setValues({
    //                 ...values,
    //                 code: areaCodeData?.code,
    //                 comment: areaCodeData?.comment,
    //             });
    //         }
    //     } catch (err) {
    //         console.error("Get Single Area Code Data Err =-=>", err);
    //     }
    // };

    // Create Area Code & Navigate to Area Code  Page
    const onCreateAreaCode = async (values: any) => {
        setLoading(true);
        try {
            const payload = { ...values };
            const res: any = await dispatch(areaCodeCreate(payload)).unwrap();
            if (res?.statusCode === 201) {
                Success(res.data);
                resetForm();
                router.back();
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Create Area Code Err --->", e?.message);
        }
    };

    // Update Area Code & Navigate to Area Code  Page
    const onUpdateAreaCode = async (values: any) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                id,
            };
            const res: any = await dispatch(areaCodeUpdate(payload)).unwrap();
            if (res?.statusCode === 200) {
                Success(res.data);
                resetForm();
                router.back();
                dispatch(updateSingleAreaCodeData({}));
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Update Area Code Err --->", e?.message);
        }
    };
    // Fetching State Options
    const onGetStateOptions = async () => {
        try {
            await dispatch(stateOptionsGet()).unwrap();
        } catch (err) {
            console.error("Get State Options Err =-=>", err);
        }
    };
    useEffect(() => {
        onGetStateOptions();
        onGetTimeZonesOptions();
    }, []);

    // Fetching Time Zones Options
    const onGetTimeZonesOptions = async () => {
        try {
            await dispatch(timezoneOptionsGet()).unwrap();
        } catch (e: any) {
            console.error("Get TimeZones Data Err --->", e?.message);
        }
    };

    return (
        <CardForm
            id={id}
            managerName={managerName}
            name="areaCode"
            length={id ? 0 : areaCode?.count}
            title={id ? "Edit Area Code" : "Create Area Code"}
            loading={loading}
            handleSubmit={handleSubmit}
            onDoneClick={handleSubmit}
            onCancelClick={() => {
                resetForm();
                router.back();
                id && dispatch(updateSingleAreaCodeData({}));
            }}
        >
            <div className="pt-5 pb-10 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4 px-4">
                <Input
                    type="text"
                    name="code"
                    label={
                        <>
                            Area Code <span className="text-red-500">*</span>
                        </>
                    }
                    icon="AreaCode"
                    placeholder="Enter Area Code"
                    value={values.code}
                    touched={touched}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInfo
                />
                <Input
                    type="text"
                    name="comment"
                    label={
                        <>
                            Comment <span className="text-red-500">*</span>
                        </>
                    }
                    icon="Comment"
                    placeholder="Enter Comment"
                    value={values.comment}
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
                    placeholder="Select Area Code Type"
                    removable
                    options={areacodeTypeOptions}
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
                    name="state_id"
                    label={
                        <>
                            State Code <span className="text-red-500">*</span>
                        </>
                    }
                    icon="Code"
                    placeholder="Select State Code"
                    removable
                    options={stateOptions}
                    value={values.state_id}
                    touched={touched}
                    errors={errors}
                    onChange={(e: any) => {
                        setFieldValue("state_id", e.target.value);
                    }}
                    onBlur={handleBlur}
                    isInfo
                />
                <TimePickerWithAMPM
                    label={
                        <>
                            Start Time <span className="text-red-500">*</span>
                        </>
                    }
                    
                    name="start_time"
                    placeholder="Select Start time"
                    value={values.start_time ? moment(values.start_time, "hh:mm A") : null}
                    touched={touched}
                    errors={errors}
                    onChange={(start_hour: any, start_minute: any, period: any) => {
                        const timeString = moment()
                            .set("hour", period === "PM" && start_hour < 12 ? start_hour + 12 : period === "AM" && start_hour === 12 ? 0 : start_hour)
                            .set("minute", start_minute)
                            .format("hh:mm A");
                        setFieldValue("start_time", timeString);
                    }}
                    isInfo
                />
                <TimePickerWithAMPM
                    label={
                        <>
                            End Time <span className="text-red-500">*</span>
                        </>
                    }
                    name="end_time"
                    placeholder="Select End time"
                    value={values.end_time ? moment(values.end_time, "hh:mm A") : null}
                    touched={touched}
                    errors={errors}
                    onChange={(end_hour: any, end_minute: any, period: any) => {
                        const timeString = moment()
                            .set("hour", period === "PM" && end_hour < 12 ? end_hour + 12 : period === "AM" && end_hour === 12 ? 0 : end_hour)
                            .set("minute", end_minute)
                            .format("hh:mm A");
                        setFieldValue("end_time", timeString);
                    }}
                    isInfo
                />
                <Select
                    name="timezone_uuid"
                    label={
                        <>
                            Time Zone <span className="text-red-500">*</span>
                        </>
                    }
                    placeholder="Select Time Zone"
                    options={timezoneOptions}
                    icon="ZoneTime"
                    value={values.timezone_uuid}
                    touched={touched}
                    errors={errors}
                    removable
                    onChange={(e: any) => {
                        setFieldValue("timezone_uuid", e.target.value);
                    }}
                    onBlur={handleBlur}
                    isInfo
                />
                <Switch
                    label="Day Light"
                    value={values.day_light_toggle}
                    onClick={(value: string) => setFieldValue("day_light_toggle", value)}
                />
            </div>
        </CardForm>
    );
};

export default CreateEditAreaCodeForm;
