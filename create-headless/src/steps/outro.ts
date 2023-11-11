import { note, outro as prompt_outro } from "@clack/prompts";
import { goodbyeMessages } from "~/consts";
import colors from "picocolors";
import { Context } from "~/types";

export default async function outro(ctx: Context) {
  const { name } = ctx;
  note(
    `cd ./${name}\nFor more info ${colors.cyan("https://headless.build")}`,
    "Next steps"
  );

  prompt_outro(
    goodbyeMessages[Math.floor(Math.random() * goodbyeMessages.length)]
  );
}
