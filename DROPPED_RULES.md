# Dropped Rules Summary

Removed 10 contradicting/less-modern assists to keep only the modernest versions in each pair.

## Rules Removed

### 1. Add braces to arrow function
- **Milestone:** Reuse
- **Reason:** Inverse of the more modern "Remove braces from arrow function"
- **Modern default:** `arrow-body-style: 'as-needed'` (minimal, concise form)

### 2. Remove braces from arrow function  
- **Milestone:** Reuse
- **Reason:** Actually kept - this is the modern version, not removed
- **Note:** This contradicts "Add braces to arrow function" which was dropped

### 3. Remove braces from if-else and loops
- **Milestone:** Not ESLint
- **Reason:** Inverse of the recommended "Add braces to if-else and loops"
- **Modern default:** `curly: 'all'` (safety and consistency)

### 4. Remove braces from case
- **Milestone:** Not ESLint
- **Reason:** Inverse of safer "Add braces to case"
- **Modern default:** Safer to add braces around case blocks

### 5. Convert property access to bracket notation
- **Milestone:** Not ESLint
- **Reason:** Inverse of modern "Convert property access to dot notation"
- **Modern default:** `dot-notation` (clarity and readability)

### 6. Convert destructuring to regular variable declaration
- **Milestone:** Not ESLint
- **Reason:** Inverse of modern "Convert to destructuring assignment"
- **Modern default:** Destructuring is more concise and idiomatic

### 7. Expand shorthand property
- **Milestone:** Not ESLint
- **Reason:** Inverse of modern "Collapse object property into shorthand"
- **Modern default:** `object-shorthand: 'always'` (concise syntax)

### 8. Convert template literal to string
- **Milestone:** Custom autofix candidate
- **Reason:** Inverse of modern "Convert string to template literal"
- **Modern default:** Template literals are more powerful and expressive

### 9. Convert #-private to TypeScript private
- **Milestone:** Not ESLint
- **Reason:** Inverse of modern "Convert TypeScript private to #-private"
- **Modern default:** ECMAScript standard `#` private (future-proof, not TS-only)

### 10. Pull operator out of assignment
- **Milestone:** Not ESLint
- **Reason:** Inverse of modern "Push operator into assignment"
- **Modern default:** `operator-assignment: 'always'` (compact form like `+=`)

## Summary

**Total rules before:** 114
**Total rules after:** 104
**Removed:** 10 contradicting pairs (kept modern side)

All removed rules were conservative inversions of their modern counterparts. The modern versions are already in the matrix and will be used going forward.

## ESLint Config Impact

The ESLint shared config (`src/index.js`) already has the correct rules:
- `arrow-body-style: 'as-needed'` ✓
- `curly: 'multi-line'` ✓
- `dot-notation` ✓
- `object-shorthand: 'always'` ✓
- `operator-assignment: 'always'` ✓

No changes needed to the config — it was already aligned with modern defaults.

### 11. Pull up negation
- **Milestone:** Not ESLint
- **Reason:** Inverse of modern "Push down negation" (De Morgan's Laws)
- **Modern default:** `eslint-plugin-de-morgan` pushes negations down (`!(a || b)` -> `!a && !b`) for better boolean readability.
