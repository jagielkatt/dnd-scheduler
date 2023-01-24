import React, { useState } from "react";

export const TextField = ({
  setTextFieldset,
}: {
  setTextFieldset: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [text, setText] = useState("");
  return (
    <textarea
      name="textfield"
      id="textfield"
      cols={30}
      rows={5}
      onChange={(event) => {
        setText(event.target.value);
        setTextFieldset(event.target.value);
      }}
    >
      {text}
    </textarea>
  );
};
