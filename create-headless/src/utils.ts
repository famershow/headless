import { isCancel, cancel as clackCancel } from "@clack/prompts";
import { cancelMessages } from "./consts";

export function cancel(value: any) {
  if (isCancel(value)) {
    clackCancel(
      cancelMessages[Math.floor(Math.random() * cancelMessages.length)]
    );
    process.exit(0);
  }
}
