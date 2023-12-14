import { useState } from "react";
import { useCards } from "../../../../hooks/useCards";
import { useEditMode } from "../../../../hooks/useEditMode";
import { TextField } from "../textField/TextField";
import styles from "./BottomMenu.module.scss";
import { useColorLabels } from "../../../../hooks/useColorLabels";
import { ColorDescription } from "./components/colorDescription/ColorDescription";

export const BottomMenu = () => {
  const { isEditMode, toggleEditMode } = useEditMode();
  const { cards, setCards } = useCards();
  const [textFieldset, setTextFieldset] = useState("");
  const { colorLabels } = useColorLabels();

  return (
    <div className={styles["bottom-menu"]}>
      <div>
        <button
          className={`${styles.toggle} ${
            isEditMode && styles["toggle--active"]
          }`}
          type="button"
          onClick={() => toggleEditMode()}
        >
          {isEditMode ? "Stop editing" : "Start editing"}
        </button>
        <button
          className={styles.toggle}
          type="button"
          onClick={() => {
            localStorage.removeItem("cards");
            localStorage.removeItem("shifts");
            localStorage.removeItem("row_labels");
            localStorage.removeItem("col_labels");
            localStorage.removeItem("color_labels");
            window.location.reload();
          }}
        >
          Reset
        </button>
        {isEditMode && (
          <div>
            <div className={styles["bottom-menu__button-wrapper"]}>
              <TextField
                setTextFieldset={setTextFieldset}
                value={textFieldset}
                label="Menu"
              />
              <button
                onClick={() => {
                  const newCards = [...cards];
                  textFieldset.split(",").forEach((word, i) => {
                    if (typeof newCards[i] === "undefined") return;

                    newCards[i].text = word;
                  });
                  setCards(newCards);
                }}
                className={styles["bottom-menu__button"]}
              >
                Fill
              </button>
            </div>
          </div>
        )}
      </div>
      <div>
        <div className={styles["colors"]}>
          {colorLabels.map((colorLabel, id) => (
            <ColorDescription id={id} key={colorLabel.color} />
          ))}
        </div>
      </div>
    </div>
  );
};
