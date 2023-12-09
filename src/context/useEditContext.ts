import { useContext } from "react";
import { EditContext } from "./EditContext";

export function useEditContext() {
  const context = useContext(EditContext);

  if (context === undefined) {
    throw new Error("useEditContext must be used within a EditContextProvider");
  }

  return context;
}
