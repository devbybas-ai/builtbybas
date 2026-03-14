import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // Eight Pillars enforcement — Security Minded (Pillar 1)
  {
    rules: {
      // No console.log in production code (allow warn/error)
      "no-console": ["error", { allow: ["warn", "error"] }],
      // No eval()
      "no-eval": "error",
      // No Function() constructor, document.write(), innerHTML assignment
      "no-restricted-syntax": [
        "error",
        {
          selector: "NewExpression[callee.name='Function']",
          message: "Function() constructor is prohibited (Pillar 1: Security Minded).",
        },
        {
          selector: "CallExpression[callee.object.name='document'][callee.property.name='write']",
          message: "document.write() is prohibited (Pillar 1: Security Minded).",
        },
        {
          selector: "AssignmentExpression[left.property.name='innerHTML']",
          message: "innerHTML assignment is prohibited (Pillar 1: Security Minded).",
        },
      ],
      // No dangerouslySetInnerHTML
      "no-restricted-properties": [
        "error",
        {
          property: "dangerouslySetInnerHTML",
          message: "dangerouslySetInnerHTML is prohibited (Pillar 1: Security Minded).",
        },
      ],
    },
  },
  // Allow console in test files (test infrastructure may use it)
  {
    files: ["**/*.test.ts", "**/*.test.tsx"],
    rules: {
      "no-console": "off",
    },
  },
]);

export default eslintConfig;
