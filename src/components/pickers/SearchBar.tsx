// // PROJECT IMPORT
// import { Icon } from "../ui-components";

// // TYPES
// interface SearchBarProps {
//   className?: string;
//   ref?: any;
//   value?: string | number;
//   placeholder?: string;
//   onChange?: any;
//   iconClassName?: any;
//   iconWidth?: number;
//   iconHeight?: number;
// }

// /* ============================== SEARCH BAR ============================== */

// const SearchBar = (props: SearchBarProps) => {
//   const {
//     className,
//     ref,
//     value,
//     iconClassName,
//     iconWidth = 15,
//     iconHeight = 15,
//     placeholder,
//     onChange,
//   } = props;
//   return (
//     <div className="flex h-full items-center relative ">
//       <input
//         ref={ref}
//         className={`${className} focus:outline-none border border-dark-700 items-center bg-transparent rounded-[2px] pl-5 pr-12 text-xs placeholder:text-xs placeholder:font-normal placeholder:text-txt-secondary`}
//         type="text"
//         value={value}
//         placeholder={placeholder}
//         onChange={onChange}
//       />
//       <Icon
//         name="SearchGray"
//         className={`${iconClassName} absolute right-5 text-dark-700 cursor-pointer`}
//         width={iconWidth}
//         height={iconHeight}
//         alt="search"
//       />
//     </div>
//   );
// };

// export default SearchBar;



// PROJECT IMPORT
import { Icon } from "../ui-components";

// TYPES
interface SearchBarProps {
  className?: string;
  ref?: any;
  value?: string | number;
  placeholder?: string;
  onChange?: any;
  iconClassName?: any;
  iconWidth?: number;
  iconHeight?: number;
}

/* ============================== SEARCH BAR ============================== */

const SearchBar = (props: SearchBarProps) => {
  const {
    className,
    ref,
    value,
    iconClassName,
    iconWidth = 15,
    iconHeight = 15,
    placeholder,
    onChange,
  } = props;
  return (
    <div className="flex h-full items-center relative">
      <input
        ref={ref}
        // className={`${className} focus:outline-none border border-dark-700 items-center bg-transparent rounded-full pl-5 pr-12 text-xs placeholder:text-xs placeholder:font-normal placeholder:text-txt-secondary`}
        className={`${className} focus:outline-none  items-center border border-dark-700  bg-blue-50
 rounded-full pl-5 pr-12 text-xs placeholder:text-xs placeholder:font-normal placeholder:text-txt-secondary`}

        type="text"
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
      <Icon
        name="SearchGray"
        className={`${iconClassName} absolute right-5 text-dark-700 cursor-pointer`}
        width={iconWidth}
        height={iconHeight}
        alt="search"
      />
    </div>
  );
};

export default SearchBar;
