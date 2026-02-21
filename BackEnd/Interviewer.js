require('dotenv').config();

const express = require("express"); // Setting up express js
const cors = require("cors");
const { GoogleGenerativeAI } = require('@google/generative-ai'); // Importing the ai
const app = express();

// Making sure that the express variable can parse json questions and be able to easily open up in the localhost
app.use(express.json());
app.use(cors(
    {
        origin: "http://localhost:3000"
    }
))

//Getting our AI brain to start working over here
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

//All of the chats will be stored over here
let chatHistory = [];

const GEMINI_PROMPT = `You are a strict senior FAANG software engineer conducting a technical mock interview. The candidate is solving a Data Structures and Algorithm Problem.
                        YOUR STRICT RULES:
                        1. NEVER give the candidate the raw code or direct answer under any circumstances.
                        2. Evaluate their logic and pseudocode. If they suggest a Brute Force approach, ask them to optimize it.
                        3. Constantly ask for the Time (Big O) and Space complexity of their proposed solution.
                        4. Keep your responses under 3 sentences to mimic natural speech.`;

const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: GEMINI_PROMPT
    })

app.post("/chats", async (req, res) => {
    const{prompt} = req.body;

    const chat = model.startChat({
        history: chatHistory,       
    });

    const result = await chat.sendMessage(prompt);
    const responseText = result.response.text();

    chatHistory.push(
        {
            role: "user",
            parts: [{ text: prompt}],
        }
    );

    chatHistory.push(
        {
            role: "model",
            parts: [{ text: responseText}],
        },
    );

    console.log("Current History Length: ", chatHistory.length);

    res.json({response: responseText});
})

app.post("/clear", async (req, res) => {
    chatHistory = [];
    res.json({response : "cleared"})
})

app.listen(8080, () => console.log("Server is running......."))