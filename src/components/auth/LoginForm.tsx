"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// import Image from "next/image";

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
import { Icon } from "../ui-components";

/* ============================== LOGIN FORM ============================== */

const LoginForm = () => {
    const { login } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"email" | "number">("email");
    const [loading, setLoading] = useState<boolean>(false);

    const domain = getDomain();

    // let domain:any = "testagenttenant.ringingo.com"
    // let domain:any = "1financecc.ringingo.com"
    // let domain:any = "dev.ringingo.com"
    // const tenantPortal: any = process.env.TENANT_PORTAL_DOMAIN;
    const tenantPortal: any = domain;
    const initialValues: LoginFormValues = {
        username: "",
        password: "",
        tenant_domain: tenantPortal,
        rememberMe: false,
        key: "",
    };

    const validationSchema = Yup.object<LoginFormValues>({
        username: Yup.string().required("Please Enter Your Username"),
        password: Yup.string().required("Please Enter Your Password"),
    });

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
                        values.company_code ? `${values.company_code}.ringingo.com`.toLowerCase() : values.tenant_domain,
                        values.key,
                        values.rememberMe,
                        undefined,
                        values.company_code?.toLowerCase()
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
    console.log("domain",domain);
    console.log("process.env.NEXT_PUBLIC_ENVIRONMENT",process.env.NEXT_PUBLIC_ENVIRONMENT);

    return (
        // <div className="min-h-screen flex items-center justify-center bg-white">
        //   <div className="flex">
        //     {/* Left Section */}
        //     <div className="w-[500px] p-8 border-2 rounded-tl-lg rounded-bl-lg shadow-md">
        //       {/* Logo */}
        //       <div className="mb-12 flex justify-center">
        //         <Icon
        //           name="MenuLogoExpandedImage"
        //           height={80}
        //           width={200}
        //           alt="Logo"
        //         />

        //         {/* <Image
        //                         src="/images/bytebran-logo.png"
        //                         alt="Bytebran"
        //                         width={200}
        //                         height={45}
        //                         priority
        //                     /> */}
        //       </div>

        //       {/* <h2 className="text-[24px] font-medium text-[#1F1F1F] mb-6">Login</h2> */}
        //       <h2 className="text-[24px] font-medium text-[#1F1F1F] mb-6 text-left">
        //         Login
        //       </h2>

        //       <form onSubmit={handleSubmit} className="space-y-5">
        //         <div>
        //           {/* <label className="block text-[#1F1F1F] mb-2">Your Email / Username *</label> */}
        //           <Input
        //             name="username"
        //             label={
        //               <>
        //                 User Name <span className="text-red-500">*</span>
        //               </>
        //             }
        //             value={values.username}
        //             placeholder="Enter Your Email/Username"
        //             touched={touched}
        //             errors={errors}
        //             onChange={handleChange}
        //             onBlur={handleBlur}
        //             noSpace
        //             // className="w-full p-3 border border-[#E5E5E5] rounded-[4px] focus:outline-none focus:border-[#6200EE] bg-white"
        //           />
        //         </div>

        //         <div>
        //           {/* <label className="block tyext-[#1F1F1F] mb-2">Enter Password *</label> */}
        //           <Password
        //             name="password"
        //             label={
        //               <>
        //                 Password <span className="text-red-500">*</span>
        //               </>
        //             }
        //             value={values.password}
        //             placeholder="Enter Password"
        //             touched={touched}
        //             errors={errors}
        //             onChange={handleChange}
        //             onBlur={handleBlur}
        //             // className="w-full p-3 border border-[#E5E5E5] rounded-[4px] focus:outline-none focus:border-[#6200EE] bg-white"
        //           />
        //         </div>

        //         <div className="flex justify-between items-center">
        //           <div className="flex items-center">
        //             <CheckBox
        //               label="Remember Me"
        //               checked={values.rememberMe}
        //               onChange={(checked: boolean) =>
        //                 setFieldValue("rememberMe", checked)
        //               }
        //             />
        //           </div>
        //           <Link
        //             href="/forgot-password"
        //             className="text-[#6200EE] text-sm hover:underline"
        //           >
        //             Forgot password?
        //           </Link>
        //         </div>

        //         {/* <Button
        //                         loading={loading}
        //                         text="LOGIN"
        //                         // className="w-full py-3 bg-[#6200EE] text-white rounded-[4px] font-medium hover:bg-[#6200EE]/90 transition-colors"
        //                         type="submit"
        //               className="w-full rounded-md bg-blue-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 "

        //                         style="primary"
        //                     /> */}
        //         <Button
        //           text="LOGIN"
        //           className="w-full rounded-md bg-blue-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 "
        //           type="submit"
        //           style="primary"
        //           loading={loading}

        //           //   isLoading={isLoading}
        //           //   disabled={isLoading}
        //         />

        //         <div className="text-center">
        //           {/* <p className="text-sm text-[#1F1F1F]">
        //                             Don't have an account?{' '}
        //                             <Link href="/create-account" className="text-[#6200EE] hover:underline">
        //                                 Create an Account
        //                             </Link>
        //                         </p> */}
        //         </div>
        //       </form>
        //     </div>

        //     {/* Right Section */}
        //     <div className="flex-1 flex items-center justify-center shadow-lg">
        //       <Image
        //         src="/assets/images/LoginLogo.png"
        //         alt="Login"
        //         width={500}
        //         height={500}
        //         priority
        //         className="object-contain"
        //       />
        //     </div>
        //   </div>
        // </div>

        <div className="flex flex-row items-stretch shadow-2xl rounded-[40px] overflow-hidden">
            {/* Left Section (Image) */}
            <div className="flex-1 w-[400px] h-[500px] overflow-hidden flex items-center justify-center shadow-lg rounded-tl-lg rounded-bl-lg">
                <Icon
                    name="LoginLogo"
                    alt="Login"
                    width={400}
                    height={500}
                />
            </div>

            {/* Right Section (Login Form) */}
            <div className="w-[400px] h-[500px] p-5 border-2 rounded-tr-[40px] rounded-br-[40px] shadow-md bg-white">
                {/* Logo */}
                <div className="mb-6 flex justify-center">
                    <Icon
                        name="MenuLogoExpandedImage"
                        height={50}
                        width={220}
                        alt="Logo"
                    />
                </div>

                <h2 className="text-[24px] font-medium mb-6 text-center text-primary-primaryPurple">
                    Welcome Back
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <Input
                            name="username"
                            label={
                                <>
                                    User Name <span className="text-red-500">*</span>
                                </>
                            }
                            value={values.username}
                            placeholder="Enter Your Email/Username"
                            icon="UserOutline"
                            touched={touched}
                            errors={errors}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            noSpace
                        />
                    </div>

                    { process.env.NEXT_PUBLIC_SHOW_COMPANY_CODE == "true" && (
                        <div>
                            <Input
                                name="company_code"
                                label={
                                    <>
                                        Company Code <span className="text-red-500">*</span>
                                    </>
                                }
                                value={values.company_code}
                                placeholder="Enter Company Code"
                                icon="UserTenant"
                                touched={touched}
                                errors={errors}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                noSpace
                            />
                        </div>
                    )}

                    <div>
                        <Password
                            name="password"
                            label={
                                <>
                                    Password <span className="text-red-500">*</span>
                                </>
                            }
                            value={values.password}
                            placeholder="Enter Password"
                            touched={touched}
                            errors={errors}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <CheckBox
                                label="Remember Me"
                                checked={values.rememberMe}
                                onChange={(checked: boolean) =>
                                    setFieldValue("rememberMe", checked)
                                }
                            />
                        </div>
                        <Link
                            href="/forgot-password"
                            className="text-[#6200EE] text-sm hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <Button
                        text="LOGIN"
                        // className="w-full rounded-md bg-blue-600 py-2.5 text-sm font-semibold text-white transition-colors  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 "
                        className="w-full rounded-md bg-button-background py-2.5 text-sm font-semibold text-white transition-colors  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 "

                        type="submit"
                        style="primary"
                        icon="LoginIcon"
                        loading={loading}
                    />

                    {/* Terms & Condition */}
                    <div className="text-center">
                        <p className="text-[10px] text-gray-500  mt-4">
                            By clicking to continue, you agree to our{" "}
                            <span className="font-semibold text-gray-700">
                                Terms & Condition
                            </span>
                        </p>

                        {/* Powered by Bytebran */}
                        <p className="text-xs text-gray-600 text-center mt-4">
                            Powered by{" "}
                            <span className="text-blue-800 font-medium">Ringingo</span>
                        </p>
                    </div>
                </form>
            </div>
        </div>

    );
};

export default LoginForm;
