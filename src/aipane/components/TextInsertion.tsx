/*
=========================================================
* © 2024 Ronan LE MEILLAT for SCTG Development
=========================================================
*/
import * as React from "react";
import { useState } from "react";
import { Button, Field, Textarea, tokens, makeStyles } from "@fluentui/react-components";
interface TextInsertionProps {
  insertText: (text: string) => void;
  basePrompt?: string;
}

const useStyles = makeStyles({
  instructions: {
    fontWeight: tokens.fontWeightSemibold,
    marginTop: "20px",
    marginBottom: "10px",
  },
  textPromptAndInsertion: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  textAreaField: {
    marginLeft: "1px",
    marginTop: "30px",
    marginBottom: "20px",
    marginRight: "1px",
  },
  textAreaBox: {
    width: "100%",
    height: "27vh",
  },
});

const TextInsertion: React.FC<TextInsertionProps> = (props: TextInsertionProps) => {
  const [text, setText] = useState<string>(props.basePrompt || "");

  const handleTextInsertion = async () => {
    await props.insertText(text);
  };

  const handleTextChange = async (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const styles = useStyles();

  return (
    <div className={styles.textPromptAndInsertion}>
      <Field className={styles.textAreaField} size="large" label="Enter your message.">
        <Textarea
          className={styles.textAreaBox}
          //size="large"
          resize="vertical"
          value={text}
          onChange={handleTextChange}
        />
      </Field>
      <Field className={styles.instructions}>Click to ask AI.</Field>
      <Button appearance="primary" disabled={false} size="large" onClick={handleTextInsertion}>
        Insert answer
      </Button>
    </div>
  );
};

export default TextInsertion;
