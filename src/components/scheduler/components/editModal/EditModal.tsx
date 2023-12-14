import React from "react";
import styles from "./EditModal.module.scss";

export const EditModal = ({
  setEdit,
  children,
}: {
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={styles["edit-modal"]}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setEdit((pre) => !pre);
          event.stopPropagation();
          event.preventDefault();
        }
      }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseUp={(e) => e.stopPropagation()}
    >
      {children}
      <button
        onClick={(e) => {
          setEdit((pre) => !pre);
          e.stopPropagation();
          e.preventDefault();
        }}
        className={styles["edit-modal-button"]}
      >
        Done
      </button>
    </div>
  );
};
