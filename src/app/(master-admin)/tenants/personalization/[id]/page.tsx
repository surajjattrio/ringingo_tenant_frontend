"use client";
import React, { useLayoutEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
    tenantSingleGet,
    createTenantPersonalization,
    getTenantPersonalization
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

const baseUrl = process.env.BASE_URL;

const Personalization = () => {

    const { id } = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { user } = useAuth();
    

    const [loading, setLoading] = useState<boolean>(false);
    const [tenantData, setTenantData] = useState<any>({});
    const [personalizeData, setPersonalizeData] = useState<any>({});


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
        // tenant_uuid: Yup.string().required("Please choose your file"),
        expandedfile: Yup.string().required("Please choose your file"),
        collapsedfile: Yup.string().required("Please choose your file"),
        faviconfile: Yup.string().required("Please choose your file"),
        title: Yup.string().required("Please choose your file"),
        // tenant_domain: Yup.string().required("Please choose your file"),
        footer: Yup.string().required("Please choose your file"),
    });

    // Create or Update Tenant
    const onSubmit = async () => {
        const payload = new FormData();

        payload.append("tenant_domain", tenantData?.domain);
        payload.append("tenant_uuid", id);
        payload.append("footer", values.footer);
        payload.append("title", values.title);
        payload.append("expandedfile", values.expandedfile);
        payload.append("collapsedfile", values.collapsedfile);
        payload.append("faviconfile", values.faviconfile);
        onCreatePersonalization(payload);
        
    };

    const {
        values,
        touched,
        errors,
        handleBlur,
        handleChange,
        setFieldValue,
        setValues,
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

    useLayoutEffect(() => {
        getTenantPersonalizeData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tenantData]);

    useLayoutEffect(() => {
        if (personalizeData) {
            setValues({
                expandedfile: personalizeData?.expandedfile ? personalizeData?.expandedfile : "",
                collapsedfile: personalizeData?.collapsedfile ? personalizeData?.collapsedfile : "",
                faviconfile: personalizeData?.faviconfile ? personalizeData?.faviconfile : "",
                title: personalizeData?.title ? personalizeData?.title : "",
                footer: personalizeData?.expandedfile ? personalizeData?.footer : "",
                tenant_uuid: personalizeData?.tenant_uuid ? personalizeData?.tenant_uuid : "",
                tenant_domain: personalizeData?.tenant_domain ? personalizeData?.tenant_domain : "",
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [personalizeData]);

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

    const getTenantPersonalizeData = async () => {
        setLoading(true);
        if(tenantData?.domain){
            try {
                const res: any = await dispatch(getTenantPersonalization(tenantData?.domain)).unwrap();
                if (res?.statusCode === 200) {
                    setPersonalizeData(res?.data);
                }
                setLoading(false);
            } catch (err) {
                setLoading(false);
                console.error("Get Tenant Personlize Data Err =-=>", err);
            }
        }
    };

    const onCreatePersonalization = async (values: any) => {
        setLoading(true);
        try {
            const res: any = await dispatch(createTenantPersonalization(values)).unwrap();
            if (res?.statusCode === 201) {
                Success(res?.message);
                router.back();
            } else {
                Danger(res?.message);
            }
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error("Create Personalization Err --->", e?.message);
        }
    };

    const handleFileChange = (e : any) => {

        const name = e.target.name;
        const file = e.target.file;

        setFieldValue(name, file);

        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const img = document.getElementById(name) as HTMLImageElement;
            if(e.target && img){
                img.src = e.target.result as string;
                console.log(e.target.result);
            }
          };
          reader.readAsDataURL(file);
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
        <div className="pt-5 pb-10 gap-y-[30px] grid grid-cols-[repeat(auto-fit,_minmax(240px,_1fr))] gap-4 px-4">
            <div>
                <FilePicker
                    name="expandedfile"
                    label="Expanded Logo (134 * 26)"
                    placeholder="Choose file to upload"
                    accept="image/*"
                    value={values.expandedfile}
                    touched={touched}
                    errors={errors}
                    onChange={(e: any) => {
                        handleFileChange(e);
                    }}
                    onBlur={handleBlur}
                    isInfo
                    showImage
                    imageUrl={personalizeData?.expandedfile ? 
                        baseUrl+`/tenant/download/${personalizeData?.expandedfile}` 
                        : ""}
                />
            </div>
            <div>
                <FilePicker
                    name="collapsedfile"
                    label="Collapsed Logo (24 * 33)"
                    placeholder="Choose file to upload"
                    accept="image/*"
                    value={values.collapsedfile}
                    touched={touched}
                    errors={errors}
                    onChange={(e: any) => {
                        handleFileChange(e);
                    }}
                    onBlur={handleBlur}
                    isInfo
                    showImage
                    imageUrl={personalizeData?.collapsedfile ? 
                        baseUrl+`/tenant/download/${personalizeData?.collapsedfile}` 
                        : ""}
                />
            </div>
            <div>
                <FilePicker
                    name="faviconfile"
                    label="Favicon (32 * 32)"
                    placeholder="Choose file to upload"
                    accept="image/*"
                    value={values.faviconfile}
                    touched={touched}
                    errors={errors}
                    onChange={(e: any) => {
                        handleFileChange(e);
                    }}
                    onBlur={handleBlur}
                    isInfo
                    showImage
                    imageUrl={personalizeData?.faviconfile ? 
                        baseUrl+`/tenant/download/${personalizeData?.faviconfile}` 
                        : ""}
                />
            </div>
            <div>
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
            </div>
            <div>
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
        </div>
        </CardForm>
    )

};

export default Personalization
