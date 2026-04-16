"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// PROJECT IMPORT
import {
    updateSingleUserGroupData,
    useSingleUserGroup,
    useUserGroup,
    userGroupCreate,
    userGroupUpdate,
} from "@/redux/slice/tenant-admin/userGroupSlice";
import {
    tenantOutgoingOptionsGet,
    useTenantOutgoingOptions,
} from "@/redux/slice/tenant-admin/tenantOutgoingSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useAuth } from "@/contexts/hooks/useAuth";
import { Danger, Success } from "@/redux/services/toasterServices";
import { CardForm } from "@/components/ui-components";
import { Input, Select, Switch } from "@/components/forms";

// TYPES IMPORT
import { InitialValueType } from "@/types/tenant-admin/userGroupTypes";
import { ManagerNameTypes } from "@/types/formTypes";

const CreateEditUserGroupForm = (props: ManagerNameTypes) => {
    const { managerName = "" } = props;

    const { id } = useParams();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { user } = useAuth();

    const userGroup = useUserGroup();
    const userGroupData = useSingleUserGroup();
    const outgoingOptions = useTenantOutgoingOptions();

    const [loading, setLoading] = useState<boolean>(false);

    const initialValues: InitialValueType = {
        name: "",
        status: "0",
        outbound_rule: "",
    };

    const validationSchema = Yup.object<InitialValueType>({
        name: Yup.string().required("Please Enter User Group Name"),
        outbound_rule: Yup.string().required("Please Select Outgoing Rule"),
    });

    // Calling Create User Group or Update User Group Based on Page
    const onSubmit = (values: any) => {
        const payload = { ...values };
        payload["tenant_uuid"] = user?.tenant_detail?.uuid;
        if (id) {
            onUpdateUserGroup(payload);
        } else {
            onCreateUserGroup(payload);
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
        onGetOutgoingOptions();
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useLayoutEffect(() => {
        if (!id) return;
        setValues({
            ...values,
            name: userGroupData?.name,
            status: userGroupData?.status || "0",
            outbound_rule: userGroupData?.outbound_rule,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userGroupData, id]);

    // Fetching Outgoing Rules Options
    const onGetOutgoingOptions = async () => {
        try {
            await dispatch(tenantOutgoingOptionsGet()).unwrap();
        } catch (err) {
            console.error("Get Outgoing Rules Options Err =-=>", err);
        }
    };

    // Create User Group & Navigate to User Group Page
    const onCreateUserGroup = async (values: any) => {
        setLoading(true);
        try {
            const payload = { ...values };
            const res: any = await dispatch(userGroupCreate(payload)).unwrap();
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
            console.error("Create User Group Err --->", e?.message);
        }
    };

    // Update User Group & Navigate to User Group Page
    const onUpdateUserGroup = async (values: any) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                id,
            };
            const res: any = await dispatch(userGroupUpdate(payload)).unwrap();
            if (res?.statusCode === 200) {
                Success(res.data);
                router.back();
                resetForm();
                dispatch(updateSingleUserGroupData({}));
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Update User Group Err --->", e?.message);
        }
    };

    return (
        <CardForm
            id={id}
            name="user_group"
            managerName={managerName}
            length={id ? 0 : userGroup?.count}
            title={id ? "Edit User Group" : "Create User Group"}
            loading={loading}
            handleSubmit={handleSubmit}
            onDoneClick={handleSubmit}
            onCancelClick={() => {
                resetForm();
                router.back();
                id && dispatch(updateSingleUserGroupData({}));
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
                />
                <Select
                    name="outbound_rule"
                    label={
                        <>
                            Outbound Rule <span className="text-red-500">*</span>
                        </>
                    }
                    placeholder="Select Outgoing Rule"
                    isAdd
                    createName="Create Outbound Rule"
                    createPath={
                        managerName
                            ? "/manager-group-user/outgoing-rules/create"
                            : "/tenant-group-user/outgoing-rules/create"
                    }
                    icon="OutgoingRules"
                    options={outgoingOptions}
                    value={values.outbound_rule}
                    touched={touched}
                    errors={errors}
                    onChange={(e: any) => {
                        setFieldValue("outbound_rule", e.target.value);
                    }}
                    onBlur={handleBlur}
                    isInfo
                />
                <Switch
                    className="pt-[2px]"
                    label="Status"
                    value={values.status}
                    onClick={(value: string) => setFieldValue("status", value)}
                />
            </div>
        </CardForm>
    );
};

export default CreateEditUserGroupForm;
