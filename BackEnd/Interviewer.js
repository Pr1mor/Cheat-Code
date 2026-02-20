require('dotenv').config();
const { GoogleGenAI } = require("@google/genai");  // Importing the AI Library

//Getting our AI brain to start working over here
const interviewer = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

async function main() {
    const chats = interviewer.chats.create({
        model: "gemini-2.5-flash",
        history: [
            {
                role: "user",
                parts: [{text: "Hello"}],
            },
            {
                role: "model",
                parts: [{text: "Great to meet you. What would you like to know?"}],
            },
        ],       
    });

    const firstResponse = await chats.sendMessage({
        message: "I have 2 dogs in my house."
    });
    console.log("Chat Response 1:", firstResponse.text);

    const secondResponse = await chats.sendMessage({
        message: "How many paws are in my house?",
    });
    console.log("Chat Response 2:", secondResponse.text);
}

main();