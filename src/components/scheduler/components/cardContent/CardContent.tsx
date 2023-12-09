import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "../../../icons/Icon";
import { EditModal } from "../editModal/EditModal";
import styles from "./CardContent.module.scss";
import { Fieldset } from "../fieldset/Fieldset";
import { TextField } from "../textField/TextField";
import { ColorButton } from "../colorButton/ColorButton";
import { useCards } from "../../../../hooks/useCards";
import { useEditMode } from "../../../../hooks/useEditMode";
import { levelColors } from "../../../../utils/Colors";

export const CardContent: React.FunctionComponent<{
  textValue?: string;
  ticketId: number;
}> = ({ textValue, ticketId }) => {
  const { cards, setCards } = useCards();
  const [edit, setEdit] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const { isEditMode } = useEditMode();

  useEffect(() => {
    if (!edit) return;

    firstInputRef.current?.focus();
  }, [edit]);

  const currentTicket = cards[ticketId];
  return (
    <div className={styles["card-content"]}>
      <span>{textValue}</span>
      <button
        onClick={() => {
          if (!isEditMode) return;

          setEdit(!edit);
        }}
        className={styles["card-content__button"]}
      >
        {isEditMode && <Icon.Edit />}
      </button>
      {edit &&
        createPortal(
          <EditModal setEdit={setEdit}>
            <div className={styles["card-content__fieldset-wrapper"]}>
              <Fieldset
                label="Name"
                value={currentTicket.text || ""}
                setValue={(text) => {
                  const temp = JSON.parse(JSON.stringify(cards));
                  temp[ticketId].text = text;
                  setCards(temp);
                }}
                ref={firstInputRef}
              />
            </div>
            <div className={styles["card-content__colors"]}>
              {levelColors.map((color) => (
                <ColorButton
                  onClick={() => {
                    const temp = JSON.parse(JSON.stringify(cards));
                    temp[ticketId].color = color;
                    setCards(temp);
                  }}
                  color={color}
                  key={color}
                />
              ))}
            </div>
            <div className={styles["card-content__fieldset-wrapper"]}>
              <TextField
                value={currentTicket.comment || ""}
                setTextFieldset={(comment) => {
                  const temp = JSON.parse(JSON.stringify(cards));
                  temp[ticketId].comment = comment;
                  setCards(temp);
                }}
                className={styles["card-content__fieldset"]}
                label={"Kommentar"}
              />
            </div>
          </EditModal>,
          document.body
        )}
    </div>
  );
};
