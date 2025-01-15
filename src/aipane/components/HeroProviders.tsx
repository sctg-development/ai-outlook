/*
=========================================================
* © 2024 Ronan LE MEILLAT for SCTG Development
=========================================================
*/
import * as React from "react";
import { Dropdown, Label, makeStyles, Option, useId } from "@fluentui/react-components";
import { useState, useEffect } from "react";
import { getDefaultProvider, getProvider, type AIProvider } from "../AIPrompt";
import { config } from "../config";

interface HeroProvidersProps {
  onChange: (provider: AIProvider) => void;
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

const HeroProviders: React.FC<HeroProvidersProps> = ({ onChange }) => {
  const styles = useStyles();
  const selectId = useId("select");
  const [selectedValue, setSelectedValue] = useState<string>(getDefaultProvider().name);
  const [providers, setProviders] = useState<AIProvider[]>([]);

  let storedProviderName = localStorage.getItem("provider");
  if (storedProviderName === null) {
    storedProviderName = getDefaultProvider().name;
  }

  useEffect(() => {
    setProviders(config.providers);
  }, []);

  const handleChange = React.useCallback(
    (event: React.FormEvent<HTMLButtonElement>, option?: any) => {
      event.preventDefault();
      const newValue = option?.nextOption.value || getDefaultProvider().name;
      localStorage.setItem("provider", newValue);
      setSelectedValue(newValue);
      onChange(getProvider(newValue));
    },
    [onChange]
  );

  useEffect(() => {
    onChange(getProvider(selectedValue));
  }, [selectedValue, onChange]);

  return (
    <div className={styles.root}>
      <Label htmlFor={selectId} size="large">
        Provider
      </Label>
      <Dropdown
        className={styles.combobox}
        id={selectId}
        defaultSelectedOptions={[storedProviderName]}
        defaultValue={storedProviderName}
        onActiveOptionChange={handleChange}
        onChange={handleChange}
      >
        {providers.map((option: AIProvider) => (
          <Option value={option.name} key={option.name}>
            {option.name}
          </Option>
        ))}
      </Dropdown>
    </div>
  );
};

export default HeroProviders;
