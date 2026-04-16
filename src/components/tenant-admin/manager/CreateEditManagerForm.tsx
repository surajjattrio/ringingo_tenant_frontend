"use client";
import { useLayoutEffect, useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

// THIRD PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// PROJECT IMPORT
import {
    managerCreate,
    managerUpdate,
    updateSingleManagerData,
    managerSingleGet,
    useManager,
} from "@/redux/slice/tenant-admin/managerSlice";
import {
    useRolesOptions,
    rolesOptionsGet,
} from "@/redux/slice/tenant-admin/managerRoleSlice";
import {
    useSipOptions,
    sipOptionsGet,
} from "@/redux/slice/tenant-admin/sipDevicesSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useAuth } from "@/contexts/hooks/useAuth";
import { CardForm , Icon} from "@/components/ui-components";
import { Input, Select, Switch, Password } from "@/components/forms";
import { usePathname } from "next/navigation";
import { ManagerNameTypes } from "@/types/formTypes";

// TYPES IMPORT
import { Danger, Success } from "@/redux/services/toasterServices";
import { InitialValueType } from "@/types/tenant-admin/managerTypes";

const CreateEditManagerForm = (props: ManagerNameTypes) => {
    const { managerName = "" } = props;
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const router = useRouter();

    const manager = useManager();

    const sipOptions = useSipOptions();
    const rolesOptions = useRolesOptions();

    const { user } = useAuth();

    const [loading, setLoading] = useState<boolean>(false);

    const initialValues: InitialValueType = {
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        status: "0",
        password: "",
        manager_role_uuid: "",
        extension_uuid: "",
    };

    const validationSchema = Yup.object<InitialValueType>({
        first_name: Yup.string().required("Please Enter Your First Name"),
        username: Yup.string().required("Please Enter Your User Name"),
        email: Yup.string()
            .email("Invalid Email")
            .required("Please Enter Your Email"),
        password: Yup.string().required("Please Enter Your Password"),
        manager_role_uuid: Yup.string().required("Please Enter Your Manager Role"),
        extension_uuid: Yup.string().required("Please Enter Your SIP Device"),
    });

    // Create or Update Manager number
    const onSubmit = (values: any) => {
        const payload = { ...values };
        payload["tenant_uuid"] = user?.tenant_detail?.uuid;
        if (id) {
            onUpdateManager(payload);
        } else {
            onCreateManager(payload);
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

    const pathname = usePathname();
    let isPathname = pathname?.split("-")?.[0] === "/manager";

    const getSingleManager = async () => {
        try {
            let res: any = await dispatch(managerSingleGet(id)).unwrap();
            if (res && res?.statusCode === 200) {
                setValues({
                    ...values,
                    first_name: res?.data?.first_name,
                    last_name: res?.data?.last_name,
                    username: res?.data?.username,
                    status: res?.data?.status || "0",
                    email: res?.data?.email,
                    password: res?.data?.password,
                    manager_role_uuid: res?.data?.manager_role_uuid,
                    extension_uuid: res?.data?.extension_uuid,
                });
            }
        } catch (error: any) {
            console.log("single manager details err:-->", error?.message);
        }
    };

    useLayoutEffect(() => {
        if (!id) return;
        getSingleManager();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    useEffect(() => {
        onGetSipOptions();
        onGetRolesOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetching SIP Devices Options
    const onGetSipOptions = async () => {
        try {
            await dispatch(sipOptionsGet()).unwrap();
        } catch (err) {
            console.error("Get sip Devices Options Err =-=>", err);
        }
    };

    // Fetching Manager Role Options
    const onGetRolesOptions = async () => {
        try {
            await dispatch(rolesOptionsGet()).unwrap();
            // console.log(a,'111');
        } catch (err) {
            console.error("Get Manager Role Options Err =-=>", err);
        }
    };

    // Fetching Single Manager Data
    const onGetSingleManagerData = async () => {
        try {
            const res: any = await dispatch(managerSingleGet(id)).unwrap();
            if (res?.statusCode === 200) {
                const managerData = res?.data;
                setValues({
                    ...values,
                    first_name: managerData?.first_name,
                    last_name: managerData?.last_name,
                    username: managerData?.username,
                    email: managerData?.email,
                    password: managerData?.password,
                    manager_role_uuid: managerData?.manager_role_uuid,
                    extension_uuid: managerData?.extension_uuid,
                    status: managerData?.status || "0",
                });
            }
        } catch (err) {
            console.error("Get Single Manager Data Err =-=>", err);
        }
    };

    // Create Manager & Navigate to Manager  Page
    const onCreateManager = async (values: any) => {
        setLoading(true);
        try {
            const payload = { ...values };
            const res: any = await dispatch(managerCreate(payload)).unwrap();
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
            console.error("Create Manager Err --->", e?.message);
        }
    };

    // Update Manager & Navigate to Manager  Page
    const onUpdateManager = async (values: any) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                id,
            };
            const res: any = await dispatch(managerUpdate(payload)).unwrap();
            if (res?.statusCode === 200) {
                Success(res.data);
                resetForm();
                router.back();
                dispatch(updateSingleManagerData({}));
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Update Manager Err --->", e?.message);
        }
    };

    return (
        <CardForm   
            id={id}
            name="manager"
            managerName={managerName}
            length={id ? 0 : manager?.count}
            title={id ? "Edit Manager" : "Create Manager"}
            loading={loading}
            handleSubmit={handleSubmit}
            onDoneClick={handleSubmit}
            onCancelClick={() => {
                resetForm();
                router.back();
                id && dispatch(updateSingleManagerData({}));
            }}
        >
            <div className="pt-5 pb-10 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4 px-4">
                <Input
                    type="text"
                    name="first_name"
                    label={
                        <>
                            First Name <span className="text-red-500">*</span>
                        </>
                    }
                    icon="UserOutline"
                    placeholder="Enter First Name"
                    value={values.first_name}
                    touched={touched}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInfo
                />

                <Input
                    type="text"
                    name="last_name"
                    label="Last Name"
                    icon="UserOutline"

                    placeholder="Enter Last Name"
                    value={values.last_name}
                    touched={touched}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInfo
                />

                <Input
                    type="text"
                    name="username"
                    label={
                        <>
                            User Name <span className="text-red-500">*</span>
                        </>
                    }
                    icon="UserRole"

                    placeholder="Enter User Name"
                    value={values.username}
                    touched={touched}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInfo
                />

                <Input
                    type="text"
                    name="email"
                    label={
                        <>
                            Email  <span className="text-red-500">*</span>
                        </>
                    }
                    icon="GrayEmail"

                    placeholder="Enter Email"
                    value={values.email}
                    touched={touched}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInfo
                />

                <Password
                    name="password"
                    label={
                        <>
                            Password <span className="text-red-500">*</span>
                        </>
                    }
                    placeholder="Enter Password"
                    value={values.password}
                    touched={touched}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInfo
                />

                <Select
                    name="manager_role_uuid"
                    label={
                        <>
                            Manager Role <span className="text-red-500">*</span>
                        </>
                    }
                    icon="ManagerRoles"
                    placeholder="Select Manager Role"
                    isAdd
                    createName="Create Manager Role"
                    createPath={
                        isPathname
                            ? "/manager-role-manager/manager-role/create"
                            : "/tenant-role-manager/manager-role/create"
                    }
                    options={rolesOptions}
                    value={values.manager_role_uuid}
                    touched={touched}
                    errors={errors}
                    removable
                    onChange={(e: any) => {
                        setFieldValue("manager_role_uuid", e.target.value);
                    }}
                    onBlur={handleBlur}
                    isInfo
                />

                <Select
                    name="extension_uuid"
                    label={
                        <>
                            SIP Device <span className="text-red-500">*</span>
                        </>
                    }
                    icon="SipDevices"
                    placeholder="Select SIP Device"
                    isAdd
                    createName="Create SIP Device"
                    createPath={
                        isPathname
                            ? "/manager-user/sip-devices/create"
                            : "/tenant-user/sip-devices/create"
                    }
                    options={sipOptions}
                    value={values.extension_uuid}
                    touched={touched}
                    errors={errors}
                    removable
                    onChange={(e: any) => {
                        setFieldValue("extension_uuid", e.target.value);
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
        </CardForm>
    );
};

export default CreateEditManagerForm;
