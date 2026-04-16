"use client";
import { useLayoutEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

//PROJECT IMPORT
import { useAppDispatch } from "@/redux/hooks";
import { Danger, Success } from "@/redux/services/toasterServices";
import {
    updateSingleSipData,
    sipProfileCreate,
    sipProfileUpdate,
    useSingleSipData,
} from "@/redux/slice/master-admin/sipProfileSlice";
import SpiParametersTable from "./SpiParametersTable";
import { CardForm } from "@/components/ui-components";
import { Input, Switch } from "@/components/forms";

// THIRD - PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// TYPES
import { initialValueType } from "@/types/master-admin/sipProfileTypes";

interface CreateEditSipProfileFormProps { }

/* ============================== CREATE & EDIT SIP - PROFILE FORM ============================== */

const CreateEditSipProfileForm = (props: CreateEditSipProfileFormProps) => {
    const { id }: any = useParams();

    const dispatch = useAppDispatch();
    const router = useRouter();
    const getSingleSipDetails = useSingleSipData();

    const [loading, setLoading] = useState<boolean>(false);
    const [newSipDetails, setNewSipDetails] = useState<any>([]);
    const [sipDetails, setSipDetails] = useState<any>({});

    const initialValues: initialValueType = {
        name: "",
        sip_ip: "",
        sip_port: "",
        sip_details: "",
        status: "0",
    };

    const validationSchema = Yup.object<any>({
        name: Yup.string().required("Please enter your name"),
        sip_ip: Yup.string().required("Please enter your sip id"),
        sip_port: Yup.string().required("Please enter your sip port"),
    });

    // Create or Update SIP Profile
    const onSubmit = (values: any) => {
        if (id) {
            onUpdateSipProfile(values);
        } else {
            onCreateSipProfile(values);
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
    } = useFormik({
        initialValues,
        validationSchema,
        onSubmit,
    });

    useLayoutEffect(() => {
        if (!id) return;
        setSipDetails(
            getSingleSipDetails.sip_details
                ? JSON.parse(getSingleSipDetails.sip_details)
                : {}
        );
        setValues({
            ...values,
            name: getSingleSipDetails?.name || "",
            sip_ip: getSingleSipDetails?.sip_ip || "",
            sip_port: getSingleSipDetails?.sip_port || "",
            sip_details: getSingleSipDetails?.sip_details || "",
            status: getSingleSipDetails?.status || "0",
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getSingleSipDetails]);

    // Create SIP Profile & Navigate to SIP Profile Page
    const onCreateSipProfile = async (val: any) => {
        setLoading(true);
        try {
            const payload = { ...val };
            delete payload["sip_details"];
            const res: any = await dispatch(sipProfileCreate(payload)).unwrap();
            if (res?.statusCode === 201) {
                Success(res.data);
                router.back();
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Create sip-profile Err --->", e?.message);
        }
    };

    // Preparing Data for Update SIP Profile
    const prepareData = () => {
        let data = {};

        for (let index = 0; index < newSipDetails?.length; index++) {
            data = {
                ...data,
                [newSipDetails[index]["name"]]: newSipDetails[index]["value"],
            };
        }
        return JSON.stringify(data);
    };

    // Update SIP Profile & Navigate to SIP Profile Page
    const onUpdateSipProfile = async (val: any) => {
        setLoading(true);
        try {
            let payload = {
                ...val,
                id,
            };
            payload["sip_details"] = prepareData();
            const res: any = await dispatch(sipProfileUpdate(payload)).unwrap();
            if (res?.statusCode === 200) {
                Success(res.data);
                router.back();
                dispatch(updateSingleSipData({}));
                setSipDetails({});
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Update sip-profile Err --->", e?.message);
        }
    };

    return (
        <CardForm
            id={id}
            title={id ? "Edit SIP Profile" : "Create SIP Profile"}
            loading={loading}
            handleSubmit={handleSubmit}
            onDoneClick={handleSubmit}
            onCancelClick={() => {
                router.back();
                id && dispatch(updateSingleSipData({}));
                id && setSipDetails;
            }}
        >
            <div className="pt-5 pb-10 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4">
                <Input
                    name="name"
                    label="Name"
                    icon="UserOutline"
                    placeholder="Enter Name"
                    value={values.name}
                    touched={touched}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInfo
                />
                <Input
                    name="sip_ip"
                    label="SIP - IP"
                    placeholder="Enter SIP - IP"
                    value={values.sip_ip}
                    touched={touched}
                    errors={errors}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInfo
                />
                <Input
                    name="sip_port"
                    label="SIP - Port"
                    placeholder="Enter SIP - Port"
                    value={values.sip_port}
                    touched={touched}
                    errors={errors}
                    onChange={handleChange}
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
            {id && (
                <div className="border-t border-dark-700">
                    <SpiParametersTable
                        sipDetails={sipDetails}
                        setNewSipDetails={setNewSipDetails}
                    />
                </div>
            )}
        </CardForm>
    );
};

export default CreateEditSipProfileForm;
