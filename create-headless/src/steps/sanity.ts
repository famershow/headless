import { confirm } from "@clack/prompts";
import type { Context } from "~/types";
import { cancel } from "~/utils";
import execa from "execa";

async function initSanity(cwd: string) {
  // TODO: dynamically set the package manager

  await execa("sanity", ["init", "--env"], {
    cwd,
    stdio: "inherit",
  });
}

export default async function sanity(ctx: Context) {
  const sanity_confirm = await confirm({
    message: "This template uses Sanity, should we init Sanity now?",
  });

  cancel(sanity_confirm);

  if (Boolean(sanity_confirm)) {
    await initSanity(ctx.name);
  }
}
