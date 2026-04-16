"use client";

import Icon, { IconKey } from "../ui-components/Icon";

interface InputProps {
  className?: string;
  inputClassName?: string;
  label?: any;
  type?: string;
  name: string;
  value?: string | number;
  placeholder?: string;
  icon?: IconKey;
  rightIcon?: IconKey;
  tooltip?: string;
  rightTooltip?: string;
  touched?: any;
  errors?: any;
  isInfo?: boolean;
  isShowLabel?: boolean;
  noSpace?: boolean;
  disabled?: boolean;
  onChange?: (e: any) => void;
  onFocus?: () => void;
  onBlur?: any;
  onClick?: () => void;
  onIconClick?: () => void;
  onRightIconClick?: () => void;
}

const Input = ({
  className = "",
  inputClassName = "",
  label,
  type = "text",
  name,
  value,
  placeholder = "Enter value",
  disabled,
  icon,
  rightIcon,
  tooltip,
  rightTooltip,
  touched,
  errors,
  isInfo = false,
  isShowLabel = true,
  noSpace = false,
  onChange,
  onFocus,
  onBlur,
  onClick,
  onIconClick,
  onRightIconClick,
}: InputProps) => {
  const hasError = touched?.[name] && errors?.[name];
  const showLabelAsFloating = Boolean(value);

  return (
    <div className={`relative w-full  ${className}`}>
      {isShowLabel && (
        <label
          htmlFor={name}
          className={`absolute left-9 text-xs transition-all duration-200 z-10 bg-white px-1
            ${
              showLabelAsFloating
                ? "-top-2 text-primary"
                : "top-3 text-dark-400"
            }
            pointer-events-none`}
        >
          {label || name}
        </label>
      )}

      <div className="relative flex items-center">
        {icon && (
          <Icon
            name={icon}
            tooltip={tooltip}
            onClick={onIconClick}
            className="absolute left-3 z-10 text-dark-500 cursor-pointer"
            width={16}
            height={16}
          />
        )}

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          autoComplete="off"
          placeholder={isShowLabel ? "" : placeholder}
          disabled={disabled}
          onFocus={onFocus}
          onBlur={onBlur}
          onClick={onClick}
          onChange={(e) => {
            const newVal = noSpace
              ? e.target.value?.replace(/\s/g, "")
              : e.target.value;
            onChange?.({
              target: {
                name,
                value: newVal,
                id: e.target.id,
              },
            });
          }}
          className={`focus:outline-none border border-dark-300 text-xs placeholder:text-txt-secondary rounded-[0.5rem] focus:border-primary py-2.5 h-10 w-full
            ${icon ? "pl-10" : "pl-4"} ${rightIcon ? "pr-10" : "pr-4"}
            placeholder-transparent
            ${
              hasError
                ? "border-error"
                : "focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
            }
            ${inputClassName}`}
        />

        {rightIcon && (
          <Icon
            name={rightIcon}
            tooltip={rightTooltip}
            onClick={onRightIconClick}
            className="absolute right-3 text-dark-500 cursor-pointer"
            width={18}
            height={18}
          />
        )}
      </div>

      {hasError && (
        <p className="text-error text-xs mt-1 animate-fade-in">
          {errors?.[name]}
        </p>
      )}
    </div>
  );
};

export default Input;
