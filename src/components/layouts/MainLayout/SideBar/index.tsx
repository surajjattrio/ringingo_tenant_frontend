// "use client";
// import { Fragment, memo,useEffect, useState } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";


// // PROJECT IMPORTS
// import { useSideBarData } from "@/redux/slice/commonSlice";
// import SearchBar from "@/components/pickers/SearchBar";
// import LogoSection from "./logoSection";
// import {
//   openDrawer,
//   useDrawerOpen,
//   // useDueFollowUp,
//   // useUpcomingFollowUp,
// } from "@/redux/slice/commonSlice";
// import { Icon } from "@/components/ui-components";
// import { IconKey } from "@/components/ui-components/Icon";
// import { useAppDispatch } from "@/redux/hooks";


// // TYPES
// interface NavigateProps {
//   children: React.ReactNode;
//   val: any;
//   isOpen: boolean;
//   isSelected: boolean;
//   onClick: () => void;
//   onHover: any;
// }

// interface SideBarProps {
//   isDrawerOpen: boolean;
//   toggleDrawer: any;
// }

// interface ShowMenuProps {
//   onHover: any;
//   firstPath: string;
//   subItems: any;
//   isOpen: boolean;
//   pathname: string;
//   iconActive: IconKey;
//   icon: IconKey;
//   title: string;
//   id: string;
//   url?: string;
//   expandedId: string | null;
//   setExpandedId: (id: string | null) => void;
// }

// const Navigate = (props: NavigateProps) => {
//   const { children, val, isOpen, isSelected, onClick, onHover } = props;
//   const dispatch = useAppDispatch();

//   useEffect(() => {
//     if (window.innerWidth < 821) {
//       dispatch(openDrawer(false));
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [window]);

//   const commonClass = `w-full rounded-lg flex px-4 py-2.5 mt-2 items-center rounded-[46vh]  transition-all duration-200 ease-in-out 
//     ${!isOpen ? "justify-center" : "justify-between" } 
//     ${isSelected ? "bg-blue-50" : ""} hover:bg-blue-50 `;

//   if (val?.subItems) {
//     return (
//       <div onMouseEnter={onHover} className={commonClass}  onClick={() => {
//         if (window.innerWidth < 821) {
//           dispatch(openDrawer(false));
//         }
//       }}>
//       {/* <div onMouseEnter={onHover} className={commonClass} onClick={onClick}> */}

//         {children}
//       </div>
//     );
//   } else if (val?.url) {
//     return (
//       <Link
//         onMouseEnter={onHover}
//         href={val?.url || "#"}
//         className={commonClass}
//         onClick={onClick}
//       >
//         {children}
        
//       </Link>
//     );
//   }

//   return null;
// };

// const ShowMenu = ({
//   onHover,
//   firstPath,
//   subItems,
//   isOpen,
//   pathname,
//   icon,
//   title,
//   id,
//   url,
//   expandedId,
//   setExpandedId,
// }: ShowMenuProps) => {
//   const isExpanded = expandedId === id;
//   const parentSelected = pathname.split("/")[1] === id;
//   const activeChild = subItems?.some((item: any) => pathname === item.url);
//   const subIsSelected = pathname === url;
//   const handleClick = () => {
//     if (subItems?.length) {
//       setExpandedId(isExpanded ? null : id);
//     }
//   };

//   const highlightParent =
//     (!subItems?.length && subIsSelected) || (parentSelected && !activeChild);

//   return (
//     <>
//       <Navigate
//         val={{ subItems, id, url }}
//         isSelected={highlightParent}
//         isOpen={isOpen}
//         onHover={onHover}
//         onClick={handleClick}
//       >
//         <div className="flex items-center justify-center transition-all gap-2">
//           <Icon
//             className={`transition-all ${
//               highlightParent ? "text-blue-600" : "text-zinc-300"
//             }`}
//             name={icon || "ManagerIcon"}
//             alt={title}
//             width={22}
//             height={22}
//           />
//           {isOpen && (
//             <p
//               className={`text-[0.84rem] font-[Inter] rounded-[30px]  ${
//                 highlightParent ? "text-blue-900" : "text-gray-500  "   //sidebar selected text color
//               }`}
//             >
//               {title}
//             </p>
//           )}
//         </div>
//         {(isOpen || parentSelected) && subItems?.length > 0 && (
//           <Icon
//             name={isExpanded ? "ArrowDownGreen" : "ArrowRight"}
//             width={20}
//             height={20}
//             alt="Arrow"
//             className="text-blue-50 transition-transform duration-200"
//           />
//         )}
//       </Navigate>

//       {/* Submenu */}
//       {subItems?.length > 0 && (
//         <div
//           className={`overflow-hidden transition-all duration-300 ease-in-out ${
//             isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
//           }`}
//         >
//           {subItems.map((item: any, idx: number) => {
//             const isSubSelected = pathname === item.url;
//             return (
//               item.url && (
//                 <Link
//                   key={idx}
//                   href={item.url}
//                   className={`flex items-center gap-2 px-8 py-2 text-xs transition-all rounded-md group
//                     ${
//                       isSubSelected
//                         // ? "bg-blue-50 text-blue-900 font-semibold"
//                         ? "bg-blue-50 text-blue-900 " //submenu selcted color
                        
//                         : "text-gray-600 hover:bg-blue-50"
//                     }
//                   `}
//                   onMouseEnter={onHover}
//                 >
//                   <Icon
//                     name={item.icon || "Manager"}
//                     width={14}
//                     height={14}
//                     className={`${
//                       isSubSelected
//                         ? "text-white"
//                         : "text-blue-400 group-hover:text-white"
//                     }`}
//                   />
//                   {isOpen && (
//                     <span className="truncate text-[0.84rem] rounded-[30px] font-['Inter',sans-serif]">
//                       {item.title}
//                     </span>
//                   )}
//                 </Link>
//               )
//             );
//           })}
//         </div>
//       )}
//     </>
//   );
// };

// const SideBar = ({ isDrawerOpen, toggleDrawer }: SideBarProps) => {
//   const pathname = usePathname();
//   const [_, firstPath] = pathname?.split("/");
//   const sideBarData = useSideBarData();

//   const [hover, setHover] = useState<boolean>(false);
//   const [expandedId, setExpandedId] = useState<string | null>(null);
//   const [data, setData] = useState<any>(sideBarData?.sideBarData || []);
//   const isOpen = isDrawerOpen || hover;

//   return (
//     <div
//       className={`rounded-r-[40px] fixed h-full bg-sidebar-background text-black z-40 transition-all duration-300 shadow-lg  rounded-[30px] font-['Inter',sans-serif] ${
//         isOpen ? "w-[240px]" : "w-[78px] tsm:hidden"
//       }`}
//       onMouseLeave={() => setHover(false)}
//     >
//       <LogoSection
//         hover={hover}
//         isDrawerOpen={isDrawerOpen}
//         toggleDrawer={toggleDrawer}
//       />

//       {/* Sticky Search */}
//       <div
//         className={`sticky top-0 z-50 py-4 bg-sidebar-background ${
//           isOpen ? "px-4" : "px-3"
//         }`}
//       >
//         {isOpen ? (
//           <SearchBar
//             className="h-[40px] w-full px-3 bg-white text-black rounded-md"
//             placeholder="Search menu"
//             onChange={(e: any) => {
//               const value = e.target.value;
//               const array = data?.filter((val: any) =>
//                 val.id.toLowerCase().includes(value.toLowerCase())
//               );
//               setData(value ? array : sideBarData?.sideBarData);
//             }}
//           />
//         ) : (
//           <div
//             className="border-2 flex items-center justify-center h-[40px] border-zinc-400 rounded-md"
//             onMouseEnter={() => setHover(true)}
//           >
//             <Icon
//               tooltip="Search"
//               alt="SearchIcon"
//               name="SearchGray"
//               width={20}
//               height={20}
//               onClick={() => toggleDrawer()}
//             />
//           </div>
//         )}
//       </div>

//       {/* Menu List */}
//       <div className="scrollbar-hide overflow-y-auto h-[calc(100%-110px)] pb-6 px-1">
//         {data.map((val: any, index: number) => (
//           <Fragment key={index}>
//             <ShowMenu
//               {...val}
//               isOpen={isOpen}
//               pathname={pathname}
//               firstPath={firstPath}
//               onHover={() => setHover(true)}
//               expandedId={expandedId}
//               setExpandedId={setExpandedId}
//             />
//           </Fragment>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default memo(SideBar);




"use client";
import { memo } from "react";

import { Fragment, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// PROJECT IMPORTS
import { useSideBarData } from "@/redux/slice/commonSlice";
import SearchBar from "@/components/pickers/SearchBar";
import LogoSection from "./logoSection";
import { Icon } from "@/components/ui-components";
import { IconKey } from "@/components/ui-components/Icon";

// TYPES
interface SideBarProps {
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
}

interface ShowMenuProps {
  onHover: () => void;
  firstPath: string;
  subItems?: any[];
  isOpen: boolean;
  pathname: string;
  icon: IconKey;
  title: string;
  id: string;
  url?: string;
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
}

const Navigate = ({
  children,
  val,
  isOpen,
  isSelected,
  onClick,
  onHover,
}: {
  children: React.ReactNode;
  val: any;
  isOpen: boolean;
  isSelected: boolean;
  onClick: () => void;
  onHover: () => void;
}) => {
  const commonClass = `w-full rounded-[30px] flex px-4 py-2.5 mt-2 items-center transition-all duration-200 ease-in-out
    ${!isOpen ? "justify-center" : "justify-between"} 
    ${isSelected ? "bg-[#F4F7FE] shadow-sm" : "hover:bg-[#F4F7FE] hover:shadow-sm"}`;

  if (val?.subItems) {
    return (
      <div onMouseEnter={onHover} className={commonClass} onClick={onClick}>
        {children}
      </div>
    );
  } else if (val?.url) {
    return (
      <Link
        onMouseEnter={onHover}
        href={val?.url || "#"}
        className={commonClass}
        onClick={onClick}
      >
        {children}
      </Link>
    );
  }

  return null;
};

const ShowMenu = ({
  onHover,
  firstPath,
  subItems,
  isOpen,
  pathname,
  icon,
  title,
  id,
  url,
  expandedId,
  setExpandedId,
}: ShowMenuProps) => {
  const isExpanded = expandedId === id;
  const parentSelected = pathname.split("/")[1] === id;
  const activeChild = subItems?.some((item) => pathname === item.url);
  const subIsSelected = pathname === url;

  const handleClick = () => {
if (subItems && subItems.length > 0) {
      setExpandedId(isExpanded ? null : id);
    }
  };

  const highlightParent =
    (!subItems?.length && subIsSelected) || (parentSelected && !activeChild);

  return (
    <>
      <Navigate
        val={{ subItems, id, url }}
        isSelected={highlightParent}
        isOpen={isOpen}
        onHover={onHover}
        onClick={handleClick}
      >
        <div className="flex items-center gap-3 w-full">
          <Icon
            className={`transition-all ${
              highlightParent ? "text-blue-600" : "text-zinc-300"
            }`}
            name={icon}
            alt={title}
            width={22}
            height={22}
          />
          {isOpen && (
            <span
              className={`flex-1 text-sm font-medium ${
                highlightParent ? "text-blue-900" : "text-gray-500"
              }`}
            >
              {title}
            </span>
          )}
          {isOpen && subItems && subItems.length > 0 && (
  <Icon
    name="ArrowDown"
    width={16}
    height={16}
    className={`transition-transform duration-200 ${
      isExpanded ? "rotate-180" : "rotate-0"
    }`}
  />
)}

        </div>
      </Navigate>

      {/* Submenu items */}
      {isExpanded && isOpen && (
        <div className="ml-10 mt-2 space-y-1">
          {subItems?.map((item, idx) => {
  const isSubSelected = pathname === item.url;
  return (
    <Link
      key={idx}
      href={item.url}
      className={`flex items-center gap-2 text-sm px-2 py-1 rounded-md ${
        isSubSelected
          ? "text-blue-600 font-semibold bg-blue-50"
          : "text-gray-600 hover:text-blue-700"
      }`}
    >
      {item.icon && (
        <Icon
          name={item.icon} // assuming subitem has an `icon` key
          width={18}
          height={18}
          className={`${
            isSubSelected ? "text-blue-600" : "text-zinc-300"
          }`}
        />
      )}
      {item.title}
    </Link>
  );
})}

        </div>
      )}
    </>
  );
};
const SideBar = ({ isDrawerOpen, toggleDrawer }: SideBarProps) => {
  const pathname = usePathname();
  const [_, firstPath] = pathname?.split("/");
  const sideBarData = useSideBarData();

  const [hover, setHover] = useState<boolean>(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [data, setData] = useState<any>(sideBarData?.sideBarData || []);
  const isOpen = isDrawerOpen || hover;

  return (
    <div
      className={`border-r rounded-r-[10px] fixed h-full bg-sidebar-background text-black z-50 transition-all duration-300 drop-shadow-lg font-lexend  bg-[#FFFFFF] border-[#E5E7EB] 
        ${
        isOpen ? "w-[240px]" : "w-[70px] tsm:hidden"
      }`}
      onMouseLeave={() => setHover(false)}
    >
      <LogoSection
        hover={hover}
        isDrawerOpen={isDrawerOpen}
        toggleDrawer={toggleDrawer}
      />

      {/* Sticky Search */}
      <div
        className={`sticky top-0 z-50 py-4 bg-sidebar-background mt-2 ${
          isOpen ? "px-4" : "px-2"
        }`}
      >
        {isOpen ? (
          <SearchBar
            className="h-[40px] w-full px-3 bg-white text-black rounded-md"
            placeholder="Search menu"
            onChange={(e: any) => {
              const value = e.target.value;
              const array = data?.filter((val: any) =>
                val.id.toLowerCase().includes(value.toLowerCase())
              );
              setData(value ? array : sideBarData?.sideBarData);
            }}
          />
        ) : (
          <div
            className="border-2 border-transparent flex items-center justify-center h-[40px] w-[55px] hover:bg-[#E2E8F0] h-full active:bg-[#CBD5E1] rounded-md"
            onMouseEnter={() => setHover(false)}
            style={{marginLeft:'-3px'}}
          >
            <Icon
              tooltip="Search"
              alt="SearchIcon"
              name="SearchGray"
              width={20}
              height={20}
              onClick={() => toggleDrawer()}
            />
          </div>
        )}
      </div>

      {/* Menu List */}
      <div className="scrollbar-hide overflow-y-auto h-[calc(100%-110px)] pb-6 px-1">
        {data.map((val: any, index: number) => (
          <Fragment key={index}>
            <ShowMenu
              {...val}
              isOpen={isOpen}
              pathname={pathname}
              firstPath={firstPath}
              onHover={() => setHover(false)}
              expandedId={expandedId}
              setExpandedId={setExpandedId}
            />
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default memo(SideBar);