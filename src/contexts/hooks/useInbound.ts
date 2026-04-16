import { useContext } from "react";

// PROJECT IMPORT
import InboundContext from "../InboundContext";

export const useInbound = () => {
  const context = useContext(InboundContext);
  if (!context) throw new Error("context must be use inside inbound provider");
  return context;
};
