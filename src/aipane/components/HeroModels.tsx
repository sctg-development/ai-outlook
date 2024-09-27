/*
=========================================================
* © 2024 Ronan LE MEILLAT for SCTG Development
=========================================================
*/
import * as React from "react";
import { Dropdown, Label, makeStyles, Option, useId } from "@fluentui/react-components";
import { useState, useEffect } from "react";
import config from "../../config.json"; // Assurez-vous que le chemin est correct

interface HeroModelsProps {
  onChange: (selectedValue: string) => void;
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

const HeroModels: React.FC<HeroModelsProps> = ({ onChange }) => {
  const styles = useStyles();
  const selectId = useId("select");
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
      <Label htmlFor={selectId} size="large">
        Model
      </Label>
      <Dropdown className={styles.combobox} id={selectId}
      defaultSelectedOptions={[config.models[0]]}
      defaultValue={config.models[0]}
      onActiveOptionChange={handleChange}
      onChange={handleChange}>
        {config.models.map((option) => (
          <Option value={option} key={option}>
            {option}
          </Option>
        ))}
      </Dropdown>
    </div>
  );
};

export default HeroModels;
