import { useContext } from "react";

// PROJECT IMPORT
import OutboundContext from "../OutboundContext";

export const useOutbound = () => {
  const context = useContext(OutboundContext);
  if (!context) throw new Error("context must be use inside outbound provider");
  return context;
};
