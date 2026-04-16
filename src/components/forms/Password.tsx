'use client';

//PROJECT IMPORT
import { useState } from "react";
import Icon from "../ui-components/Icon";

// TYPES
interface InputProps {
    className?: string;
    inputClassName?: string;
    label?: any;
    name: string;
    value?: string | number;
    placeholder?: string;
    isInfo?: boolean;
    isShowLabel?: boolean;
    touched?: any;
    errors?: any;
    onChange?: any;
    disabled?: boolean;
    onFocus?: any;
    onBlur?: any;
    onClick?: any;
}

/* ============================== PASSWORD INPUT ============================== */

const Password = (props: InputProps) => {
    const {
        className = "",
        inputClassName = "",
        label,
        name,
        value,
        placeholder = "Enter Password",
        disabled,
        isInfo = false,
        isShowLabel = true,
        touched,
        errors,
        onChange,
        onFocus,
        onBlur,
        onClick,
    } = props;

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const hasError = touched?.[name] && errors?.[name];
    const showLabelAsFloating = Boolean(value);

    return (
        <div className={`relative w-full ${className}`}>
            {isShowLabel && (
                <label
                    htmlFor={name}
                    className={`absolute left-9 text-xs transition-all duration-200 z-10 bg-white px-1
                        ${showLabelAsFloating ? "-top-2 text-primary" : "top-3 text-dark-400"}
                        pointer-events-none`}
                >
                    {label || name}
                </label>
            )}

            <div className="relative flex items-center">
                <Icon
                    name="Lock"
                    className="absolute left-3 z-10 text-dark-500"
                    width={16}
                    height={16}
                    alt="Lock"
                />
                
                <input
                    autoComplete="new-password"
                    id={name}
                    type={showPassword ? "text" : "password"}
                    className={`peer w-full text-sm transition-all duration-200 bg-white border 
                        rounded-lg py-2.5 h-10 pl-10 pr-10
                        placeholder-transparent focus:outline-none
                        ${hasError ? "border-error" : "border-dark-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"}
                        ${inputClassName}`}
                    name={name}
                    placeholder={isShowLabel ? "" : placeholder}
                    value={value}
                    onChange={(e: any) => {
                        onChange && onChange({
                            target: {
                                value: e.target.value?.toString(),
                                name,
                                id: e.target?.id,
                            },
                        });
                    }}
                    disabled={disabled}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    onClick={onClick}
                />
                
                <Icon
                    name={showPassword ? "Eye" : "EyeCloseGray"}
                    className="absolute right-3 z-10 text-dark-500 cursor-pointer"
                    width={18}
                    height={18}
                    alt="Show/Hide Password"
                    onClick={() => {
                        setShowPassword(!showPassword);
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

export default Password;
