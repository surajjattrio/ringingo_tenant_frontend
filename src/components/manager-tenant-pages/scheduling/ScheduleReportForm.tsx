"use client";

import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import {
    Input,
    InputNumber,
    Select,
    InputSelect,
    CheckBox,
} from "@/components/forms";
import { DatePicker } from "@/components/pickers";

import { useUserOptions } from "@/redux/slice/tenant-admin/userSlice";
import { useDispositionOptions, dispositionOptionsGet } from "@/redux/slice/master-admin/dispositionSlice";
import { useCampaignOptions, campaignOptionsGet } from "@/redux/slice/tenant-admin/campaignReportSlice";
import { useTenantIvrGroupOptions, ivrGroupListGet, useTenantCdrsArchiveOptions, cdrsArchiveListGet } from "@/redux/slice/tenant-admin/tenantCdrsSlice";
import { useAppDispatch } from "@/redux/hooks";
import { userOptionsGet } from "@/redux/slice/tenant-admin/userSlice";
import { formatDate } from "@/helperFunctions";

import {
    advanceSearchOptions,
    callModeOptions,
    directionOptions,
    callTypeOptions,
} from "@/config/options";
import { CSV_SYSTEM_FIELDS } from "@/config/csvSystemFields";

interface ScheduleReportFormProps {
    onSubmit: (values: any) => void;
    initialData?: any;
    formikRef?: React.RefObject<any>;
}

const now = new Date();
const startOfToday = new Date(now);
startOfToday.setHours(0, 0, 0, 0);
const endOfToday = new Date(now);
endOfToday.setHours(23, 59, 59, 999);

const ScheduleReportForm: React.FC<ScheduleReportFormProps> = ({ onSubmit, initialData, formikRef }) => {
    const dispatch = useAppDispatch();
    const userOptions = useUserOptions();
    const allDispositions = useDispositionOptions();
    const campaignOptions = useCampaignOptions();
    const ivrGroupOptions = useTenantIvrGroupOptions();

    const [selectedDispositions, setSelectedDispositions] = useState<any[]>([]);
    const [headerMapping, setHeaderMapping] = useState<Record<string, string>>({});

    useEffect(() => {
        dispatch(dispositionOptionsGet());
        dispatch(userOptionsGet());
        dispatch(campaignOptionsGet());
        dispatch(ivrGroupListGet());
    }, [dispatch]);

    useEffect(() => {
        if (initialData?.filters?.disposition_path) {
            setSelectedDispositions(initialData.filters.disposition_path);
        } else {
            setSelectedDispositions([]);
        }
    }, [initialData]);

    const handleHeaderChange = (fieldKey: string, value: string) => {
        setHeaderMapping(prev => ({ ...prev, [fieldKey]: value }));
    };

    const formik = useFormik({
        initialValues: initialData || {
            filters: {
                callstart: startOfToday,
                callend: endOfToday,
                caller_id_name: { val: "", dropdown: "1" },
                caller_id_number: { val: "", dropdown: "1" },
                destination_number: { val: "", dropdown: "1" },
                disposition: "",
                user_uuid: [],
                campaign_uuid: [],
                ivr_group: "",
                direction: "",
                billsecond: { val: "", dropdown: "1" },
                report_name: "",
                bulk_download: false,
            },
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            filters: Yup.object({
                // Add any filter validations if needed
            })
        }),
        onSubmit: (values) => {
            const { filters } = values;
            const payload: any = {
                "callstart": formatDate(filters.callstart, true),
                "callend": formatDate(filters.callend, true),
                "quarter_selected": "no",
                [`caller_id_name|${filters.caller_id_name.dropdown}`]: filters.caller_id_name.val,
                [`caller_id_number|${filters.caller_id_number.dropdown}`]: filters.caller_id_number.val,
                [`destination_number|${filters.destination_number.dropdown}`]: filters.destination_number.val,
                [`billsecond|${filters.billsecond.dropdown}`]: filters.billsecond.val,
                "disposition|4": filters.disposition,
                "direction|4": filters.direction,
                "user_uuid|4": filters.user_uuid,
                "ivr_group|4": filters.ivr_group,
                "campaign_uuid|4": filters.campaign_uuid,
                "report_name": filters.report_name,
                "bulk_download": filters.bulk_download ? "yes" : "no",
                "page": 1,
                "limit": 10,
                "mapping": headerMapping || {}   // backend will auto pick tenant mapping
            };

            // Remove empty values
            Object.keys(payload).forEach(key => {
                const baseKey = key.split('|')[0];
                const value = payload[key];
                if (value === "" || value === null || (Array.isArray(value) && value.length === 0)) {
                    delete payload[key];
                }
            });

            onSubmit(payload);
        },
    });

    useEffect(() => {
        if (formikRef) {
            (formikRef as any).current = formik;
        }
    }, [formik, formikRef]);

    const handleDispositionChange = (level: number, value: string) => {
        const updatedSelections = [...selectedDispositions];
        updatedSelections[level] = value;
        updatedSelections.splice(level + 1);
        setSelectedDispositions(updatedSelections);
        formik.setFieldValue("filters.disposition", value);
    };

    const renderDispositionDropdowns = () => {
        const dropdowns = [];
        let currentOptions = allDispositions;

        for (let level = 0; level <= selectedDispositions.length; level++) {
            if (!currentOptions || currentOptions.length === 0) break;

            dropdowns.push(
                <Select
                    key={`hangup-cause-${level}`}
                    name={`filters.disposition_${level}`}
                    label={level === 0 ? "Disposition" : `Level ${level} Disposition`}
                    placeholder={`Select Level ${level} Disposition`}
                    value={selectedDispositions[level] || ""}
                    options={currentOptions.map((d: any) => ({
                        label: d.name || d.label,
                        value: d.disposition_uuid || d.value,
                    }))}
                    onChange={(e: any) => handleDispositionChange(level, e.target.value)}
                    isInfo
                />
            );

            const selectedVal = selectedDispositions[level];
            if (!selectedVal) break;

            const selectedItem: any = currentOptions.find(
                (d: any) => (d.disposition_uuid || d.value) === selectedVal
            );
            currentOptions = selectedItem?.children || [];
        }

        return dropdowns;
    };

    return (
        <>
            <DatePicker
                label="Start Date"
                name="filters.callstart"
                value={formik.values.filters.callstart}
                onChange={(val: any) => formik.setFieldValue("filters.callstart", val)}
                isInfo
            />
            <DatePicker
                label="End Date"
                name="filters.callend"
                value={formik.values.filters.callend}
                onChange={(val: any) => formik.setFieldValue("filters.callend", val)}
                isInfo
            />
            {/* <InputSelect
                label="Caller ID Name"
                name="filters.caller_id_name"
                value={formik.values.filters.caller_id_name.val}
                dropdownValue={formik.values.filters.caller_id_name.dropdown}
                options={advanceSearchOptions}
                onChange={(e: any) => formik.setFieldValue("filters.caller_id_name.val", e.target.value)}
                onDropdownChange={(e: any) => formik.setFieldValue("filters.caller_id_name.dropdown", e.target.value)}
                isInfo
            /> */}
            <InputSelect
                label="Caller's Number"
                name="filters.caller_id_number"
                value={formik.values.filters.caller_id_number.val}
                dropdownValue={formik.values.filters.caller_id_number.dropdown}
                options={advanceSearchOptions}
                onChange={(e: any) => formik.setFieldValue("filters.caller_id_number.val", e.target.value)}
                onDropdownChange={(e: any) => formik.setFieldValue("filters.caller_id_number.dropdown", e.target.value)}
                isInfo
            />
            <InputSelect
                label="Receiver's Number"
                name="filters.destination_number"
                value={formik.values.filters.destination_number.val}
                dropdownValue={formik.values.filters.destination_number.dropdown}
                options={advanceSearchOptions}
                onChange={(e: any) => formik.setFieldValue("filters.destination_number.val", e.target.value)}
                onDropdownChange={(e: any) => formik.setFieldValue("filters.destination_number.dropdown", e.target.value)}
                isInfo
            />
            <Select
                label="User"
                name="filters.user_uuid"
                options={userOptions}
                value={formik.values.filters.user_uuid}
                onChange={(values: any) => formik.setFieldValue("filters.user_uuid", values)}
                isInfo
                isMulti
            />
            <Select
                label="IVR Group"
                name="filters.ivr_group"
                options={ivrGroupOptions}
                value={formik.values.filters.ivr_group}
                onChange={formik.handleChange}
                isInfo
                isGroup
            />
            <InputSelect
                label="Duration"
                name="filters.billsecond"
                value={formik.values.filters.billsecond.val}
                dropdownValue={formik.values.filters.billsecond.dropdown}
                options={advanceSearchOptions}
                onChange={(e: any) => formik.setFieldValue("filters.billsecond.val", e.target.value)}
                onDropdownChange={(e: any) => formik.setFieldValue("filters.billsecond.dropdown", e.target.value)}
                isInfo
            />
            <Select
                label="Direction"
                name="filters.direction"
                options={directionOptions}
                value={formik.values.filters.direction}
                onChange={formik.handleChange}
                isInfo
            />
            <Select
                label="Campaign"
                name="filters.campaign_uuid"
                options={campaignOptions}
                value={formik.values.filters.campaign_uuid}
                onChange={(values: any) => formik.setFieldValue("filters.campaign_uuid", values)}
                isInfo
                isMulti
                isGroup
            />

            {renderDispositionDropdowns()}

            <div className="col-span-full mt-6 border rounded-xl p-5 bg-gray-50 w-full">
                <h3 className="text-sm font-semibold text-gray-800">
                    CSV Header Customization
                </h3>

                <div className="grid grid-cols-4 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full w-50 mt-4 mb-4">
                    <Input
                        name="report_name"
                        label={<> Report Name <span className="text-red-500">*</span> </>}
                        value={formik.values.filters.report_name}
                        onChange={(e: any) => formik.setFieldValue("filters.report_name", e.target.value)}
                    />
                    <CheckBox
                        label="Bulk Recording Download"
                        labelClassName="font-bold text-xs"
                        checked={formik.values.filters.bulk_download}
                        onChange={(value: boolean) => formik.setFieldValue("filters.bulk_download", value)}
                    />
                </div>

                <div className="grid grid-cols-4 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                    {CSV_SYSTEM_FIELDS.map(field => (
                        <div key={field.key}>
                            <Input
                                name={`csv_${field.key}`}
                                label={field.label}
                                placeholder={field.label}
                                value={headerMapping[field.key] || ""}
                                onChange={(e: any) => handleHeaderChange(field.key, e.target.value)}
                                onBlur={() => { }}
                                touched={{}}
                                errors={{}}
                                isInfo
                            />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default ScheduleReportForm;
