import { ShiftSpot } from "../context/EditContext";
import { useEditContext } from "../context/useEditContext";

export const useShiftSpots = () => {
  const editContext = useEditContext();
  return {
    shiftSpots: editContext.state.shiftSpots,
    setShiftSpots: (shiftSpots: ShiftSpot[]) =>
      editContext.setState({ shiftSpots }),
  };
};
