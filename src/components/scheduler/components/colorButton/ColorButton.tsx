import React from "react";
import styles from "./ColorButton.module.scss";
import { Colors } from "../../../../context/EditContext";

export const ColorButton = ({
  onClick,
  color,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement> | undefined;
  color: Colors;
}) => {
  return (
    <button
      onClick={(event) => {
        onClick?.(event);
        event.stopPropagation();
        event.preventDefault();
      }}
      className={styles["color-button"]}
      style={{ background: color }}
    />
  );
};
