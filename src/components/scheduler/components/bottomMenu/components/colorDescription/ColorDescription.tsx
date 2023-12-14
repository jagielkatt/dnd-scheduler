import React, { useEffect, useRef, useState } from "react";
import { useEditMode } from "../../../../../../hooks/useEditMode";
import { createPortal } from "react-dom";
import { EditModal } from "../../../editModal/EditModal";
import { Fieldset } from "../../../fieldset/Fieldset";
import { Icon } from "../../../../../icons/Icon";

import styles from "./ColorDescription.module.scss";
import { useColorLabels } from "../../../../../../hooks/useColorLabels";

interface Props {
  id: number;
}

export const ColorDescription: React.FunctionComponent<Props> = ({ id }) => {
  const { isEditMode } = useEditMode();
  const [edit, setEdit] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const { colorLabels, setColorLabels } = useColorLabels();

  useEffect(() => {
    if (!edit) return;

    firstInputRef.current?.focus();
  }, [edit]);

  const currentColorLabel = colorLabels[id];

  return (
    <React.Fragment>
      <div className={styles["colors-description-row"]}>
        <div
          style={{ background: currentColorLabel.color }}
          className={styles["colors-description-row__square"]}
        />
        <div
          className={styles["colors-description-row__label"]}
          onClick={() => {
            if (!isEditMode) return;

            setEdit(true);
          }}
        >
          {isEditMode && <Icon.Edit />}
          <h3 className={styles["colors-description-row__label-header"]}>
            {currentColorLabel.label}
          </h3>
        </div>
      </div>
      {edit &&
        createPortal(
          <EditModal setEdit={setEdit}>
            <Fieldset
              label="Description"
              value={currentColorLabel.label}
              setValue={(text) => {
                const temp = JSON.parse(JSON.stringify(colorLabels));
                temp[id].label = text;
                setColorLabels(temp);
              }}
              ref={firstInputRef}
            />
          </EditModal>,
          document.body
        )}
    </React.Fragment>
  );
};
