import { useEffect, useState } from "react";

// PROJECT IMPORTS
import {
  createNewNote,
  getNotesList,
} from "@/redux/slice/tenant-admin/leadManagementSlice";
import { Success } from "@/redux/services/toasterServices";
import { useAppDispatch } from "@/redux/hooks";
import { Textarea } from "../../forms";
import { Button } from "../../forms";
import { Chip, Icon, Loader } from "../../ui-components";

// THIRD-PARTY IMPORT
import { format, formatDistanceStrict } from "date-fns";

// TYPES
interface NoteProps {
  noteData: any;
  setNoteData: any;
  leadUuid: string;
}

/* ============================== NOTE ============================== */

const Note = (props: NoteProps) => {
  const { noteData, setNoteData, leadUuid } = props;

  const dispatch = useAppDispatch();
  const [comment, setComment] = useState<string>("");
  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (noteData) {
      getNoteData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteData]);

  // get note data
  const getNoteData = async () => {
    try {
      setIsLoading(true);
      let id: string = noteData;
      const newData: any = await dispatch(getNotesList(id)).unwrap();
      const nData = typeof newData.data === "string" ? [] : newData.data;
      const finalData = nData?.map((val: any) => {
        let day: any = formatDistanceStrict(
          new Date(),
          new Date(val?.createdAt),
          { unit: "day" }
        );
        return {
          ...val,
          day: `${
            day === "0 days"
              ? "Today"
              : day === "1 days"
              ? "Yesterday"
              : day + " ago"
          }`,
          date: format(new Date(val?.createdAt), "dd/MM/yyyy"),
          time: format(new Date(val?.createdAt), "h:mm a"),
          name: val?.user[0]?.username,
        };
      });
      setIsLoading(false);
      setData(finalData);
    } catch (error: any) {
      console.log("get note err --->", error?.message);
      setIsLoading(false);
    }
  };

  // ON SUBMIT NOTE DEATILS
  const onSubmit = async () => {
    setLoading(true);
    try {
      const payloaad = {
        comment: comment,
        lead_uuid: leadUuid ? leadUuid : "",
        cdrs_uuid: noteData ? noteData : "",
      };
      const res: any = await dispatch(createNewNote(payloaad)).unwrap();
      if (res) {
        Success(res?.data);
        setNoteData(null);
        setComment("");
        setLoading(false);
      }
    } catch (error: any) {
      console.log("create note err --->", error?.message);
      setLoading(false);
    }
  };

  if (!noteData) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={() => setNoteData(null)}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="py-2 bg-secondary 3xl:px-4 px-3 rounded-t-lg sticky top-0 z-[5] flex-shrink-0">
          <div className="flex items-center flex-row-reverse justify-between">
            <Icon
              className="cursor-pointer"
              name="CloseWhite"
              height={16}
              width={16}
              onClick={() => {
                setNoteData(null);
              }}
            />
            <span className="3xl:text-sm text-xs text-white font-bold">
              Notes
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="px-6 border-b-2 border-dark-800 py-4">
            <Textarea
              label="Add Note"
              name="addNote"
              rows={2}
              tooltipRight={true}
              value={comment}
              placeholder="Type something here..."
              onChange={(e: any) => {
                setComment(e.target.value);
              }}
            />
            <div className="py-3 flex">
              <Button
                disabled={loading}
                className="3xl:py-1.5 3xl:px-2 px-1.5 py-1 rounded-lg"
                text="Add Note"
                icon="PlusWhite"
                onClick={() => {
                  onSubmit();
                }}
              />
            </div>
          </div>
          <div className="py-2">
            {isLoading ? (
              <div className="h-[200px] flex items-center justify-center">
                <Loader />
              </div>
            ) : data && data.length ? (
              data?.map((val: any, index: number) => {
                return (
                  <div
                    key={index}
                    className={`px-3 border-b border-dark-800 ${
                      index === 0 ? "3xl:pb-2 pb-1" : "3xl:py-2 py-1"
                    }`}
                  >
                    <div className="grid grid-cols-3">
                      <div className="flex items-center gap-2 col-span-1">
                        <Icon name="DocumentIcon" width={18} height={18} />
                        <span className="3xl:text-sm text-xs">{val.name}</span>
                      </div>
                      <div className="flex items-center gap-2 justify-end col-span-2">
                        <span className="3xl:text-xs text-[11px] font-normal text-txt-primary">
                          {val.day}
                        </span>
                        <span className="3xl:text-xs text-[11px] font-normal text-txt-primary">
                          {val.date}
                        </span>
                        <span className="3xl:text-xs text-[11px] font-normal text-txt-primary">
                          {val.time}
                        </span>
                      </div>
                    </div>
                    <div className="3xl:pl-8 pl-7">
                      <p className="3xl:text-xs text-[11px] font-normal text-txt-primary break-words">
                        {val.comment}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="w-full h-[200px] flex justify-center items-center">
                <Chip title="No Notes Found" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Note;
