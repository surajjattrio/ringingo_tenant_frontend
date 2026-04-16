// import React from "react";
// import { ObjectOptionTypes, OptionTypes } from "@/types/formTypes";
// import styled from "styled-components";

// interface CheckboxOption {
//   label: string;
//   value: string;
// }

// interface CheckboxProps {
//   name: string;
//   options: CheckboxOption[];
//   selectedValue?: string;
//   onChange: any;
//   className?: any;
//   touched?: any;
//   errors?: any;
//   onBlur?: any;
//   isShowLabel?: boolean;
//   label?: string;
//   value?: string;
//   selectedValues: string[];
// }

// const CheckboxContainer = styled.div`
//   display: flex;
//   flex-direction: column;
// `;

// const CheckboxGroup = styled.div`
//   display: flex;
//   flex-direction: row;
//   align-items: center;
//   position: relative;
// `;

// const CheckboxOptionLabel = styled.label`
//   color: rgba(0, 0, 0, 0.75);
//   display: block;
//   position: relative;
//   padding-left: 20px;
//   line-height: 20px;
//   margin-bottom: 12px;
//   margin-left: 10px;
//   cursor: pointer;
//   -webkit-user-select: none;
//   -moz-user-select: none;
//   -ms-user-select: none;
//   user-select: none;
//   font-size: 12px;
//   line-height: 13px;

//   &:first-child {
//     margin-left: 0px;
//   }
// `;

// const CheckboxCustomSelect = styled.span`
//   position: absolute;
//   top: 0;
//   left: 0;
//   height: 13px;
//   width: 13px;
//   background-color: rgba(0, 0, 0, 0);
//   border: 2px solid rgba(0, 0, 0, 0.25);
//   transition: all 0.3s;
//   border-radius: 0.25rem;

//   & svg {
//     position: relative;
//     top: 50%;
//     transform: translateY(-50%);
//     margin: 0 auto;
//     display: none;
//   }
// `;

// const CheckboxInput = styled.input`
//   position: absolute;
//   cursor: pointer;
//   display: none;

//   &:focus {
//     border-color: #66a286;
//   }

//   &:checked ~ span {
//     background-color: #66a286;
//     border-color: #66a286;
//   }

//   &:checked ~ span svg {
//     display: block;
//   }
// `;

// const Checkbox = (props: CheckboxProps) => {
//   const {
//     className = "",
//     isShowLabel = true,
//     label,
//     selectedValues,
//     name,
//     selectedValue,
//     options = [],
//     value,
//     touched,
//     errors,
//     onChange,
//     onBlur,
//   } = props;

//   return (
//     <CheckboxContainer className={className}>
//       {isShowLabel && (
//         <div className="text-xs font-semibold pb-2 flex items-center">
//           <label htmlFor={name}>{label ? label : name}</label>
//         </div>
//       )}
//       <CheckboxGroup>
//         {options.map((option, index) => (
//           <CheckboxOptionLabel
//             htmlFor={`opt${index.toString()}`}
//             key={option.value}
//           >
//             {option.label}
//             <CheckboxInput
//               id={`opt${index.toString()}`}
//               type="checkbox"
//               name={name}
//               value={option.value}
//               checked={selectedValues?.includes(option.value)}
//               onChange={onChange}
//               onBlur={onBlur}
//             />
//             <CheckboxCustomSelect>
//               <svg
//                 width="9"
//                 height="8"
//                 viewBox="0 0 9 8"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   d="M1.5 4L4 6.5L9 1.5"
//                   stroke="white"
//                   strokeWidth="1.5"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//               </svg>
//             </CheckboxCustomSelect>
//           </CheckboxOptionLabel>
//         ))}
//       </CheckboxGroup>
//     </CheckboxContainer>
//   );
// };

// export default Checkbox;

"use client";

import { useState } from "react";

interface CheckBoxProps {
  className?: string;
  inputClassName?: string;
  options?: any;
  label?: string;
  name?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  touched?: Record<string, boolean>;
  errors?: Record<string, string>;
  isManager?: boolean;
  selectedValues?: any;
}

const CheckBoxv2 = ({
  className = "",
  inputClassName = "",
  label = "Create",
  selectedValues,
  options = [],
  name = "",
  checked,
  defaultChecked,
  disabled = false,
  onChange,
  touched,
  errors,
  isManager = false,
}: CheckBoxProps) => {
  const [internalChecked, setInternalChecked] = useState(
    defaultChecked || false
  );
  const isControlled = typeof checked !== "undefined";
  const isChecked = isControlled ? checked : internalChecked;
  const hasError = touched?.[name] && errors?.[name];

  const handleToggle = () => {
    if (disabled) return;
    const newValue = !isChecked;
    if (!isControlled) setInternalChecked(newValue);
    onChange?.(newValue);
  };

  const showFloatingLabel = true; // Always show label

  return (
    <div className={`relative w-full overflow-x-auto bg-white border ${className}`}>
      {/* Floating Label */}
      <label
        htmlFor={name}
        className={`absolute left-10 whitespace-nowrap text-xs transition-all duration-200 z-10  px-1
          
          ${isManager
            ? isChecked
              ? "top-3 text-white" // Manager and checked
              : "bg-primary-primaryPurple text-white top-3" // Manager but not checked
            : isChecked
              ? "top-3 text-primary" // Not manager, but checked
              : "top-3 text-dark-400" // Default state
          }
          pointer-events-none`}
      >
        {label}
      </label>

      {/* Input-style box with checkbox */}
      <div
        className={`flex items-center gap-2 ${isManager
          ? "rounded-[20px] bg-primary-primaryPurple"
          : "rounded-lg bg-white"
          } py-2.5 h-10 px-4 cursor-pointer 
          ${hasError
            ? "border-error"
            : "border-dark-300 hover:border-dark-500 focus-within:border-primary"
          }
          transition-all duration-200 ${disabled ? "opacity-60 cursor-not-allowed" : ""
          } ${inputClassName}`}
        onClick={handleToggle}
      >
        {/* Checkbox Icon */}
        <div
          className={`w-[16px] h-[16px] border flex items-center justify-center rounded-sm
            transition-all duration-200 
            ${isChecked
              ? "bg-primary border-primary"
              : "border-dark-400 bg-white"
            }`}
        >
          {isChecked && (
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
      </div>

      {/* Error Message */}
      {hasError && (
        <p className="text-error text-xs mt-1 animate-fade-in">
          {errors?.[name]}
        </p>
      )}
    </div>
  );
};

export default CheckBoxv2;
