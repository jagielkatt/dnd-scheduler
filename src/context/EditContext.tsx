import {
  useReducer,
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useEffect,
} from "react";
import { levelColors } from "../utils/Colors";

const DEFAULT_COL_NAMES = [
  "Skift A",
  "Skift B",
  "Skift C",
  "Skift D",
  "Skift E",
];

export type Colors = (typeof levelColors)[number];

export interface Ticket {
  id: number;
  text: string | null;
  color?: Colors;
  comment: string | null;
}

export interface ShiftSpot {
  id: number;
  ticket?: Ticket;
}

export interface Row {
  label: string;
  color?: string;
}

export interface ColorLabel {
  label: string;
  color: Colors;
}

export interface EditContextState {
  isEditMode: boolean;
  rowLabels: Row[];
  columnLabels: string[];
  cards: Ticket[];
  shiftSpots: ShiftSpot[];
  colorLabels: ColorLabel[];
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

export const NBR_OF_ENTRIES = 75;
export const NBR_OF_SHIFTS = 5;

export const EditContextProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const [state, setState] = useReducer(stateReducer, {
    isEditMode: true,
    cards: localStorage.getItem("cards")
      ? JSON.parse(localStorage.getItem("cards")!)
      : [...Array(NBR_OF_ENTRIES)].map((e, i) => ({
          id: i,
          text: "",
          color: "#FFF",
          comment: "",
        })),
    shiftSpots: localStorage.getItem("shifts")
      ? JSON.parse(localStorage.getItem("shifts")!)
      : [...Array(NBR_OF_ENTRIES)].map((e, id) => ({
          id,
        })),
    rowLabels: localStorage.getItem("row_labels")
      ? JSON.parse(localStorage.getItem("row_labels")!)
      : [...Array(NBR_OF_ENTRIES / NBR_OF_SHIFTS)].map((_, index) => ({
          label: `Rad ${index + 1}`,
        })),
    columnLabels: localStorage.getItem("col_labels")
      ? JSON.parse(localStorage.getItem("col_labels")!)
      : DEFAULT_COL_NAMES,
    colorLabels: localStorage.getItem("color_labels")
      ? JSON.parse(localStorage.getItem("color_labels")!)
      : levelColors.map((color) => ({
          label: "Färgbeskrivning",
          color,
        })),
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

  useEffect(() => {
    localStorage.setItem("color_labels", JSON.stringify(state.colorLabels));
  }, [state.colorLabels]);

  return (
    <EditContext.Provider value={{ state, setState }}>
      {children}
    </EditContext.Provider>
  );
};
