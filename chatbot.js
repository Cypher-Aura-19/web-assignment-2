function displayMessage(text, sender) {
  const chatContainer = document.getElementById("chat-container");
  const messageDiv = document.createElement("div");
  messageDiv.classList.add(
    "flex",
    sender === "user" ? "justify-end" : "justify-start",
    "items-center",
    "space-x-2"
  );

  const messageContent = `
        <div class="flex ${
          sender === "user" ? "flex-row-reverse" : ""
        } items-start space-x-3 mb-4">
            <img class="w-8 h-8 rounded-full" src="${
              sender === "user" ? "user.png" : "bot.avif"
            }" alt="${sender}" />
            <div class="p-3 rounded-lg max-w-xs text-white shadow-lg ${
              sender === "user"
                ? "bg-gradient-to-r from-blue-500 to-blue-700"
                : "bg-gradient-to-r from-gray-500 to-gray-700"
            }">
                <div class="font-semibold mb-1">${
                  sender === "user" ? "You" : "WeatherBot"
                }</div>
                <div class="whitespace-pre-wrap">${text}</div>
            </div>
        </div>
    `;

  messageDiv.innerHTML = messageContent;
  chatContainer.appendChild(messageDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function disableSendButton(disable) {
  const sendButton = document.getElementById("sendButton");
  sendButton.disabled = disable;
}

async function sendRequest(userInput) {
  const requestBody = {
    contents: [
      {
        role: "model",
        parts: [
          {
            text: "You are WeatherBot, an assistant that provides weather updates based on location.",
          },
        ],
      },
      {
        role: "user",
        parts: [
          {
            text: "Hello! Welcome to WeatherBot. Please provide the name of a city, and I will give you the latest weather updates.",
          },
        ],
      },
      {
        role: "user",
        parts: [
          {
            text: "What's the weather in New York?",
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "The weather in New York is currently cloudy with a chance of rain and a temperature of 22°C.",
          },
        ],
      },
      {
        role: "user",
        parts: [
          {
            text: "Will it rain in Tokyo tomorrow?",
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Yes, it's expected to rain in Tokyo tomorrow. Make sure to carry an umbrella!",
          },
        ],
      },
      {
        role: "user",
        parts: [
          {
            text: `Can you tell me the weather in Paris?`,
          },
        ],
      },
      {
        role: "user",
        parts: [
          {
            text: `input: ${userInput}`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      topK: 1,
      topP: 1,
      maxOutputTokens: 500,
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
    ],
  };

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyCKI97Sz1RPsfF5AxTYW4CojWR_jvTOj-8`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to fetch response");
    }

    const data = await response.json();
    if (data && data.candidates && data.candidates.length > 0) {
      const botResponse = data.candidates[0].content.parts[0].text;
      return botResponse;
    } else {
      throw new Error("Unexpected response structure");
    }
  } catch (error) {
    console.error("Error:", error);
    return "Sorry, there was an error fetching the weather information.";
  }
}

document.getElementById("sendButton").addEventListener("click", async () => {
  const userInputElement = document.getElementById("userInput");
  const userInput = userInputElement.value;

  if (userInput) {
    displayMessage(userInput, "user");
    disableSendButton(true);

    try {
      const botResponse = await sendRequest(userInput);

      displayMessage(botResponse, "bot");
    } catch (error) {
      console.error("Error:", error);
      displayMessage(
        "Sorry, there was an error fetching the weather information.",
        "bot"
      );
    }

    userInputElement.value = "";
    disableSendButton(false);
  }
});
