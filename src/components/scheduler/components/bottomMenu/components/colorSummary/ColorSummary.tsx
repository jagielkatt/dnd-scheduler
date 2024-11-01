import { FunctionComponent, useState, useEffect } from "react";
import { SheetConfig } from "../../../../../../context/EditContext";
import { SHEETS_CONFIG_KEY } from "../../../../../../context/SheetConfig";
import { useStatistics } from "../../../../../../hooks/useStatistics";
import styles from "./ColorSummary.module.scss";

export const ColorSummary: FunctionComponent = () => {
  const [sheetConfigState, setSheetConfigState] = useState<SheetConfig>();
  const data = useStatistics();

  useEffect(() => {
    const sheetsItem = localStorage.getItem(SHEETS_CONFIG_KEY);
    if (!sheetsItem) {
      return;
    }
    const sheetsConfig: SheetConfig = JSON.parse(sheetsItem);
    setSheetConfigState(sheetsConfig);
  }, []);

  return (
    <div className={styles["colors-summary"]}>
      {Object.entries(data).map(([sheetId, colorCounts]) => {
        const total = Object.values(colorCounts).reduce(
          (sum, count) => sum + count,
          0
        );

        const sheetName =
          sheetId !== "summary"
            ? sheetConfigState?.sheets.find(
                (sheet) => sheet.sheetId === sheetId
              )?.displayName
            : "Summering";

        if (!sheetName) {
          return null;
        }
        return (
          <div key={sheetId} className={styles["colors-list"]}>
            <h3>{sheetName}</h3>
            <div>
              {Object.entries(colorCounts).map(([color, count]) => (
                <div key={color} className={styles.color}>
                  <div
                    className={styles["color-box"]}
                    style={{
                      backgroundColor: color,
                    }}
                  ></div>
                  <span>{count}</span>
                </div>
              ))}
            </div>
            <div className={styles.total}>Totalt: {total}</div>
          </div>
        );
      })}
    </div>
  );
};
