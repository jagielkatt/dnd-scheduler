import React, {
  useReducer,
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useEffect,
} from "react";

export interface Ticket {
  id: number;
  text: string | null;
  color?: string;
}

interface ShiftSpot {
  id: number;
  ticket?: Ticket;
}

export interface EditContextState {
  isEditMode: boolean;
  rowLabels: string[];
  cards: Ticket[];
  shiftSpots: ShiftSpot[];
}

export interface EditContextProps {
  state: EditContextState;
  setState: (newState: Partial<EditContextState>) => void;
}

export const EditContext = createContext<EditContextProps>(
  {} as EditContextProps
);

function stateReducer(
  state: EditContextState,
  newState: Partial<EditContextState>
) {
  return { ...state, ...newState };
}

export const EditContextProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const [state, setState] = useReducer(stateReducer, {
    isEditMode: true,
    rowLabels: [
      "row 1",
      "row 2",
      "row 3",
      "row 4",
      "row 5",
      "row 6",
      "row 7",
      "row 8",
    ],
    cards: localStorage.getItem("cards")
      ? JSON.parse(localStorage.getItem("cards")!)
      : [...Array(40)].map((e, i) => ({
          id: i,
          text: "",
          color: "#FFF",
        })),
    shiftSpots: localStorage.getItem("shifts")
      ? JSON.parse(localStorage.getItem("shifts")!)
      : [...Array(40)].map((e, i) => ({
          id: i,
          ticket: undefined,
        })),
  });

  useEffect(() => {
    localStorage.setItem("cards", JSON.stringify(state.cards));
  }, [state.cards]);

  useEffect(() => {
    localStorage.setItem("shifts", JSON.stringify(state.shiftSpots));
  }, [state.shiftSpots]);

  return (
    <EditContext.Provider value={{ state, setState }}>
      {children}
    </EditContext.Provider>
  );
};

export function useEditContext() {
  const context = React.useContext(EditContext);
  if (context === undefined) {
    throw new Error("useEditContext must be used within a EditContextProvider");
  }
  return context;
}

export const useCards = () => {
  const editContext = useEditContext();
  return {
    cards: editContext.state.cards,
    setCards: (cards: Ticket[]) => editContext.setState({ cards }),
  };
};

export const useShiftSpots = () => {
  const editContext = useEditContext();
  return {
    shiftSpots: editContext.state.shiftSpots,
    setShiftSpots: (shiftSpots: ShiftSpot[]) =>
      editContext.setState({ shiftSpots }),
  };
};

export const useIsEditMode = () => {
  const editContext = useEditContext();
  return {
    isEditMode: editContext.state.isEditMode,
    toggleEditMode: () =>
      editContext.setState({
        isEditMode: !editContext.state.isEditMode,
      }),
  };
};
