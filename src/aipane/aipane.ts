/*
=========================================================
* © 2024 Ronan LE MEILLAT for SCTG Development
=========================================================
*/
/* global Office */

import { Groq } from "groq-sdk";

async function groqRequest(model: string, apiKey: string, text: string): Promise<string> {
  const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: text,
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

export async function insertText(model: string, apiKey: string, text: string) {
  // Write text to the cursor point in the compose surface.
  try {
    console.log("Prompt text: \n" + text);
    let aiText = await groqRequest(model, apiKey, text);
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
