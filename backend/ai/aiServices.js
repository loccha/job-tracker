import dotenv from "dotenv";
import { OpenAI } from "openai";

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

export async function autoFill(link){
    const prompt = `
    With this link : ${link},
    return a json with no text with this format as an example:

    {
        "title" : "job title"
        "company" : "desjardins"
        "shortDescription" : "Fullstack developper using SQL, React and Python"
    }

    the title's length must not be longer than 50 chars.

    the short description won't be longer than 8 words 
    and describes the overview of the job posting.
    

    The language for the field should always be in the language of the offer.
    Example: If the offer is in french, the field will be in french.

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
                        title: { type: "string" },
                        company: { type: "string" },
                        shortDescription: {type: "string"},
                    },
                    required:["title", "company", "shortDescription"],
                    additionalProperties: false
                }
            }
        }
    })
    return JSON.parse(response.output[0].content[0].text);
}