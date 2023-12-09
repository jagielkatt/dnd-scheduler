import { forwardRef } from "react";
import styles from "./Fieldset.module.scss";

export const Fieldset = forwardRef<
  HTMLInputElement,
  {
    label: string;
    value: string;
    setValue: (text: string) => void;
    defaultValue?: string;
    placeholder?: string;
  }
>(({ label, value, setValue, placeholder }, ref) => {
  return (
    <fieldset className={styles.fieldset}>
      <label htmlFor={label}>{label}</label>
      <input
        id={label}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => setValue(event.target.value)}
        ref={ref}
      />
    </fieldset>
  );
});
