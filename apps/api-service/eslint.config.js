import { config as baseConfig } from "@telegram-clone/eslint-config/service";

export default [
  ...baseConfig,
  {
    rules: {
      // Add stricter or looser rules for this app
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
