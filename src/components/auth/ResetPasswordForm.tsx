"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

// PROJECT IMPORT
import { Danger, Success } from "@/redux/services/toasterServices";
import { useAuth } from "@/contexts/hooks/useAuth";
import { Button, Password } from "../forms";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// TYPES
import { ResetPasswordFormValues } from "@/types/auth/resetPasswordTypes";

/* ============================== RESET PASSWORD FORM ============================== */

const ResetPasswordForm = () => {
    const { resetPassword } = useAuth();
    const router = useRouter();
    const {id} = useParams()

    const [loading, setLoading] = useState<boolean>(false);
    const initialValues: ResetPasswordFormValues = {
        password: "",
        confirmPassword: "",
    };

    const validationSchema = Yup.object<ResetPasswordFormValues>({
        password: Yup.string().required("Please enter your password"),
        confirmPassword: Yup.string().required("Please enter confirm password").oneOf([Yup.ref("password")], "Passwords does not match"),
    });

    // Reset Password Call & Navigate to Login Page
    const onSubmit = async (values: ResetPasswordFormValues) => {
        setLoading(true);
        try {
            const res: any = await resetPassword(values.password,id);
            if (res?.statusCode === 200) {
                Success(res?.data);
                router.push("/login");
            } else {
                Danger(res?.data || res?.error);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Login Err =-=>", e?.message);
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
            <form onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <Password
                        label="New Password"
                        name="password"
                        value={values.password}
                        placeholder="Enter New Password"
                        touched={touched}
                        errors={errors}
                        onChange={handleChange}
                        onBlur={handleBlur}
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
                    />
                    <div className="w-full pt-8">
                        <Button
                            loading={loading}
                            text="Update Password"
                            className="w-full px-9 py-3"
                            type="submit"
                            style="primary"
                        />
                    </div>
                </div>
            </form>
        </>
    );
};

export default ResetPasswordForm;
