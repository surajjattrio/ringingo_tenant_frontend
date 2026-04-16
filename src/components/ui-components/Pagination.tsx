"use client";
import React from "react";
import { useRouter } from "next/navigation";

//THIRD-PARTY IMPORT
import ReactPaginate from "react-paginate";
import { Button } from "../forms";
import Icon from "./Icon";
import { Danger } from "@/redux/services/toasterServices";

// PAGE OPTIONS
const options = [
  { value: "10", label: 10 },
  { value: "20", label: 20 },
  { value: "30", label: 30 },
  { value: "40", label: 40 },
  { value: "50", label: 50 },
  { value: "100", label: 100 },
];

// TYPES
interface PaginationProps {
  title?: string;
  navigate?: string;
  className?: string;
  page?: number;
  length?: number;
  totalCount?: number;
  limit?: number;
  isAdvance?: boolean;
  onPageClick?: any;
  onLimitChange?: any;
  isDisabledCreate?: boolean;
  onRefresh?: () => void;
  managerName?: string | null;
  isShowButton?: boolean;
}

/* ============================== PAGINATION ============================== */

const Pagination = (props: PaginationProps) => {
  const {
    title,
    navigate,
    className,
    page = 1,
    length = -1,
    totalCount = 0,
    limit = 10,
    isAdvance,
    onPageClick,
    onLimitChange,
    isDisabledCreate,
    onRefresh,
    managerName,
    isShowButton,
  } = props;

  const router = useRouter();
  const newPage = Math.max(page, 1);
  const totalPage = Math.ceil(totalCount / limit);
  const start = newPage * limit - limit + 1;
  const end = isAdvance ? totalCount : Math.min(newPage * limit, totalCount);

  const handlePageClick = (event: any) => {
    onPageClick(event.selected + 1);
  };

  const disabledOptions = (val: any) =>
    !!((end == totalCount && parseInt(val?.value) > limit) || isAdvance);

console.log("DEBUG PAGINATION", {
  totalCount,
  limit,
  totalPage: Math.ceil(Number(totalCount) / Number(limit)),
  typeTotal: typeof totalCount,
  typeLimit: typeof limit
});
  return (
    <>
      <div
        className={`${className} w-full bg-white py-3 flex justify-between items-center px-6  rounded-b-lg`}
      >
        {totalCount > 0 && (
          <div className={`flex items-center gap-3 h-5`}>
            <span className="text-txt-primary font-normal text-xs">{`Showing ${start} to ${end} of ${totalCount} entries`}</span>
            <div className="border-2 border-dark-700 rounded-md">
              <select
                disabled={!!isAdvance}
                value={limit}
                onChange={(e: any) => onLimitChange(Number(e.target.value))}
                className={`block w-full focus:outline-none border-2 rounded-md border-transparent rounded-e-md text-xs font-normal border-r-8 text-txt-primary`}
              >
                {options?.map((val: any, index: number) => {
                  return (
                    <React.Fragment key={index}>
                      <option
                        disabled={disabledOptions(val)}
                        value={val?.value}
                      >
                        {val?.label}
                      </option>
                    </React.Fragment>
                  );
                })}
              </select>
            </div>
            <Icon
              tooltip="Refresh"
              alt="Refresh"
              name="Refresh2Dark"
              width={15}
              height={15}
              onClick={() => {
                onRefresh?.();
              }}
            />
          </div>
        )}
        {totalCount > 0 &&
          navigate &&
          title &&
          (managerName ? (
            isShowButton && (
              <Button
                icon="PlusWhite"
                tooltip={`Create ${title}`}
                className="!rounded-full !w-8 !h-8"
                onClick={() => {
                  router.push(navigate);
                }}
              />
            )
          ) : (
            <Button
              icon="PlusWhite"
              tooltip={`Create ${title}`}
              className="!rounded-full !w-8 !h-8"
              onClick={() => {
                isDisabledCreate
                  ? Danger(`Maximum limit is ${length}`)
                  : router.push(navigate);
              }}
            />
          ))}
        <ReactPaginate
          containerClassName={`flex gap-1 text-xs items-center`}
          pageClassName={`px-2.5 py-[2px] rounded-md text-xs text-txt-primary font-normal`}
          activeClassName="bg-primary text-white"
          breakLabel=" . . "
          breakClassName="text-txt-primary font-normal px-2.5 py-[2px]"
          nextLabel="Next"
          //forcePage={newPage > 0 ? newPage - 1 : newPage}
          nextClassName={`${
            newPage === totalPage ? "text-txt-secondary" : "text-txt-primary"
          } pl-2`}
          onPageChange={handlePageClick}
          pageRangeDisplayed={2}
          pageCount={isAdvance ? 1 : totalPage}
          previousLabel="Previous"
          previousClassName={`${
            newPage === 1 ? "text-txt-secondary" : "text-txt-primary"
          } pr-2`}
          renderOnZeroPageCount={null}
        />

      </div>
    </>
  );
};

export default Pagination;
