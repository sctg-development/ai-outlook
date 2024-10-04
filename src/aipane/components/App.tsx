/*
=========================================================
* © 2024 Ronan LE MEILLAT for SCTG Development
=========================================================
*/
import * as React from "react";
import { useState, useEffect } from "react";
import Header from "./Header";
import HeroList, { HeroListItem } from "./HeroList";
import TextInsertion from "./TextInsertion";
import { makeStyles } from "@fluentui/react-components";
import { BrainCircuit20Regular } from "@fluentui/react-icons";
import { insertText } from "../aipane";
import HeroApiKey from "./HeroApiKey";
import HeroComboPrompts from "./HeroComboPrompts";
import HeroModels from "./HeroModels";
import { AIModel, AIProvider, getDefaultProvider, getModel } from "../AIPrompt";

interface AppProps {
  title: string;
}

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
  },
});

const App: React.FC<AppProps> = (props: AppProps) => {
  const [provider, setProvider] = useState<AIProvider | null>(getDefaultProvider());
  const styles = useStyles();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string | null>(null);
  const [model, setModel] = useState<AIModel | null>(null);
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(false);

  // The list items are static and won't change at runtime,
  // so this should be an ordinary const, not a part of state.
  const listItems: HeroListItem[] = [
    {
      icon: <BrainCircuit20Regular />,
      primaryText: "Take benefit of the AI",
    },
  ];

  useEffect(() => {
    if (!provider) {
      setProvider(getDefaultProvider());
    }
    const storedApiKey = localStorage.getItem(provider.apiKey);
    if (!storedApiKey) {
      setShowApiKeyInput(true);
    } else {
      setApiKey(storedApiKey);
    }
  }, []);

  const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(event.target.value);
  };

  const handlePromptChange = (prompt: string) => {
    setPrompt(prompt);
  };

  const handleApiKeySubmit = () => {
    if (apiKey) {
      localStorage.setItem(provider.apiKey, apiKey);
      setShowApiKeyInput(false);
    }
  };

  const handleModelChange = (newValue: string) => {
    setModel(getModel(provider, newValue) || null);
  };

  const handlePromptSubmit = (userText: string) => {
    const apiKey = localStorage.getItem(provider.apiKey);
    insertText(provider, model, apiKey, prompt, `${userText}`);
  };

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
          <HeroList message="Ask Llama" items={listItems} />
          <HeroModels onChange={handleModelChange} provider={provider} />
          <HeroComboPrompts onChange={handlePromptChange} />
          <TextInsertion insertText={handlePromptSubmit} basePrompt={""} />
        </>
      )}
    </div>
  );
};

export default App;
