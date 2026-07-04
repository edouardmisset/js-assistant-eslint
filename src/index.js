// @ts-check
/** @type {import("eslint/config").defineConfig} */
import { defineConfig } from "eslint/config"
import js from "@eslint/js"
import sonarjs from "eslint-plugin-sonarjs"
import unicorn from "eslint-plugin-unicorn"
import tseslint from "typescript-eslint"
import deMorgan from "eslint-plugin-de-morgan"
import { plugin as jsAssistantPlugin } from "./plugin.js"

const jsAndTsFiles = ["**/*.{js,cjs,mjs,ts,cts,mts}"]
const tsFiles = ["**/*.{ts,cts,mts}"]

const ignores = {
  ignores: ["coverage/**", "dist/**", "node_modules/**"],
}

/** @type {import("eslint").Linter.RulesRecord} */
const sharedModernizationRules = {
  "arrow-body-style": ["warn", "as-needed"],
  curly: ["warn", "multi-line"],
  "dot-notation": "warn",
  eqeqeq: ["error", "smart"],
  "no-array-constructor": "warn",
  "no-console": ["warn", { allow: ["warn", "error"] }],
  "no-else-return": ["error", { allowElseIf: false }],
  "no-extra-boolean-cast": "warn",
  "no-fallthrough": "error",
  "no-lonely-if": "warn",
  "max-params": ["warn", { max: 4 }],
  "no-shadow": "warn",
  "no-unneeded-ternary": "warn",
  "no-unused-expressions": "warn",
  "no-useless-concat": "warn",
  "no-var": "warn",
  "object-shorthand": ["warn", "always"],
  "operator-assignment": ["warn", "always"],
  "prefer-const": "warn",
  "prefer-destructuring": ["warn", { object: true, array: false }],
  "prefer-exponentiation-operator": "warn",
  "prefer-spread": "warn",
  "prefer-template": "warn",

  "sonarjs/no-collapsible-if": "warn",
  "sonarjs/no-duplicated-branches": "warn",
  "sonarjs/no-gratuitous-expressions": "warn",
  "sonarjs/no-identical-conditions": "warn",
  "sonarjs/no-identical-expressions": "warn",
  "sonarjs/no-inverted-boolean-check": "warn",
  "sonarjs/no-redundant-boolean": "warn",
  "sonarjs/no-redundant-jump": "warn",
  "sonarjs/no-small-switch": "warn",
  "sonarjs/no-ignored-return": "warn",
  "sonarjs/cognitive-complexity": "warn",
  "sonarjs/no-duplicate-string": "warn",
  "sonarjs/useless-catch": "warn",
  "sonarjs/prefer-immediate-return": "warn",
  "sonarjs/prefer-object-literal": "warn",

  "unicorn/no-negation-in-equality-check": "warn",
  "unicorn/prefer-array-flat": "warn",
  "unicorn/prefer-array-flat-map": "warn",
  "unicorn/prefer-array-some": "warn",
  "unicorn/prefer-code-point": "warn",
  "unicorn/prefer-date-now": "warn",
  "unicorn/prefer-math-min-max": "warn",
  "unicorn/prefer-modern-dom-apis": "warn",
  "unicorn/prefer-modern-math-apis": "warn",
  "unicorn/prefer-negative-index": "warn",
  "unicorn/prefer-regexp-test": "warn",
  "unicorn/prefer-set-has": "warn",
  "unicorn/prefer-set-size": "warn",
  "unicorn/prefer-string-trim-start-end": "warn",
  "unicorn/prefer-structured-clone": "warn",
  "unicorn/numeric-separators-style": "warn",
  "unicorn/prefer-array-find": "warn",
  "unicorn/prefer-includes": "warn",
  "unicorn/prefer-string-starts-ends-with": "warn",
  "unicorn/prefer-ternary": "warn",
  "de-morgan/no-negated-conjunction": "warn",
  "de-morgan/no-negated-disjunction": "warn",

  "js-assistant/prefer-early-return": "warn",
  "js-assistant/replace-assignment-with-return": "warn",
}

/** @type {import("eslint").Linter.RulesRecord} */
const tsModernizationRules = {
  "@typescript-eslint/array-type": ["warn", { default: "generic" }],
  "no-array-constructor": "off",
  "no-shadow": "off",
  "@typescript-eslint/no-shadow": "warn",
  "@typescript-eslint/consistent-type-assertions": ["warn", { assertionStyle: "as" }],
  "@typescript-eslint/no-array-constructor": "warn",
  "no-unused-vars": "off",
  "@typescript-eslint/no-unused-vars": [
    "warn",
    {
      argsIgnorePattern: "^_",
      caughtErrorsIgnorePattern: "^_",
      varsIgnorePattern: "^_",
    },
  ],
  "@typescript-eslint/explicit-function-return-types": [
    "warn",
    {
      allowExpressions: true,
      allowTypedFunctionExpressions: true,
      allowHigherOrderFunctions: true,
      allowConstructors: false,
      allowSetters: false,
    },
  ],
}

/** @type {import("eslint").Linter.RulesRecord} */
const typeAwareModernizationRules = {
  "@typescript-eslint/prefer-nullish-coalescing": "warn",
  "@typescript-eslint/prefer-optional-chain": "warn",
  "@typescript-eslint/switch-exhaustiveness-check": "warn",
}

export const recommended = defineConfig(
  ignores,
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: jsAndTsFiles,
    plugins: {
      sonarjs,
      unicorn,
      "de-morgan": deMorgan,
      "js-assistant": jsAssistantPlugin,
    },
    rules: sharedModernizationRules,
  },
  {
    files: tsFiles,
    rules: tsModernizationRules,
  },
)

export const typeChecked = defineConfig(
  ...recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: tsFiles,
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: typeAwareModernizationRules,
  },
)

export default recommended
