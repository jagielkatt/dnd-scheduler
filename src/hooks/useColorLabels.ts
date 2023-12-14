import { ColorLabel } from "../context/EditContext";
import { useEditContext } from "../context/useEditContext";

export const useColorLabels = () => {
  const editContext = useEditContext();
  return {
    colorLabels: editContext.state.colorLabels,
    setColorLabels: (colorLabels: ColorLabel[]) =>
      editContext.setState({ colorLabels }),
  };
};
