/**
 * @file Settings.tsx
 * @description The main application component.
 * @author Ronan LE MEILLAT
 * @copyright 2024 Ronan LE MEILLAT for SCTG Development
 * @license AGPLv3
 */

import * as React from "react";
import Header from "./Header";
import { Button, Input, Label, makeStyles } from "@fluentui/react-components";
import { config } from "../config";
import { AIProvider } from "../AIPrompt";

/**
 * @function useStyles
 * @description Creates a hook for using styles in the component.
 * @returns {Object} The styles object.
 */
const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
  },
  stack: {
    // Stack the label above the field
    display: "flex",
    flexDirection: "column",
    // Use 2px gap below the label (per the design system)
    gap: "2px",
    // Prevent the example from taking the full width of the page (optional)
    maxWidth: "500px",
    marginBottom: "1em",
  },
});

/**
 * @function saveKeys
 * @description Save the API keys to local storage.
 */
const saveKeys = (): void => {
  const inputIds: string[] = [];
  Object.keys(config.providers).map((key) => {
    const provider = config.providers[key] as AIProvider;
    inputIds.push(`provider-${provider.name}`);
    const apiKey = document.getElementById(`provider-${provider.name}`) as HTMLInputElement;
    localStorage.setItem(`${provider.apiKey}`, apiKey.value);
  });
};

const Settings: React.FC = (): React.JSX.Element => {
  const styles = useStyles();

  const inputIds: string[] = [];
  return (
    <div className={styles.root}>
      <Header logo="assets/logo-filled.png" title="AI emailer" message="Settings" />
      <div>
        {Object.keys(config.providers).map((key) => {
          const provider = config.providers[key] as AIProvider;
          inputIds.push(`provider-${provider.name}`);
          const apiKey = localStorage.getItem(`${provider.apiKey}`);
          return (
            <div className={styles.stack} key={provider.name}>
              <Label htmlFor={`provider-${provider.name}`}>{provider.name}</Label>
              <Input id={`provider-${provider.name}`} defaultValue={apiKey || undefined} />
            </div>
          );
        })}
      </div>
      <Button appearance="primary" size="large" onClick={saveKeys}>
        Save
      </Button>
    </div>
  );
};

export default Settings;
