import "dotenv/config"
import readline from 'node:readline/promises';

import { Groq } from 'groq-sdk';
import { tavily } from '@tavily/core';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
const tavilyInstance = tavily({ apiKey: process.env.TAVILY_API_KEY })


async function main() {

  const messages = [
    {
      role: "system",
      content: `You are very helpfull personal assistant. You always answer asked questions.
        You have access following tools:
        1. searchWeb({ query }: { query: string}) // Search the internet and find latest infomations and real-time data`
    },

    {
      role: "user",
      content: "What is current weather in Kolkata?"
    }
  ]


  while (true) {
    while (true) {
      const completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",
        temperature: 0,
        tools: [
          {
            "type": "function",
            "function": {
              "name": "searchWeb",
              "description": "Search the internet and find latest infomations and real-time data",
              "parameters": {
                "type": "object",
                "properties": {
                  "query": {
                    "type": "string",
                    "description": "The search query is to search on the web"
                  },
                },
                "required": ["query"]
              }
            }
          }
        ],

        messages: messages,


        tool_choice: "auto",

      })

      const toolCalls = completion.choices[0]?.message.tool_calls

      if (!toolCalls) {
        console.log(`Assistant: ${completion.choices[0]?.message.content}`);
        break;
      }

      for (const tool of toolCalls) {
        // console.log('tool ', tool);

        const functionName = tool.function.name
        const functionParams = tool.function.arguments

        if (functionName === "searchWeb") {
          const toolResult = await searchWeb(JSON.parse(functionParams))
          // console.log('Tool Result ', toolResult);

          messages.push({
            tool_call_id: tool.id,
            role: "tool",
            name: functionName,
            content: toolResult

          })
        }
      }
    }
  }
}

main()


async function searchWeb({ query }: { query: string }) {
  console.log("Call searchWeb...");

  const response = await tavilyInstance.search(query)
  // console.log(response);

  const finalResult = response.results.map((result) => result.content).join("/n/n")


  return finalResult
}

