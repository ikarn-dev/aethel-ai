import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable TypeScript any type restrictions
      "@typescript-eslint/no-explicit-any": "off",
      
      // Disable unused variables warnings
      "@typescript-eslint/no-unused-vars": "off",
      
      // Disable React hooks exhaustive deps warnings
      "react-hooks/exhaustive-deps": "off",
      
      // Disable React hooks rules of hooks errors
      "react-hooks/rules-of-hooks": "off",
      
      // Disable React unescaped entities
      "react/no-unescaped-entities": "off",
    },
  },
];

export default eslintConfig;
