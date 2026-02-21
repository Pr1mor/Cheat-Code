require("dotenv").config();
const fs = require("fs");
const { OpenAI } = require("openai");

// Initialize the OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function testWhisper() {
	console.log("Starting Whisper test...");
	try {
		const transcription = await openai.audio.transcriptions.create({
			file: fs.createReadStream("test2.m4a"), // Make sure this matches your file name!
			model: "whisper-1",
		});

		console.log("✅ SUCCESS! Whisper heard:");
		console.log(`"${transcription.text}"`);
	} catch (error) {
		console.error("❌ FAILED! Here is the error:");
		console.error(error);
	}
}

testWhisper();
