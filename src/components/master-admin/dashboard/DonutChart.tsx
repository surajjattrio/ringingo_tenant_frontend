import dynamic from "next/dynamic";

// PROJECT IMPORT
import { Select } from "@/components/forms";
import { Chip, Icon, Loader } from "@/components/ui-components";
import {DashSelect} from "@/components/forms";

// TYPES IMPORT
import { OptionTypes } from "@/types/formTypes";
import { formatTime } from "@/helperFunctions";

// THIRD - PARTY IMPORT
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

// TYPES
interface DonutChartProps {
  loading: boolean;
  title: string;
  name: string;
  data: any;
  options: OptionTypes[];
  selected: string;
  onChange: (key: string, val: string) => void;
  onRefresh: (key: string) => void;
}

const DonutChart = (props: DonutChartProps) => {
  const { loading, title, name, data, options, selected, onRefresh, onChange } =
    props;

  const selectedOptions: any = options?.find(
    (val: any) => val?.value === selected
  );

  const prepareData: any = () => {
    const finalData = data[selectedOptions?.key] || [];
    const series = finalData?.length
      ? finalData?.map((val: any) =>
          selectedOptions?.key && val[selectedOptions?.countKey]
            ? val[selectedOptions?.countKey]
            : 0
        )
      : [];

    const donutOptions = {
      chart: {
        width: "100%",
        type: "donut",
      },
      dataLabels: {
        enabled: false,
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              show: false,
            },
          },
        },
      ],
      legend: {
        position: "right",
        offsetY: 0,
        height: 230,
        formatter: function (val: any, opts: any) {
          return finalData?.[opts.seriesIndex]?.tenant_name?.length
            ? finalData?.[opts.seriesIndex]?.tenant_name
            : finalData?.[opts.seriesIndex]?.username?.length
            ? finalData?.[opts.seriesIndex]?.username[0]
            : "";
        },
      },
      tooltip: {
        enabled: true,
        custom: ({ seriesIndex, w }: any) => {
          const color = w?.globals?.colors[seriesIndex];
          const tenant = finalData?.[seriesIndex]?.tenant_name?.length
            ? finalData?.[seriesIndex]?.tenant_name
            : finalData?.[seriesIndex]?.username?.length
            ? finalData?.[seriesIndex]?.username[0]
            : "";
          const count = finalData[seriesIndex]?.[selectedOptions?.countKey]
            ? finalData[seriesIndex]?.[selectedOptions?.countKey]
            : 0;
          return `<div class="donut-tooltip"><span class="donut-tooltip-box" style="background-color:${color};"></span><div class="donut-tooltip-content"><span class="donut-tooltip-head">${tenant}</span><span class="donut-tooltip-text"> ${
            selectedOptions?.label
          }: ${
            selected === "top10-tenant-usage" ||
            selected === "recent10-tenant-usage" ||
            selected === "top10-user-usage" ||
            selected === "recent10-user-usage" ||
            selected === "top10-user-usage" ||
            selected === "recent10-user-usage"
              ? formatTime(count, true)
              : count
          }<span><div></div>`;
        },
      },
    };
    return { options: donutOptions, series };
  };
  return (
    <>
      <div className="bg-blue-50 h-full rounded-md donut">
        <div className="mx-3 py-2  flex justify-between items-center">
          <span className="text-heading text-xm font-bold  bg-white w-[60%] p-2 ml-1 pl-5 rounded-[25px]">
            {title}
          </span>
          <div className="flex gap-2">
            <DashSelect
              className="w-[25vh]"
              name={name}
              isShowLabel={false}
              options={options}
              value={selected}
              onChange={(e: any) => {
                onChange(name, e.target.value);
              }}
            />

            <Icon
              className="cursor-pointer"
              tooltip="Refresh"
              name="Refresh2"
              width={15}
              height={15}
              alt="Refresh"
              onClick={() => {
                onRefresh(selected);
              }}
            />
          </div>
        </div>
        <div className="py-5 items-center w-full h-full">
          {loading ? (
            <Loader height={200} />
          ) : selectedOptions?.key && data[selectedOptions?.key]?.length ? (
            <ReactApexChart {...prepareData()} type="donut" height={200} />
          ) : (
            <div className="w-full h-[200px] flex items-center justify-center">
              {/* <Chip title="Record Not Found" /> */}
              <Icon name="NoRecordFound"  height={60} width={160} alt="Logo" />

            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DonutChart;
