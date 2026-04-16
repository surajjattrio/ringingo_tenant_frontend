"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// PROJECT IMPORT
import {
    leadGroupCreate,
    leadGroupUpdate,
    leadGroupSingleGet,
    leadGroupCampaignGet,
    useLeadGroupCampaignOptions,
} from "@/redux/slice/tenant-admin/leadGroupSlice";
import {
    useUserGroupsOptions,
    userGroupOptionsGet,
} from "@/redux/slice/tenant-admin/userGroupSlice";

// import {
//     useOutboundOptions,
//     outboundOptionsGet,
// } from "@/redux/slice/tenant-admin/outboundSlice";

import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import { useAuth } from "@/contexts/hooks/useAuth";
import { Input, Select, Switch } from "@/components/forms";
import { CardForm } from "@/components/ui-components";

// TYPES IMPORT
import { InitialValueType } from "@/types/tenant-admin/leadGroupTypes";
import { ManagerNameTypes } from "@/types/formTypes";
// import { campaignOptionsGet, useCampaignOptions } from "@/redux/slice/tenant-admin/campaignReportSlice";

const CreateEditLeadGroupForm = (props: ManagerNameTypes) => {
    const { managerName = "" } = props;
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { user } = useAuth();
    const userGroupOptions = useUserGroupsOptions();
    // const outboundOptions = useOutboundOptions();
    let campaignOptions = useLeadGroupCampaignOptions();

    const [loading, setLoading] = useState<boolean>(false);

    const initialValues: InitialValueType = {
        name: "",
        user_group_uuid: "",
        description: "",
        campaign_uuid: "",
        status: "0",
    };

    const validationSchema = Yup.object<InitialValueType>({
        name: Yup.string().required("Please Enter Name"),
        user_group_uuid: Yup.string().required("Please Select User Group"),
    });

    // Create Lead Group
    const onSubmit = (values: any) => {
        const payload = new FormData();
        payload.append("name", values?.name);
        payload.append("user_group_uuid", values?.user_group_uuid);
        payload.append("description", values?.description);
        payload.append("campaign_uuid", values?.campaign_uuid);
        payload.append("tenant_uuid", user?.tenant_detail?.uuid);
        if (id) {
            onUpdateLeadGroup(values);
        } else {
            onCreateLeadGroup(values);
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
        onGetSingleLeadGroupData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    useEffect(() => {
        onGetUserGroupOptions();
        // onGetOutboundOptions();
        onGetCampaignOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetching User Group Options
    const onGetUserGroupOptions = () => {
        try {
            dispatch(userGroupOptionsGet());
        } catch (err) {
            console.error("Get User Group Options Err =-=>", err);
        }
    };

    // Fetching Outbound Options
    // const onGetOutboundOptions = async () => {
    //     try {
    //         await dispatch(outboundOptionsGet()).unwrap();
    //     } catch (err) {
    //         console.error("Get Outbound Options Err =-=>", err);
    //     }
    // };

    // Fetching Single Lead Group Data
    const onGetSingleLeadGroupData = async () => {
        try {
            const res: any = await dispatch(leadGroupSingleGet(id)).unwrap();
            if (res?.statusCode === 200) {
                const leadGroupData = res?.data;
                setValues({
                    ...values,
                    name: leadGroupData?.name,
                    user_group_uuid: leadGroupData?.user_group_uuid,
                    description: leadGroupData?.description,
                    campaign_uuid: leadGroupData?.campaign_uuid,
                    status: leadGroupData?.status || "0",
                });
            }
        } catch (err) {
            console.error("Get Single Lead Group Data Err =-=>", err);
        }
    };

    // Create Lead Group & Navigate to Lead group Page
    const onCreateLeadGroup = async (values: any) => {
        setLoading(true);
        try {
            const payload = { ...values };
            const res: any = await dispatch(leadGroupCreate(payload)).unwrap();
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
            console.error("Create Lead Group Err --->", e?.message);
        }
    };

    // Update Lead Group & Navigate to Lead Group Page
    const onUpdateLeadGroup = async (values: any) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                id,
            };
            const res: any = await dispatch(leadGroupUpdate(payload)).unwrap();
            if (res?.statusCode === 200) {
                Success(res.data);
                router.back();
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Update Lead Group Err --->", e?.message);
        }
    };

    const onGetCampaignOptions = async () => {
        try {
            await dispatch(leadGroupCampaignGet()).unwrap();
        } catch (err) {
            console.error("Get campaign Options Err =-=>", err);
        }
    };

    return (
        <CardForm
            id={id}
            name="leadgroup"
            managerName={managerName}
            loading={loading}
            title={id ? "Edit Lead group" : "Create Lead group"}
            handleSubmit={handleSubmit}
            onDoneClick={handleSubmit}
            onCancelClick={() => {
                router.back();
            }}
        >
            <div className="pt-5 pb-10 space-y-[30px]">
                <div className="grid grid-cols-3">
                    <div className="px-4">
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
                        />
                    </div>
                    <div className="px-4">
                        <Select
                            name="user_group_uuid"
                            label={
                                <>
                                    User Group <span className="text-red-500">*</span>
                                </>
                            }
                            icon="UserGroup"
                            placeholder="Select User Group"
                            options={userGroupOptions}
                            value={values.user_group_uuid}
                            touched={touched}
                            errors={errors}
                            onChange={(e: any) => {
                                setFieldValue("user_group_uuid", e.target.value);
                            }}
                            onBlur={handleBlur}
                            isInfo
                        />
                    </div>
                    <div className="px-4">
                        <Input
                            name="description"
                            label="Description"
                            icon="Description"
                            placeholder="Enter Description"
                            value={values.description}
                            touched={touched}
                            errors={errors}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInfo
                        />
                    </div>
                </div>
                <div className="grid grid-cols-3">
                    <div className="px-4">
                        <Select
                            name="campaign_uuid"
                            label="Campaign"
                            icon="Campaign"
                            placeholder="Select Campaign"
                            options={campaignOptions}
                            value={values.campaign_uuid}
                            touched={touched}
                            errors={errors}
                            onChange={(e: any) => {
                                setFieldValue("campaign_uuid", e.target.value);
                            }}
                            onBlur={handleBlur}
                            isInfo
                            isGroup
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

export default CreateEditLeadGroupForm;
