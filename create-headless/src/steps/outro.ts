import { note, outro as prompt_outro } from "@clack/prompts";
import { goodbyeMessages } from "~/consts";
import colors from "picocolors";

export default function outro(dir: string) {
  note(`cd ./${dir}\nFor more info ${colors.cyan("https://headless.build")}`);

  prompt_outro(
    goodbyeMessages[Math.floor(Math.random() * goodbyeMessages.length)]
  );
}
