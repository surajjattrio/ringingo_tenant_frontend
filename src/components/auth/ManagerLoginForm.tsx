"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// PROJECT IMPORT
import { Danger, Success } from "@/redux/services/toasterServices";
import { useAuth } from "@/contexts/hooks/useAuth";
import { Button, CheckBox, Input, Password } from "../forms";
import getDomain from "@/utils/GetDoamin";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";
import Cookies from "js-cookie";

// TYPES
import { LoginFormValues } from "@/types/auth/loginTypes";

/* ============================== LOGIN FORM ============================== */

const ManagerLoginForm = () => {
    const { login } = useAuth();
    const router = useRouter();

    const [loading, setLoading] = useState<boolean>(false);

     const domain = getDomain();
    const initialValues: LoginFormValues = {
        username: "",
        password: "",
        tenant_domain: domain,
        entity: "manager",
        rememberMe: false,
        key: "",
    };

    const validationSchema = Yup.object<LoginFormValues>({
        username: Yup.string().required("Please enter your username"),
        password: Yup.string().required("Please enter your password"),
    });

    // Login & Navigate to Dashboard Page
    const onSubmit = async (values: LoginFormValues) => {
        setLoading(true);

        if (!navigator.geolocation) {
            Danger("Geolocation is not supported by your browser");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                // Success: Proceed with login
                try {
                    // Explicitly set cookies here to ensure interceptor picks them up immediately
                    Cookies.set("geo_lat", String(position.coords.latitude), { expires: 1 });
                    Cookies.set("geo_lng", String(position.coords.longitude), { expires: 1 });

            const res: any = await login(
                values.username,
                values.password,
                values.tenant_domain,
                values.key,
                values.rememberMe,
                values.entity,
            );
            if (res?.statusCode === 200) {
                Success(res?.data);
            } else if (res?.data === false || res?.data?.key_details === "") {
                router.push("/verify-license");
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Login Err =-=>", e?.message);
        }
            },
            (error) => {
                // Error/Denied
                setLoading(false);
                let errorMessage = "Location permission is required to login.";
                if (error.code === error.PERMISSION_DENIED) {
                    errorMessage = "You denied the request for Geolocation. Please allow location access to login.";
                } else if (error.code === error.POSITION_UNAVAILABLE) {
                    errorMessage = "Location information is unavailable.";
                } else if (error.code === error.TIMEOUT) {
                    errorMessage = "The request to get user location timed out.";
                }
                Danger(errorMessage);
            }
        );
    };

    const {
        values,
        touched,
        errors,
        handleBlur,
        handleChange,
        setFieldValue,
        handleSubmit,
    } = useFormik({
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
                    <Password
                        label="Password"
                        name="password"
                        value={values.password}
                        placeholder="Enter Password"
                        touched={touched}
                        errors={errors}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                    <div className="flex justify-between items-center pt-2">
                        <CheckBox
                            label="Remember Me"
                            checked={values.rememberMe}
                            onChange={(checked: boolean) =>
                                setFieldValue("rememberMe", checked)
                            }
                        />
                        <p className="text-xs font-semibold">
                            <Link href="forgot-password">Forgot Password?</Link>
                        </p>
                    </div>
                    <div className="w-full pt-8">
                        <Button
                            loading={loading}
                            text="Login"
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

export default ManagerLoginForm;
