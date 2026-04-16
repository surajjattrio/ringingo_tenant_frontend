import React, { useState } from "react";

// PROJECT IMPORTS
import Icon from "../ui-components/Icon";

// TYPES IMPORT
import { OptionTypes } from "@/types/formTypes";

// OPTIONS IMPORT
import { daysOptions } from "@/config/options";

// TYPES
interface SelectProps {
    className?: string;
    inputClassName?: string;
    isShowLabel?: boolean;
    label?: string;
    name: string;
    isShowPlaceholder?: boolean;
    placeholder?: string;
    isInfo?: boolean;
    value?: string | number;
    touched?: any;
    errors?: any;
    focus?: boolean;
    onChange?: any;
    onFocus?: any;
    onBlur?: any;
    onIconClick?: any;
}

/* ============================== DAY - PICKER ============================== */

const DayPicker = (props: SelectProps) => {
    const {
        className,
        inputClassName,
        isShowLabel = true,
        label,
        name,
        isShowPlaceholder = true,
        placeholder = "Select",
        isInfo = false,
        value,
        touched,
        focus,
        errors,
        onChange,
        onFocus,
        onBlur,
        onIconClick,
    } = props;

    const [isFocused, setIsFocused] = useState<boolean>(false);

    return (
        <div className={`${className} relative`}>
            {isShowLabel && <div className="text-xs font-semibold pb-2 flex items-center">
                <label htmlFor={name}>{label ? label : name}</label>
                {isInfo && (
                    <Icon
                        tooltip={label ? label : name}
                        className="ml-3 cursor-pointer"
                        name="InfoCircle"
                        width={15}
                        height={15}
                        alt={label ? label : name}
                    />
                )}
            </div>}
            <div
                className={`${inputClassName} bg-transparent flex border-2 rounded-md items-center ${touched && errors && touched[name] && errors[name]
                    ? "border-error"
                    : focus
                        ? "border-primary"
                        : "border-dark-700"
                    }`}
            >
                <Icon
                    className={`absolute left-4 text-dark-700`}
                    name="CalendarGray"
                    width={20}
                    height={20}
                    alt={"Date"}
                    onClick={onIconClick}
                />
                <select
                    id={name}
                    name={name}
                    value={value}
                    onChange={(e: any) => {
                        const data: any = daysOptions?.find((val: any) => val?.value === e.target.value) || ""
                        onChange && onChange(e, data?.label)
                    }}
                    onBlur={(e) => {
                        setIsFocused(false);
                        onBlur && onBlur(e);
                    }}
                    onFocus={() => {
                        onFocus ? onFocus() : setIsFocused(true)
                    }}
                    className={`bg-transparent focus:outline-none border-2 rounded-md py-[5px] pl-12 w-full border-transparent rounded-e-md font-normal border-r-8 text-xs placeholer:text-xs ${value ? "text-txt-primary" : "text-txt-secondary"
                        }`}
                >
                    {isShowPlaceholder && <option value={""}>{placeholder}</option>}
                    {daysOptions?.map((val: OptionTypes, index: number) => {
                        return (
                            <React.Fragment key={index}>
                                <option value={val?.value}>{val?.label}</option>
                            </React.Fragment>
                        );
                    })}
                </select>
            </div>
            {touched && errors && touched[name] && errors[name] && (
                <span className="text-error font-normal text-xs">{errors[name]}</span>
            )}
        </div>
    );
};

export default DayPicker;
