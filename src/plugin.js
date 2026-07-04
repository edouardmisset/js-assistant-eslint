import { preferEarlyReturn } from "./rules/prefer-early-return.js";
import { replaceAssignmentWithReturn } from "./rules/replace-assignment-with-return.js";

/** @type {import("eslint").Linter.Plugin} */
export const plugin = {
  rules: {
    "prefer-early-return": preferEarlyReturn,
    "replace-assignment-with-return": replaceAssignmentWithReturn,
  },
};
