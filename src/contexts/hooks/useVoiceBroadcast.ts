import { useContext } from "react";

// PROJECT IMPORT
import VoiceBroadcastContext from "../VoiceBroadcastContext";

export const useVoiceBroadcast = () => {
  const context = useContext(VoiceBroadcastContext);
  if (!context) throw new Error("context must be use inside outbound provider");
  return context;
};
