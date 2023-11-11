import { text } from "@clack/prompts";
import { directoryExists } from "./template";
import { cancel } from "~/utils";
import { Context } from "~/types";

function isValidProjectName(projectName: string) {
  return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(
    projectName
  );
}

export default async function projectName(ctx: Context) {
  const { name: defaultValue } = ctx;
  const name = await text({
    message: "Where do you want the project?",
    initialValue: defaultValue,
    defaultValue,
    validate(value) {
      if (directoryExists(String(value))) {
        return "Already taken sorry :(";
      } else if (!isValidProjectName(value)) {
        return "Invalid project name :(";
      }
    },
  });

  cancel(name);

  return name;
}
