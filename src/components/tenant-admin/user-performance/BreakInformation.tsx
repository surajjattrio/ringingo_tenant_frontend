import { Chip, Icon } from "@/components/ui-components";

// TYPES
interface BreakInformationProps {
    breakDetails: any;
    setBreakDetails: any;
}

const BreakInformation = (props: BreakInformationProps) => {
    const { breakDetails = null, setBreakDetails } = props;

    /* ============================== BREAK INFORMATION ============================== */

    const parsedDetails = typeof breakDetails === 'string' ? JSON.parse(breakDetails) : breakDetails;
    const breakEntries = parsedDetails ? Object.entries(parsedDetails) : [];

    return (
        <>
            <div
                className={`w-full scrollbar-hide h-[calc(100vh-178px)] overflow-y-auto drop-shadow-xl bg-white rounded-lg ${!breakDetails && "hidden"
                    }`}
            >
                <div className="py-2 bg-secondary 3xl:px-4 px-3 rounded-t-lg sticky top-0 z-[5]">
                    <div className="flex items-center flex-row-reverse justify-between">
                        <Icon
                            name="CloseWhite"
                            height={16}
                            width={16}
                            onClick={() => {
                                setBreakDetails(null);
                            }}
                        />
                        <span className="3xl:text-sm text-xs text-white font-bold">
                            Break Information
                        </span>
                    </div>
                </div>

                <div className="mt-4">
                    {breakEntries && breakEntries.length
                        ? breakEntries.map(([name, time]: any, index: number) => {
                            return (
                                <div className="px-4 pb-4" key={index}>
                                    <div className="grid grid-cols-5 gap-x-1">
                                        <div className="col-span-2">
                                            <span className="3xl:text-xs text-[11px] text-heading">
                                                Break Name:
                                            </span>
                                        </div>
                                        <div className="col-span-3">
                                            <span className="3xl:text-xs text-[11px] text-txt-primary">
                                                {name || "-"}
                                            </span>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="3xl:text-xs text-[11px] text-heading">
                                                Duration:
                                            </span>
                                        </div>
                                        <div className="col-span-3">
                                            <span className="3xl:text-xs text-[11px] text-txt-primary">
                                                {time}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                        : <div className="flex h-[calc(100vh-233px)] justify-center items-center"><Chip title="No Break Record Found" /></div>}
                </div>
            </div>
        </>
    );
};

export default BreakInformation;
