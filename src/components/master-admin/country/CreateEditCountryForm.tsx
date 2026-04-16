"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

//PROJECT IMPORT
import { useAppDispatch } from "@/redux/hooks";
import {
    countryCreate,
    countrySingleGet,
    countryUpdate,
} from "@/redux/slice/master-admin/countrySlice";
import { useTimezoneOptions } from "@/redux/slice/master-admin/timezoneSlice";
import {
    countryOptionsGet,
    useCountryOptions,
} from "@/redux/slice/master-admin/countrySlice";
import {
    sipProfileOptionsGet,
    useSipProfileOptions,
} from "@/redux/slice/master-admin/sipProfileSlice";
import {
    rolesOptionsGet,
    useRolesOptions,
} from "@/redux/slice/master-admin/roleSlice";
import { Danger, Success } from "@/redux/services/toasterServices";
import { CardForm } from "@/components/ui-components";
import { Input, Select, Switch } from "@/components/forms";

// THIRD - PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// TYPES
import { InitialValueType } from "@/types/master-admin/countryTypes";

/* ============================== CREATE & EDIT COUNTRY FORM ============================== */

const CreateEditCountryForm = () => {
    const { id }: any = useParams();

    const dispatch = useAppDispatch();
    const router = useRouter();
    const rolesOptions = useRolesOptions();
    const countryOptions = useCountryOptions();
    const timezoneOptions = useTimezoneOptions();
    const sipProfileOptions = useSipProfileOptions();

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const onEyeClick = () => setShowPassword(!showPassword);

    const initialValues: InitialValueType = {
        country: "",
        iso: "",
        iso3: "",
        nicename: "",
        vat: "",
        latitude: "",
        longitude: "",
        capital: "",
        countrycode: "",
    };

    const validationSchema = Yup.object<InitialValueType>({
        country: Yup.string().required("Please enter your country"),
        iso: Yup.string().required("Please enter your iso"),
        iso3: Yup.string().required("Please enter your iso3"),
        nicename: Yup.string().required("Please enter your nicename"),
        vat: Yup.string().required("Please enter vat"),
        latitude: Yup.string().required("Please enter latitude"),
        longitude: Yup.string().required("Please enter longitude"),
        capital: Yup.string().required("Please enter capital"),
        countrycode: Yup.string().required("Please enter countrycode"),
    });

    // Create or Update Country
    const onSubmit = (values: InitialValueType) => {
        if (id) {
            onUpdateCountry(values);
        } else {
            onCreateCountry(values);
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
        onGetSingleCountryData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    useEffect(() => {
        //onGetRolesOptions();
        onGetCountryOptions();
        // onGetSipProfileOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetching Country Options
    const onGetCountryOptions = () => {
        try {
            dispatch(countryOptionsGet()).unwrap();
        } catch (e: any) {
            console.error("Get Country Options Err --->", e?.message);
        }
    };

    // Fetching Single Country Data
    const onGetSingleCountryData = async () => {
        try {
            const res: any = await dispatch(countrySingleGet(id)).unwrap();
            if (res?.statusCode === 200) {
                const countryData = res?.data;
                //  onGetTimeZonesOptions(countryData?.country_uuid);
                setValues({
                    ...values,
                    country: countryData?.country || "",
                    iso: countryData?.iso || "",
                    iso3: countryData?.iso3 || "",
                    nicename: countryData?.nicename || "",
                    vat: countryData?.vat || "",
                    latitude: countryData?.latitude || "",
                    longitude: countryData?.longitude || "",
                    capital: countryData?.capital || "",
                    countrycode: countryData?.countrycode || "",
                });
            }
        } catch (err) {
            console.error("Get Single Country Data Err =-=>", err);
        }
    };

    // Create Country & Navigate to Country Page
    const onCreateCountry = async (val: InitialValueType) => {
        try {
            const payload = { ...val };
            const res: any = await dispatch(countryCreate(payload)).unwrap();
            if (res?.statusCode === 201) {
                router.back();
                Success(res.data);
            } else {
                Danger(res?.data);
            }
        } catch (e: any) {
            console.error("Create Country Err --->", e?.message);
        }
    };

    // Update Country & Navigate to Country Page
    const onUpdateCountry = async (val: InitialValueType) => {
        try {
            const payload = {
                ...val,
                id,
            };
            const res: any = await dispatch(countryUpdate(payload)).unwrap();
            if (res?.statusCode === 200) {
                router.back();
                Success(res.data);
            } else {
                Danger(res?.data);
            }
        } catch (e: any) {
            console.error("Update Country Err --->", e?.message);
        }
    };

    return (
        <CardForm
            id={id}
            title={id ? "Edit Country" : "Create Country"}
            handleSubmit={handleSubmit}
            onDoneClick={handleSubmit}
            onCancelClick={() => {
                router.back();
            }}
        >
            <div className="pt-5 pb-10 space-y-4">
                <div className="grid grid-cols-3">
                    <div className="px-4">
                        <Input
                            name="country"
                            label="Country"
                            placeholder="Enter Country"
                            value={values.country}
                            touched={touched}
                            errors={errors}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInfo
                        />
                    </div>
                    <div className="px-4">
                        <Input
                            name="iso"
                            label="Iso"
                            placeholder="Enter Iso"
                            value={values.iso}
                            touched={touched}
                            errors={errors}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInfo
                        />
                    </div>
                    <div className="px-4">
                        <Input
                            name="iso3"
                            label="Iso3"
                            placeholder="Enter Iso3"
                            value={values.iso3}
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
                        <Input
                            name="nicename"
                            label="Nickname"
                            placeholder="Enter Nickname"
                            value={values.nicename}
                            touched={touched}
                            errors={errors}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInfo
                        />
                    </div>
                    <div className="px-4">
                        <Input
                            name="vat"
                            label="Vat"
                            placeholder="Enter Vat"
                            value={values.vat}
                            touched={touched}
                            errors={errors}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInfo
                        />
                    </div>
                    <div className="px-4">
                        <Input
                            name="latitude"
                            label="Latitude"
                            placeholder="Enter Latitude"
                            value={values.latitude}
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
                        <Input
                            name="longitude"
                            label="Longitude"
                            placeholder="Enter Longitude"
                            value={values.longitude}
                            touched={touched}
                            errors={errors}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInfo
                        />
                    </div>
                    <div className="px-4">
                        <Input
                            name="capital"
                            label="Capital"
                            placeholder="Enter Capital"
                            value={values.capital}
                            touched={touched}
                            errors={errors}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInfo
                        />
                    </div>
                    <div className="px-4">
                        <Input
                            name="countrycode"
                            label="Country code"
                            placeholder="Enter Countrycode"
                            value={values.countrycode}
                            touched={touched}
                            errors={errors}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInfo
                        />
                    </div>
                </div>
            </div>
        </CardForm>
    );
};

export default CreateEditCountryForm;
