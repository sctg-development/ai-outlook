/**
 * @file TextInsertion.tsx
 * @description The main application component.
 * @author Ronan LE MEILLAT
 * @copyright 2024 Ronan LE MEILLAT for SCTG Development
 * @license AGPLv3
 */

import * as React from "react";
import { useRef, useState } from "react";
import { Button, Field, Text, Textarea, tokens, makeStyles } from "@fluentui/react-components";
import { AIAnswer } from "../AIPrompt";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";

/**
 * Props for the TextInsertion component.
 */
interface TextInsertionProps {
  /**
   * Function to insert AI-generated answer.
   * @param {string} text - The text to be processed by the AI.
   * @returns {Promise<AIAnswer>} - The AI-generated answer.
   */
  insertAIAnswer: (text: string) => Promise<AIAnswer>;

  /**
   * Optional base prompt text.
   */
  basePrompt?: string;
}

/**
 * Styles for the TextInsertion component.
 */
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
    gap: "2px",
    margin: "10px",
  },
  textAreaField: {
    width: "100%",
  },
  textAreaBox: {
    height: "27vh",
  },
  text: {
    width: "100%",
    whiteSpace: "pre-wrap",
    overflowWrap: "break-word",
  },
});

/**
 * TextInsertion component allows users to input text and get AI-generated answers.
 * @param {TextInsertionProps} props - The props for the component.
 * @returns {React.JSX.Element} - The rendered component.
 */
const TextInsertion: React.FC<TextInsertionProps> = (props: TextInsertionProps): React.JSX.Element => {
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState<string>(props.basePrompt || "");
  const [answer, setAnswer] = useState<string>(null);

  /**
   * Handles the insertion of AI-generated text.
   */
  const handleTextInsertion = async () => {
    const answer = await props.insertAIAnswer(text);
    if (answer.error && textRef.current) {
      //textRef.current.innerHTML = `Error: ${answer.error}<br/>Answer: ${answer.response}`;
      setAnswer(`${answer.error}  \nAnswer:  \n${answer.response.replace(/<br\/>/g, "\n").replace(/<br>/g, "\n")}`);
    }
  };

  /**
   * Handles changes in the textarea input.
   * @param {React.ChangeEvent<HTMLTextAreaElement>} event - The change event.
   */
  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const styles = useStyles();

  return (
    <div className={styles.textPromptAndInsertion}>
      <Field className={styles.textAreaField} size="large" label="Enter your message.">
        <Textarea className={styles.textAreaBox} resize="vertical" value={text} onChange={handleTextChange} />
      </Field>
      <Field className={styles.instructions}>Click to ask AI.</Field>
      <Button appearance="primary" size="large" onClick={handleTextInsertion}>
        Insert answer
      </Button>
      <Markdown rehypePlugins={[rehypeHighlight]}>{answer}</Markdown>
      <Text ref={textRef} size={200} className={styles.text}>
        &nbsp;
      </Text>
    </div>
  );
};

export default TextInsertion;
