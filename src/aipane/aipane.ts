/*
=========================================================
* © 2024 Ronan LE MEILLAT for SCTG Development
=========================================================
*/

import { Groq } from "groq-sdk";
import config from "../config.json";
import type { AIPrompt } from "./AIPrompt";

async function groqRequest(model: string, apiKey: string, systemText: string, usertext: string): Promise<string> {
  const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });
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
    model: model,
    temperature: 1,
    max_tokens: 7999,
    top_p: 1,
    stream: false,
    stop: null,
  });

  return chatCompletion.choices[0]?.message?.content || "";
}
function getPrompt(id: string): AIPrompt {
  const prompts: AIPrompt[] = config.prompts;
  return prompts.find((prompt) => prompt.id === id) || prompts[0];
}

export async function insertText(model: string, apiKey: string, id: string, userText: string) {
  const { system, user } = getPrompt(id);
  try {
    console.log(`Prompt: ${id}`);
    console.log(`System text: \n${system}`);
    console.log(`User: ${user}`);
    console.log(`User text: \n${userText}`);
    let aiText = await groqRequest(model, apiKey, system, `${user}\n${userText}`);
    console.log(`AI response (${model}): \n${aiText}`);
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
