/**
 * @file Aipane.tsx
 * @description The main application component.
 * @author Ronan LE MEILLAT
 * @copyright 2024 Ronan LE MEILLAT for SCTG Development
 * @license AGPLv3
 */

import * as React from "react";
import { useState, useEffect } from "react";
import Header from "./Header";
import { HeroListItem } from "./HeroList";
import TextInsertion from "./TextInsertion";
import { makeStyles } from "@fluentui/react-components";
import { BrainCircuit20Regular } from "@fluentui/react-icons";
import { insertAIAnswer, isOutlookClient } from "../aipane";
import HeroApiKey from "./HeroApiKey";
import HeroComboPrompts from "./HeroComboPrompts";
import HeroModels from "./HeroModels";
import { AIAnswer, AIModel, AIProvider, getDefaultProvider, getModel } from "../AIPrompt";
import HeroProviders from "./HeroProviders";
import { versionInfo } from "../../version";
import { Link } from "react-router-dom";
import { config } from "../config";

/**
 * @interface AppProps
 * @description Properties for the App component.
 */
interface AipaneProps {
  /**
   * @description The title of the application.
   */
  title: string;
}

/**
 * @function useStyles
 * @description Creates a hook for using styles in the component.
 * @returns {Object} The styles object.
 */
const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
  },
  fakeLink: {
    cursor: "pointer",
    color: "blue",
    fontSize: "0.5em",
    margin: "0.5em",
  },
});

/**
 * @function Aipane
 * @description The main application component.
 * @param {AipaneProps} props
 * @returns { React.JSX.Element} The application component.
 */
const Aipane: React.FC<AipaneProps> = (props: AipaneProps): React.JSX.Element => {
  /**
   * @state provider
   * @description The current AI provider.
   */
  const [provider, setProvider] = useState<AIProvider | null>(getDefaultProvider());

  const styles = useStyles();

  /**
   * @state apiKey
   * @description The API key for the current provider.
   */
  const [apiKey, setApiKey] = useState<string | null>(null);

  /**
   * @state prompt
   * @description The current prompt.
   */
  const [prompt, setPrompt] = useState<string | null>(null);

  /**
   * @state model
   * @description The current AI model.
   */
  const [model, setModel] = useState<AIModel | null>(null);

  /**
   * @state showApiKeyInput
   * @description Whether to show the API key input field.
   */
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  /**
   * @state isStandalone
   * @description Whether the client is NOT Outlook.
   */
  const [isStandalone, setIsStandalone] = useState(null as boolean | null);

  /**
   * @constant listItems
   * @description The list items are static and won't change at runtime,
   * so this should be an ordinary const, not a part of state.
   * @type {HeroListItem[]}
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const listItems: HeroListItem[] = [
    {
      icon: <BrainCircuit20Regular />,
      primaryText: "Take benefit of the AI",
    },
  ];

  /**
   * @function useEffect
   * @description Handles the component's lifecycle.
   */
  useEffect(() => {
    /**
     * @description Retrieves the stored API key for the current provider.
     */
    const storedApiKey = localStorage.getItem(provider.apiKey);
    if (!storedApiKey) {
      setShowApiKeyInput(true);
    } else {
      setApiKey(storedApiKey);
    }
    if (!provider) {
      setProvider(getDefaultProvider());
    }
  }, []);

  /**
   * @function handleApiKeyChange
   * @description Handles changes to the API key input field.
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(event.target.value);
  };

  /**
   * @function handlePromptChange
   * @description Handles changes to the prompt input field.
   * @param {string} prompt
   */
  const handlePromptChange = (prompt: string) => {
    setPrompt(prompt);
  };

  /**
   * @function handleApiKeySubmit
   * @description Handles submission of the API key.
   */
  const handleApiKeySubmit = () => {
    if (apiKey) {
      localStorage.setItem(provider.apiKey, apiKey);
      setShowApiKeyInput(false);
    }
  };

  /**
   * @function handleModelChange
   * @description Handles changes to the AI model selection.
   * @param {string} model
   */
  const handleModelChange = (model: string) => {
    setModel(getModel(provider, model) || null);
  };

  /**
   * @function handlePromptSubmit
   * @description Handles submission of the prompt.
   * @param {string} userText
   */
  const handlePromptSubmit = (userText: string): Promise<AIAnswer> => {
    const apiKey = localStorage.getItem(provider.apiKey);
    return insertAIAnswer(provider, model, apiKey, prompt, `${userText}`);
  };

  /**
   * @function handleProviderChange
   * @description Handles changes to the provider selection.
   * @param {AIProvider} provider
   */
  const handleProviderChange = (provider: AIProvider) => {
    setProvider(provider);
    if (!localStorage.getItem(provider.apiKey)) {
      setShowApiKeyInput(true);
    }
  };

  /**
   * Clear the API keys from local storage.
   * for all providers.
   * @returns {void}
   */
  const clearKeys = (): void => {
    Object.keys(config.providers).map((key) => {
      const provider = config.providers[key] as AIProvider;
      console.log(`Clearing key for ${provider.apiKey}`);
      localStorage.removeItem(provider.apiKey);
    });
  };

  useEffect(() => {
    // Show the version number, the build date and the target use in the console
    // eslint-disable-next-line no-console
    if (isStandalone == null) {
      isOutlookClient().then((isOutlook) => {
        console.log(`Version: ${versionInfo.commit} Date: ${versionInfo.date} Runs on Outlook: ${isOutlook}`);
        setIsStandalone(!isOutlook);
      });
    }
  }, []);

  useEffect(() => {
    const resizeObserverErr = (e: ErrorEvent) => {
      if (e.message === "ResizeObserver loop completed with undelivered notifications.") {
        console.error("ResizeObserver loop error in Aipane");
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
      <Header logo="assets/logo-filled.png" title={props.title} message="AI emailer" />
      {showApiKeyInput ? (
        <HeroApiKey
          apiKey={apiKey}
          onApiKeyChange={handleApiKeyChange}
          onApiKeySubmit={handleApiKeySubmit}
          provider={provider}
        />
      ) : (
        <>
          {/* <HeroList message="Ask Llama" items={listItems} /> */}
          <HeroProviders onChange={handleProviderChange} />
          <HeroModels onChange={handleModelChange} provider={provider} />
          <HeroComboPrompts onChange={handlePromptChange} standalone={isStandalone} />
          <TextInsertion getAIAnswer={handlePromptSubmit} basePrompt={""} />
        </>
      )}
      {!isStandalone ? (
        <span className={styles.fakeLink} onClick={clearKeys}>
          Clean the keys
        </span>
      ) : (
        <Link to="settings">Settings</Link>
      )}
    </div>
  );
};

export default Aipane;
