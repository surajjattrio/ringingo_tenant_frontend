"use client";
import { useLayoutEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// PROJECT IMPORT
import {
    telecomCircleCreate,
    telecomCircleUpdate,
    updateSingleTelecomCircleData,
    useTelecomCircle,
    useSingleTelecomCircle,
} from "@/redux/slice/tenant-admin/telecomCircleSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useAuth } from "@/contexts/hooks/useAuth";
import { CardForm } from "@/components/ui-components";
import { Input, Select, Switch } from "@/components/forms";

// TYPES IMPORT
import { Danger, Success } from "@/redux/services/toasterServices";
import { InitialValueType } from "@/types/tenant-admin/telecomCircleTypes";

// OPTIONS IMPORT
import { ManagerNameTypes } from "@/types/formTypes";

const CreateEditTelecomCircleForm = (props: ManagerNameTypes) => {
    const { managerName = "" } = props;
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const router = useRouter();

    const telecomCircle = useTelecomCircle();
    const telecomCircleData = useSingleTelecomCircle();
    const { user } = useAuth();

    const [loading, setLoading] = useState<boolean>(false);

    const initialValues: InitialValueType = {
        name: "",
        prefix: "",
        status: "0",
    };

    const validationSchema = Yup.object<InitialValueType>({
        name: Yup.string().required("Please Enter Your Name"),
        prefix: Yup.string().required("Please Enter Prefix"),
    });

    // Create or Update Telecom Circle Nnumber
    const onSubmit = (values: any) => {
        const payload = { ...values };
        payload["tenant_uuid"] = user?.tenant_detail?.uuid;
        if (id) {
            onUpdateTelecomCircle(payload);
        } else {
            onCreateTelecomCircle(payload);
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
            name: telecomCircleData?.name,
            prefix: telecomCircleData?.prefix,
            status: telecomCircleData?.status || "0",

        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [telecomCircleData, id]);

    // Create Telecom Circle & Navigate to Telecom Circle Nunmber Page
    const onCreateTelecomCircle = async (values: any) => {
        setLoading(true);
        try {
            const payload = { ...values };
            const res: any = await dispatch(telecomCircleCreate(payload)).unwrap();
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
            console.error("Create Telecom Circle Err --->", e?.message);
        }
    };

    // Update Telecom Circle & Navigate to Telecom Circle Nunmber Page
    const onUpdateTelecomCircle = async (values: any) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                id,
            };
            const res: any = await dispatch(telecomCircleUpdate(payload)).unwrap();
            if (res?.statusCode === 200) {
                Success(res.data);
                resetForm();
                router.back();
                dispatch(updateSingleTelecomCircleData({}));
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Update Telecom Circle Err --->", e?.message);
        }
    };

    return (
        <CardForm
            className="border bg-gray-5"
            id={id}
            name="telecomCircle"
            managerName={managerName}
            length={id ? 0 : telecomCircle?.count}
            title={id ? "Edit Telecom Circle" : "Create Telecom Circle"}
            loading={loading}
            handleSubmit={handleSubmit}
            onDoneClick={handleSubmit}
            onCancelClick={() => {
                resetForm();
                router.back();
                id && dispatch(updateSingleTelecomCircleData({}));
            }}
        >
            <div className="pt-5 pb-10 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4 px-4">
                <Input
                    type="name"
                    name="name"
                    label={
                        <>
                            Circle Name <span className="text-red-500">*</span>
                        </>
                    }
                    icon="CircleName"
                    placeholder="Enter Name"
                    value={values.name}
                    touched={touched}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInfo
                // noSpace
                />


                <Input
                    name="prefix"
                    label={
                        <>
                            Prefix <span className="text-red-500">*</span>
                        </>
                    }
                    icon="Prefix"
                    placeholder="Enter Prefix"
                    value={values.prefix}
                    touched={touched}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInfo
                    noSpace
                />

                <Switch
                    label="Status"
                    value={values.status}
                    onClick={(value: string) => setFieldValue("status", value)}
                />


            </div>
        </CardForm>
    );
};

export default CreateEditTelecomCircleForm;
