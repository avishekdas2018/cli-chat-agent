import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.post("/chat", (req, res) => {
  const { message } = req.body;

  console.log("Message", message);

  res.json({ message: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server is running on: ${PORT}`);
});
