import { monorepo } from "@aws/pdk";
import { javascript, typescript } from "projen"; // <- change this line

const project = new monorepo.MonorepoTsProject({
  devDeps: ["@aws/pdk"],
  github: true,
  eslint: true,
  name: "projen7-tms",
  packageManager: javascript.NodePackageManager.NPM,
  prettier: true,
  projenrcTs: true,
});

project.addDevDeps("@10mi2/tms-projen-projects");

const data = new typescript.TypeScriptAppProject({
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
    },
  },
  tsconfigDev: {
    compilerOptions: {
      esModuleInterop: true,
      exactOptionalPropertyTypes: false,
      noPropertyAccessFromIndexSignature: false,
    },
  },
  gitignore: ["src/data/*"],
});

data.addDeps("node-fetch", "@prisma/client", "xml-js", "zod");
data.addDevDeps("prisma");

// This MUST be last and only called once
project.synth();
