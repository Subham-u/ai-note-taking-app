// import { OpenAIApi, Configuration } from "openai-edge";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
// /api/completion
export async function POST(req: Request) {
  // extract the prompt from the body
  const { prompt } = await req.json();
  const GOOGLE_API_KEY = "AIzaSyCm7Rb4HKn6zq6iERcjxeoMKPLy2fD08Aw";
  const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

  const pass = `I am writing a piece of text in a notion text editor app.
  Help me complete my train of thought here: ${prompt} in short less than 50 words`;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const autocomplete = await model.generateContent(pass);
  return NextResponse.json({ data: autocomplete.response.text()}, { status: 201 });
}