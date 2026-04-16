import React from "react";
import { Icon } from "../ui-components";

// TYPE
interface IncreaseDecreaseInputProps {
    value?: any;
    label?: string;
    name: string;
    onChange?: any;
    disabled?: any;
    min?: number
    max?: number;
    onBlur?: any;
    onFocus?: any;
    isIconSuccess?: boolean
}

/* ============================== INCREASE - DECREASE ============================== */

const IncreaseDecreaseInput = (props: IncreaseDecreaseInputProps) => {
    const { label, name, value, onChange, disabled, onBlur, onFocus, min = -1,
        max,
        isIconSuccess } = props;

    return (
        <>
            <div className="h-[42px] w-full flex justify-between items-center">
                {label && <label htmlFor={name} className="text-txt-primary text-xs font-bold">
                    {label}
                </label>}
                <div className="max-w-[130px] relative flex items-center">
                    <Icon
                        className="absolute left-3 cursor-pointer"
                        name={isIconSuccess ? "MinusCircleGreen" : "MinusCircle"}
                        height={20}
                        width={20}
                        alt="iconDecrease"
                        onClick={() => {
                            onChange && onChange(parseInt(value) > min ? (parseInt(value) - 1)?.toString() : value?.toString())
                        }}
                    />
                    <input
                        id={name}
                        min={min}
                        max={max}
                        className="bg-white focus:outline-none border-2 border-dark-700 font-normal text-txt-primary py-2 rounded-md text-xs max-w-[130px] px-10 text-center"
                        type="number"
                        value={value}
                        name={name}
                        onChange={(e: any) => {
                            // e.target.value > (min - 1) && e.target.value < (max + 1) ? onChange(e.target.value?.toString()) : null
                            const v = e.target.value;
                            if (v > min - 1 && (max === undefined || v < max + 1)) {
                                onChange(v.toString());
                            }
                        }}
                        disabled={disabled}
                        onBlur={onBlur}
                        onFocus={onFocus}
                    />
                    <Icon
                        className="absolute right-3 cursor-pointer"
                        name={isIconSuccess ? "PlusCircleGreen" : "PlusCircle"}
                        height={20}
                        width={20}
                        alt="iconIncrese"
                        onClick={() => {
                            // onChange && onChange(parseInt(value) < max ? (parseInt(value) + 1)?.toString() : value?.toString())
                            onChange &&
                                onChange(
                                    max === undefined || parseInt(value) < max
                                        ? (parseInt(value) + 1)?.toString()
                                        : value?.toString()
                                );
                        }}
                    />
                </div>
            </div>
        </>
    );
};

export default IncreaseDecreaseInput;
