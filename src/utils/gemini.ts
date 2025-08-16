import { extractText } from 'unpdf'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { FolioConfig } from '../types/folioConfigTypes.js'
import { configDotenv } from 'dotenv'

configDotenv()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string)
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' })

async function extractTextFromPDF (fileData: Uint8Array): Promise<string> {
  const { totalPages, text } = await extractText(fileData, { mergePages: true })
//   console.log('text: ', text)
//   console.log('totalPages: ', totalPages)
  return text
}

async function generateFolioConfig (resumeText: string): Promise<FolioConfig> {
  const prompt = `
You are given a resume text. Extract the details and return ONLY a valid JSON object matching this TypeScript structure:

{
  "personalInformation": {
    "name": "",
    "email": "",
    "bio": "",
    "about": "",
    "githubLink": "",
    "linkedinLink": "",
    "twitterLink": "",
    "resumeLink": ""
  },
  "skills": {
    "languages": [],
    "tools": [],
    "frameworks": []
  },
  "projects": [
    {
      "title": "",
      "description": "",
      "techStack": [],
      "image": "",
      "repoLink": "",
      "liveLink": ""
    }
  ],
  "workExperience": [
    {
      "role": "",
      "company": "",
      "techStack": [],
      "description": ""
    }
  ]
}

### Rules:
- Do NOT include explanations, comments, or code fences.
- "bio" = 1 short sentence summarizing the candidate professionally shortly like a one-liner.
- "about" = a short paragraph (2-3 sentences) summarizing the profile.
- Extract all other fields accurately from the resume text.
- Never leave out skills: include every language, framework, tool, and database mentioned anywhere in the resume text. If a skill doesn't fit neatly, put it in "tools".
- If any data is missing, leave the field as an empty string or empty array.

Resume:
${resumeText}
`

  const result = await model.generateContent(prompt)
  let jsonText = result.response.text()

  jsonText = jsonText
  .replace(/```json/gi, '')
  .replace(/```/g, '')
  .trim()
//   console.log('jsonText: ', jsonText);

  return JSON.parse(jsonText)
}

// Accepts Buffer now
export async function getFolioConfigJSON (data: Uint8Array) {
  const resumeText = await extractTextFromPDF(data)
  const folioConfig = await generateFolioConfig(resumeText)
  return folioConfig
}
