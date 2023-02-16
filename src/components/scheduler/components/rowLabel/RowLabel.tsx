import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "../../../icons/Icon";
import { Fieldset } from "../fieldset/Fieldset";
import { EditModal } from "../editModal/EditModal";
import { useIsEditMode } from "../../../../context/EditContext";

import styles from "./RowLabel.module.scss";

export const RowLabel = ({
  text,
  setLabel,
}: {
  text: string;
  setLabel: (text: string) => void;
}) => {
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
    <>
      <div
        className={styles["row-label"]}
        onClick={() => {
          if (!isEditMode) {
            return;
          }
          setEdit(true);
        }}
      >
        <h3 className={styles["row-label__header"]}>{text}</h3>
        {isEditMode && <Icon.Tick />}
      </div>
      {edit &&
        createPortal(
          <EditModal setEdit={setEdit}>
            <Fieldset
              label="Label"
              value={text}
              setValue={setLabel}
              ref={firstInputRef}
            />
          </EditModal>,
          document.body
        )}
    </>
  );
};
