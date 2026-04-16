"use client";

import { useState } from "react";

// PROJECT IMPORT
import { ChangePasswordTypes } from "@/types/profileTypes";
import { Button, Password } from "@/components/forms";
import { Danger, Success } from "@/redux/services/toasterServices";
import { useAuth } from "@/contexts/hooks/useAuth";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

const ChangePassword = () => {
    const { changePassword } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);

    const initialValues: ChangePasswordTypes = {
        current_password: "",
        password: "",
        confirmPassword: "",
    };

    const validationSchema = Yup.object<ChangePasswordTypes>({
        current_password: Yup.string().required(
            "Please enter your current password"
        ),
        password: Yup.string().required("Please enter your new password"),
        confirmPassword: Yup.string().required("Please enter confirm password").oneOf([Yup.ref("password")], "Passwords does not match"),
    });

    // Change Password Call
    const onSubmit = async (values: ChangePasswordTypes) => {
        setLoading(true);
        try {
            const res: any = await changePassword(values.password,values.current_password);
            if (res?.statusCode === 200) {
                Success(res?.data);
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Change Password Err =-=>", e?.message);
        }
    };

    const { values, touched, errors, handleBlur, handleChange, handleSubmit } =
        useFormik({
            initialValues,
            validationSchema,
            onSubmit,
        });

    return (
        <>
            <div className="col-span-3 h-full p-5">
                <div className="grid grid-cols-3 tmd:grid-cols-2 tsm:grid-cols-1 ">
                    <div>
                        <span className="font-bold text-base text-heading">Change Password</span>
                        <form onSubmit={handleSubmit} className="pt-5">
                            <div className="space-y-[20px]">
                                <Password
                                    label="Current Password"
                                    name="current_password"
                                    value={values.current_password}
                                    placeholder="Enter Current Password"
                                    touched={touched}
                                    errors={errors}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInfo
                                />
                                <Password
                                    label="New Password"
                                    name="password"
                                    value={values.password}
                                    placeholder="Enter New Password"
                                    touched={touched}
                                    errors={errors}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInfo
                                />
                                <Password
                                    label="Confirm Password"
                                    name="confirmPassword"
                                    value={values.confirmPassword}
                                    placeholder="Re-enter New Password"
                                    touched={touched}
                                    errors={errors}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInfo
                                />
                            </div>
                            <div className="w-full pt-4 grid grid-cols-2 tmd:grid-cols-1 tsm:grid-cols-1">
                                <Button
                                    loading={loading}
                                    text="Update Password"
                                    className="w-full px-2 py-1.5"
                                    type="submit"
                                    style="primary"
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChangePassword;
