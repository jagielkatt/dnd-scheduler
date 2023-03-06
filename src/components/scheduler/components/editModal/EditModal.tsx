import React, { useEffect, useRef } from "react";
import styles from "./EditModal.module.scss";

export const EditModal = ({
  setEdit,
  children,
}: {
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div
      className={styles["edit-modal"]}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === "Escape") {
          setEdit((pre) => !pre);
          event.stopPropagation();
          event.preventDefault();
        }
      }}
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
      {children}
      <button
        onClick={(event) => {
          setEdit((pre) => !pre);
          event.stopPropagation();
          event.preventDefault();
        }}
        className={styles["edit-modal-button"]}
      >
        Done
      </button>
    </div>
  );
};
