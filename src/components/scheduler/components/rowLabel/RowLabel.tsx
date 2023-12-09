import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "../../../icons/Icon";
import { Fieldset } from "../fieldset/Fieldset";
import { EditModal } from "../editModal/EditModal";
import { useRowLabels } from "../../../../hooks/useRowLabels";
import { useEditMode } from "../../../../hooks/useEditMode";

import styles from "./RowLabel.module.scss";

export const RowLabel = ({ rowId }: { rowId: number }) => {
  const [edit, setEdit] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const { isEditMode } = useEditMode();
  const { rowLabels, setRowLabels } = useRowLabels();

  useEffect(() => {
    if (!edit) return;

    firstInputRef.current?.focus();
  }, [edit]);

  const currentRowLabel = rowLabels[rowId];

  return (
    <>
      <div
        className={styles["row-label"]}
        onClick={() => {
          if (!isEditMode) return;

          setEdit(true);
        }}
      >
        <h3 className={styles["row-label__header"]}>{currentRowLabel.label}</h3>
        {isEditMode && <Icon.Edit />}
      </div>
      {edit &&
        createPortal(
          <EditModal setEdit={setEdit}>
            <Fieldset
              label="Label"
              value={currentRowLabel.label}
              setValue={(text) => {
                const temp = JSON.parse(JSON.stringify(rowLabels));
                temp[rowId].label = text;
                setRowLabels(temp);
              }}
              ref={firstInputRef}
            />
          </EditModal>,
          document.body
        )}
    </>
  );
};
