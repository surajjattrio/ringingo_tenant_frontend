

'use client';
import Icon from "../ui-components/Icon";
interface SwitchProps {
  trueName?: string;
  falseName?: string;
  className?: string;
  switchButtonClass?: string;
  label?: string;
  value?: string;
  onClick?: any;
  onChange?: any;
  isInfo?: boolean;
}
const Switch = ({
  trueName = 'Enable',
  falseName = 'Disable',
  className,
  switchButtonClass,
  label = 'Toggle',
  value = "0",
  onClick,
  isInfo = false
}: SwitchProps) => {
  const isChecked = value !== "1";
  return (
    <div className={`relative ${className}`}>
      {/* Floating Label */}
      {/* <label
className={`absolute text-xs transition-all duration-200 z-10 bg-white px-1
${isChecked ? 'ms-[120px] -top-2 text-primary' : 'ms-[15px] -top-2 text-primary'}
pointer-events-none`}
>
{label}

</label> */}
      <label
        className={`absolute left-4 text-xs transition-all duration-200 bg-white z-10 px-1 mt-[-10.5px] text-primary pointer-events-none`}
      >
        {label}
      </label>
      {/* Switch */}
      <label
        className={`inline-flex items-center p-[4px] text-xs rounded-md cursor-pointer bg-white 
${isChecked ? 'border border-primary' : 'border border-dark-300 hover:border-dark-500'}
transition-all duration-200 w-auto`}
      >
        <input type="checkbox" className="hidden peer" />
        <span
          className={`px-4 py-[4px] w-[100px] rounded-md transition-all duration-200
${isChecked
              ? 'bg-primary text-white font-bold'
              : 'text-txt-primary font-normal'}
`}
          onClick={() => onClick("0")}
        >
          {trueName}
        </span>
        <span
          className={`px-4 py-[5px] w-[100px] rounded-md transition-all duration-200
${!isChecked
              ? 'bg-primary text-white font-bold'
              : 'text-txt-primary font-normal'}
`}
          onClick={() => onClick("1")}
        >
          {falseName}
        </span>
        {isInfo && (
          <Icon
            tooltip={label}
            className="ml-2 cursor-pointer"
            name="InfoCircle"
            width={15}
            height={15}
            alt={label}
          />
        )}
      </label>
    </div>
  );
};
export default Switch;
