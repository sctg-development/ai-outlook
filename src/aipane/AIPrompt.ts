/*
=========================================================
* © 2024 Ronan LE MEILLAT for SCTG Development
=========================================================
*/

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
