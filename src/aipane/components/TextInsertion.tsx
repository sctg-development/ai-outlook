/**
 * @file TextInsertion.tsx
 * @description The main application component.
 * @author Ronan LE MEILLAT
 * @copyright 2024 Ronan LE MEILLAT for SCTG Development
 * @license AGPLv3
 */

import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { Button, Field, Textarea, tokens, makeStyles, Skeleton, SkeletonItem } from "@fluentui/react-components";
import { AIAnswer } from "../AIPrompt";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import { getSelectedText, isOutlookClient } from "../aipane";

/**
 * Props for the TextInsertion component.
 */
interface TextInsertionProps {
  /**
   * Function to insert AI-generated answer.
   * @param {string} text - The text to be processed by the AI.
   * @returns {Promise<AIAnswer>} - The AI-generated answer.
   */
  getAIAnswer: (text: string) => Promise<AIAnswer>;

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
  skeleton: {
    display: "inherit",
    width: "50vw",
  },
  skeletonOff: {
    display: "none",
  },
  buttonInsert: {},
  buttonInsertOff: {
    display: "none",
  },
  skeletonItem: {
    margin: "0.5em",
  },
  markdown: {
    display: "block",
    maxWidth: "1024px",
  },
  downloadLink: {
    display: "block",
    marginTop: "0.5em",
  },
});

/**
 * TextInsertion component allows users to input text and get AI-generated answers.
 * @param {TextInsertionProps} props - The props for the component.
 * @returns {React.JSX.Element} - The rendered component.
 */
const TextInsertion: React.FC<TextInsertionProps> = (props: TextInsertionProps): React.JSX.Element => {
  const [userText, setUserText] = useState<string>(props.basePrompt || "");
  const [skeletonVisibility, setSkeletonVisibility] = useState<boolean>(false);
  const [answer, setAnswer] = useState<string>(null);
  const [isOutlook, setIsOutlook] = useState<boolean>(false);

  /**
   * Requests AI to generate an answer.
   * @param {string} querytext - The text to be processed by the AI.
   */
  const requestAI = useCallback(
    async (querytext: string) => {
      setSkeletonVisibility(true);
      const answer = await props.getAIAnswer(querytext);
      setSkeletonVisibility(false);
      if (answer.error) {
        let error =
          !(await isOutlookClient()) && answer.error.includes("Unable to insert AI answer")
            ? ""
            : `${answer.error}  \nAnswer:  \n`;
        setAnswer(`${error}${answer.response}`);
      } else {
        setAnswer(answer.response);
      }
    },
    [props]
  );

  /**
   * Handles the insertion of AI-generated text.
   */
  const handleTextInsertion = useCallback(async () => {
    await requestAI(userText);
  }, [userText, requestAI]);

  /**
   * Handles changes in the textarea input.
   * @param {React.ChangeEvent<HTMLTextAreaElement>} event - The change event.
   */
  const handleTextChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserText(event.target.value);
  }, []);

  /**
   * Handles the insertion of selected text.
   */
  const handleTextFromOutlook = async () => {
    if (await isOutlookClient()) {
      const selectedText = await getSelectedText();
      await requestAI(selectedText);
    }
  };

  const styles = useStyles();

  useEffect(() => {
    isOutlookClient().then((_isOutlook: boolean) => {
      setIsOutlook(_isOutlook);
    });
  }, []);

  return (
    <div className={styles.textPromptAndInsertion}>
      <Field className={styles.textAreaField} size="large" label="Enter your message.">
        <Textarea className={styles.textAreaBox} resize="vertical" value={userText} onChange={handleTextChange} />
      </Field>
      <Field className={styles.instructions}>Click to ask AI.</Field>
      <Button
        appearance="primary"
        size="large"
        onClick={handleTextFromOutlook}
        className={isOutlook ? styles.buttonInsert : styles.buttonInsertOff}
      >
        Use selected text
      </Button>
      <Button appearance="primary" size="large" onClick={handleTextInsertion}>
        {isOutlook ? "Insert answer" : "Ask AI"}
      </Button>
      <div>
        <Skeleton aria-label="Loading Content" className={skeletonVisibility ? styles.skeleton : styles.skeletonOff}>
          <SkeletonItem className={styles.skeletonItem} />
          <SkeletonItem className={styles.skeletonItem} />
          <SkeletonItem className={styles.skeletonItem} />
        </Skeleton>
        <Markdown className={styles.markdown} rehypePlugins={[rehypeHighlight]}>
          {answer}
        </Markdown>
        {!isOutlook && answer && answer.length ? (
          <a
            href={`data:text/plain;charset=utf-8,${encodeURIComponent(answer)}`}
            download="answer.md"
            className={styles.downloadLink}
          >
            Download Raw Answer
          </a>
        ) : null}
      </div>
    </div>
  );
};

export default TextInsertion;
