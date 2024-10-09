import { getAIModels } from "../src/aipane/aipane.js";
import { AIProvider } from "../src/aipane/AIPrompt.js";
import config from "../src/config.json" with { type: "json" };
import { writeFileSync } from "fs";

const groqProvider = config.providers.find((provider: AIProvider) => provider.name === "Groq");
// eslint-disable-next-line no-undef
const apiKey = process.env.GROQ_API_KEY || "";
const groqModels = getAIModels(groqProvider, apiKey, "llama");
groqModels.then((models) => {
  const newConfig = { ...config };
  // replace the models for the Groq provider
  newConfig.providers = newConfig.providers.map((provider: AIProvider) => {
    if (provider.name === "Groq") {
      provider.models = models;
    }
    return provider;
  });
  //console.log(JSON.stringify(newConfig, null, 2));
  writeFileSync("./src/config.json", JSON.stringify(newConfig, null, 2));
});
