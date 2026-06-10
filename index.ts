import "dotenv/config"

import { Groq } from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

async function main() {
  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    temperature: 0,
    tools: [
      {
        "type": "function",
        "function": {
          "name": "searchWeb",
          "description": "Search the internet and find latest infomations and real-time data",
          "parameters": {
            // JSON Schema object
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
    messages: [
      {
        role: "system",
        content: `You are very helpfull personal assistant. You always answer asked questions.
        You have access following tools:
        1. searchWeb({ query }: { query: string}) // Search the internet and find latest infomations and real-time data`
      },

      {
        role: "user",
        content: "When was iPhone 16 launched?"
      }
    ],


    tool_choice: "auto",

  })

  const toolCalls = completion.choices[0]?.message.tool_calls

  if (!toolCalls) {
    console.log(`Assistant: ${completion.choices[0]?.message.content}`);
    return;
  }

  for (const tool of toolCalls) {
    console.log('tool ', tool);

    const functionName = tool.function.name
    const functionParams = tool.function.arguments

    if (functionName === "searchWeb") {
      const toolResult = await searchWeb(JSON.parse(functionParams))
      console.log('Tool Result ', toolResult);
    }
  }


  // console.log(JSON.stringify(completion.choices[0]?.message, null, 2));
}

main()


async function searchWeb({ query }: { query: string }) {
  console.log("Call searchWeb...");

  return "iPhone was launched in 2024"
}
