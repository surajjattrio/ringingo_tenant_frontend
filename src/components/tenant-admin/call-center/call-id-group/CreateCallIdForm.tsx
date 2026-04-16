"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// PROJECT IMPORT
import { callerIdGroupCreate } from "@/redux/slice/tenant-admin/callerIdGroupSlice";
import { Danger, Success } from "@/redux/services/toasterServices";
import { useAppDispatch } from "@/redux/hooks";
import { Input, Switch } from "@/components/forms";
import { CardForm } from "@/components/ui-components";
import { ManagerNameTypes } from "@/types/formTypes";

const CreateCallIdForm = (props: ManagerNameTypes) => {
    const { managerName = "" } = props;
    const dispatch = useAppDispatch();
    const router = useRouter();

    const [loading, setLoading] = useState<boolean>(false);

    const initialValues: any = {
        caller_id_group: "",
        status: "0",
    };

    const validationSchema = Yup.object<any>({
        caller_id_group: Yup.string().required("Please select group"),
    });

    // Create or Update caller id group
    const onSubmit = (values: any) => {
        const payload = { ...values };
        onCreate(payload);
    };

    const {
        values,
        touched,
        errors,
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        resetForm,
    } = useFormik<any>({
        initialValues,
        validationSchema,
        onSubmit,
    });

    // Create caller id group & Navigate to caller id group Page
    const onCreate = async (values: any) => {
        setLoading(true);
        try {
            const payload = { ...values };
            const res: any = await dispatch(callerIdGroupCreate(payload)).unwrap();
            if (res?.statusCode === 201) {
                router.back();
                resetForm();
                Success(res.data);
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Create caller id group Err --->", e?.message);
        }
    };

    return (
        <>
            <CardForm
                name="lm"
                managerName={managerName}
                title="Create Caller Id Group"
                loading={loading}
                handleSubmit={(e: any) => handleSubmit(e)}
                onDoneClick={handleSubmit}
                onCancelClick={() => {
                    resetForm();
                    router.back();
                }}
            >
                <div className="pt-5 pb-10 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4 px-4">
                    <Input
                        name="caller_id_group"
                        label="Caller Id Group"
                        placeholder="Enter Caller Id Group"
                        value={values.caller_id_group}
                        touched={touched}
                        errors={errors}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInfo
                    />
                    <Switch
                        className="pt-[2px]"
                        switchButtonClass="py-1.5"
                        label="Status"
                        value={values.status}
                        onClick={(value: string) => setFieldValue("status", value)}
                    />
                </div>
            </CardForm>
        </>
    );
};

export default CreateCallIdForm;
