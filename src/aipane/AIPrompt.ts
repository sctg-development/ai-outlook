/*
=========================================================
* © 2024 Ronan LE MEILLAT for SCTG Development
=========================================================
*/

import config from "../config.json" with { type: "json" };

export interface AIAnswer {
  /**
   * The AI-generated response.
   */
  response: string;

  /**
   * The error message, if any.
   */
  error: any | null;
}

export interface AIPrompt {
  /**
   * Unique identifier for the prompt.
   */
  id: string;

  /**
   * System message for the prompt.
   */
  system: string;

  /**
   * User message for the prompt.
   */
  user: string;

  /**
   * Summary of the prompt.
   */
  summary: string;

  /**
   * Indicates if this prompt is available only in standalone mode.
   */
  standalone: boolean;
}

/**
 * Represents an AI model.
 * @interface
 */
export interface AIModel {
  /**
   * Unique identifier for the model.
   */
  id: string;

  /**
   * Name of the model.
   */
  name: string;

  /**
   * Indicates if this model is the default.
   */
  default: boolean;

  /**
   * Maximum number of tokens the model can process.
   */
  max_tokens: number;
}

/**
 * Represents an AI provider.
 * @interface
 */
export interface AIProvider {
  /**
   * Indicates if this provider is the default.
   */
  default: boolean;

  /**
   * Name of the provider.
   */
  name: string;

  /**
   * Base URL for the provider's API.
   */
  baseUrl: string;

  /**
   * Base path for the provider's API.
   */
  basePath: string;

  /**
   * API key for accessing the provider's services.
   */
  apiKey: string;

  /**
   * List of models provided by the AI provider.
   */
  models: AIModel[];

  /**
   * Indicates if the provider is proxied. (e.g., for CORS issues)
   * It was designed to be used with a AI-Proxy-Cloudflare worker https://github.com/sctg-development/ai-proxy-cloudflare.
   * And AI-sdk https://github.com/sctg-development/ai-typescript
   */
  aiproxied: boolean;
}

/**
 * Retrieves the default AI provider from the configuration.
 * @returns {AIProvider} The default AI provider.
 */
export function getDefaultProvider(): AIProvider {
  return config.providers.filter((provider: AIProvider) => provider.default)[0];
}

/**
 * Retrieves a specific AI provider by name.
 * @param {string} providerName - The name of the provider to retrieve.
 * @returns {AIProvider} The AI provider with the specified name.
 */
export function getProvider(providerName: string): AIProvider {
  return config.providers.filter((provider: AIProvider) => provider.name === providerName)[0];
}
/**
 * Retrieves a specific AI model from a given provider by model ID.
 * @param {AIProvider} provider - The AI provider containing the model.
 * @param {string} modelId - The ID of the model to retrieve.
 * @returns {AIModel} The AI model with the specified ID.
 */
export function getModel(provider: AIProvider, modelId: string): AIModel {
  return provider.models.filter((model: AIModel) => model.id === modelId)[0];
}

/**
 * Retrieves the AI model from config.json for the given provider.
 * @param {AIProvider} provider - The AI provider containing the model.
 * @returns {AIModel} The AI model with the specified ID.
 */
export function getDefaultModel(provider: AIProvider): AIModel {
  return provider.models.filter((model: AIModel) => model.default)[0];
}

/**
 * Retrieves the prompts from the configuration.
 * return all prompts if the application is in standalone mode.
 * @param {boolean} standalone - Indicates if the application is in standalone mode.
 */
export function getPrompts(standalone: boolean): AIPrompt[] {
  if (!standalone) {
    return config.prompts.filter((prompt: AIPrompt) => prompt.standalone === standalone);
  } else {
    return config.prompts;
  }
}
