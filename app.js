// The API key should be set from the environment variable
const apiKey = import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT;

// Handle user input and send it to the AI API
async function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === '') return;

    addMessageToChat('User', userInput);
    document.getElementById('user-input').value = '';

    try {
        const conversation = getConversationHistory() + `User: ${userInput}\n`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: conversation }] }]
            })
        });

        const data = await response.json();
        const botResponse = data.candidates[0].content.parts[0].text || "Sorry, I couldn't generate a response.";

        // Ensure no references to Arnav or unrelated information
        const cleanResponse = botResponse.replace(/Arnav.*?\./g, ""); // Remove any mention of Arnav.

        addMessageToChat('Bot', cleanResponse);
    } catch (error) {
        console.log(error);
        addMessageToChat('Bot', 'Sorry - Something went wrong. Please try again!');
    }
}

// Append messages to the chatbox
function addMessageToChat(sender, message) {
    const chatMessages = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Retrieve conversation history
function getConversationHistory() {
    const chatMessages = document.getElementById('chat-messages').children;
    let conversation = '';
    for (let message of chatMessages) {
        conversation += `${message.innerText}\n`;
    }
    return conversation;
}

// Ensure `sendMessage` is accessible globally
window.sendMessage = sendMessage;
