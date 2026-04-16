import Icon, { IconKey } from "@/components/ui-components/Icon";

interface RealtimeCardProps {
    icon: IconKey;
    title: string;
    count: any;
}

const RealtimeCard = (props: RealtimeCardProps) => {
    const { icon, title, count } = props;
    return (
        <div className="bg-blue-50 flex rounded-md sm:px-1.5 sm:py-1.5 px-3 py-3 drop-shadow-md flex-col min-h-[80px]">
            <div className="flex items-start gap-3 w-full">
                
                    <Icon name={icon} width={30} height={30} className="text-white" />
               
                <div className="flex flex-col w-full">
                    <span className="text-txt-primary text-xs font-medium mb-2">{title}</span>
                    {typeof count !== "object" ? (
                        <span className="text-heading text-lg font-bold">
                            {count}
                        </span>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <span className="text-txt-primary text-xs mb-1">Inbound</span>
                                <span className="text-heading text-lg font-bold">
                                    {count?.inboundCount || 0}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-txt-primary text-xs mb-1">Outbound</span>
                                <span className="text-heading text-lg font-bold">
                                    {count?.outboundCount || 0}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RealtimeCard;
