"use client";

// PROJECT IMPORTS
import { OptionTypes } from "@/types/formTypes";
import Icon from "../ui-components/Icon";

// THIRD - PARTY IMPORT
import Select from "react-select";

// TYPES
interface InputSelectProps {
  className?: string;
  label?: any;
  type?: string;
  name: string;
  value?: string;
  dropdownValue?: string;
  defaultDropDownValue?: any;
  placeholder?: string;
  touched?: any;
  errors?: any;
  options?: OptionTypes[];
  onChange?: any;
  disabled?: boolean;
  dropdownPlaceholder?: string;
  onFocus?: any;
  onBlur?: any;
  onDropdownChange?: any;
  isInfo?: boolean;
  noSpace?: boolean;
}

/* ============================== INPUT SELECT ============================== */

const InputSelect = (props: InputSelectProps) => {
  const {
    className = "",
    label,
    type = "text",
    name,
    value,
    dropdownValue,
    defaultDropDownValue,
    placeholder = "Enter value",
    disabled,
    touched,
    errors,
    options,
    dropdownPlaceholder = "Select option",
    onChange,
    onFocus,
    onBlur,
    onDropdownChange,
    isInfo = false,
    noSpace = false,
  } = props;

  const hasError = touched?.[name] && errors?.[name];
  const showLabelAsFloating = Boolean(value);

  const customStyles: any = {
    control: (styles: any, state: any) => ({
      ...styles,
      borderWidth: 1,
      minHeight: 40,
      height: 40,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderColor: hasError ? "#FF4D4F" : "#D8D8D8",
      borderRadius: "0 8px 8px 0",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#BFBFBF",
      },
      "&:focus-within": {
        borderColor: "#322996",
      },
      "@media only screen and (max-width:820px)": {
        ...styles["@media only screen and (max-width:1200px)"],
        borderRadius: "0 0 8px 8px",
        borderTop: 0,
      },
    }),
    dropdownIndicator: (styles: any) => ({
      ...styles,
      padding: "2px 8px",
      color: "#6C757D",
    }),
    indicatorSeparator: (styles: any) => ({
      ...styles,
      display: "none",
    }),
    placeholder: (styles: any) => ({
      ...styles,
      fontSize: "0.875rem",
      color: "#6C757D",
    }),
    singleValue: (styles: any) => ({
      ...styles,
      fontSize: "0.875rem",
    }),
    option: (styles: any, state: any) => ({
      ...styles,
      backgroundColor:
        state.isSelected || state.isFocused ? "#322996" : "white",
      color: state.isSelected || state.isFocused ? "white" : "#000",
      fontSize: "0.875rem",
      padding: "8px 12px",
      "&:hover": {
        backgroundColor: "#322996",
        color: "white",
      },
    }),
    menuList: (styles: any) => ({
      ...styles,
      padding: "4px",
      borderRadius: 8,
    }),
    menu: (styles: any) => ({
      ...styles,
      zIndex: 2,
      borderRadius: 8,
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
      marginTop: "4px",
    }),
  };

  // Get Value For Dropdown
  const getValue = () =>
    options?.find((val: any) => val?.value === dropdownValue);

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
        <input
          id={name}
          className={`peer w-full text-sm transition-all duration-200 bg-white border
                        rounded-l-lg tsm:rounded-t-lg tsm:rounded-bl-none py-2.5 h-10 pl-4 pr-3
                        placeholder-transparent
                        ${
                          hasError
                            ? "border-error"
                            : "border-dark-300 hover:border-dark-500 focus:border-primary"
                        } tsm:border-b-0`}
          type={type}
          name={name}
          placeholder={placeholder}
          value={value || ""}
          onChange={(e: any) => {
            onChange &&
              onChange({
                target: {
                  value: noSpace
                    ? e.target.value?.replace(/\s/g, "")?.toString()
                    : e.target.value?.toString(),
                  name: e.target.name,
                  id: e.target.id,
                },
              });
          }}
          disabled={disabled}
          onBlur={onBlur}
          onFocus={onFocus}
        />

        <Select
          options={options}
          className="w-full text-sm"
          placeholder={dropdownPlaceholder}
          styles={customStyles}
          defaultValue={defaultDropDownValue}
          onBlur={onBlur}
          maxMenuHeight={200}
          value={getValue()}
          onChange={(e: any) => {
            onDropdownChange({
              target: { value: e.value?.toString(), name, id: name },
            });
          }}
          isDisabled={disabled}
        />
      </div>

      {hasError && (
        <p className="text-error text-xs mt-1 animate-fade-in">
          {errors[name]}
        </p>
      )}
    </div>
  );
};

export default InputSelect;
