import { config } from "../src/aipane/config";
import { writeFileSync } from "fs";

export const getPrompts = () => {
  return config.prompts;
};

writeFileSync("./config.json", JSON.stringify(getPrompts(), null, 2));
