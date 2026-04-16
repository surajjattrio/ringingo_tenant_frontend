import { useState } from "react";

// PROJECT IMPORT
import { Icon } from "../ui-components";

// THIRD - PARTY IMPORT
import TimePickers from "rc-time-picker";
import moment from "moment";

// TYPES
interface TimePickerProps {
    className?: string;
    isShowLabel?: boolean;
    label?: any;
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

const TimePickerWithAMPM = (props: TimePickerProps) => {
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
    const [startTime, setStartTime] = useState(moment());

    const handleTimeChange = (value: any) => {
        setStartTime(value);
    };

    const hasError = touched?.[name] && errors?.[name];
    const showLabelAsFloating = Boolean(value);

    return (
        <div className={`relative w-full ${className}`}>
            {isShowLabel && (
                <label
                    htmlFor={name}
                    className={`absolute left-9 text-xs transition-all duration-200 z-10 bg-white px-1
                        ${showLabelAsFloating
                            ? "-top-2 text-primary"
                            : "top-3 text-label-placeholder"
                        }
                        pointer-events-none`}
                >
                    {label || name}
                </label>
            )}
            <div className="relative flex items-center">
                <Icon
                    className="absolute left-3 z-10 text-dark-500 cursor-pointer"
                    name="StartTime"
                    width={16}
                    height={16}
                    alt="Time"
                    onClick={onIconClick}
                />
                <TimePickers
                    id={name}
                    className={`focus:outline-none border-2 text-xs rounded-md py-2.5 h-10 pl-10 pr-4 w-full
                        ${hasError
                            ? "border-error"
                            : "border-dark-300 hover:border-dark-500 focus:border-primary"
                        }
                        placeholder-transparent`}
                    placeholder={isShowLabel ? "" : placeholder}
                    value={value}
                    showSecond={false}
                    focusOnOpen
                    allowEmpty={false}
                    format="hh:mm a"
                    use12Hours
                    onChange={(e: any) => {
                        if (e) {
                            const hours = e.hour().toString().padStart(2, "0");
                            const minutes = e.minute().toString().padStart(2, "0");
                            const period = e.format("A");
                            onChange && onChange(hours, minutes, period);
                        }
                    }}
                    onOpen={() => {
                        onFocus ? onFocus() : setIsFocused(true);
                    }}
                    onClose={() => {
                        onBlur ? onBlur() : setIsFocused(false);
                    }}
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

export default TimePickerWithAMPM;
