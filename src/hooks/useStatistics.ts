import { EditContextStateNew, SheetConfig } from "../context/EditContext";
import { levelColors } from "../utils/Colors";

type LevelColorKeys = (typeof levelColors)[number];

const colorCountObject: Record<LevelColorKeys, number> = {
  "#003057": 0,
  "#fde24f": 0,
  "#ff5470": 0,
  "#6b8e23": 0,
  orange: 0,
  "#9cf3ec": 0,
  lightgreen: 0,
  hotpink: 0,
  "#FFF": 0,
};

export const useStatistics = () => {
  const sheetsConfig = JSON.parse(
    localStorage.getItem("sheetsConfig")!
  ) as SheetConfig | null;

  const sheetIds = sheetsConfig?.sheets.map(({ sheetId }) => sheetId) || [];

  const sheetStatistics: Record<string, Record<LevelColorKeys, number>> = {};
  sheetStatistics["summary"] = { ...colorCountObject };
  sheetIds.forEach((sheetId) => {
    const sheet = JSON.parse(
      localStorage.getItem(sheetId)!
    ) as EditContextStateNew;
    sheetStatistics[sheetId] = { ...colorCountObject };

    sheet.shiftSpots.forEach((shiftSpot) => {
      if (!shiftSpot.ticket?.color) {
        return;
      }
      sheetStatistics[sheetId][shiftSpot.ticket?.color]++;
      sheetStatistics["summary"][shiftSpot.ticket?.color]++;
    });
  });

  return sheetStatistics;
};
