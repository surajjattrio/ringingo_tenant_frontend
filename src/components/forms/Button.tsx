// import { Icon } from "../ui-components";
// import { IconKey } from "../ui-components/Icon";

// // TYPES
// interface ButtonProps {
//   type?: "submit" | "button" | "reset" | undefined;
//   className?: string;
//   text?: string;
//   icon?: IconKey;
//   iconWidth?: number;
//   iconHeight?: number;
//   tooltip?: string;
//   style?: keyof typeof styles;
//   disabled?: boolean;
//   loading?: boolean;
//   responsive?: boolean;
//   onClick?: () => void;
//   form?: string;
// }
// export type ButtonStyles = keyof typeof styles;
// const styles = {
//   primary:
//     "bg-primary text-white border-2 border-primary shadow-lg shadow-primary-shadow",
//   "primary-outline": "bg-transparent border-2 border-primary text-heading",
//   secondary: "bg-secondary text-white border-2 border-secondary",
//   "secondary-outline": "bg-transparent border-2 border-secondary text-heading",
//   error:
//     "bg-error text-white border-2 border-error shadow-lg shadow-error-shadow",
//   "error-outline": "bg-transparent border-2 border-error text-heading",
//   dark: "bg-dark-700 text-txt-primary border-2 border-dark-700 shadow-lg shadow-dark-950",
//   "dark-outline": "bg-transparent border-2 border-dark-700 text-heading",
//   "dark-transparent":
//     "bg-transparent border-2 border-dark-700 text-txt-primary",
//   heading: "bg-heading text-white border-2 border-heading",
//   none: "",
// };

// /* ============================== BUTTON ============================== */

// const Button = (props: ButtonProps) => {
//   const {
//     type = "button",
//     className = "",
//     text,
//     icon,
//     iconWidth = 18,
//     iconHeight = 18,
//     style = "primary",
//     disabled,
//     loading = false,
//     tooltip = "",
//     responsive = false,
//     onClick,
//     form,
//   } = props;

//   return (
//     <>
//       <button
//         form={form}
//         className={`${className} hover:opacity-60 flex items-center font-bold gap-1 rounded-[2px] justify-center ${styles[style]}`}
//         type={type}
//         disabled={disabled || loading}
//         onClick={onClick}
//       >
//         {icon && (
//           <Icon
//             width={iconWidth}
//             height={iconHeight}
//             name={icon}
//             alt={icon}
//             tooltip={tooltip}
//           />
//         )}
//         {text && (
//           <span
//             className={`whitespace-nowrap overflow-hidden text-xs ${
//               responsive ? "tsm:hidden" : ""
//             }`}
//           >
//             {text}
//           </span>
//         )}
//       </button>
//     </>
//   );
// };

// export default Button;



import { Icon } from "../ui-components";
import { IconKey } from "../ui-components/Icon";

// TYPES
interface ButtonProps {
  type?: "submit" | "button" | "reset" | undefined;
  className?: string;
  text?: string;
  icon?: IconKey;
  iconWidth?: number;
  iconHeight?: number;
  tooltip?: string;
  style?: keyof typeof styles;
  disabled?: boolean;
  loading?: boolean;
  responsive?: boolean;
  onClick?: () => void;
  form?: string;
}

export type ButtonStyles = keyof typeof styles;

// ✅ Only pill-style (rounded-full) applied
const styles = {
  primary:
    "bg-primary-primaryPurple text-white border-2 border-primary-primaryPurple shadow-lg shadow-primary-shadow",
  "primary-outline": "bg-transparent border-2 border-primary text-heading",
  secondary: "bg-white text-black",
  "secondary-outline": "bg-transparent border-2 border-secondary text-heading",
  error:
    "bg-error text-white border-2 border-error shadow-lg shadow-error-shadow",
  "error-outline": "bg-transparent border-2 border-error text-heading",
  dark: "bg-dark-700 text-txt-primary border-2 border-dark-700 shadow-lg shadow-dark-950",
  "dark-outline": "bg-transparent border-2 border-dark-700 text-heading",
  // "dark-transparent":
  //   "bg-transparent border-2 border-dark-700 text-txt-primary",
  // heading: "bg-heading text-white border-2 border-heading",
  header: " text-black whitespace-nowrap",
  none: "",
  custom: ""
};

/* ============================== BUTTON ============================== */

const Button = (props: ButtonProps) => {
  const {
    type = "button",
    className = "",
    text,
    icon,
    iconWidth = 18,
    iconHeight = 18,
    style = "primary",
    disabled,
    loading = false,
    tooltip = "",
    responsive = false,
    onClick,
    form,
  } = props;

  return (
    <button
      form={form}
      className={`
        ${className} 
        flex items-center font-bold gap-1 justify-center 
        rounded-full 
        px-4 py-2 
        text-xs 
       
        ${styles[style]}
      `}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {icon && (
        <Icon
          width={iconWidth}
          height={iconHeight}
          name={icon}
          alt={icon}
          tooltip={tooltip}
        />
      )}
      {loading && (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
      )}
      {text && (
        <span className={`${responsive ? "tsm:hidden" : ""}`}>
          {text}
        </span>
      )}
    </button>
  );
};

export default Button;
