import React, { useEffect } from "react";

// PROJECT IMPORTS
import { Select, CheckBox } from "@/components/forms";
import VoiceBrodcastAccordion from "./VoiceBrodcastAccordion";
import { usePromptsOptions } from "@/redux/slice/tenant-admin/promptsSlice";
import { useVoiceBroadcast } from "@/contexts/hooks/useVoiceBroadcast";
import { welcomePromptOptions, playFileTimeOptions } from "@/config/options";
import { usePathname } from "next/navigation";

// TYPES
interface AddExtensionTableProps {
  welcomePromptData: any;
  setWelcomePromptData: React.Dispatch<React.SetStateAction<any>>;
}

/* ============================== WELCOME PROMPT ============================== */

const WelcomePrompt = (props: AddExtensionTableProps) => {
  const { values, touched, errors, handleBlur, setValues, setFieldValue } =
    useVoiceBroadcast();

  const pathname = usePathname();
  let isPathname = pathname?.split("-")?.[0] === "/manager";

  const { welcomePromptData, setWelcomePromptData } = props;

  const promptsOptions = usePromptsOptions();

  useEffect(() => {
    setValues({
      ...values,
      welcome_prompt_selected_value: welcomePromptData,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [welcomePromptData]);

  const handleChangeData = (key: string, val: string, idx: number) => {
    let newData = [...welcomePromptData];
    newData[idx] = { ...newData[idx], [key]: val };
    setWelcomePromptData(newData);
  };

  return (
    <>
      <VoiceBrodcastAccordion title="User Options">
        <div className="pb-3 grid grid-cols-2 tsm:grid-cols-1">
          <div className="flex items-end gap-4 mb-4">
            <Select
              className="min-w-[200px]"
              name="welcome_prompt_uuid"
              label={
                <>
                  Welcome Prompt <span className="text-red-500">*</span>
                </>
              }
              icon="WelcomePrompt"
              placeholder="Select Welcome Prompt"
              isAdd
              createName="Create Audio Prompts"
              createPath={
                isPathname
                  ? "/manager-voice-broadcast/audio-prompts/create"
                  : "/tenant-voice-broadcast/audio-prompts/create"
              }
              options={promptsOptions}
              value={values.welcome_prompt_uuid}
              touched={touched}
              errors={errors}
              onChange={(e: any) => {
                setFieldValue("welcome_prompt_uuid", e.target.value);
              }}
              onBlur={handleBlur}
              isInfo
            />
            <Select
              name="playfile_time"
              label="Play File Time"
              placeholder="Select Play File Time"
              icon="Clock"
              options={playFileTimeOptions}
              value={values.playfile_time}
              touched={touched}
              errors={errors}
              removable
              onChange={(e: any) => {
                setFieldValue("playfile_time", e.target.value);
              }}
              onBlur={handleBlur}
              isInfo
            />
          </div>
        </div>
        <div className="border-t border-dark-700">
          <div className="relative overflow-x-auto mb-20">
            <table className="w-full text-left">
              <thead className="text-xs text-black font-bold bg-dark-800 border">
                <tr>
                  <th className="px-6 py-2.5">Digit</th>
                  <th className="px-6 py-2.5">Option</th>
                  <th className="px-6 py-2.5">Exit Prompt</th>
                  <th className="px-6 py-2.5 text-right">
                    <div className="flex justify-end">
                      <CheckBox
                        label="Skip"
                        checked={values.skip === "true"}
                        onChange={(checked: boolean) => setFieldValue("skip", checked ? "true" : "false")}
                      />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {welcomePromptData?.map((val: any, index: number) => (
                  <tr className="bg-dark-950 border" key={index}>
                    <td className="px-6 py-6 font-normal text-txt-primary text-xs whitespace-nowrap">
                      {val?.digit}
                    </td>
                    <td className="px-6 py-6 font-normal text-txt-primary text-xs whitespace-nowrap">
                      {welcomePromptOptions[val?.digit]}
                    </td>
                    <td className="px-6 py-6 font-normal text-txt-primary text-xs whitespace-nowrap">
                      {val?.digit === "0" ? (
                        <p className="text-heading font-bold">-</p>
                      ) : (
                        <div className="w-[60%]">
                          <Select
                            name=""
                            placeholder="Select Exit Prompt"
                            removable
                            value={val?.value}
                            options={promptsOptions}
                            isAdd
                            createName="Create Audio Prompts"
                            createPath={
                              isPathname
                                ? "/manager-voice-broadcast/audio-prompts/create"
                                : "/tenant-voice-broadcast/audio-prompts/create"
                            }
                            onChange={(e: any) => {
                              handleChangeData("value", e.target.value, index);
                            }}
                          />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-6 font-normal text-txt-primary text-xs whitespace-nowrap"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </VoiceBrodcastAccordion>
    </>
  );
};

export default WelcomePrompt;
