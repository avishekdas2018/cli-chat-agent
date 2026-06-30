const input = document.querySelector("#input");
const chatContainer = document.querySelector("#chat-container");
const sendBtn = document.querySelector("#send");
console.log(input);

input.addEventListener("keyup", handleSubmitMessage);
sendBtn.addEventListener("click", handleClick);

function generate(text) {
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
}

function handleClick() {
  const text = input.value.trim();
  if (!text) {
    return;
  }

  generate(text);
}

function handleSubmitMessage(e) {
  if (e.key === "Enter") {
    const text = input.value.trim();

    if (!text) {
      return;
    }
    generate(text);
    console.log(text);
  }
}
