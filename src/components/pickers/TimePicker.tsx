import { useState } from "react";

// PROJECT IMPORT
import { Icon } from "../ui-components";

// THIRD - PARTY IMPORT
import TimePickers from "rc-time-picker";

// TYPES
interface TimePickerProps {
    className?: string;
    isShowLabel?: boolean;
    label?: string;
    name: string;
    placeholder?: string;
    value?: any;
    touched?: any;
    errors?: any;
    isInfo?: boolean;
    focus?: boolean;
    onChange?: any;
    onFocus?: any;
    onBlur?: any;
    onIconClick?: any;
}

const TimePicker = (props: TimePickerProps) => {
    const {
        className,
        isShowLabel = true,
        label,
        name,
        placeholder,
        value,
        isInfo = false,
        touched,
        errors,
        focus,
        onChange,
        onFocus,
        onBlur,
        onIconClick,
    } = props;

    const [isFocused, setIsFocused] = useState<boolean>(false);

    return (
        <>
            <div>
                {isShowLabel && (
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
                )}
                <div className="flex items-center relative">
                    <Icon
                        className={`z-10 absolute left-4 text-dark-700`}
                        name="ClockGray"
                        width={20}
                        height={20}
                        alt="Time"
                        onClick={onIconClick}
                    />
                    <TimePickers
                        id={name}
                        className={`${className} focus:outline-none border-2 rounded-md focus:border-primary py-[2px] pr-5 w-full pl-12 text-xs placeholder:text-xs
                        ${touched && errors && touched[name] && errors[name]
                                ? "border-error"
                                : focus
                                    ? "border-primary"
                                    : "border-dark-700"
                            }`}
                        placeholder={placeholder}
                        value={value}
                        showSecond={false}
                        focusOnOpen
                        allowEmpty={false}
                        format="HH:mm"
                        onChange={(e: any) => {
                            onChange &&
                                onChange(
                                    e?.hour().toString().padStart(2, "0"),
                                    e?.minute().toString().padStart(2, "0")
                                );
                        }}
                        onOpen={() => onFocus ? onFocus() : setIsFocused(true)}
                        onClose={() => onBlur ? onBlur() : setIsFocused(false)}
                    />
                </div>
                {touched && errors && touched[name] && errors[name] && (
                    <span className="text-error font-normal text-xs">{errors[name]}</span>
                )}
            </div>
        </>
    );
};

export default TimePicker;
