"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// PROJECT IMPORT
import { leadGroupCreate } from "@/redux/slice/tenant-admin/leadGroupSlice";
import { userOptionsGet } from "@/redux/slice/tenant-admin/userSlice";
import {
    useUserGroupsOptions,
    userGroupOptionsGet,
} from "@/redux/slice/tenant-admin/userGroupSlice";

import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { useAuth } from "@/contexts/hooks/useAuth";
import { Input, Select } from "@/components/forms";
import { CardForm } from "@/components/ui-components";

// TYPES IMPORT
import { InitialValueType } from "@/types/tenant-admin/leadGroupTypes";

const CreateLeadGroup = () => {
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { user } = useAuth();
    const userGroupOptions = useUserGroupsOptions();

    const [loading, setLoading] = useState<boolean>(false);

    const initialValues: InitialValueType = {
        name: "",
        user_group_uuid: "",
        description: "",
        campaign_uuid: id as string,
        status: "0",
    };

    const validationSchema = Yup.object<InitialValueType>({
        name: Yup.string().required("Please enter name"),
        user_group_uuid: Yup.string().required("Please enter usergroup"),
    });

    // Create Lead Group & Navigate to Lead group Page
    const onSubmit = async (values: any) => {
        setLoading(true);
        try {
            const payload = { ...values };
            const res: any = await dispatch(leadGroupCreate(payload)).unwrap();
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
            console.error("Create Lead Group Err --->", e?.message);
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
    } = useFormik<any>({
        initialValues,
        validationSchema,
        onSubmit,
    });

    useEffect(() => {
        onGetUserOptions();
        onGetUserGroupOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetching User Options
    const onGetUserOptions = async () => {
        try {
            await dispatch(userOptionsGet());
        } catch (err) {
            console.error("Get User Options Err =-=>", err);
        }
    };

    // Fetching User Group Options
    const onGetUserGroupOptions = () => {
        try {
            dispatch(userGroupOptionsGet());
        } catch (err) {
            console.error("Get User Group Options Err =-=>", err);
        }
    };

    return (
        <CardForm
            name="leadgroup"
            loading={loading}
            title="Create Lead group"
            handleSubmit={handleSubmit}
            onDoneClick={handleSubmit}
            onCancelClick={() => {
                router.back();
            }}
        >
            <div className="pt-5 pb-10 space-y-[30px]">
                <div className="grid grid-cols-3 gap-4">
                    <div>
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
                    <div>
                        <Select
                            name="user_group_uuid"
                            label="User Group"
                            placeholder="Select User Group"
                            options={userGroupOptions}
                            value={values.user_group_uuid}
                            touched={touched}
                            errors={errors}
                            onChange={(e: any) => {
                                setFieldValue("user_group_uuid", e.target.value);
                            }}
                            onBlur={handleBlur}
                            isInfo
                        />
                    </div>
                    <div>
                        <Input
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

export default CreateLeadGroup;
