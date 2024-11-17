import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./src/schema.graphql",
  generates: {
    "./src/resolvers-types.ts": {
      config: {
        useIndexSignature: true,
      },
      plugins: ["typescript", "typescript-resolvers"],
    },
  },
  hooks: {
    afterAllFileWrite: [
      "prettier --write",
      "eslint --fix --no-error-on-unmatched-pattern",
    ],
  },
};
export default config;
