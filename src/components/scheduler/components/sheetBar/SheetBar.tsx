import { useEffect, useState } from "react";
import styles from "./SheetBar.module.scss";
import {
  SheetConfig,
  SheetState,
  ShiftSpot,
  Ticket,
} from "../../../../context/EditContext.tsx";
import { useEditContext } from "../../../../context/useEditContext.ts";
import {
  DEFAULT_COL_NAMES,
  NBR_OF_ENTRIES,
  NBR_OF_SHIFTS,
  SHEETS_CONFIG_KEY,
} from "../../../../context/SheetConfig.ts";
import { levelColors } from "../../../../utils/Colors.ts";

export const SheetBar = () => {
  const [sheetConfigState, setSheetConfigState] = useState<SheetConfig>();
  const { setState } = useEditContext();

  useEffect(() => {
    const sheetsItem = localStorage.getItem(SHEETS_CONFIG_KEY);
    if (!sheetsItem) {
      return;
    }
    const sheetsConfig: SheetConfig = JSON.parse(sheetsItem);
    setSheetConfigState(sheetsConfig);
  }, []);

  return (
    <div className={styles["sheet-bar"]}>
      <button
        className={styles["sheet-add-button"]}
        onClick={() => {
          console.log("Add sheet button is pushed");
          const previousState = sheetConfigState;
          if (!previousState) {
            return;
          }
          const newSheetId = `sheet${previousState.sheets.length + 1}`;
          const newConfigState = {
            activeSheet: previousState.activeSheet,
            sheets: [...previousState.sheets, newSheetId],
          };
          setSheetConfigState(newConfigState);
          localStorage.setItem(
            SHEETS_CONFIG_KEY,
            JSON.stringify(newConfigState)
          );
          localStorage.setItem(
            newSheetId,
            JSON.stringify(generateDefaultSheet(newSheetId))
          );
        }}
      >
        <svg width={16} height={16} viewBox="0 0 24 24">
          <line x1="0" x2="24" y1="12" y2="12" stroke="black" strokeWidth="3" />
          <line x1="12" x2="12" y1="0" y2="24" stroke="black" strokeWidth="3" />
        </svg>
      </button>
      {sheetConfigState?.sheets.map((sheetId, index) => {
        return (
          <button
            className={`${styles["sheet-button"]} ${
              sheetId === sheetConfigState.activeSheet
                ? styles["sheet-button--active"]
                : undefined
            }`}
            key={index}
            onClick={() => {
              const sheetsItem = localStorage.getItem(sheetId);
              if (!sheetsItem) {
                return;
              }
              const sheet: SheetState = JSON.parse(sheetsItem);
              setState(sheet);

              const previousState = sheetConfigState;
              if (!previousState) {
                return;
              }
              const newConfigState = {
                activeSheet: sheetId,
                sheets: [...previousState.sheets],
              };
              setSheetConfigState(newConfigState);
              localStorage.setItem(
                SHEETS_CONFIG_KEY,
                JSON.stringify(newConfigState)
              );
            }}
          >
            Sheet {index + 1}
          </button>
        );
      })}
    </div>
  );
};

const generateDefaultSheet = (sheetId: string) => {
  return {
    sheetId,
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
};
