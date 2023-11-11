import { outro as prompt_outro } from "@clack/prompts";
import { goodbyeMessages } from "~/consts";

export default function outro() {
  prompt_outro(
    goodbyeMessages[Math.floor(Math.random() * goodbyeMessages.length)]
  );
}
