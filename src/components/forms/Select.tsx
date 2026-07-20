'use client';

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Selects, { StylesConfig, components } from "react-select";

import { Icon } from "../ui-components";
import Button from "./Button";

import {GroupedOptionTypes, ObjectOptionTypes, OptionTypes} from "@/types/formTypes";
import { IconKey } from "../ui-components/Icon";
type SelectOptions = OptionTypes[] | ObjectOptionTypes[] | GroupedOptionTypes[];

interface SelectProps {
  className?: string;
  style?: any;
  isShowLabel?: boolean;
  label?: any;
  name: string;
  removable?: boolean;
  placeholder?: string;
  icon?: IconKey;
  isInfo?: boolean;
  options: SelectOptions;
  value?: any;
  touched?: any;
  errors?: any;
  onChange?: any;
  onBlur?: any;
  onIconClick?: any;
  isOptionDisabled?: any;
  isMulti?: boolean;
  isNum?: boolean;
  isObjVal?: boolean;
  isPortal?: boolean;
  isGroup?: boolean;
  isManual?: boolean;
  createPath?: string | null;
  createName?: string;
  isAdd?: boolean;
  isDisabled?: boolean;
  onFocus?: any;
}

const Select = (props: SelectProps) => {
  const {
    className = "",
    style = {},
    isShowLabel = true,
    label,
    name,
    removable = false,
    placeholder = "Select",
    icon,
    isInfo = false,
    options = [],
    value,
    touched,
    errors,
    onChange,
    onBlur,
    onIconClick,
    isOptionDisabled,
    isMulti = false,
    isNum = false,
    isObjVal = false,
    isPortal = true,
    isGroup = false,
    isManual = false,
    createPath = null,
    createName = "",
    isAdd = false,
    isDisabled = false,
    onFocus,
  } = props;

  const router = useRouter();
  const [isFocused, setIsFocused] = useState(false);
const [menuOpen, setMenuOpen] = useState(false);

  const hasError = touched?.[name] && errors?.[name];
  const hasValue = isMulti ? value?.length > 0 : !!value;

  const customStyles = {
    control: (base: any, state: any) => ({
      ...base,
      display: "flex",
      alignItems: "center",
      border: `1px solid ${hasError ? "#E7515A" : state.isFocused ? "#4F46E5" : "#E2E8F0"}`,
      backgroundColor: isDisabled ? "#F1F5F9" : "#fff",
      boxShadow: state.isFocused ? "0 0 0 1px #4F46E5" : "none",
      minHeight: "40px",
      height: isMulti && hasValue ? "auto" : "40px",
      paddingLeft: icon ? "2.25rem" : "1rem",
      // paddingRight: "1rem",
      fontSize: "14px",
      fontWeight: "500",
      color: "#0F172A",
      borderRadius: "8px 8px 8px 8px",
      transition: "all 0.2s ease-in-out",
      cursor: isDisabled ? "not-allowed" : "pointer",
      "&:hover": {
        borderColor: hasError ? "A5A6A8" : "A5A6A8"
      }
    }),
    menuPortal: (base: any) => ({
  ...base,
  zIndex: 9999,
}),
    menu: (base: any) => ({
      ...base,
      width: "100%",
      backgroundColor: "white",
      border: "1px solid #E2E8F0",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      borderRadius: "0.5rem",
      marginTop: "4px",
        // Was 20 — tied with other absolute-positioned field decorations (e.g. the
        // DatePicker's calendar icon, also z-20), so on a tie the later-DOM-order
        // sibling painted on top of this open menu instead of the menu winning.
        // Bumped well above any in-form field decoration so an open dropdown always
        // renders on top, regardless of DOM order.
        zIndex: 9999,

    }),
    menuList: (base: any) => ({
  ...base,
  zIndex: 9999,
  padding: 0,
  maxHeight: 200, // ✅ already good, adjust if needed
  overflowY: "auto",
}),

    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected ? "#4F46E5" : state.isFocused ? "#EEF2FF" : "white",
      color: state.isSelected ? "white" : "#1E293B",
      padding: "10px 12px",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: state.isSelected ? "#4F46E5" : "#EEF2FF"
      },
      borderBottom: "none"
    }),
    indicatorSeparator: () => ({
      display: "none"
    }),
    dropdownIndicator: (base: any, state: any) => ({
      ...base,
      color: "#94A3B8",
      transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : "rotate(0deg)",
      transition: "transform 0.2s ease-in-out"
    }),
    placeholder: (base: any) => ({
      ...base,
      color: "#94A3B8",
      fontSize: "14px"
    }),
    singleValue: (base: any) => ({
      ...base,
      color: "#0F172A"
    }),
    valueContainer: (base: any) => ({
      ...base,
      padding: isMulti ? "4px 0" : "0",
      flexWrap: "wrap"
    }),
    multiValue: (base: any) => ({
      ...base,
      backgroundColor: "#F1F5F9",
      borderRadius: "4px",
      margin: "2px 4px 2px 0",
      padding: "0 2px",
      display: "flex",
      alignItems: "center"
    }),
    multiValueLabel: (base: any) => ({
      ...base,
      color: "#0F172A",
      fontSize: "12px",
      padding: "2px 4px",
      paddingLeft: "6px"
    }),
    multiValueRemove: (base: any) => ({
      ...base,
      color: "#64748B",
      cursor: "pointer",
      padding: "0 4px",
      "&:hover": {
        backgroundColor: "#E2E8F0",
        color: "#334155"
      }
    })
  };

  const getOptions = () =>
    removable && options?.length
      ? [{ value: "", label: placeholder }, ...options]
      : options;

  const getValue = () => {
    if (!value) return null;
    if (isGroup) {
      let flatOptions: any[] = [];
      getOptions()?.forEach((group: any) =>
        flatOptions.push(...(group?.options || []))
      );
      return flatOptions.find((opt) => opt.value === value);
    } else {
      return getOptions().find((opt) => opt.value === value);
    }
  };

  const getMultiValue = () => {
    const selected: any[] = [];
    const opts = isGroup
      ? getOptions().flatMap((g: any) => g.options || [])
      : getOptions();

      // console.log("optsopts",opts);
      // console.log("optsopts value",value);
      
    opts.forEach((opt) => {
      // console.log("optsoptsoptsoptsoptsopts opt ",opt);
      if (
        isObjVal
          ? value?.some((v: any) => v?.uuid === opt?.value?.uuid)
          : value?.includes(opt.value)
      ) {
        selected.push(opt);
      }
    });

    return selected;
  };

  const MenuList = (menuProps: any) => (
    <components.MenuList {...menuProps}>
      {isAdd && createPath && (
        <div className="px-2 py-1">
          <Button
            text={createName}
            icon="PlusWhite"
            className="w-full !rounded-sm"
            onClick={() => router.push(createPath)}
          />
        </div>
      )}
      {menuProps.children}
    </components.MenuList>
  );

  // Custom MultiValueContainer component to handle the display of selected items
  const MultiValueContainer = (props: any) => {
    const { children, data } = props;
    return (
      <components.MultiValueContainer {...props} className="flex items-center bg-slate-100 rounded px-1 m-1">
        <span className="multivalue-label">{data.label}</span>
        {children[1]}
      </components.MultiValueContainer>
    );
  };
const [placement, setPlacement] = useState<"top" | "bottom">("bottom");
const wrapperRef = useRef<HTMLDivElement | null>(null);
const handleFocus = (e: any) => {
  setIsFocused(true);
  onFocus?.(e);
  if (wrapperRef.current) {
    const rect = wrapperRef.current.getBoundingClientRect();
    const distanceFromBottom = window.innerHeight - rect.bottom;

    // If less than 300px of space below, open upward
    if (distanceFromBottom < 300) {
      setPlacement("top");
    } else {
      setPlacement("bottom");
    }
  }
};

  return (
    <div className={`relative w-full rounded-[46vh] ${className}`}>
      {isShowLabel && (
        <label
          htmlFor={name}
          className={`
            absolute z-10 px-1 bg-white text-xs  transition-all duration-200 ease-in-out 
            pointer-events-none rounded-[46px] 
            ${icon ? "left-9" : "left-4"}
            ${isFocused || hasValue
              ? "-top-2 scale-90 text-primary"
              : "top-2.5 scale-100 text-dark-400"
            }
          `}
          style={{ transformOrigin: "top left" }}
        >
          {label || name}
        </label>
      )}

      {icon && (
        <Icon
          name={icon}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500 z-10"
          width={16}
          height={16}
          onClick={onIconClick}
        />
      )}

      <div className="relative w-full">
        <Selects
          id={name}
          name={name}
          options={getOptions()}
          value={isMulti ? getMultiValue() : getValue()}
          onChange={(selected: any) => {
            if (isMulti) {
              // onChange(selected);
              onChange(selected.map((opt: any) => opt.value));
            } else if (isManual) {
              onChange(selected);
            } else {
              onChange(
                {
                  target: {
                    name,
                    id: name,
                    value: isNum ? selected?.value : selected?.value?.toString(),
                  },
                },
                selected?.label
              );
            }
          }}
          // onFocus={() => setIsFocused(true)}
              onFocus={handleFocus}

          onBlur={(e: any) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          styles={customStyles}
          components={{ 
            MenuList,
            ...(isMulti ? { MultiValueContainer } : {})
          }}
          menuPosition="absolute"
          menuPlacement="auto"
            menuShouldScrollIntoView={false} 

          classNamePrefix="react-select"
          className="w-full"
          isOptionDisabled={isOptionDisabled}
          isMulti={isMulti}
          isDisabled={isDisabled}
          placeholder={isShowLabel ? "" : placeholder}
        />
      </div>

      {hasError && (
        <p className="text-error text-xs mt-1 animate-fade-in">
          {errors?.[name]}
        </p>
      )}
    </div>
  );
};

export default Select;

