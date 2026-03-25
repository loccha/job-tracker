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
        "description" : "long text"
    }

    the title's length must not be longer than 50 chars.

    the short description shouldn't be longer than 8 words 
    and describes the overview of the job posting.

    the description is a copy/paste of the job description and requirement. Everything that
    is important for the candidate to be reminded needs to be in this field.
    the description should be well formatted with bullet points and sections, so it's easy to
    read for the user. Don't write "job description" at the top since the title of the field
    is already "job description".
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
                        description: {type: "string"}
                    },
                    required:["title", "company", "shortDescription", "description"],
                    additionalProperties: false
                }
            }
        }
    })
    return JSON.parse(response.output[0].content[0].text);
}