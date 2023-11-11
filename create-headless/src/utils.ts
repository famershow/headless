import { isCancel, cancel as clackCancel } from "@clack/prompts";
import { cancelMessages } from "./consts";
import { adjectives, nouns } from "~/consts";

export function cancel(value: any) {
  if (isCancel(value)) {
    clackCancel(
      cancelMessages[Math.floor(Math.random() * cancelMessages.length)]
    );
    process.exit(0);
  }
}

export function generateName(): string {
  const randomAdjective: string =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomName: string = nouns[Math.floor(Math.random() * nouns.length)];

  return `${randomAdjective}-${randomName}`;
}
