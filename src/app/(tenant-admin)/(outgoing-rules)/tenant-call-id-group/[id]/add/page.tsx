"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

// PROJECT IMPORT
import { CardForm } from "@/components/ui-components";
import { useAppDispatch } from "@/redux/hooks";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input, Switch } from "@/components/forms";
import { callerIdAdd } from "@/redux/slice/tenant-admin/callerIdGroupSlice";
import { Danger, Success } from "@/redux/services/toasterServices";

const Add = () => {
    const dispatch = useAppDispatch();
    const { id } = useParams();
    const router = useRouter();

    const [loading, setLoading] = useState<boolean>(false);

    const initialValues: any = {
        caller_id: "",
    };

    const validationSchema = Yup.object<any>({
        caller_id: Yup.string().required("Please enter Caller ID"),
    });

    // Add Caller Id
    const onSubmit = (values: any) => {
        const payload = { ...values, caller_id_group_uuid: id };
        onAddCallerId(payload);
    };

    // Add Caller ID
    const onAddCallerId = async (values: any) => {
        setLoading(true);
        try {
            const res: any = await dispatch(callerIdAdd(values)).unwrap();
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
            console.error("Add Caller ID Err --->", e?.message);
        }
    };

    const {
        values,
        touched,
        errors,
        handleChange,
        handleBlur,
        handleSubmit,
        resetForm,
    } = useFormik<any>({
        initialValues,
        validationSchema,
        onSubmit,
    });

    return (
        <>
            <CardForm
                title="Add Caller ID"
                loading={loading}
                handleSubmit={handleSubmit}
                onDoneClick={handleSubmit}
                onCancelClick={() => {
                    resetForm();
                    router.back();
                }}
            >
                <div className="pt-5 pb-10 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4 px-4">
                    <Input
                        type="number"
                        name="caller_id"
                        label="Caller ID"
                        placeholder="Enter Caller ID"
                        value={values.caller_id}
                        touched={touched}
                        errors={errors}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInfo
                    />
                    {/* <Switch
                    label="Status"
                    value={values.status}
                    onClick={(value: string) => setFieldValue("status", value)}
                /> */}
                </div>
            </CardForm>
        </>
    );
};

export default Add;
