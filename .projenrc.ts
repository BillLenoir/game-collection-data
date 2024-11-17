import { TmsTypeScriptAppProject } from "@10mi2/tms-projen-projects";
import { monorepo } from "@aws/pdk";
import { javascript } from "projen"; // <- change this line
import { TypeScriptModuleResolution } from "projen/lib/javascript";

const project = new monorepo.MonorepoTsProject({
  devDeps: ["@aws/pdk"],
  github: true,
  eslint: true,
  name: "projen7-tms",
  packageManager: javascript.NodePackageManager.NPM,
  prettier: true,
  projenrcTs: true,
  gitignore: ["game-collection-data.code-workspace"],
});

project.addDevDeps("@10mi2/tms-projen-projects");

const apollo = new TmsTypeScriptAppProject({
  parent: project,
  name: "apollo-server",
  defaultReleaseBranch: "main",
  outdir: "apollo",
  packageManager: project.package.packageManager,
  esmSupportConfig: true,
  tsconfigBaseStrictest: true,
  tsconfig: {
    compilerOptions: {
      // exactOptionalPropertyTypes is too heavy handed, conflicts with prisma and pothos generated code
      exactOptionalPropertyTypes: false,
      // noPropertyAccessFromIndexSignature is too heavy handed as well
      noPropertyAccessFromIndexSignature: false,
    },
  },
  tsconfigDev: {
    compilerOptions: {
      esModuleInterop: true,
      exactOptionalPropertyTypes: false,
      noPropertyAccessFromIndexSignature: false,
    },
  },
});

apollo.addDeps(
  "@tsconfig/node18",
  "@apollo/server",
  "graphql",
  "zod",
  "@prisma/client",
);
apollo.addDevDeps(
  "nodemon",
  "@graphql-codegen/cli",
  "@graphql-codegen/typescript-resolvers",
  "@graphql-codegen/typescript",
  "prisma",
);
apollo.tasks.addTask("start:dev", {
  description: "Start the server in development mode",
  exec: "nodemon src/index.ts",
});

const data = new TmsTypeScriptAppProject({
  parent: project,
  name: "typescript-data-app",
  defaultReleaseBranch: "main",
  outdir: "data-app",
  packageManager: project.package.packageManager,
  tsconfig: {
    compilerOptions: {
      // exactOptionalPropertyTypes is too heavy handed, conflicts with prisma and pothos generated code
      exactOptionalPropertyTypes: false,
      // noPropertyAccessFromIndexSignature is too heavy handed as well
      noPropertyAccessFromIndexSignature: false,
      alwaysStrict: undefined,
      declaration: undefined,
      esModuleInterop: true,
      experimentalDecorators: undefined,
      inlineSourceMap: undefined,
      inlineSources: undefined,
      lib: ["es2022"],
      module: "es2022",
      moduleResolution: TypeScriptModuleResolution.NODE,
      noEmitOnError: undefined,
      noFallthroughCasesInSwitch: undefined,
      noImplicitAny: undefined,
      noImplicitReturns: undefined,
      noImplicitThis: undefined,
      noUncheckedIndexedAccess: true,
      noUnusedLocals: undefined,
      noUnusedParameters: undefined,
      resolveJsonModule: undefined,
      strict: undefined,
      strictNullChecks: undefined,
      strictPropertyInitialization: undefined,
      stripInternal: undefined,
      target: "es2022",
      // moduleResolution: javascript.TypeScriptModuleResolution.BUNDLER,
      noEmit: true,
      verbatimModuleSyntax: false,
    },
  },
  tsconfigDev: {
    compilerOptions: {
      esModuleInterop: true,
      exactOptionalPropertyTypes: false,
      noPropertyAccessFromIndexSignature: false,
    },
  },
  gitignore: ["src/data/*", ".env", "prisma/*.db"],
});

data.addDeps("node-fetch", "@prisma/client", "xml-js", "zod");
data.addDevDeps("prisma");

// This MUST be last and only called once
project.synth();
