#!/usr/bin/env node

import { projectName, intro, outro, template } from "./src/steps";

async function main() {
  intro();
  await template(String(await projectName()));
}

main().then(() => outro());
