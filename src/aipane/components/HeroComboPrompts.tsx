/*
=========================================================
* © 2024 Ronan LE MEILLAT for SCTG Development
=========================================================
*/
import * as React from "react";
import { Dropdown, Label, makeStyles, Option, useId } from "@fluentui/react-components";
import { useState, useEffect } from "react";
import { getPrompts, type AIPrompt } from "../AIPrompt";
import { config } from "../config";
interface HeroComboPromptsProps {
  onChange: (selectedValue: string) => void;
  standalone: boolean;
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
  const [prompts, setPrompts] = useState<AIPrompt[]>([]);

  // Filter out standalone prompts if the client is Outlook
  // Standalone prompts should be used in standalone mode only
  useEffect(() => {
    console.log(`Retrieving prompts with: standalone=${standalone}`);
    setPrompts(getPrompts(standalone));
  }, []);

  const handleChange = React.useCallback(
    (event: React.FormEvent<HTMLButtonElement>, option?: any) => {
      event.preventDefault();
      const newValue = option?.nextOption.value || config.prompts[0].id;
      setSelectedValue(newValue);
      onChange(newValue);
    },
    [onChange]
  );

  useEffect(() => {
    onChange(selectedValue);
  }, [selectedValue, onChange]);

  return (
    <div className={styles.root}>
      <Label htmlFor={inputId} size="large">
        AI Prompt
      </Label>
      <Dropdown
        className={styles.combobox}
        id={inputId}
        onActiveOptionChange={handleChange}
        defaultSelectedOptions={[config.prompts[0].id]}
        defaultValue={(config.prompts[0].summary || config.prompts[0].system) + " " + config.prompts[0].user}
      >
        {prompts.map((prompt: AIPrompt) => (
          <Option value={prompt.id} key={prompt.id}>
            {(prompt.summary || prompt.system) + " " + prompt.user}
          </Option>
        ))}
      </Dropdown>
    </div>
  );
};

export default HeroComboPrompts;
