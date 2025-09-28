import { defineConfig } from "orval";

const baseURL = "http://localhost:5000";

const orvalConfig = defineConfig({
  queries: {
    input: {
      target: `${baseURL}/api/docs-yaml`,
      converterOptions: true,
    },
    output: {
      target: "../api/generated/queries.ts",
      prettier: true,
      schemas: "../api/generated",
      client: "react-query",
      override: {
        mutator: {
          path: "./axios.config.ts",
          name: "axiosInstance",
        },
      },
    },
    hooks: {
      afterAllFilesWrite: "eslint --fix",
    },
  },
});

export default orvalConfig;
