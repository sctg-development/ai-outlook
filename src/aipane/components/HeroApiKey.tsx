/*
=========================================================
* © 2024 Ronan LE MEILLAT for SCTG Development
=========================================================
*/
import * as React from "react";
import { makeStyles, useId, Button, Input, Label } from "@fluentui/react-components";
import { AIProvider } from "../AIPrompt";

interface HeroApiKeyProps {
  provider: AIProvider;
  apiKey: string | null;
  onApiKeyChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onApiKeySubmit: () => void;
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
  input: {
    marginTop: "20px",
    marginBottom: "20px",
  },
});

const HeroApiKey: React.FC<HeroApiKeyProps> = ({ apiKey, onApiKeyChange, onApiKeySubmit, provider }) => {
  const styles = useStyles();
  const inputId = useId("input");
  return (
    <div className={styles.root}>
      <Label htmlFor={inputId} size="large">
        {provider.name} API Key
      </Label>
      <Input
        className={styles.input}
        id={inputId}
        type="text"
        placeholder="Enter API Key"
        value={apiKey || ""}
        onChange={onApiKeyChange}
      />
      <Button appearance="primary" disabled={false} size="large" onClick={onApiKeySubmit}>
        Submit
      </Button>
    </div>
  );
};

export default HeroApiKey;
