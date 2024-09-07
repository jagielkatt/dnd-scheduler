import React, { useEffect } from "react";
import styles from "./EditModal.module.scss";

interface Props {
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
  onDone?: () => void;
}

export const EditModal = ({ setEdit, children, onDone }: Props) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setEdit((pre) => !pre);
        event.stopPropagation();
        event.preventDefault();
      } else if (event.key === "Enter") {
        setEdit((pre) => !pre);
        onDone?.();
        event.stopPropagation();
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onDone, setEdit]);

  return (
    <div
      className={styles["edit-modal"]}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseUp={(e) => e.stopPropagation()}
    >
      {children}
      <button
        onClick={(e) => {
          setEdit((pre) => !pre);
          onDone?.();
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
