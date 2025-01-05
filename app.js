// The API key should be set from the environment variable
const apiKey = import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT;

async function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === '') return;

    addMessageToChat('User', userInput);
    document.getElementById('user-input').value = '';

    const conversation = getConversationHistory() + `User: ${userInput}\n`;

    // Check for specific queries and provide customized responses
    if (/who are you/i.test(userInput)) {
        const botResponse = "I am an AI / LLM based bot created by Arnav.";
        addMessageToChat('Arnav_AI', botResponse);
        return;
    }

    if (/tell me about arnav|who is arnav|anything about arnav/i.test(userInput)) {
        const botResponse = `Arnav Amit Angarkar is a first-year Computer Science student at IIIT Dharwad. He has a strong interest in AI, ML, data science, backend and frontend development, full-stack development, and Web3 technologies.

He has completed several certifications, including Harvard's CS50x, and has worked on multiple projects such as:
- Health Hub 360 - A digital health platform built with Flask and Jinja.
- AutoML-MLOps Platform Prototype - A scalable solution for automating machine learning workflows.
- Binary Classification Model App - A web application using Streamlit for machine learning model selection and visualization.
- BMP Image Filter - A command-line tool in C for applying image filters.
- JPEG Recovery Tool - A C program to recover JPEG files from forensic images.
- MongoDB API Backend - An in-progress project for upsert operations in MongoDB.

Arnav has also participated in a national-level hackathon (Hack2Future), where his team received a special mention. He interned at Brahmand - Vishwakosha, working on a space exploration website and an AI-based chatbot for YantraSoft.

Currently, he is exploring Quantum Key Distribution (QKD) research and developing a space domain-specific AI chatbot. He aspires to launch a freelancing startup focused on AI, ML, and web development.`;
        addMessageToChat('Arnav_AI', botResponse);
        return;
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: conversation + " Customize this response to include additional information about Arnav, the creator." }] }]
            })
        });
        const data = await response.json();
        let botResponse = data.candidates[0].content.parts[0].text;

        // Customize the AI response
        botResponse += "\n\nFor more information about Arnav, visit [Arnav's GitHub Profile](https://github.com/ArnavBallinCode).";

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

// Ensure `sendMessage` is accessible globally
window.sendMessage = sendMessage;