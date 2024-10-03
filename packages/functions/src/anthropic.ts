import { Anthropic } from "@anthropic-ai/sdk";
import {
  Message,
  RawMessageStreamEvent,
} from "@anthropic-ai/sdk/resources/messages.mjs";
import { Stream } from "@anthropic-ai/sdk/streaming.mjs";
import { ChatAnthropic } from "@langchain/anthropic";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const langchainAnthropic = new ChatAnthropic({
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  model: "claude-3-5-sonnet-20240620",
});



export function onlyMdBlock(stream: Stream<RawMessageStreamEvent> & Message) {
  let total = "";
  const output = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (chunk.type !== "content_block_delta") continue;
        if (chunk.delta.type !== "text_delta") continue;
        total += chunk.delta.text;
        if (
          // check if total has ```md and doesn't have ```
          total.includes("```md") &&
          !total.replace("```md", "").includes("```")
        ) {
          controller.enqueue(total);
        }
      }
    },
  });

  return output;
}
