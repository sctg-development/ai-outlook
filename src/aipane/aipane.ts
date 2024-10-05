/*
=========================================================
* © 2024 Ronan LE MEILLAT for SCTG Development
=========================================================
*/

import { Groq } from "@sctg/ai-sdk";
import config from "../config.json";
import type { AIModel, AIPrompt, AIProvider } from "./AIPrompt";
import { SentencePieceProcessor, cleanText, llama_3_1_tokeniser_b64 } from "@sctg/sentencepiece-js";
import { Buffer } from "buffer";

// eslint-disable-next-line no-undef
globalThis.Buffer = Buffer;

const TOKEN_MARGIN = 20;
async function countTokens(text: string): Promise<number> {
  let cleaned = cleanText(text);
  let spp = new SentencePieceProcessor();
  await spp.loadFromB64StringModel(llama_3_1_tokeniser_b64);
  let ids = spp.encodeIds(cleaned);
  return ids.length;
}

async function groqRequest(
  provider: AIProvider,
  model: AIModel,
  apiKey: string,
  systemText: string,
  usertext: string
): Promise<string> {
  const proxyUrl = config.aiproxy.host;
  const groq = new Groq({
    baseURL: provider.baseUrl,
    basePath: provider.basePath,
    disableCorsCheck: false,
    apiKey,
    dangerouslyAllowBrowser: true,
    proxy: provider.aiproxied ? proxyUrl : undefined,
  });
  const tokenCount = await countTokens(systemText + usertext);
  console.log(`Token count: ${tokenCount}`);
  const chatCompletion = await groq.chat.completions.create({
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

  //return chatCompletion.choices[0]?.message?.content || "";
  let response = "";
  for await (const chunk of chatCompletion) {
    response += chunk.choices[0]?.delta?.content || "";
  }
  return response;
}
function getPrompt(id: string): AIPrompt {
  const prompts: AIPrompt[] = config.prompts;
  return prompts.find((prompt) => prompt.id === id) || prompts[0];
}

export async function insertText(provider: AIProvider, model: AIModel, apiKey: string, id: string, userText: string) {
  const { system, user } = getPrompt(id);
  try {
    console.log(`Prompt: ${id}`);
    console.log(`System text: \n${system}`);
    console.log(`User: ${user}`);
    console.log(`User text: \n${userText}`);
    let aiText = await groqRequest(provider, model, apiKey, system, `${user}\n${userText}`);
    console.log(`AI provider: ${provider.name} AI model: ${model.name}: \n${aiText}`);
    aiText = aiText.replace(/\n/g, "<br>");
    Office.context.mailbox.item?.body.setSelectedDataAsync(
      aiText,
      { coercionType: Office.CoercionType.Html },
      (asyncResult: Office.AsyncResult<void>) => {
        if (asyncResult.status === Office.AsyncResultStatus.Failed) {
          throw asyncResult.error.message;
        }
      }
    );
  } catch (error) {
    console.log("Error: " + error);
  }
}
