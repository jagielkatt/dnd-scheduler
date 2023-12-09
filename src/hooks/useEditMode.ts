import { useEditContext } from "../context/useEditContext";

export const useEditMode = () => {
  const editContext = useEditContext();
  return {
    isEditMode: editContext.state.isEditMode,
    toggleEditMode: () =>
      editContext.setState({
        isEditMode: !editContext.state.isEditMode,
      }),
  };
};
