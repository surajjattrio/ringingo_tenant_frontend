import { useContext } from "react";

// PROJECT IMPORT
import BlendedContext from "../BlendedContext";

export const useBlended = () => {
  const context = useContext(BlendedContext);
  if (!context) throw new Error("context must be use inside blended provider");
  return context;
};


