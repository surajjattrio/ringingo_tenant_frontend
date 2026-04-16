"use client";
import Link from "next/link";
import { useState } from "react";

// PROJECT IMPORT
import { Danger, Success } from "@/redux/services/toasterServices";
import { useAuth } from "@/contexts/hooks/useAuth";
import Button from "../forms/Button";
import Input from "../forms/Input";
import { Icon } from "../ui-components";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";
import { LoginFormValues } from "@/types/auth/loginTypes";

/* ============================== VERIFY LICENSE FORM ============================== */

const VerifyLicense = () => {
    const { loginDetails, login } = useAuth();

    const [loading, setLoading] = useState<boolean>(false);

    const initialValues: LoginFormValues = {
        username: loginDetails?.username,
        password: loginDetails?.password,
        tenant_domain: loginDetails?.tenant_domain,
        rememberMe: loginDetails?.rememberMe,
        key: "",
    };

    const validationSchema = Yup.object<LoginFormValues>({
        key: Yup.string().required("Please enter your license key"),
    });

    const onSubmit = async (values: LoginFormValues) => {
        setLoading(true);
        try {
            const res: any = await login(
                values.username,
                values.password,
                values.tenant_domain,
                values.key,
                values.rememberMe
            );
            console.log(res);

            if (res?.statusCode === 200) {
                Success(res?.data);
            } else {
                Danger(res?.data);
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
                    <Input
                        label="License Key"
                        name="key"
                        value={values.key}
                        placeholder="Enter Your License Key"
                        icon="Lock"
                        touched={touched}
                        errors={errors}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        noSpace
                    />
                    <div className="w-full pt-4">
                        <Button
                            loading={loading}
                            text="Validate License"
                            className="w-full px-9 py-3"
                            type="submit"
                            style="primary"
                        />
                    </div>
                    <div className="flex w-full pt-3 items-center justify-center">
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

export default VerifyLicense;
