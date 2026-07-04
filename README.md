# JS Assistant ESLint Migration

This repository tracks a JS/TS-only migration path from P42 JS Assistant code assists to team-wide ESLint rules.

Milestone 1 is implemented as a shared ESLint flat config that reuses existing ecosystem rules before adding custom rules.

## Docs

- [Rule matrix](docs/rule-matrix.html) – interactive table with filtering by milestone 1 status

## Usage

Install this package with its peer dependencies, then use it from an ESLint flat config:

```js
import jsAssistant from "@upfluence/eslint-config-js-assistant";

export default [
  ...jsAssistant
];
```

For type-aware TypeScript modernization rules:

```js
import { typeChecked } from "@upfluence/eslint-config-js-assistant";

export default [
  ...typeChecked
];
```

The type-aware config enables parser project service and expects the consuming project to have a valid TypeScript setup.

## Milestone 1 Scope

Milestone 1 intentionally avoids custom transforms. It wires rules from:

- ESLint core
- `typescript-eslint`
- `eslint-plugin-unicorn`
- `eslint-plugin-sonarjs`

Structural refactors, cursor-driven assists, movement actions, and risky rewrites remain documented as future custom suggestion rules or non-ESLint actions.

## Regenerate Docs

```sh
npm run build:docs
```
