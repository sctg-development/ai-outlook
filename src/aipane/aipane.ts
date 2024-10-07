/**
 * @file aipane.ts
 * @description The AI pane module for the Outlook add-in.
 * @author Ronan LE MEILLAT
 * @copyright 2024 Ronan LE MEILLAT for SCTG Development
 * @license AGPLv3
 */

import { AI } from "@sctg/ai-sdk";
import config from "../config.json";
import type { AIAnswer, AIModel, AIPrompt, AIProvider } from "./AIPrompt";
import { SentencePieceProcessor, cleanText, llama_3_1_tokeniser_b64 } from "@sctg/sentencepiece-js";

const TOKEN_MARGIN = 20; // Safety margin for token count

/**
 * Counts the number of tokens in a given text using the SentencePieceProcessor.
 * @param {string} text - The text to be tokenized.
 * @returns {Promise<number>} - The number of tokens in the text.
 */
async function countTokens(text: string): Promise<number> {
  // Remove invalid characters and normalise whitespace
  let cleaned = cleanText(text);
  // Create a new SentencePieceProcessor
  let spp = new SentencePieceProcessor();
  // Load the tokeniser model from a base64 string
  // llama_3_1_tokeniser_b64 is a pre-trained model for the Llama 3.1 tokeniser and encoded in base64
  await spp.loadFromB64StringModel(llama_3_1_tokeniser_b64);
  // Encode the cleaned text into token IDs
  let ids = spp.encodeIds(cleaned);
  return ids.length; // Return the number of tokens
}

/**
 * Makes an AI request to the Groq API.
 * @param {AIProvider} provider - The AI provider configuration.
 * @param {AIModel} model - The AI model configuration.
 * @param {string} apiKey - The API key for authentication.
 * @param {string} systemText - The system prompt text.
 * @param {string} usertext - The user input text.
 * @returns {Promise<string>} - The AI-generated response.
 */
async function aiRequest(
  provider: AIProvider,
  model: AIModel,
  apiKey: string,
  systemText: string,
  usertext: string
): Promise<string> {
  const proxyUrl = config.aiproxy.host;
  const ai = new AI({
    baseURL: provider.baseUrl,
    basePath: provider.basePath,
    disableCorsCheck: false,
    apiKey,
    dangerouslyAllowBrowser: true,
    proxy: provider.aiproxied ? proxyUrl : undefined,
  });

  // Count the number of tokens in the combined system and user text
  const tokenCount = await countTokens(systemText + usertext);
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
        content: usertext,
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
  let response = "";
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
  return prompts.find((prompt) => prompt.id === id) || prompts[0];
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
  let error = "Error: Unable to insert AI answer.";
  try {
    console.log(`Prompt: ${id}`);
    console.log(`System text: \n${system}`);
    console.log(`User: ${user}`);
    console.log(`User text: \n${userText}`);

    // Make the AI request and get the response
    let aiText = await aiRequest(provider, model, apiKey, system, `${user}\n${userText}`);
    console.log(`AI provider: ${provider.name} AI model: ${model.name}: \n${aiText}`);

    // Replace newlines with HTML line breaks
    aiText = aiText.replace(/\n/g, "<br>");

    // Insert the AI-generated text into the email body
    if (Office.context.mailbox) {
      error = null;
      Office.context.mailbox.item?.body.setSelectedDataAsync(
        aiText,
        { coercionType: Office.CoercionType.Html },
        (asyncResult: Office.AsyncResult<void>) => {
          if (asyncResult.status === Office.AsyncResultStatus.Failed) {
            throw asyncResult.error.message;
          }
        }
      );
    }
    return { response: aiText, error };
  } catch (error) {
    console.log("Error: " + error);
    return { response: "", error };
  }
}
