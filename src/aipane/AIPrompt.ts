/*
=========================================================
* © 2024 Ronan LE MEILLAT for SCTG Development
=========================================================
*/

import config from "../config.json";
export interface AIPrompt {
  id: string;
  system: string;
  user: string;
  summary: string;
}

export interface AIModel {
  id: string;
  name: string;
  default: boolean;
}

export interface AIProvider {
  default: boolean;
  name: string;
  baseUrl: string;
  basePath: string;
  apiKey: string;
  models: AIModel[];
}

export function getDefaultProvider(): AIProvider {
  return config.providers.filter((provider: AIProvider) => provider.default)[0];
}

export function getProvider(providerName: string): AIProvider {
  return config.providers.filter((provider: AIProvider) => provider.name === providerName)[0];
}
