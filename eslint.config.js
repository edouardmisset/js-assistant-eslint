import jsAssistant from "./src/index.js";
import { plugin as jsAssistantPlugin } from "./src/plugin.js";

export default [
  ...jsAssistant,
  {
    files: ["scripts/**/*.mjs"],
    languageOptions: {
      globals: {
        URL: "readonly"
      }
    }
  },
  {
    files: ["tests/**/*.js"],
    plugins: {
      "js-assistant": jsAssistantPlugin
    },
    rules: {
      "js-assistant/prefer-early-return": "warn",
      "js-assistant/replace-assignment-with-return": "warn",
      "sonarjs/prefer-immediate-return": "warn"
    }
  }
];
