"use client";
import dynamic from "next/dynamic";

// THIRD - PARTY IMPORT
const GaugeChart = dynamic(() => import("react-gauge-chart"), {
    ssr: false,
});

// TYPES
interface UsageChartProps {
    title: string;
    data: string;
}

const UsageChart = (props: UsageChartProps) => {
    const { title, data } = props;
    const free =
        100 - parseFloat(data?.split("%")?.length ? data?.split("%")[0] : "0");
    return (
        <>
            <div className="bg-white h-full rounded-md drop-shadow-lg donut">
                <div className="mx-3 py-2 border-b-2 border-dark-700 items-center">
                    <span className="text-heading text-sm font-bold">{title}</span>
                </div>
                <div>
                    <GaugeChart
                        id="gauge-chart3"
                        nrOfLevels={3}
                        colors={["#90E4BB","#E4AE90","#E49090"]}
                        arcWidth={0.1}
                        arcsLength={[50,30,20]}
                        percent={parseFloat(data)/100}
                        textColor={"black"}
                        animate={false}
                    />
                </div>
                <div className="flex py-3 px-3 items-center justify-evenly">
                    <div className="flex flex-col gap-2 items-center justify-center">
                        <span className="text-xs font-bold text-heading">Total</span>
                        <span className="text-xs text-heading">100%</span>
                    </div>
                    <div className="flex flex-col gap-2 items-center justify-center">
                        <span className="text-xs font-bold text-heading">Used</span>
                        <span className="text-xs text-heading">{parseInt(data)?.toFixed(2)}%</span>
                    </div>
                    <div className="flex flex-col gap-2 items-center justify-center">
                        <span className="text-xs font-bold text-heading">Free</span>
                        <span className="text-xs text-heading">{free?.toFixed(2)}%</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UsageChart;
