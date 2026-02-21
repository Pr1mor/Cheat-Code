require('dotenv').config();

const express = require("express"); // Setting up express js
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");  // Importing the AI Library
const app = express();

// Making sure that the express variable can parse json questions and be able to easily open up in the localhost
app.use(express.json());
app.use(cors(
    {
        origin: "https://localhost:3000"
    }
))

//Getting our AI brain to start working over here
const interviewer = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

//All of the chats will be stored over here
const currentHistory = {};

const GEMINI_PROMPT = `You are a strict senior FAANG software engineer conducting a technical mock interview. The candidate is solving a Data Structures and Algorithm Problem.
                        YOUR STRICT RULES:
                        1. NEVER give the candidate the raw code or direct answer under any circumstances.
                        2. Evaluate their logic and pseudocode. If they suggest a Brute Force approach, ask them to optimize it.
                        3. Constantly ask for the Time (Big O) and Space complexity of their proposed solution.
                        4. Keep your responses under 3 sentences to mimic natural speech.`;

app.post("/chats", async (req, res) => {
    const{PROMPT} = req.body;

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

})