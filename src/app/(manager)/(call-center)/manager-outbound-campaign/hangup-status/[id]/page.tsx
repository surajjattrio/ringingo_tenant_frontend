"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

// PROJECT IMPORT
import { useAppDispatch } from "@/redux/hooks";
import { CardForm } from "@/components/ui-components";
import { outboundHangupAdd } from "@/redux/slice/tenant-admin/outboundSlice";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/forms";
import { Danger, Success } from "@/redux/services/toasterServices";

interface InitialValueType {
    name: string;
    code: string;
}
const AddHangupStatus = () => {
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();

    const [loading, setLoading] = useState<boolean>(false);

    const initialValues: InitialValueType = {
        name: "",
        code: "",
    };

    const validationSchema = Yup.object<InitialValueType>({
        name: Yup.string().required("Please enter your name"),
        code: Yup.string().required("Please enter code"),
    });

    // Create or Update IVR
    const onSubmit = (values: any) => {
        const payload = { ...values };
        payload["outbound_campaign_uuid"] = id;
        onCreateHangupStatus(payload);
    };

    const {
        values,
        touched,
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
    } = useFormik<any>({
        initialValues,
        validationSchema,
        onSubmit,
    });

    // Create Hangup Status & Navigate Back
    const onCreateHangupStatus = async (payload: any) => {
        setLoading(true);
        try {
            const res:any = await dispatch(outboundHangupAdd(payload)).unwrap();
            if (res?.statusCode === 201) {
                router.back();
                Success(res.data);
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error(" --->", e?.message);
        }
    };

    return (
        <CardForm
            title="Add Hangup Status"
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
                    label="Status Name"
                    placeholder="Enter Status Name"
                    value={values.name}
                    touched={touched}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInfo
                />
                <Input
                    name="code"
                    label="Code"
                    placeholder="Enter Code"
                    value={values.code}
                    touched={touched}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInfo
                />
            </div>
        </CardForm>
    );
};

export default AddHangupStatus;
