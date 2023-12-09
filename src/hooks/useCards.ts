import { Ticket } from "../context/EditContext";
import { useEditContext } from "../context/useEditContext";

export const useCards = () => {
  const editContext = useEditContext();

  return {
    cards: editContext.state.cards,
    setCards: (cards: Ticket[]) => editContext.setState({ cards }),
  };
};
