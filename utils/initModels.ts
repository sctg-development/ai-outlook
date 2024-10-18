import { getAIModels } from "../src/aipane/aipane.js";
import { AIProvider } from "../src/aipane/AIPrompt.js";
import config from "../src/config.json" with { type: "json" };
import { writeFileSync } from "fs";

const groqProvider = config.providers.find((provider: AIProvider) => provider.name === "Groq");
// eslint-disable-next-line no-undef
const apiKey = process.env.GROQ_API_KEY || "";

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
// normalize the model name from llama-3.1-70b-versatile to Llama 3.1 (70b) Versatile
function normalizeModelName(name: string): string {
  const parts = name.split("-");
  const capitalized = parts.map((part) => capitalizeFirstLetter(part));
  const retString =
    `${capitalized[0]} ${capitalized[1]} (${capitalized[2]} ${capitalized[3] || ""} ${capitalized[4] || ""} ${capitalized[5] || ""}`.trim() +
    ")";
  return retString.trim();
}
if (apiKey !== "") {
  const groqModels = getAIModels(groqProvider, apiKey, "llama");
  groqModels.then((models) => {
    models = models.map((model) => {
      model.name = normalizeModelName(model.name);
      return model;
    });
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
}
