import { useRef, useState } from "react";

// PROJECT IMPORT
import { Icon } from "../ui-components";

// THIRD-PARTY IMPORT
import DatePicker from "react-datepicker";
import moment from "moment";

// TYPES
interface DatePickerProps {
    className?: string;
    isShowLabel?: boolean;
    startLabel?: string;
    endLabel?: string;
    name: string;
    minDate?: any;
    maxDate?: any;
    startDate?: any;
    endDate?: any;
    startPlaceholder?: string;
    endPlaceholder?: string;
    touched?: any;
    errors?: any;
    isInfo?: boolean;
    focus?: boolean;
    onChange?: any;
    onFocus?: any;
    onBlur?: any;
    onIconClick?: any;
}

const DateRangePicker = (props: DatePickerProps) => {
    const {
        className,
        isShowLabel = true,
        startLabel = "Start Date",
        endLabel = "End Date",
        name,
        minDate,
        maxDate,
        startPlaceholder = "Select Start Date",
        endPlaceholder = "Select End Date",
        startDate,
        endDate,
        isInfo = false,
        touched,
        errors,
        focus,
        onChange,
        onFocus,
        onBlur,
        onIconClick,
    } = props;
    const ref = useRef<any>(null);

    const getStartDateText = (date: any, key?: string): any => {
        const start_year = moment(date)?.year().toString();
        const start_month = (moment(date)?.month() + 1).toString().padStart(2, "0");
        const monthday_start = moment(date)?.date().toString().padStart(2, "0");
        return key === "string"
            ? `${start_year?.toString()}/${start_month?.toString()}/${monthday_start?.toString()}`
            : { start_year, start_month, monthday_start };
    };

    const getEndDateText = (date: any, key?: string): any => {
        const end_year = moment(date)?.year().toString();
        const end_month = (moment(date)?.month() + 1).toString().padStart(2, "0");
        const monthday_end = moment(date)?.date().toString().padStart(2, "0");
        return key === "string"
            ? `${end_year?.toString()}/${end_month?.toString()}/${monthday_end?.toString()}`
            : { end_year, end_month, monthday_end };
    };

    return (
        <>
            <div className={`${className} h-full grid grid-cols-2`}>
                <div>
                    {isShowLabel && (
                        <div className="text-xs font-semibold flex items-center">
                            <label htmlFor={name}>{startLabel ? startLabel : name}</label>
                            {isInfo && (
                                <Icon
                                    tooltip={startLabel ? startLabel : name}
                                    className="ml-3 cursor-pointer"
                                    name="InfoCircle"
                                    width={15}
                                    height={15}
                                    alt={startLabel ? startLabel : name}
                                />
                            )}
                        </div>
                    )}

                    <div className="relative cursor-pointer z-20">
                        <DatePicker
                            id={name}
                            ref={ref}
                            className="top-0 absolute opacity-0 z-10"
                            minDate={minDate}
                            maxDate={maxDate}
                            onChange={(selectedDates: any) => {
                                onChange(
                                    selectedDates[0] ? getStartDateText(selectedDates[0]) : {},
                                    selectedDates[1] ? getEndDateText(selectedDates[1]) : {}
                                );
                            }}
                            startDate={startDate}
                            endDate={endDate}
                            selectsRange={true}
                        />
                        <div className="absolute top-0 w-full h-full">
                            <div className="flex items-center relative h-full">
                                <Icon
                                    className={`z-10 absolute left-4 top-4 text-dark-700`}
                                    name="CalendarGray"
                                    width={20}
                                    height={20}
                                    alt="Calendar"
                                    onClick={onIconClick}
                                />
                                <div
                                    className={`focus:outline-none whitespace-nowrap overflow-hidden border-2 border-r-0 rounded-r-none rounded-md focus:border-primary pr-5 py-2 mt-7 w-full pl-12 text-xs
                        ${touched && errors && touched[name] && errors[name]
                                            ? "border-error"
                                            : "border-dark-700"
                                        }`}
                                    onClick={() => {
                                        ref.current?.deferFocusInput();
                                    }}
                                >
                                    {startDate ? (
                                        <span className="text-txt-primary px-2">
                                            {getStartDateText(startDate, "string")}
                                        </span>
                                    ) : (
                                        <span className="text-txt-secondary px-2">
                                            {startPlaceholder}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    {isShowLabel && (
                        <div className="text-xs font-semibold pb-2 flex items-center">
                            <p>{endLabel ? endLabel : name}</p>
                            {isInfo && (
                                <Icon
                                    tooltip={endLabel ? endLabel : name}
                                    className="ml-3 cursor-pointer"
                                    name="InfoCircle"
                                    width={15}
                                    height={15}
                                    alt={endLabel ? endLabel : name}
                                />
                            )}
                        </div>
                    )}
                    <div className="flex items-center relative cursor-pointer">
                        <Icon
                            className={`z-10 absolute left-4 text-dark-700`}
                            name="CalendarGray"
                            width={20}
                            height={20}
                            alt="Calendar"
                            onClick={onIconClick}
                        />
                        <div
                            className={`focus:outline-none whitespace-nowrap overflow-hidden border-2 rounded-r-md focus:border-primary pr-5 py-2 w-full pl-12 text-xs
                        ${touched && errors && touched[name] && errors[name]
                                    ? "border-error"
                                    : "border-dark-700"
                                }`}
                            onClick={() => {
                                ref.current?.deferFocusInput();
                            }}
                        >
                            {endDate ? (
                                <span className="text-txt-primary px-2">
                                    {getEndDateText(endDate, "string")}
                                </span>
                            ) : (
                                <span className="text-txt-secondary px-2">
                                    {endPlaceholder}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DateRangePicker;
