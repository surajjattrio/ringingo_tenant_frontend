import React from "react";

// PROJECT IMPORTS
import { OptionTypes } from "@/types/formTypes";
import Icon from "../ui-components/Icon";

// THIRD - PARTY IMPORT
import DatePicker from "react-datepicker";

// TYPES
interface DateSelectProps {
    className?: string;
    label?: string;
    name: string;
    startDate?: any;
    endDate?: any;
    minDate?:any;
    maxDate?:any;
    value?: any;
    dropdownValue?: string | number;
    defaultDropDownValue?: string | number;
    placeholder?: string;
    options?: OptionTypes[];
    onChange?: any;
    dropdownPlaceholder?: string;
    onDropdownChange?: any;
    isInfo?: boolean;
    selectsStart?: boolean;
    selectsEnd?: boolean;
}

/* ============================== DATE SELECT ============================== */

const DateSelect = (props: DateSelectProps) => {
    const {
        className,
        label,
        name,
        value,
        startDate,
        endDate,
        minDate,
        maxDate,
        dropdownValue,
        defaultDropDownValue,
        placeholder,
        options,
        dropdownPlaceholder,
        onChange,
        onDropdownChange,
        isInfo = false,
        selectsStart = false,
        selectsEnd = false,
    } = props;

    return (
        <div className={className}>
            <div className="text-xs font-semibold pb-2 flex items-center">
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
            </div>
            <div className="grid grid-cols-2">
                <div>
                    <DatePicker
                        id={name}
                        className={`focus:outline-none border-2 rounded-s-md w-full px-2 py-[9px] text-xs placeholer:text-xs border-dark-700`}
                        placeholderText={placeholder}
                        selected={value}
                        onChange={onChange}
                        startDate={startDate}
                        endDate={endDate}
                        minDate={minDate}
                        maxDate={maxDate}
                        selectsStart={selectsStart}
                        selectsEnd={selectsEnd}
                    />
                </div>
                <div className="flex items-center relative border-2 border-s-0 w-full border-dark-700 rounded-e-md">
                    <select
                        value={dropdownValue}
                        onChange={onDropdownChange}
                        defaultValue={defaultDropDownValue}
                        className={`focus:outline-none appearance-none w-full border-transparent rounded-e-md pl-2 pr-8 py-2 font-normal border-r-8 text-xs placeholder:text-xs ${dropdownValue ? "text-txt-primary" : "text-txt-secondary"
                            }`}
                    >
                        {dropdownPlaceholder && (
                            <option value={""}>{dropdownPlaceholder}</option>
                        )}

                        {options?.map((val: OptionTypes, index: number) => {
                            return (
                                <React.Fragment key={index}>
                                    <option value={val?.value}>{val?.label}</option>
                                </React.Fragment>
                            );
                        })}
                    </select>
                    <Icon
                        className={`absolute right-4 text-dark-700`}
                        name="ArrowDown"
                        width={13}
                        height={13}
                        alt="Select"
                    />
                </div>
            </div>
        </div>
    );
};

export default DateSelect;
