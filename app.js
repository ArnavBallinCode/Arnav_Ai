// The API key should be set from the environment variable
const apiKey = import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT;

async function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === '') return;

    addMessageToChat('User', userInput);
    document.getElementById('user-input').value = '';

    const conversation = getConversationHistory() + `User: ${userInput}\n`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: conversation + " Don't add any prefixes like agent: , assistant: , etc to your response just give response that's it" }] }]
            })
        });
        const data = await response.json();
        const botResponse = data.candidates[0].content.parts[0].text;

        addMessageToChat('Arnav_AI', botResponse);
    } catch (error) {
        console.log(error);
        addMessageToChat('Arnav_AI', 'Sorry - Something went wrong. Please try again!');
    }
}

function addMessageToChat(sender, message) {
    const chatMessages = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getConversationHistory() {
    const chatMessages = document.getElementById('chat-messages').children;
    let conversation = '';
    for (let message of chatMessages) {
        conversation += `${message.innerText}\n`;
    }
    return conversation;
}
