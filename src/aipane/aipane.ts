/*
=========================================================
* © 2024 Ronan LE MEILLAT for SCTG Development
=========================================================
*/
import { Groq } from "groq-sdk";
const GROP_API_KEY = localStorage.getItem("apiKey");
const groq = new Groq({ apiKey: GROP_API_KEY, dangerouslyAllowBrowser: true });

async function groqRequest(model: string, text: string): Promise<string> {
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

export async function insertText(model: string, text: string) {
  // Write text to the cursor point in the compose surface.
  try {
    console.log("Prompt text: \n" + text);
    let aiText = await groqRequest(model, text);
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
