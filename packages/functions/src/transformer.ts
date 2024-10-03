import { anthropic } from "./anthropic";


export async function transformContentToCleanMd(content: string) {
  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    messages: [{ role: "user", content }],
    stream: true,
    system:
      "Your goal is to extract the main content from possibly polluted markdown and output it to a code block with md type\n" +
      "for example, ```md\n" +
      "## Article Title\n" +
      "This is a test.\n" +
      "```\n" +
      "Do not output anything else.",
    max_tokens: 4096,
  });

  const stream = new ReadableStream({
    async start(controller) {
      let text = "";
      for await (const chunk of response) {
        if (chunk.type !== "content_block_delta") continue;
        if (chunk.delta.type !== "text_delta") continue;

        text += chunk.delta.text;
        if (
          text.includes("```md") &&
          !text.replace("```md", "").includes("```")
        ) {
          controller.enqueue(text);
        }
      }
      controller.close();
    },
  });

  return stream;
}
