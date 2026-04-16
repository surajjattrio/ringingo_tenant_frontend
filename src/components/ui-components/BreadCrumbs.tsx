import { capitalizeFirst } from "@/helperFunctions";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

// TYPES
interface BreadCrumbsProps {
    className?: string;
}
const BreadCrumbs = (props: BreadCrumbsProps) => {
    const { className = "" } = props;
    const pathname = usePathname();
    const urls = pathname?.split("/")?.splice(1);
    const { id } = useParams();

    const getLink = (index: number, array: any) => {
        let finalString = "";
        array.forEach((val: any, idx: number) => {
            if (index >= idx) {
                finalString += `/${val}`;
            }
        });
        return finalString;
    };
    return (
        <>
            <div className={`${className} flex items-center`}>
                {urls?.length &&
                    urls?.map((val: any, index: number, array: any) => {
                        if (
                            ((pathname?.includes("/other-features/") ||
                                pathname?.includes("/assign/") ||
                                pathname?.includes("/forwarding/")) &&
                                index > 1) ||
                            pathname?.includes("dashboard")
                        ) {
                            return;
                        }
                        return (
                            <>
                                <div className="flex items-center justify-center">
                                    {index !== 0 && (
                                        <span className="text-[10px] px-1 flex items-center justify-center">
                                            {">"}
                                        </span>
                                    )}
                                    <Link
                                        href={getLink(index, array)}
                                        className={`${index === 0
                                                ? "text-[11px] font-normal"
                                                : "text-[10px] font-normal text-txt-primary"
                                            } flex items-center justify-center`}
                                    >
                                        {`${capitalizeFirst(
                                            id === val ? "Edit" : val,
                                            pathname?.startsWith("/tenant-")
                                        )}`}
                                    </Link>
                                </div>
                            </>
                        );
                    })}
            </div>
        </>
    );
};

export default BreadCrumbs;
