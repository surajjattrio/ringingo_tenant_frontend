// PROJECT IMPORTS
import Icon from "./Icon";

// TYPES
interface FilterProps {
  className?: string;
  onClick?: () => void;
  style?: keyof typeof styles;
  text?: string;
}

// Same styles as Button
const styles = {
  primary:
    "bg-primary text-white border-2 border-primary shadow-lg shadow-primary-shadow",
  "primary-outline": "bg-transparent border-2 border-primary text-heading",
  secondary: "bg-secondary text-white border-2 border-secondary",
  "secondary-outline": "bg-transparent border-2 border-secondary text-heading",
  error:
    "bg-error text-white border-2 border-error shadow-lg shadow-error-shadow",
  "error-outline": "bg-transparent border-2 border-error text-heading",
  none: "",
};

const Filter = (props: FilterProps) => {
  const { className = "", onClick, text = "Filters" } = props;

  return (
    <button
      className={`
        flex items-center gap-2 
        px-4 py-2 
        text-xs font-bold 
        rounded-full 
        bg-primary-primaryPurple
        text-white 
        ${className}
      `}
      onClick={onClick}
    >
      <Icon
        // tooltip="Filter" 
        name="Filter"
        width={18}
        height={18}
        alt="Filter"
        className="text-current"
      />
      <span className="tsm:hidden">{text}</span>
    </button>
  );
};

export default Filter;
