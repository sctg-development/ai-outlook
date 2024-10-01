/*
=========================================================
* © 2024 Ronan LE MEILLAT for SCTG Development
=========================================================
*/
import * as React from "react";
import { Combobox, Label, makeStyles, Option, useId } from "@fluentui/react-components";
import { useState, useEffect } from "react";
import config from "../../config.json"; // Assurez-vous que le chemin est correct
import type { AIPrompt } from "../AIPrompt";

interface HeroComboPromptsProps {
  onChange: (selectedValue: string) => void;
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

const HeroComboPrompts: React.FC<HeroComboPromptsProps> = ({ onChange }) => {
  const styles = useStyles();
  const inputId = useId("input");
  const [selectedValue, setSelectedValue] = useState<string>(config.prompts[0].id);

  const handleChange = (event: React.FormEvent<HTMLButtonElement>, option?: any) => {
    event.preventDefault();
    const newValue = option.nextOption?.value || config.prompts[0].id;
    setSelectedValue(newValue);
    onChange(newValue);
  };

  useEffect(() => {
    onChange(selectedValue);
  }, [selectedValue]);

  return (
    <div className={styles.root}>
      <Label htmlFor={inputId} size="large">
        AI Prompt
      </Label>
      <Combobox
        className={styles.combobox}
        id={inputId}
        placeholder="Select a prompt"
        onActiveOptionChange={handleChange}
      >
        {config.prompts.map((option: AIPrompt) => (
          <Option id={option.id} value={option.id} key={option.id}>
            {option.system}
          </Option>
        ))}
      </Combobox>
    </div>
  );
};

export default HeroComboPrompts;
