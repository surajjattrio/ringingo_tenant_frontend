"use client";
import { useLayoutEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// PROJECT IMPORT
import {
    blockInboundCampaignCreate,
    blockInboundCampaignUpdate,
    singleBlockInboundCampaignGet,
} from "@/redux/slice/tenant-admin/blockInboundCampaignSlice";
import { Danger, Success } from "@/redux/services/toasterServices";
import { useAppDispatch } from "@/redux/hooks";
import { CardForm, Loader } from "@/components/ui-components";
import { Input, Select, Switch } from "@/components/forms";

// TYPES IMPORT
import { InitialValueType } from "@/types/tenant-admin/blockInboundTypes";

// OPTION IMPORT
import { blockTypeOption } from "@/config/options";
import { ManagerNameTypes } from "@/types/formTypes";

const CreateEditBlockInboundCampaign = (props: ManagerNameTypes) => {
    const { managerName = "" } = props;

    const { id } = useParams();
    const dispatch = useAppDispatch();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const initialValues: InitialValueType = {
        name: "",
        type: "",
        status: "0",
        type_value: "",
    };

    const validationSchema = Yup.object<InitialValueType>({
        name: Yup.string().required("Please Enter The Name"),
        type: Yup.string().required("Please Select Any Type"),
        type_value: Yup.string().required("Please Enter Type Value"),
    });

    // Create or Update block-inbound-campaign
    const onSubmit = (values: InitialValueType) => {
        const payload = { ...values };
        if (id) {
            onUpdateBlockInboundCampaign(payload);
        } else {
            onCreateBlockInboundCampaign(payload);
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

    const onGetSingleBlockInbound = async () => {
        setIsLoading(true);
        try {
            const res: any = await dispatch(
                singleBlockInboundCampaignGet(id)
            ).unwrap();
            if (res && res.statusCode === 200) {
                setValues({
                    ...values,
                    name: res?.data?.name || "",
                    type: res?.data?.type || "",
                    type_value: res?.data?.type_value || "",
                    status: res?.data?.status || "0",
                });
                setIsLoading(false);
            }
        } catch (error: any) {
            setIsLoading(false);
            console.log("get single block inbound err --->", error?.message);
        }
    };

    useLayoutEffect(() => {
        if (!id) return;
        onGetSingleBlockInbound();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // Create block-inbound-campaign & Navigate to block-inbound-campaign Nunmber Page
    const onCreateBlockInboundCampaign = async (values: any) => {
        setLoading(true);
        try {
            const payload = { ...values };
            const res: any = await dispatch(
                blockInboundCampaignCreate(payload)
            ).unwrap();
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
            console.error("Create block-inbound-campaign Err --->", e?.message);
        }
    };

    // Update block-inbound-campaign & Navigate to block-inbound-campaign Nunmber Page
    const onUpdateBlockInboundCampaign = async (values: any) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                id,
            };
            const res: any = await dispatch(
                blockInboundCampaignUpdate(payload)
            ).unwrap();
            if (res?.statusCode === 200) {
                Success(res.data);
                resetForm();
                router.back();
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Update block-inbound-campaign Err --->", e?.message);
        }
    };

    return (
        <CardForm
            id={id}
            managerName={managerName}
            title={
                id ? "Edit Block Inbound Call" : "Create Block Inbound Call"
            }
            loading={loading}
            handleSubmit={handleSubmit}
            onDoneClick={handleSubmit}
            onCancelClick={() => {
                resetForm();
                router.back();
            }}
        >
            {isLoading ? (
                <Loader />
            ) : (
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
                        //noSpace
                    />
                    <Select
                        name="type"
                        label={
                            <>
                                Type <span className="text-red-500">*</span>
                            </>
                        }
                        icon="Type"
                        placeholder="Select Type"
                        removable
                        options={blockTypeOption}
                        value={values.type}
                        touched={touched}
                        errors={errors}
                        onChange={(e: any) => {
                            setFieldValue("type", e.target.value);
                        }}
                        onBlur={handleBlur}
                        isInfo
                    />
                    <Input
                        name="type_value"
                        label={
                            <>
                                Value <span className="text-red-500">*</span>
                            </>
                        }
                        icon="Value"
                        placeholder="Enter Value"
                        value={values.type_value}
                        touched={touched}
                        errors={errors}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInfo
                        noSpace
                    />
                    <Switch
                        label="Status"
                        value={values.status}
                        onClick={(value: string) => setFieldValue("status", value)}
                    />
                </div>
            )}
        </CardForm>
    );
};

export default CreateEditBlockInboundCampaign;
