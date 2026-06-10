import { Groq } from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

async function main() {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0,
    messages: [
      {
        role: "system",
        content: "You are very helpfull personal assistant. You always answer asked questions."
      },

      {
        role: "user",
        content: "When was iPhone 16 launched?"
      }
    ]
  })
  console.log(completion.choices[0]?.message);
}

main()

