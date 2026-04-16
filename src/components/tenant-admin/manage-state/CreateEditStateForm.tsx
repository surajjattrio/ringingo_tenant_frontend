"use client";
import { useLayoutEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// PROJECT IMPORT
import {
    stateCreate, stateUpdate, updateSingleStateData, useSingleState, useStates,
} from "@/redux/slice/tenant-admin/manageStateSlice";

import { useAppDispatch } from "@/redux/hooks";
import { CardForm } from "@/components/ui-components";
import { Input, Switch } from "@/components/forms";

// TYPES IMPORT
import { Danger, Success } from "@/redux/services/toasterServices";
import { InitialValueType } from "@/types/tenant-admin/manageStateTypes";
import { ManagerNameTypes } from "@/types/formTypes";

const CreateEditStateForm = (props: ManagerNameTypes) => {
    const { managerName = "" } = props;
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const router = useRouter();

    const state = useStates();
    const stateData = useSingleState();

    const [loading, setLoading] = useState<boolean>(false);

    const initialValues: InitialValueType = {
        state_name: "",
        state_code: "",
        toggle_status: "0",
    };

    const validationSchema = Yup.object<InitialValueType>({
        state_code: Yup.string().required("Please Enter Your State Code"),
        state_name: Yup.string().required("Please Enter Your State Name"),
    });

    // Create or Update State number
    const onSubmit = (values: any) => {
        const payload = { ...values };
        // payload["tenant_uuid"] = user?.tenant_detail?.uuid;
        if (id) {
            onUpdateState(payload);
        } else {
            onCreateState(payload);
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

    useLayoutEffect(() => {
        if (!id) return;
        setValues({
            ...values,
            state_code: stateData?.state_code || '',
            state_name: stateData?.state_name || "",
            toggle_status: stateData?.toggle_status || "0",
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stateData, id]);


    // Fetching Single State Data
    // const onGetSingleStateData = async () => {
    //     try {
    //         const res: any = await dispatch(stateSingleGet(id)).unwrap();
    //         if (res?.statusCode === 200) {
    //             const stateData = res?.data;
    //             setValues({
    //                 ...values,
    //                 state_code: stateData?.state_code,
    //                 state_name: stateData?.state_name || "",
    //                 toggle_status: stateData?.toggle_status || "0",
    //             });
    //         }
    //     } catch (err) {
    //         console.error("Get Single State Data Err =-=>", err);
    //     }
    // };

    // Create State & Navigate to State  Page
    const onCreateState = async (values: any) => {
        setLoading(true);
        try {
            const payload = { ...values };
            const res: any = await dispatch(stateCreate(payload)).unwrap();
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
            console.error("Create State Err --->", e?.message);
        }
    };

    // Update State & Navigate to State  Page
    const onUpdateState = async (values: any) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                id,
            };
            const res: any = await dispatch(stateUpdate(payload)).unwrap();
            if (res?.statusCode === 200) {
                Success(res.data);
                resetForm();
                router.back();
                dispatch(updateSingleStateData({}));
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Update State Err --->", e?.message);
        }
    };

    return (
        <CardForm
            id={id}
            managerName={managerName}
            name="state"
            length={id ? 0 : state?.count}
            title={id ? "Edit State" : "Create State"}
            loading={loading}
            handleSubmit={handleSubmit}
            onDoneClick={handleSubmit}
            onCancelClick={() => {
                resetForm();
                router.back();
                id && dispatch(updateSingleStateData({}));
            }}
        >
            <div className="pt-5 pb-10 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4 px-4">
                <Input
                    type="text"
                    name="state_code"
                    label=
                    {
                        <>
                            State Code <span className="text-red-500">*</span>
                        </>
                    }
                    icon="Code"
                    placeholder="Enter State Code"
                    value={values.state_code}
                    touched={touched}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInfo
                />
                <Input
                    type="text"
                    name="state_name"
                    label=
                    {
                        <>
                            State Name <span className="text-red-500">*</span>
                        </>
                    }
                    icon="UserOutline"
                    placeholder="Enter State Name"
                    value={values.state_name}
                    touched={touched}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInfo
                />

                <Switch
                    label="Status"
                    value={values.toggle_status}
                    onClick={(value: string) => setFieldValue("toggle_status", value)}
                />
            </div>
        </CardForm>
    );
};

export default CreateEditStateForm;
