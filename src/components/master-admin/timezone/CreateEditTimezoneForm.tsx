"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

//PROJECT IMPORT
import { useAppDispatch } from "@/redux/hooks";
import {
    timezoneCreate,
    timezoneSingleGet,
    timezoneUpdate,
} from "@/redux/slice/master-admin/timezoneSlice";
import {
    timezoneOptionsGet,
    useTimezoneOptions,
} from "@/redux/slice/master-admin/timezoneSlice";
import { countryOptionsGet, useCountryOptions } from "@/redux/slice/master-admin/countrySlice";
import { sipProfileOptionsGet, useSipProfileOptions } from "@/redux/slice/master-admin/sipProfileSlice";
import { rolesOptionsGet, useRolesOptions } from "@/redux/slice/master-admin/roleSlice";
import { Danger, Success } from "@/redux/services/toasterServices";
import { CardForm } from "@/components/ui-components";
import { Input, Select, Switch } from "@/components/forms";

// THIRD - PARTY IMPORT
import { useFormik } from "formik";
import * as Yup from "yup";

// TYPES
import { InitialValueType } from "@/types/master-admin/timezoneTypes";

/* ============================== CREATE & EDIT TIMEZONE FORM ============================== */

const CreateEditTimezoneForm = () => {
    const { id }: any = useParams();

    const dispatch = useAppDispatch();
    const router = useRouter();
    const rolesOptions = useRolesOptions();
    const countryOptions = useCountryOptions();
    const timezoneOptions = useTimezoneOptions();
    const sipProfileOptions = useSipProfileOptions()

    const initialValues: InitialValueType = {
        timezone_name: "",
        gmtoffset: "",
        gmttime: "",
        country_uuid: "",
        timezone_digit:"",
    };

    const validationSchema = Yup.object<InitialValueType>({
        timezone_name: Yup.string().required("Please enter timezone name"),
        gmtoffset: Yup.string().required("Please enter your gmtoffset"),
        gmttime: Yup.string().required("Please enter your gmttime"),
        country_uuid: Yup.string().required("Please select country"),

    });

    // Create or Update Timezone
    const onSubmit = (values: InitialValueType) => {
        if (id) {
            onUpdateTimezone(values);
        } else {
            onCreateTimezone(values);
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
        if (!id) return
        onGetSingleTimezoneData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    useEffect(() => {
        //onGetRolesOptions();
        onGetCountryOptions();
        //onGetSipProfileOptions();
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

 
    // Fetching Time Zones Options
    const onGetTimeZonesOptions = async (id: string) => {
        try {
            //const param: any = { country_uuid: id };
            //await dispatch(timezoneOptionsGet(param)).unwrap();
            await dispatch(timezoneOptionsGet()).unwrap();
        } catch (e: any) {
            console.error("Get TimeZones Data Err --->", e?.message);
        }
    };

    // Fetching Single Timezone Data
    const onGetSingleTimezoneData = async () => {
        try {
            const res: any = await dispatch(timezoneSingleGet(id)).unwrap()
            if (res?.statusCode === 200) {
                const timezoneData = res?.data
                onGetTimeZonesOptions(timezoneData?.country_uuid);
                setValues({
                    ...values,
                    timezone_name: timezoneData?.timezone_name || "",
                    gmtoffset: timezoneData?.gmtoffset || "",
                    gmttime: timezoneData?.gmttime || "",
                    country_uuid: timezoneData?.country_uuid || ""
                    
                });
            }
        } catch (err) {
            console.error("Get Single Timezone Data Err =-=>", err);
        }
    }

    // Create Timezone & Navigate to Timezone Page
    const onCreateTimezone = async (val: InitialValueType) => {
        try {
            const payload = { ...val };
            
            let gmttime = payload.gmttime;
          const myArray = gmttime.split("GMT")[1];
          let timezoneDigit = myArray.split(":")[0]
          
           payload.timezone_digit = timezoneDigit;
           
            const res: any = await dispatch(timezoneCreate(payload)).unwrap();
            if (res?.statusCode === 201) {
                router.back()
                Success(res.data);
            } else {
                Danger(res?.data);
            }
        } catch (e: any) {
            console.error("Create Timezone Err --->", e?.message);
        }
    };

    // Update Timezone & Navigate to Timezone Page
    const onUpdateTimezone = async (val: InitialValueType) => {
        try {
            const payload = {
                ...val,
                id,
            };
            
            let gmttime = payload.gmttime;
          const myArray = gmttime.split("GMT")[1];
          let timezoneDigit = myArray.split(":")[0]
          
           payload.timezone_digit = timezoneDigit;
           
            const res: any = await dispatch(timezoneUpdate(payload)).unwrap();
            if (res?.statusCode === 200) {
                router.back()
                Success(res.data);
            } else {
                Danger(res?.data);
            }
        } catch (e: any) {
            console.error("Update Timezone Err --->", e?.message);
        }
    };

    return (
        <CardForm
            id={id}
            title={id ? "Edit Timezone" : "Create Timezone"}
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
                            name="timezone_name"
                            label="Timezone Name"
                            placeholder="Enter Timezone Name"
                            icon="TimeZone"
                            value={values.timezone_name}
                            touched={touched}
                            errors={errors}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInfo
                        />
                    </div>
                    <div className="px-4">
                        <Input
                            name="gmtoffset"
                            label="GMT Offset"
                            placeholder="Enter GMToffset"
                            value={values.gmtoffset}
                            touched={touched}
                            errors={errors}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInfo
                        />
                    </div>
                      <div className="px-4">
                        <Input
                            name="gmttime"
                            label="GMT Time"
                            placeholder="Enter gmttime"
                            value={values.gmttime}
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
                            name="country_uuid"
                            label="Country"
                            placeholder="Select Country"
                            removable
                            icon="Map"
                            options={countryOptions}
                            value={values.country_uuid}
                            touched={touched}
                            errors={errors}
                            onChange={(e: any) => {
                                setFieldValue("country_uuid", e.target.value);
                                onGetTimeZonesOptions(e.target.value);
                            }}
                            onBlur={handleBlur}
                            isInfo
                        />
                    </div>
                </div>
                
                    
            
              
         </div>
        </CardForm>
    );
};

export default CreateEditTimezoneForm;
