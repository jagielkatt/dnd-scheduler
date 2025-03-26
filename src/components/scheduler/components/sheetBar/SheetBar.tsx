import { useCallback, useEffect, useRef, useState } from "react";
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
import { EditModal } from "../editModal/EditModal.tsx";
import { createPortal } from "react-dom";
import { Fieldset } from "../fieldset/Fieldset.tsx";

export const SheetBar = () => {
  const [sheetConfigState, setSheetConfigState] = useState<SheetConfig>();
  const [edit, setEdit] = useState(false);
  const [isEditingSheet, setIsEditingSheet] =
    useState<SheetConfig["sheets"][number]>();
  const { setState, removeSheet } = useEditContext();
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const sheetsItem = localStorage.getItem(SHEETS_CONFIG_KEY);
    if (!sheetsItem) {
      return;
    }
    const sheetsConfig: SheetConfig = JSON.parse(sheetsItem);
    setSheetConfigState(sheetsConfig);
  }, []);

  const onDone = useCallback(() => {
    if (typeof isEditingSheet === "undefined") {
      return;
    }
    const sheetConfig: SheetConfig = JSON.parse(
      localStorage.getItem(SHEETS_CONFIG_KEY)!
    );
    const configCopy = { ...sheetConfig };
    const sheetsCopy = [...sheetConfig.sheets];
    const sheetIndex = sheetsCopy.findIndex(
      (sheet) => sheet.sheetId === isEditingSheet.sheetId
    );
    if (sheetIndex < 0) {
      return;
    }

    sheetsCopy[sheetIndex] = { ...isEditingSheet };
    const newConfigState = {
      activeSheet: configCopy.activeSheet,
      sheets: [...sheetsCopy],
    };
    setSheetConfigState(newConfigState);
    localStorage.setItem(SHEETS_CONFIG_KEY, JSON.stringify(newConfigState));
    setIsEditingSheet(undefined);
  }, [isEditingSheet]);

  return (
    <div className={styles["sheet-bar"]}>
      <button
        className={styles["sheet-add-button"]}
        onClick={() => {
          const previousState = sheetConfigState;
          if (!previousState) {
            return;
          }

          const newSheetConfig: SheetConfig["sheets"][number] = {
            sheetId: `sheet${previousState.sheets.length + 1}`,
            displayName: `Sheet ${previousState.sheets.length + 1}`,
          };
          const newConfigState = {
            activeSheet: previousState.activeSheet,
            sheets: [...previousState.sheets, newSheetConfig],
          };
          setSheetConfigState(newConfigState);
          localStorage.setItem(
            SHEETS_CONFIG_KEY,
            JSON.stringify(newConfigState)
          );
          localStorage.setItem(
            newSheetConfig.sheetId,
            JSON.stringify(generateDefaultSheet(newSheetConfig.sheetId))
          );
        }}
      >
        <svg width={16} height={16} viewBox="0 0 24 24">
          <line x1="0" x2="24" y1="12" y2="12" stroke="black" strokeWidth="3" />
          <line x1="12" x2="12" y1="0" y2="24" stroke="black" strokeWidth="3" />
        </svg>
      </button>
      {sheetConfigState?.sheets.map((sheetConfig, index) => {
        const sheetId = sheetConfig.sheetId;
        return (
          <button
            className={`${styles["sheet-button"]} ${
              sheetId === sheetConfigState.activeSheet
                ? styles["sheet-button--active"]
                : undefined
            }`}
            key={index}
            onClick={(event) => {
              const sheetsItem = localStorage.getItem(sheetId);
              if (!sheetsItem) {
                return;
              }

              if (event.shiftKey) {
                setIsEditingSheet(sheetConfig);
                setEdit(true);
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
            {sheetConfig.displayName}
          </button>
        );
      })}
      {edit &&
        createPortal(
          <EditModal setEdit={setEdit} onDone={onDone}>
            <Fieldset
              label="Sheet name"
              value={isEditingSheet?.displayName || ""}
              setValue={(text) => {
                setIsEditingSheet((pre) => {
                  if (typeof pre === "undefined") {
                    return;
                  }
                  return { sheetId: pre.sheetId, displayName: text };
                });
              }}
              ref={firstInputRef}
            />
            <button
              className={styles["sheet-edit-button"]}
              onClick={() => {
                if (typeof isEditingSheet === "undefined") {
                  return;
                }
                removeSheet(isEditingSheet?.sheetId);
                setSheetConfigState((pre) => {
                  if (typeof pre === "undefined") {
                    return;
                  }
                  const temp = { ...pre };
                  temp.sheets = pre.sheets.filter(
                    (sheet) => sheet.sheetId !== isEditingSheet?.sheetId
                  );
                  return temp;
                });
                setEdit(false);
              }}
            >
              Delete Sheet
            </button>
          </EditModal>,
          document.body
        )}
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
