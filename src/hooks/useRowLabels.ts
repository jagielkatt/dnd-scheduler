import { Row } from "../context/EditContext";
import { useEditContext } from "../context/useEditContext";

export const useRowLabels = () => {
  const editContext = useEditContext();
  return {
    rowLabels: editContext.state.rowLabels,
    setRowLabels: (rowLabels: Row[]) => editContext.setState({ rowLabels }),
  };
};
