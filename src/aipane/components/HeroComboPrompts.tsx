/**
 * =========================================================
 * © 2024 Ronan LE MEILLAT for SCTG Development
 * =========================================================
 * @file HeroComboPrompts.tsx
 * @description The HeroComboPrompts component for the AI pane.
 * @author Ronan LE MEILLAT
 * @copyright 2024 Ronan LE MEILLAT for SCTG Development
 * @license AGPLv3
 * This component is part of the AI pane module for the Outlook add-in.
 */
import * as React from "react";
import { Dropdown, Label, makeStyles, Option, SelectionEvents, useId } from "@fluentui/react-components";
import { useState, useEffect, useCallback, useMemo } from "react";
import { getPrompts, type AIPrompt } from "../AIPrompt";
import { config } from "../config";
interface HeroComboPromptsProps {
  /**
   * Callback function to notify the parent component of the selected value.
   * @param selectedValue The selected value.
   */
  onChange: (selectedValue: string) => void;
  /**
   * Flag indicating whether the component is running in standalone mode (ie not running inside Outlook).
   */
  standalone: boolean | null;
}

const useStyles = makeStyles({
  root: {
    // Stack the label above the field
    display: "flex",
    flexDirection: "column",
    // Use 2px gap below the label (per the design system)
    gap: "2px",
    margin: "10px",
  },
  combobox: {
    marginTop: "20px",
    marginBottom: "20px",
  },
});

const HeroComboPrompts: React.FC<HeroComboPromptsProps> = ({ onChange, standalone }) => {
  const styles = useStyles();
  const inputId = useId("input");
  const [selectedValue, setSelectedValue] = useState<string>(config.prompts[0].id);

  // Filter out standalone prompts if the client is Outlook
  // Standalone prompts should be used in standalone mode only
  const prompts = useMemo<AIPrompt[]>(() => {
    if (standalone !== null) {
      console.log(`Retrieving prompts with: standalone=${standalone}`);
      return getPrompts(standalone || false);
    } else {
      // console.error("Standalone mode not set");
      return [];
    }
  }, [standalone]);

  // Compute the default value for the dropdown
  const defaultValue = useMemo(() => {
    // Use the summary and user properties of the first prompt as the default value
    return (config.prompts[0].summary || config.prompts[0].system) + " " + config.prompts[0].user;
  }, [config.prompts[0]]);

  // Compute the options for the dropdown
  const options = useMemo(() => {
    // Map each prompt to an Option component
    return prompts.map((prompt: AIPrompt) => (
      <Option value={prompt.id} key={prompt.id}>
        {(prompt.summary || prompt.system) + " " + prompt.user}
      </Option>
    ));
  }, [prompts]);

  const handleChange = useCallback(
    (_event: SelectionEvents, data: { optionValue: string }) => {
      const newValue = data.optionValue || config.prompts[0].id;
      setSelectedValue(newValue);
      onChange(newValue);
    },
    [onChange]
  );

  useEffect(() => {
    onChange(selectedValue);
  }, [selectedValue, onChange]);

  useEffect(() => {
    const resizeObserverErr = (e: ErrorEvent) => {
      if (e.message === "ResizeObserver loop completed with undelivered notifications.") {
        console.error("ResizeObserver loop error in HeroComboPrompts");
        e.stopImmediatePropagation();
        e.stopPropagation();
      }
    };
    window.addEventListener("error", resizeObserverErr);
    return () => {
      window.removeEventListener("error", resizeObserverErr);
    };
  }, []);

  return (
    <div className={styles.root}>
      <Label htmlFor={inputId} size="large">
        AI Prompt
      </Label>
      <Dropdown
        className={styles.combobox}
        id={inputId}
        onOptionSelect={handleChange}
        defaultSelectedOptions={[config.prompts[0].id]}
        defaultValue={defaultValue}
      >
        {options}
      </Dropdown>
    </div>
  );
};

export default HeroComboPrompts;
