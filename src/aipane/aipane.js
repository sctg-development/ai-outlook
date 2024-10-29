"use strict";
/**
 * @file aipane.ts
 * @description The AI pane module for the Outlook add-in.
 * @author Ronan LE MEILLAT
 * @copyright 2024 Ronan LE MEILLAT for SCTG Development
 * @license AGPLv3
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSelectedText = getSelectedText;
exports.insertAIAnswer = insertAIAnswer;
exports.getAIModels = getAIModels;
exports.waitForOffice = waitForOffice;
exports.isOutlookClient = isOutlookClient;
var ai_sdk_1 = require("@sctg/ai-sdk");
var config_1 = require("./config");
var sentencepiece_js_1 = require("@sctg/sentencepiece-js");
var dompurify_1 = require("dompurify");
var TOKEN_MARGIN = 20; // Safety margin for token count
var ERROR_MESSAGE = "Error: Unable to insert AI answer.";
/**
 * Counts the number of tokens in a given text using the SentencePieceProcessor.
 * @param {string} text - The text to be tokenized.
 * @returns {Promise<number>} - The number of tokens in the text.
 */
function countTokens(text) {
    return __awaiter(this, void 0, void 0, function () {
        var cleaned, spp, ids;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cleaned = (0, sentencepiece_js_1.cleanText)(text);
                    spp = new sentencepiece_js_1.SentencePieceProcessor();
                    // Load the tokeniser model from a base64 string
                    // llama_3_1_tokeniser_b64 is a pre-trained model for the Llama 3.1 tokeniser and encoded in base64
                    return [4 /*yield*/, spp.loadFromB64StringModel(sentencepiece_js_1.llama_3_1_tokeniser_b64)];
                case 1:
                    // Load the tokeniser model from a base64 string
                    // llama_3_1_tokeniser_b64 is a pre-trained model for the Llama 3.1 tokeniser and encoded in base64
                    _a.sent();
                    ids = spp.encodeIds(cleaned);
                    return [2 /*return*/, ids.length]; // Return the number of tokens
            }
        });
    });
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
function aiRequest(provider, model, apiKey, systemText, userText) {
    return __awaiter(this, void 0, void 0, function () {
        var proxyUrl, ai, tokenCount, chatCompletion, response, _a, chatCompletion_1, chatCompletion_1_1, chunk, e_1_1;
        var _b, e_1, _c, _d;
        var _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    proxyUrl = config_1.config.aiproxy.host;
                    ai = new ai_sdk_1.AI({
                        baseURL: provider.baseUrl,
                        basePath: provider.basePath,
                        disableCorsCheck: false,
                        apiKey: apiKey,
                        dangerouslyAllowBrowser: true,
                        proxy: provider.aiproxied ? proxyUrl : undefined,
                    });
                    return [4 /*yield*/, countTokens(systemText + userText)];
                case 1:
                    tokenCount = _g.sent();
                    console.log("Token count: ".concat(tokenCount));
                    return [4 /*yield*/, ai.chat.completions.create({
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
                        })];
                case 2:
                    chatCompletion = _g.sent();
                    response = "";
                    _g.label = 3;
                case 3:
                    _g.trys.push([3, 8, 9, 14]);
                    _a = true, chatCompletion_1 = __asyncValues(chatCompletion);
                    _g.label = 4;
                case 4: return [4 /*yield*/, chatCompletion_1.next()];
                case 5:
                    if (!(chatCompletion_1_1 = _g.sent(), _b = chatCompletion_1_1.done, !_b)) return [3 /*break*/, 7];
                    _d = chatCompletion_1_1.value;
                    _a = false;
                    chunk = _d;
                    response += ((_f = (_e = chunk.choices[0]) === null || _e === void 0 ? void 0 : _e.delta) === null || _f === void 0 ? void 0 : _f.content) || "";
                    _g.label = 6;
                case 6:
                    _a = true;
                    return [3 /*break*/, 4];
                case 7: return [3 /*break*/, 14];
                case 8:
                    e_1_1 = _g.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 14];
                case 9:
                    _g.trys.push([9, , 12, 13]);
                    if (!(!_a && !_b && (_c = chatCompletion_1.return))) return [3 /*break*/, 11];
                    return [4 /*yield*/, _c.call(chatCompletion_1)];
                case 10:
                    _g.sent();
                    _g.label = 11;
                case 11: return [3 /*break*/, 13];
                case 12:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 13: return [7 /*endfinally*/];
                case 14: return [2 /*return*/, response];
            }
        });
    });
}
/**
 * Retrieves the prompt configuration by its ID.
 * @param {string} id - The ID of the prompt.
 * @returns {AIPrompt} - The prompt configuration.
 */
function getPrompt(id) {
    var prompts = config_1.config.prompts;
    var prompt = prompts.find(function (prompt) { return prompt.id === id && (!prompt.standalone || !isOutlookClient()); });
    if (!prompt) {
        console.error("getPrompt: Prompt not found");
        throw new Error("Prompt not found");
    }
    return prompt;
}
/**
 * Retrieves the text selected in the email body.
 * @returns Promise<string> - The selected text.
 */
function getSelectedText() {
    return new Promise(function (resolve, reject) {
        isOutlookClient()
            .then(function () {
            var _a;
            (_a = Office.context.mailbox.item) === null || _a === void 0 ? void 0 : _a.getSelectedDataAsync(Office.CoercionType.Text, function (asyncResult) {
                if (asyncResult.status === Office.AsyncResultStatus.Failed) {
                    reject(asyncResult.error);
                }
                else {
                    var text = asyncResult.value.data;
                    var prop = asyncResult.value.sourceProperty;
                    console.log("Selected text in " + prop + ": " + text);
                    resolve(text);
                }
            });
        })
            .catch(function (error) {
            reject(error);
        });
    });
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
function insertAIAnswer(provider, model, apiKey, id, userText) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, system, user, error, _debug, aiText, err_1;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = getPrompt(id), system = _a.system, user = _a.user;
                    error = ERROR_MESSAGE;
                    // Validate and sanitize inputs
                    if (!system || !user || !userText) {
                        console.error("insertAIAnswer: Invalid input");
                        throw new Error("insertAIAnswer: Invalid input");
                    }
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 4, , 5]);
                    _debug = localStorage.getItem("DEBUG");
                    console.log("DEBUG: ".concat(_debug));
                    if (_debug && _debug === "1") {
                        // eslint-disable-next-line no-eval
                        eval("debu" + "gger");
                    }
                    console.log("Prompt: ".concat(id));
                    console.log("System text: \n".concat(system));
                    console.log("User: ".concat(user));
                    console.log("User text: \n".concat(userText));
                    return [4 /*yield*/, aiRequest(provider, model, apiKey, system, "".concat(user, "\n").concat(userText))];
                case 2:
                    aiText = _c.sent();
                    console.log("AI provider: ".concat(provider.name, " AI model: ").concat(model.name, ": \n").concat(aiText));
                    return [4 /*yield*/, isOutlookClient()];
                case 3:
                    // Insert the AI-generated text into the email body
                    if (_c.sent()) {
                        // Replace newlines with HTML line breaks
                        aiText = aiText.replace(/\n/g, "<br>");
                        // Sanitize and escape the AI-generated text
                        aiText = dompurify_1.default.sanitize(aiText);
                        error = null;
                        (_b = Office.context.mailbox.item) === null || _b === void 0 ? void 0 : _b.body.setSelectedDataAsync(aiText, { coercionType: Office.CoercionType.Html }, function (asyncResult) {
                            if (asyncResult.status === Office.AsyncResultStatus.Failed) {
                                console.error("insertAIAnswer: Error inserting AI answer:", asyncResult.error);
                                throw new Error(asyncResult.error.message);
                            }
                        });
                    }
                    return [2 /*return*/, { response: aiText, error: error }];
                case 4:
                    err_1 = _c.sent();
                    console.error("Error: " + err_1);
                    return [2 /*return*/, { response: "", error: error }];
                case 5: return [2 /*return*/];
            }
        });
    });
}
/**
 * Retrieves a list of AI models for the given provider and filter.
 * This function creates an AI instance and uses it to list the models.
 * @param {AIProvider} provider - The AI provider configuration.
 * @param {string} apiKey - The API key for authentication.
 * @param {string} filter - The filter for the model list.
 * @returns {Promise<AIModel[]>} - The list of AI models.
 */
function getAIModels(provider, apiKey, filter) {
    return __awaiter(this, void 0, void 0, function () {
        var proxyUrl, ai, models, filteredModels, orderedModels, returnedModels_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    proxyUrl = config_1.config.aiproxy.host;
                    ai = new ai_sdk_1.AI({
                        baseURL: provider.baseUrl,
                        basePath: provider.basePath,
                        disableCorsCheck: false,
                        apiKey: apiKey,
                        dangerouslyAllowBrowser: true,
                        proxy: provider.aiproxied ? proxyUrl : undefined,
                    });
                    return [4 /*yield*/, ai.models.list()];
                case 2:
                    models = _a.sent();
                    filteredModels = models.data.filter(function (model) { return model.id.includes(filter) && model.active; });
                    orderedModels = filteredModels.sort(function (a, b) { return b.created - a.created; });
                    returnedModels_1 = [];
                    orderedModels.forEach(function (model) {
                        returnedModels_1.push({
                            id: model.id,
                            name: model.id,
                            default: false,
                            max_tokens: model.context_window || 2048,
                        });
                    });
                    returnedModels_1[0].default = true;
                    return [2 /*return*/, returnedModels_1];
                case 3:
                    error_1 = _a.sent();
                    console.error("Error retrieving AI models:", error_1);
                    throw error_1;
                case 4: return [2 /*return*/];
            }
        });
    });
}
var officeLoaded = false;
if (typeof Office !== "undefined") {
    Office.onReady(function (info) {
        console.log("Office SDK ready running ".concat(info.host ? "in" + info.host : "outside office"));
        officeLoaded = true;
    });
}
/**
 * Wait for the Office.js library to load.
 * limit the waiting time to 2 seconds
 * @returns {Promise<boolean>} - A promise that resolves to true when the Office.js library is loaded or to false after 2 seconds.
 */
function waitForOffice() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    if (officeLoaded) {
                        resolve(true);
                    }
                    else {
                        setTimeout(function () {
                            resolve(false);
                        }, 2000);
                    }
                })];
        });
    });
}
/**
 * Detects if the current app runs in the Outlook client.
 * @returns {boolean} - True if the app runs in the Outlook client, false otherwise.
 */
function isOutlookClient() {
    return __awaiter(this, void 0, void 0, function () {
        var isOutlookLoaded;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, waitForOffice()];
                case 1:
                    isOutlookLoaded = _a.sent();
                    return [2 /*return*/, typeof Office.context.mailbox !== "undefined" && isOutlookLoaded];
            }
        });
    });
}
