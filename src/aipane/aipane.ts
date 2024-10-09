/**
 * @file aipane.ts
 * @description The AI pane module for the Outlook add-in.
 * @author Ronan LE MEILLAT
 * @copyright 2024 Ronan LE MEILLAT for SCTG Development
 * @license AGPLv3
 */

import { AI } from "@sctg/ai-sdk";
import config from "../config.json" with { type: "json" };
import type { AIAnswer, AIModel, AIPrompt, AIProvider } from "./AIPrompt.js";
import { SentencePieceProcessor, cleanText, llama_3_1_tokeniser_b64 } from "@sctg/sentencepiece-js";
import { Model, ModelListResponse } from "@sctg/ai-sdk/resources/models.js";

const TOKEN_MARGIN: number = 20; // Safety margin for token count
const ERROR_MESSAGE: string = "Error: Unable to insert AI answer.";

/**
 * Counts the number of tokens in a given text using the SentencePieceProcessor.
 * @param {string} text - The text to be tokenized.
 * @returns {Promise<number>} - The number of tokens in the text.
 */
async function countTokens(text: string): Promise<number> {
  // Remove invalid characters and normalise whitespace
  const cleaned: string = cleanText(text);
  // Create a new SentencePieceProcessor
  const spp: SentencePieceProcessor = new SentencePieceProcessor();
  // Load the tokeniser model from a base64 string
  // llama_3_1_tokeniser_b64 is a pre-trained model for the Llama 3.1 tokeniser and encoded in base64
  await spp.loadFromB64StringModel(llama_3_1_tokeniser_b64);
  // Encode the cleaned text into token IDs
  const ids: number[] = spp.encodeIds(cleaned);
  return ids.length; // Return the number of tokens
}

/**
 * Makes an AI request to the @sctg/ai-sdk API.
 * @param {AIProvider} provider - The AI provider configuration.
 * @param {AIModel} model - The AI model configuration.
 * @param {string} apiKey - The API key for authentication.
 * @param {string} systemText - The system prompt text.
 * @param {string} userText - The user input text.
 * @returns {Promise<string>} - The AI-generated response.
 */
async function aiRequest(
  provider: AIProvider,
  model: AIModel,
  apiKey: string,
  systemText: string,
  userText: string
): Promise<string> {
  const proxyUrl: string = config.aiproxy.host;
  const ai: AI = new AI({
    baseURL: provider.baseUrl,
    basePath: provider.basePath,
    disableCorsCheck: false,
    apiKey,
    dangerouslyAllowBrowser: true,
    proxy: provider.aiproxied ? proxyUrl : undefined,
  });

  // Count the number of tokens in the combined system and user text
  const tokenCount: number = await countTokens(systemText + userText);
  console.log(`Token count: ${tokenCount}`);

  // Create a chat completion request
  const chatCompletion = await ai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: systemText,
      },
      {
        role: "user",
        content: userText,
      },
    ],
    model: model.id,
    temperature: 1,
    max_tokens: model.max_tokens - tokenCount - TOKEN_MARGIN,
    top_p: 1,
    stream: true,
    stop: null,
  });

  // Collect the response from the stream
  let response: string = "";
  for await (const chunk of chatCompletion) {
    response += chunk.choices[0]?.delta?.content || "";
  }
  return response;
}

/**
 * Retrieves the prompt configuration by its ID.
 * @param {string} id - The ID of the prompt.
 * @returns {AIPrompt} - The prompt configuration.
 */
function getPrompt(id: string): AIPrompt {
  const prompts: AIPrompt[] = config.prompts;
  return prompts.find((prompt) => prompt.id === id && prompt.standalone !== isOutlookClient()) || prompts[0];
}

/**
 * Inserts the AI-generated answer into the email body.
 * @param {AIProvider} provider - The AI provider configuration.
 * @param {AIModel} model - The AI model configuration.
 * @param {string} apiKey - The API key for authentication.
 * @param {string} id - The ID of the prompt.
 * @param {string} userText - The user input text.
 * @returns {Promise<AIAnswer>} - The AI-generated response and any errors.
 */
export async function insertAIAnswer(
  provider: AIProvider,
  model: AIModel,
  apiKey: string,
  id: string,
  userText: string
): Promise<AIAnswer> {
  const { system, user } = getPrompt(id);
  let error: string | null = ERROR_MESSAGE;
  try {
    console.log(`Prompt: ${id}`);
    console.log(`System text: \n${system}`);
    console.log(`User: ${user}`);
    console.log(`User text: \n${userText}`);

    // Make the AI request and get the response
    let aiText: string = await aiRequest(provider, model, apiKey, system, `${user}\n${userText}`);
    console.log(`AI provider: ${provider.name} AI model: ${model.name}: \n${aiText}`);

    // Replace newlines with HTML line breaks
    aiText = aiText.replace(/\n/g, "<br>");

    // Insert the AI-generated text into the email body
    if (isOutlookClient()) {
      error = null;
      Office.context.mailbox.item?.body.setSelectedDataAsync(
        aiText,
        { coercionType: Office.CoercionType.Html },
        (asyncResult: Office.AsyncResult<void>) => {
          if (asyncResult.status === Office.AsyncResultStatus.Failed) {
            throw new Error(asyncResult.error.message);
          }
        }
      );
    }
    return { response: aiText, error };
  } catch (err) {
    console.error("Error: " + err);
    return { response: "", error };
  }
}

export async function getAIModels(provider: AIProvider, apiKey: string, filter: string): Promise<AIModel[]> {
  interface ExtendedModel extends Model {
    context_window?: number;
    active?: boolean;
  }

  const proxyUrl: string = config.aiproxy.host;
  const ai: AI = new AI({
    baseURL: provider.baseUrl,
    basePath: provider.basePath,
    disableCorsCheck: false,
    apiKey,
    dangerouslyAllowBrowser: true,
    proxy: provider.aiproxied ? proxyUrl : undefined,
  });

  const returnedModels: AIModel[] = [];
  const models: ModelListResponse = await ai.models.list();
  const filteredModels: ExtendedModel[] = models.data.filter(
    (model: ExtendedModel) => model.id.includes(filter) && model.active
  );
  const orderedModels: ExtendedModel[] = filteredModels.sort((a, b) => b.created - a.created);
  orderedModels.forEach((model) => {
    returnedModels.push({
      id: model.id,
      name: model.id,
      default: false,
      max_tokens: model.context_window || 2048,
    });
  });
  returnedModels[0].default = true;
  return returnedModels;
}

/**
 * Detects if the current app runs in the Outlook client.
 * @returns {boolean} - True if the app runs in the Outlook client, false otherwise.
 */
export function isOutlookClient(): boolean {
  return typeof Office.context.mailbox !== "undefined";
}
