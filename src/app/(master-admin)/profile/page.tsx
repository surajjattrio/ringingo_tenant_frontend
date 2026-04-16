"use client";
import { useState } from "react";

// PROJECT IMPORT
import ChangePassword from "@/components/profile/ChangePassword";
import { IconKey } from "@/components/ui-components/Icon";
import { Icon } from "@/components/ui-components";

interface DataTypes {
    icon: IconKey;
    activeIcon: IconKey;
    component: any;
    title: string;
    text: string;
}
// DATA
const data: DataTypes[] = [
    {
        icon: "UserFill",
        activeIcon: "UserFillGreen",
        component: () => (
            <div className="h-full w-full flex items-center justify-center font-bold col-span-3">
                Coming Soon
            </div>
        ),
        title: "Profile Configuration",
        text: "View your profile detail ",
    },
    {
        icon: "LockFill",
        activeIcon: "LockFillGreen",
        component: ChangePassword,
        title: "Change Password",
        text: "Change your account password",
    },
];
const Profile = () => {
    const [selected, setSelected] = useState(1);
    const Component = data?.[selected]?.component;
    return (
        <>
            <div className="flex items-center bg-secondary rounded-t-md justify-start px-8 py-3">
                <span className="text-sm text-white font-bold">
                    Manage your account
                </span>
            </div>
            <div className="grid grid-cols-4 h-[calc(100vh-200px)] bg-white ">
                <div className="h-full border-r py-8">
                    {data?.map((val: any, index: number) => {
                        const isSelected = selected === index;
                        return (
                            <div
                                key={index}
                                className={`cursor-pointer flex gap-3 p-3 items-center ${isSelected
                                        ? "bg-primary-v10 border-l-[3px] border-primary"
                                        : ""
                                    }`}
                                onClick={() => {
                                    setSelected(index);
                                }}
                            >
                                <Icon
                                    name={isSelected ? val?.activeIcon : val?.icon}
                                    width={25}
                                    height={25}
                                    alt="Icon"
                                />
                                <div className={`gap-1 flex flex-col overflow-hidden`}>
                                    <span
                                        className={`font-bold text-sm ${isSelected ? "text-primary" : "text-heading"
                                            }`}
                                    >
                                        {val?.title}
                                    </span>
                                    <span
                                        className={`font-normal text-xs ${isSelected ? "text-primary" : "text-txt-primary"
                                            }`}
                                    >
                                        {val?.text}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <Component />
            </div>
        </>
    );
};

export default Profile;
