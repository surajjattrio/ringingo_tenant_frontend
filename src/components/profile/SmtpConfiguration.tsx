"use client";
import { useEffect, useState } from "react";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// PROJECT IMPORT
import { useAppDispatch } from "@/redux/hooks";
import {
    smtpConfigurationCreate,
    smtpConfigurationGet,
    smtpConfigurationUpdate,
} from "@/redux/slice/profileSlice";
import { Input, Password } from "../forms";
import { Danger, Success } from "@/redux/services/toasterServices";
import { CardForm, Loader } from "../ui-components";
import { useAuth } from "@/contexts/hooks/useAuth";

interface InitialValueType {
    host: string;
    port: string;
    from: string;
    username: string;
    password: string;
}
const SmtpConfiguration = () => {
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [uuid, setUuid] = useState<string | null>(null);
    const { user } = useAuth();

    const initialValues: InitialValueType = {
        host: "",
        port: "",
        from: "",
        username: "",
        password: "",
    };

    const validationSchema = Yup.object<InitialValueType>({
        host: Yup.string().required("Please Enter Your Host"),
        port: Yup.string().required("Please Enter Port"),
        from: Yup.string().required("Please Enter From"),
        username: Yup.string().required("Please Enter Username"),
        // password: Yup.string().required("Please enter password"),
        password: Yup.string()
            .required("Please Enter Password")
            .min(8, "Password must be at least 8 characters")
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).+$/, "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"),
    });

    const getSmtpConfiguration = async () => {
        setIsLoading(true);
        try {
            const res: any = await dispatch(smtpConfigurationGet()).unwrap();
            if (res && res?.statusCode === 200) {
                setValues({
                    ...values,
                    host: res?.data?.host || "",
                    port: res?.data?.port || "",
                    from: res?.data?.from || "",
                    username: res?.data?.username || "",
                    password: res?.data?.password || "",
                });
                setUuid(res?.data?.uuid || null);
                setIsLoading(false);
            } else {
                setIsLoading(false);
            }
        } catch (error: any) {
            setIsLoading(false);
            console.log("get SMTP config err -->", error?.message);
        }
    };

    useEffect(() => {
        getSmtpConfiguration();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Create or Update SMTP
    const onSubmit = (values: any) => {
        if (uuid) {
            onEditSmtpConfiguration(values);
        } else {
            onCreateSmtpConfiguration(values);
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
    } = useFormik<any>({
        initialValues,
        validationSchema,
        onSubmit,
    });

    const onCreateSmtpConfiguration = async (values: any) => {
        setLoading(true);
        try {
            const res: any = await dispatch(smtpConfigurationCreate(values)).unwrap();
            if (res?.statusCode === 201) {
                Success(res?.data);
                getSmtpConfiguration();
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (err) {
            Danger("");
            setLoading(false);
            console.error("Create SMTP Configuration Err =-=>", err);
        }
    };

    const onEditSmtpConfiguration = async (values: any) => {
        setLoading(true);
        try {
            const res: any = await dispatch(smtpConfigurationUpdate(values)).unwrap();
            if (res?.statusCode === 200) {
                Success(res?.data);
                getSmtpConfiguration();
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (err) {
            Danger("");
            setLoading(false);
            console.error("Create SMTP Configuration Err =-=>", err);
        }
    };

    return (
        <div className="bg-white p-5 rounded-[25px]">
            <CardForm
                // className="border bg-gray-5"
                title={user?.role === "tenant" ? "Email SMTP" : "Email Settings"}
                loading={loading}
                onDoneClick={handleSubmit}
                isCancelClick={false}
                isCancelIcon={false}
            >
                {isLoading ? (
                    <Loader />
                ) : (
                    <div className="grid grid-cols-3 tmd:grid-cols-2 tsm:grid-cols-1 gap-4 py-3">
                        <Input
                            name="host"
                            label={
                                <>
                                    Host <span className="text-red-500">*</span>
                                </>
                            }
                            icon="Host"
                            placeholder="Enter Host"
                            value={values.host}
                            touched={touched}
                            errors={errors}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInfo
                        />
                        <Input
                            name="port"
                            label={
                                <>
                                    Port <span className="text-red-500">*</span>
                                </>
                            }
                            icon="Port"
                            placeholder="Enter Port"
                            value={values.port}
                            touched={touched}
                            errors={errors}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInfo
                        />
                        <Input
                            name="from"
                            label={
                                <>
                                    From <span className="text-red-500">*</span>
                                </>
                            }
                            icon="From"
                            placeholder="Enter From"
                            value={values.from}
                            touched={touched}
                            errors={errors}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInfo
                        />
                        <Input
                            name="username"
                            label={
                                <>
                                    Username <span className="text-red-500">*</span>
                                </>
                            }
                            icon="UserOutline"
                            placeholder="Enter Username"
                            value={values.username}
                            touched={touched}
                            errors={errors}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInfo
                        />
                        <Password
                            label={
                                <>
                                    Password <span className="text-red-500">*</span>
                                </>
                            }
                            name="password "
                            value={values.password}
                            placeholder="Enter Password"
                            touched={touched}
                            errors={errors}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInfo
                        />
                    </div>
                )}
            </CardForm>
        </div>
    );
};

export default SmtpConfiguration;
