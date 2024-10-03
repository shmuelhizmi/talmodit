/**
 * Research flow:
 * you will be given a quote and a context
 *
 */

import { z } from "zod";
import { anthropic, langchainAnthropic } from "./anthropic";
import { PythonInterpreterTool } from "@langchain/community/experimental/tools/pyinterpreter";
import { zodToJsonSchema } from "zod-to-json-schema";
import { Tool } from "@anthropic-ai/sdk/resources/messages.mjs";
import { tool } from "@langchain/core/tools";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import axios from "axios";
import { loadPyodide } from "pyodide";

const perplexitySearch = tool(
  async ({ query }) => {
    const response = await axios.post("https://api.perplexity.ai/chat/completions", {
      model: "pplx-70b-online	",
      messages: [
        {
          role: "user",
          content: query,
        },
      ],
    });
    return response.data.choices[0].message.content;
  },
  {
    name: "perplexitySearch",
    description: "Search the internet for information",
    schema: z.object({
      query: z.string(),
    }),
  }
);

const prompt = ChatPromptTemplate.fromMessages([
  new SystemMessage(`
You will be given a quote and a context, and you need to research the quote in the context and output in-depth analysis of the quoted information.

in your disposal are the following tools:
- perplexity search - you can give it a query and it will do a search on the internet for relevant information, returning you a summary of the results and some reference links/documents.
- python interpreter - you can give it a python code and it will run the code and return the result.

use the tools only when necessary, use in parallel when possible.

\`\`\`md
# Gorge Washington

- Born: February 22, 1732
- Died: December 14, 1799
- Spouse: Martha Dandridge Custis
- Children: 6 (John, Martha, Frances, Charles, George, and William)

George Washington was...
\`\`\`
`),
  new HumanMessage(`
quote: {{quote}}
context
\`\`\`
{{context}}
\`\`\`
`),
]);

export async function researchText(quote: string, context: string) {
  const pyodide = await loadPyodide();
  const pythonInterpreter = new PythonInterpreterTool({
    instance: pyodide,
  });
  const agent = createToolCallingAgent({
    llm: langchainAnthropic,
    tools: [perplexitySearch, pythonInterpreter],
    prompt,
  });
  const executor = new AgentExecutor({
    agent,
    tools: [perplexitySearch, pythonInterpreter],
  });
  const response = await executor.invoke({
    quote,
    context,
  });
  return response;
}
