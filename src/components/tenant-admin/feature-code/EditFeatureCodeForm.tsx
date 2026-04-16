"use client";
import { useLayoutEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// PROJECT IMPORT
import {
    featureCodeUpdate,
    updateSingleFeatureCode,
    useSingleFeatureCode,
} from "@/redux/slice/tenant-admin/featureCodeSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useAuth } from "@/contexts/hooks/useAuth";
import { Danger, Success } from "@/redux/services/toasterServices";
import { CardForm } from "@/components/ui-components";
import { Input, Textarea } from "@/components/forms";

// TYPES IMPORT
import { InitialValueType } from "@/types/tenant-admin/featureCodeTypes";

const EditFeatureCodeForm = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { user } = useAuth();
    const featureCode = useSingleFeatureCode();

    const [loading, setLoading] = useState<boolean>(false);

    const initialValues: InitialValueType = {
        name: "",
        feature_code: "",
        description: "",
    };

    const validationSchema = Yup.object<InitialValueType>({
        name: Yup.string().required("Please enter your name"),
        feature_code: Yup.string().required("Please enter feature code"),
        description: Yup.string().required("Please enter description"),
    });

    // Update Feature Code
    const onSubmit = (values: any) => {
        const payload = { ...values };
        payload["tenant_uuid"] = user?.tenant_detail?.uuid;
        onUpdateFeatureCode(payload);
    };

    const {
        values,
        touched,
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        setValues,
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
            name: featureCode?.display_name,
            feature_code: featureCode?.feature_code,
            description: featureCode?.description,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [featureCode, id]);

    // Update Feature Code & Navigate to Feature Code Page
    const onUpdateFeatureCode = async (values: any) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                id,
            };
            const res: any = await dispatch(featureCodeUpdate(payload)).unwrap();
            if (res?.statusCode === 200) {
                Success(res.data);
                router.back();
                resetForm();
                dispatch(updateSingleFeatureCode({}));
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Update Feature Code Err --->", e?.message);
        }
    };

    return (
        <CardForm
            loading={loading}
            title="Edit Feature Code"
            handleSubmit={handleSubmit}
            onDoneClick={handleSubmit}
            onCancelClick={() => {
                resetForm();
                router.back();
                id && dispatch(updateSingleFeatureCode({}));
            }}
        >
            <div className="pt-5 pb-10 space-y-4">
                <div className="grid grid-cols-3">
                    <div className="px-4">
                        <Input
                            name="name"
                            label="Name"
                            placeholder="Enter Name"
                            value={values.name}
                            touched={touched}
                            errors={errors}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInfo
                        />
                    </div>
                    <div className="px-4">
                        <Input
                            name="feature_code"
                            label="Feature Code"
                            placeholder="Enter Feature Code"
                            value={values.feature_code}
                            touched={touched}
                            errors={errors}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInfo
                        />
                    </div>
                    <div className="px-4">
                        <Textarea
                            name="description"
                            label="Description"
                            placeholder="Enter Description"
                            value={values.description}
                            touched={touched}
                            errors={errors}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInfo
                        />
                    </div>
                </div>
            </div>
        </CardForm>
    );
};

export default EditFeatureCodeForm;
