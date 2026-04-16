import React, { useEffect, useState } from "react";

// PROJECT IMPORTS
import { Danger } from "@/redux/services/toasterServices";
import { Button, Input } from "@/components/forms";
import { Icon } from "@/components/ui-components";

// TYPES
interface SpiParameterdTableProps {
  sipDetails: any;
  setNewSipDetails: any;
}

// Data
const initialValues = {
  name: "",
  value: "",
};
/* ============================== SET PARAMETERS TABLE ============================== */

const SpiParametersTable = (props: SpiParameterdTableProps) => {
  const { sipDetails, setNewSipDetails } = props;
  const [data, setData] = useState<any>([]);
  const [values, setValues] = useState(initialValues);
  const [addNewValues, setAddNewValues] = useState(initialValues);

  useEffect(() => {
    prepareData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sipDetails]);

  useEffect(() => {
    setNewSipDetails(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // Preparing Data for SIP Parameter Table
  const prepareData = () => {
    let newData: any = [];
    for (const i in sipDetails) {
      newData.push({ name: i, value: sipDetails[i], isEdit: false });
    }
    setData(newData);
  };

  // Add New Row to SIP Parameter Table
  const onAddParameter = () => {
    if (addNewValues.name === "") {
      Danger("Please enter name");
    } else if (addNewValues.value === "") {
      Danger("Please enter value");
    } else {
      const addData = {
        name: addNewValues.name,
        value: addNewValues.value,
        isEdit: false,
      };
      setData([...data, { ...addData }]);
      setAddNewValues(initialValues);
    }
  };

  // Update Click
  const onEditParameter = (row: any, index: number) => {
    setValues({
      ...values,
      name: row?.name || "",
      value: row?.value.toString() || "",
    });
    const newData = data.map((val: any) => {
      return {
        ...val,
        isEdit: val?.name === row?.name ? true : false,
      };
    });

    setData(newData);
  };

  // Update SIP Parameter Table Row
  const onUpdateParameter = (row: any, index: number) => {
    if (values.name === "") {
      Danger("Please enter name");
    } else if (values.value === "") {
      Danger("Please enter value");
    } else {
      const array = [...data];
      array[index] = {
        ...array[index],
        isEdit: false,
        name: values?.name || "",
        value: values?.value || "",
      };
      setData(array);
      setValues(initialValues);
    }
  };

  // Delete SIP Parameter Table Row
  const onDeleteParameter = (row: any, index: number) => {
    const array = [...data];
    array.splice(index, 1);
    setData(array);
  };

  // Trigger When - Input Value Change
  const handelChange = (key: string, val: any) => {
    setValues({
      ...values,
      [key]: val,
    });
  };

  // Trigger When - Add New Rows Input Value Change
  const addNewhandelChange = (key: string, val: any) => {
    setAddNewValues({
      ...addNewValues,
      [key]: val,
    });
  };

  return (
    <>
      <div className="pt-7 pb-4">
        <span className="text-base font-bold">Set Parameters</span>
      </div>
      <div className="relative overflow-x-auto rounded-t-md mb-20">
        <table className="w-full text-left">
          <thead className="text-xs text-white font-bold bg-secondary border border-secondary rounded-md">
            <tr>
              <th className="px-6 py-2.5">No.</th>
              <th className="px-6 py-2.5">Name</th>
              <th className="px-6 py-2.5">Value</th>
              <th className="px-6 py-2.5">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((val: any, index: number) => (
              <React.Fragment key={index}>
                {val?.isEdit ? (
                  <tr className="bg-dark-950 border">
                    <td className="px-6 py-2.5 font-normal text-txt-primary text-xs whitespace-nowrap">
                      {index + 1}
                    </td>
                    <td className="px-6 py-2.5 font-normal text-txt-primary text-xs whitespace-nowrap">
                      <Input
                        isShowLabel={false}
                        placeholder="Enter Name"
                        name="name"
                        value={values.name}
                        onChange={(e: any) =>
                          handelChange("name", e.target.value)
                        }
                      />
                    </td>
                    <td className="px-6 py-2.5 font-normal text-txt-primary text-xs whitespace-nowrap">
                      <Input
                        isShowLabel={false}
                        placeholder="Enter Value"
                        name="value"
                        value={values.value}
                        onChange={(e: any) =>
                          handelChange("value", e.target.value)
                        }
                      />
                    </td>
                    <td className="px-6 py-2.5 font-normal text-txt-primary text-xs whitespace-nowrap">
                      <Button
                        className="px-10 py-2 cursor-pointer"
                        text="Update"
                        style="primary-outline"
                        onClick={() => {
                          onUpdateParameter(val, index);
                        }}
                      />
                    </td>
                  </tr>
                ) : (
                  <tr className="bg-dark-950 border">
                    <td className="px-6 py-3 font-normal text-txt-primary text-xs whitespace-nowrap">
                      {index + 1}
                    </td>
                    <td className="px-6 py-3 font-normal text-txt-primary text-xs whitespace-nowrap">
                      {val.name}
                    </td>
                    <td className="px-6 py-3 font-normal text-txt-primary text-xs whitespace-nowrap">
                      {val.value.toString()}
                    </td>
                    <td className="px-6 py-3 font-normal text-txt-primary text-xs whitespace-nowrap">
                      <div className="flex gap-2">
                        <Icon
                          className="cursor-pointer"
                          tooltip="Edit"
                          name="Edit"
                          width={20}
                          height={20}
                          alt="Edit"
                          onClick={() => {
                            onEditParameter(val, index);
                          }}
                        />
                        <Icon
                          className="cursor-pointer"
                          tooltip="Delete"
                          name="DeleteRed"
                          width={20}
                          height={20}
                          alt="Delete"
                          onClick={() => {
                            onDeleteParameter(val, index);
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            <tr className="bg-dark-950 border">
              <td className="px-6 py-2.5 font-normal text-txt-primary text-xs whitespace-nowrap">
                {data?.length + 1}
              </td>
              <td className="px-6 py-2.5 font-normal text-txt-primary text-xs whitespace-nowrap">
                <Input
                  isShowLabel={false}
                  placeholder="Enter Name"
                  name="name"
                  value={addNewValues.name}
                  onChange={(e: any) =>
                    addNewhandelChange("name", e.target.value)
                  }
                />
              </td>
              <td className="px-6 py-2.5 font-normal text-txt-primary text-xs whitespace-nowrap">
                <Input
                  isShowLabel={false}
                  placeholder="Enter Value"
                  name="value"
                  value={addNewValues.value}
                  onChange={(e: any) =>
                    addNewhandelChange("value", e.target.value)
                  }
                />
              </td>
              <td className="px-6 py-2.5 font-normal text-txt-primary text-xs whitespace-nowrap">
                <Button
                  tooltip="Add more"
                  icon="Plus"
                  className="px-3 py-2 cursor-pointer"
                  text="Add More"
                  style="primary-outline"
                  onClick={() => onAddParameter()}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default SpiParametersTable;
