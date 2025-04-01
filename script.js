const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
let userMessage;

// Your Gemini API key and endpoint
const API_KEY = "AIzaSyDCuLcJ51rwmKmVrcQ0ZzdUOrib3YRYV54"; // Replace with your actual API key
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${API_KEY}`;

// Function to create a chat message element
const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent =
    className === "outgoing"
      ? `<p>${message}</p>`
      : `<span class="material-symbols-outlined">smart_toy</span><p>${message}</p>`;
  chatLi.innerHTML = chatContent;
  return chatLi;
};

// Function to generate a response from the Gemini API
const generateResponse = async (userMessage) => {
    try {
      const requestBody = {
        contents: [{ parts: [{ text: userMessage }] }]
      };
  
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
          // Authorization header is not needed when API key is in the URL
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch response from Gemini API: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      // Extract the text content from the response object
      const botMessage = data.candidates[0]?.content?.parts[0]?.text || "Sorry, I couldn't process your request.";
      return botMessage;
    } catch (error) {
      console.error("Error:", error);
      return "An error occurred while fetching the response. Please try again later.";
    }
  };
  

// Function to handle user input and bot response
const handleChat = async () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return; // Do nothing if input is empty

  // Add user's message to the chatbox
  chatbox.appendChild(createChatLi(userMessage, "outgoing"));
  chatInput.value = ""; // Clear the input field

  // Simulate a bot thinking message
  const thinkingMessage = createChatLi("thinking...", "incoming");
  chatbox.appendChild(thinkingMessage);
  chatbox.scrollTop = chatbox.scrollHeight; // Scroll to the bottom

  // Get the bot's response from the Gemini API
  const botMessage = await generateResponse(userMessage);

  // Replace the "thinking..." message with the actual bot response
  thinkingMessage.remove();
  chatbox.appendChild(createChatLi(botMessage, "incoming"));
  chatbox.scrollTop = chatbox.scrollHeight; // Scroll to the bottom
};

// Add event listener for the send button
sendChatBtn.addEventListener("click", handleChat);

// Add event listener for the "Enter" key
chatInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault(); // Prevent newline
    handleChat();
  }
});
