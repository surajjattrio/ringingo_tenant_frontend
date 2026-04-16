// PROJECT IMPORT
import { useState } from "react";
import Icon, { IconKey } from "../ui-components/Icon";

// TYPES
interface ModernInputProps {
  className?: string;
  inputClassName?: string;
  label?: string;
  type?: string;
  name: string;
  value?: string | number;
  placeholder?: string;
  icon?: IconKey;
  isInfo?: boolean;
  isShowLabel?: boolean;
  noSpace?: boolean;
  tooltip?: string;
  rightTooltip?: string;
  rightIcon?: IconKey;
  touched?: any;
  errors?: any;
  onChange?: any;
  disabled?: boolean;
  onFocus?: any;
  onBlur?: any;
  onClick?: any;
  onIconClick?: any;
  onRightIconClick?: any;
  variant?: "default" | "filled" | "outlined" | "underlined" | "floating";
  size?: "sm" | "md" | "lg";
}

/* ============================== MODERN INPUT ============================== */

const ModernInput = (props: ModernInputProps) => {
  const {
    className = "",
    inputClassName = "",
    label,
    type = "text",
    name,
    value,
    placeholder,
    disabled,
    icon,
    isInfo = false,
    isShowLabel = true,
    noSpace = false,
    tooltip,
    rightTooltip,
    rightIcon,
    touched,
    errors,
    onChange,
    onFocus,
    onBlur,
    onClick,
    onIconClick,
    onRightIconClick,
    variant = "default",
    size = "md",
  } = props;

  const [isFocused, setIsFocused] = useState(false);
  const hasError = touched && errors && touched[name] && errors[name];
  const hasValue = value !== undefined && value !== null && value !== "";

  // Dynamic classes based on variants
  const getInputWrapperClasses = () => {
    const baseClasses = "relative flex items-center w-full";

    switch (variant) {
      case "filled":
        return `${baseClasses} ${hasError ? "bg-red-50" : "bg-gray-100"
          } rounded-lg`;
      case "outlined":
        return `${baseClasses} ${hasError
            ? "border-2 border-error rounded-lg"
            : isFocused
              ? "border-2 border-primary rounded-lg"
              : "border-2 border-gray-300 rounded-lg"
          }`;
      case "underlined":
        return `${baseClasses} border-b-2 ${hasError
            ? "border-error"
            : isFocused
              ? "border-primary"
              : "border-gray-300"
          }`;
      case "floating":
        return `${baseClasses} border ${hasError
            ? "border-error"
            : isFocused
              ? "border-primary"
              : "border-gray-300"
          } rounded-lg`;
      default:
        return baseClasses;
    }
  };

  const getInputClasses = () => {
    const sizeClasses = {
      sm: "py-1.5 text-xs",
      md: "py-2.5 text-sm",
      lg: "py-3.5 text-base",
    };

    const baseClasses = `
      ${inputClassName}
      ${sizeClasses[size]}
      w-full
      focus:outline-none
      transition-all
      ease-in-out
      duration-300
      ${icon ? "pl-12" : "pl-4"} 
      ${rightIcon ? "pr-12" : "pr-4"}
      disabled:cursor-not-allowed
      disabled:opacity-60
    `;

    switch (variant) {
      case "filled":
        return `${baseClasses} bg-transparent border-none rounded-lg`;
      case "outlined":
        return `${baseClasses} bg-transparent border-none rounded-lg`;
      case "underlined":
        return `${baseClasses} bg-transparent border-none pb-2`;
      case "floating":
        return `${baseClasses} bg-transparent border-none ${isFocused || hasValue ? "pt-6 pb-2" : "py-4"
          }`;
      default:
        return `
          ${baseClasses}
          border
          rounded-lg
          ${hasError
            ? "border-error text-error placeholder:text-error/50"
            : "border-gray-300 focus:border-primary hover:border-primary/70"
          }
          focus:shadow-[0_4px_12px_rgba(102,162,134,0.15)]
          focus:ring-2
          focus:ring-primary/10
        `;
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus && onFocus(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur && onBlur(e);
  };

  return (
    <div className={`${className} group`}>
      {isShowLabel && variant !== "floating" && (
        <div className="text-xs font-semibold pb-2 flex items-center">
          <label
            htmlFor={name}
            className="text-gray-700 group-hover:text-primary transition-colors duration-300"
          >
            {label ? label : name}
          </label>
          {isInfo && (
            <Icon
              tooltip={label ? label : name}
              className="ml-3 cursor-pointer text-gray-500 hover:text-primary transition-colors duration-300"
              name="InfoCircle"
              width={15}
              height={15}
              alt={label ? label : name}
            />
          )}
        </div>
      )}
      <div className={getInputWrapperClasses()}>
        {icon && (
          <Icon
            tooltip={tooltip}
            className={`absolute left-4 z-10 ${hasError
                ? "text-error"
                : disabled
                  ? "text-gray-400"
                  : isFocused
                    ? "text-primary"
                    : "text-gray-500 group-hover:text-primary"
              } transition-all duration-300 ease-in-out`}
            name={icon}
            width={18}
            height={18}
            alt={icon}
            onClick={onIconClick}
          />
        )}
        {variant === "floating" && (
          <label
            htmlFor={name}
            className={`absolute left-4 transition-all duration-200 pointer-events-none ${isFocused || hasValue
                ? "transform -translate-y-3 scale-75 text-xs opacity-100"
                : "transform translate-y-0 scale-100 text-sm opacity-70"
              } ${hasError
                ? "text-error"
                : isFocused
                  ? "text-primary"
                  : "text-gray-500"
              }`}
          >
            {label ? label : name}
          </label>
        )}
        <input
          id={`id_${name}`}
          autoComplete="off"
          className={getInputClasses()}
          type={type}
          name={name}
          placeholder={variant === "floating" ? "" : placeholder}
          value={value}
          onChange={(e: any) => {
            onChange &&
              onChange({
                target: {
                  value: noSpace
                    ? e.target.value?.replace(/\s/g, "")?.toString()
                    : e.target.value?.toString(),
                  name,
                  id: e.target?.id,
                },
              });
          }}
          disabled={disabled}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onClick={onClick}
        />
        {rightIcon && (
          <Icon
            tooltip={rightTooltip}
            name={rightIcon}
            className={`absolute right-4 items-center ${hasError
                ? "text-error"
                : disabled
                  ? "text-gray-400"
                  : isFocused
                    ? "text-primary"
                    : "text-gray-500 hover:text-primary"
              } transition-all duration-300 ease-in-out cursor-pointer`}
            width={20}
            height={20}
            alt={rightIcon}
            onClick={onRightIconClick}
          />
        )}
      </div>
      {hasError && (
        <div className="flex items-center mt-2 animate-fadeIn">
          <Icon
            name="Circle"
            className="text-error mr-1.5"
            width={12}
            height={12}
          />
          <span className="text-error font-medium text-[11px]">
            {errors[name]}
          </span>
        </div>
      )}
    </div>
  );
};

export default ModernInput;
