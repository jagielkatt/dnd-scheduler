import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "../../../icons/Icon";

import styles from "./CardContent.module.scss";
import { Fieldset } from "./components/fieldset/Fieldset";

export const CardContent: React.FunctionComponent<{
  textValue: string;
  setText: (text: string) => void;
}> = ({ textValue, setText }) => {
  const [localText, setLocalText] = useState(textValue);
  const [edit, setEdit] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!edit) {
      return;
    }
    inputRef.current?.focus();
  }, [edit]);

  return (
    <div className={styles["card-content"]}>
      <span style={{ flexBasis: "80%" }}>{textValue}</span>
      <button
        onClick={() => {
          setEdit(!edit);
        }}
        className={styles["card-content-button"]}
      >
        <Icon.Tick />
      </button>
      {edit &&
        createPortal(
          <div
            className={styles["card-content__edit-modal"]}
            onClick={(e) => {
              e.stopPropagation();
            }}
            onMouseDown={(event) => {
              event.stopPropagation();
            }}
            onMouseUp={(event) => {
              event.stopPropagation();
            }}
          >
            <Fieldset
              label="Name"
              value={localText}
              setValue={setLocalText}
              ref={inputRef}
            />
            <button
              onClick={(event) => {
                setEdit(!edit);
                setText(localText);
                event.stopPropagation();
                event.preventDefault();
              }}
              className={styles["card-content__edit-modal-button"]}
            >
              Done
            </button>
          </div>,
          document.body
        )}
    </div>
  );
};
