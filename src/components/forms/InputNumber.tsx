// PROJECT IMPORT
import Icon, { IconKey } from "../ui-components/Icon";

// TYPES
interface InputNumberProps {
  className?: string;
  inputClassName?: string;
  label?: string;
  type?: string;
  icon?: IconKey;
  name: string;
  placeholder?: string;
  min?: number;
  value?: string;
  rightIcon?: IconKey;
  tooltip?: string;
  rightTooltip?: string;
  isInfo?: boolean;
  isShowLabel?: boolean;
  touched?: any;
  errors?: any;
  onChange?: any;
  disabled?: boolean;
  onFocus?: any;
  onBlur?: any;
  onClick?: () => void;
  onIconClick?: () => void;
  onRightIconClick?: () => void;
}

/* ============================== INPUT - NUMBER ============================== */

const InputNumber = (props: InputNumberProps) => {
  const {
    className = "",
    inputClassName = "",
    label,
    type = "number",
    name,
    icon,
    placeholder = "Enter number",
    min = 0,
    value,
    rightIcon,
    tooltip,
    rightTooltip,
    disabled,
    isInfo = false,
    isShowLabel = true,
    touched,
    errors,
    onChange,
    onFocus,
    onBlur,
    onClick,
    onIconClick,
    onRightIconClick,
  } = props;

  const hasError = touched?.[name] && errors?.[name];
  const hasValue = !!value;
  const showLabelAsFloating = hasValue;

  return (
    <div className={`relative w-full ${className}`}>
      {isShowLabel && (
        <label
          htmlFor={name}
          className={`absolute left-9 text-xs transition-all duration-200 z-10 bg-white px-1
            ${showLabelAsFloating
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
          disabled={disabled}
          placeholder={isShowLabel ? "" : placeholder}
          min={min}
          value={value || ""}
          onClick={onClick}
          onChange={(e: any) => {
            const newVal = e.target.value;
            if (newVal === "" || parseInt(newVal) >= min) {
              onChange(newVal);
            }
          }}
          onBlur={onBlur}
          onFocus={onFocus}
          className={`focus:outline-none border-2 text-xs placeholder:text-txt-secondary rounded-md focus:border-primary py-2.5 h-10 w-full
            ${icon ? "pl-10" : "pl-4"} pr-10
            placeholder-transparent
            ${hasError
              ? "border-error"
              : "border-dark-300 hover:border-dark-500 focus:border-primary"
            }
            ${inputClassName}`}
        />

        <div className="absolute right-0.5 bg-transparent border-s-2 border-dark-300 select-none">
          <div
            className="border-b-2 border-dark-300 px-4 cursor-pointer"
            onClick={() => {
              onChange(value ? (parseInt(value) + 1).toString() : "1");
            }}
          >
            <Icon name="ArrowUp" height={16} width={16} alt="increase" />
          </div>
          <div
            className="px-4 cursor-pointer"
            onClick={() => {
              if (!value) return;
              onChange(
                parseInt(value) > min ? (parseInt(value) - 1).toString() : ""
              );
            }}
          >
            <Icon name="ArrowDown" height={16} width={16} alt="decrease" />
          </div>
        </div>

        {rightIcon && (
          <Icon
            name={rightIcon}
            tooltip={rightTooltip}
            onClick={onRightIconClick}
            className="absolute right-12 text-dark-500 cursor-pointer"
            width={18}
            height={18}
          />
        )}
      </div>

      {hasError && (
        <p className="text-error text-xs mt-1 animate-fade-in">{errors?.[name]}</p>
      )}
    </div>
  );
};

export default InputNumber;
