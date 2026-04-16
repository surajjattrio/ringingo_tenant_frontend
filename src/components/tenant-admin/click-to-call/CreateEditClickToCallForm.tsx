"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// PROJECT IMPORT
import {
    clickToCallCreate,
    clickToCallUpdate,
    updateSingleClickToCall,
    useSingleClickToCall,
} from "@/redux/slice/tenant-admin/clickToCallSlice";
import {
    didOptionsGet,
    useDidOptions,
} from "@/redux/slice/tenant-admin/didSlice";
import {
    useUserOptions,
    userOptionsGet,
} from "@/redux/slice/tenant-admin/userSlice";
import { Danger, Success } from "@/redux/services/toasterServices";
import { useAppDispatch } from "@/redux/hooks";
import { CardForm, Icon } from "@/components/ui-components";
import { Input, Select, Switch } from "@/components/forms";

// THIRD - PARTY IMPORT
import { CopyToClipboard } from "react-copy-to-clipboard";

// TYPES IMPORT
import { InitialValueType } from "@/types/tenant-admin/clickToCallTypes";
import { ManagerNameTypes } from "@/types/formTypes";

const CreateEditClickToCallForm = (props: ManagerNameTypes) => {
    const { managerName = "" } = props;
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();

    const singleClickToCallData = useSingleClickToCall();
    const didOptions = useDidOptions();
    const userOptions = useUserOptions();

    const [loading, setLoading] = useState<boolean>(false);

    const initialValues: InitialValueType = {
        name: "",
        status: "0",
        callier_id_number: "",
        user_uuid: "",
    };

    const validationSchema = Yup.object<InitialValueType>({
        name: Yup.string().required("Please Enter The Name"),
        callier_id_number: Yup.string().required("Please Select Caller Id"),
        user_uuid: Yup.string().required("Please Select User"),
    });

    // Create or Update click-to-call
    const onSubmit = (values: InitialValueType) => {
        const payload = { ...values };
        if (id) {
            onUpdateClickToCall(payload);
        } else {
            onCreateClickToCall(payload);
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
    } = useFormik({
        initialValues,
        validationSchema,
        onSubmit,
    });

    useEffect(() => {
        onGetDidOptions();
        onGetUserOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetching DID Options
    const onGetDidOptions = async () => {
        try {
            await dispatch(didOptionsGet());
        } catch (err) {
            console.error("Get DID Options Err =-=>", err);
        }
    };

    // Fetching User Options
    const onGetUserOptions = async () => {
        try {
            await dispatch(userOptionsGet());
        } catch (err) {
            console.error("Get User Options Err =-=>", err);
        }
    };

    useLayoutEffect(() => {
        if (!id) return;
        setValues({
            ...values,
            name: singleClickToCallData?.name,
            status: singleClickToCallData?.status || "0",
            callier_id_number: singleClickToCallData?.callier_id_number || "",
            user_uuid: singleClickToCallData?.user_uuid || "",
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [singleClickToCallData, id]);

    // Create click-to-call & Navigate to click-to-call Nunmber Page
    const onCreateClickToCall = async (values: any) => {
        setLoading(true);
        try {
            const payload = { ...values };
            const res: any = await dispatch(clickToCallCreate(payload)).unwrap();
            if (res?.statusCode === 201) {
                Success(res.data);
                resetForm();
                router.back();
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Create click-to-call Err --->", e?.message);
        }
    };

    // Update click-to-call & Navigate to click-to-call Nunmber Page
    const onUpdateClickToCall = async (values: any) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                id,
            };
            const res: any = await dispatch(clickToCallUpdate(payload)).unwrap();
            if (res?.statusCode === 200) {
                Success(res.data);
                resetForm();
                router.back();
                dispatch(updateSingleClickToCall({}));
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Update click-to-call Err --->", e?.message);
        }
    };

    return (
        <CardForm
            name="click_to_call"
            id={id}
            managerName={managerName}
            title={id ? "Edit Click to Call" : "Create Click to Call"}
            loading={loading}
            handleSubmit={handleSubmit}
            onDoneClick={handleSubmit}
            onCancelClick={() => {
                resetForm();
                router.back();
                id && dispatch(updateSingleClickToCall({}));
            }}
        >
            <div className="pt-5 pb-10 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4 px-4">
                <Input
                    name="name"
                    label={
                        <>
                            Name <span className="text-red-500">*</span>
                        </>
                    }
                    icon="UserOutline"
                    placeholder="Enter Name"
                    value={values.name}
                    touched={touched}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInfo
                    noSpace
                />
                <Select
                    name="callier_id_number"
                    label={
                        <>
                            Caller Id <span className="text-red-500">*</span>
                        </>
                    }
                    icon="CallerIdGroup"
                    placeholder="Select Caller ID"
                    removable
                    options={didOptions}
                    value={values.callier_id_number}
                    touched={touched}
                    errors={errors}
                    onChange={(e: any) => {
                        setFieldValue("callier_id_number", e.target.value);
                    }}
                    onBlur={handleBlur}
                    isInfo
                />
                <Select
                    name="user_uuid"
                    label={
                        <>
                            User <span className="text-red-500">*</span>
                        </>
                    }
                    icon="UserGray"
                    placeholder="Select User"
                    value={values.user_uuid}
                    options={userOptions}
                    touched={touched}
                    errors={errors}
                    onChange={(e: any) => {
                        setFieldValue("user_uuid", e.target.value);
                    }}
                    onBlur={handleBlur}
                    isInfo
                />
                <Switch
                    label="Status"
                    value={values.status}
                    onClick={(value: string) => setFieldValue("status", value)}
                />
            </div>
            {!!id ? (
                <div>
                    <div className="border-t border-dark-800 pt-2">
                        <span className="font-bold text-sm text-heading">Get your URL</span>
                        <div className="bg-dark-950 rounded-lg w-[60%] p-4 mt-2 flex">
                            <div className="w-[60%] break-words">
                                <p className="text-xs w-">{singleClickToCallData?.url}</p>
                            </div>
                            <div className="w-[40%] flex justify-end">
                                <CopyToClipboard
                                    onCopy={() => Success("URL Copied Successfully")}
                                    text={singleClickToCallData?.url}
                                >
                                    <Icon
                                        className="cursor-pointer"
                                        tooltip="Copy"
                                        name="Copy"
                                        alt="Copy"
                                        width={20}
                                        height={20}
                                    />
                                </CopyToClipboard>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </CardForm>
    );
};

export default CreateEditClickToCallForm;
