/*
=========================================================
* © 2024 Ronan LE MEILLAT for SCTG Development
=========================================================
*/
import * as React from "react";
import { Dropdown, Label, makeStyles, Option, useId } from "@fluentui/react-components";
import { useState, useEffect } from "react";
import { getDefaultModel, type AIModel, type AIProvider } from "../AIPrompt";

interface HeroModelsProps {
  onChange: (selectedValue: string) => void;
  provider: AIProvider;
  //readValue: () => string;
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

const HeroModels: React.FC<HeroModelsProps> = ({ onChange, provider }) => {
  const styles = useStyles();
  const selectId = useId("select");
  const [selectedValue, setSelectedValue] = useState<string>(getDefaultModel(provider).id);

  const handleChange = React.useCallback(
    (event: React.FormEvent<HTMLButtonElement>, option?: any) => {
      event.preventDefault();
      const newValue = option?.nextOption.value || getDefaultModel(provider).id;
      setSelectedValue(newValue);
      onChange(newValue);
    },
    [onChange, provider]
  );

  useEffect(() => {
    onChange(selectedValue);
  }, [selectedValue, onChange]);

  useEffect(() => {
    const resizeObserverErr = (e: ErrorEvent) => {
      if (e.message === "ResizeObserver loop completed with undelivered notifications.") {
        console.error("ResizeObserver loop error in HeroModels");
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
      <Label htmlFor={selectId} size="large">
        Model
      </Label>
      <Dropdown
        className={styles.combobox}
        id={selectId}
        defaultSelectedOptions={[getDefaultModel(provider).id]}
        defaultValue={getDefaultModel(provider).name}
        onActiveOptionChange={handleChange}
        onChange={handleChange}
      >
        {provider.models.map((option: AIModel) => (
          <Option value={option.id} key={option.id}>
            {option.name}
          </Option>
        ))}
      </Dropdown>
    </div>
  );
};

export default HeroModels;
