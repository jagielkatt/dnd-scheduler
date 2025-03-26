import {
  useReducer,
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useCallback,
} from "react";
import { levelColors } from "../utils/Colors";
import {
  DEFAULT_FIRST_SHEET_NAME,
  DEFAULT_SHEET,
  SHEETS_CONFIG_KEY,
} from "./SheetConfig";

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

export interface EditContextStateNew {
  sheetId: string;
  isEditMode: boolean;
  rowLabels: Row[];
  columnLabels: string[];
  cards: Ticket[];
  shiftSpots: ShiftSpot[];
  colorLabels: ColorLabel[];
}

export interface EditContextState {
  sheets: SheetState[];
  isEditMode: boolean;
  activeSheet: number;
}

export interface SheetState {
  sheetId: string;
  rowLabels: Row[];
  columnLabels: string[];
  cards: Ticket[];
  shiftSpots: ShiftSpot[];
  colorLabels: ColorLabel[];
}

export interface EditContextProps {
  state: EditContextStateNew;
  setState: React.Dispatch<Partial<EditContextStateNew>>;
  removeSheet: (sheetId: string) => void;
}

export const EditContext = createContext<EditContextProps | undefined>(
  undefined
);

function stateReducer(
  state: EditContextStateNew,
  newState: Partial<EditContextStateNew>
) {
  return { ...state, ...newState };
}

export const EditContextProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const sheetsConfigItem = localStorage.getItem(SHEETS_CONFIG_KEY);
  const sheetsConfig = sheetsConfigItem
    ? (JSON.parse(sheetsConfigItem) as SheetConfig)
    : undefined;
  const activeSheetNewItem = sheetsConfig
    ? localStorage.getItem(sheetsConfig.activeSheet)
    : undefined;
  const activeSheetNew = activeSheetNewItem
    ? (JSON.parse(activeSheetNewItem) as SheetState)
    : DEFAULT_SHEET;

  const [state, setState] = useReducer(stateReducer, {
    sheetId: sheetsConfig?.activeSheet ?? DEFAULT_FIRST_SHEET_NAME,
    isEditMode: true,
    cards: activeSheetNew.cards,
    shiftSpots: activeSheetNew.shiftSpots,
    rowLabels: activeSheetNew.rowLabels,
    columnLabels: activeSheetNew.columnLabels,
    colorLabels: activeSheetNew.colorLabels,
  });

  useEffect(() => {
    if (localStorage.getItem(SHEETS_CONFIG_KEY) === null) {
      migrateData();
      const sheet = JSON.parse(
        localStorage.getItem(DEFAULT_FIRST_SHEET_NAME) || "[]"
      ) as SheetState;
      setState(sheet);
    }
    const sheetsConfig = JSON.parse(
      localStorage.getItem(SHEETS_CONFIG_KEY) || "[]"
    ) as SheetConfig;
    const hasMigratedObject = sheetsConfig.sheets.some(
      (sheet) => typeof sheet !== "string"
    );
    if (!hasMigratedObject) {
      migrateSheets();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(state.sheetId, JSON.stringify(state));
  }, [state]);

  const removeSheet = useCallback(
    (sheetId: string) => {
      if (!sheetsConfig || sheetId === sheetsConfig?.activeSheet) {
        return;
      }
      const temp = { ...sheetsConfig };

      temp.sheets = sheetsConfig.sheets.filter(
        (sheet) => sheet.sheetId !== sheetId
      );
      localStorage.setItem(SHEETS_CONFIG_KEY, JSON.stringify(temp));
      localStorage.removeItem(sheetId);
    },
    [sheetsConfig]
  );

  return (
    <EditContext.Provider
      value={{
        state,
        setState,
        removeSheet,
      }}
    >
      {children}
    </EditContext.Provider>
  );
};

export interface SheetConfig {
  activeSheet: string;
  sheets: Array<{ sheetId: string; displayName: string }>;
}
const migrateData = () => {
  // Retrieve data from local storage
  const shifts =
    JSON.parse(localStorage.getItem("shifts")!) || DEFAULT_SHEET.shiftSpots;
  const rowLabels =
    JSON.parse(localStorage.getItem("row_labels")!) || DEFAULT_SHEET.rowLabels;
  const colLabels =
    JSON.parse(localStorage.getItem("col_labels")!) ||
    DEFAULT_SHEET.columnLabels;
  const colorLabels =
    JSON.parse(localStorage.getItem("color_labels")!) ||
    DEFAULT_SHEET.colorLabels;
  const cards =
    JSON.parse(localStorage.getItem("cards")!) || DEFAULT_SHEET.cards;

  const migrateObject: SheetState = {
    sheetId: DEFAULT_FIRST_SHEET_NAME,
    shiftSpots: shifts,
    rowLabels: rowLabels,
    columnLabels: colLabels,
    colorLabels: colorLabels,
    cards: cards,
  };

  // Store migrated data back into local storage
  localStorage.setItem(DEFAULT_FIRST_SHEET_NAME, JSON.stringify(migrateObject));
  localStorage.setItem(
    SHEETS_CONFIG_KEY,
    JSON.stringify({
      activeSheet: DEFAULT_FIRST_SHEET_NAME,
      sheets: [DEFAULT_FIRST_SHEET_NAME],
    })
  );
};

const migrateSheets = () => {
  const sheetsConfig = JSON.parse(
    localStorage.getItem("sheetsConfig")!
  ) as SheetConfig;
  const sheets = sheetsConfig.sheets.map((sheet, index) => {
    return {
      sheetId: sheet,
      displayName: `Sheet ${index + 1}`,
    };
  });
  localStorage.setItem(
    SHEETS_CONFIG_KEY,
    JSON.stringify({
      activeSheet: DEFAULT_FIRST_SHEET_NAME,
      sheets: sheets,
    })
  );
};
