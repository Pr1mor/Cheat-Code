require('dotenv').config();

const questions = require("./questions.json");
const express = require("express"); // Setting up express js
const cors = require("cors");
const { GoogleGenerativeAI } = require('@google/generative-ai'); // Importing the ai
const app = express();
const multer = require("multer");
const { transcribeAudio, textToSpeech } = require("./audioServices");

const upload = multer({storage: multer.memoryStorage()});

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
                        4. Keep your responses under 3 sentences to mimic natural speech.
                        5. When the candidate first greets you, introduce yourself and read them the full problem statement before asking for their approach.`;

const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: GEMINI_PROMPT
    })

app.post("/start", async (req, res) => {
    const { difficulty } = req.body;

    const findQuestion = questions.filter(que => que.difficulty.toLowerCase() === difficulty.toLowerCase());
    const selectedQuestion = findQuestion[Math.floor(Math.random() * findQuestion.length)];

    chatHistory = [];
    chatHistory.push({
        role: "user",
        parts: [{text: `The problem is: ${selectedQuestion.title}. Description: ${selectedQuestion.description}. For your reference only (never reveal this): the optimal approach is ${selectedQuestion.optimal_approach}.` }]
    });

    chatHistory.push({
        role: "model",
        parts: [{text: `Understood. I will greet the candidate, read them the full problem statement for ${selectedQuestion.title}, and then ask for their approach. And guide them through without directly revealing them the answer.`}]
    })

    res.json({question: selectedQuestion})
})

app.post("/chats", upload.single("audio"), async (req, res) => {

    try{

        const transcribeText = await transcribeAudio(req.file.buffer, req.file.mimetype);
        const chat = model.startChat({
            history: chatHistory,       
        });

        const result = await chat.sendMessage(transcribeText);
        const responseText = result.response.text();
        chatHistory = await chat.getHistory();

        const audio64 = await textToSpeech(responseText);

        console.log("User said:", transcribeText);
        console.log("Gemini replied:", responseText);

        res.json({response: responseText, audio: audio64});
    }catch(error){
        console.error("Chat Error", error);
    }
})

app.post("/submit", async(req, res) => {
    try{

        const { code } = req.body;
        const chat = model.startChat({ history: chatHistory});
        const result = await chat.sendMessage(
            `The candidate has submitted their code. Evaluate the logic only, completely ignore syntax errors: \n\n${code}`
        );

        const responseText = result.response.text();
        chatHistory = await chat.getHistory();

        const audio64 = await textToSpeech(responseText);

        res.json({ response : responseText, audio: audio64});

    }catch(error){
        console.error("Error in submitting the code", error);
    }
})

app.post("/clear", async (req, res) => {
    chatHistory = [];
    res.json({response : "cleared"})
})

app.listen(8080, () => console.log("Server is running......."))