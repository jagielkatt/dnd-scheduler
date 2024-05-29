import { SheetState, ShiftSpot, Ticket } from "./EditContext";
import { levelColors } from "../utils/Colors";

export const DEFAULT_COL_NAMES = [
  "Skift A",
  "Skift B",
  "Skift C",
  "Skift D",
  "Skift E",
];

export const NBR_OF_ENTRIES = 75;
export const NBR_OF_SHIFTS = 5;

export const SHEETS_CONFIG_KEY = "sheetsConfig";
export const DEFAULT_FIRST_SHEET_NAME = "sheet1";

export const DEFAULT_SHEET: SheetState = {
  sheetId: DEFAULT_FIRST_SHEET_NAME,
  cards: [...Array(NBR_OF_ENTRIES)].map((e, i) => ({
    id: i,
    text: "",
    color: "#FFF",
    comment: "",
  })) as Ticket[],
  shiftSpots: [...Array(NBR_OF_ENTRIES)].map((e, id) => ({
    id,
  })) as ShiftSpot[],
  rowLabels: [...Array(NBR_OF_ENTRIES / NBR_OF_SHIFTS)].map((_, index) => ({
    label: `Rad ${index + 1}`,
  })),
  columnLabels: DEFAULT_COL_NAMES,
  colorLabels: levelColors.map((color) => ({
    label: "Färgbeskrivning",
    color,
  })),
};
