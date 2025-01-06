// The API key should be set from the environment variable
const apiKey = import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT;

// Handle user input and send it to the AI API
async function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === '') return;

    addMessageToChat('User', userInput);
    document.getElementById('user-input').value = '';

    // Predefined responses for specific questions
    if (/who made you|who created you|who built you/i.test(userInput)) {
        const botResponse = "Arnav Angarkar made me.";
        addMessageToChat('ArnavAI', botResponse);
        return;
    }

    if (/who is arnav|tell me about arnav|anything about arnav/i.test(userInput)) {
        const botResponse = "Arnav Angarkar is a first-year student at IIIT Dharwad and is 18 years old.";
        addMessageToChat('ArnavAI', botResponse);
        return;
    }

    try {
        // Send input to AI model for dynamic responses
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
        let botResponse = data.candidates[0].content.parts[0].text || "Sorry, I couldn't generate a response.";

        // Format any code blocks within the response
        botResponse = formatCodeBlocks(botResponse);

        addMessageToChat('ArnavAI', botResponse);
    } catch (error) {
        console.log(error);
        addMessageToChat('ArnavAI', 'Sorry - Something went wrong. Please try again!');
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

// Function to format code blocks with indentation
function formatCodeBlocks(text) {
    // Match code blocks between triple backticks
    return text.replace(/```([\s\S]*?)```/g, function (match, code) {
        return `<pre><code>${escapeHTML(code)}</code></pre>`;
    });
}

// Escape HTML tags to preserve formatting
function escapeHTML(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Ensure `sendMessage` is accessible globally
window.sendMessage = sendMessage;
