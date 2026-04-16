import { useEffect, useState } from "react";
import Legacy from "next/legacy/image";

interface BreakTimerModalProps {
  agent: any;
  onBackToWork: (agent_uuid: string, remainingTime: any) => any;
  setOpenBreakModal: (status: boolean) => void;
}

const BreakTimerModal = ({ agent, onBackToWork, setOpenBreakModal }: BreakTimerModalProps) => {
  const [remainingTime, setRemainingTime] = useState<number>(0);

  useEffect(() => {
    if (!agent?.break_duration) return;

    // Parse "HH:MM" into total seconds
    const [hours, minutes] = agent.break_duration.split(":").map(Number);
    const totalSeconds = (hours * 60 + minutes) * 60;

    // Check if there's a saved countdown start
    const savedData = localStorage.getItem("break_timer");
    let initialTime = totalSeconds;

    if (savedData) {
      const { savedAt, lastRemaining } = JSON.parse(savedData);
      const elapsed = Math.floor((Date.now() - savedAt) / 1000);
      initialTime = Math.max(0, lastRemaining - elapsed);
    }

    setRemainingTime(initialTime);

    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        const updated = Math.max(0, prev - 1);
        localStorage.setItem(
          "break_timer",
          JSON.stringify({ savedAt: Date.now(), lastRemaining: updated })
        );
        if (updated === 0) clearInterval(interval);
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [agent]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleBackClick = () => {
    onBackToWork(agent.agent_uuid, remainingTime);
    setOpenBreakModal(false);
  };
  console.log("break remainingTime", remainingTime)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80 max-h-[80vh] overflow-y-auto relative text-center">
        <h2 className="text-sm font-semibold bg-gray-100 py-2 px-4 rounded-t mb-4">
          You are in break : {agent.break_name || "Break"}
        </h2>
        <button
          className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl"
          onClick={() => setOpenBreakModal(false)}
        >
          &times;
        </button>

        {/* <div className="flex justify-center mb-4">
          <Legacy src={"/assets/icons/gray/break-time.svg"} alt="break" layout="fill" />
        </div> */}

        <div className="text-green-600 text-2xl font-bold mb-4">
          {formatTime(remainingTime)}
        </div>

        <button
          className="bg-indigo-600 text-white px-6 py-2 rounded-full font-semibold text-sm hover:bg-indigo-700"
          onClick={handleBackClick}
        >
          Back To Work
        </button>
      </div>
    </div>
  );
};

export default BreakTimerModal;
