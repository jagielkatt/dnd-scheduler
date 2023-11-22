import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "../../../icons/Icon";
import { EditModal } from "../editModal/EditModal";

import styles from "./CardContent.module.scss";
import { Fieldset } from "../fieldset/Fieldset";
import { useCards, useIsEditMode } from "../../../../context/EditContext";

const levelColors = ["#003057", "#fde24f", "#ff5470", "lightgreen", "hotpink"];

export const CardContent: React.FunctionComponent<{
  textValue?: string;
  setText?: (text: string) => void;
  ticketId: number;
}> = ({ textValue, setText, ticketId }) => {
  const { cards, setCards } = useCards();
  const [edit, setEdit] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const { isEditMode } = useIsEditMode();

  useEffect(() => {
    if (!edit) {
      return;
    }
    firstInputRef.current?.focus();
  }, [edit]);

  return (
    <div className={styles["card-content"]}>
      <span>{textValue}</span>
      <button
        onClick={() => {
          if (!isEditMode) {
            return;
          }
          setEdit(!edit);
        }}
        className={styles["card-content__button"]}
      >
        {isEditMode && <Icon.Tick />}
      </button>
      {edit &&
        createPortal(
          <EditModal setEdit={setEdit}>
            <Fieldset
              label="Name"
              value={cards[ticketId].text || ""}
              setValue={(text) => {
                const temp = JSON.parse(JSON.stringify(cards));
                temp[ticketId].text = text;
                setCards(temp);
              }}
              ref={firstInputRef}
            />
            <div className={styles["card-content__colors"]}>
              {levelColors.map((color) => (
                <button
                  onClick={(event) => {
                    const temp = JSON.parse(JSON.stringify(cards));
                    temp[ticketId].color = color;
                    setCards(temp);
                    event.stopPropagation();
                    event.preventDefault();
                  }}
                  className={styles["card-content__color-button"]}
                  style={{ background: color }}
                />
              ))}
            </div>
          </EditModal>,
          document.body
        )}
    </div>
  );
};
