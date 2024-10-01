/*
=========================================================
* © 2024 Ronan LE MEILLAT for SCTG Development
=========================================================
*/
import * as React from "react";
import { Combobox, Label, makeStyles, Option, useId } from "@fluentui/react-components";
import { useState, useEffect } from "react";
import config from "../../config.json"; // Assurez-vous que le chemin est correct

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
  const [selectedValue, setSelectedValue] = useState<string>(config.models[0]);

  const handleChange = (event: React.FormEvent<HTMLButtonElement>, option?: any) => {
    event.preventDefault();
    const newValue = option.nextOption?.text || config.models[0];
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
        {config.prompts.map((option) => (
          <Option value={option} key={option}>
            {option}
          </Option>
        ))}
      </Combobox>
    </div>
  );
};

export default HeroComboPrompts;
