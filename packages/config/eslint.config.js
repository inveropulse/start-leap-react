import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export const createESLintConfig = (options = {}) => {
  const baseConfig = tseslint.config(
    { ignores: ["dist", "node_modules", "build", ".nx", "coverage"] },
    {
      extends: [js.configs.recommended, ...tseslint.configs.recommended],
      files: ["**/*.{ts,tsx,js,jsx}"],
      languageOptions: {
        ecmaVersion: 2020,
        globals: globals.browser,
      },
      plugins: {
        "react-hooks": reactHooks,
        "react-refresh": reactRefresh,
      },
      rules: {
        ...reactHooks.configs.recommended.rules,
        "react-refresh/only-export-components": [
          "warn",
          { allowConstantExport: true },
        ],
        // Enterprise-grade rules
        "@typescript-eslint/no-unused-vars": ["error", { 
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_" 
        }],
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/consistent-type-imports": "error",
        "@typescript-eslint/prefer-nullish-coalescing": "error",
        "@typescript-eslint/prefer-optional-chain": "error",
        "@typescript-eslint/no-unnecessary-condition": "warn",
        
        // Code quality
        "prefer-const": "error",
        "no-var": "error",
        "no-console": ["warn", { allow: ["warn", "error"] }],
        "eqeqeq": ["error", "always"],
        "curly": ["error", "all"],
        
        // Import organization
        "sort-imports": ["error", {
          ignoreCase: false,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
          allowSeparatedGroups: true,
        }],
      },
    }
  );

  return baseConfig;
};

export default createESLintConfig();