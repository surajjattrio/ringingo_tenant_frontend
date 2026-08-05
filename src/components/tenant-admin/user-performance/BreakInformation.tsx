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

    if (!breakDetails) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
            onClick={() => setBreakDetails(null)}
        >
            <div
                className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden relative"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="py-2 bg-secondary 3xl:px-4 px-3 rounded-t-lg sticky top-0 z-[5] flex-shrink-0">
                    <div className="flex items-center flex-row-reverse justify-between">
                        <Icon
                            className="cursor-pointer"
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

                <div className="flex-1 overflow-y-auto p-4">
                    {breakEntries && breakEntries.length
                        ? breakEntries.map(([name, time]: any, index: number) => {
                            return (
                                <div className="pb-4" key={index}>
                                    <div className="grid grid-cols-5 gap-x-1">
                                        <div className="col-span-2">
                                            <span className="3xl:text-xs text-[11px] text-heading font-semibold">
                                                Break Name:
                                            </span>
                                        </div>
                                        <div className="col-span-3">
                                            <span className="3xl:text-xs text-[11px] text-txt-primary">
                                                {name || "-"}
                                            </span>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="3xl:text-xs text-[11px] text-heading font-semibold">
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
                        : <div className="flex h-[150px] justify-center items-center"><Chip title="No Break Record Found" /></div>}
                </div>
            </div>
        </div>
    );
};

export default BreakInformation;
