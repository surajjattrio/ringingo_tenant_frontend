"use client";

import React from "react";

// PROJECT IMPORTS
import { OptionTypes } from "@/types/formTypes";
import Icon from "../ui-components/Icon";

// TYPES
interface MultiDropdownProps {
  className?: string;
  label?: string;
  type?: string;
  name: string;
  isInfo?: boolean;
  value?: string | number;
  defaultValue?: string | number;
  dropdownValue?: string | number;
  defaultDropDownValue?: string | number;
  placeholder?: string;
  touched?: any;
  errors?: any;
  options1?: OptionTypes[];
  options2?: OptionTypes[];
  onChange?: any;
  disabled?: boolean;
  dropdownPlaceholder?: string;
  onFocus?: any;
  onBlur?: any;
  onDropdownChange?: any;
}

/* ============================== MULTI DROPDOWN ============================== */

const MultiDropdown = (props: MultiDropdownProps) => {
  const {
    className = "",
    label,
    name,
    value,
    isInfo = false,
    defaultValue,
    dropdownValue,
    defaultDropDownValue,
    placeholder = "Select option",
    options1 = [],
    options2 = [],
    dropdownPlaceholder = "Select option",
    onChange,
    onDropdownChange,
    touched,
    errors,
    disabled = false,
  } = props;

  const hasError = touched?.[name] && errors?.[name];
  const showLabelAsFloating = Boolean(value || dropdownValue);

  return (
    <div className={`relative w-full ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className={`absolute left-4 text-xs transition-all duration-200 z-10 bg-white px-1
                        ${
                          showLabelAsFloating
                            ? "-top-2 text-primary"
                            : "top-3 text-label-placeholder"
                        }
                        pointer-events-none`}
        >
          {label}
        </label>
      )}

      <div className="grid grid-cols-2 tsm:grid-cols-1 gap-0">
        <div className="relative flex items-center">
          <select
            id={name}
            value={value}
            onChange={onChange}
            defaultValue={defaultValue}
            disabled={disabled}
            className={`peer w-full text-sm transition-all duration-200 bg-white border
                            rounded-l-lg tsm:rounded-t-lg tsm:rounded-bl-none py-2.5 h-10 appearance-none
                            pl-4 pr-10 placeholder-transparent
                            ${
                              hasError
                                ? "border-error"
                                : "border-dark-300 hover:border-dark-500 focus:border-primary"
                            } tsm:border-b-0`}
          >
            {placeholder && <option value={""}>{placeholder}</option>}

            {options1 &&
              options1.map((val: OptionTypes, index: number) => (
                <option key={index} value={val?.value}>
                  {val?.label}
                </option>
              ))}
          </select>
          <Icon
            className="absolute right-3 text-dark-500 pointer-events-none"
            name="ArrowDown"
            width={14}
            height={14}
            alt="Select"
          />
        </div>

        <div className="relative flex items-center">
          <select
            value={dropdownValue}
            onChange={onDropdownChange}
            defaultValue={defaultDropDownValue}
            disabled={disabled}
            className={`peer w-full text-sm transition-all duration-200 bg-white border
                            rounded-r-lg tsm:rounded-b-lg tsm:rounded-tr-none py-2.5 h-10 appearance-none
                            pl-4 pr-10 placeholder-transparent
                            ${
                              hasError
                                ? "border-error"
                                : "border-dark-300 hover:border-dark-500 focus:border-primary"
                            } tsm:border-t-0`}
          >
            {dropdownPlaceholder && (
              <option value={""}>{dropdownPlaceholder}</option>
            )}

            {options2 &&
              options2.map((val: OptionTypes, index: number) => (
                <option key={index} value={val?.value}>
                  {val?.label}
                </option>
              ))}
          </select>
          <Icon
            className="absolute right-3 text-dark-500 pointer-events-none"
            name="ArrowDown"
            width={14}
            height={14}
            alt="Select"
          />
        </div>
      </div>

      {hasError && (
        <p className="text-error text-xs mt-1 animate-fade-in">
          {errors[name]}
        </p>
      )}
    </div>
  );
};

export default MultiDropdown;
