"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// PROJECT IMPORT
import { Icon } from "../ui-components";
import { Danger, Success } from "@/redux/services/toasterServices";
import { useAuth } from "@/contexts/hooks/useAuth";
import Button from "../forms/Button";
import Input from "../forms/Input";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// TYPES
import { ForgotPasswordFormValues } from "@/types/auth/forgotPasswordTypes";

/* ============================== FORGOT PASSWORD FORM ============================== */

const ForgotPasswordForm = () => {
    const { forgotPassword } = useAuth();
    const router = useRouter()

    const [loading, setLoading] = useState<boolean>(false);

    const initialValues: ForgotPasswordFormValues = {
        username: "",
    };

    const validationSchema = Yup.object<ForgotPasswordFormValues>({
        username: Yup.string().required("Please enter your username"),
    });

    // Forgot Password Call & Link it to your Mail
    const onSubmit = async (values: ForgotPasswordFormValues) => {
        setLoading(true)
        try {
            const res:any = await forgotPassword(values.username);
            if (res?.statusCode === 200) {
                Success(res?.data)
                router.back()
              } else {
                Danger(res?.data)
              }
            setLoading(false)
        } catch (e: any) {
            setLoading(false)
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
                    <Input
                        label="Your Email/Username"
                        name="username"
                        value={values.username}
                        placeholder="Enter Your Email/Username"
                        icon="Email"
                        touched={touched}
                        errors={errors}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        noSpace
                    />
                    <div className="w-full pt-8">
                        <Button
                            loading={loading}
                            text="Reset Password"
                            className="w-full px-9 py-3"
                            type="submit"
                            style="primary"
                        />
                    </div>
                    <div className="flex w-full pt-2 items-center justify-center">
                    <Link
                        href="/login"
                        className="flex items-center justify-center gap-2 font-bold text-xs"
                    >
                        <Icon name="ArrowLeft" width={15} height={15} alt="Back" />
                        Back to Login
                    </Link>
                    </div>
                </div>
            </form>
        </>
    );
};

export default ForgotPasswordForm;
