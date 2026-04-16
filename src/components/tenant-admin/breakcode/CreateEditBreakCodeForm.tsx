"use client";
import ReactDom from 'react-dom';
import moment from 'moment';
import TimePicker from 'rc-time-picker';
import { useLayoutEffect, useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// PROJECT IMPORT
import {
    breakCodeCreate,
    breakCodeUpdate,
    updateSingleBreakCodeData,
    breakCodeSingleGet,
    useBreakCode,
    useSingleBreakCode,
} from "@/redux/slice/tenant-admin/breakCodeSlice";
// import {
//     useOutboundOptions,
//     outboundOptionsGet,
// } from "@/redux/slice/tenant-admin/outboundSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useAuth } from "@/contexts/hooks/useAuth";
import { CardForm } from "@/components/ui-components";
import { Input, Select, Switch } from "@/components/forms";

// TYPES IMPORT
import { Danger, Success } from "@/redux/services/toasterServices";
import { InitialValueType } from "@/types/tenant-admin/breakcodeTypes";
import { ManagerNameTypes } from "@/types/formTypes";

const CreateEditBreakCodeForm = (props: ManagerNameTypes) => {
    const { managerName = "" } = props;
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const router = useRouter();

    const breakCode = useBreakCode();
    const breakCodeData = useSingleBreakCode();

    //const outboundOptions = useOutboundOptions();
    const { user } = useAuth();

    const [loading, setLoading] = useState<boolean>(false);
    const [durationTime, setDurationTime] = useState<any>(null);

    const initialValues: InitialValueType = {
        name: "",
        description: "",
        break_code: "",
        duration: "",
        status: "0",
        billable: "0",
    };
    const showSecond = false;
    const str = showSecond ? 'HH:mm' : "HH:mm";

    const validationSchema = Yup.object<InitialValueType>({
        // name: Yup.string().required("Please enter your Name"),
        // break_code: Yup.string().required("Please enter your Break Code"),
        break_code: Yup.string().max(5, "Only 5 Character allowed").required("Please Enter Your Break Code"),
        name: Yup.string()
            .max(12, "Only 12 Character allowed")
            .required("Please Enter Your Break Name"),
    });

    // Create or Update BreakCode number
    const onSubmit = (values: any) => {
        const payload = {
            ...values,
            duration: durationTime
        };
        console.log(payload);
        // const payload = { ...values };
        payload["tenant_uuid"] = user?.tenant_detail?.uuid;
        if (id) {
            onUpdateBreakCode(payload);
        } else {
            onCreateBreakCode(payload);
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
            name: breakCodeData?.name,
            description: breakCodeData?.description,
            break_code: breakCodeData?.break_code,
            duration: breakCodeData?.duration,
            status: breakCodeData?.status || "0",
            billable: breakCodeData?.billable || "0",
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [breakCodeData, id]);

    // useEffect(() => {
    //   //  onGetOutboundOptions();
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    useEffect(() => {
        if (!id) return;

        // If in edit mode, set the initial value of durationTime to the existing duration
        setDurationTime(breakCodeData?.duration || '');

        setValues({
            ...values,
            name: breakCodeData?.name,
            description: breakCodeData?.description,
            break_code: breakCodeData?.break_code,
            duration: breakCodeData?.duration,
            status: breakCodeData?.status || "0",
            billable: breakCodeData?.billable || "0",
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [breakCodeData, id]);

    // Fetching Outbound Options
    // const onGetOutboundOptions = async () => {
    //     try {
    //         await dispatch(outboundOptionsGet()).unwrap();
    //     } catch (err) {
    //         console.error("Get Outbound Options Err =-=>", err);
    //     }
    // };

    // Fetching Single Break Code Data
    const onGetSingleBreakCodeData = async () => {
        try {
            const res: any = await dispatch(breakCodeSingleGet(id)).unwrap();
            if (res?.statusCode === 200) {
                const breakCodeData = res?.data;
                setValues({
                    ...values,
                    name: breakCodeData?.name,
                    description: breakCodeData?.description,
                    break_code: breakCodeData?.breakcode || "0",
                    duration: breakCodeData?.duration || "0",
                    status: breakCodeData?.status || "0",
                    billable: breakCodeData?.billable || "0",
                });
            }
        } catch (err) {
            console.error("Get Single Break Code Data Err =-=>", err);
        }
    };

    // Create Break Code & Navigate to Break Code  Page
    const onCreateBreakCode = async (values: any) => {
        setLoading(true);
        try {
            const payload = { ...values };
            const res: any = await dispatch(breakCodeCreate(payload)).unwrap();
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
            console.error("Create Break Code Err --->", e?.message);
        }
    };

    // Update Break Code & Navigate to Break Code  Page
    const onUpdateBreakCode = async (values: any) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                id,
            };
            const res: any = await dispatch(breakCodeUpdate(payload)).unwrap();
            if (res?.statusCode === 200) {
                Success(res.data);
                resetForm();
                router.back();
                dispatch(updateSingleBreakCodeData({}));
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Update Break Code Err --->", e?.message);
        }
    };

    const handleDurationChange = (values: any) => {
        console.log("COMING HERE");
        console.log(values);

        const dateObject = values ? new Date(values) : new Date();
        const customerTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        // Use Moment.js to format the time
        const formattedTime = moment(dateObject).format("HH:mm");

        setDurationTime(formattedTime);

        console.log(customerTimeZone);
        console.log(formattedTime);
    };
    return (
        <CardForm
            className="border bg-gray-5"
            id={id}
            managerName={managerName}
            name="breakcode"
            length={id ? 0 : breakCode?.count}
            title={id ? "Edit Break Code" : "Create Break Code"}
            loading={loading}
            handleSubmit={handleSubmit}
            onDoneClick={handleSubmit}
            onCancelClick={() => {
                resetForm();
                router.back();
                id && dispatch(updateSingleBreakCodeData({}));
            }}
        >
            <div className="pt-5 pb-10 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4 px-4">
                <Input
                    type="text"
                    name="break_code"
                    label={
                        <>
                            Break Code <span className="text-red-500">*</span>
                        </>
                    }
                    icon='Code'
                    placeholder="Enter Break Code"
                    value={values.break_code}
                    touched={touched}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInfo
                    noSpace
                />
                <Input
                    type="text"
                    name="name"
                    label={
                        <>
                            Break Name <span className="text-red-500">*</span>
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
                    type="text"
                    name="description"
                    icon='Description'
                    label="Description"
                    placeholder="Enter Description"
                    value={values.description}
                    touched={touched}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInfo
                />


                <div>
                    <label className="text-xs font-semibold pb-2 flex items-center" >Duration(HH:MM)</label>
                    <TimePicker  //label="Duration"
                        className=" focus:outline-none border-2 rounded-md focus:border-primary py-1 w-full text-xs "
                        //  label="Duration"
                        name="duration"
                        placeholder="Enter Duration"
                        onChange={handleDurationChange}
                        showSecond={showSecond}
                        value={durationTime ? moment(durationTime, str) : undefined}
                    />
                </div>

                <div className="flex items-end g-4">
                    {/* <label className="text-xs font-semibold pb-2 flex items-center" >Status</label> */}
                    {/* <div className="h-[22px]"></div>{" "} */}

                    <Switch
                        className="pt-[2px] mr-4"
                        label="Status"
                        value={values.status}
                        onClick={(value: string) => setFieldValue("status", value)}
                    />
                    <Switch
                        className="pt-[2px]"
                        label="Billable"
                        value={values.billable}
                        onClick={(value: string) => setFieldValue("billable", value)}
                    />
                </div>


            </div>
        </CardForm>
    );
};

export default CreateEditBreakCodeForm;
