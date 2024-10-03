
import { anthropic } from "./anthropic";


export async function transformContentToCleanMd(content: string) {
  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    messages: [{ role: "user", content }],
    system:
      "Your goal is to extract the main content from possibly polluted markdown and output it as MD to the \"finish\" tool\n" +
      "Do not output anything else.",
    max_tokens: 4096,
    tool_choice: { type: "tool", name: "finish" },
    tools: [{
      name: "finish",
      input_schema: {
        type: "object",
        properties: {
          md: {
            type: "string",
            description: "The markdown content",
          },
        },
        required: ["md"],
      },
      description: "Finish the job",
    }]
  });

  console.log(response);

  if (response.content[0].type !== "tool_use") {
    throw new Error("No tool use found");
  }

  const message = (response.content[0].input as any).md;

  return message;
}
