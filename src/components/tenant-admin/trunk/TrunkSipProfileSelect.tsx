"use client";
import { useEffect, useState } from "react";

// PROJECT IMPORTS
import { Select } from "@/components/forms";
import { tenantTrunkSipProfiles } from "@/redux/services/tenant-admin/tenantTrunkServices";

interface TrunkSipProfileSelectProps {
    value: string;
    touched?: any;
    errors?: any;
    onChange: (value: string) => void;
}

/* ============================== TRUNK SIP PROFILE SELECT ============================== */
// Tenant can create trunk on any of its assigned SIP profiles (multi SIP profile)

const TrunkSipProfileSelect = (props: TrunkSipProfileSelectProps) => {
    const { value, touched, errors, onChange } = props;
    const [options, setOptions] = useState<{ value: string; label: string }[]>([]);

    useEffect(() => {
        const onGetSipProfiles = async () => {
            try {
                const res: any = await tenantTrunkSipProfiles();
                const list = res?.statusCode === 200 ? res?.data || [] : [];
                setOptions(list.map((val: any) => ({ value: val?.uuid, label: val?.name })));
            } catch (err) {
                console.error("Get Trunk SIP Profiles Err =-=>", err);
            }
        };
        onGetSipProfiles();
    }, []);

    // Select default (first) profile for new trunk
    useEffect(() => {
        if (!value && options.length > 0) onChange(options[0].value);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [options, value]);

    if (options.length === 0) return null;

    return (
        <Select
            name="sip_profile_uuid"
            label="SIP Profile"
            placeholder="Select SIP Profile"
            options={options}
            value={value}
            touched={touched}
            errors={errors}
            onChange={(e: any) => onChange(e.target.value)}
            isInfo
        />
    );
};

export default TrunkSipProfileSelect;
