"use client";
import { useLayoutEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// PROJECT IMPORT
import {
    adminDidCreate,
    adminDidUpdate,
    updateSingleAdminDidData,
    useSingleAdminDid,
} from "@/redux/slice/master-admin/adminDidSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useAuth } from "@/contexts/hooks/useAuth";
import { CardForm } from "@/components/ui-components";
import { Input, Select, Switch } from "@/components/forms";

// TYPES IMPORT
import { Danger, Success } from "@/redux/services/toasterServices";
import { InitialValueType } from "@/types/master-admin/adminDidTypes";

// OPTIONS IMPORT
import { timeoutOptions2 } from "@/config/options";

const CreateEditAdminDidForm = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const router = useRouter();

    const didData = useSingleAdminDid();
    const { user } = useAuth();

    const [loading, setLoading] = useState<boolean>(false);

    const initialValues: InitialValueType = {
        number: "",
        codec: "PCMA",
        timeout: "",
        status: "0",
        assign_tenant_uuid: ""
    };

    const validationSchema = Yup.object<InitialValueType>({
        number: Yup.string().required("Please enter your did number"),
        codec: Yup.string().required("Please enter codec"),
        timeout: Yup.string().required("Please selct timeout"),
    });

    // Create or Update DID Nnumber
    const onSubmit = (values: any) => {
        const payload = { ...values };
        payload["tenant_uuid"] = user?.tenant_detail?.uuid;
        if (id) {
            onUpdateDid(payload);
        } else {
            onCreateDid(payload);
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
            number: didData?.number,
            status: didData?.status || "0",
            timeout: didData?.timeout,
            codec: didData?.codec || "PCMA",
            assign_tenant_uuid: didData?.assign_tenant_uuid || "",
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [didData, id]);

    // Create DID & Navigate to DID Nunmber Page
    const onCreateDid = async (values: any) => {
        setLoading(true);
        try {
            const payload = { ...values };
            const res: any = await dispatch(adminDidCreate(payload)).unwrap();
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
            console.error("Create DID Err --->", e?.message);
        }
    };

    // Update DID & Navigate to DID Nunmber Page
    const onUpdateDid = async (values: any) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                id,
            };
            const res: any = await dispatch(adminDidUpdate(payload)).unwrap();
            if (res?.statusCode === 200) {
                Success(res.data);
                resetForm();
                router.back();
                dispatch(updateSingleAdminDidData({}));
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Update DID Err --->", e?.message);
        }
    };

    return (
        <CardForm
            id={id}
            name="did"
            title={id ? "Edit DID" : "Create DID"}
            loading={loading}
            handleSubmit={handleSubmit}
            onDoneClick={handleSubmit}
            onCancelClick={() => {
                resetForm();
                router.back();
                id && dispatch(updateSingleAdminDidData({}));
            }}
        >
            <div className="pt-5 pb-10 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4 px-4">
                <Input
                    type="+number"
                    name="number"
                    label="DID Number"
                    icon="DIDNumber"
                    placeholder="Enter DID Number"
                    value={values.number}
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
                <Select
                    name="timeout"
                    label="Timeout"
                    placeholder="Select Timeout"
                    icon="ClockGray"
                    removable
                    options={timeoutOptions2}
                    value={values.timeout}
                    touched={touched}
                    errors={errors}
                    onChange={(e: any) => {
                        setFieldValue("timeout", e.target.value);
                    }}
                    onBlur={handleBlur}
                    isInfo
                />
                <Input
                    name="codec"
                    label="Codec"
                    icon="Codec"
                    placeholder="Enter Codec"
                    value={values.codec}
                    touched={touched}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInfo
                    noSpace
                />
            </div>
        </CardForm>
    );
};

export default CreateEditAdminDidForm;
