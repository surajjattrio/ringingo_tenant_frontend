"use client";
import { useLayoutEffect, useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

import { Draggable, Droppable } from "react-beautiful-dnd";

import { Icon, Loader } from "@/components/ui-components";
import { SearchBar } from "@/components/pickers";
import { CheckBox } from "@/components/forms";

// TYPES
interface ExtensionDndProps {
    isLoading?: boolean;
    searchExtension?: any;
    setSearchExtension?: any;
    extensions?: any;
    checkedExtensions?: any;
    setCheckedExtensions?: any;
    setAssignedExtensions?: any;
    assignedExtensions?: any;
}


const ExtensionDnd = (props: ExtensionDndProps) => {

    const {
        isLoading,
        searchExtension,
        setSearchExtension,
        extensions,
        checkedExtensions,
        setCheckedExtensions,
        setAssignedExtensions,
        assignedExtensions,
    } = props;

    return(
        <>
        <div className="flex justify-between pt-6 pb-16">
            <div className="max-w-[768px] w-full mr-10">
                <div>
                    <div className="py-3 px-10 bg-heading-yellow rounded-t-md">
                        <p className="text-sm font-bold text-heading">
                        Extensions
                        </p>
                    </div>
                    {isLoading ? (
                        <div className="bg-dark-950 py-6 h-[200px]">
                            <Loader background="transperent" />
                        </div>
                    ) : (
                        <div className="bg-dark-950 py-6 rounded-b-md min-h-[200px]">
                            <div className="grid grid-cols-2 px-6">
                            <SearchBar
                                className="w-full py-2.5"
                                placeholder="Search Extension"
                                value={searchExtension}
                                onChange={(e: any) => setSearchExtension(e.target.value)}
                            />
                            </div>
                            <Droppable droppableId="extensions">
                                {(provided) => (
                                    <div
                                        className="grid grid-cols-2 pt-6"
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                    >
                                        {extensions
                                            ?.filter((val: any) =>
                                                searchExtension
                                                    ? !val?.selected &&
                                                    val?.device_name
                                                        ?.includes(searchExtension)
                                                    : !val?.selected
                                            )
                                            ?.map((item: any, index: number, array: any[]) => (
                                                <Draggable
                                                    key={item.uuid}
                                                    draggableId={item.uuid}
                                                    index={index}
                                                >
                                                    {(provide: any, snapshot: any) => (
                                                        <div
                                                            className={`${index % 2 === 0
                                                                    ? "pl-6 pr-3"
                                                                    : "pl-3 pr-6"
                                                                }`}
                                                            ref={provide.innerRef}
                                                            snapshot={snapshot}
                                                            {...provide.draggableProps}
                                                            {...provide.dragHandleProps}
                                                        >

                                                            {item?.badge > 1 &&
                                                                checkedExtensions.includes(item.uuid) ? (
                                                                <div className="w-72 relative">
                                                                    {checkedExtensions?.map(
                                                                        (_: any, idx: number, array: any) => (
                                                                            <div
                                                                                key={idx}
                                                                                style={{
                                                                                    transform: `rotate(-${(array?.length - (idx + 1)) *
                                                                                        2
                                                                                        }deg)`,
                                                                                }}
                                                                                className={`w-full absolute transition-transform bg-primary-v10 border rounded-md border-primary p-4 flex justify-between`}
                                                                            >
                                                                                <div className="flex">
                                                                                    <CheckBox defaultChecked />
                                                                                    <p className="text-xs ml-2">
                                                                                        {item.device_name}
                                                                                    </p>
                                                                                </div>
                                                                                {idx === array?.length - 1 && (
                                                                                    <div className="relative bottom-2 left-1 h-4 w-4 bg-primary rounded-full flex justify-center">
                                                                                        <p className="text-white text-[11px]">
                                                                                            {item.badge}
                                                                                        </p>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        )
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    {item.view && (
                                                                        <div
                                                                            className={`${(index === 0 || index === 1) &&
                                                                                "border-y-2 rounded-t-md"
                                                                                } ${(array?.length - 1 === index ||
                                                                                    array?.length - 2 === index) &&
                                                                                "rounded-b-md"
                                                                                } bg-white border-x-2 border-b-2 border-dark-700 px-4 py-2.5 flex items-center justify-between`}
                                                                        >
                                                                            <div className="flex items-center">
                                                                                <Icon
                                                                                    className="mr-2"
                                                                                    name="MoreGray"
                                                                                    alt="moreIcon"
                                                                                    width={24}
                                                                                    height={24}
                                                                                />
                                                                                <p className="text-xs items-center">
                                                                                    {item.device_name}
                                                                                </p>
                                                                            </div>
                                                                            <CheckBox
                                                                                checked={checkedExtensions?.includes(
                                                                                    item?.uuid
                                                                                )}
                                                                                onChange={(checked: boolean) => {
                                                                                    if (checked) {
                                                                                        setCheckedExtensions([
                                                                                            ...checkedExtensions,
                                                                                            item?.uuid,
                                                                                        ]);
                                                                                    } else {
                                                                                        const ids = [...checkedExtensions];
                                                                                        const idx =
                                                                                            checkedExtensions?.indexOf(
                                                                                                item?.uuid
                                                                                            );
                                                                                        if (idx > -1) {
                                                                                            ids?.splice(idx, 1);
                                                                                        }
                                                                                        setCheckedExtensions(ids);
                                                                                    }
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </>
                                                            )}

                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-[386px] w-full">
                <div>
                    <div className="py-3 px-10 bg-secondary-v10 rounded-t-md">
                        <p className="text-sm font-bold text-heading">Messaging Queue Extensions</p>
                    </div>
                    {isLoading ? (
                        <div className="bg-dark-950 py-6 h-[200px]">
                            <Loader background="transperent" />
                        </div>
                    ) : (
                        <div className="rounded-b-md bg-dark-950 p-6 min-h-[200px]">
                            <div>
                                <SearchBar
                                    className="w-full py-2.5"
                                    placeholder="Search Extension"
                                    value={searchExtension}
                                    onChange={(e: any) => setSearchExtension(e.target.value)}
                                />
                                <div>
                                    <Droppable droppableId="assignedextensions">
                                        {(provided) => (
                                            <div
                                                className="pt-6"
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                            >
                                                {extensions
                                                    ?.filter((val: any) =>
                                                        searchExtension
                                                            ? val?.selected &&
                                                            val?.device_name
                                                                ?.includes(searchExtension)
                                                            : val?.selected
                                                    )
                                                    ?.map(
                                                        (item: any, index: number, array: any[]) => (
                                                            <Draggable
                                                                key={item.uuid}
                                                                draggableId={item.uuid}
                                                                index={index}
                                                            >
                                                                {(provide: any, snapshot: any) => (
                                                                    <div
                                                                        ref={provide.innerRef}
                                                                        snapshot={snapshot}
                                                                        {...provide.draggableProps}
                                                                        {...provide.dragHandleProps}
                                                                    >
                                                                        {item?.badge > 1 &&
                                                                            assignedExtensions.includes(item.uuid) ? (
                                                                            <div className="w-72 relative">
                                                                                {assignedExtensions?.map(
                                                                                    (
                                                                                        _: any,
                                                                                        idx: number,
                                                                                        array: any
                                                                                    ) => (
                                                                                        <div
                                                                                            key={idx}
                                                                                            style={{
                                                                                                transform: `rotate(-${(array?.length -
                                                                                                        (idx + 1)) *
                                                                                                    2
                                                                                                    }deg)`,
                                                                                            }}
                                                                                            className={`w-full absolute transition-transform bg-primary-v10 border rounded-md border-primary p-4 flex justify-between`}
                                                                                        >
                                                                                            <div className="flex">
                                                                                                <CheckBox
                                                                                                    defaultChecked
                                                                                                />
                                                                                                <p className="text-xs ml-2">
                                                                                                    {item.device_name}
                                                                                                </p>
                                                                                            </div>
                                                                                            {idx ===
                                                                                                array?.length - 1 && (
                                                                                                    <div className="relative bottom-2 left-1 h-4 w-4 bg-primary rounded-full flex justify-center">
                                                                                                        <p className="text-white text-[11px]">
                                                                                                            {item.badge}
                                                                                                        </p>
                                                                                                    </div>
                                                                                                )}
                                                                                        </div>
                                                                                    )
                                                                                )}
                                                                            </div>
                                                                        ) : (
                                                                            <>
                                                                                {item?.view && (
                                                                                    <div
                                                                                        className={`${index === 0 &&
                                                                                            "border-y-2 rounded-t-md"
                                                                                            } ${array?.length - 1 ===
                                                                                            index && "rounded-b-md"
                                                                                            } bg-white border-x-2 border-b-2 border-dark-700 px-4 py-2.5 flex items-center justify-between`}
                                                                                    >
                                                                                        <div className="flex items-center">
                                                                                            <Icon
                                                                                                className="mr-2"
                                                                                                name="MoreGray"
                                                                                                alt="moreIcon"
                                                                                                width={24}
                                                                                                height={24}
                                                                                            />
                                                                                            <p className="text-xs items-center">
                                                                                                {item.device_name}
                                                                                            </p>
                                                                                        </div>
                                                                                        <CheckBox
                                                                                            checked={assignedExtensions?.includes(
                                                                                                item?.uuid
                                                                                            )}
                                                                                            onChange={(
                                                                                                checked: any
                                                                                            ) => {
                                                                                                if (checked) {
                                                                                                    setAssignedExtensions([
                                                                                                        ...assignedExtensions,
                                                                                                        item?.uuid,
                                                                                                    ]);
                                                                                                } else {
                                                                                                    const ids = [
                                                                                                        ...assignedExtensions,
                                                                                                    ];
                                                                                                    const idx =
                                                                                                        assignedExtensions?.indexOf(
                                                                                                            item?.uuid
                                                                                                        );
                                                                                                    if (idx > -1) {
                                                                                                        ids?.splice(idx, 1);
                                                                                                    }
                                                                                                    setAssignedExtensions(ids);
                                                                                                }
                                                                                            }}
                                                                                        />
                                                                                    </div>
                                                                                )}
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        )
                                                    )}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
        </>
    );
}

export default ExtensionDnd;