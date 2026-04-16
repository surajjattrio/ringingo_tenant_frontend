"use client";

// PROJECT IMPORT
import { useRef } from "react";

// PROJECT IMPORT
import Icon from "../ui-components/Icon";
import { readCsvFile } from "@/helperFunctions";

// TYPES
interface FilePickerProps {
  label?: any;
  name: string;
  value?: any;
  placeholder?: string;
  isInfo?: boolean;
  isShowLabel?: boolean;
  accept?: string;
  touched?: any;
  errors?: any;
  onChange?: any;
  disabled?: boolean;
  onFocus?: any;
  onBlur?: any;
  showImage?: boolean;
  imageUrl?: any;
}

/* ============================== FILE - PICKER ============================== */

const FilePicker = (props: FilePickerProps) => {
  const {
    label,
    name,
    value,
    placeholder = "Choose file to import",
    isInfo = false,
    isShowLabel = true,
    accept,
    touched,
    errors,
    disabled,
    onChange,
    onFocus,
    showImage = false,
    imageUrl,
  } = props;

  const ref = useRef<any>();
  const hasError = touched && errors && touched[name] && errors[name];
  const showLabelAsFloating = Boolean(value?.name);

  return (
    <div className="relative w-full ">
      {/* <div className="relative w-full max-w-[280px]"> */}
      {isShowLabel && (
        <label
          htmlFor={name}
          className={`absolute left-4 right-24 text-xs leading-tight transition-all duration-200 z-10 px-1
    break-words whitespace-normal
    ${showLabelAsFloating ? "-top-2 text-primary" : "top-2 text-dark-400"}
    pointer-events-none`}
        >
          {label || name}
        </label>
      )}

      {showImage && imageUrl && (
        <div className="mb-4" style={{ width: "200px", height: "115px" }}>
          <img style={{ height: "100%" }} id={name} src={imageUrl} />
        </div>
      )}

      <input
        name={name}
        ref={ref}
        accept={accept}
        id="file"
        disabled={disabled}
        hidden
        type="file"
        onChange={(e: any) => {
          const file = e.target.files?.[0];
          if (!file) {
            return;
          }
          const reader = new FileReader();
          reader.onload = (e: any) => {
            const data = readCsvFile(e.target.result);
            if (showImage) {
              onChange({ target: { file: file, name: name } });
            } else {
              onChange?.(file, data);
            }
          };
          reader.readAsText(file);
        }}
      />

      <div className="relative">
        <input
          id={name}
          className={`peer w-full text-sm transition-all duration-200 bg-white border
    rounded-lg pl-4 pr-24 pt-[1.25rem] pb-[0.25rem] h-[40px] peer-placeholder-shown:h-[40px] peer-focus:h-auto
    placeholder-transparent
    ${
      hasError
        ? "border-error"
        : "border-dark-300 hover:border-dark-500 focus:border-primary"
    }`}
          type="text"
          placeholder={isShowLabel ? "" : placeholder}
          value={value?.name || ""}
          disabled={true}
          onFocus={onFocus}
        />

        <button
          type="button"
          className="absolute right-0 top-0 bottom-0 bg-primary hover:bg-primary-dark 
    text-white rounded-r-lg px-4 text-sm font-medium transition-colors 
    duration-200 flex items-center justify-center h-full whitespace-nowrap w-[90px]"
          onClick={() => ref.current.click()}
        >
          Select file
        </button>
      </div>

      {hasError && (
        <p className="text-error text-xs mt-1 animate-fade-in">
          {errors[name]}
        </p>
      )}
    </div>
  );
};

export default FilePicker;
