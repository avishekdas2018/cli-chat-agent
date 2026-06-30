import express from "express";
import cors from "cors";
import { generate } from "./chatbot.ts";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  console.log("Message", message);

  // Pass an object matching generate's signature
  const result = await generate({ userMessage: message });

  res.json({ message: result });
});

app.listen(PORT, () => {
  console.log(`Server is running on: ${PORT}`);
});
