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

// Add the following:
new typescript.TypeScriptAppProject({
  parent: project,
  name: "typescript-data-app",
  defaultReleaseBranch: "main",
  outdir: "data-app",
  packageManager: project.package.packageManager,
});

// This MUST be last and only called once
project.synth();
