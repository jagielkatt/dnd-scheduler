import React, {
  useReducer,
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useEffect,
} from "react";

const DEFAULT_ROW_NAMES = [
  "row 1",
  "row 2",
  "row 3",
  "row 4",
  "row 5",
  "row 6",
  "row 7",
  "row 8",
];
const DEFAULT_COL_NAMES = [
  "Skift A",
  "Skift B",
  "Skift C",
  "Skift D",
  "Skift E",
];
export interface Ticket {
  id: number;
  text: string | null;
  color?: string;
}

export interface ShiftSpot {
  id: number;
  ticket?: Ticket;
}

export interface EditContextState {
  isEditMode: boolean;
  rowLabels: string[];
  columnLabels: string[];
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
    rowLabels: localStorage.getItem("row_labels")
      ? JSON.parse(localStorage.getItem("row_labels")!)
      : DEFAULT_ROW_NAMES,
    columnLabels: localStorage.getItem("col_labels")
      ? JSON.parse(localStorage.getItem("col_labels")!)
      : DEFAULT_COL_NAMES,
  });

  useEffect(() => {
    localStorage.setItem("cards", JSON.stringify(state.cards));
  }, [state.cards]);

  useEffect(() => {
    localStorage.setItem("shifts", JSON.stringify(state.shiftSpots));
  }, [state.shiftSpots]);

  useEffect(() => {
    localStorage.setItem("row_labels", JSON.stringify(state.rowLabels));
  }, [state.rowLabels]);

  useEffect(() => {
    localStorage.setItem("col_labels", JSON.stringify(state.columnLabels));
  }, [state.columnLabels]);

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
