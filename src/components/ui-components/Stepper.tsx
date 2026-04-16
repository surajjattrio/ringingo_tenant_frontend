import { useState } from "react";

interface StepperProps {
    data: any;
    selected:number;
}
const Stepper = (props: StepperProps) => {
    const { data,selected } = props;

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <ol className="flex items-center justify-center w-full">
                {data?.map((val: any, index: number,array:any) => {
                    return (
                        <li
                            key={index}
                            className={`relative flex w-full items-center after:content-[''] after:border-b  after:border-4 ${array?.length - 1 === index ? '' : 'after:w-full' } ${selected > index ? 'after:border-primary' : 'after:border-gray-400'} after:h-1  after:inline-block`}
                        >
                            <span className={`flex items-center justify-center w-4 h-4 border ${selected >= index ? 'bg-primary border-primary' : 'bg-gray-400 border-gray-400'} rounded-full`}></span>
                        </li>
                    );
                })}
            </ol>
            <ol className="flex items-center w-full">
                {data?.map((val: any, index: number) => {
                    return (
                        <li
                            key={index}
                            className="flex w-full items-center after:content-[''] after:w-full"
                        >
                            <span className="text-xs text-txt-primary whitespace-nowrap">
                                {val?.name}
                            </span>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
};

export default Stepper;
