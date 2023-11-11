import { intro as prompt_intro } from "@clack/prompts";
import { welcomeMessages } from "~/consts";

export default function intro() {
  prompt_intro(
    welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)]
  );
}
