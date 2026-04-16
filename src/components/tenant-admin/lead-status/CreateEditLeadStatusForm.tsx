"use client";
import { useLayoutEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// PROJECT IMPORT
import {
    tenantDispositionCreate,
    tenantDispositionUpdate,
    updateSingleTenantDispositionData,
    useSingleTenantDisposition,
} from "@/redux/slice/tenant-admin/leadStatusSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { useAuth } from "@/contexts/hooks/useAuth";
import { Input, Switch } from "@/components/forms";
import { CardForm } from "@/components/ui-components";

// TYPES IMPORT
import { InitialValueType } from "@/types/tenant-admin/tenantDispositionTypes";
import { ManagerNameTypes } from "@/types/formTypes";

const CreateEditLeadStatusForm = (props: ManagerNameTypes) => {
    const { managerName = "" } = props;
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { user } = useAuth();
    const dispositionData = useSingleTenantDisposition();
    console.log("dispositionData",dispositionData);

    const [loading, setLoading] = useState<boolean>(false);

    const initialValues: InitialValueType = {
        name: "",
        code: "",
        status: "0",
         level: 0,                // ✅ new field
        parent_disposition: "",   // ✅ new field
        has_children: false,  // ✅ new field
         campaign_uuid: ""
    };

    const validationSchema = Yup.object<InitialValueType>({
        name: Yup.string().required("Please Enter Name"),
        code: Yup.string().required("Please Enter Code"),
    });

    //  // Create Disposition
    const onSubmit = (values: any) => {
        const payload = new FormData();
        payload.append("name", values?.name);
        payload.append("code", values?.code);
        payload.append("status", "0");
        payload.append("tenant_uuid", user?.tenant_detail?.uuid);
        if (id) {
            onUpdateDisposition(values);
        } else {
            onCreateDisposition(values);
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
    } = useFormik<any>({
        initialValues,
        validationSchema,
        onSubmit,
    });

    useLayoutEffect(() => {
        if (!id) return;
        // onGetSingleDispositionData();
        setValues({
            ...values,
            name: dispositionData?.name,
            code: dispositionData?.code,
            status: dispositionData?.status || "0",
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispositionData, id]);

    // Create Disposition & Navigate to Disposition Page
    const onCreateDisposition = async (values: any) => {
        setLoading(true);
        try {
            const payload = { ...values };
            const res: any = await dispatch(
                tenantDispositionCreate(payload)
            ).unwrap();
            if (res?.statusCode === 201) {
                router.back();
                resetForm();
                Success(res.data);
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Create Disposition Err --->", e?.message);
        }
    };

    // Update Disposition & Navigate to Disposition Page
    const onUpdateDisposition = async (values: any) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                id,
            };
            const res: any = await dispatch(
                tenantDispositionUpdate(payload)
            ).unwrap();
            if (res?.statusCode === 200) {
                router.back();
                Success(res.data);
                resetForm();
                dispatch(updateSingleTenantDispositionData({}));
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Update Disposition Err --->", e?.message);
        }
    };

    return (
        <CardForm
            className="border bg-gray-5"
            id={id}
            name="leadstatus"
            managerName={managerName}
            // length={disposition?.count}
            loading={loading}
            title={id ? "Edit Lead Status" : "Create Lead Status"}
            handleSubmit={handleSubmit}
            onDoneClick={handleSubmit}
            onCancelClick={() => {
                resetForm();
                router.back();
                id && dispatch(updateSingleTenantDispositionData({}));
            }}
        >
            <div className="pt-5 pb-10 space-y-[30px]">
                <div className="grid grid-cols-3">
                    <div className="px-4">
                        <Input
                            name="name"
                            label={
                                <>
                                    Status Name <span className="text-red-500">*</span>
                                </>
                            }
                            icon="StatusName"
                            placeholder="Enter Status Name"
                            value={values.name}
                            touched={touched}
                            errors={errors}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInfo
                        />
                    </div>

                    <div className="px-4">
                        <Input
                            name="code"
                            label={
                                <>
                                Code <span className="text-red-500">*</span>
                                </>
                            }
                            icon="Code"
                            placeholder="Enter Code"
                            value={values.code}
                            touched={touched}
                            errors={errors}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInfo
                        />
                    </div>

                    <div className="px-4">
                        <Switch
                            className="pt-[2px]"
                            switchButtonClass="py-1.5"
                            label="Status"
                            value={values.status}
                            onClick={(value: string) => setFieldValue("status", value)}
                        />
                    </div>
                </div>
            </div>
        </CardForm>
    );
};

export default CreateEditLeadStatusForm;

