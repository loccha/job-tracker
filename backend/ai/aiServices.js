import dotenv from "dotenv";
import { OpenAI } from "openai";

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

export async function generateScore(description, cv_text){
    const prompt = `
    Return only valid JSON. No text.
    Exact response format (example):

    {"score": integer from 1 to 100}
    `

    const response = await openai.responses.create({
        model: "gpt-4.1-mini",
        input: prompt,
        text: {
            format: {
                type: "json_schema",
                name: "score_response",
                schema: {
                    type: "object",
                    properties: {
                        score: { type: "number" }
                    },
                    required:["score"],
                    additionalProperties: false
                }
            }
        }
    })

    return JSON.parse(response.output[0].content[0].text);
}