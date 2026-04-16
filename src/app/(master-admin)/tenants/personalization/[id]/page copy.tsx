"use client";
import React, { useLayoutEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
    tenantSingleGet,
    createTenantPersonalization,
} from "@/redux/slice/master-admin/tenantSlice";
import { useAuth } from "@/contexts/hooks/useAuth";
import { useAppDispatch } from "@/redux/hooks";
import { FilePicker } from "@/components/pickers";
import { Input } from "@/components/forms";
import { InitialValueType } from "@/types/master-admin/personalizationTypes";
import { Danger, Success } from "@/redux/services/toasterServices";
import { CardForm } from "@/components/ui-components";
import { useFormik } from "formik";
import * as Yup from "yup";

const Personalization = () => {

    const { id } = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { user } = useAuth();

    const [loading, setLoading] = useState<boolean>(false);
    const [tenantData, setTenantData] = useState<any>({});

    const initialValues: InitialValueType = {
        tenant_uuid: "",
        expandedfile: "",
        collapsedfile: "",
        faviconfile: "",
        title: "",
        tenant_domain: "",
        footer: "",
    };

    const validationSchema = Yup.object<InitialValueType>({
        tenant_uuid: Yup.string().required("Please choose your file"),
        expandedfile: Yup.string().required("Please choose your file"),
        collapsedfile: Yup.string().required("Please choose your file"),
        faviconfile: Yup.string().required("Please choose your file"),
        title: Yup.string().required("Please choose your file"),
        tenant_domain: Yup.string().required("Please choose your file"),
        footer: Yup.string().required("Please choose your file"),
    });

    // Create or Update Tenant
    const onSubmit = (values: any) => {

        const payload = new FormData();

        payload.append("tenant_uuid", id);
        payload.append("expandedfile", values.expandedfile);
        payload.append("collapsedfile", values.collapsedfile);
        payload.append("faviconfile", values.faviconfile);
        payload.append("footer", values.footer);
        payload.append("title", values.title);
        payload.append("tenant_domain", tenantData?.domain);

        onCreatePersonalization(payload);

        console.log(payload);
        
    };

    const {
        values,
        touched,
        errors,
        handleBlur,
        handleChange,
        setFieldValue,
        handleSubmit,
    } = useFormik({
        initialValues,
        validationSchema,
        onSubmit,
    });

    useLayoutEffect(() => {
        if (!id) return;
        onGetSingleTenantData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const onGetSingleTenantData = async () => {
        setLoading(true);
        try {
            const res: any = await dispatch(tenantSingleGet(id)).unwrap();
            if (res?.statusCode === 200) {
                setTenantData(res?.data);
            }
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.error("Get Single tenant Data Err =-=>", err);
        }
    };

    const onCreatePersonalization = async (values: any) => {
        console.log("values");
        console.log(values);
        setLoading(true);
        try {
            const res: any = await dispatch(createTenantPersonalization(values)).unwrap();
            if (res?.statusCode === 201) {
                Success(res.data);
                router.back();
            } else {
                Danger(res?.data);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Create Personalization Err --->", e?.message);
        }
    };

    return(
        <CardForm
            name="personalization"
            id={id}
            loading={loading}
            title={"Personalization"}
            handleSubmit={handleSubmit}
            onDoneClick={handleSubmit}
            onCancelClick={() => {
                router.back();
            }}
        >
        <div className="pt-5 pb-10 gap-y-[30px] grid grid-cols-3 tsm:grid-cols-1 gap-x-4 px-4">
            <FilePicker
                name="expandedfile"
                label="Expand Logo"
                placeholder="Choose file to import"
                accept="image/*"
                value={values.expandedfile}
                touched={touched}
                errors={errors}
                onChange={(value: any) => {
                    setFieldValue("expandedfile", value);
                }}
                onBlur={handleBlur}
                isInfo
            />
            <FilePicker
                name="collapsedfile"
                label="Collapsed Logo"
                placeholder="Choose file to import"
                accept="image/*"
                value={values.collapsedfile}
                touched={touched}
                errors={errors}
                onChange={(value: any) => {
                    setFieldValue("collapsedfile", value);
                }}
                onBlur={handleBlur}
                isInfo
            />
            <FilePicker
                name="faviconfile"
                label="Favicon"
                placeholder="Choose file to import"
                accept="image/*"
                value={values.faviconfile}
                touched={touched}
                errors={errors}
                onChange={(value: any) => {
                    setFieldValue("faviconfile", value);
                }}
                onBlur={handleBlur}
                isInfo
            />
            {/* <ImagePicker
                label="Expand Logo"
                name="expandedfile"
                isInfo
                value={values.expandedfile}
                detailInfo="Upload size: 200 * 200"
                onChange={(value: any) => {
                    setFieldValue("expandedfile", value);
                }}
            /> */}
            {/* <ImagePicker
                label="Collapsed Logo"
                name="collapsedfile"
                isInfo
                value={values.collapsedfile}
                detailInfo="Upload size: 200 * 200"
                onChange={(e: any) => {
                    setFieldValue("collapsedfile", e.target.value);
                }}
            />
            <ImagePicker
                label="Favicon"
                name="faviconfile"
                isInfo
                value={values.faviconfile}
                detailInfo="Upload size: 200 * 200"
                onChange={(e: any) => {
                    setFieldValue("faviconfile", e.target.value);
                }}
            /> */}
            <Input
                name="title"
                label="Title"
                placeholder="Enter Title"
                value={values.title}
                touched={touched}
                errors={errors}
                onChange={handleChange}
                onBlur={handleBlur}
                isInfo
            />
            <Input
                name="footer"
                label="Footer"
                placeholder="Enter Footer"
                value={values.footer}
                touched={touched}
                errors={errors}
                onChange={handleChange}
                onBlur={handleBlur}
                isInfo
            />
        </div>
        </CardForm>
    )

};

export default Personalization
