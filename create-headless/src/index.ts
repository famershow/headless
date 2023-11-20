#!/usr/bin/env node

import steps from "~/steps";
import { Context } from "~/types";
import { generateName } from "~/utils";

const main = async (ctx: Context = { name: generateName() }) => {
  for (const step of steps) {
    await step(ctx);
  }
};

main();
