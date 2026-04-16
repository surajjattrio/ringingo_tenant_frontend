// TYPES
interface CheckBoxProps {
  className?: string;
  inputClassName?: string;
  label?: string;
  defaultChecked?: boolean;
  checked?: boolean;
  disabled?: boolean;
  onChange?: any;
  labelClassName?: any;
  isAdmin?: boolean;
}

/* ============================== CHECK BOX ============================== */

const CheckBox = (props: CheckBoxProps) => {
  const {
    className = "",
    inputClassName,
    label,
    defaultChecked,
    checked,
    disabled = false,
    labelClassName,
    onChange,
    isAdmin = false,
  } = props;

  return (
    <>
      {/* <div
                className={`${className} flex justify-center items-center select-none gap-2 ${isAdmin ? "bg-primary-primaryPurple w-96" : ""}`}
            >
                <div
                    className={`w-[13px] h-[13px] border p-[1px] flex items-center justify-center rounded ${disabled ? 'opacity-60' : ''} ${checked || defaultChecked
                        ? "bg-primary border-primary"
                        : "border-[rgb(133,133,133)]"
                        }`}
                    onClick={() => {
                        (onChange && !defaultChecked && !disabled) ? onChange(!checked) : null
                    }}
                >
                    {(checked || defaultChecked) && (
                        <svg
                            width="10"
                            height="8"
                            viewBox="0 0 10 8"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M1.5 4L4 6.5L9 1.5"
                                stroke="white"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    )}
                </div>
                {label && (
                    <label className={`${labelClassName} text-xs`}>{label}</label>
                )}
            </div> */}
      <div
        className={`
    flex items-center gap-2 select-none
    ${
      isAdmin
        ? "bg-primary-primaryPurple text-white px-4 py-4 rounded-full w-full"
        : "justify-center"
    }
    ${className}
  `}
      >
        {/* Checkbox */}
        <div
          className={`
      w-[16px] h-[16px] border p-[1px] flex items-center justify-center rounded
      ${disabled ? "opacity-60" : ""}
      ${
        checked || defaultChecked
          ? "bg-primary border-primary"
          : "border-[rgb(133,133,133)]"
      }
      cursor-pointer
    `}
          onClick={() => {
            onChange && !defaultChecked && !disabled
              ? onChange(!checked)
              : null;
          }}
        >
          {(checked || defaultChecked) && (
            <svg
              width="10"
              height="8"
              viewBox="0 0 10 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.5 4L4 6.5L9 1.5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>

        {/* Label */}
        {label && (
          <label
            className={`
        text-sm ${labelClassName}
        ${isAdmin ? "text-white font-medium" : ""}
      `}
          >
            {label}
          </label>
        )}
      </div>
    </>
  );
};

export default CheckBox;
