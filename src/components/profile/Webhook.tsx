"use client";
import { useEffect, useState } from "react";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// PROJECT IMPORT
import { useAppDispatch } from "@/redux/hooks";
import { Button, Input, Switch } from "../forms";
import { webHookCreate, webHookGet } from "@/redux/slice/profileSlice";
import { Danger, Success } from "@/redux/services/toasterServices";
import { useAuth } from "@/contexts/hooks/useAuth";
import { CardForm, Loader } from "../ui-components";

interface InitialValueType {
    web_hook_url: string;
    status: string;
    notify: string;
}
const Webhook = () => {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { user } = useAuth();

    const initialValues: InitialValueType = {
        web_hook_url: "",
        status: "0",
        notify: "0",
    };

    const validationSchema = Yup.object<InitialValueType>({
        web_hook_url: Yup.string().required("Please Enter Webhook Url"),
    });

    const getWebHook = async () => {
        setIsLoading(true);
        try {
            let id: any = user?.tenant_detail?.uuid || "";
            const res: any = await dispatch(webHookGet(id)).unwrap();
            if (res && res?.statusCode === 200) {
                setValues({
                    ...values,
                    web_hook_url: res?.data?.web_hook_url || "",
                    notify: res?.data?.notify || "0",
                    status: res?.data?.status || "0",
                });
                setIsLoading(false);
            } else {
                setIsLoading(false);
            }
        } catch (error: any) {
            setIsLoading(false);
            console.log("get web-hook err -->", error?.message);
        }
    };

    useEffect(() => {
        getWebHook();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Create or Update IVR
    const onSubmit = async (values: any) => {
        setLoading(true);
        try {
            let payload = { ...values };
            const res: any = await dispatch(webHookCreate(payload)).unwrap();
            if (res?.statusCode === 200) {
                Success(res?.data);
                getWebHook();
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (error: any) {
            setLoading(false);
            console.log("create web-hook err -->", error?.message);
        }
    };

    const {
        values,
        touched,
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        setValues,
    } = useFormik<any>({
        initialValues,
        validationSchema,
        onSubmit,
    });

    return (
        <CardForm
            title="Webhooks"
            onDoneClick={handleSubmit}
            isCancelClick={false}
            isCancelIcon={false}
            loading={loading}
        >
            {isLoading ? (
                <Loader />
            ) : (
                <div className="grid grid-cols-3 tmd:grid-cols-2 tsm:grid-cols-1 gap-4 py-3">
                    <Input
                        name="web_hook_url"
                        label={
                            <>
                                URL <span className="text-red-500">*</span>
                            </>
                        }
                        icon="URL"
                        placeholder="Enter Webhook URL"
                        value={values.web_hook_url}
                        touched={touched}
                        errors={errors}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInfo
                    />
                    <Switch
                        className="pt-[2px]"
                        label="Notify"
                        trueName="All Call"
                        falseName="Missed Call"
                        value={values?.notify}
                        onClick={(value: string) => setFieldValue("notify", value)}
                    />
                </div>
            )}
        </CardForm>
    );
};

export default Webhook;
