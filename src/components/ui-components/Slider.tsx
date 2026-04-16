"use client"
import React from "react";
import Icon from "./Icon";

// TYPES
interface SlideProps {
    className?:string;
    value?:any;
    onChange?:any;
    vertical?:boolean;
}

const Slider = (props:SlideProps) => {
    const {className = '',value,onChange,vertical = false} = props
    return (
        <>
            <div className={`${className} ${vertical ? '-rotate-90' : ''} flex items-center bg-white 3xl:py-2 py-1 border-2 border-dark-700 drop-shadow-sm rounded-lg w-[90px] absolute`}>
                <Icon name="VolumeUp" alt="Volume Up" className="rotate-90 3xl:w-[20px] 3xl:h-[20px] w-[18px] h-[18px]" />
                <input
                    className="bg-dark-800 3xl:w-full w-[70%] h-1 focus:outline-none outline-none accent-primary hover:accent-primary"
                    type="range"
                    min="1"
                    max="100"
                    step="1"
                    value={value}
                    onMouseUp={onChange}
                    onChange={onChange}
                />
                    <Icon name="VolumeDown" alt="VolumeDown" className="rotate-90 3xl:w-[20px] 3px:h-[20px] w-[18px] h-[18px]" />
            </div>
        </>
    );
};

export default Slider;
