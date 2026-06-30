const input = document.querySelector("#input");
const chatContainer = document.querySelector("#chat-container");
const sendBtn = document.querySelector("#send");
console.log(input);

input.addEventListener("keyup", handleSubmitMessage);
sendBtn.addEventListener("click", handleClick);

async function generate(text) {
  /**
   * 1. Append message to UI
   * 2. Send it to the LLM
   * 3. Append response to UI
   */

  const msg = document.createElement("div");
  msg.className = `my-6 bg-[#2B2B2B] p-3 rounded-full ml-auto max-w-fit`;
  msg.textContent = text;
  chatContainer.appendChild(msg);
  input.value = "";

  // Call server
  const assistantMessage = await callServer(text);
  // const parserdAssistantMessage = marked.parse(assistantMessage);

  const assistantMessageElement = document.createElement("div");
  assistantMessageElement.className = `max-w-fit p-2 prose prose-invert`;
  assistantMessageElement.textContent = assistantMessage;
  chatContainer.appendChild(assistantMessageElement);
  input.value = "";
}

const callServer = async (inputText) => {
  const response = await fetch("http://localhost:3000/chat", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },

    body: JSON.stringify({ message: inputText }),
  });

  if (!response.ok) {
    throw new Error("Error in generation!");
  }

  const output = await response.json();
  return output.message;
};

async function handleClick() {
  const text = input.value.trim();
  if (!text) {
    return;
  }

  await generate(text);
}

async function handleSubmitMessage(e) {
  if (e.key === "Enter") {
    const text = input.value.trim();

    if (!text) {
      return;
    }
    await generate(text);
    console.log(text);
  }
}
