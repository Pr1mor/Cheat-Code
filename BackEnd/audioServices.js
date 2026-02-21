require("dotenv").config();
const fs = require("fs");
const { OpenAI } = require("openai");

// Initialize OpenAI for the Ear (Whisper)
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Task 2: The Ear
 * Takes a file path from Multer, sends it to Whisper, returns the text.
 */
async function transcribeAudio(fileBuffer, mimeType = "audio/webm") {
	try {
		console.log("Transcribing audio...");
		const transcription = await openai.audio.transcriptions.create({
			file: new File([fileBuffer], "audio.webm", {type:mimeType}),
			model: "whisper-1",
		});
		return transcription.text;
	} catch (error) {
		console.error("Whisper API Error:", error);
		throw error; // Throwing it allows Zeel's /chats endpoint to catch it
	}
}

/**
 * Task 3: The Mouth
 * Takes Gemini's text string, sends it to ElevenLabs, returns a Base64 Audio String.
 */
// async function textToSpeech(text) {
// 	try {
// 		console.log("Generating AI Voice...");

// 		// Ensure you have ELEVENLABS_VOICE_ID and ELEVENLABS_API_KEY in your .env
// 		const response = await fetch(
// 			`https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}?model_id=eleven_flash_v2_5`,
// 			{
// 				method: "POST",
// 				headers: {
// 					"xi-api-key": process.env.ELEVENLABS_API_KEY,
// 					"Content-Type": "application/json",
// 					Accept: "audio/mpeg",
// 				},
// 				body: JSON.stringify({
// 					text: text,
// 					voice_settings: {
// 						stability: 0.5,
// 						similarity_boost: 0.75,
// 					},
// 				}),
// 			},
// 		);

// 		if (!response.ok) {
// 			throw new Error(
// 				`ElevenLabs API crashed! Status: ${response.status}`,
// 			);
// 		}

// 		// Convert the audio stream into a buffer, then to a Base64 string for the frontend
// 		const arrayBuffer = await response.arrayBuffer();
// 		const buffer = Buffer.from(arrayBuffer);
// 		return buffer.toString("base64");
// 	} catch (error) {
// 		console.error("❌ ElevenLabs Error:", error);
// 		throw error;
// 	}
// }

// Export the functions so Zeel can import them into Interviewer.js
module.exports = { transcribeAudio };
