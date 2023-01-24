import React, { useEffect, useRef, useState } from "react";

import styles from "./CardContent.module.scss";

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
      {edit ? (
        <>
          <input
            ref={inputRef}
            type="text"
            id="name"
            name="name"
            placeholder="Namn"
            style={{ width: "50px", flexBasis: "80%" }}
            value={localText}
            onChange={(event) => setLocalText(event.target.value)}
          />
          <button
            onClick={() => {
              setEdit(!edit);
              setText(localText);
            }}
            className={styles["card-content-button"]}
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 24 24"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"></path>
            </svg>
          </button>
        </>
      ) : (
        <>
          <span style={{ flexBasis: "80%" }}>{textValue}</span>
          <button
            onClick={() => {
              setEdit(!edit);
            }}
            className={styles["card-content-button"]}
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 24 24"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path d="M3 21h3.75L17.81 9.94l-3.75-3.75L3 17.25V21zm2-2.92l9.06-9.06.92.92L5.92 19H5v-.92zM18.37 3.29a.996.996 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83a.996.996 0 000-1.41l-2.34-2.34z"></path>
            </svg>
          </button>
        </>
      )}
    </div>
  );
};
