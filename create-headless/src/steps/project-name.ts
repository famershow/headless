import { text } from "@clack/prompts";
import { directoryExists } from "./template";
import { adjectives, nouns } from "~/consts";
import { cancel } from "~/utils";

function generateName(): string {
  const randomAdjective: string =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomName: string = nouns[Math.floor(Math.random() * nouns.length)];

  return `${randomAdjective}-${randomName}`;
}

function isValidProjectName(projectName: string) {
  return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(
    projectName
  );
}

export default async function projectName() {
  const defaultValue = generateName();
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
