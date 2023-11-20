import { note, outro as prompt_outro } from "@clack/prompts";
import { goodbyeMessages } from "~/consts";
import colors from "picocolors";
import { Context } from "~/types";

export default async function outro(ctx: Context) {
  const { name } = ctx;
  note(
    [
      `1. Go to: ${colors.cyan(`cd ./${name}`)}`,
      `2. For a new sanity project run: ${colors.cyan(
        "npx sanity@latest init --env"
      )}`,
      `For more info ${colors.cyan("https://headless.build")}`,
    ].join("\n"),
    "Next steps"
  );

  prompt_outro(
    goodbyeMessages[Math.floor(Math.random() * goodbyeMessages.length)]
  );
}
