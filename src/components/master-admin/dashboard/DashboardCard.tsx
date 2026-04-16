// PROJECT IMPORT
import { Button } from "@/components/forms";
import { Icon } from "@/components/ui-components";
import { IconKey } from "@/components/ui-components/Icon";
import { useRouter } from "next/navigation";

// TYPES
interface DashboardCardProps {
  className?: string;
  name: string;
  icon: IconKey;
  text: string;
  count: string;
  status?: string;
  smaller?: boolean;
  buttonText?: string;
  navigate?: string;
  onRefresh?: () => void;
}

const DashboardCard = (props: DashboardCardProps) => {
  const {
    className,
    name,
    icon,
    text,
    count,
    status,
    smaller,
    buttonText,
    navigate,
    onRefresh,
  } = props;

  const router = useRouter();

  const success = status === "up";
  return (
    <>
        {/* <div className="grid grid-cols-2 gap-2"> */}
        <div
  key={name}
  className={`${className} ${
    success ? "bg-blue-50 text-black" : "text-heading bg-blue-50"
  } flex mt-3 w-full p-3 rounded-[40px] items-center overflow-hidden`}
>
  {/* Icon */}
  <div className="flex-shrink-0">
    <Icon
      name={icon}
      alt={icon}
      width={smaller ? 32 : 48} // adjust width based on smaller prop
      height={smaller ? 32 : 48} // adjust height based on smaller prop
      className="min-w-[32px] min-h-[32px] max-w-[48px] max-h-[48px]"
    />
  </div>

  {/* Content Section */}
  <div className="flex flex-1 flex-col ml-3 justify-between overflow-hidden">
    {/* Text */}
    <span
      className={`font-normal ${smaller ? "text-[10px]" : "text-sm"} text-black`}
    >
      {text}
    </span>

    <div className="flex flex-wrap items-center justify-between w-full mt-1">
      {/* Count */}
      <div className="font-bold flex-shrink-0 mr-2">
        <span
          className={`${
            smaller
              ? "text-base"
              : "text-[26px] tmd:text-[24px] tsm:text-[22px]"
          }`}
        >
          {count || 0}
        </span>
      </div>

      {/* Refresh & Button */}
      {onRefresh && (
        <div className="flex items-center gap-2 flex-shrink-0">
          <Icon
            className="cursor-pointer"
            name="Refresh2"
            // tooltip="Refresh"
            width={14}
            height={14}
            alt="Refresh"
            onClick={onRefresh} 
          />

          {buttonText && (
            <Button
              className="cursor-pointer text-blue-900 text-[10px] font-medium px-2 py-1"
              text={buttonText}
              style="none"
              onClick={() => navigate && router.push(navigate)}
            />
          )}
        </div>
      )}
    </div>
  </div>
</div>


    </>
  );
};

export default DashboardCard;
