import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPrettierRecommended from "eslint-plugin-prettier/recommended";

export default tseslint.config(
  {
    ignores: [
      "docker-data/*",
      "node_modules",
      ".turbo",
      "web/.next",
      "web/components/ui",
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPrettierRecommended,
  {
    rules: {
      "prettier/prettier": [
        "error",
        {
          trailingComma: "es5",
        },
      ],
    },
  }
);
