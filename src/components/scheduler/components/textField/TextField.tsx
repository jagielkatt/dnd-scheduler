import React from "react";
import styles from "./Textfield.module.scss";

export const TextField = ({
  value,
  setTextFieldset,
  label,
  className,
}: {
  value: string;
  setTextFieldset: React.Dispatch<React.SetStateAction<string>>;
  label?: string;
  className?: string;
}) => {
  return (
    <div className={className}>
      {label ? <label htmlFor={label}>{label}</label> : null}
      <textarea
        name="textfield"
        id={label}
        className={styles.textfield}
        cols={30}
        rows={5}
        onChange={(event) => {
          setTextFieldset(event.target.value);
        }}
        value={value}
      />
    </div>
  );
};
