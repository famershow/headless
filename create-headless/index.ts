#!/usr/bin/env node

import { projectName, intro, outro, template } from "./src/steps";

async function main() {
  intro();
  const name = String(await projectName());
  await template(name);
  outro(name);
}

main();
