"use client";
import { useLayoutEffect, useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// PROJECT IMPORT
import {
    dncCreate,
    dncUpdate,
    updateSingleDncData,
    dncSingleGet,
    useDnc,
    useSingleDnc,
} from "@/redux/slice/tenant-admin/dncSlice";
import {
    useOutboundOptions,
    outboundOptionsGet,
} from "@/redux/slice/tenant-admin/outboundSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useAuth } from "@/contexts/hooks/useAuth";
import { CardForm } from "@/components/ui-components";
import { Input, Select, Switch } from "@/components/forms";

// TYPES IMPORT
import { Danger, Success } from "@/redux/services/toasterServices";
import { InitialValueType } from "@/types/tenant-admin/dncTypes";
import { ManagerNameTypes } from "@/types/formTypes";

const CreateEditDncForm = (props: ManagerNameTypes) => {
    const { managerName = "" } = props;
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const router = useRouter();

    const dnc = useDnc();
    const dncData = useSingleDnc();

    const outboundOptions = useOutboundOptions();
    const { user } = useAuth();

    const [loading, setLoading] = useState<boolean>(false);

    const initialValues: InitialValueType = {
        phone_number: "",
        status: "0",
        campaign_uuid: "",
        concurrent_cam: "",
        global_status: "0",
    };

    const validationSchema = Yup.object<InitialValueType>({
        phone_number: Yup.string().required("Please Enter Your Phone Number"),
        campaign_uuid: Yup.string().when("global_status", {
            is: "1",
            then: (e) => e.required("Please select any campaign"),
        }),
    });

    // const validationSchema = Yup.object<InitialValueType>().shape({
    //     phone_number: Yup.string().required("Please enter your phone number"),
    //     campaign_uuid: Yup.string().when('global_status',{
    //         is: "1",then:(e) => e.required('Please select any campaign')
    //     })
    // })

    // Create or Update DNC number
    const onSubmit = (values: any) => {
        const payload = { ...values };
        payload["tenant_uuid"] = user?.tenant_detail?.uuid;
        if (id) {
            onUpdateDnc(payload);
        } else {
            onCreateDnc(payload);
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
            phone_number: dncData?.phone_number,
            status: dncData?.status || "0",
            campaign_uuid: dncData?.campaign_uuid,
            concurrent_cam: dncData?.concurrent_cam,
            global_status: dncData?.global_status || "0",
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dncData, id]);

    useEffect(() => {
        onGetOutboundOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetching Outbound Options
    const onGetOutboundOptions = async () => {
        try {
            await dispatch(outboundOptionsGet()).unwrap();
        } catch (err) {
            console.error("Get Outbound Options Err =-=>", err);
        }
    };

    // Fetching Single Dnc Data
    const onGetSingleDncData = async () => {
        try {
            const res: any = await dispatch(dncSingleGet(id)).unwrap();
            if (res?.statusCode === 200) {
                const dncData = res?.data;
                setValues({
                    ...values,
                    phone_number: dncData?.phone_number,
                    campaign_uuid: dncData?.campaign_uuid,
                    global_status: dncData?.global_status || "0",
                    status: dncData?.status || "0",
                });
            }
        } catch (err) {
            console.error("Get Single Dnc Data Err =-=>", err);
        }
    };

    // Create DNC & Navigate to DNC  Page
    const onCreateDnc = async (values: any) => {
        setLoading(true);
        try {
            const payload = { ...values };
            const res: any = await dispatch(dncCreate(payload)).unwrap();
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
            console.error("Create DNC Err --->", e?.message);
        }
    };

    // Update DNC & Navigate to DNC  Page
    const onUpdateDnc = async (values: any) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                id,
            };
            const res: any = await dispatch(dncUpdate(payload)).unwrap();
            if (res?.statusCode === 200) {
                Success(res.data);
                resetForm();
                router.back();
                dispatch(updateSingleDncData({}));
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Update DNC Err --->", e?.message);
        }
    };

    return (
        <CardForm
            id={id}
            managerName={managerName}
            name="dnc"
            length={id ? 0 : dnc?.count}
            title={id ? "Edit DNC" : "Create DNC"}
            loading={loading}
            handleSubmit={handleSubmit}
            onDoneClick={handleSubmit}
            onCancelClick={() => {
                resetForm();
                router.back();
                id && dispatch(updateSingleDncData({}));
            }}
        >
            <div className="pt-5 pb-10 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4 px-4">
                <Input
                    type="number"
                    name="phone_number"
                    label=
                    {
                        <>
                            Phone Number <span className="text-red-500">*</span>
                        </>
                    }
                    icon="PhoneCall"
                    placeholder="Enter Phone Number"
                    value={values.phone_number}
                    touched={touched}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInfo
                />

                <Switch
                    className="pt-[2px]"
                    switchButtonClass="py-1.5"
                    trueName="Yes"
                    falseName="No"
                    label="Global"
                    value={values.global_status}
                    onClick={(value: string) => setFieldValue("global_status", value)}
                    onChange={(e: any) => {
                        setValues({
                            ...values,
                            global_status: e.target.value,
                            concurrent_cam:
                                e.target.value === "1" ? values?.concurrent_cam : "",
                        });
                    }}
                />

                {values?.global_status === "1" ? (
                    <Select
                        name="campaign_uuid"
                        label="Campaign"
                        placeholder="Select Campaign"
                        options={outboundOptions}
                        value={values.campaign_uuid}
                        touched={touched}
                        errors={errors}
                        onChange={(e: any) => {
                            setValues({
                                ...values,
                                campaign_uuid: e.target.value,
                                concurrent_cam:
                                    e.target.value === "1" ? values?.concurrent_cam : "",
                            });
                        }}
                        onBlur={handleBlur}
                        isInfo
                    />
                ) : null}

                <Switch
                    label="Status"
                    value={values.status}
                    onClick={(value: string) => setFieldValue("status", value)}
                />
            </div>
        </CardForm>
    );
};

export default CreateEditDncForm;
