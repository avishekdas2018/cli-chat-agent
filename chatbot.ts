import "dotenv/config"
import readline from 'node:readline/promises';

import { Groq } from 'groq-sdk';
import { tavily } from '@tavily/core';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
const tavilyInstance = tavily({ apiKey: process.env.TAVILY_API_KEY })


export async function generate({ userMessage }: { userMessage: string }) {
  // const readLineInterface = readline.createInterface({ input: process.stdin, output: process.stdout })
  const messages = [
    {
      role: "system",
      content: `You are a smart personal assistant.
                    If you know the answer to a question, answer it directly in plain English.
                    If the answer requires real-time, local, or up-to-date information, or if you don’t know the answer, use the available tools to find it.
                    You have access to the following tool:
                    webSearch(query: string): Use this to search the internet for current or unknown information.
                    Decide when to use your own knowledge and when to use the tool.
                    Do not mention the tool unless needed.
                    Examples:
                    Q: What is the capital of France?
                    A: The capital of France is Paris.
                    Q: What’s the weather in Mumbai right now?
                    A: (use the search tool to find the latest weather
                    Do not use markdown syntax in responses (no **, ##, |, -, etc).
                    For tabular data, use plain-text alignment with fixed-width columns
                    and spaces, like:
                    Temperature    27.1°C (80.8°F)
                    Feels-like     29.3°C (84.8°F)
                    Condition      Mist (overcast)
                    Use line breaks and indentation instead of bullet points or headers.)
                    Q: Who is the Prime Minister of India?
                    A: The current Prime Minister of India is Narendra Modi.
                    Q: Tell me the latest IT news.
                    A: (use the search tool to get the latest news)
                    current date and time: ${new Date().toUTCString()}`
    },

    // {
    //   role: "user",
    //   content: "What is current weather in Kolkata?"
    // }
  ]

  // const question = await readLineInterface.question('You: ')
  messages.push({
    role: "user",
    content: userMessage
  })

  // if (question === "bye") {
  //   break;
  // }

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
      return completion.choices[0]?.message.content
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

  // readLineInterface.close()
}




async function searchWeb({ query }: { query: string }) {
  console.log("Wait! I am searching the web...");

  const response = await tavilyInstance.search(query)
  // console.log(response);

  const finalResult = response.results.map((result) => result.content).join("/n/n")


  return finalResult
}

